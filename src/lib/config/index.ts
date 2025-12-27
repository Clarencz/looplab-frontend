// =============================================================================
// CONFIGURATION PUBLIC EXPORTS
// =============================================================================

export {
  config,
  getConfig,
  isProduction,
  isStaging,
  isDevelopment,
  isFeatureEnabled,
  getApiUrl,
  getWsUrl,
  setDevOverrides,
  clearDevOverrides,
  getDevOverrides,
} from "./env"

export type {
  Environment,
  EnvironmentConfig,
  ApiConfig,
  FeatureFlags,
  ServiceEndpoints,
  DebugConfig,
  TelemetryConfig,
  LogLevel,
} from "./env"
