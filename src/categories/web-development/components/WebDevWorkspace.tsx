// Placeholder for WebDevWorkspace

import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'

export default function WebDevWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Web Development Workspace</h2>
                <p className="text-muted-foreground">Coming soon! This will be implemented for web development projects.</p>
                <p className="text-sm text-muted-foreground">Project: {project.name}</p>
            </div>
        </div>
    )
}
