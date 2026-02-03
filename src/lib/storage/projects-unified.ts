import { userProjectsApi } from '../api/projects';
import type { UserProject } from '../api/types';

export interface UnifiedProject {
    id: string;
    projectId: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    isLocal: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export class UnifiedProjectService {
    /**
     * List all projects (Cloud only for Web)
     */
    static async listProjects(): Promise<UnifiedProject[]> {
        // Web: Only cloud projects
        const response = await userProjectsApi.list();
        return (response.data || []).map((p: UserProject) => ({
            id: p.id,
            projectId: p.projectId,
            name: p.project.name,
            description: p.project.description,
            category: p.project.category,
            difficulty: p.project.difficulty,
            isLocal: false,
            isPublished: true,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }

    /**
     * Get a single project (Cloud only)
     */
    static async getProject(projectId: string): Promise<UnifiedProject | null> {
        try {
            const userProject = await userProjectsApi.get(projectId);
            return {
                id: userProject.id,
                projectId: userProject.projectId,
                name: userProject.project.name,
                description: userProject.project.description,
                category: userProject.project.category,
                difficulty: userProject.project.difficulty,
                isLocal: false,
                isPublished: true,
                createdAt: userProject.createdAt,
                updatedAt: userProject.updatedAt,
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Create a new project (Cloud only)
     */
    static async createProject(
        projectId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _projectData: {
            name: string;
            description: string;
            category: string;
            difficulty: string;
        }
    ): Promise<UnifiedProject> {
        // Create in cloud
        const userProject = await userProjectsApi.start({ projectId });
        return {
            id: userProject.id,
            projectId: userProject.projectId,
            name: userProject.project.name,
            description: userProject.project.description,
            category: userProject.project.category,
            difficulty: userProject.project.difficulty,
            isLocal: false,
            isPublished: true,
            createdAt: userProject.createdAt,
            updatedAt: userProject.updatedAt,
        };
    }

    /**
     * Publish project (Not available on Web)
     */
    static async publishProject(_projectId: string): Promise<void> {
        throw new Error('Publishing is only available on desktop');
    }

    /**
     * Delete a project (Cloud only)
     */
    static async deleteProject(projectId: string, deleteFromCloud: boolean = false): Promise<void> {
        if (deleteFromCloud) {
            // Delete from cloud
            await userProjectsApi.abandon(projectId);
        }
    }
}
