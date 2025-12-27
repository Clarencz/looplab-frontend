import { X, Check, Sparkles } from 'lucide-react';

interface AiMetadataPreviewModalProps {
    isOpen: boolean;
    data: {
        description?: string;
        narrative?: string;
        difficulty?: string;
        estimatedTimeMinutes?: number;
        targetSkill?: string;
        learningOutcome?: string;
    } | null;
    onClose: () => void;
    onApply: () => void;
}

export default function AiMetadataPreviewModal({
    isOpen,
    data,
    onClose,
    onApply,
}: AiMetadataPreviewModalProps) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900">AI-Generated Metadata</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Description */}
                    {data.description && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Description
                            </label>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Narrative */}
                    {data.narrative && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Narrative
                            </label>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {data.narrative}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Learning Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {data.difficulty && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Difficulty
                                </label>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                                    <p className="text-sm text-gray-700 capitalize font-medium">
                                        {data.difficulty}
                                    </p>
                                </div>
                            </div>
                        )}

                        {data.estimatedTimeMinutes && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Estimated Time
                                </label>
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                                    <p className="text-sm text-gray-700 font-medium">
                                        {data.estimatedTimeMinutes} minutes
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Target Skill */}
                    {data.targetSkill && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Target Skill
                            </label>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                                <p className="text-sm text-gray-700 font-medium">
                                    {data.targetSkill}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Learning Outcome */}
                    {data.learningOutcome && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Learning Outcome
                            </label>
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.learningOutcome}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> You can edit these fields in the Project Editor after applying.
                            This preview shows what AI has generated based on your project files.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onApply}
                        className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Apply & Go to Editor
                    </button>
                </div>
            </div>
        </div>
    );
}
