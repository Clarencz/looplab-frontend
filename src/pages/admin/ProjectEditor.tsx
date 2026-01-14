import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, FileCode, Info, Sparkles, Check, X, FolderTree, MessageSquare } from 'lucide-react';
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
    // Mobile panel state - which panel is shown on mobile
    const [mobilePanel, setMobilePanel] = useState<'tree' | 'editor' | 'chat'>('tree');
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
        // On mobile, switch to editor panel when file is selected
        setMobilePanel('editor');
    };

    const handlePendingFileSelect = (file: FileNode, levelName: string) => {
        setSelectedFile(null);
        setSelectedPendingFile(file);
        setSelectedLevelName(levelName);
        setFileContent(file.content || '// AI-generated file');
        // On mobile, switch to editor panel
        setMobilePanel('editor');
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
            // On mobile, go back to tree
            setMobilePanel('tree');
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
            // On mobile, go back to tree
            setMobilePanel('tree');
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
            // On mobile, go to tree to see new files
            setMobilePanel('tree');
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

    // Mobile panel tabs for Files & AI view
    const mobilePanelTabs = [
        { id: 'tree', label: 'Files', icon: FolderTree },
        { id: 'editor', label: 'Editor', icon: FileCode },
        { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    ] as const;

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
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {activeTab === 'files' && (
                    <>
                        {/* Mobile Panel Tabs */}
                        <div className="lg:hidden mb-4">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {mobilePanelTabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setMobilePanel(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-colors ${mobilePanel === tab.id
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        <span className="hidden xs:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: Three Panel Layout / Mobile: Single Panel */}
                        <div className="flex gap-4 h-[calc(100vh-240px)] sm:h-[calc(100vh-200px)]">
                            {/* Panel 1: File Tree */}
                            <div className={`lg:flex lg:flex-[2] lg:min-w-[180px] bg-white rounded-lg shadow p-3 sm:p-4 overflow-y-auto ${mobilePanel === 'tree' ? 'flex flex-col w-full' : 'hidden'
                                }`}>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Project Files</h3>
                                <div className="space-y-1">
                                    {files.map((file) => (
                                        <button
                                            key={file.name}
                                            onClick={() => handleFileSelect(file.name)}
                                            className={`w-full text-left px-2 sm:px-3 py-2 rounded-md text-sm ${selectedFile === file.name
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate flex-1">{file.name}</span>
                                                <span
                                                    className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${file.status === 'broken'
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
                                                            className={`w-full text-left px-2 sm:px-3 py-2 rounded-md text-sm ${selectedPendingFile?.name === file.name
                                                                ? 'bg-purple-50 text-purple-700 font-medium'
                                                                : 'text-gray-600 hover:bg-purple-50'
                                                                }`}
                                                        >
                                                            <span className="flex items-center">
                                                                <span className="text-yellow-500 mr-2">⏳</span>
                                                                <span className="truncate">{file.name}</span>
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
                            <div className={`lg:flex lg:flex-col lg:flex-[4] lg:min-w-[280px] bg-white rounded-lg shadow ${mobilePanel === 'editor' ? 'flex flex-col w-full' : 'hidden'
                                }`}>
                                {selectedFile || selectedPendingFile ? (
                                    <>
                                        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                {selectedFile || selectedPendingFile?.name}
                                                {selectedPendingFile && (
                                                    <span className="ml-2 text-xs text-purple-600">(AI-generated)</span>
                                                )}
                                            </h3>
                                            {selectedFile && (
                                                <button
                                                    onClick={handleSaveFile}
                                                    disabled={isSaving}
                                                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    <Save className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                                                </button>
                                            )}
                                            {selectedPendingFile && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleApprovePendingFile}
                                                        disabled={isSaving}
                                                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <Check className="h-4 w-4 sm:mr-1" />
                                                        <span className="hidden sm:inline">Approve</span>
                                                    </button>
                                                    <button
                                                        onClick={handleRejectPendingFile}
                                                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
                                                    >
                                                        <X className="h-4 w-4 sm:mr-1" />
                                                        <span className="hidden sm:inline">Reject</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 p-3 sm:p-4">
                                            <textarea
                                                value={fileContent}
                                                onChange={(e) => setFileContent(e.target.value)}
                                                className="w-full h-full font-mono text-xs sm:text-sm border border-gray-300 rounded-md p-3 sm:p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                                                style={{ minHeight: '300px' }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500 text-sm">Select a file to edit</p>
                                    </div>
                                )}
                            </div>

                            {/* Panel 3: AI Chat */}
                            <div className={`lg:flex lg:flex-col lg:flex-[3] lg:min-w-[240px] bg-white rounded-lg shadow overflow-hidden ${mobilePanel === 'chat' ? 'flex flex-col w-full' : 'hidden'
                                }`}>
                                <AIPipelineChat
                                    projectId={id!}
                                    projectName={project.name}
                                    files={files}
                                    onLevelsGenerated={handleAIGeneratedLevels}
                                />
                            </div>
                        </div>
                    </>
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
