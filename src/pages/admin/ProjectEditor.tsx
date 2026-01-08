import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, FileCode, Info, Sparkles, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import ProjectMetadataEditor from '@/components/admin/ProjectMetadataEditor';
import AIPipelineChat from '@/components/admin/AIPipelineChat';
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
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [pendingLevels, setPendingLevels] = useState<PendingLevel[]>([]);
    const [selectedPendingFile, setSelectedPendingFile] = useState<FileNode | null>(null);
    const [selectedLevelName, setSelectedLevelName] = useState<string>('');

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

    const handleFileSelect = async (fileName: string) => {
        setSelectedFile(fileName);
        setSelectedPendingFile(null);
        const file = files.find(f => f.name === fileName);
        if (file?.content) {
            setFileContent(file.content);
        }
    };

    const handlePendingFileSelect = (file: FileNode, levelName: string) => {
        setSelectedFile(null);
        setSelectedPendingFile(file);
        setSelectedLevelName(levelName);
        setFileContent(file.content || '// AI-generated file');
    };

    const handleSaveFile = async () => {
        if (!selectedFile || !id) return;

        setIsSaving(true);
        try {
            await apiClient.put(`/admin/projects/${id}/files/${selectedFile}`, {
                content: fileContent,
            });

            toast.success('File saved successfully');
            refetchFiles();
        } catch (error) {
            toast.error('Failed to save file');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleApprovePendingFile = async () => {
        if (!selectedPendingFile || !id) return;

        setIsSaving(true);
        try {
            // Call backend API to approve the draft file
            await apiClient.post(`/admin/projects/${id}/draft-files/approve`, {
                levelName: selectedLevelName,
                fileName: selectedPendingFile.name,
                content: fileContent,
            });

            setSelectedPendingFile(null);
            setSelectedLevelName('');
            setFileContent('');
            toast.success(`File "${selectedPendingFile.name}" approved and added to project`);
            refetchFiles();
            refetchDrafts();
        } catch (error: any) {
            toast.error(`Failed to approve file: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRejectPendingFile = async () => {
        if (!selectedPendingFile || !id) return;

        setIsSaving(true);
        try {
            // Call backend API to reject the draft file
            await apiClient.delete(`/admin/projects/${id}/draft-files/${selectedPendingFile.name}`);

            setSelectedPendingFile(null);
            setSelectedLevelName('');
            setFileContent('');
            toast.info('File rejected');
            refetchDrafts();
        } catch (error: any) {
            toast.error(`Failed to reject file: ${error.message}`);
        } finally {
            setIsSaving(false);
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
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/projects')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
                                <p className="text-sm text-gray-500">{project.slug}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'files'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileCode className="h-4 w-4 inline mr-2" />
                            Files & AI
                        </button>
                        <button
                            onClick={() => setActiveTab('metadata')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'metadata'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Info className="h-4 w-4 inline mr-2" />
                            Metadata
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === 'files' && (
                    <div className="flex gap-4 h-[calc(100vh-200px)]">
                        {/* Panel 1: File Tree */}
                        <div className="flex-[2] min-w-[200px] bg-white rounded-lg shadow p-4 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Files</h3>
                            <div className="space-y-1">
                                {files.map((file) => (
                                    <button
                                        key={file.name}
                                        onClick={() => handleFileSelect(file.name)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFile === file.name
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">{file.name}</span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${file.status === 'broken'
                                                    ? 'bg-red-100 text-red-700'
                                                    : file.status === 'editable'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {file.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* AI-Generated Pending Levels */}
                            {pendingLevels.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        AI-Generated (Pending)
                                    </h3>
                                    {pendingLevels.map((level, levelIdx) => (
                                        <div key={levelIdx} className="mb-3">
                                            <p className="text-xs text-gray-500 mb-1">{level.name}</p>
                                            <div className="space-y-1 pl-2 border-l-2 border-purple-200">
                                                {level.files.map((file) => (
                                                    <button
                                                        key={file.name}
                                                        onClick={() => handlePendingFileSelect(file, level.name)}
                                                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedPendingFile?.name === file.name
                                                            ? 'bg-purple-50 text-purple-700 font-medium'
                                                            : 'text-gray-600 hover:bg-purple-50'
                                                            }`}
                                                    >
                                                        <span className="flex items-center">
                                                            <span className="text-yellow-500 mr-2">⏳</span>
                                                            {file.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Panel 2: Code Editor */}
                        <div className="flex-[4] min-w-[320px] bg-white rounded-lg shadow flex flex-col">
                            {selectedFile || selectedPendingFile ? (
                                <>
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {selectedFile || selectedPendingFile?.name}
                                            {selectedPendingFile && (
                                                <span className="ml-2 text-xs text-purple-600">(AI-generated)</span>
                                            )}
                                        </h3>
                                        {selectedFile && (
                                            <button
                                                onClick={handleSaveFile}
                                                disabled={isSaving}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                        )}
                                        {selectedPendingFile && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleApprovePendingFile}
                                                    disabled={isSaving}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={handleRejectPendingFile}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4">
                                        <textarea
                                            value={fileContent}
                                            onChange={(e) => setFileContent(e.target.value)}
                                            className="w-full h-full font-mono text-sm border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                                            style={{ minHeight: '500px' }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">Select a file to edit</p>
                                </div>
                            )}
                        </div>

                        {/* Panel 3: AI Chat */}
                        <div className="flex-[3] min-w-[280px] bg-white rounded-lg shadow overflow-hidden">
                            <AIPipelineChat
                                projectId={id!}
                                projectName={project.name}
                                files={files}
                                onLevelsGenerated={handleAIGeneratedLevels}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'metadata' && (
                    <ProjectMetadataEditor
                        projectId={id!}
                        project={project}
                        onUpdate={() => {
                            // Refetch project data after metadata update
                            window.location.reload();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

