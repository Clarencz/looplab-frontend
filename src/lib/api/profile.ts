// =============================================================================
// PROFILE API
// =============================================================================
// User profile, public profiles, and CV generation

import { apiClient } from './client'
import type { ProfileData, PublicProfile, ApiResponse } from './types'

export interface UpdateProfileRequest {
    displayName?: string
    bio?: string
    location?: string
    website?: string
    company?: string
    skills?: string[]
    socialLinks?: {
        github?: string
        linkedin?: string
        twitter?: string
    }
}

export interface CVGenerationRequest {
    format: 'pdf' | 'docx'
    template?: string
    includeProjects?: boolean
    includeSkills?: boolean
}

export const profileApi = {
    /**
     * Get current user's profile data
     */
    get: () => apiClient.get<ApiResponse<ProfileData>>('/profile').then((r) => r.data),

    /**
     * Update profile
     */
    update: (data: UpdateProfileRequest) =>
        apiClient.patch<ApiResponse<ProfileData>>('/profile', data).then((r) => r.data),

    /**
     * Generate CV/Resume
     */
    generateCV: (options: CVGenerationRequest) =>
        apiClient.post<ApiResponse<{ downloadUrl: string }>>('/profile/cv', options).then(
            (r) => r.data
        ),

    /**
     * Get profile completion percentage
     */
    completion: () =>
        apiClient.get<ApiResponse<{ percentage: number; missing: string[] }>>(
            '/profile/completion'
        ).then((r) => r.data),
}

// --- Public Profiles ---
export const publicProfilesApi = {
    /**
     * Get public profile by username
     */
    get: (username: string) =>
        apiClient.get<ApiResponse<PublicProfile>>(`/u/${username}`, undefined, { skipAuth: true }).then((r) => r.data),

    /**
     * Get public project details
     */
    getProject: (username: string, projectSlug: string) =>
        apiClient.get<ApiResponse<PublicProfile['projects'][0]>>(
            `/u/${username}/projects/${projectSlug}`,
            undefined,
            { skipAuth: true }
        ).then((r) => r.data),
}
