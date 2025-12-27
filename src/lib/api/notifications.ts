// =============================================================================
// NOTIFICATIONS API
// =============================================================================
// User notifications management

import { apiClient } from './client'
import type { Notification, ApiResponse, PaginatedResponse } from './types'

type EntityId = string

export const notificationsApi = {
    /**
     * List user notifications
     */
    list: () =>
        apiClient.get<PaginatedResponse<Notification>>('/notifications'),

    /**
     * Mark notification as read
     */
    markRead: (id: EntityId) =>
        apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`).then(
            (r) => r.data
        ),

    /**
     * Mark all notifications as read
     */
    markAllRead: () => apiClient.post<ApiResponse<void>>('/notifications/read-all'),

    /**
     * Get unread notification count
     */
    unreadCount: () =>
        apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count').then(
            (r) => r.data.count
        ),
}
