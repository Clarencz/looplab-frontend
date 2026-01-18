import { useState, useCallback, useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';

interface FileState {
    name: string;
    content: string;
    language: string;
    modified: boolean;
    viewState?: editor.ICodeEditorViewState;
}

interface UseMonacoEditorProps {
    files: Array<{ name: string; content?: string; type?: string }>;
    onFileSave?: (fileName: string, content: string) => Promise<void>;
    autoSave?: boolean;
    autoSaveDelay?: number;
}

export function useMonacoEditor({
    files,
    onFileSave,
    autoSave = true,
    autoSaveDelay = 2000,
}: UseMonacoEditorProps) {
    const [fileStates, setFileStates] = useState<Map<string, FileState>>(new Map());
    const [activeFileName, setActiveFileName] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const autoSaveTimerRef = useRef<number | null>(null);

    // Initialize file states from props
    useEffect(() => {
        const newFileStates = new Map<string, FileState>();

        files.forEach(file => {
            // Preserve existing state if file already exists
            const existingState = fileStates.get(file.name);
            if (existingState) {
                newFileStates.set(file.name, existingState);
            } else {
                // Initialize new file
                newFileStates.set(file.name, {
                    name: file.name,
                    content: file.content || '',
                    language: getLanguageFromFileName(file.name),
                    modified: false,
                });
            }
        });

        setFileStates(newFileStates);

        // Set first file as active if none selected
        if (!activeFileName && files.length > 0) {
            setActiveFileName(files[0].name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]); // Only re-run when files prop changes

    const getLanguageFromFileName = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const languageMap: Record<string, string> = {
            js: 'javascript',
            jsx: 'javascript',
            ts: 'typescript',
            tsx: 'typescript',
            py: 'python',
            rs: 'rust',
            go: 'go',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            html: 'html',
            css: 'css',
            scss: 'scss',
            json: 'json',
            md: 'markdown',
            yaml: 'yaml',
            yml: 'yaml',
            xml: 'xml',
            sql: 'sql',
            sh: 'shell',
            bash: 'shell',
        };
        return languageMap[ext] || 'plaintext';
    };

    const saveFile = useCallback(async (fileName: string) => {
        const fileState = fileStates.get(fileName);
        if (!fileState || !fileState.modified || !onFileSave) return;

        setIsSaving(true);
        try {
            await onFileSave(fileName, fileState.content);
            setFileStates(prev => {
                const updated = new Map(prev);
                const file = updated.get(fileName);
                if (file) {
                    file.modified = false;
                    updated.set(fileName, file);
                }
                return updated;
            });
        } catch (error) {
            console.error('Failed to save file:', error);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, [fileStates, onFileSave]);

    const handleContentChange = useCallback((fileName: string, content: string) => {
        setFileStates(prev => {
            const updated = new Map(prev);
            const file = updated.get(fileName);
            if (file) {
                file.content = content;
                file.modified = true;
                updated.set(fileName, file);
            }
            return updated;
        });

        // Auto-save logic
        if (autoSave && onFileSave) {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
            autoSaveTimerRef.current = setTimeout(() => {
                saveFile(fileName);
            }, autoSaveDelay);
        }
    }, [autoSave, autoSaveDelay, saveFile, onFileSave]);

    const switchFile = useCallback((fileName: string) => {
        // Save current editor view state
        if (editorRef.current && activeFileName) {
            const viewState = editorRef.current.saveViewState();
            setFileStates(prev => {
                const updated = new Map(prev);
                const file = updated.get(activeFileName);
                if (file && viewState) {
                    file.viewState = viewState;
                    updated.set(activeFileName, file);
                }
                return updated;
            });
        }

        setActiveFileName(fileName);
    }, [activeFileName]);

    const restoreViewState = useCallback(() => {
        if (editorRef.current && activeFileName) {
            const fileState = fileStates.get(activeFileName);
            if (fileState?.viewState) {
                editorRef.current.restoreViewState(fileState.viewState);
                editorRef.current.focus();
            }
        }
    }, [activeFileName, fileStates]);

    const saveCurrentFile = useCallback(async () => {
        if (activeFileName) {
            await saveFile(activeFileName);
        }
    }, [activeFileName, saveFile]);

    const saveAllFiles = useCallback(async () => {
        const modifiedFiles = Array.from(fileStates.values()).filter(f => f.modified);
        await Promise.all(modifiedFiles.map(f => saveFile(f.name)));
    }, [fileStates, saveFile]);

    const getActiveFile = useCallback(() => {
        return activeFileName ? fileStates.get(activeFileName) : null;
    }, [activeFileName, fileStates]);

    const hasUnsavedChanges = useCallback(() => {
        return Array.from(fileStates.values()).some(f => f.modified);
    }, [fileStates]);

    // Cleanup auto-save timer
    useEffect(() => {
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, []);

    return {
        editorRef,
        fileStates,
        activeFileName,
        activeFile: getActiveFile(),
        isSaving,
        switchFile,
        handleContentChange,
        saveCurrentFile,
        saveAllFiles,
        restoreViewState,
        hasUnsavedChanges: hasUnsavedChanges(),
    };
}
