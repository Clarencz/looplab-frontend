// =============================================================================
// GITHUB API
// =============================================================================
// GitHub integration operations

import { apiClient } from './client'
import type { GitHubConnection, GitHubRepo, ApiResponse } from './types'

export const githubApi = {
    /**
     * Get GitHub connection status
     */
    getConnection: () =>
        apiClient.get<ApiResponse<GitHubConnection>>('/github/connection').then(
            (r) => r.data
        ),

    /**
     * Connect GitHub account using OAuth code
     */
    connect: (code: string) =>
        apiClient.post<ApiResponse<GitHubConnection>>('/github/connect', { code }).then(
            (r) => r.data
        ),

    /**
     * Disconnect GitHub account
     */
    disconnect: () => apiClient.delete<ApiResponse<void>>('/github/disconnect'),

    /**
     * List user's GitHub repositories
     */
    listRepos: () =>
        apiClient.get<ApiResponse<GitHubRepo[]>>('/github/repos').then((r) => r.data),
}
