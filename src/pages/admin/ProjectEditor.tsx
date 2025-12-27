import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, FileCode, Info } from 'lucide-react';
import { toast } from 'sonner';
import ProjectMetadataEditor from '@/components/admin/ProjectMetadataEditor';
import { apiClient } from '@/lib/api';

interface FileNode {
    name: string;
    type: string;
    status: string;
    intent?: string;
    content?: string;
    children?: FileNode[];
}

export default function ProjectEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'files' | 'metadata'>('files');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

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

    const files: FileNode[] = filesData?.files || [];

    const handleFileSelect = async (fileName: string) => {
        setSelectedFile(fileName);
        const file = files.find(f => f.name === fileName);
        if (file?.content) {
            setFileContent(file.content);
        }
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'files'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileCode className="h-4 w-4 inline mr-2" />
                            Files
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'files' ? (
                    <div className="grid grid-cols-12 gap-6">
                        {/* File Tree */}
                        <div className="col-span-3 bg-white rounded-lg shadow p-4">
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
                                            <span>{file.name}</span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded ${file.status === 'broken'
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
                        </div>

                        {/* Code Editor */}
                        <div className="col-span-9 bg-white rounded-lg shadow">
                            {selectedFile ? (
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-900">{selectedFile}</h3>
                                        <button
                                            onClick={handleSaveFile}
                                            disabled={isSaving}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                    <div className="flex-1 p-4">
                                        <textarea
                                            value={fileContent}
                                            onChange={(e) => setFileContent(e.target.value)}
                                            className="w-full h-full font-mono text-sm border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            style={{ minHeight: '600px' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-96">
                                    <p className="text-gray-500">Select a file to edit</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
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
