// =============================================================================
// AUTHENTICATION INTERCEPTOR
// =============================================================================
// Handles token attachment, refresh flows, and auth failure routing.
// Serializes refresh operations to prevent race conditions.
// =============================================================================

import type { InterceptedRequest, InterceptorError } from "./types"
import { logger } from "./logger"
import { requestQueue } from "./request-queue"
import { getConfig } from "../config/env"

// -----------------------------------------------------------------------------
// TOKEN STORAGE
// -----------------------------------------------------------------------------

const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  EXPIRY: "expires_at",
} as const

// -----------------------------------------------------------------------------
// AUTH INTERCEPTOR CLASS
// -----------------------------------------------------------------------------

class AuthInterceptor {
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null
  private onAuthFailure: (() => void) | null = null

  /**
   * Set callback for auth failure (redirect to login)
   */
  setAuthFailureHandler(handler: () => void): void {
    this.onAuthFailure = handler
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ACCESS)
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH)
  }

  /**
   * Store tokens
   */
  setTokens(accessToken: string, refreshToken: string, expiresAt: string): void {
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken)
    localStorage.setItem(TOKEN_KEYS.EXPIRY, expiresAt)
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEYS.ACCESS)
    localStorage.removeItem(TOKEN_KEYS.REFRESH)
    localStorage.removeItem(TOKEN_KEYS.EXPIRY)
  }

  /**
   * Check if access token is expired or about to expire
   */
  isTokenExpired(bufferMs = 60000): boolean {
    const expiry = localStorage.getItem(TOKEN_KEYS.EXPIRY)
    if (!expiry) return true

    const expiryTime = new Date(expiry).getTime()
    const now = Date.now()

    return expiryTime - now <= bufferMs
  }

  /**
   * Check if request requires authentication
   */
  requiresAuth(request: InterceptedRequest): boolean {
    // Public endpoints that don't require auth
    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/u/", // Public profiles
      "/projects", // Public project catalog (GET only)
    ]

    const url = request.url
    return !publicPaths.some((path) => url.includes(path))
  }

  /**
   * Attach auth headers to request
   */
  attachAuthHeaders(request: InterceptedRequest): InterceptedRequest {
    const token = this.getAccessToken()

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`)
    }

    return request
  }

  /**
   * Handle auth error and attempt refresh
   */
  async handleAuthError(error: InterceptorError): Promise<boolean> {
    if (error.code !== "UNAUTHORIZED") {
      return false
    }

    // If already refreshing, wait for that to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.triggerAuthFailure()
      return false
    }

    // Start refresh flow
    this.isRefreshing = true
    requestQueue.pause()
    logger.logAuthRefresh("start")

    this.refreshPromise = this.performRefresh(refreshToken)

    const success = await this.refreshPromise

    this.isRefreshing = false
    this.refreshPromise = null
    requestQueue.resume()

    if (!success) {
      this.triggerAuthFailure()
    }

    return success
  }

  /**
   * Perform the actual token refresh
   */
  private async performRefresh(refreshToken: string): Promise<boolean> {
    try {
      const config = getConfig()
      const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        logger.logAuthRefresh("failure", `HTTP ${response.status}`)
        return false
      }

      const data = await response.json()

      if (data.success && data.data) {
        const { accessToken, refreshToken: newRefreshToken, expiresAt } = data.data
        this.setTokens(accessToken, newRefreshToken, expiresAt)
        logger.logAuthRefresh("success")
        return true
      }

      logger.logAuthRefresh("failure", "Invalid response format")
      return false
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      logger.logAuthRefresh("failure", message)
      return false
    }
  }

  /**
   * Trigger auth failure (redirect to login)
   */
  private triggerAuthFailure(): void {
    this.clearTokens()

    if (this.onAuthFailure) {
      this.onAuthFailure()
    } else {
      // Default behavior: redirect to login
      window.location.href = "/auth"
    }
  }

  /**
   * Check if we're currently refreshing
   */
  get refreshing(): boolean {
    return this.isRefreshing
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const authInterceptor = new AuthInterceptor()
