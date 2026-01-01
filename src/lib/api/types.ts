// =============================================================================
// LOOPLAB API TYPE SYSTEM
// =============================================================================
// This type system serves as the shared vocabulary between the frontend and
// Rust (Axum) backend. All types are designed as contracts that describe intent,
// meaning, structure, and guarantees without coupling to specific implementations.
// =============================================================================

// -----------------------------------------------------------------------------
// CORE IDENTITY & TEMPORAL TYPES
// -----------------------------------------------------------------------------

/** Unique identifier for all entities - maps to UUID in Rust backend */
export type EntityId = string

/** ISO 8601 timestamp string - consistent across frontend/backend */
export type Timestamp = string

/** Slug for URL-safe identifiers */
export type Slug = string

// -----------------------------------------------------------------------------
// API RESPONSE CONTRACTS
// -----------------------------------------------------------------------------

/**
 * Standard API response wrapper
 * Guarantees consistent response structure regardless of endpoint
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: ResponseMeta
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
  meta?: ResponseMeta
}

/**
 * Error response structure
 * Maps to Rust's error handling patterns
 */
export interface ApiError {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: Record<string, string[]>
    traceId?: string
  }
}

export interface ResponseMeta {
  requestId: string
  timestamp: Timestamp
  version: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// -----------------------------------------------------------------------------
// ERROR TAXONOMY
// -----------------------------------------------------------------------------

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "BAD_REQUEST"

// -----------------------------------------------------------------------------
// AUTHENTICATION & AUTHORIZATION
// -----------------------------------------------------------------------------

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Timestamp
  tokenType: "Bearer"
}

export interface AuthSession {
  user: User
  tokens: AuthTokens
  createdAt: Timestamp
  lastActivityAt: Timestamp
}

export type AuthProvider = "github" | "google"

export interface AuthCredentials {
  provider: AuthProvider
  code: string
  redirectUri: string
}

// -----------------------------------------------------------------------------
// USER DOMAIN
// -----------------------------------------------------------------------------

export interface User {
  id: EntityId
  email: string
  username: Slug
  profile: UserProfile
  settings: UserSettings
  stats: UserStats
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserProfile {
  fullName: string
  avatarUrl: string | null
  bio: string | null
  tagline: string | null
  country: string | null
  languages: string[]
  links: UserLinks
}

export interface UserLinks {
  portfolio: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
}

export interface UserSettings {
  theme: ThemePreference
  notifications: NotificationSettings
  privacy: PrivacySettings
  tipsEnabled: boolean
}

export type ThemePreference = "light" | "dark" | "system"

export interface NotificationSettings {
  email: boolean
  push: boolean
  projectUpdates: boolean
  weeklyDigest: boolean
  streakReminders: boolean
}

export interface PrivacySettings {
  profilePublic: boolean
  showProjects: boolean
  showSkills: boolean
  showTimeline: boolean
  allowCVDownload: boolean
}

export interface UserStats {
  totalProjects: number
  completedProjects: number
  currentStreak: number
  longestStreak: number
  totalHours: number
  joinedAt: Timestamp
}

// -----------------------------------------------------------------------------
// ONBOARDING DOMAIN
// -----------------------------------------------------------------------------

export interface OnboardingState {
  isComplete: boolean
  currentStep: OnboardingStep
  data: OnboardingData
  completedAt: Timestamp | null
}

export type OnboardingStep = "basic_profile" | "tech_stacks" | "experience_goals" | "first_project" | "completed"

export interface OnboardingData {
  name: string
  username: string
  country: string
  bio: string
  avatar: string | null
  techStacks: TechStackId[]
  experienceLevel: ExperienceLevel | null
  goals: LearningGoal[]
  firstProjectId: EntityId | null
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced"

export type LearningGoal =
  | "get_first_job"
  | "switch_careers"
  | "level_up_skills"
  | "build_portfolio"
  | "learn_new_tech"
  | "side_projects"

// -----------------------------------------------------------------------------
// PROJECT DOMAIN
// -----------------------------------------------------------------------------

export interface Project {
  id: EntityId
  slug: Slug
  categoryId: EntityId
  categorySlug?: string
  name: string
  description: string
  narrative: string
  difficulty: DifficultyLevel
  estimatedTime: string
  techStack: TechStack[]
  coverImage: string
  targetSkill: string
  learningOutcome: string
  hasGitHubStarter: boolean
  includesBackend: boolean
  specification: ProjectSpecification
  fileStructure: FileNode[]
  validationContract: ValidationContract
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface ProjectSpecification {
  repoContents: string
  whatsMissing: string
  brokenAspects: string[]
}

export interface FileNode {
  name: string
  type: "file" | "folder"
  status: FileStatus
  intent?: string
  children?: FileNode[]
  content?: string
}

export type FileStatus = "present" | "missing" | "broken" | "needs-work"

export interface ValidationContract {
  description: string
  checks: ValidationCheck[]
}

export interface ValidationCheck {
  id: EntityId
  name: string
  description: string
  type: ValidationType
  isRequired: boolean
}

export type ValidationType =
  | "structure"
  | "integrity"
  | "components"
  | "browser"
  | "terminal"
  | "output"
  | "ai_feedback"

// -----------------------------------------------------------------------------
// USER PROJECT (Instance of a project for a user)
// -----------------------------------------------------------------------------

export interface UserProject {
  id: EntityId
  userId: EntityId
  projectId: EntityId
  project: Project
  status: UserProjectStatus
  progress: ProjectProgress
  workspace: WorkspaceState
  submissions: Submission[]
  linkedRepo: string | null
  startedAt: Timestamp
  completedAt: Timestamp | null
  lastActivityAt: Timestamp
}

export type UserProjectStatus =
  | "not_started"
  | "in_progress"
  | "ready_for_validation"
  | "validating"
  | "completed"
  | "abandoned"

export interface ProjectProgress {
  filesModified: number
  filesTotal: number
  percentage: number
  checklistItems: ChecklistItem[]
}

export interface ChecklistItem {
  id: EntityId
  label: string
  isComplete: boolean
  completedAt: Timestamp | null
}

// -----------------------------------------------------------------------------
// WORKSPACE DOMAIN
// -----------------------------------------------------------------------------

export interface WorkspaceState {
  files: WorkspaceFile[]
  openTabs: EditorTab[]
  activeTabPath: string | null
  terminalLogs: TerminalLine[]
  lastSavedAt: Timestamp
}

export interface WorkspaceFile {
  path: string
  name: string
  type: "file" | "folder"
  status: FileStatus
  content: string | null
  children?: WorkspaceFile[]
}

export interface EditorTab {
  path: string
  name: string
  content: string
  isDirty: boolean
  language: string
}

export interface TerminalLine {
  id: EntityId
  type: TerminalLineType
  content: string
  timestamp: Timestamp
}

export type TerminalLineType = "info" | "success" | "error" | "warning" | "input" | "output"

// -----------------------------------------------------------------------------
// SUBMISSION & VALIDATION DOMAIN
// -----------------------------------------------------------------------------

export interface Submission {
  id: EntityId
  userProjectId: EntityId
  status: SubmissionStatus
  validation: ValidationResult | null
  submittedAt: Timestamp
  completedAt: Timestamp | null
}

export type SubmissionStatus = "pending" | "running" | "passed" | "failed" | "error"

export interface ValidationResult {
  stages: ValidationStage[]
  insights: ValidationInsight[]
  overallStatus: "passed" | "failed"
  score: number
  feedback: string
}

export interface ValidationStage {
  id: EntityId
  name: string
  type: ValidationType
  status: ValidationStageStatus
  message: string | null
  duration: number | null
}

export type ValidationStageStatus = "pending" | "running" | "passed" | "failed"

export interface ValidationInsight {
  category: InsightCategory
  items: InsightItem[]
}

export type InsightCategory = "file_comments" | "runtime_behaviors" | "error_captures" | "suggested_improvements"

export interface InsightItem {
  label: string
  status: "pass" | "fail" | "info"
  file?: string
  lineNumber?: number
}

// -----------------------------------------------------------------------------
// SKILLS DOMAIN
// -----------------------------------------------------------------------------

export interface Skill {
  id: TechStackId
  name: string
  category: SkillCategory
  level: number // 0-100
  proficiency: ProficiencyLevel
  projectsCompleted: number
  lastUsedAt: Timestamp | null
}

export type TechStackId = string

export type SkillCategory = "language" | "frontend" | "backend" | "database" | "devops" | "tools"

export type ProficiencyLevel = "learning" | "comfortable" | "fluent" | "advanced"

export interface TechStack {
  id: TechStackId
  name: string
  icon: string
  category: SkillCategory
}

// -----------------------------------------------------------------------------
// ACTIVITY & ANALYTICS DOMAIN
// -----------------------------------------------------------------------------

export interface Activity {
  id: EntityId
  userId: EntityId
  type: ActivityType
  message: string
  metadata: Record<string, unknown>
  timestamp: Timestamp
}

export type ActivityType =
  | "project_started"
  | "project_completed"
  | "submission_passed"
  | "submission_failed"
  | "skill_leveled_up"
  | "streak_milestone"
  | "profile_updated"

export interface WeeklyActivityData {
  week: number
  year: number
  started: number
  completed: number
  submitted: number
}

export interface DailyActivityData {
  date: string // YYYY-MM-DD
  count: number
  level: 0 | 1 | 2 | 3 | 4 // Activity intensity
}

export interface PerformanceMetrics {
  avgCompletionTime: number
  successRate: number
  consistencyScore: number
  growthRate: number
}

// -----------------------------------------------------------------------------
// PROFILE & CV DOMAIN
// -----------------------------------------------------------------------------

export interface ProfileData {
  personalInfo: PersonalInfo
  summary: string
  skills: string[]
  loopLabSkills: string[]
  experiences: Experience[]
  education: Education[]
  projects: CompletedProject[]
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
}

export interface Experience {
  id: EntityId
  title: string
  company: string
  timeline: string
  description: string
}

export interface Education {
  id: EntityId
  school: string
  course: string
  year: string
}

export interface CompletedProject {
  id: EntityId
  title: string
  techStack: string[]
  summary: string
  completedAt: Timestamp
}

export interface CVGenerationRequest {
  format: "pdf" | "docx" | "json"
  sections: CVSection[]
  template: CVTemplate
}

export type CVSection = "personal_info" | "summary" | "skills" | "experience" | "education" | "projects"

export type CVTemplate = "minimal" | "professional" | "modern" | "developer"

// -----------------------------------------------------------------------------
// PUBLIC PROFILE DOMAIN
// -----------------------------------------------------------------------------

export interface PublicProfile {
  username: Slug
  fullName: string
  avatar: string | null
  tagline: string | null
  bio: string | null
  country: string | null
  languages: string[]
  yearsOfExperience: number | null
  preferredStack: string[]
  links: UserLinks
  privacy: PrivacySettings
  projects: PublicProject[]
  skills: Skill[]
  activityTimeline: PublicActivity[]
  joinedDate: Timestamp
}

export interface PublicProject {
  id: EntityId
  slug: Slug
  categoryId: EntityId
  categorySlug?: string
  title: string
  coverImage: string
  techStack: string[]
  description: string
  issuesFixed: string[]
}

export interface PublicActivity {
  id: EntityId
  type: PublicActivityType
  message: string
  date: string
}

export type PublicActivityType = "completed" | "shipped" | "deployed" | "started"

// -----------------------------------------------------------------------------
// NOTIFICATION DOMAIN
// -----------------------------------------------------------------------------

export interface Notification {
  id: EntityId
  userId: EntityId
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown>
  isRead: boolean
  createdAt: Timestamp
}

export type NotificationType =
  | "project_reminder"
  | "streak_warning"
  | "achievement_unlocked"
  | "validation_complete"
  | "system_announcement"

// -----------------------------------------------------------------------------
// GITHUB INTEGRATION DOMAIN
// -----------------------------------------------------------------------------

export interface GitHubConnection {
  isConnected: boolean
  username: string | null
  avatarUrl: string | null
  connectedAt: Timestamp | null
}

export interface GitHubRepo {
  id: string
  name: string
  fullName: string
  description: string | null
  url: string
  isPrivate: boolean
  defaultBranch: string
}

export interface GitHubLinkRequest {
  projectId: EntityId
  repoUrl: string
  branch?: string
}

// -----------------------------------------------------------------------------
// REQUEST PAYLOAD TYPES
// -----------------------------------------------------------------------------

export interface CreateUserRequest {
  email: string
  username: string
  profile: Partial<UserProfile>
}

export interface UpdateUserRequest {
  profile?: Partial<UserProfile>
  settings?: Partial<UserSettings>
}

export interface UpdateOnboardingRequest {
  step: OnboardingStep
  data: Partial<OnboardingData>
}

export interface StartProjectRequest {
  projectId: EntityId
  useGitHubStarter?: boolean
  linkedRepo?: string
}

export interface SaveWorkspaceRequest {
  userProjectId: EntityId
  files: WorkspaceFile[]
  openTabs: EditorTab[]
  activeTabPath: string | null
}

export interface SubmitProjectRequest {
  userProjectId: EntityId
  filesChanged: number
  commitMessage?: string
}

export interface UpdateProfileRequest {
  personalInfo?: Partial<PersonalInfo>
  summary?: string
  skills?: string[]
  experiences?: Experience[]
  education?: Education[]
}

// -----------------------------------------------------------------------------
// QUERY PARAMETER TYPES
// -----------------------------------------------------------------------------

export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface ProjectFilters extends PaginationParams {
  difficulty?: DifficultyLevel
  techStack?: TechStackId[]
  status?: UserProjectStatus
  search?: string
  sortBy?: "name" | "difficulty" | "created_at" | "popularity"
  sortOrder?: "asc" | "desc"
}

export interface ActivityFilters extends PaginationParams {
  startDate?: string
  endDate?: string
  type?: ActivityType[]
}

// -----------------------------------------------------------------------------
// REAL-TIME EVENT TYPES (for WebSocket communication)
// -----------------------------------------------------------------------------

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType
  payload: T
  timestamp: Timestamp
}

export type WebSocketEventType =
  | "validation_progress"
  | "validation_complete"
  | "workspace_sync"
  | "notification"
  | "streak_update"

export interface ValidationProgressEvent {
  submissionId: EntityId
  stage: ValidationStage
  progress: number
}

export interface WorkspaceSyncEvent {
  userProjectId: EntityId
  changes: WorkspaceFile[]
}

// -----------------------------------------------------------------------------
// CATEGORY DOMAIN (Phase 3 Multi-Domain Expansion)
// -----------------------------------------------------------------------------

export type LearningMode = 'ide' | 'notebook' | 'algorithm_visualizer' | 'query_builder' | 'live_preview';

export interface Category {
  id: EntityId
  name: string
  slug: Slug
  categoryId: EntityId
  categorySlug?: string
  description: string
  icon: string // Lucide icon name (e.g., 'code', 'calculator')
  color: string // Hex color code
  isActive: boolean
  learningMode: LearningMode
  modeConfig: Record<string, any>
  createdAt: Timestamp
  updatedAt: Timestamp
  pathCount?: number // Optional, included in with-counts endpoint
}

// -----------------------------------------------------------------------------
// SUBSCRIPTION DOMAIN (Phase 3 Freemium Model)
// -----------------------------------------------------------------------------

export type TierLevel = 'free' | 'pro' | 'premium'

export interface SubscriptionTier {
  id: EntityId
  name: TierLevel
  displayName: string // 'Explorer', 'Maker', 'Mastery'
  priceMonthly: string // BigDecimal as string
  priceYearly: string // BigDecimal as string
  features: Record<string, any>
  limits: Record<string, any>
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserSubscription {
  id: EntityId
  userId: EntityId
  tierId: EntityId
  status: SubscriptionStatus
  startedAt: Timestamp
  expiresAt: Timestamp | null
  canceledAt: Timestamp | null
  stripeSubscriptionId: string | null
  stripeCustomerId: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial'

export interface UserSubscriptionWithTier {
  subscription: UserSubscription
  tier: SubscriptionTier
}

// -----------------------------------------------------------------------------
// CATEGORY EXECUTION FLOWS
// -----------------------------------------------------------------------------

export interface CategoryExecutionFlow {
  categorySlug: string
  executionConfig: ExecutionConfig
  validationConfig: ValidationConfig
  tutorConfig: TutorConfig
}

export interface ExecutionConfig {
  supportedLanguages: string[]
  timeout: number
  memoryLimit: string
  enableNetworking?: boolean
  maxOutputLines?: number
}

export interface ValidationConfig {
  requiresTests: boolean
  minTestCoverage?: number
  checkSyntax?: boolean
  checkLinting?: boolean
  allowedImports?: string[]
  bannedPatterns?: string[]
}

export interface TutorConfig {
  avatar: string
  style: string
  maxSteps: number
  personality?: string
  codeExamplesEnabled?: boolean
}

// -----------------------------------------------------------------------------
// CATEGORY VALIDATION RESULTS
// -----------------------------------------------------------------------------

export interface CategoryValidationResult {
  id: EntityId
  userProjectId: EntityId
  categorySlug: string
  passed: boolean
  score: number
  criteriaResults: Record<string, boolean>
  insights: string[]
  createdAt: Timestamp
}

// -----------------------------------------------------------------------------
// AI TUTOR TYPES
// -----------------------------------------------------------------------------

export interface TutorSession {
  sessionId: EntityId
  userProjectId: EntityId
  categorySlug: string
  explanations: InlineExplanation[]
  currentIndex: number
  totalCount: number
  summary: TutoringSummary
  canRedo: boolean
}

export interface InlineExplanation {
  id: EntityId
  filePath: string
  lineStart: number
  lineEnd: number
  issueType: IssueType
  title: string
  explanation: string
  codeSnippet?: string
  suggestedFix?: string
  avatarPosition: AvatarPosition
  severity: IssueSeverity
  order: number
}

export type IssueType =
  | "error"
  | "warning"
  | "optimization"
  | "bestPractice"
  | "style"
  | "security"
  | "performance"

export type IssueSeverity = "critical" | "major" | "minor" | "info"

export type AvatarPosition = "left" | "right" | "top" | "bottom"

export interface TutoringSummary {
  totalIssues: number
  criticalCount: number
  majorCount: number
  minorCount: number
  keyLearnings: string[]
  recommendedResources: Resource[]
}

export interface Resource {
  title: string
  url: string
  resourceType: string
}

export interface StartTutorRequest {
  userProjectId: EntityId
  validationResult: any // ValidationResult from backend
}

export interface TutorSessionResponse {
  session: TutorSession
}
