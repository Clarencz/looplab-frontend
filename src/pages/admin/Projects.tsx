import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { Trash2, Search, FileCode, Clock, Target, AlertCircle, Github, Loader2, Eye, EyeOff, Sparkles, Upload, X, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminProjects() {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: projects, isLoading } = useQuery({
        queryKey: ['admin', 'projects', searchTerm, difficultyFilter],
        queryFn: () => adminApi.listProjects({
            search: searchTerm || undefined,
            difficulty: difficultyFilter || undefined,
        }),
    });

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // Export to GitHub state
    const [exportingId, setExportingId] = useState<string | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportTarget, setExportTarget] = useState<{ id: string; name: string } | null>(null);
    const [exportForm, setExportForm] = useState({
        orgOrUser: '',
        repoName: '',
        isPrivate: true,
    });

    const deleteMutation = useMutation({
        mutationFn: adminApi.deleteProject,
        onMutate: (projectId: string) => {
            setDeletingId(projectId);
        },
        onSuccess: () => {
            // Force refetch to get updated project list from server
            queryClient.refetchQueries({
                queryKey: ['admin', 'projects'],
                exact: false
            });
            toast.success('Project deleted successfully', {
                description: 'The project and all related data have been removed.',
            });
            setDeletingId(null);
            setPendingDeleteId(null);
        },
        onError: (error: Error) => {
            toast.error('Failed to delete project', {
                description: error.message || 'Please try again.',
            });
            setDeletingId(null);
            setPendingDeleteId(null);
        },
    });

    // Pillar 2: Status toggle mutation
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    const statusMutation = useMutation({
        mutationFn: ({ projectId, status }: { projectId: string; status: 'draft' | 'active' | 'archived' }) =>
            adminApi.updateProjectStatus(projectId, status),
        onMutate: ({ projectId }) => {
            setUpdatingStatusId(projectId);
        },
        onSuccess: (_, { status }) => {
            queryClient.refetchQueries({
                queryKey: ['admin', 'projects'],
                exact: false
            });
            toast.success(`Project ${status === 'active' ? 'activated' : 'deactivated'}`, {
                description: status === 'active'
                    ? 'Project is now visible to users.'
                    : 'Project is now hidden from users.',
            });
            setUpdatingStatusId(null);
        },
        onError: (error: Error) => {
            toast.error('Failed to update project status', {
                description: error.message || 'Please try again.',
            });
            setUpdatingStatusId(null);
        },
    });

    // Pillar 3: AI Pipeline mutation
    const [runningAiId, setRunningAiId] = useState<string | null>(null);

    const aiPipelineMutation = useMutation({
        mutationFn: (projectId: string) => adminApi.runAiPipeline(projectId),
        onMutate: (projectId) => {
            setRunningAiId(projectId);
        },
        onSuccess: (result: { message: string }) => {
            queryClient.refetchQueries({
                queryKey: ['admin', 'projects'],
                exact: false
            });
            toast.success('AI Analysis Complete', {
                description: result.message,
            });
            setRunningAiId(null);
        },
        onError: (error: Error) => {
            toast.error('AI Analysis Failed', {
                description: error.message || 'Please try again. Check if Gemini quota is available.',
            });
            setRunningAiId(null);
        },
    });

    // Pillar 4: Export to GitHub mutation
    const exportMutation = useMutation({
        mutationFn: ({ projectId, data }: { projectId: string; data: { orgOrUser: string; repoName: string; isPrivate: boolean } }) =>
            adminApi.exportProjectToGitHub(projectId, data),
        onMutate: ({ projectId }) => {
            setExportingId(projectId);
        },
        onSuccess: (result: { repoUrl: string }) => {
            toast.success('Exported to GitHub!', {
                description: `Repository created: ${result.repoUrl}`,
                action: {
                    label: 'Open',
                    onClick: () => window.open(result.repoUrl, '_blank'),
                },
            });
            setExportingId(null);
            setShowExportModal(false);
            setExportTarget(null);
            setExportForm({ orgOrUser: '', repoName: '', isPrivate: true });
        },
        onError: (error: Error) => {
            toast.error('Export Failed', {
                description: error.message || 'Check GitHub token and permissions.',
            });
            setExportingId(null);
        },
    });

    const handleExportClick = (project: { id: string; name: string }) => {
        setExportTarget(project);
        setExportForm({
            orgOrUser: '',
            repoName: project.name.toLowerCase().replace(/\s+/g, '-'),
            isPrivate: true,
        });
        setShowExportModal(true);
    };

    const handleExportSubmit = () => {
        if (!exportTarget || !exportForm.orgOrUser || !exportForm.repoName) {
            toast.error('Please fill in all fields');
            return;
        }
        exportMutation.mutate({
            projectId: exportTarget.id,
            data: exportForm,
        });
    };

    const handleDeleteClick = (id: string) => {
        if (pendingDeleteId === id) {
            // Second click - confirm delete
            deleteMutation.mutate(id);
        } else {
            // First click - set pending state
            setPendingDeleteId(id);
            // Auto-cancel after 3 seconds
            setTimeout(() => {
                setPendingDeleteId((current) => current === id ? null : current);
            }, 3000);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-blue-100 text-blue-800';
            case 'advanced':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Project Management</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage coding projects for users</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/projects/import')}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
                    >
                        <Github className="w-5 h-5" />
                        <span className="whitespace-nowrap">Import from GitHub</span>
                    </button>
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900">Create & Edit Features Coming Soon</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Project creation and editing UI is under development. Currently, you can view and delete existing projects.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                        Projects ({projects?.length || 0})
                    </h2>
                </div>

                {isLoading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="mt-2">Loading projects...</p>
                    </div>
                ) : projects?.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        <FileCode className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm mt-1">Create your first project to get started</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {projects?.map((project: any) => (
                            <div
                                key={project.id}
                                className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                                {project.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                                                {project.difficulty}
                                            </span>
                                            {/* Status Badge */}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : project.status === 'archived'
                                                    ? 'bg-gray-100 text-gray-500'
                                                    : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {project.status || 'draft'}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {project.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{project.estimatedTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
                                                <span>{project.targetSkill}</span>
                                            </div>
                                            {project.techStack && project.techStack.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    {project.techStack.slice(0, 3).map((tech: any, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                        >
                                                            {tech.name || tech}
                                                        </span>
                                                    ))}
                                                    {project.techStack.length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{project.techStack.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons - Wrap on mobile */}
                                    <div className="flex items-center flex-wrap gap-2 mt-3 sm:mt-0 sm:ml-4 justify-end">
                                        {/* Status Toggle Button */}
                                        <button
                                            onClick={() => statusMutation.mutate({
                                                projectId: project.id,
                                                status: project.status === 'active' ? 'draft' : 'active'
                                            })}
                                            className={`p-2 rounded-lg transition-colors ${project.status === 'active'
                                                ? 'bg-green-50 hover:bg-green-100'
                                                : 'bg-amber-50 hover:bg-amber-100'
                                                } ${updatingStatusId === project.id ? 'opacity-50' : ''}`}
                                            title={project.status === 'active' ? 'Deactivate (hide from users)' : 'Activate (make visible)'}
                                            disabled={statusMutation.isPending}
                                        >
                                            {updatingStatusId === project.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : project.status === 'active' ? (
                                                <Eye className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-amber-600" />
                                            )}
                                        </button>

                                        {/* AI Processing Button (only for draft projects) */}
                                        {project.status !== 'active' && (
                                            <button
                                                onClick={() => aiPipelineMutation.mutate(project.id)}
                                                className={`p-2 rounded-lg transition-colors bg-purple-50 hover:bg-purple-100 ${runningAiId === project.id ? 'opacity-50' : ''
                                                    }`}
                                                title="Run AI Analysis"
                                                disabled={aiPipelineMutation.isPending}
                                            >
                                                {runningAiId === project.id ? (
                                                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        )}

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                                            className="p-2 rounded-lg transition-colors hover:bg-blue-50"
                                            title="Edit Project Files"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>

                                        {/* Export to GitHub Button */}
                                        <button
                                            onClick={() => handleExportClick(project)}
                                            className="p-2 rounded-lg transition-colors hover:bg-blue-50"
                                            title="Export to GitHub"
                                            disabled={exportMutation.isPending}
                                        >
                                            {exportingId === project.id ? (
                                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-blue-600" />
                                            )}
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteClick(project.id)}
                                            className={`p-2 rounded-lg transition-colors ${pendingDeleteId === project.id
                                                ? 'bg-red-500 text-white'
                                                : deletingId === project.id
                                                    ? 'bg-red-100'
                                                    : 'hover:bg-red-50'
                                                } ${deleteMutation.isPending && deletingId !== project.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title={pendingDeleteId === project.id ? "Click again to confirm delete" : "Delete"}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deletingId === project.id ? (
                                                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                                            ) : pendingDeleteId === project.id ? (
                                                <span className="text-xs font-medium px-1">Confirm?</span>
                                            ) : (
                                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Export to GitHub Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Github className="w-5 h-5" />
                                Export to GitHub
                            </h3>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Export <strong>{exportTarget?.name}</strong> to a new GitHub repository.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Organization or Username *
                                </label>
                                <input
                                    type="text"
                                    value={exportForm.orgOrUser}
                                    onChange={(e) => setExportForm(f => ({ ...f, orgOrUser: e.target.value }))}
                                    placeholder="e.g., looplabs or your-username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Repository Name *
                                </label>
                                <input
                                    type="text"
                                    value={exportForm.repoName}
                                    onChange={(e) => setExportForm(f => ({ ...f, repoName: e.target.value }))}
                                    placeholder="e.g., my-project"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPrivate"
                                    checked={exportForm.isPrivate}
                                    onChange={(e) => setExportForm(f => ({ ...f, isPrivate: e.target.checked }))}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                                    Private repository
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportSubmit}
                                disabled={exportMutation.isPending || !exportForm.orgOrUser || !exportForm.repoName}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {exportMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Export
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
