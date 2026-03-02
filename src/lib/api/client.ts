// =============================================================================
// MATHEMALAB API CLIENT
// =============================================================================
// Unified communication boundary between the frontend and Rust (Axum) backend.
// Enforces consistent request behavior, standardizes responses, ensures safe
// error handling, and maintains authentication seamlessly.
// =============================================================================

import type {
  ApiError,
  AuthSession,
  AuthTokens,
  User,
  ProfileData,
  PublicProfile,
  Notification,
  GitHubConnection,
  GitHubRepo,
  UserSettings,
  ErrorCode,
  ApiResponse,
  PaginatedResponse,
  WaitlistEntry,
  NewWaitlistEntry,
  AuthCredentials,
  UpdateUserRequest,
  UpdateProfileRequest,
  CVGenerationRequest,
} from "./types"

import { getConfig } from "../config/env"
import {
  authInterceptor,
  retryInterceptor,
  circuitBreaker,
  requestQueue,
  telemetryInterceptor,
  logger,
} from "../interceptors"
import type { InterceptedRequest, InterceptorError, InterceptedResponse } from "../interceptors"

// -----------------------------------------------------------------------------
// CONFIGURATION - Now uses environment config
// -----------------------------------------------------------------------------

const getApiConfig = () => getConfig().api

// -----------------------------------------------------------------------------
// ERROR HANDLING
// -----------------------------------------------------------------------------

export class ApiClientError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, string[]>,
    public traceId?: string,
  ) {
    super(message)
    this.name = "ApiClientError"
  }

  static fromApiError(error: ApiError): ApiClientError {
    return new ApiClientError(error.error.code, error.error.message, error.error.details, error.error.traceId)
  }

  static fromInterceptorError(error: InterceptorError): ApiClientError {
    return new ApiClientError(error.code, error.message, error.details, error.traceId)
  }
}

// -----------------------------------------------------------------------------
// REQUEST ID GENERATION
// -----------------------------------------------------------------------------

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`
}

function generateTraceId(): string {
  return `trace_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 11)}`
}

// -----------------------------------------------------------------------------
// REQUEST HELPERS - Enhanced with interceptors
// -----------------------------------------------------------------------------

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  skipAuth?: boolean
  skipRetry?: boolean
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const apiConfig = getApiConfig()
  const { params, timeout = apiConfig.timeout, skipAuth = false, skipRetry = false, ...init } = config

  // Build URL with query params
  let url = `${apiConfig.baseUrl}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const requestId = generateRequestId()
  const traceId = generateTraceId()

  const interceptedRequest: InterceptedRequest = {
    id: requestId,
    url,
    method: (init.method || "GET") as InterceptedRequest["method"],
    headers: new Headers(init.headers),
    body: init.body,
    params,
    timestamp: Date.now(),
    retryCount: 0,
    metadata: {
      traceId,
      spanId: requestId,
      clientVersion: getConfig().version,
      locale: navigator.language || "en-US",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  }

  if (!circuitBreaker.canRequest(url)) {
    const error: InterceptorError = {
      code: "SERVICE_UNAVAILABLE",
      message: "Service temporarily unavailable",
      traceId,
      requestId,
      isRetryable: false,
    }
    telemetryInterceptor.recordRequestFailure(interceptedRequest, error)
    throw ApiClientError.fromInterceptorError(error)
  }

  if (interceptedRequest.method === "GET" && requestQueue.isDuplicate(interceptedRequest)) {
    const duplicatePromise = requestQueue.getDuplicatePromise(interceptedRequest)
    if (duplicatePromise) {
      logger.debug("Request", `Deduplicating ${interceptedRequest.method} ${url}`)
      return duplicatePromise as Promise<T>
    }
  }

  if (requestQueue.paused && !endpoint.includes("/auth/refresh")) {
    logger.debug("Request", `Queuing request during auth refresh: ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Build headers with metadata
  const headers = interceptedRequest.headers
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json")
  }

  headers.set("X-Request-ID", requestId)
  headers.set("X-Trace-ID", traceId)
  headers.set("X-Client-Version", getConfig().version)

  if (!skipAuth) {
    authInterceptor.attachAuthHeaders(interceptedRequest)
    // Copy auth header to our headers
    const authHeader = interceptedRequest.headers.get("Authorization")
    if (authHeader) {
      headers.set("Authorization", authHeader)
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  telemetryInterceptor.recordRequestStart(interceptedRequest)

  const performFetch = async (): Promise<T> => {
    const startTime = Date.now()

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const completedAt = Date.now()

      // Parse response
      const data = await response.json()

      const interceptedResponse: InterceptedResponse<unknown> = {
        requestId,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data,
        timing: {
          startedAt: startTime,
          completedAt,
          duration: completedAt - startTime,
        },
      }

      // Handle error responses
      if (!response.ok) {
        const apiError = data as ApiError

        const interceptorError: InterceptorError = {
          code: apiError.error?.code || "INTERNAL_ERROR",
          message: apiError.error?.message || "Request failed",
          details: apiError.error?.details,
          traceId,
          requestId,
          isRetryable: retryInterceptor.isRetryable(
            { code: apiError.error?.code || "INTERNAL_ERROR" } as InterceptorError,
            response.status,
          ),
          retryAfter: response.headers.get("Retry-After")
            ? Number.parseInt(response.headers.get("Retry-After")!, 10)
            : undefined,
        }

        if (response.status === 401 && !skipAuth && !endpoint.includes("/auth/")) {
          const refreshed = await authInterceptor.handleAuthError(interceptorError)
          if (refreshed) {
            // Retry the request with new token
            interceptedRequest.retryCount++
            return performFetch()
          }
        }

        telemetryInterceptor.recordRequestFailure(interceptedRequest, interceptorError)
        circuitBreaker.recordFailure(url)
        throw ApiClientError.fromInterceptorError(interceptorError)
      }

      telemetryInterceptor.recordRequestComplete(interceptedRequest, interceptedResponse)
      circuitBreaker.recordSuccess(url)
      logger.logResponse(interceptedResponse)

      return data as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiClientError) {
        throw error
      }

      if (error instanceof Error) {
        const interceptorError: InterceptorError = {
          code: error.name === "AbortError" ? "SERVICE_UNAVAILABLE" : "INTERNAL_ERROR",
          message: error.name === "AbortError" ? "Request timed out" : error.message,
          traceId,
          requestId,
          isRetryable: error.name === "AbortError",
        }

        telemetryInterceptor.recordRequestFailure(interceptedRequest, interceptorError)
        circuitBreaker.recordFailure(url)
        throw ApiClientError.fromInterceptorError(interceptorError)
      }

      throw new ApiClientError("INTERNAL_ERROR", "An unexpected error occurred", undefined, traceId)
    }
  }

  if (skipRetry) {
    return performFetch()
  }

  return retryInterceptor.executeWithRetry(url, performFetch, (attempt, delay) => {
    interceptedRequest.retryCount = attempt
    telemetryInterceptor.recordRetry(interceptedRequest, attempt)
    logger.logRetry(interceptedRequest, attempt, getApiConfig().retryAttempts, delay)
  })
}

// Convenience methods
const get =
  <T>(endpoint: string, params?: RequestConfig["params"], options?: Omit<RequestConfig, "params" | "method">) =>
    request<T>(endpoint, { method: "GET", params, ...options })

const post = <T>(endpoint: string, body?: unknown, options?: Omit<RequestConfig, "body" | "method">) =>
  request<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })

const put = <T>(endpoint: string, body?: unknown, options?: Omit<RequestConfig, "body" | "method">) =>
  request<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })

const patch = <T>(endpoint: string, body?: unknown, options?: Omit<RequestConfig, "body" | "method">) =>
  request<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })

const del = <T>(endpoint: string, options?: Omit<RequestConfig, "method">) =>
  request<T>(endpoint, { method: "DELETE", ...options })

// Export raw client for custom modules like payments.ts
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  request,
}

// -----------------------------------------------------------------------------
// API CLIENT NAMESPACE
// -----------------------------------------------------------------------------

export const api = {
  // ---------------------------------------------------------------------------
  // AUTHENTICATION
  // ---------------------------------------------------------------------------
  auth: {
    /**
     * Authenticate with OAuth provider
     */
    login: async (credentials: AuthCredentials): Promise<AuthSession> => {
      const response = await post<ApiResponse<AuthSession>>(
        "/auth/login",
        credentials,
        { skipAuth: true, skipRetry: true }
      )
      authInterceptor.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken,
        response.data.tokens.expiresAt
      )
      return response.data
    },

    /**
     * Refresh access token using refresh token
     */
    refresh: async (): Promise<AuthTokens> => {
      const refreshToken = authInterceptor.getRefreshToken()
      if (!refreshToken) {
        throw new ApiClientError("UNAUTHORIZED", "No refresh token available")
      }

      const response = await post<ApiResponse<AuthTokens>>(
        "/auth/refresh",
        { refreshToken },
        { skipAuth: true, skipRetry: true }
      )
      authInterceptor.setTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresAt
      )
      return response.data
    },

    /**
     * Logout and clear tokens
     */
    logout: async (): Promise<void> => {
      try {
        await post("/auth/logout", undefined, { skipRetry: true })
      } finally {
        authInterceptor.clearTokens()
      }
    },

    /**
     * Get current session
     */
    getSession: async (): Promise<AuthSession | null> => {
      const token = authInterceptor.getAccessToken()
      if (!token) return null

      try {
        const response = await get<ApiResponse<AuthSession>>("/auth/session")
        return response.data
      } catch {
        authInterceptor.clearTokens()
        return null
      }
    },
  },

  // ---------------------------------------------------------------------------
  // USER MANAGEMENT
  // ---------------------------------------------------------------------------
  users: {
    /**
     * Get current user
     */
    me: () => get<ApiResponse<User>>("/users/me").then((r) => r.data),

    /**
     * Update current user
     */
    update: (data: UpdateUserRequest) =>
      patch<ApiResponse<User>>("/users/me", data).then((r) => r.data),

    /**
     * Update user settings
     */
    updateSettings: (settings: Partial<UserSettings>) =>
      patch<ApiResponse<UserSettings>>("/users/me/settings", settings).then(
        (r) => r.data
      ),

    /**
     * Delete account
     */
    delete: () => del<ApiResponse<void>>("/users/me"),

    /**
     * Upload avatar
     */
    uploadAvatar: async (file: File): Promise<string> => {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await request<ApiResponse<{ url: string }>>(
        "/users/me/avatar",
        {
          method: "POST",
          body: formData,
          headers: {}, // Let browser set content-type for FormData
        }
      )
      return response.data.url
    },
  },

  // ---------------------------------------------------------------------------
  // PROFILE & CV
  // ---------------------------------------------------------------------------
  profile: {
    /**
     * Get profile data
     */
    get: () => get<ApiResponse<ProfileData>>("/profile").then((r) => r.data),

    /**
     * Update profile
     */
    update: (data: UpdateProfileRequest) =>
      patch<ApiResponse<ProfileData>>("/profile", data).then((r) => r.data),

    /**
     * Generate CV
     */
    generateCV: (options: CVGenerationRequest) =>
      post<ApiResponse<{ downloadUrl: string }>>("/profile/cv", options).then(
        (r) => r.data
      ),

    /**
     * Get profile completion percentage
     */
    completion: () =>
      get<ApiResponse<{ percentage: number; missing: string[] }>>(
        "/profile/completion"
      ).then((r) => r.data),
  },

  // ---------------------------------------------------------------------------
  // PUBLIC PROFILES
  // ---------------------------------------------------------------------------
  publicProfiles: {
    /**
     * Get public profile by username
     */
    get: (username: string) =>
      get<ApiResponse<PublicProfile>>(`/u/${username}`, undefined, { skipAuth: true }).then((r) => r.data),

    /**
     * Get public project details
     */
    getProject: (username: string, projectSlug: string) =>
      get<ApiResponse<PublicProfile["projects"][0]>>(
        `/u/${username}/projects/${projectSlug}`,
        undefined,
        { skipAuth: true }
      ).then((r) => r.data),
  },

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS
  // ---------------------------------------------------------------------------
  notifications: {
    /**
     * List notifications
     */
    list: () =>
      get<PaginatedResponse<Notification>>("/notifications"),

    /**
     * Mark as read
     */
    markRead: (id: EntityId) =>
      patch<ApiResponse<Notification>>(`/notifications/${id}/read`).then(
        (r) => r.data
      ),

    /**
     * Mark all as read
     */
    markAllRead: () => post<ApiResponse<void>>("/notifications/read-all"),

    /**
     * Get unread count
     */
    unreadCount: () =>
      get<ApiResponse<{ count: number }>>("/notifications/unread-count").then(
        (r) => r.data.count
      ),
  },

  // ---------------------------------------------------------------------------
  // GITHUB INTEGRATION
  // ---------------------------------------------------------------------------
  github: {
    /**
     * Get connection status
     */
    getConnection: () =>
      get<ApiResponse<GitHubConnection>>("/github/connection").then(
        (r) => r.data
      ),

    /**
     * Connect GitHub account
     */
    connect: (code: string) =>
      post<ApiResponse<GitHubConnection>>("/github/connect", { code }).then(
        (r) => r.data
      ),

    /**
     * Disconnect GitHub account
     */
    disconnect: () => del<ApiResponse<void>>("/github/disconnect"),

    /**
     * List user's repositories
     */
    listRepos: () =>
      get<ApiResponse<GitHubRepo[]>>("/github/repos").then((r) => r.data),
  },

  // ---------------------------------------------------------------------------
  // WAITLIST
  // ---------------------------------------------------------------------------
  waitlist: {
    /**
     * Join the waitlist
     */
    join: (data: NewWaitlistEntry) =>
      post<ApiResponse<WaitlistEntry>>("/waitlist/join", data, { skipAuth: true }).then((r) => r.data),
  },
}

// -----------------------------------------------------------------------------
// EXPORT AUTH INTERCEPTOR FOR EXTERNAL USE
// -----------------------------------------------------------------------------
export { authInterceptor }
