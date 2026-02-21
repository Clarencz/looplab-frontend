// =============================================================================
// API CLIENT INDEX
// =============================================================================
// Central export point for all API modules. Import from '@/lib/api' to access
// any API function or type.
// =============================================================================

// --- Core Client ---
export { api, ApiClientError, apiClient, authInterceptor as TokenManager } from './client';

// --- Type Exports ---
export * from './types';

// --- Domain API Exports ---
// Auth & Users
export { authApi, authInterceptor } from './auth';
export { usersApi } from './users';

// Payments
export * from './subscriptions';
export * from './payments';

// Admin
export * from './admin';
