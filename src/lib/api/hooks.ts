// =============================================================================
// LOOPLAB API HOOKS
// =============================================================================
// React hooks for consuming the API layer with SWR for data fetching,
// caching, and state synchronization between components.
// =============================================================================

import useSWR, { type SWRConfiguration } from "swr"
import useSWRMutation from "swr/mutation"
import { api, ApiClientError } from "./client"
import type {
  User,
  UpdateUserRequest,
  OnboardingState,
  UpdateOnboardingRequest,
  Project,
  UserProject,
  ProjectFilters,
  StartProjectRequest,
  SaveWorkspaceRequest,
  SubmitProjectRequest,
  Submission,
  Skill,
  Activity,
  ActivityFilters,
  WeeklyActivityData,
  DailyActivityData,
  PerformanceMetrics,
  ProfileData,
  UpdateProfileRequest,
  CVGenerationRequest,
  PublicProfile,
  Notification,
  GitHubConnection,
  GitHubRepo,
  UserSettings,
  EntityId,
  PaginatedResponse,
} from "./types"

// -----------------------------------------------------------------------------
// SWR CONFIGURATION
// -----------------------------------------------------------------------------

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  shouldRetryOnError: (error) => {
    if (error instanceof ApiClientError) {
      // Don't retry on auth errors or validation errors
      return !["UNAUTHORIZED", "FORBIDDEN", "VALIDATION_ERROR"].includes(error.code)
    }
    return true
  },
}

// -----------------------------------------------------------------------------
// USER HOOKS
// -----------------------------------------------------------------------------

export function useCurrentUser(config?: SWRConfiguration<User>) {
  return useSWR("user:me", () => api.users.me(), {
    ...defaultConfig,
    ...config,
  })
}

export function useUpdateUser() {
  return useSWRMutation("user:me", (_, { arg }: { arg: UpdateUserRequest }) => api.users.update(arg))
}

export function useUpdateUserSettings() {
  return useSWRMutation("user:me", (_, { arg }: { arg: Partial<UserSettings> }) => api.users.updateSettings(arg))
}

// -----------------------------------------------------------------------------
// SKILLS HOOKS
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// SKILLS HOOKS
// -----------------------------------------------------------------------------

export function useSkills(config?: SWRConfiguration<Skill[]>) {
  return useSWR("skills", () => api.skills.list(), {
    ...defaultConfig,
    ...config,
  })
}

export function useTechStacks(config?: SWRConfiguration<Skill[]>) {
  return useSWR("tech-stacks", () => api.skills.getTechStacks(), {
    ...defaultConfig,
    revalidateOnMount: true,
    ...config,
  })
}

// -----------------------------------------------------------------------------
// ACTIVITY HOOKS
// -----------------------------------------------------------------------------

export function useActivityFeed(filters?: ActivityFilters, config?: SWRConfiguration<PaginatedResponse<Activity>>) {
  const key = filters ? ["activity", filters] : "activity"
  return useSWR(key, () => api.activity.list(filters), {
    ...defaultConfig,
    ...config,
  })
}

export function useWeeklyActivity(year?: number, config?: SWRConfiguration<WeeklyActivityData[]>) {
  return useSWR(["activity:weekly", year], () => api.activity.weekly(year), { ...defaultConfig, ...config })
}

export function useActivityHeatmap(year?: number, config?: SWRConfiguration<DailyActivityData[]>) {
  return useSWR(["activity:heatmap", year], () => api.activity.heatmap(year), { ...defaultConfig, ...config })
}

export function usePerformanceMetrics(config?: SWRConfiguration<PerformanceMetrics>) {
  return useSWR("activity:performance", () => api.activity.performance(), {
    ...defaultConfig,
    ...config,
  })
}

// -----------------------------------------------------------------------------
// PROFILE HOOKS
// -----------------------------------------------------------------------------

export function useProfile(config?: SWRConfiguration<ProfileData>) {
  return useSWR("profile", () => api.profile.get(), {
    ...defaultConfig,
    ...config,
  })
}

export function useUpdateProfile() {
  return useSWRMutation("profile", (_, { arg }: { arg: UpdateProfileRequest }) => api.profile.update(arg))
}

export function useGenerateCV() {
  return useSWRMutation("profile:cv", (_, { arg }: { arg: CVGenerationRequest }) => api.profile.generateCV(arg))
}

export function useProfileCompletion(config?: SWRConfiguration<{ percentage: number; missing: string[] }>) {
  return useSWR("profile:completion", () => api.profile.completion(), {
    ...defaultConfig,
    ...config,
  })
}

// -----------------------------------------------------------------------------
// PUBLIC PROFILE HOOKS
// -----------------------------------------------------------------------------

export function usePublicProfile(username: string | undefined, config?: SWRConfiguration<PublicProfile>) {
  return useSWR(username ? ["public-profile", username] : null, () => api.publicProfiles.get(username!), {
    ...defaultConfig,
    ...config,
  })
}

// -----------------------------------------------------------------------------
// NOTIFICATION HOOKS
// -----------------------------------------------------------------------------

export function useNotifications(config?: SWRConfiguration<PaginatedResponse<Notification>>) {
  return useSWR("notifications", () => api.notifications.list(), {
    ...defaultConfig,
    refreshInterval: 60000, // Poll every minute
    ...config,
  })
}

export function useUnreadNotificationCount(config?: SWRConfiguration<number>) {
  return useSWR("notifications:unread", () => api.notifications.unreadCount(), {
    ...defaultConfig,
    refreshInterval: 30000,
    ...config,
  })
}

export function useMarkNotificationRead() {
  return useSWRMutation("notifications", (_, { arg }: { arg: EntityId }) => api.notifications.markRead(arg))
}

export function useMarkAllNotificationsRead() {
  return useSWRMutation("notifications", () => api.notifications.markAllRead())
}

// -----------------------------------------------------------------------------
// GITHUB HOOKS
// -----------------------------------------------------------------------------

export function useGitHubConnection(config?: SWRConfiguration<GitHubConnection>) {
  return useSWR("github:connection", () => api.github.getConnection(), {
    ...defaultConfig,
    ...config,
  })
}

export function useGitHubRepos(config?: SWRConfiguration<GitHubRepo[]>) {
  const { data: connection } = useGitHubConnection()

  return useSWR(connection?.isConnected ? "github:repos" : null, () => api.github.listRepos(), {
    ...defaultConfig,
    ...config,
  })
}

export function useConnectGitHub() {
  return useSWRMutation("github:connection", (_, { arg }: { arg: string }) => api.github.connect(arg))
}

export function useDisconnectGitHub() {
  return useSWRMutation("github:connection", () => api.github.disconnect())
}
