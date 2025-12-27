import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { WorkspaceModeProps, LearningMode } from './types';

// Lazy load workspace modes for code splitting
const IdeWorkspace = lazy(() => import('./modes/IdeWorkspace'));
const NotebookWorkspace = lazy(() => import('./modes/NotebookWorkspace'));
const AlgorithmWorkspace = lazy(() => import('./modes/AlgorithmWorkspace'));
const QueryBuilderWorkspace = lazy(() => import('./modes/QueryBuilderWorkspace'));
const LivePreviewWorkspace = lazy(() => import('./modes/LivePreviewWorkspace'));

// Coming soon placeholder for modes not yet implemented
function ComingSoonPlaceholder({ mode }: { mode: LearningMode }) {
    const modeNames: Record<LearningMode, string> = {
        ide: 'IDE',
        notebook: 'Notebook',
        algorithm_visualizer: 'Algorithm Visualizer',
        query_builder: 'Query Builder',
        live_preview: 'Live Preview',
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{modeNames[mode]} Mode</h2>
                <p className="text-muted-foreground">Coming soon! This learning mode is under development.</p>
            </div>
        </div>
    );
}

// Loading fallback
function WorkspaceLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Loading workspace...</p>
            </div>
        </div>
    );
}

/**
 * ModeRouter - Selects the appropriate workspace component based on learning mode
 * 
 * This component routes to different workspace implementations based on the
 * category's learning_mode. It handles lazy loading and provides fallbacks
 * for modes that aren't implemented yet.
 */
export function ModeRouter({ projectId, project, category }: WorkspaceModeProps) {
    // Default to IDE mode if no category or learning_mode specified
    const mode: LearningMode = category?.learning_mode || 'ide';

    // Render the appropriate workspace mode
    const renderWorkspace = () => {
        switch (mode) {
            case 'ide':
                return <IdeWorkspace projectId={projectId} project={project} category={category} />;

            case 'notebook':
                return <NotebookWorkspace projectId={projectId} project={project} category={category} />;

            case 'algorithm_visualizer':
                return <AlgorithmWorkspace projectId={projectId} project={project} category={category} />;

            case 'query_builder':
                // TODO: Implement in Phase 3.5
                return <ComingSoonPlaceholder mode="query_builder" />;

            case 'live_preview':
                return <LivePreviewWorkspace projectId={projectId} project={project} category={category} />;

            default:
                // Fallback to IDE mode for unknown modes
                return <IdeWorkspace projectId={projectId} project={project} category={category} />;
        }
    };

    return (
        <Suspense fallback={<WorkspaceLoader />}>
            {renderWorkspace()}
        </Suspense>
    );
}
