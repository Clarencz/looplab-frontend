// =============================================================================
// MATHEMALAB ENVIRONMENT CONFIGURATION
// =============================================================================
// Single authoritative runtime configuration system. Provides type-safe access
// to environment-specific settings, feature flags, and service endpoints.
// Consumed at app startup and remains read-only throughout the session.
// =============================================================================

// -----------------------------------------------------------------------------
// ENVIRONMENT TYPES
// -----------------------------------------------------------------------------

export type Environment = "development" | "staging" | "production"

export interface EnvironmentConfig {
  // Core environment info
  readonly env: Environment
  readonly version: string
  readonly buildId: string

  // API configuration
  readonly api: ApiConfig

  // Feature flags
  readonly features: FeatureFlags

  // Service endpoints
  readonly services: ServiceEndpoints

  // Debug configuration
  readonly debug: DebugConfig

  // Analytics & telemetry
  readonly telemetry: TelemetryConfig
}

export interface ApiConfig {
  readonly baseUrl: string
  readonly version: string
  readonly timeout: number
  readonly retryAttempts: number
  readonly retryDelay: number
}

export interface FeatureFlags {
  readonly enableSandboxPreview: boolean
  readonly enableBetaFeatures: boolean
  readonly enableAIFeedback: boolean
  readonly enableGitHubIntegration: boolean
  readonly enableRealTimeSync: boolean
  readonly enableOfflineMode: boolean
  readonly enableAdvancedValidation: boolean
  readonly maintenanceMode: boolean
}

export interface ServiceEndpoints {
  readonly validation: string
  readonly websocket: string
  readonly analytics: string
  readonly cdn: string
}

export interface DebugConfig {
  readonly enabled: boolean
  readonly logLevel: LogLevel
  readonly showDevTools: boolean
  readonly mockAuth: boolean
  readonly networkDelay: number // Artificial delay for testing (ms)
}

export interface TelemetryConfig {
  readonly enabled: boolean
  readonly endpoint: string
  readonly sampleRate: number // 0-1
  readonly includeErrors: boolean
  readonly includeTiming: boolean
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent"

// -----------------------------------------------------------------------------
// DEFAULT CONFIGURATIONS
// -----------------------------------------------------------------------------

const DEFAULT_CONFIG: EnvironmentConfig = {
  env: "development",
  version: "0.1.0",
  buildId: "local",

  api: {
    baseUrl: "/api/v1",
    version: "v1",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  features: {
    enableSandboxPreview: true,
    enableBetaFeatures: true,
    enableAIFeedback: true,
    enableGitHubIntegration: true,
    enableRealTimeSync: true,
    enableOfflineMode: false,
    enableAdvancedValidation: true,
    maintenanceMode: false,
  },

  services: {
    validation: "/api/validation",
    websocket: "ws://localhost:8080/ws",
    analytics: "/api/analytics",
    cdn: "",
  },

  debug: {
    enabled: true,
    logLevel: "debug",
    showDevTools: true,
    mockAuth: true,
    networkDelay: 0,
  },

  telemetry: {
    enabled: false,
    endpoint: "",
    sampleRate: 0,
    includeErrors: true,
    includeTiming: false,
  },
}

// -----------------------------------------------------------------------------
// ENVIRONMENT-SPECIFIC OVERRIDES
// -----------------------------------------------------------------------------

const _VITE_API_URL = import.meta.env.VITE_API_URL

const STAGING_OVERRIDES: Partial<EnvironmentConfig> = {
  env: "staging",

  api: {
    baseUrl: _VITE_API_URL || "https://staging-api.mathemalab.io/api/v1",
    version: "v1",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  features: {
    enableSandboxPreview: true,
    enableBetaFeatures: true,
    enableAIFeedback: true,
    enableGitHubIntegration: true,
    enableRealTimeSync: true,
    enableOfflineMode: false,
    enableAdvancedValidation: true,
    maintenanceMode: false,
  },

  services: {
    validation: `${_VITE_API_URL || "https://staging-api.mathemalab.io/api"}/validation`,
    websocket: _VITE_API_URL
      ? _VITE_API_URL.replace(/^https/, "wss").replace(/\/api\/v1$/, "/ws")
      : "wss://staging-api.mathemalab.io/ws",
    analytics: `${_VITE_API_URL || "https://staging-api.mathemalab.io/api"}/analytics`,
    cdn: "https://staging-cdn.mathemalab.io",
  },

  debug: {
    enabled: true,
    logLevel: "info",
    showDevTools: true,
    mockAuth: false,
    networkDelay: 0,
  },

  telemetry: {
    enabled: true,
    endpoint: "https://staging-telemetry.mathemalab.io",
    sampleRate: 1.0,
    includeErrors: true,
    includeTiming: true,
  },
}

const PRODUCTION_OVERRIDES: Partial<EnvironmentConfig> = {
  env: "production",

  api: {
    baseUrl: _VITE_API_URL || "https://api.mathemalab.io/api/v1",
    version: "v1",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  features: {
    enableSandboxPreview: false,
    enableBetaFeatures: false,
    enableAIFeedback: true,
    enableGitHubIntegration: true,
    enableRealTimeSync: true,
    enableOfflineMode: true,
    enableAdvancedValidation: true,
    maintenanceMode: false,
  },

  services: {
    validation: `${_VITE_API_URL || "https://api.mathemalab.io/api"}/validation`,
    websocket: _VITE_API_URL
      ? _VITE_API_URL.replace(/^https/, "wss").replace(/\/api\/v1$/, "/ws")
      : "wss://api.mathemalab.io/ws",
    analytics: `${_VITE_API_URL || "https://api.mathemalab.io/api"}/analytics`,
    cdn: "https://cdn.mathemalab.io",
  },

  debug: {
    enabled: false,
    logLevel: "error",
    showDevTools: false,
    mockAuth: false,
    networkDelay: 0,
  },

  telemetry: {
    enabled: true,
    endpoint: "https://telemetry.mathemalab.io",
    sampleRate: 0.1,
    includeErrors: true,
    includeTiming: true,
  },
}

// -----------------------------------------------------------------------------
// CONFIGURATION BUILDER
// -----------------------------------------------------------------------------

function detectEnvironment(): Environment {
  const envVar = import.meta.env.VITE_APP_ENV || import.meta.env.MODE

  if (envVar === "production" || envVar === "prod") return "production"
  if (envVar === "staging" || envVar === "stage") return "staging"
  return "development"
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base }

  for (const key in override) {
    if (Object.prototype.hasOwnProperty.call(override, key)) {
      const baseValue = base[key]
      const overrideValue = override[key]

      if (
        typeof baseValue === "object" &&
        baseValue !== null &&
        typeof overrideValue === "object" &&
        overrideValue !== null &&
        !Array.isArray(baseValue)
      ) {
        result[key] = deepMerge(
          baseValue as Record<string, unknown>,
          overrideValue as Record<string, unknown>,
        ) as T[Extract<keyof T, string>]
      } else if (overrideValue !== undefined) {
        result[key] = overrideValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

function buildConfig(): EnvironmentConfig {
  const env = detectEnvironment()

  // Start with defaults
  let config = { ...DEFAULT_CONFIG }

  // Apply environment-specific overrides
  if (env === "staging") {
    config = deepMerge(config, STAGING_OVERRIDES)
  } else if (env === "production") {
    config = deepMerge(config, PRODUCTION_OVERRIDES)
  }

  // Apply runtime environment variable overrides
  const runtimeOverrides: Partial<EnvironmentConfig> = {
    version: import.meta.env.VITE_APP_VERSION || config.version,
    buildId: import.meta.env.VITE_BUILD_ID || config.buildId,
  }

  // API URL override
  if (import.meta.env.VITE_API_URL) {
    runtimeOverrides.api = {
      ...config.api,
      baseUrl: import.meta.env.VITE_API_URL,
    }
  }

  // WebSocket URL override
  if (import.meta.env.VITE_WS_URL) {
    runtimeOverrides.services = {
      ...config.services,
      websocket: import.meta.env.VITE_WS_URL,
    }
  }

  // Feature flag overrides (comma-separated list of enabled features)
  const featureOverrides = import.meta.env.VITE_FEATURE_FLAGS
  if (featureOverrides) {
    const enabledFeatures = featureOverrides.split(",").map((f: string) => f.trim())
    const features = { ...config.features }

    for (const feature of enabledFeatures) {
      const [key, value] = feature.split("=")
      if (key in features) {
        ; (features as Record<string, boolean>)[key] = value !== "false"
      }
    }

    runtimeOverrides.features = features
  }

  // Debug mode override
  if (import.meta.env.VITE_DEBUG === "true") {
    runtimeOverrides.debug = {
      ...config.debug,
      enabled: true,
      showDevTools: true,
    }
  }

  // Mock auth override
  if (import.meta.env.VITE_MOCK_AUTH !== undefined) {
    runtimeOverrides.debug = {
      ...config.debug,
      mockAuth: import.meta.env.VITE_MOCK_AUTH === "true",
    }
  }

  config = deepMerge(config, runtimeOverrides)

  return Object.freeze(config) as EnvironmentConfig
}

// -----------------------------------------------------------------------------
// SINGLETON CONFIG INSTANCE
// -----------------------------------------------------------------------------

let configInstance: EnvironmentConfig | null = null

export function getConfig(): EnvironmentConfig {
  if (!configInstance) {
    configInstance = buildConfig()
  }
  return configInstance
}

// -----------------------------------------------------------------------------
// DEVELOPER OVERRIDES (ephemeral, for debugging)
// -----------------------------------------------------------------------------

interface DevOverrides {
  apiUrl?: string
  features?: Partial<FeatureFlags>
  debug?: Partial<DebugConfig>
}

const DEV_OVERRIDES_KEY = "__mathemalab_dev_overrides__"

export function setDevOverrides(overrides: DevOverrides): void {
  if (getConfig().env === "production") {
    console.warn("[Config] Developer overrides are disabled in production")
    return
  }

  sessionStorage.setItem(DEV_OVERRIDES_KEY, JSON.stringify(overrides))
  // Force config rebuild on next access
  configInstance = null
}

export function clearDevOverrides(): void {
  sessionStorage.removeItem(DEV_OVERRIDES_KEY)
  configInstance = null
}

export function getDevOverrides(): DevOverrides | null {
  const stored = sessionStorage.getItem(DEV_OVERRIDES_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

// -----------------------------------------------------------------------------
// CONVENIENCE EXPORTS
// -----------------------------------------------------------------------------

export const config = getConfig()

export const isProduction = () => getConfig().env === "production"
export const isStaging = () => getConfig().env === "staging"
export const isDevelopment = () => getConfig().env === "development"

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => getConfig().features[feature]

export const getApiUrl = (path = ""): string => `${getConfig().api.baseUrl}${path}`

export const getWsUrl = (): string => getConfig().services.websocket
