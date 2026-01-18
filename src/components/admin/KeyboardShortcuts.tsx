import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsProps {
    onClose: () => void;
}

export default function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
    const shortcuts = [
        {
            category: 'File Operations',
            items: [
                { keys: ['Cmd/Ctrl', 'S'], description: 'Save current file' },
                { keys: ['Cmd/Ctrl', 'Shift', 'S'], description: 'Save all files' },
            ],
        },
        {
            category: 'AI Features',
            items: [
                { keys: ['Cmd/Ctrl', 'K'], description: 'Open AI assistant panel' },
                { keys: ['Tab'], description: 'Accept AI completion' },
                { keys: ['Esc'], description: 'Dismiss AI completion' },
            ],
        },
        {
            category: 'Search & Navigation',
            items: [
                { keys: ['Cmd/Ctrl', 'F'], description: 'Find in file' },
                { keys: ['Cmd/Ctrl', 'H'], description: 'Replace in file' },
                { keys: ['Cmd/Ctrl', 'P'], description: 'Quick file open' },
                { keys: ['Cmd/Ctrl', 'G'], description: 'Go to line' },
            ],
        },
        {
            category: 'Editor',
            items: [
                { keys: ['Cmd/Ctrl', 'D'], description: 'Add selection to next find match' },
                { keys: ['Cmd/Ctrl', '/'], description: 'Toggle line comment' },
                { keys: ['Alt', 'Up/Down'], description: 'Move line up/down' },
                { keys: ['Shift', 'Alt', 'Up/Down'], description: 'Copy line up/down' },
                { keys: ['Cmd/Ctrl', 'Shift', 'K'], description: 'Delete line' },
            ],
        },
        {
            category: 'Advanced Features',
            items: [
                { keys: ['Cmd/Ctrl', '`'], description: 'Toggle terminal' },
                { keys: ['Cmd/Ctrl', 'Shift', 'D'], description: 'Show git diff viewer' },
                { keys: ['Cmd/Ctrl', 'B'], description: 'Toggle sidebar' },
            ],
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Keyboard className="h-6 w-6 text-purple-400" />
                        <h2 className="text-xl font-semibold text-gray-100">Keyboard Shortcuts</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {shortcuts.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">
                                    {category.category}
                                </h3>
                                <div className="space-y-2">
                                    {category.items.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-800/50 transition-colors"
                                        >
                                            <span className="text-gray-300 text-sm">
                                                {item.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {item.keys.map((key, keyIdx) => (
                                                    <span key={keyIdx} className="flex items-center gap-1">
                                                        <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-200 shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {keyIdx < item.keys.length - 1 && (
                                                            <span className="text-gray-600 text-xs">+</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">?</kbd> to toggle this panel
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
