import { api } from "./client"
import {
    TutorSession,
    TutorSessionResponse,
    StartTutorRequest,
    EntityId,
} from "./types"

/**
 * AI Tutor API Service
 * Handles category-specific AI tutoring sessions
 */
export const tutorApi = {
    /**
     * Start a new AI tutor session
     */
    async startSession(
        categorySlug: string,
        request: StartTutorRequest
    ): Promise<TutorSession> {
        const response = await api.post<TutorSessionResponse>(
            `/categories/${categorySlug}/tutor/start`,
            request
        )
        return response.session
    },

    /**
     * Get an existing tutor session
     */
    async getSession(categorySlug: string, sessionId: EntityId): Promise<TutorSession> {
        const response = await api.get<TutorSessionResponse>(
            `/categories/${categorySlug}/tutor/sessions/${sessionId}`
        )
        return response.session
    },

    /**
     * Navigate to next step in tutor session
     */
    async nextStep(categorySlug: string, sessionId: EntityId): Promise<TutorSession> {
        const response = await api.post<TutorSessionResponse>(
            `/categories/${categorySlug}/tutor/sessions/${sessionId}/next`
        )
        return response.session
    },

    /**
     * Navigate to previous step in tutor session
     */
    async previousStep(categorySlug: string, sessionId: EntityId): Promise<TutorSession> {
        const response = await api.post<TutorSessionResponse>(
            `/categories/${categorySlug}/tutor/sessions/${sessionId}/previous`
        )
        return response.session
    },

    /**
     * Mark tutor session as complete
     */
    async completeSession(categorySlug: string, sessionId: EntityId): Promise<void> {
        await api.post(`/categories/${categorySlug}/tutor/sessions/${sessionId}/complete`)
    },
}
