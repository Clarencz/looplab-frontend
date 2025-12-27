// Categories API Client

import { Category } from './types'

const API_BASE = '/api/v1'

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed')
    }

    return data.data || data
}

/**
 * List all active categories
 */
export async function listCategories(): Promise<Category[]> {
    return fetchAPI<Category[]>('/categories')
}

/**
 * List categories with path counts
 */
export async function listCategoriesWithCounts(): Promise<Category[]> {
    return fetchAPI<Category[]>('/categories/with-counts')
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`)
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/slug/${slug}`)
}
