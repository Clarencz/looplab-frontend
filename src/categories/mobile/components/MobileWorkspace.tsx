// Placeholder for MobileWorkspace

import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'

export default function MobileWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Mobile Workspace</h2>
                <p className="text-muted-foreground">Coming soon! This will be implemented for mobile projects.</p>
                <p className="text-sm text-muted-foreground">Project: {project.name}</p>
            </div>
        </div>
    )
}
