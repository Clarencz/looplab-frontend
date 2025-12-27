// =============================================================================
// CIRCUIT BREAKER
// =============================================================================
// Prevents cascading failures by tracking endpoint health and temporarily
// blocking requests to failing endpoints.
// =============================================================================

import type { CircuitBreakerPolicy, CircuitState } from "./types"
import { logger } from "./logger"

// -----------------------------------------------------------------------------
// DEFAULT POLICY
// -----------------------------------------------------------------------------

const DEFAULT_POLICY: CircuitBreakerPolicy = {
  failureThreshold: 5,
  recoveryTimeout: 30000, // 30 seconds
  halfOpenRequests: 3,
}

// -----------------------------------------------------------------------------
// CIRCUIT STATE
// -----------------------------------------------------------------------------

interface CircuitStats {
  state: CircuitState
  failures: number
  successes: number
  lastFailureAt: number
  openedAt: number
  halfOpenAttempts: number
}

// -----------------------------------------------------------------------------
// CIRCUIT BREAKER CLASS
// -----------------------------------------------------------------------------

class CircuitBreaker {
  private circuits: Map<string, CircuitStats> = new Map()
  private policy: CircuitBreakerPolicy

  constructor(policy: Partial<CircuitBreakerPolicy> = {}) {
    this.policy = { ...DEFAULT_POLICY, ...policy }
  }

  /**
   * Get or create circuit for an endpoint
   */
  private getCircuit(endpoint: string): CircuitStats {
    if (!this.circuits.has(endpoint)) {
      this.circuits.set(endpoint, {
        state: "closed",
        failures: 0,
        successes: 0,
        lastFailureAt: 0,
        openedAt: 0,
        halfOpenAttempts: 0,
      })
    }
    return this.circuits.get(endpoint)!
  }

  /**
   * Extract endpoint identifier from URL
   */
  private getEndpointKey(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin)
      // Use pathname as the circuit key (e.g., /api/v1/users)
      const segments = urlObj.pathname.split("/").slice(0, 4)
      return segments.join("/")
    } catch {
      return url
    }
  }

  /**
   * Check if request should be allowed
   */
  canRequest(url: string): boolean {
    const key = this.getEndpointKey(url)
    const circuit = this.getCircuit(key)

    switch (circuit.state) {
      case "closed":
        return true

      case "open": {
        // Check if recovery timeout has passed
        const timeSinceOpen = Date.now() - circuit.openedAt
        if (timeSinceOpen >= this.policy.recoveryTimeout) {
          // Transition to half-open
          circuit.state = "half-open"
          circuit.halfOpenAttempts = 0
          logger.logCircuitState(key, "half-open", "Recovery timeout elapsed")
          return true
        }
        return false
      }

      case "half-open":
        // Allow limited requests in half-open state
        return circuit.halfOpenAttempts < this.policy.halfOpenRequests
    }
  }

  /**
   * Record successful request
   */
  recordSuccess(url: string): void {
    const key = this.getEndpointKey(url)
    const circuit = this.getCircuit(key)

    circuit.successes++

    if (circuit.state === "half-open") {
      circuit.halfOpenAttempts++

      // If we've had enough successful half-open requests, close the circuit
      if (circuit.halfOpenAttempts >= this.policy.halfOpenRequests) {
        circuit.state = "closed"
        circuit.failures = 0
        circuit.successes = 0
        circuit.halfOpenAttempts = 0
        logger.logCircuitState(key, "closed", "Recovered after successful half-open requests")
      }
    } else if (circuit.state === "closed") {
      // Reset failure count on success
      circuit.failures = 0
    }
  }

  /**
   * Record failed request
   */
  recordFailure(url: string): void {
    const key = this.getEndpointKey(url)
    const circuit = this.getCircuit(key)

    circuit.failures++
    circuit.lastFailureAt = Date.now()

    if (circuit.state === "half-open") {
      // Any failure in half-open state reopens the circuit
      circuit.state = "open"
      circuit.openedAt = Date.now()
      circuit.halfOpenAttempts = 0
      logger.logCircuitState(key, "open", "Failed during half-open state")
    } else if (circuit.state === "closed") {
      // Check if we've exceeded the failure threshold
      if (circuit.failures >= this.policy.failureThreshold) {
        circuit.state = "open"
        circuit.openedAt = Date.now()
        logger.logCircuitState(
          key,
          "open",
          `Exceeded failure threshold (${circuit.failures}/${this.policy.failureThreshold})`,
        )
      }
    }
  }

  /**
   * Get circuit state for an endpoint
   */
  getState(url: string): CircuitState {
    const key = this.getEndpointKey(url)
    return this.getCircuit(key).state
  }

  /**
   * Get all circuit stats (for debugging/monitoring)
   */
  getAllStats(): Map<string, CircuitStats> {
    return new Map(this.circuits)
  }

  /**
   * Reset a specific circuit
   */
  reset(url: string): void {
    const key = this.getEndpointKey(url)
    this.circuits.delete(key)
    logger.logCircuitState(key, "closed", "Manual reset")
  }

  /**
   * Reset all circuits
   */
  resetAll(): void {
    this.circuits.clear()
    logger.info("Circuit", "All circuits reset")
  }
}

// -----------------------------------------------------------------------------
// SINGLETON EXPORT
// -----------------------------------------------------------------------------

export const circuitBreaker = new CircuitBreaker()
