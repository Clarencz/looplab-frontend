// =============================================================================
// AUTH API
// =============================================================================
// Authentication operations - login, logout, session management

import { apiClient } from './client'
import { authInterceptor } from '../interceptors'
import type { AuthSession, AuthTokens, ApiResponse, ErrorCode } from './types'

// Error class for auth-specific errors
class AuthError extends Error {
    constructor(
        public code: ErrorCode,
        message: string,
    ) {
        super(message)
        this.name = 'AuthError'
    }
}

export interface AuthCredentials {
    email: string
    password: string
}

export const authApi = {
    /**
     * Authenticate with credentials
     */
    login: async (credentials: AuthCredentials): Promise<AuthSession> => {
        const response = await apiClient.post<ApiResponse<AuthSession>>(
            '/auth/login',
            credentials,
            { skipAuth: true, skipRetry: true }
        )
        authInterceptor.setTokens(
            response.data.tokens.accessToken,
            response.data.tokens.refreshToken,
            response.data.tokens.expiresAt
        )
        return response.data
    },

    /**
     * Refresh access token using refresh token
     */
    refresh: async (): Promise<AuthTokens> => {
        const refreshToken = authInterceptor.getRefreshToken()
        if (!refreshToken) {
            throw new AuthError('UNAUTHORIZED', 'No refresh token available')
        }

        const response = await apiClient.post<ApiResponse<AuthTokens>>(
            '/auth/refresh',
            { refreshToken },
            { skipAuth: true, skipRetry: true }
        )
        authInterceptor.setTokens(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.expiresAt
        )
        return response.data
    },

    /**
     * Logout and clear tokens
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout', undefined, { skipRetry: true })
        } finally {
            authInterceptor.clearTokens()
        }
    },

    /**
     * Get current session
     */
    getSession: async (): Promise<AuthSession | null> => {
        const token = authInterceptor.getAccessToken()
        if (!token) return null

        try {
            const response = await apiClient.get<ApiResponse<AuthSession>>('/auth/session')
            return response.data
        } catch {
            authInterceptor.clearTokens()
            return null
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!authInterceptor.getAccessToken()
    },
}

export { authInterceptor }
