// Validation API Client
// Connects to category-specific validation backend services

// Types for validation API (prefixed to avoid conflicts with global types)
export interface ApiValidationStage {
  id: string
  name: string
  stageType: string
  status: 'passed' | 'failed' | 'pending'
  message?: string
  duration?: number
}

export interface ApiValidationInsight {
  type: 'improvement' | 'error' | 'warning' | 'success'
  category: string
  items: ApiInsightItem[]
}

export interface ApiInsightItem {
  title: string
  description: string
  lineNumber?: number
  codeSnippet?: string
  suggestion?: string
  severity?: 'error' | 'warning' | 'info'
}

export interface ApiValidationResult {
  id: string
  userProjectId: string
  overallStatus: 'passed' | 'failed' | 'pending'
  totalScore: number
  stages: ApiValidationStage[]
  insights: ApiValidationInsight[]
  submittedAt: string
  completedAt?: string
}


export interface ValidateProjectRequest {
  userProjectId: string
  categorySlug: string
  files: { path: string; content: string }[]
  entryPoint: string
  language: string
}

const API_BASE = '/api/v1'

async function fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const accessToken = localStorage.getItem('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Request failed')
  }

  return data.data || data
}

/**
 * Submit project for validation
 * Routes to category-specific validator on backend
 */
export async function validateProject(
  request: ValidateProjectRequest
): Promise<ApiValidationResult> {
  return fetchWithAuth<ApiValidationResult>('/validation/submit', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/**
 * Get validation result by ID
 */
export async function getValidationResult(validationId: string): Promise<ApiValidationResult> {
  return fetchWithAuth<ApiValidationResult>(`/validation/${validationId}`)
}

/**
 * Get validation history for a user project
 */
export async function getProjectValidations(
  userProjectId: string
): Promise<ApiValidationResult[]> {
  return fetchWithAuth<ApiValidationResult[]>(
    `/user-projects/${userProjectId}/validations`
  )
}

/**
 * Get latest validation for a user project
 */
export async function getLatestValidation(
  userProjectId: string
): Promise<ApiValidationResult | null> {
  return fetchWithAuth<ApiValidationResult | null>(
    `/user-projects/${userProjectId}/validations/latest`
  )
}


/**
 * Get validation criteria for a category
 */
export async function getCategoryValidationCriteria(
  categorySlug: string
): Promise<string[]> {
  return fetchWithAuth<string[]>(`/validation/criteria/${categorySlug}`)
}
