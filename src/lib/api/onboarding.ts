// =============================================================================
// ONBOARDING API
// =============================================================================
// User onboarding flow

import { apiClient } from './client'
import type { OnboardingState, ApiResponse } from './types'

export interface UpdateOnboardingRequest {
    currentStep?: number
    selectedPath?: string
    goals?: string[]
    experience?: string
}

export const onboardingApi = {
    /**
     * Get onboarding state
     */
    get: () =>
        apiClient.get<ApiResponse<OnboardingState>>('/onboarding').then((r) => r.data),

    /**
     * Update onboarding progress
     */
    update: (data: UpdateOnboardingRequest) =>
        apiClient.put<ApiResponse<OnboardingState>>('/onboarding', data).then((r) => r.data),

    /**
     * Complete onboarding
     */
    complete: () =>
        apiClient.post<ApiResponse<OnboardingState>>('/onboarding/complete').then(
            (r) => r.data
        ),

    /**
     * Reset onboarding (for testing/settings)
     */
    reset: () =>
        apiClient.post<ApiResponse<OnboardingState>>('/onboarding/reset').then(
            (r) => r.data
        ),
}
