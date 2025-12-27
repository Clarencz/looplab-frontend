// =============================================================================
// USERS API
// =============================================================================
// User management operations - profile, settings, avatar

import { apiClient } from './client'
import type { User, UserSettings, ApiResponse } from './types'

export interface UpdateUserRequest {
    displayName?: string
    bio?: string
    location?: string
    website?: string
    company?: string
}

export const usersApi = {
    /**
     * Get current user
     */
    me: () => apiClient.get<ApiResponse<User>>('/users/me').then((r) => r.data),

    /**
     * Update current user profile
     */
    update: (data: UpdateUserRequest) =>
        apiClient.patch<ApiResponse<User>>('/users/me', data).then((r) => r.data),

    /**
     * Update user settings
     */
    updateSettings: (settings: Partial<UserSettings>) =>
        apiClient.patch<ApiResponse<UserSettings>>('/users/me/settings', settings).then(
            (r) => r.data
        ),

    /**
     * Delete user account
     */
    delete: () => apiClient.delete<ApiResponse<void>>('/users/me'),

    /**
     * Upload avatar image
     */
    uploadAvatar: async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await apiClient.request<ApiResponse<{ url: string }>>(
            '/users/me/avatar',
            {
                method: 'POST',
                body: formData,
                headers: {}, // Let browser set content-type for FormData
            }
        )
        return response.data.url
    },
}
