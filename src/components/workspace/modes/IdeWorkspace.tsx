/**
 * IdeWorkspace - Full IDE mode workspace
 * 
 * This is the default workspace mode with:
 * - File tree
 * - Code editor with tabs
 * - Terminal
 * - Project submission
 * - Validation
 * 
 * NOTE: Currently this is a placeholder that will be properly extracted
 * from Workspace.tsx in a future refactoring. For now, it ensures the
 * ModeRouter architecture works without breaking existing functionality.
 */

import { WorkspaceModeProps } from '../types';

export default function IdeWorkspace({ projectId, project, category }: WorkspaceModeProps) {
    // TODO: Extract the actual IDE workspace implementation from Workspace.tsx
    // For now, this is handled by the parent Workspace component

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">IDE Workspace</h2>
                <p className="text-muted-foreground">
                    IDE workspace is currently rendered by the parent Workspace component.
                </p>
                <p className="text-sm text-muted-foreground">
                    This placeholder will be replaced with the extracted IDE implementation.
                </p>
            </div>
        </div>
    );
}
