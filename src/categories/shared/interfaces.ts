// Category Workspace Props Interface
// Shared interface for all category workspace components

import type { Category } from '@/lib/api/types'

export interface ProjectData {
    id: string
    name: string
    slug: string
    description: string
    techStack: string[]
    difficulty: string
    starterFiles?: { path: string; content: string }[]
}

export interface CategoryWorkspaceProps {
    projectId: string
    project: ProjectData
    category: Category | null
}

export interface WorkspaceFile {
    path: string
    content: string
}

export interface ExecutionLog {
    type: 'stdout' | 'stderr' | 'system'
    message: string
    timestamp: string
}
