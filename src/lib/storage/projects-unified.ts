import { isTauri } from '../../utils/platform';
import { LocalProjectStorage, type LocalProject } from './local-projects';
import { userProjectsApi, projectsApi } from '../api/projects';
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
     * List all projects (local + cloud for desktop, cloud only for web)
     */
    static async listProjects(): Promise<UnifiedProject[]> {
        if (isTauri()) {
            // Desktop: Get both local and cloud projects
            const [localProjects, cloudResponse] = await Promise.all([
                LocalProjectStorage.listProjects(),
                userProjectsApi.list().catch(() => ({ data: [] })),
            ]);

            const cloudProjects = cloudResponse.data || [];

            // Merge and deduplicate
            const projectMap = new Map<string, UnifiedProject>();

            // Add local projects
            localProjects.forEach(p => {
                projectMap.set(p.id, {
                    id: p.id,
                    projectId: p.projectId,
                    name: p.name,
                    description: p.description,
                    category: p.category,
                    difficulty: p.difficulty,
                    isLocal: true,
                    isPublished: p.isPublished,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                });
            });

            // Add cloud projects (may override local if synced)
            cloudProjects.forEach((p: UserProject) => {
                const existing = projectMap.get(p.id);
                projectMap.set(p.id, {
                    id: p.id,
                    projectId: p.projectId,
                    name: p.project.name,
                    description: p.project.description,
                    category: p.project.category,
                    difficulty: p.project.difficulty,
                    isLocal: existing?.isLocal || false,
                    isPublished: true,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                });
            });

            return Array.from(projectMap.values()).sort((a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        } else {
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
    }

    /**
     * Get a single project (local or cloud)
     */
    static async getProject(projectId: string): Promise<UnifiedProject | null> {
        if (isTauri()) {
            // Try local first
            const localProject = await LocalProjectStorage.loadProject(projectId);
            if (localProject) {
                return {
                    id: localProject.id,
                    projectId: localProject.projectId,
                    name: localProject.name,
                    description: localProject.description,
                    category: localProject.category,
                    difficulty: localProject.difficulty,
                    isLocal: true,
                    isPublished: localProject.isPublished,
                    createdAt: localProject.createdAt,
                    updatedAt: localProject.updatedAt,
                };
            }

            // Fall back to cloud
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
        } else {
            // Web: Only cloud
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
    }

    /**
     * Create a new project (local on desktop, cloud on web)
     */
    static async createProject(
        projectId: string,
        projectData: {
            name: string;
            description: string;
            category: string;
            difficulty: string;
        }
    ): Promise<UnifiedProject> {
        if (isTauri()) {
            // Create locally
            const project: LocalProject = {
                id: crypto.randomUUID(),
                projectId,
                name: projectData.name,
                description: projectData.description,
                category: projectData.category,
                difficulty: projectData.difficulty,
                workspace: { files: [] },
                isPublished: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            await LocalProjectStorage.saveProject(project);

            return {
                id: project.id,
                projectId: project.projectId,
                name: project.name,
                description: project.description,
                category: project.category,
                difficulty: project.difficulty,
                isLocal: true,
                isPublished: false,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            };
        } else {
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
    }

    /**
     * Publish a local project to the cloud
     */
    static async publishProject(projectId: string): Promise<void> {
        if (!isTauri()) {
            throw new Error('Publishing is only available on desktop');
        }

        const localProject = await LocalProjectStorage.loadProject(projectId);
        if (!localProject) {
            throw new Error('Project not found');
        }

        // Sync to cloud
        const userProject = await userProjectsApi.start({ projectId: localProject.projectId });

        // Save workspace to cloud
        await userProjectsApi.saveWorkspace({
            userProjectId: userProject.id,
            workspace: localProject.workspace,
            files: localProject.workspace.files,
            openTabs: localProject.workspace.openTabs,
            activeTabPath: localProject.workspace.activeTabPath,
        });

        // Mark as published locally
        await LocalProjectStorage.publishProject(projectId);
    }

    /**
     * Delete a project (local and/or cloud)
     */
    static async deleteProject(projectId: string, deleteFromCloud: boolean = false): Promise<void> {
        if (isTauri()) {
            // Delete local copy
            await LocalProjectStorage.deleteProject(projectId);
        }

        if (deleteFromCloud) {
            // Delete from cloud
            await userProjectsApi.abandon(projectId);
        }
    }
}
