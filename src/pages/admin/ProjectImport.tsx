import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/admin';
import { ArrowLeft, Github, Loader2, CheckCircle, AlertCircle, FileCode, Zap, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import AiMetadataPreviewModal from '@/components/admin/AiMetadataPreviewModal';

export default function ProjectImport() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        repoUrl: '',
        githubToken: '',
    });
    const [importedProjectId, setImportedProjectId] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiModal, setAiModal] = useState<{
        isOpen: boolean;
        type: 'all' | null;
        data: any;
    }>({ isOpen: false, type: null, data: null });

    // Basic import mutation (no AI - instant)
    const importMutation = useMutation({
        mutationFn: (data: typeof formData) => adminApi.importGitHubBasic(data),
        onSuccess: (response) => {
            setImportedProjectId(response.projectId);
            setImportSuccess(true);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        importMutation.mutate(formData);
    };

    const handleBack = () => {
        navigate('/admin/projects');
    };

    const handleGenerateAiMetadata = async () => {
        if (!importedProjectId) return;

        setIsGeneratingAi(true);
        try {
            // Call all 3 AI endpoints
            const [descResponse, narrativeResponse, metadataResponse] = await Promise.all([
                apiClient.post(`/admin/projects/${importedProjectId}/ai/generate-description`, {}),
                apiClient.post(`/admin/projects/${importedProjectId}/ai/generate-narrative`, {}),
                apiClient.post(`/admin/projects/${importedProjectId}/ai/suggest-metadata`, {}),
            ]);

            // Show preview modal with all AI suggestions
            setAiModal({
                isOpen: true,
                type: 'all',
                data: {
                    description: descResponse.description,
                    narrative: narrativeResponse.narrative,
                    ...metadataResponse,
                },
            });
        } catch (error) {
            toast.error('Failed to generate AI metadata');
            console.error(error);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleApplyAiMetadata = async () => {
        if (!importedProjectId || !aiModal.data) return;

        try {
            // Apply all AI suggestions to the project
            await apiClient.patch(`/admin/projects/${importedProjectId}/metadata`, aiModal.data);

            toast.success('AI metadata applied successfully!');
            setAiModal({ isOpen: false, type: null, data: null });

            // Navigate to project editor
            navigate(`/admin/projects/${importedProjectId}/edit`);
        } catch (error) {
            toast.error('Failed to apply AI metadata');
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Projects
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Import Project from GitHub</h1>
                <p className="text-gray-600 mt-2">
                    Import a project repository and its files. AI processing can be run separately.
                </p>
            </div>

            {/* Info Banner */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900">Fast Import</h3>
                        <p className="text-sm text-blue-800">
                            Projects are imported instantly as drafts. Use the AI Processing screen to
                            analyze and "break" projects for the curriculum.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
                {!importSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub Repository URL
                            </label>
                            <div className="relative">
                                <Github className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="url"
                                    required
                                    value={formData.repoUrl}
                                    onChange={(e) =>
                                        setFormData({ ...formData, repoUrl: e.target.value })
                                    }
                                    placeholder="https://github.com/your-org/project-repo"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Enter the full URL of the GitHub repository
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub Personal Access Token
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.githubToken}
                                onChange={(e) =>
                                    setFormData({ ...formData, githubToken: e.target.value })
                                }
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Token needs <code className="bg-gray-100 px-1 rounded">repo</code> scope to access repository contents
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <FileCode className="w-5 h-5" />
                                What will be imported?
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>• All text files from the repository</li>
                                <li>• File structure preserved as a tree</li>
                                <li>• Project created as <span className="font-medium text-amber-600">Draft</span> status</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={importMutation.isPending}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {importMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Github className="w-5 h-5 mr-2" />
                                    Import Project
                                </>
                            )}
                        </button>

                        {/* Error State */}
                        {importMutation.isError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Import Failed</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        {(importMutation.error as any)?.message || 'An error occurred during import'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </form>
                ) : (
                    /* Success State */
                    <div className="text-center space-y-6">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Import Completed!
                            </h2>
                            <p className="text-gray-600">
                                Project imported successfully as a <span className="font-medium text-amber-600">Draft</span>
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">Project ID:</p>
                            <code className="text-sm font-mono bg-white px-3 py-2 rounded border">
                                {importedProjectId}
                            </code>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                            <h3 className="font-semibold text-amber-900 mb-2">Next Steps</h3>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>1. Review the imported files in the project detail</li>
                                <li>2. Run AI Processing to generate curriculum content</li>
                                <li>3. Activate the project to make it visible to users</li>
                            </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-purple-900 mb-1">Generate Metadata with AI</h3>
                                    <p className="text-sm text-purple-800 mb-3">
                                        Let AI analyze your project and suggest description, narrative, and learning metadata.
                                    </p>
                                    <button
                                        onClick={handleGenerateAiMetadata}
                                        disabled={isGeneratingAi}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isGeneratingAi ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Generate with AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(`/admin/projects/${importedProjectId}`)}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                View Project
                            </button>
                            <button
                                onClick={() => navigate('/admin/projects')}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Back to Projects
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Metadata Preview Modal */}
            <AiMetadataPreviewModal
                isOpen={aiModal.isOpen}
                data={aiModal.data}
                onClose={() => setAiModal({ isOpen: false, type: null, data: null })}
                onApply={handleApplyAiMetadata}
            />
        </div>
    );
}
