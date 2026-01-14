import { useState, useEffect } from 'react';
import { Save, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import AiSuggestionModal from './AiSuggestionModal';

interface ProjectMetadataEditorProps {
    projectId: string;
    project: any;
    onUpdate: () => void;
}

export default function ProjectMetadataEditor({ projectId, project, onUpdate }: ProjectMetadataEditorProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiModal, setAiModal] = useState<{
        isOpen: boolean;
        title: string;
        suggestion: string;
        field: string;
    }>({ isOpen: false, title: '', suggestion: '', field: '' });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        narrative: '',
        difficulty: 'beginner',
        estimatedTime: '',
        estimatedTimeMinutes: 0,
        targetSkill: '',
        learningOutcome: '',
        coverImage: '',
        tier: 'free',
        curriculumPosition: 0,
        status: 'draft',
    });

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || '',
                description: project.description || '',
                narrative: project.narrative || '',
                difficulty: project.difficulty || 'beginner',
                estimatedTime: project.estimatedTime || '',
                estimatedTimeMinutes: project.estimatedTimeMinutes || 0,
                targetSkill: project.targetSkill || '',
                learningOutcome: project.learningOutcome || '',
                coverImage: project.coverImage || '',
                tier: project.tier || 'free',
                curriculumPosition: project.curriculumPosition || 0,
                status: project.status || 'draft',
            });
        }
    }, [project]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.patch(`/admin/projects/${projectId}/metadata`, formData);

            toast.success('Metadata saved successfully');
            onUpdate();
        } catch (error) {
            toast.error('Failed to save metadata');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            const response = await apiClient.post(`/admin/projects/${projectId}/ai/generate-description`, {});
            setAiModal({
                isOpen: true,
                title: 'AI-Generated Description',
                suggestion: response.description,
                field: 'description',
            });
        } catch (error) {
            toast.error('Failed to generate description');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateNarrative = async () => {
        setIsGenerating(true);
        try {
            const response = await apiClient.post(`/admin/projects/${projectId}/ai/generate-narrative`, {});
            setAiModal({
                isOpen: true,
                title: 'AI-Generated Narrative',
                suggestion: response.narrative,
                field: 'narrative',
            });
        } catch (error) {
            toast.error('Failed to generate narrative');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSuggestMetadata = async () => {
        setIsGenerating(true);
        try {
            const response = await apiClient.post(`/admin/projects/${projectId}/ai/suggest-metadata`, {});
            // Apply all metadata suggestions
            setFormData({
                ...formData,
                difficulty: response.difficulty,
                estimatedTimeMinutes: response.estimatedTimeMinutes,
                targetSkill: response.targetSkill,
                learningOutcome: response.learningOutcome,
            });
            toast.success('AI metadata suggestions applied!');
        } catch (error) {
            toast.error('Failed to suggest metadata');
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAcceptSuggestion = () => {
        setFormData({
            ...formData,
            [aiModal.field]: aiModal.suggestion,
        });
        setAiModal({ isOpen: false, title: '', suggestion: '', field: '' });
        toast.success('AI suggestion applied!');
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'learning', label: 'Learning' },
        { id: 'tech', label: 'Tech Stack' },
        { id: 'spec', label: 'Specification' },
        { id: 'curriculum', label: 'Curriculum' },
    ];
    return (
        <div className="bg-white rounded-lg shadow">
            {/* Tab Navigation - Scrollable on mobile */}
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Product Lookup Engine"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description *
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of the project..."
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Narrative
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateNarrative}
                                    disabled={isGenerating}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea
                                value={formData.narrative}
                                onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tell the story behind this project..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.coverImage}
                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'learning' && (
                    <div className="space-y-6">
                        {/* AI Suggest All Button */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-900">AI-Powered Metadata</p>
                                <p className="text-xs text-purple-700 mt-1">Let AI analyze your project and suggest all learning metadata</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSuggestMetadata}
                                disabled={isGenerating}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                                {isGenerating ? 'Suggesting...' : 'Suggest All with AI'}
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Skill *
                            </label>
                            <input
                                type="text"
                                value={formData.targetSkill}
                                onChange={(e) => setFormData({ ...formData, targetSkill: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Algorithm Efficiency"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Learning Outcome *
                            </label>
                            <textarea
                                value={formData.learningOutcome}
                                onChange={(e) => setFormData({ ...formData, learningOutcome: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="What will students learn from this project?"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty *
                                </label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estimated Time
                                </label>
                                <input
                                    type="text"
                                    value={formData.estimatedTime}
                                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 30-45 minutes"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Time (Minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.estimatedTimeMinutes}
                                onChange={(e) => setFormData({ ...formData, estimatedTimeMinutes: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="45"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'tech' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Tech stack configuration is managed through the project's tech_stack JSONB field.
                                Use the database or API to update tech stack items.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Tech Stack
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {project?.techStack?.map((tech: any, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {tech.icon} {tech.name}
                                    </span>
                                ))}
                                {(!project?.techStack || project.techStack.length === 0) && (
                                    <span className="text-gray-500 text-sm">No tech stack defined</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'spec' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Project specification (repo contents, what's missing, broken aspects) is managed through the specification JSONB field.
                                Use the database or API to update specification details.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Specification
                            </label>
                            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700">
                                <div className="mb-3">
                                    <strong>Repo Contents:</strong>
                                    <p className="mt-1">{project?.specification?.repoContents || 'Not specified'}</p>
                                </div>
                                <div className="mb-3">
                                    <strong>What's Missing:</strong>
                                    <p className="mt-1">{project?.specification?.whatsMissing || 'Not specified'}</p>
                                </div>
                                <div>
                                    <strong>Broken Aspects:</strong>
                                    <ul className="mt-1 list-disc list-inside">
                                        {project?.specification?.brokenAspects?.map((aspect: string, idx: number) => (
                                            <li key={idx}>{aspect}</li>
                                        )) || <li>None specified</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'curriculum' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tier
                                </label>
                                <select
                                    value={formData.tier}
                                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Curriculum Position
                                </label>
                                <input
                                    type="number"
                                    value={formData.curriculumPosition}
                                    onChange={(e) => setFormData({ ...formData, curriculumPosition: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                Active projects are visible to users. Draft projects are hidden.
                            </p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* AI Suggestion Modal */}
            <AiSuggestionModal
                title={aiModal.title}
                suggestion={aiModal.suggestion}
                isOpen={aiModal.isOpen}
                onClose={() => setAiModal({ isOpen: false, title: '', suggestion: '', field: '' })}
                onAccept={handleAcceptSuggestion}
                onRegenerate={() => {
                    if (aiModal.field === 'description') handleGenerateDescription();
                    else if (aiModal.field === 'narrative') handleGenerateNarrative();
                }}
                isRegenerating={isGenerating}
            />
        </div>
    );
}
