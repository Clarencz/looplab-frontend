import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import ProjectMetadataEditor from '@/components/admin/ProjectMetadataEditor';
import { apiClient } from '@/lib/api';

export default function ProjectEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch project data
    const { data: project, isLoading: projectLoading } = useQuery<any>({
        queryKey: ['admin', 'project', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/projects/${id}`);
            return response.data || response;
        },
        enabled: !!id,
    });

    if (projectLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Project not found</p>
                    <button
                        onClick={() => navigate('/admin/projects')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                            <button
                                onClick={() => navigate('/admin/projects')}
                                className="text-gray-600 hover:text-gray-900 flex-shrink-0"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{project.name}</h1>
                                <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{project.slug}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content - Metadata Editor only */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <ProjectMetadataEditor
                    projectId={id!}
                    project={project}
                    onUpdate={() => {
                        // Refetch project data after metadata update
                        window.location.reload();
                    }}
                />
            </div>
        </div>
    );
}
