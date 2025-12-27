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
export * from './execution-types';

// --- Domain API Exports ---
// Auth & Users
export { authApi, authInterceptor } from './auth';
export { usersApi } from './users';
export { onboardingApi } from './onboarding';

// Projects & Submissions
export { projectsApi, userProjectsApi, submissionsApi } from './projects';

// Learning
export * from './learningPaths';
export * from './categories';

// Execution & Validation
export * from './execution';
export * from './aiTutor';
export * from './validation';

// Profile & Social
export { profileApi, publicProfilesApi } from './profile';
export { githubApi } from './github';

// Activity & Skills
export { activityApi } from './activity';
export { skillsApi } from './skills';

// Notifications
export { notificationsApi } from './notifications';

// Payments
export * from './subscriptions';
export * from './payments';

// Admin
export * from './admin';
