import { useSearchParams } from 'react-router-dom';

/**
 * Smart navigation hook that provides context-aware back navigation.
 * 
 * Uses URL search params to track navigation source:
 * - ?from=path&pathId=xyz - came from a learning path
 * - ?from=dashboard - came from dashboard
 * - ?from=project&projectId=abc - came from a project detail page
 * 
 * This approach:
 * - Survives page refreshes
 * - Works with browser back/forward
 * - Shareable URLs still work (params are optional)
 */
export function useSmartNavigation() {
    const [searchParams] = useSearchParams();

    /**
     * Get the appropriate back URL based on navigation context
     */
    const getBackUrl = (defaultUrl: string): string => {
        const from = searchParams.get('from');
        const pathId = searchParams.get('pathId');
        const projectId = searchParams.get('projectId');

        switch (from) {
            case 'path':
                if (pathId) return `/learning-paths/${pathId}`;
                return '/learning-paths';
            case 'dashboard':
                return '/dashboard';
            case 'project':
                if (projectId) return `/projects/${projectId}`;
                return '/projects';
            default:
                return defaultUrl;
        }
    };

    /**
     * Get context-aware back button label
     */
    const getBackLabel = (defaultLabel: string): string => {
        const from = searchParams.get('from');

        switch (from) {
            case 'path':
                return 'Back to Learning Path';
            case 'dashboard':
                return 'Back to Dashboard';
            case 'project':
                return 'Back to Project';
            default:
                return defaultLabel;
        }
    };

    /**
     * Build navigation URL with context params preserved
     * Use when navigating forward to maintain the context chain
     */
    const buildNavUrl = (baseUrl: string, preserveContext = true): string => {
        if (!preserveContext) return baseUrl;

        const from = searchParams.get('from');
        const pathId = searchParams.get('pathId');
        const projectId = searchParams.get('projectId');

        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (pathId) params.set('pathId', pathId);
        if (projectId) params.set('projectId', projectId);

        const paramString = params.toString();
        return paramString ? `${baseUrl}?${paramString}` : baseUrl;
    };

    /**
     * Create a new navigation context for entering from a specific source
     */
    const createNavContext = (source: 'path' | 'dashboard' | 'project', id?: string): string => {
        const params = new URLSearchParams();
        params.set('from', source);

        if (source === 'path' && id) params.set('pathId', id);
        if (source === 'project' && id) params.set('projectId', id);

        return params.toString();
    };

    return {
        getBackUrl,
        getBackLabel,
        buildNavUrl,
        createNavContext,
        // Expose current context for debugging
        currentContext: {
            from: searchParams.get('from'),
            pathId: searchParams.get('pathId'),
            projectId: searchParams.get('projectId'),
        }
    };
}

export default useSmartNavigation;
