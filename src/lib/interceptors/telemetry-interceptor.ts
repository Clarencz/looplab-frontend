// =============================================================================
// TELEMETRY INTERCEPTOR
// =============================================================================
// Collects and reports metrics about request performance, failures, and
// retry patterns for monitoring and optimization.
// =============================================================================

import type { InterceptedRequest, InterceptedResponse, InterceptorError, InterceptorEvent } from "./types"
import { getConfig } from "../config/env"
import { logger } from "./logger"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface RequestMetrics {
  requestId: string
  url: string
  method: string
  startedAt: number
  completedAt?: number
  duration?: number
  status?: number
  success: boolean
  retryCount: number
  errorCode?: string
}

interface AggregatedMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageDuration: number
  p95Duration: number
  retryRate: number
  errorsByCode: Record<string, number>
  requestsByEndpoint: Record<string, number>
}

// -----------------------------------------------------------------------------
// TELEMETRY INTERCEPTOR CLASS
// -----------------------------------------------------------------------------

class TelemetryInterceptor {
  private metrics: RequestMetrics[] = []
  private eventHandlers: Set<(event: InterceptorEvent) => void> = new Set()
  private flushInterval: number | null = null
  private maxMetricsBuffer = 100

  constructor() {
    // Start periodic flush if telemetry is enabled
    this.initializeFlush()
  }

  /**
   * Initialize periodic metrics flush
   */
  private initializeFlush(): void {
    const config = getConfig()

    if (config.telemetry.enabled && typeof window !== "undefined") {
      this.flushInterval = window.setInterval(() => {
        this.flush()
      }, 60000) // Flush every minute
    }
  }

  /**
   * Record request start
   */
  recordRequestStart(request: InterceptedRequest): void {
    const metric: RequestMetrics = {
      requestId: request.id,
      url: this.sanitizeUrl(request.url),
      method: request.method,
      startedAt: request.timestamp,
      success: false,
      retryCount: request.retryCount,
    }

    this.metrics.push(metric)
    this.emitEvent("request_start", { requestId: request.id, url: metric.url })

    // Trim buffer if needed
    if (this.metrics.length > this.maxMetricsBuffer) {
      this.metrics = this.metrics.slice(-this.maxMetricsBuffer)
    }
  }

  /**
   * Record request completion
   */
  recordRequestComplete<T>(request: InterceptedRequest, response: InterceptedResponse<T>): void {
    const metric = this.metrics.find((m) => m.requestId === request.id)

    if (metric) {
      metric.completedAt = response.timing.completedAt
      metric.duration = response.timing.duration
      metric.status = response.status
      metric.success = response.status >= 200 && response.status < 300
    }

    this.emitEvent("request_success", {
      requestId: request.id,
      duration: response.timing.duration,
      status: response.status,
    })
  }

  /**
   * Record request failure
   */
  recordRequestFailure(request: InterceptedRequest, error: InterceptorError): void {
    const metric = this.metrics.find((m) => m.requestId === request.id)

    if (metric) {
      metric.completedAt = Date.now()
      metric.duration = metric.completedAt - metric.startedAt
      metric.success = false
      metric.errorCode = error.code
    }

    this.emitEvent("request_failure", {
      requestId: request.id,
      errorCode: error.code,
      message: error.message,
    })
  }

  /**
   * Record retry attempt
   */
  recordRetry(request: InterceptedRequest, attempt: number): void {
    const metric = this.metrics.find((m) => m.requestId === request.id)

    if (metric) {
      metric.retryCount = attempt
    }

    this.emitEvent("request_retry", {
      requestId: request.id,
      attempt,
      url: this.sanitizeUrl(request.url),
    })
  }

  /**
   * Sanitize URL for metrics (remove sensitive params)
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin)
      // Remove sensitive query params
      const sensitiveParams = ["token", "key", "secret", "password", "auth"]
      sensitiveParams.forEach((param) => urlObj.searchParams.delete(param))
      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  /**
   * Get aggregated metrics
   */
  getAggregatedMetrics(): AggregatedMetrics {
    const completed = this.metrics.filter((m) => m.completedAt !== undefined)
    const successful = completed.filter((m) => m.success)
    const failed = completed.filter((m) => !m.success)
    const durations = completed.map((m) => m.duration ?? 0).sort((a, b) => a - b)
    const withRetries = completed.filter((m) => m.retryCount > 0)

    const errorsByCode: Record<string, number> = {}
    failed.forEach((m) => {
      if (m.errorCode) {
        errorsByCode[m.errorCode] = (errorsByCode[m.errorCode] || 0) + 1
      }
    })

    const requestsByEndpoint: Record<string, number> = {}
    completed.forEach((m) => {
      const endpoint = m.url.split("?")[0]
      requestsByEndpoint[endpoint] = (requestsByEndpoint[endpoint] || 0) + 1
    })

    return {
      totalRequests: completed.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      p95Duration: durations.length > 0 ? (durations[Math.floor(durations.length * 0.95)] ?? 0) : 0,
      retryRate: completed.length > 0 ? withRetries.length / completed.length : 0,
      errorsByCode,
      requestsByEndpoint,
    }
  }

  /**
   * Flush metrics to telemetry endpoint
   */
  async flush(): Promise<void> {
    const config = getConfig()

    if (!config.telemetry.enabled || this.metrics.length === 0) {
      return
    }

    // Sample based on configured rate
    if (Math.random() > config.telemetry.sampleRate) {
      this.metrics = []
      return
    }

    const aggregated = this.getAggregatedMetrics()

    try {
      await fetch(config.telemetry.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          clientVersion: config.version,
          metrics: aggregated,
        }),
      })

      logger.debug("Telemetry", "Metrics flushed", { count: this.metrics.length })
    } catch (err) {
      logger.warn("Telemetry", "Failed to flush metrics", {
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }

    // Clear buffer after flush
    this.metrics = []
  }

  /**
   * Register event handler
   */
  onEvent(handler: (event: InterceptorEvent) => void): () => void {
    this.eventHandlers.add(handler)
    return () => this.eventHandlers.delete(handler)
  }

  /**
   * Emit event to all handlers
   */
  private emitEvent(type: InterceptorEvent["type"], data: Record<string, unknown>): void {
    const event: InterceptorEvent = {
      type,
      timestamp: Date.now(),
      data,
    }

    this.eventHandlers.forEach((handler) => {
      try {
        handler(event)
      } catch (err) {
        logger.error("Telemetry", "Event handler error", {
          error: err instanceof Error ? err.message : "Unknown",
        })
      }
    })
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval)
    }
    this.eventHandlers.clear()
    this.metrics = []
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const telemetryInterceptor = new TelemetryInterceptor()
