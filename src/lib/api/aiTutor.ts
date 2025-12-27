// AI Tutoring API Client
// Connects to category-specific AI tutor backend services

import { getConfig } from '../config/env'

// Types matching backend InlineExplanation and TutoringSession
export interface InlineExplanation {
    id: string
    filePath: string
    lineStart: number
    lineEnd: number
    issueType: 'error' | 'warning' | 'optimization' | 'bestPractice' | 'style' | 'security' | 'performance'
    title: string
    explanation: string
    codeSnippet?: string
    suggestedFix?: string
    avatarPosition: 'left' | 'right' | 'top' | 'bottom'
    severity: 'critical' | 'major' | 'minor' | 'info'
    order: number
}

export interface TutoringSummary {
    totalIssues: number
    criticalCount: number
    majorCount: number
    minorCount: number
    keyLearnings: string[]
    recommendedResources: { title: string; url: string; resourceType: string }[]
}

export interface TutoringSession {
    sessionId: string
    userProjectId: string
    categorySlug: string
    explanations: InlineExplanation[]
    currentIndex: number
    totalCount: number
    summary: TutoringSummary
    canRedo: boolean
}

export interface TutoringStyle {
    avatarName: string
    avatarEmoji: string
    tone: string
    focusAreas: string[]
}

export interface CreateTutoringSessionRequest {
    userProjectId: string
    categorySlug: string
    files: { path: string; content: string }[]
    validationResult?: {
        passed: boolean
        score: number
        stages: { name: string; status: string; message?: string }[]
    }
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
 * Create a new AI tutoring session for a user project
 * Routes to category-specific AI tutor on backend
 */
export async function createTutoringSession(
    request: CreateTutoringSessionRequest
): Promise<TutoringSession> {
    return fetchWithAuth<TutoringSession>('/ai-tutor/sessions', {
        method: 'POST',
        body: JSON.stringify(request),
    })
}

/**
 * Get existing tutoring session
 */
export async function getTutoringSession(sessionId: string): Promise<TutoringSession> {
    return fetchWithAuth<TutoringSession>(`/ai-tutor/sessions/${sessionId}`)
}

/**
 * Get tutoring style for a category
 */
export async function getTutoringStyle(categorySlug: string): Promise<TutoringStyle> {
    return fetchWithAuth<TutoringStyle>(`/ai-tutor/style/${categorySlug}`)
}

/**
 * Mark tutoring session as complete
 */
export async function completeTutoringSession(sessionId: string): Promise<void> {
    return fetchWithAuth<void>(`/ai-tutor/sessions/${sessionId}/complete`, {
        method: 'POST',
    })
}

/**
 * Get tutoring sessions for a user project
 */
export async function getProjectTutoringSessions(
    userProjectId: string
): Promise<TutoringSession[]> {
    return fetchWithAuth<TutoringSession[]>(
        `/user-projects/${userProjectId}/tutoring-sessions`
    )
}
