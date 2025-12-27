/**
 * Category to workspace mapping
 * Maps category slugs to their corresponding workspace directories
 */
export const CATEGORY_WORKSPACE_MAP: Record<string, string> = {
    // Algorithms & Problem Solving
    'algorithms': 'algorithms',

    // Data Science & Analytics  
    'data-science': 'data-science',

    // Programming & Software
    'programming': 'programming',

    // Finance & Economics - dedicated for financial charts
    'finance': 'finance',

    // Math & Logic - dedicated for graph plotting and equations
    'math': 'math',

    // Future categories
    'web-development': 'web-development',
    'mobile': 'mobile',
}


/**
 * Get workspace directory for a category
 */
export function getCategoryWorkspace(categorySlug: string): string {
    return CATEGORY_WORKSPACE_MAP[categorySlug] || 'general'
}

/**
 * Check if category has dedicated workspace
 */
export function hasDedicatedWorkspace(categorySlug: string): boolean {
    const workspace = CATEGORY_WORKSPACE_MAP[categorySlug]
    return workspace !== 'general' && workspace !== undefined
}
