// =============================================================================
// SKILLS API
// =============================================================================
// User skills and tech stacks

import { apiClient } from './client'
import type { Skill, TechStack, ApiResponse } from './types'

export const skillsApi = {
    /**
     * Get user's acquired skills
     */
    list: () => apiClient.get<ApiResponse<Skill[]>>('/skills').then((r) => r.data),

    /**
     * Get all available tech stacks
     */
    getTechStacks: () =>
        apiClient.get<ApiResponse<TechStack[]>>('/skills/tech-stacks').then((r) => r.data),
}
