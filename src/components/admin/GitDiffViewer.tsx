import { useState } from 'react';
import { GitBranch, Check, X, Eye } from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';

interface AIChange {
    id: string;
    fileName: string;
    description: string;
    originalCode: string;
    modifiedCode: string;
    timestamp: Date;
    applied: boolean;
}

interface GitDiffViewerProps {
    changes: AIChange[];
    onApplyChange: (changeId: string) => void;
    onRejectChange: (changeId: string) => void;
    onPreviewChange: (changeId: string) => void;
}

export default function GitDiffViewer({
    changes,
    onApplyChange,
    onRejectChange,
    onPreviewChange,
}: GitDiffViewerProps) {
    const [selectedChange, setSelectedChange] = useState<AIChange | null>(
        changes.length > 0 ? changes[0] : null
    );

    if (changes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <GitBranch className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No AI Changes</p>
                <p className="text-sm mt-2 text-center max-w-md">
                    AI-generated code changes will appear here for review before applying
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-gray-900">
            {/* Changes List */}
            <div className="w-80 border-r border-gray-700 flex flex-col">
                <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-purple-400" />
                        <h3 className="font-semibold text-gray-200">AI Changes</h3>
                        <span className="ml-auto text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                            {changes.filter(c => !c.applied).length} pending
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {changes.map((change) => (
                        <button
                            key={change.id}
                            onClick={() => setSelectedChange(change)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-700 transition-colors ${selectedChange?.id === change.id
                                    ? 'bg-gray-800'
                                    : 'hover:bg-gray-800/50'
                                } ${change.applied ? 'opacity-50' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-200 truncate">
                                            {change.fileName}
                                        </span>
                                        {change.applied && (
                                            <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2">
                                        {change.description}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {change.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Diff Viewer */}
            {selectedChange && (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-200">
                                    {selectedChange.fileName}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedChange.description}
                                </p>
                            </div>
                            {!selectedChange.applied && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onPreviewChange(selectedChange.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => onRejectChange(selectedChange.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => onApplyChange(selectedChange.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                    >
                                        <Check className="h-4 w-4" />
                                        Apply
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monaco Diff Editor */}
                    <div className="flex-1 min-h-0">
                        <DiffEditor
                            height="100%"
                            language="typescript"
                            original={selectedChange.originalCode}
                            modified={selectedChange.modifiedCode}
                            theme="vs-dark"
                            options={{
                                readOnly: true,
                                renderSideBySide: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                scrollBeyondLastLine: false,
                                renderOverviewRuler: false,
                                diffWordWrap: 'on',
                                ignoreTrimWhitespace: false,
                                renderIndicators: true,
                                originalEditable: false,
                                modifiedEditable: false,
                            }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-green-600 rounded-sm" />
                            {selectedChange.modifiedCode.split('\n').length - selectedChange.originalCode.split('\n').length > 0
                                ? `+${selectedChange.modifiedCode.split('\n').length - selectedChange.originalCode.split('\n').length}`
                                : '0'} lines added
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-red-600 rounded-sm" />
                            {selectedChange.originalCode.split('\n').length - selectedChange.modifiedCode.split('\n').length > 0
                                ? `-${selectedChange.originalCode.split('\n').length - selectedChange.modifiedCode.split('\n').length}`
                                : '0'} lines removed
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
