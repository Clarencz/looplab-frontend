// Category Validation Interfaces
// Shared types for category-specific validation components

// Base validation result that all categories must provide

// Base validation result that all categories must provide
export interface BaseValidationResult {
    id: string
    overallStatus: 'passed' | 'failed' | 'pending'
    score: number
    feedback: string
    submittedAt: string
    completedAt?: string
}

// Programming category validation
export interface TestResult {
    name: string
    status: 'passed' | 'failed' | 'skipped'
    duration?: number
    message?: string
    file?: string
    lineNumber?: number
}

export interface LintWarning {
    rule: string
    message: string
    severity: 'error' | 'warning' | 'info'
    file: string
    line: number
    column?: number
}

export interface ProgrammingValidationResult extends BaseValidationResult {
    type: 'programming'
    userTests: {
        passed: number
        total: number
        results: TestResult[]
    }
    backendTests: {
        passed: number
        total: number
        results: TestResult[]
    }
    linting: {
        errors: number
        warnings: number
        items: LintWarning[]
    }
    coverage?: {
        percentage: number
        lines: number
        covered: number
    }
    aiReview: {
        score: number
        insights: string[]
        suggestions: string[]
    }
}

// Algorithm category validation
export interface BenchmarkResult {
    testCase: string
    input: string
    expectedOutput: string
    actualOutput: string
    status: 'passed' | 'failed'
    executionTime: number // ms
    memoryUsed?: number // bytes
}

export interface AlgorithmValidationResult extends BaseValidationResult {
    type: 'algorithms'
    correctness: {
        passed: number
        total: number
        testCases: BenchmarkResult[]
    }
    complexity: {
        time: string // e.g., "O(n log n)"
        space: string // e.g., "O(n)"
        optimal: boolean
    }
    benchmarks: {
        avgTime: number
        maxTime: number
        minTime: number
    }
}

// Data Science category validation
export interface CellOutput {
    cellId: string
    cellType: 'code' | 'markdown'
    output: string
    error?: string
    visualizations?: string[] // base64 images
}

export interface DataScienceValidationResult extends BaseValidationResult {
    type: 'data-science'
    notebookExecution: {
        cellsExecuted: number
        cellsFailed: number
        outputs: CellOutput[]
    }
    modelMetrics?: {
        accuracy?: number
        precision?: number
        recall?: number
        f1Score?: number
        mse?: number
        rmse?: number
    }
    dataQuality: {
        rowsProcessed: number
        missingValues: number
        duplicates: number
    }
}

// Union type for all validation results
export type CategoryValidationResult =
    | ProgrammingValidationResult
    | AlgorithmValidationResult
    | DataScienceValidationResult
    | (BaseValidationResult & { type: string })

// Props interface for category validation components
export interface CategoryValidationProps {
    result: CategoryValidationResult
    category: { slug: string; name?: string } | null
    projectName: string
    onClose: () => void
    onOpenTutor?: () => void
}

// Helper to determine validation type from category slug
export function getValidationType(categorySlug: string | undefined): string {
    switch (categorySlug) {
        case 'programming':
            return 'programming'
        case 'algorithms':
            return 'algorithms'
        case 'data-science':
            return 'data-science'
        case 'web-development':
            return 'web-development'
        case 'math':
            return 'math'
        case 'finance':
            return 'finance'
        default:
            return 'general'
    }
}
