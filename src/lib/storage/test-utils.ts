import { LocalProjectStorage, type LocalProject } from './local-projects';
import { UnifiedProjectService } from './projects-unified';

/**
 * Test utility for local project storage
 * This demonstrates how to use the local storage APIs
 */
export class ProjectStorageTest {
    /**
     * Create a sample local project
     */
    static async createSampleProject(): Promise<void> {
        const sampleProject: LocalProject = {
            id: crypto.randomUUID(),
            projectId: 'sample-project-id',
            name: 'My First Local Project',
            description: 'A test project stored locally on desktop',
            category: 'programming',
            difficulty: 'beginner',
            workspace: {
                files: [
                    {
                        path: '/src',
                        name: 'src',
                        type: 'folder',
                        children: [
                            {
                                path: '/src/index.js',
                                name: 'index.js',
                                type: 'file',
                                content: 'console.log("Hello from local storage!");',
                            },
                        ],
                    },
                ],
                openTabs: ['/src/index.js'],
                activeTabPath: '/src/index.js',
            },
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await LocalProjectStorage.saveProject(sampleProject);
        console.log('✅ Sample project created:', sampleProject.id);
    }

    /**
     * List all local projects
     */
    static async listAllProjects(): Promise<void> {
        const projects = await LocalProjectStorage.listProjects();
        console.log(`📁 Found ${projects.length} local projects:`);
        projects.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name} (${p.isPublished ? 'Published' : 'Local Only'})`);
        });
    }

    /**
     * Test unified service (merges local + cloud)
     */
    static async testUnifiedService(): Promise<void> {
        const allProjects = await UnifiedProjectService.listProjects();
        console.log(`🔄 Unified service found ${allProjects.length} total projects:`);

        const localOnly = allProjects.filter(p => p.isLocal && !p.isPublished);
        const published = allProjects.filter(p => p.isPublished);

        console.log(`  - ${localOnly.length} local only`);
        console.log(`  - ${published.length} published`);
    }
}

// Example usage (for testing in browser console on desktop):
// import { ProjectStorageTest } from '@/lib/storage/test-utils';
// await ProjectStorageTest.createSampleProject();
// await ProjectStorageTest.listAllProjects();
// await ProjectStorageTest.testUnifiedService();
