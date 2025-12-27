import { apiClient } from './index';

// Types
export interface Role {
    id: string;
    name: string;
    display_name: string;
    description?: string;
    permissions: string[];
    is_system: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserWithDetails {
    id: string;
    email: string;
    username: string;
    created_at: string;
    updated_at: string;
    roles: string[];
    subscription_tier?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LearningPath {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category: string;
    category_id?: string;
    difficulty: string;
    tier: string;
    estimated_hours?: number;
    is_published: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OverviewStats {
    total_users: number;
    active_users_30d: number;
    total_revenue: number;
    revenue_30d: number;
    total_subscriptions: number;
    active_subscriptions: number;
    total_projects: number;
    total_paths: number;
}

export interface RevenueAnalytics {
    total_revenue: number;
    period_revenue: number;
    revenue_by_day: Array<{
        date: string;
        amount: number;
        count: number;
    }>;
    revenue_by_method: Array<{
        method: string;
        amount: number;
        count: number;
    }>;
    revenue_by_country: Array<{
        country: string;
        amount: number;
        count: number;
    }>;
}

export interface UserGrowthAnalytics {
    total_users: number;
    new_users_period: number;
    active_users_period: number;
    user_growth_by_day: Array<{
        date: string;
        new_users: number;
        total_users: number;
    }>;
    users_by_subscription: Array<{
        tier: string;
        count: number;
        percentage: number;
    }>;
}

// User Management
// Note: apiClient methods already return the unwrapped data directly, 
// so we return the response directly without accessing .data
export const adminApi = {
    // Users
    listUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) => {
        return apiClient.get('/admin/users', params);
    },

    getUser: async (userId: string) => {
        return apiClient.get(`/admin/users/${userId}`);
    },

    banUser: async (userId: string, reason: string) => {
        await apiClient.post(`/admin/users/${userId}/ban`, { reason });
    },

    unbanUser: async (userId: string) => {
        await apiClient.post(`/admin/users/${userId}/unban`);
    },

    assignRole: async (userId: string, roleId: string) => {
        await apiClient.post(`/admin/users/${userId}/roles`, { role_id: roleId });
    },

    removeRole: async (userId: string, roleId: string) => {
        await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
    },

    // Categories
    listCategories: async (): Promise<Category[]> => {
        return apiClient.get<Category[]>('/admin/categories');
    },

    createCategory: async (data: {
        name: string;
        display_name: string;
        description?: string;
        icon?: string;
        color?: string;
    }): Promise<Category> => {
        return apiClient.post<Category>('/admin/categories', data);
    },

    updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
        return apiClient.patch<Category>(`/admin/categories/${id}`, data);
    },

    deleteCategory: async (id: string) => {
        await apiClient.delete(`/admin/categories/${id}`);
    },

    reorderCategories: async (orders: Array<{ id: string; display_order: number }>) => {
        await apiClient.post('/admin/categories/reorder', { category_orders: orders });
    },

    // Learning Paths
    listLearningPaths: async (includeUnpublished = false): Promise<LearningPath[]> => {
        return apiClient.get<LearningPath[]>('/admin/learning-paths', { include_unpublished: includeUnpublished });
    },

    createLearningPath: async (data: {
        name: string;
        slug: string;
        description: string;
        category: string;
        categoryId?: string;
        difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastery';
        estimatedHours: number;
        icon?: string;
        color?: string;
        isPremium?: boolean;
        tierRequired?: 'free' | 'pro' | 'premium';
    }): Promise<LearningPath> => {
        return apiClient.post<LearningPath>('/admin/learning-paths', data);
    },

    updateLearningPath: async (pathId: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        category?: string;
        categoryId?: string;
        difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'mastery';
        estimatedHours?: number;
        icon?: string;
        color?: string;
        isPremium?: boolean;
        tierRequired?: 'free' | 'pro' | 'premium';
    }): Promise<LearningPath> => {
        return apiClient.put<LearningPath>(`/admin/learning-paths/${pathId}`, data);
    },

    publishPath: async (pathId: string) => {
        await apiClient.post(`/admin/learning-paths/${pathId}/publish`);
    },

    unpublishPath: async (pathId: string) => {
        await apiClient.post(`/admin/learning-paths/${pathId}/unpublish`);
    },

    deletePath: async (pathId: string) => {
        await apiClient.delete(`/admin/learning-paths/${pathId}`);
    },

    // Projects
    listProjects: async (params?: {
        page?: number;
        limit?: number;
        difficulty?: string;
        search?: string;
    }): Promise<any[]> => {
        return apiClient.get<any[]>('/admin/projects', params);
    },

    createProject: async (data: any): Promise<any> => {
        return apiClient.post<any>('/admin/projects', data);
    },

    getProject: async (projectId: string): Promise<any> => {
        return apiClient.get<any>(`/admin/projects/${projectId}`);
    },
    updateProject: async (projectId: string, data: any): Promise<any> => {
        return apiClient.patch<any>(`/admin/projects/${projectId}`, data);
    },

    deleteProject: async (projectId: string): Promise<void> => {
        await apiClient.delete(`/admin/projects/${projectId}`);
    },

    // GitHub Import & Pipeline
    // Pillar 1: Basic import (no AI) - instant
    importGitHubBasic: async (data: {
        repoUrl: string;
        githubToken: string;
    }): Promise<{
        projectId: string;
        status: string;
        message: string;
    }> => {
        return apiClient.post('/admin/projects/import-github-basic', data);
    },

    // Legacy: Full import with AI (may fail on quota limits)
    importGitHubProject: async (data: {
        repoUrl: string;
        learningPathId: string;
        githubToken: string;
    }): Promise<{
        projectId: string;
        status: string;
        message: string;
    }> => {
        return apiClient.post('/admin/projects/import-github', data);
    },

    getPipelineStatus: async (projectId: string): Promise<{
        projectId: string;
        status: string;
        agents: Array<{
            agentName: string;
            status: string;
            executionTimeMs: number | null;
            errorMessage: string | null;
        }>;
        totalExecutionTimeMs: number;
    }> => {
        return apiClient.get(`/admin/projects/${projectId}/pipeline-status`);
    },

    reviewProject: async (projectId: string, data: {
        approved: boolean;
        adminNotes?: string;
    }): Promise<any> => {
        return apiClient.patch(`/admin/projects/${projectId}/review`, data);
    },

    // Pillar 2: Project Status Management
    updateProjectStatus: async (projectId: string, status: 'draft' | 'active' | 'archived'): Promise<{
        projectId: string;
        status: string;
        message: string;
    }> => {
        return apiClient.patch(`/admin/projects/${projectId}/status`, { status });
    },

    // Pillar 3: AI Processing
    runAiPipeline: async (projectId: string): Promise<{
        projectId: string;
        status: string;
        processingStartedAt: string;
        message: string;
    }> => {
        return apiClient.post(`/admin/projects/${projectId}/run-ai-pipeline`, {});
    },

    // Pillar 4: Export to GitHub
    exportProjectToGitHub: async (projectId: string, data: {
        orgOrUser: string;
        repoName: string;
        isPrivate: boolean;
    }): Promise<{
        projectId: string;
        repoUrl: string;
        cloneUrl: string;
        filesExported: number;
        message: string;
    }> => {
        return apiClient.post(`/admin/projects/${projectId}/export-github`, data);
    },

    // Analytics
    getOverview: async (): Promise<OverviewStats> => {
        return apiClient.get<OverviewStats>('/admin/analytics/overview');
    },

    getRevenueAnalytics: async (period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<RevenueAnalytics> => {
        return apiClient.get<RevenueAnalytics>('/admin/analytics/revenue', { period });
    },

    getUserAnalytics: async (period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<UserGrowthAnalytics> => {
        return apiClient.get<UserGrowthAnalytics>('/admin/analytics/users', { period });
    },
};
