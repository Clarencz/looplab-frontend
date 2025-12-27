// =============================================================================
// INTERCEPTOR TYPE DEFINITIONS
// =============================================================================

import type { ErrorCode } from "../api/types"

// -----------------------------------------------------------------------------
// REQUEST TYPES
// -----------------------------------------------------------------------------

export interface InterceptedRequest {
  id: string
  url: string
  method: HttpMethod
  headers: Headers
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
  timestamp: number
  retryCount: number
  metadata: RequestMetadata
}

export interface RequestMetadata {
  traceId: string
  spanId: string
  clientVersion: string
  locale: string
  timezone: string
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// -----------------------------------------------------------------------------
// RESPONSE TYPES
// -----------------------------------------------------------------------------

export interface InterceptedResponse<T = unknown> {
  requestId: string
  status: number
  statusText: string
  headers: Headers
  data: T
  timing: ResponseTiming
}

export interface ResponseTiming {
  startedAt: number
  completedAt: number
  duration: number
}

// -----------------------------------------------------------------------------
// ERROR TYPES
// -----------------------------------------------------------------------------

export interface InterceptorError {
  code: ErrorCode
  message: string
  details?: Record<string, string[]>
  traceId: string
  requestId: string
  isRetryable: boolean
  retryAfter?: number
}

// -----------------------------------------------------------------------------
// INTERCEPTOR INTERFACE
// -----------------------------------------------------------------------------

export interface RequestInterceptor {
  name: string
  priority: number
  onRequest: (request: InterceptedRequest) => Promise<InterceptedRequest> | InterceptedRequest
}

export interface ResponseInterceptor {
  name: string
  priority: number
  onResponse: <T>(response: InterceptedResponse<T>) => Promise<InterceptedResponse<T>> | InterceptedResponse<T>
  onError?: (error: InterceptorError) => Promise<InterceptorError> | InterceptorError
}

// -----------------------------------------------------------------------------
// EVENT TYPES
// -----------------------------------------------------------------------------

export type InterceptorEventType =
  | "request_start"
  | "request_retry"
  | "request_success"
  | "request_failure"
  | "auth_refresh_start"
  | "auth_refresh_success"
  | "auth_refresh_failure"
  | "circuit_open"
  | "circuit_close"

export interface InterceptorEvent {
  type: InterceptorEventType
  timestamp: number
  data: Record<string, unknown>
}

export type InterceptorEventHandler = (event: InterceptorEvent) => void

// -----------------------------------------------------------------------------
// POLICY TYPES
// -----------------------------------------------------------------------------

export interface RetryPolicy {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryableStatuses: number[]
  retryableErrors: ErrorCode[]
}

export interface CircuitBreakerPolicy {
  failureThreshold: number
  recoveryTimeout: number
  halfOpenRequests: number
}

export type CircuitState = "closed" | "open" | "half-open"
