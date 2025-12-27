// =============================================================================
// RETRY INTERCEPTOR
// =============================================================================
// Implements automatic retry logic with exponential backoff for transient
// failures. Respects circuit breaker state and retry-after headers.
// =============================================================================

import type { RetryPolicy, InterceptorError } from "./types"
import { logger } from "./logger"
import { circuitBreaker } from "./circuit-breaker"

// -----------------------------------------------------------------------------
// DEFAULT RETRY POLICY
// -----------------------------------------------------------------------------

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ["SERVICE_UNAVAILABLE", "RATE_LIMITED", "INTERNAL_ERROR"],
}

// -----------------------------------------------------------------------------
// RETRY INTERCEPTOR CLASS
// -----------------------------------------------------------------------------

class RetryInterceptor {
  private policy: RetryPolicy

  constructor(policy: Partial<RetryPolicy> = {}) {
    this.policy = { ...DEFAULT_RETRY_POLICY, ...policy }
  }

  /**
   * Check if an error is retryable
   */
  isRetryable(error: InterceptorError, status?: number): boolean {
    // Check error code
    if (this.policy.retryableErrors.includes(error.code)) {
      return true
    }

    // Check HTTP status
    if (status && this.policy.retryableStatuses.includes(status)) {
      return true
    }

    return false
  }

  /**
   * Calculate delay for next retry attempt
   */
  getRetryDelay(attempt: number, retryAfter?: number): number {
    // If server specifies retry-after, use that
    if (retryAfter && retryAfter > 0) {
      return Math.min(retryAfter * 1000, this.policy.maxDelay)
    }

    // Calculate exponential backoff with jitter
    const exponentialDelay = this.policy.baseDelay * Math.pow(this.policy.backoffMultiplier, attempt - 1)
    const jitter = Math.random() * 0.3 * exponentialDelay // Add up to 30% jitter
    const delay = exponentialDelay + jitter

    return Math.min(delay, this.policy.maxDelay)
  }

  /**
   * Check if we should retry
   */
  shouldRetry(url: string, attempt: number, error: InterceptorError, status?: number): boolean {
    // Check attempt limit
    if (attempt >= this.policy.maxAttempts) {
      logger.debug("Retry", `Max attempts (${this.policy.maxAttempts}) reached for ${url}`)
      return false
    }

    // Check circuit breaker
    if (!circuitBreaker.canRequest(url)) {
      logger.debug("Retry", `Circuit open for ${url}, not retrying`)
      return false
    }

    // Check if error is retryable
    if (!this.isRetryable(error, status)) {
      logger.debug("Retry", `Error not retryable: ${error.code}`)
      return false
    }

    return true
  }

  /**
   * Wait for retry delay
   */
  async wait(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  /**
   * Execute with retry logic
   */
  async executeWithRetry<T>(
    url: string,
    operation: () => Promise<T>,
    onRetry?: (attempt: number, delay: number) => void,
  ): Promise<T> {
    let lastError: InterceptorError | null = null
    let lastStatus: number | undefined

    for (let attempt = 1; attempt <= this.policy.maxAttempts; attempt++) {
      // Check circuit breaker before attempting
      if (!circuitBreaker.canRequest(url)) {
        throw {
          code: "SERVICE_UNAVAILABLE",
          message: "Service temporarily unavailable (circuit open)",
          isRetryable: false,
          traceId: "",
          requestId: "",
        } as InterceptorError
      }

      try {
        const result = await operation()
        circuitBreaker.recordSuccess(url)
        return result
      } catch (err) {
        const error = err as InterceptorError & { status?: number }
        lastError = error
        lastStatus = error.status

        circuitBreaker.recordFailure(url)

        // Check if we should retry
        if (!this.shouldRetry(url, attempt, error, lastStatus)) {
          throw error
        }

        // Calculate delay
        const delay = this.getRetryDelay(attempt, error.retryAfter)

        logger.logRetry(
          { url, method: "UNKNOWN", id: "", retryCount: attempt } as never,
          attempt,
          this.policy.maxAttempts,
          delay,
        )

        // Notify caller of retry
        onRetry?.(attempt, delay)

        // Wait before retrying
        await this.wait(delay)
      }
    }

    // All retries exhausted
    throw (
      lastError ?? {
        code: "INTERNAL_ERROR",
        message: "Max retries exceeded",
        isRetryable: false,
        traceId: "",
        requestId: "",
      }
    )
  }

  /**
   * Get current policy
   */
  getPolicy(): RetryPolicy {
    return { ...this.policy }
  }

  /**
   * Update policy at runtime
   */
  updatePolicy(updates: Partial<RetryPolicy>): void {
    this.policy = { ...this.policy, ...updates }
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const retryInterceptor = new RetryInterceptor()
