// =============================================================================
// PROJECTS API
// =============================================================================
// Project catalog and user project operations

import { apiClient } from './client'
import type { Project, UserProject, Submission, ApiResponse, PaginatedResponse } from './types'

export type EntityId = string

export interface ProjectFilters {
    category?: string
    difficulty?: string
    search?: string
    page?: number
    limit?: number
}

export interface StartProjectRequest {
    projectId: EntityId
}

export interface SaveWorkspaceRequest {
    userProjectId: EntityId
    workspace: {
        files: WorkspaceFile[]
        openTabs?: string[]
        activeTabPath?: string
    }
}

export interface WorkspaceFile {
    path: string
    name: string
    type: 'file' | 'folder'
    content?: string
    children?: WorkspaceFile[]
}

export interface SubmitProjectRequest {
    userProjectId: EntityId
}

export interface GitHubLinkRequest {
    projectId: EntityId
    repoFullName: string
    branch?: string
}

// --- Project Catalog (Public) ---
export const projectsApi = {
    /**
     * List all available projects
     */
    list: (filters?: ProjectFilters) =>
        apiClient.get<PaginatedResponse<Project>>('/projects', filters as Record<string, string | number | boolean | undefined>),

    /**
     * Get project by ID or slug
     */
    get: (idOrSlug: string) =>
        apiClient.get<ApiResponse<Project>>(`/projects/${idOrSlug}`).then((r) => r.data),

    /**
     * Get project file structure
     */
    getFiles: (projectId: EntityId) =>
        apiClient.get<ApiResponse<Project['fileStructure']>>(
            `/projects/${projectId}/files`
        ).then((r) => r.data),
}

// --- User Projects (User's active instances) ---
export const userProjectsApi = {
    /**
     * List user's projects
     */
    list: (filters?: ProjectFilters) =>
        apiClient.get<PaginatedResponse<UserProject>>('/user-projects', filters as Record<string, string | number | boolean | undefined>),

    /**
     * Get user project by ID
     */
    get: (id: EntityId) =>
        apiClient.get<ApiResponse<UserProject>>(`/user-projects/${id}`).then((r) => r.data),

    /**
     * Start a new project
     */
    start: (data: StartProjectRequest) =>
        apiClient.post<ApiResponse<UserProject>>('/user-projects', data).then((r) => r.data),

    /**
     * Save workspace state (files, tabs, cursor position)
     */
    saveWorkspace: (data: SaveWorkspaceRequest) =>
        apiClient.put<ApiResponse<UserProject>>(
            `/user-projects/${data.userProjectId}/workspace`,
            data
        ).then((r) => r.data),

    /**
     * Submit project for validation
     */
    submit: (data: SubmitProjectRequest) =>
        apiClient.post<ApiResponse<Submission>>(
            `/user-projects/${data.userProjectId}/submit`,
            data
        ).then((r) => r.data),

    /**
     * Abandon project
     */
    abandon: (id: EntityId) =>
        apiClient.delete<ApiResponse<void>>(`/user-projects/${id}/abandon`),

    /**
     * Link GitHub repository
     */
    linkGitHub: (data: GitHubLinkRequest) =>
        apiClient.post<ApiResponse<UserProject>>(
            `/user-projects/${data.projectId}/github`,
            data
        ).then((r) => r.data),
}

// --- Submissions ---
export const submissionsApi = {
    /**
     * Get submission by ID
     */
    get: (id: EntityId) =>
        apiClient.get<ApiResponse<Submission>>(`/submissions/${id}`).then((r) => r.data),

    /**
     * List submissions for a user project
     */
    listForProject: (userProjectId: EntityId) =>
        apiClient.get<PaginatedResponse<Submission>>(
            `/user-projects/${userProjectId}/submissions`
        ),

    /**
     * Retry failed submission
     */
    retry: (id: EntityId) =>
        apiClient.post<ApiResponse<Submission>>(`/submissions/${id}/retry`).then(
            (r) => r.data
        ),
}
