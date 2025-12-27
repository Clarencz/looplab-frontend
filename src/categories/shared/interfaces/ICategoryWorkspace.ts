import type { Project, UserProject } from '@/lib/api/types'
import type { WorkspaceFile } from '@/lib/api/types'

/**
 * Execution context for category-specific execution
 */
export interface ExecutionContext {
    userProjectId: string
    files: WorkspaceFile[]
    entryPoint: string
    language: string
}

/**
 * Result from code execution
 */
export interface ExecutionResult {
    output: string
    exitCode: number
    executionTime: number
    success: boolean
    logs?: ExecutionLog[]
}

/**
 * Execution log entry
 */
export interface ExecutionLog {
    type: 'stdout' | 'stderr' | 'info' | 'error'
    message: string
    timestamp: number
}

/**
 * Validation result
 */
export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
}

export interface ValidationError {
    file: string
    line: number
    message: string
    severity: 'error'
}

export interface ValidationWarning {
    file: string
    line: number
    message: string
    severity: 'warning'
}

/**
 * Category-specific executor interface
 * Each category implements this to provide custom execution logic
 */
export interface ICategoryExecutor {
    /**
     * Execute code for this category
     */
    execute(context: ExecutionContext): Promise<ExecutionResult>

    /**
     * Cancel ongoing execution
     */
    cancel(): void

    /**
     * Check if this executor supports the given language
     */
    supportsLanguage(language: string): boolean
}

/**
 * Category workspace props
 */
export interface CategoryWorkspaceProps {
    projectId: string
    project: Project
    category?: any
}

/**
 * Category-specific workspace interface
 * Each category implements this to provide custom workspace UI
 */
export interface ICategoryWorkspace {
    categoryId: string
    categorySlug: string

    /**
     * Initialize the workspace
     */
    initialize(project: Project, userProject: UserProject): Promise<void>

    /**
     * Cleanup resources
     */
    cleanup(): void

    /**
     * Execute code
     */
    execute(files: WorkspaceFile[], entryPoint: string): Promise<ExecutionResult>

    /**
     * Validate workspace state
     */
    validate(files: WorkspaceFile[]): Promise<ValidationResult>
}

/**
 * Category preview interface
 * Optional - for categories that need custom preview (e.g., web dev)
 */
export interface ICategoryPreview {
    /**
     * Render preview content
     */
    render(): React.ReactNode

    /**
     * Update preview with new content
     */
    update(content: string): void

    /**
     * Refresh preview
     */
    refresh(): void
}
