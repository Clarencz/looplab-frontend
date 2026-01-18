import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, FileCode, Info } from 'lucide-react';
import { toast } from 'sonner';
import ProjectMetadataEditor from '@/components/admin/ProjectMetadataEditor';
import AdminMonacoWorkspace from '@/components/admin/AdminMonacoWorkspace';
import { apiClient } from '@/lib/api';

interface FileNode {
    name: string;
    type: string;
    status: string;
    intent?: string;
    content?: string;
    children?: FileNode[];
    isPending?: boolean; // AI-generated pending approval
}

interface PendingLevel {
    name: string;
    files: FileNode[];
}

export default function ProjectEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'files' | 'metadata'>('files');
    // Draft file state (for AI-generated pending files)
    const [pendingLevels, setPendingLevels] = useState<PendingLevel[]>([]);

    // Fetch project data
    const { data: project, isLoading: projectLoading } = useQuery({
        queryKey: ['admin', 'project', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/projects/${id}`);
            return response;
        },
        enabled: !!id,
    });

    // Fetch project files
    const { data: filesData, isLoading: filesLoading, refetch: refetchFiles } = useQuery({
        queryKey: ['admin', 'project-files', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/projects/${id}/files`);
            return response;
        },
        enabled: !!id,
    });

    // Fetch draft files from backend
    const { data: draftData, refetch: refetchDrafts } = useQuery({
        queryKey: ['admin', 'draft-files', id],
        queryFn: async () => {
            const response = await apiClient.get(`/admin/projects/${id}/draft-files`);
            return response;
        },
        enabled: !!id,
    });

    // Sync backend drafts to state
    useEffect(() => {
        if (draftData?.levels) {
            setPendingLevels(draftData.levels);
        }
    }, [draftData]);

    const files: FileNode[] = filesData?.files || [];

    // Note: File selection and saving is now handled by AdminMonacoWorkspace
    // via useMonacoEditor hook with auto-save functionality

    // Draft file approval/rejection handlers
    const handleApproveDraftFile = async (levelName: string, fileName: string) => {
        if (!id) return;

        try {
            await apiClient.post(`/admin/projects/${id}/draft-files/approve`, {
                levelName,
                fileName,
            });
            toast.success(`File "${fileName}" approved and added to project`);
            refetchFiles();
            refetchDrafts();
        } catch (error: any) {
            toast.error(`Failed to approve file: ${error.message}`);
        }
    };

    const handleRejectDraftFile = async (fileName: string) => {
        if (!fileName || !id) return;

        try {
            await apiClient.delete(`/admin/projects/${id}/draft-files/${fileName}`);
            toast.info('File rejected');
            refetchDrafts();
        } catch (error: any) {
            toast.error(`Failed to reject file: ${error.message}`);
        }
    };

    // Callback for AI to add generated levels (saves to backend)
    const handleAIGeneratedLevels = async (levels: PendingLevel[]) => {
        if (!id) return;

        try {
            // Save drafts to backend
            await apiClient.post(`/admin/projects/${id}/draft-files`, { levels });
            toast.success(`AI generated ${levels.length} level(s). Review in the file tree.`);
            refetchDrafts();
        } catch (error: any) {
            // Fallback to client-side if API fails
            setPendingLevels(prev => [...prev, ...levels]);
            toast.success(`AI generated ${levels.length} level(s). (Saved locally)`);
        }
    };

    if (projectLoading || filesLoading) {
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
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                            <button
                                onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                                className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Eye className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Preview</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'files'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileCode className="h-4 w-4 inline mr-1.5 sm:mr-2" />
                            Files & AI
                        </button>
                        <button
                            onClick={() => setActiveTab('metadata')}
                            className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'metadata'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Info className="h-4 w-4 inline mr-1.5 sm:mr-2" />
                            Metadata
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'files' ? (
                // Full-screen Monaco workspace (no padding, touches edges)
                <div className="h-[calc(100vh-120px)]">
                    <AdminMonacoWorkspace
                        projectId={id!}
                        files={files}
                        onFileSave={async (fileName: string, content: string) => {
                            try {
                                await apiClient.put(`/admin/projects/${id}/files/${fileName}`, {
                                    content,
                                });
                                toast.success(`Saved ${fileName}`);
                                refetchFiles();
                            } catch (error: any) {
                                toast.error(`Failed to save ${fileName}`, {
                                    description: error.message,
                                });
                                throw error;
                            }
                        }}
                        className="h-full w-full"
                    />
                </div>
            ) : (
                // Metadata tab with padding
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
            )}
        </div>
    );
}
