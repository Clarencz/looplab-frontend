// =============================================================================
// INTERCEPTOR LOGGER
// =============================================================================
// Centralized logging for interceptor events with structured output
// =============================================================================

import { getConfig } from "../config/env"
import type { LogLevel } from "../config/env"
import type { InterceptorEvent, InterceptorError, InterceptedRequest, InterceptedResponse } from "./types"

// -----------------------------------------------------------------------------
// LOG LEVELS
// -----------------------------------------------------------------------------

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

// -----------------------------------------------------------------------------
// LOGGER CLASS
// -----------------------------------------------------------------------------

class InterceptorLogger {
  private get logLevel(): LogLevel {
    return getConfig().debug.logLevel
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.logLevel]
  }

  private formatMessage(level: LogLevel, context: string, message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`
  }

  debug(context: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog("debug")) return
    console.debug(this.formatMessage("debug", context, message), data ?? "")
  }

  info(context: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog("info")) return
    console.info(this.formatMessage("info", context, message), data ?? "")
  }

  warn(context: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog("warn")) return
    console.warn(this.formatMessage("warn", context, message), data ?? "")
  }

  error(context: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog("error")) return
    console.error(this.formatMessage("error", context, message), data ?? "")
  }

  // Structured logging for specific events

  logRequest(request: InterceptedRequest): void {
    this.debug("Request", `${request.method} ${request.url}`, {
      id: request.id,
      traceId: request.metadata.traceId,
      retryCount: request.retryCount,
    })
  }

  logResponse<T>(response: InterceptedResponse<T>): void {
    const level = response.status >= 400 ? "warn" : "debug"
    this[level]("Response", `${response.status} ${response.statusText}`, {
      requestId: response.requestId,
      duration: `${response.timing.duration}ms`,
    })
  }

  logError(error: InterceptorError): void {
    this.error("Error", `${error.code}: ${error.message}`, {
      traceId: error.traceId,
      requestId: error.requestId,
      isRetryable: error.isRetryable,
      details: error.details,
    })
  }

  logEvent(event: InterceptorEvent): void {
    const level = event.type.includes("failure") ? "warn" : "info"
    this[level]("Event", event.type, event.data)
  }

  logRetry(request: InterceptedRequest, attempt: number, maxAttempts: number, delay: number): void {
    this.warn("Retry", `Attempt ${attempt}/${maxAttempts} for ${request.method} ${request.url}`, {
      delay: `${delay}ms`,
      requestId: request.id,
    })
  }

  logCircuitState(endpoint: string, state: string, reason?: string): void {
    const level = state === "open" ? "warn" : "info"
    this[level]("Circuit", `${endpoint} circuit ${state}`, { reason })
  }

  logAuthRefresh(status: "start" | "success" | "failure", error?: string): void {
    const level = status === "failure" ? "error" : "info"
    this[level]("Auth", `Token refresh ${status}`, error ? { error } : undefined)
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const logger = new InterceptorLogger()
