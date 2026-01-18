import { useEffect, useCallback, useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Save, Loader2, AlertCircle, Sparkles, ChevronRight, ChevronLeft, Search, Terminal, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import MonacoFileTree from './MonacoFileTree';
import AICodeChat from './AICodeChat';
import CodeSearch from './CodeSearch';
import IntegratedTerminal from './IntegratedTerminal';
import GitDiffViewer from './GitDiffViewer';
import { useMonacoEditor } from '@/hooks/useMonacoEditor';
import { useMonacoAI } from '@/hooks/useMonacoAI';

interface FileNode {
    name: string;
    type?: string;
    nodeType?: string;
    content?: string;
    children?: FileNode[]; // Backend returns nested children
    status?: string;
    intent?: string;
}

interface AdminMonacoWorkspaceProps {
    projectId: string;
    files: FileNode[];
    onFileSave: (fileName: string, content: string) => Promise<void>;
    className?: string;
}

// Flatten nested file structure from backend
const flattenFiles = (nodes: FileNode[], parentPath: string = ''): FileNode[] => {
    const result: FileNode[] = [];
    nodes.forEach(node => {
        const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
        // If node has children, it's a folder - add children with full path
        if (node.children && node.children.length > 0) {
            result.push(...flattenFiles(node.children, fullPath));
        } else {
            // It's a file - add with full path
            result.push({ ...node, name: fullPath });
        }
    });
    return result;
};

export default function AdminMonacoWorkspace({
    projectId,
    files,
    onFileSave,
    className = '',
}: AdminMonacoWorkspaceProps) {
    const [showAIPanel, setShowAIPanel] = useState(true);
    const [selectedCode, setSelectedCode] = useState<string>('');
    const [showSearch, setShowSearch] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showGitDiff, setShowGitDiff] = useState(false);
    const [aiChanges, setAIChanges] = useState<any[]>([]);
    const [showFileTree, setShowFileTree] = useState(true); // Mobile: toggle file tree
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
            if (window.innerWidth < 1024) {
                setShowFileTree(false); // Hide file tree on mobile by default
                setShowAIPanel(false); // Hide AI panel on mobile by default
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Memoize flattened files to prevent infinite re-renders
    const flattenedFiles = useMemo(() => flattenFiles(files), [files]);

    const {
        editorRef,
        fileStates,
        activeFileName,
        activeFile,
        isSaving,
        switchFile,
        handleContentChange,
        saveCurrentFile,
        saveAllFiles,
        restoreViewState,
        hasUnsavedChanges,
    } = useMonacoEditor({
        files: flattenedFiles,
        onFileSave,
        autoSave: true,
        autoSaveDelay: 2000,
    });

    // AI integration
    const {
        isEnabled: aiEnabled,
        setIsEnabled: setAIEnabled,
        isLoading: aiLoading,
        explainCode,
        fixCode,
        refactorCode,
        generateTests,
    } = useMonacoAI(editorRef, {
        projectId,
        enabled: true,
        debounceMs: 500,
    });

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;

        // Register keyboard shortcuts
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            () => {
                saveCurrentFile().catch(err => {
                    toast.error('Failed to save file', {
                        description: err.message,
                    });
                });
            }
        );

        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,
            () => {
                saveAllFiles().catch(err => {
                    toast.error('Failed to save all files', {
                        description: err.message,
                    });
                });
            }
        );

        // AI Command Palette (Cmd/Ctrl+K)
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
            () => {
                setShowAIPanel(true);
                toast.info('AI Panel opened', {
                    description: 'Select code and use quick actions',
                });
            }
        );

        // Search (Cmd/Ctrl+F)
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF,
            () => {
                setShowSearch(true);
            }
        );

        // Terminal (Cmd/Ctrl+`)
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote,
            () => {
                setShowTerminal(!showTerminal);
            }
        );

        // Git Diff (Cmd/Ctrl+Shift+D)
        editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyD,
            () => {
                setShowGitDiff(!showGitDiff);
            }
        );

        // Track selection changes
        editor.onDidChangeCursorSelection((e) => {
            const selection = editor.getSelection();
            if (selection && !selection.isEmpty()) {
                const selectedText = editor.getModel()?.getValueInRange(selection) || '';
                setSelectedCode(selectedText);
            } else {
                setSelectedCode('');
            }
        });

        // Focus editor
        editor.focus();
    };

    const handleEditorChange = (value: string | undefined) => {
        if (activeFileName && value !== undefined) {
            handleContentChange(activeFileName, value);
        }
    };

    // Insert code from AI into editor
    const handleInsertCode = useCallback((code: string) => {
        if (editorRef.current) {
            const selection = editorRef.current.getSelection();
            if (selection) {
                editorRef.current.executeEdits('ai-insert', [{
                    range: selection,
                    text: code,
                }]);
                toast.success('Code inserted from AI');
            }
        }
    }, []);

    // Restore view state when switching files
    useEffect(() => {
        restoreViewState();
    }, [activeFileName, restoreViewState]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const modifiedFiles = new Set(
        Array.from(fileStates.values())
            .filter(f => f.modified)
            .map(f => f.name)
    );

    return (
        <div className={`flex h-full bg-gray-900 ${className}`}>
            {/* File Tree Sidebar - Collapsible on mobile */}
            <div className={`${showFileTree ? 'w-64' : 'w-0'
                } border-r border-gray-700 flex-shrink-0 transition-all duration-300 overflow-hidden lg:w-64`}>
                <MonacoFileTree
                    files={files}
                    activeFile={activeFileName}
                    onFileSelect={(file) => {
                        switchFile(file);
                        if (isMobile) setShowFileTree(false); // Close tree on mobile after selection
                    }}
                    modifiedFiles={modifiedFiles}
                />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Editor Header */}
                <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {activeFile ? (
                            <>
                                <span className="text-gray-300 font-medium truncate">
                                    {activeFile.name}
                                </span>
                                {activeFile.modified && (
                                    <span className="text-xs text-blue-400 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                        Modified
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-500">No file selected</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        )}

                        {hasUnsavedChanges && !isSaving && (
                            <button
                                onClick={() => saveAllFiles()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Save All
                            </button>
                        )}
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 min-h-0">
                    {activeFile ? (
                        <Editor
                            height="100%"
                            language={activeFile.language}
                            value={activeFile.content}
                            onChange={handleEditorChange}
                            onMount={handleEditorDidMount}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: true },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                lineNumbers: 'on',
                                rulers: [80, 120],
                                wordWrap: 'on',
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                cursorBlinking: 'smooth',
                                cursorSmoothCaretAnimation: 'on',
                                formatOnPaste: true,
                                formatOnType: true,
                                tabSize: 2,
                                insertSpaces: true,
                                detectIndentation: true,
                                folding: true,
                                foldingStrategy: 'indentation',
                                showFoldingControls: 'always',
                                matchBrackets: 'always',
                                autoClosingBrackets: 'always',
                                autoClosingQuotes: 'always',
                                autoIndent: 'full',
                                quickSuggestions: true,
                                suggestOnTriggerCharacters: true,
                                acceptSuggestionOnCommitCharacter: true,
                                snippetSuggestions: 'inline',
                                padding: { top: 16, bottom: 16 },
                                bracketPairColorization: { enabled: true },
                                guides: {
                                    bracketPairs: true,
                                    indentation: true,
                                },
                                // Enable inline completions for AI
                                inlineSuggest: { enabled: aiEnabled },
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg">Select a file to start editing</p>
                            <p className="text-sm mt-2">Choose a file from the sidebar</p>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        {activeFile && (
                            <>
                                <span className="uppercase">{activeFile.language}</span>
                                <span>UTF-8</span>
                            </>
                        )}
                        {/* AI Status */}
                        <button
                            onClick={() => setAIEnabled(!aiEnabled)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${aiEnabled
                                ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                                : 'bg-gray-700 text-gray-500 hover:bg-gray-600'
                                }`}
                            title={aiEnabled ? 'AI Completions: ON' : 'AI Completions: OFF'}
                        >
                            <Sparkles className="h-3 w-3" />
                            <span>AI {aiEnabled ? 'ON' : 'OFF'}</span>
                            {aiLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Advanced Feature Toggles */}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${showSearch ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-gray-700'
                                }`}
                            title="Search (Cmd/Ctrl+F)"
                        >
                            <Search className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setShowTerminal(!showTerminal)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${showTerminal ? 'bg-green-600/20 text-green-300' : 'hover:bg-gray-700'
                                }`}
                            title="Terminal (Cmd/Ctrl+`)"
                        >
                            <Terminal className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setShowGitDiff(!showGitDiff)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${showGitDiff ? 'bg-orange-600/20 text-orange-300' : 'hover:bg-gray-700'
                                }`}
                            title="Git Diff (Cmd/Ctrl+Shift+D)"
                        >
                            <GitBranch className="h-3 w-3" />
                            {aiChanges.length > 0 && (
                                <span className="bg-orange-600 text-white px-1 rounded text-xs">
                                    {aiChanges.length}
                                </span>
                            )}
                        </button>

                        <span className="border-l border-gray-700 h-4" />

                        <span>{files.length} files</span>
                        {modifiedFiles.size > 0 && (
                            <span className="text-blue-400">
                                {modifiedFiles.size} unsaved
                            </span>
                        )}
                    </div>
                </div>

                {/* Terminal Panel */}
                {showTerminal && (
                    <IntegratedTerminal
                        projectId={projectId}
                        onClose={() => setShowTerminal(false)}
                    />
                )}
            </div>

            {/* Code Search Overlay */}
            {showSearch && (
                <CodeSearch
                    editorRef={editorRef}
                    onClose={() => setShowSearch(false)}
                />
            )}

            {/* AI Chat Panel */}
            {showAIPanel && (
                <div className="w-96 border-l border-gray-700 flex-shrink-0 flex flex-col">
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm font-medium text-gray-300">AI Assistant</span>
                        <button
                            onClick={() => setShowAIPanel(false)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Hide AI Panel"
                        >
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <AICodeChat
                            projectId={projectId}
                            currentFile={activeFileName || undefined}
                            selectedCode={selectedCode}
                            language={activeFile?.language}
                            onInsertCode={handleInsertCode}
                            onExplainCode={explainCode}
                            onFixCode={fixCode}
                            onRefactorCode={refactorCode}
                            onGenerateTests={generateTests}
                        />
                    </div>
                </div>
            )}

            {/* AI Panel Toggle (when hidden) */}
            {!showAIPanel && (
                <button
                    onClick={() => setShowAIPanel(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-l shadow-lg transition-colors"
                    title="Show AI Panel (Cmd/Ctrl+K)"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}
