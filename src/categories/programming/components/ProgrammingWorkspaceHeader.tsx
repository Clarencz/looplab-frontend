// Programming Workspace Header Component

import { Loader2 } from 'lucide-react';
import type { Project } from '@/types';

interface WorkspaceState {
    isExecuting: boolean;
    isValidating: boolean;
}

interface ProgrammingWorkspaceHeaderProps {
    project: Project;
    category?: any;
    state: WorkspaceState;
    onExecute: () => void;
    onValidate: () => void;
    onStartTutoring: () => void;
    hasValidationResult: boolean;
}

export function ProgrammingWorkspaceHeader({
    project,
    category,
    state,
    onExecute,
    onValidate,
    onStartTutoring,
    hasValidationResult,
}: ProgrammingWorkspaceHeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
                <h1 className="text-xl font-bold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                    {category?.name || 'Programming & Software'}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onExecute}
                    disabled={state.isExecuting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                >
                    {state.isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
                </button>
                <button
                    onClick={onValidate}
                    disabled={state.isValidating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {state.isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                </button>
                {hasValidationResult && (
                    <button
                        onClick={onStartTutoring}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                    >
                        👨‍💻 AI Assistance
                    </button>
                )}
            </div>
        </header>
    );
}
