// Subscriptions API Client

import { SubscriptionTier, UserSubscriptionWithTier } from './types'

const API_BASE = '/api/v1'

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const accessToken = localStorage.getItem('access_token')
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
    }

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
    }

    return data.data || data
}

/**
 * List all subscription tiers (public endpoint)
 */
export async function listSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return fetchAPI<SubscriptionTier[]>('/subscriptions/tiers')
}

/**
 * Get current user's subscription (protected endpoint)
 */
export async function getUserSubscription(): Promise<UserSubscriptionWithTier | null> {
    return fetchAPI<UserSubscriptionWithTier | null>('/users/me/subscription')
}
