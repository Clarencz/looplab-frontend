import { lazy, Suspense, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'
import { getCategoryWorkspace } from '@/categories/shared/utils'

// Lazy load category workspaces
const AlgorithmsWorkspace = lazy(() => import('@/categories/algorithms/components/AlgorithmsWorkspace'))
const DataScienceWorkspace = lazy(() => import('@/categories/data-science/components/DataScienceWorkspace'))
const ProgrammingWorkspace = lazy(() => import('@/categories/programming/components/ProgrammingWorkspace'))
const WebDevWorkspace = lazy(() => import('@/categories/web-development/components/WebDevWorkspace'))
const MobileWorkspace = lazy(() => import('@/categories/mobile/components/MobileWorkspace'))
const MathWorkspace = lazy(() => import('@/categories/math/components/MathWorkspace'))
const FinanceWorkspace = lazy(() => import('@/categories/finance/components/FinanceWorkspace'))
const GeneralWorkspace = lazy(() => import('@/categories/general/components/GeneralWorkspace'))

// Loading fallback
function WorkspaceLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading workspace...</p>
            </div>
        </div>
    )
}

/**
 * CategoryRouter - Routes to category-specific workspace implementations
 * 
 * This replaces the old ModeRouter and provides better separation between categories.
 * Each category has its own workspace implementation with custom UI and execution logic.
 * 
 * Existing categories:
 * - algorithms: Algorithms & Problem Solving
 * - data-science: Data Science & Analytics
 * - programming: Programming & Software
 * - math: Math & Logic (graph plotting, LaTeX equations)
 * - finance: Finance & Economics (candlestick charts, time series)
 */
export function CategoryRouter({ projectId, project, category }: CategoryWorkspaceProps) {
    // Get category slug, default to 'general' for IDE mode
    const categorySlug = category?.slug || 'general'

    // Get the workspace directory for this category
    const workspaceType = getCategoryWorkspace(categorySlug)

    // Render the appropriate workspace based on category
    const workspace = useMemo(() => {
        switch (workspaceType) {
            case 'algorithms':
                return <AlgorithmsWorkspace projectId={projectId} project={project} category={category} />

            case 'data-science':
                return <DataScienceWorkspace projectId={projectId} project={project} category={category} />

            case 'programming':
                return <ProgrammingWorkspace projectId={projectId} project={project} category={category} />

            case 'web-development':
                return <WebDevWorkspace projectId={projectId} project={project} category={category} />

            case 'mobile':
                return <MobileWorkspace projectId={projectId} project={project} category={category} />

            case 'math':
                return <MathWorkspace projectId={projectId} project={project} category={category} />

            case 'finance':
                return <FinanceWorkspace projectId={projectId} project={project} category={category} />

            case 'general':
            default:
                return <GeneralWorkspace projectId={projectId} project={project} category={category} />
        }
    }, [workspaceType, projectId, project, category])

    return (
        <Suspense fallback={<WorkspaceLoader />}>
            {workspace}
        </Suspense>
    )
}
