import { useState, useEffect, useCallback, useRef } from 'react';
import type { editor, languages, IDisposable } from 'monaco-editor';
import { apiClient } from '@/lib/api';

interface AICompletionOptions {
    projectId: string;
    enabled?: boolean;
    debounceMs?: number;
}

interface CompletionContext {
    fileName: string;
    language: string;
    code: string;
    cursorPosition: { line: number; column: number };
    prefix: string;
    suffix: string;
}

export function useMonacoAI(
    editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>,
    options: AICompletionOptions
) {
    const [isEnabled, setIsEnabled] = useState(options.enabled ?? true);
    const [isLoading, setIsLoading] = useState(false);
    const [lastCompletion, setLastCompletion] = useState<string | null>(null);
    const providerRef = useRef<IDisposable | null>(null);
    const debounceTimerRef = useRef<number | null>(null);

    // Get code completion from AI pipeline
    const getAICompletion = useCallback(async (context: CompletionContext): Promise<string | null> => {
        try {
            setIsLoading(true);

            const response = await apiClient.post<{ completion: string }>(
                `/admin/projects/${options.projectId}/ai/complete`,
                {
                    fileName: context.fileName,
                    language: context.language,
                    code: context.code,
                    cursorPosition: context.cursorPosition,
                    prefix: context.prefix,
                    suffix: context.suffix,
                }
            );

            return response.completion || null;
        } catch (error) {
            console.error('AI completion error:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [options.projectId]);

    // Get code explanation from AI
    const explainCode = useCallback(async (code: string, language: string): Promise<string> => {
        try {
            const response = await apiClient.post<{ explanation: string }>(
                `/admin/projects/${options.projectId}/ai/explain`,
                { code, language }
            );
            return response.explanation || 'No explanation available.';
        } catch (error) {
            console.error('AI explanation error:', error);
            return 'Failed to get explanation.';
        }
    }, [options.projectId]);

    // Get code fixes from AI
    const fixCode = useCallback(async (code: string, language: string): Promise<Array<{ issue: string; fix: string }>> => {
        try {
            const response = await apiClient.post<{ fixes: Array<{ issue: string; fix: string }> }>(
                `/admin/projects/${options.projectId}/ai/fix`,
                { code, language }
            );
            return response.fixes || [];
        } catch (error) {
            console.error('AI fix error:', error);
            return [];
        }
    }, [options.projectId]);

    // Get refactoring suggestions from AI
    const refactorCode = useCallback(async (code: string, language: string): Promise<Array<{ description: string; code: string }>> => {
        try {
            const response = await apiClient.post<{ suggestions: Array<{ description: string; code: string }> }>(
                `/admin/projects/${options.projectId}/ai/refactor`,
                { code, language }
            );
            return response.suggestions || [];
        } catch (error) {
            console.error('AI refactor error:', error);
            return [];
        }
    }, [options.projectId]);

    // Generate tests from AI
    const generateTests = useCallback(async (code: string, language: string): Promise<string> => {
        try {
            const response = await apiClient.post<{ tests: string }>(
                `/admin/projects/${options.projectId}/ai/test`,
                { code, language }
            );
            return response.tests || '';
        } catch (error) {
            console.error('AI test generation error:', error);
            return '';
        }
    }, [options.projectId]);

    // Register inline completion provider
    useEffect(() => {
        if (!editorRef.current || !isEnabled) return;

        const editor = editorRef.current;
        const monaco = (window as any).monaco;

        if (!monaco) return;

        // Register inline completions provider
        const provider = monaco.languages.registerInlineCompletionsProvider('*', {
            provideInlineCompletions: async (
                model: editor.ITextModel,
                position: any,
                context: any,
                token: any
            ) => {
                // Debounce requests
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                }

                return new Promise((resolve) => {
                    debounceTimerRef.current = window.setTimeout(async () => {
                        try {
                            const code = model.getValue();
                            const offset = model.getOffsetAt(position);
                            const prefix = code.substring(0, offset);
                            const suffix = code.substring(offset);

                            const completionContext: CompletionContext = {
                                fileName: model.uri.path.split('/').pop() || 'untitled',
                                language: model.getLanguageId(),
                                code,
                                cursorPosition: {
                                    line: position.lineNumber,
                                    column: position.column,
                                },
                                prefix,
                                suffix,
                            };

                            const completion = await getAICompletion(completionContext);

                            if (completion && !token.isCancellationRequested) {
                                setLastCompletion(completion);
                                resolve({
                                    items: [
                                        {
                                            insertText: completion,
                                            range: {
                                                startLineNumber: position.lineNumber,
                                                startColumn: position.column,
                                                endLineNumber: position.lineNumber,
                                                endColumn: position.column,
                                            },
                                        },
                                    ],
                                });
                            } else {
                                resolve({ items: [] });
                            }
                        } catch (error) {
                            console.error('Inline completion error:', error);
                            resolve({ items: [] });
                        }
                    }, options.debounceMs || 500);
                });
            },
            freeInlineCompletions: () => { },
        });

        providerRef.current = provider;

        return () => {
            if (providerRef.current) {
                providerRef.current.dispose();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [editorRef, isEnabled, getAICompletion, options.debounceMs]);

    return {
        isEnabled,
        setIsEnabled,
        isLoading,
        lastCompletion,
        explainCode,
        fixCode,
        refactorCode,
        generateTests,
    };
}
