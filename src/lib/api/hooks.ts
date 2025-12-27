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
// ONBOARDING HOOKS
// -----------------------------------------------------------------------------

export function useOnboardingState(config?: SWRConfiguration<OnboardingState>) {
  return useSWR("onboarding", () => api.onboarding.get(), {
    ...defaultConfig,
    ...config,
  })
}

export function useUpdateOnboarding() {
  return useSWRMutation("onboarding", (_, { arg }: { arg: UpdateOnboardingRequest }) => api.onboarding.update(arg))
}

export function useCompleteOnboarding() {
  return useSWRMutation("onboarding", () => api.onboarding.complete())
}

export function useResetOnboarding() {
  return useSWRMutation("onboarding", () => api.onboarding.reset())
}

// -----------------------------------------------------------------------------
// PROJECT HOOKS
// -----------------------------------------------------------------------------

export function useProjects(filters?: ProjectFilters, config?: SWRConfiguration<PaginatedResponse<Project>>) {
  const key = filters ? ["projects", filters] : "projects"
  return useSWR(key, () => api.projects.list(filters), {
    ...defaultConfig,
    ...config,
  })
}

export function useProject(idOrSlug: string | undefined, config?: SWRConfiguration<Project>) {
  return useSWR(idOrSlug ? ["project", idOrSlug] : null, () => api.projects.get(idOrSlug!), {
    ...defaultConfig,
    ...config,
  })
}

// -----------------------------------------------------------------------------
// USER PROJECT HOOKS
// -----------------------------------------------------------------------------

export function useUserProjects(filters?: ProjectFilters, config?: SWRConfiguration<PaginatedResponse<UserProject>>) {
  const key = filters ? ["user-projects", filters] : "user-projects"
  return useSWR(key, () => api.userProjects.list(filters), {
    ...defaultConfig,
    ...config,
  })
}

export function useUserProject(id: EntityId | undefined, config?: SWRConfiguration<UserProject>) {
  return useSWR(id ? ["user-project", id] : null, () => api.userProjects.get(id!), { ...defaultConfig, ...config })
}

export function useStartProject() {
  return useSWRMutation("user-projects", (_, { arg }: { arg: StartProjectRequest }) => api.userProjects.start(arg))
}

export function useSaveWorkspace() {
  return useSWRMutation("user-projects", (_, { arg }: { arg: SaveWorkspaceRequest }) =>
    api.userProjects.saveWorkspace(arg),
  )
}

export function useSubmitProject() {
  return useSWRMutation("user-projects", (_, { arg }: { arg: SubmitProjectRequest }) => api.userProjects.submit(arg))
}

// -----------------------------------------------------------------------------
// SUBMISSION HOOKS
// -----------------------------------------------------------------------------

export function useSubmission(id: EntityId | undefined, config?: SWRConfiguration<Submission>) {
  return useSWR(id ? ["submission", id] : null, () => api.submissions.get(id!), {
    ...defaultConfig,
    // Poll during validation
    refreshInterval: (data) => (data?.status === "running" ? 2000 : 0),
    ...config,
  })
}

export function useProjectSubmissions(
  userProjectId: EntityId | undefined,
  config?: SWRConfiguration<PaginatedResponse<Submission>>,
) {
  return useSWR(
    userProjectId ? ["submissions", userProjectId] : null,
    () => api.submissions.listForProject(userProjectId!),
    { ...defaultConfig, ...config },
  )
}

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
