// Validation Router
// Routes to category-specific validation components based on category slug

import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { Category } from '@/lib/api/types'
import type { CategoryValidationResult, CategoryValidationProps } from '@/categories/shared/interfaces/validation'

// Lazy load category validation components
const ProgrammingValidation = lazy(() => import('@/categories/programming/components/ProgrammingValidation'))
// Future category validations will be added here:
// const AlgorithmsValidation = lazy(() => import('@/categories/algorithms/components/AlgorithmsValidation'))
// const DataScienceValidation = lazy(() => import('@/categories/data-science/components/DataScienceValidation'))

// Fallback to generic validation modal
import ValidationResultModal from '@/components/workspace/ValidationResultModal'

function ValidationLoader() {
    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading validation results...</p>
            </div>
        </div>
    )
}

interface ValidationRouterProps {
    isOpen: boolean
    result: any // Will be typed per category
    category: Category | null
    projectName: string
    onClose: () => void
    onOpenTutor?: () => void
}

/**
 * ValidationRouter - Routes to category-specific validation component
 * 
 * Each category has its own validation UI showing relevant metrics:
 * - Programming: Tests, linting, coverage, AI review
 * - Algorithms: Correctness, complexity, benchmarks (future)
 * - Data Science: Notebook outputs, accuracy metrics (future)
 */
export function ValidationRouter({
    isOpen,
    result,
    category,
    projectName,
    onClose,
    onOpenTutor
}: ValidationRouterProps) {
    if (!isOpen || !result) return null

    const categorySlug = category?.slug || 'general'

    // Route to category-specific validation component
    switch (categorySlug) {
        case 'programming':
            // Transform result to programming format if needed
            const programmingResult = transformToProgrammingResult(result)
            return (
                <Suspense fallback={<ValidationLoader />}>
                    <ProgrammingValidation
                        result={programmingResult}
                        category={category}
                        projectName={projectName}
                        onClose={onClose}
                        onOpenTutor={onOpenTutor}
                    />
                </Suspense>
            )

        // Future categories:
        // case 'algorithms':
        //     return <AlgorithmsValidation ... />
        // case 'data-science':
        //     return <DataScienceValidation ... />

        default:
            // Fall back to generic validation modal for unknown categories
            return (
                <ValidationResultModal
                    isOpen={isOpen}
                    result={result}
                    projectName={projectName}
                    onClose={onClose}
                    onOpenTutor={onOpenTutor}
                />
            )
    }
}

// Helper to transform generic result to programming-specific format
function transformToProgrammingResult(result: any) {
    return {
        id: result.id || crypto.randomUUID(),
        type: 'programming' as const,
        overallStatus: result.overallStatus || 'pending',
        score: result.score || 0,
        feedback: result.feedback || '',
        submittedAt: result.submittedAt || new Date().toISOString(),
        completedAt: result.completedAt,
        userTests: {
            passed: result.userTestsPassed || 0,
            total: result.userTestsTotal || 0,
            results: (result.stages || [])
                .filter((s: any) => s.stageType === 'user_tests')
                .flatMap((s: any) => s.results || [])
                .map((r: any) => ({
                    name: r.name || 'Test',
                    status: r.status || 'passed',
                    duration: r.duration,
                    message: r.message
                }))
        },
        backendTests: {
            passed: result.backendTestsPassed || 0,
            total: result.backendTestsTotal || 0,
            results: (result.stages || [])
                .filter((s: any) => s.stageType === 'backend_tests')
                .flatMap((s: any) => s.results || [])
                .map((r: any) => ({
                    name: r.name || 'Validation',
                    status: r.status || 'passed',
                    duration: r.duration,
                    message: r.message
                }))
        },
        linting: {
            errors: result.lintErrors || 0,
            warnings: result.lintWarnings || 0,
            items: (result.insights || [])
                .filter((i: any) => i.category === 'linting')
                .flatMap((i: any) => i.items || [])
                .map((item: any) => ({
                    rule: item.rule || 'lint',
                    message: item.label || item.description,
                    severity: item.status === 'failed' ? 'error' as const : 'warning' as const,
                    file: item.file || 'unknown',
                    line: item.lineNumber || 0
                }))
        },
        coverage: result.coverage ? {
            percentage: result.coverage.percentage || 0,
            lines: result.coverage.lines || 0,
            covered: result.coverage.covered || 0
        } : undefined,
        aiReview: {
            score: result.aiQualityScore || 0,
            insights: result.aiInsights || [],
            suggestions: (result.insights || [])
                .filter((i: any) => i.category === 'ai_suggestions')
                .flatMap((i: any) => i.items || [])
                .map((item: any) => item.label || item.description)
        }
    }
}

export default ValidationRouter
