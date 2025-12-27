import type { ICategoryExecutor, ExecutionContext, ExecutionResult } from '../interfaces'

/**
 * Factory for creating category-specific executors
 */
export class ExecutorFactory {
    private static executors = new Map<string, ICategoryExecutor>()

    /**
     * Register a category executor
     */
    static register(categorySlug: string, executor: ICategoryExecutor): void {
        this.executors.set(categorySlug, executor)
    }

    /**
     * Get executor for a category
     */
    static getExecutor(categorySlug: string): ICategoryExecutor | null {
        return this.executors.get(categorySlug) || null
    }

    /**
     * Check if category has a registered executor
     */
    static hasExecutor(categorySlug: string): boolean {
        return this.executors.has(categorySlug)
    }

    /**
     * Get all registered category slugs
     */
    static getRegisteredCategories(): string[] {
        return Array.from(this.executors.keys())
    }
}
