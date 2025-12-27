import { LearningPath } from '@/lib/api';

// Learning mode type from backend
export type LearningMode = 'ide' | 'notebook' | 'algorithm_visualizer' | 'query_builder' | 'live_preview';

// Category with learning mode
export interface CategoryWithMode {
    id: string;
    name: string;
    slug: string;
    learning_mode: LearningMode;
    mode_config: Record<string, any>;
}

// Workspace mode props
export interface WorkspaceModeProps {
    projectId: string;
    project?: any; // Will be typed properly when we have the full project type
    category?: CategoryWithMode;
}
