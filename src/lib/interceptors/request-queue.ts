// =============================================================================
// REQUEST QUEUE
// =============================================================================
// Manages concurrent requests, deduplication, and serialization of specific
// operations like token refresh.
// =============================================================================

import type { InterceptedRequest } from "./types"
import { logger } from "./logger"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface QueuedRequest {
  request: InterceptedRequest
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  priority: number
}

interface PendingRequest {
  key: string
  promise: Promise<unknown>
  abortController: AbortController
}

// -----------------------------------------------------------------------------
// REQUEST QUEUE CLASS
// -----------------------------------------------------------------------------

class RequestQueue {
  private pendingRequests: Map<string, PendingRequest> = new Map()
  private queuedRequests: QueuedRequest[] = []
  private isPaused = false
  private maxConcurrent = 6

  /**
   * Generate a unique key for request deduplication
   */
  private getRequestKey(request: InterceptedRequest): string {
    // For GET requests, use method + URL + params
    if (request.method === "GET") {
      const params = request.params
        ? Object.entries(request.params)
            .filter(([, v]) => v !== undefined)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
        : ""
      return `${request.method}:${request.url}${params ? `?${params}` : ""}`
    }
    // For mutation requests, each one is unique
    return request.id
  }

  /**
   * Check if an identical request is already pending
   */
  isDuplicate(request: InterceptedRequest): boolean {
    const key = this.getRequestKey(request)
    return this.pendingRequests.has(key)
  }

  /**
   * Get the promise of a pending duplicate request
   */
  getDuplicatePromise(request: InterceptedRequest): Promise<unknown> | null {
    const key = this.getRequestKey(request)
    const pending = this.pendingRequests.get(key)
    return pending?.promise ?? null
  }

  /**
   * Track a new request
   */
  trackRequest(request: InterceptedRequest, promise: Promise<unknown>, abortController: AbortController): void {
    const key = this.getRequestKey(request)
    this.pendingRequests.set(key, {
      key,
      promise,
      abortController,
    })

    // Clean up when request completes
    promise.finally(() => {
      this.pendingRequests.delete(key)
    })
  }

  /**
   * Pause all outgoing requests (used during token refresh)
   */
  pause(): void {
    this.isPaused = true
    logger.info("Queue", "Request queue paused")
  }

  /**
   * Resume processing requests
   */
  resume(): void {
    this.isPaused = false
    logger.info("Queue", "Request queue resumed")
    this.processQueue()
  }

  /**
   * Check if queue is paused
   */
  get paused(): boolean {
    return this.isPaused
  }

  /**
   * Add request to queue (when paused)
   */
  enqueue<T>(request: InterceptedRequest, priority = 0): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queuedRequests.push({
        request,
        resolve: resolve as (value: unknown) => void,
        reject,
        priority,
      })

      // Sort by priority (higher first)
      this.queuedRequests.sort((a, b) => b.priority - a.priority)

      logger.debug("Queue", `Request queued: ${request.method} ${request.url}`, {
        queueLength: this.queuedRequests.length,
        priority,
      })
    })
  }

  /**
   * Process queued requests after resume
   */
  private processQueue(): void {
    while (this.queuedRequests.length > 0 && !this.isPaused) {
      const queued = this.queuedRequests.shift()
      if (queued) {
        // The actual request execution will be handled by the caller
        // We just signal that the request can proceed
        queued.resolve(queued.request)
      }
    }
  }

  /**
   * Get current queue stats
   */
  getStats(): { pending: number; queued: number; isPaused: boolean } {
    return {
      pending: this.pendingRequests.size,
      queued: this.queuedRequests.length,
      isPaused: this.isPaused,
    }
  }

  /**
   * Abort all pending requests
   */
  abortAll(reason = "Queue cleared"): void {
    for (const pending of this.pendingRequests.values()) {
      pending.abortController.abort(reason)
    }
    this.pendingRequests.clear()

    // Reject all queued requests
    for (const queued of this.queuedRequests) {
      queued.reject(new Error(reason))
    }
    this.queuedRequests = []

    logger.warn("Queue", "All requests aborted", { reason })
  }

  /**
   * Abort requests matching a pattern
   */
  abortMatching(pattern: RegExp, reason = "Request aborted"): void {
    for (const [key, pending] of this.pendingRequests.entries()) {
      if (pattern.test(key)) {
        pending.abortController.abort(reason)
        this.pendingRequests.delete(key)
      }
    }
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const requestQueue = new RequestQueue()
