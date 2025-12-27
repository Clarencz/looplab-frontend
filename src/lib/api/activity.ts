// =============================================================================
// ACTIVITY API
// =============================================================================
// User activity and analytics

import { apiClient } from './client'
import type {
    Activity,
    WeeklyActivityData,
    DailyActivityData,
    PerformanceMetrics,
    ApiResponse,
    PaginatedResponse
} from './types'

export interface ActivityFilters {
    type?: string
    from?: string
    to?: string
    page?: number
    limit?: number
}

export const activityApi = {
    /**
     * Get activity feed
     */
    list: (filters?: ActivityFilters) =>
        apiClient.get<PaginatedResponse<Activity>>('/activity', filters as Record<string, string | number | boolean | undefined>),

    /**
     * Get weekly activity data for heatmap
     */
    weekly: (year?: number) =>
        apiClient.get<ApiResponse<WeeklyActivityData[]>>('/activity/weekly', { year }).then(
            (r) => r.data
        ),

    /**
     * Get daily activity heatmap data
     */
    heatmap: (year?: number) =>
        apiClient.get<ApiResponse<DailyActivityData[]>>('/activity/heatmap', { year }).then(
            (r) => r.data
        ),

    /**
     * Get performance metrics
     */
    performance: () =>
        apiClient.get<ApiResponse<PerformanceMetrics>>('/activity/performance').then(
            (r) => r.data
        ),
}
