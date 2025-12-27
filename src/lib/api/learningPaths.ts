// Learning Paths API Client

// ============================================================================
// Types
// ============================================================================

import type { TierLevel } from './types'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'mastery';

export interface LearningPath {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    difficultyLevel: DifficultyLevel;
    estimatedHours: number;
    icon?: string;
    color?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PathProject {
    id: string;
    pathId: string;
    projectId: string;
    sequenceOrder: number;
    isRequired: boolean;
    unlockCriteria?: any;
    createdAt: string;
}

export interface UserPathProgress {
    id: string;
    userId: string;
    pathId: string;
    startedAt: string;
    completedAt?: string;
    currentProjectId?: string;
    completionPercentage: number;
    totalProjects: number;
    completedProjects: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserPathMilestone {
    id: string;
    userId: string;
    pathId: string;
    projectId: string;
    completedAt: string;
    validationScore?: number;
    timeSpentMinutes?: number;
    createdAt: string;
}

export interface LearningPathWithProgress {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    categoryId: string; // UUID for filtering
    difficultyLevel: DifficultyLevel;
    estimatedHours: number;
    icon?: string;
    color?: string;
    tierRequired: TierLevel; // 'free' | 'pro' | 'premium'
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    totalProjects: number;
    userProgress?: UserPathProgress;
}

export interface PathProjectDetail {
    pathProjectId: string;
    projectId: string;
    projectName: string;
    projectSlug: string;
    projectDescription: string;
    techStack: string[];
    difficulty: string;
    sequenceOrder: number;
    isRequired: boolean;
    isLocked: boolean;
    isCompleted: boolean;
    completedAt?: string;
}

export interface PathDetailResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    difficultyLevel: DifficultyLevel;
    estimatedHours: number;
    icon?: string;
    color?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    projects: PathProjectDetail[];
    userProgress?: UserPathProgress;
}

export interface UserPathsResponse {
    activePaths: LearningPathWithProgress[];
    completedPaths: LearningPathWithProgress[];
}

export interface ListPathsQuery {
    category?: string;
    categoryId?: string; // UUID filter
    difficulty?: DifficultyLevel;
    tier?: TierLevel; // 'free' | 'pro' | 'premium'
}

export interface CompleteProjectRequest {
    validationScore?: number;
    timeSpentMinutes?: number;
}

// ============================================================================
// API Functions
// ============================================================================

const API_BASE = '/api/v1';

async function fetchWithAuth<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const accessToken = localStorage.getItem('access_token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options?.headers,
        },
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
    }

    return data.data || data;
}

/**
 * List all available learning paths
 */
export async function listLearningPaths(
    query?: ListPathsQuery
): Promise<LearningPathWithProgress[]> {
    const params = new URLSearchParams();
    if (query?.category) params.append('category', query.category);
    if (query?.categoryId) params.append('category_id', query.categoryId);
    if (query?.difficulty) params.append('difficulty', query.difficulty);
    if (query?.tier) params.append('tier', query.tier);

    const queryString = params.toString();
    const url = queryString ? `/learning-paths?${queryString}` : '/learning-paths';

    return fetchWithAuth<LearningPathWithProgress[]>(url);
}

/**
 * Get detailed information about a specific learning path
 */
export async function getPathDetail(pathId: string): Promise<PathDetailResponse> {
    return fetchWithAuth<PathDetailResponse>(`/learning-paths/${pathId}`);
}

/**
 * Start a learning path (enroll user)
 */
export async function startPath(pathId: string): Promise<UserPathProgress> {
    return fetchWithAuth<UserPathProgress>(`/learning-paths/${pathId}/start`, {
        method: 'POST',
    });
}

/**
 * Get user's progress on a specific path
 */
export async function getPathProgress(pathId: string): Promise<UserPathProgress | null> {
    return fetchWithAuth<UserPathProgress | null>(`/learning-paths/${pathId}/progress`);
}

/**
 * Get all user's learning paths (active and completed)
 */
export async function getUserPaths(): Promise<UserPathsResponse> {
    return fetchWithAuth<UserPathsResponse>('/users/me/paths');
}

/**
 * Mark a project as complete within a learning path
 */
export async function completePathProject(
    pathId: string,
    projectId: string,
    data?: CompleteProjectRequest
): Promise<UserPathProgress> {
    return fetchWithAuth<UserPathProgress>(
        `/learning-paths/${pathId}/projects/${projectId}/complete`,
        {
            method: 'POST',
            body: JSON.stringify(data || {}),
        }
    );
}
