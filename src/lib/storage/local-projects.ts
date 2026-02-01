import type { WorkspaceFile } from '@/lib/api/projects';

// Helper to dynamically import Tauri FS API
const getFs = async () => {
    try {
        return await import('@tauri-apps/plugin-fs');
    } catch (e) {
        console.error('Tauri FS API not available');
        throw e;
    }
};

export interface LocalProject {
    id: string;
    projectId: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    workspace: {
        files: WorkspaceFile[];
        openTabs?: string[];
        activeTabPath?: string;
    };
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    lastSyncedAt?: string;
}

export class LocalProjectStorage {
    private static PROJECTS_DIR = 'looplab/projects';

    /**
     * Initialize local storage directory
     */
    static async init(): Promise<void> {
        const fs = await getFs();
        const projectsPath = this.PROJECTS_DIR;
        const dirExists = await fs.exists(projectsPath, { dir: fs.BaseDirectory.AppData });

        if (!dirExists) {
            await fs.createDir(projectsPath, { dir: fs.BaseDirectory.AppData, recursive: true });
        }
    }

    /**
     * Save project to local storage
     */
    static async saveProject(project: LocalProject): Promise<void> {
        await this.init();
        const fs = await getFs();

        const projectDir = `${this.PROJECTS_DIR}/${project.id}`;
        const dirExists = await fs.exists(projectDir, { dir: fs.BaseDirectory.AppData });

        if (!dirExists) {
            await fs.createDir(projectDir, { dir: fs.BaseDirectory.AppData, recursive: true });
        }

        const metadataPath = `${projectDir}/project.json`;
        await fs.writeTextFile(metadataPath, JSON.stringify(project, null, 2), {
            dir: fs.BaseDirectory.AppData,
        });
    }

    /**
     * Load project from local storage
     */
    static async loadProject(projectId: string): Promise<LocalProject | null> {
        try {
            const fs = await getFs();
            const metadataPath = `${this.PROJECTS_DIR}/${projectId}/project.json`;
            const content = await fs.readTextFile(metadataPath, { dir: fs.BaseDirectory.AppData });
            return JSON.parse(content);
        } catch (error) {
            console.error(`Failed to load project ${projectId}:`, error);
            return null;
        }
    }

    /**
     * List all local projects
     */
    static async listProjects(): Promise<LocalProject[]> {
        await this.init();
        const fs = await getFs();

        try {
            const entries = await fs.readDir(this.PROJECTS_DIR, { dir: fs.BaseDirectory.AppData });
            const projects: LocalProject[] = [];

            for (const entry of entries) {
                if (entry.children) { // It's a directory
                    const project = await this.loadProject(entry.name!);
                    if (project) {
                        projects.push(project);
                    }
                }
            }

            return projects.sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        } catch (error) {
            console.error('Failed to list projects:', error);
            return [];
        }
    }

    /**
     * Delete project from local storage
     */
    static async deleteProject(projectId: string): Promise<void> {
        const project = await this.loadProject(projectId);
        if (project) {
            // Mark as deleted (Tauri doesn't have built-in recursive delete easily accessible without verification)
            // Ideally we should use removeDir with recursive: true
            const fs = await getFs();
            try {
                await fs.removeDir(`${this.PROJECTS_DIR}/${projectId}`, { dir: fs.BaseDirectory.AppData, recursive: true });
            } catch (e) {
                console.error("Failed to delete project directory", e);
                // Fallback to soft delete/update if needed, but removeDir is standard
            }
        }
    }

    /**
     * Mark project as published (ready for cloud sync)
     */
    static async publishProject(projectId: string): Promise<void> {
        const project = await this.loadProject(projectId);
        if (project) {
            project.isPublished = true;
            project.lastSyncedAt = new Date().toISOString();
            await this.saveProject(project);
        }
    }

    /**
     * Update workspace for a project
     */
    static async updateWorkspace(
        projectId: string,
        workspace: {
            files: WorkspaceFile[];
            openTabs?: string[];
            activeTabPath?: string;
        }
    ): Promise<void> {
        const project = await this.loadProject(projectId);
        if (project) {
            project.workspace = workspace;
            project.updatedAt = new Date().toISOString();
            await this.saveProject(project);
        }
    }
}
