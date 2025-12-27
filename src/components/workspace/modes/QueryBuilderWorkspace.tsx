/**
 * QueryBuilderWorkspace - Interactive SQL workspace
 * 
 * Features:
 * - SQL editor with syntax highlighting
 * - Schema browser
 * - Results table
 * - Query history
 */

import { useState, useCallback } from 'react';
import { WorkspaceModeProps } from '../../types';
import { QueryBuilderState, QueryHistory as QueryHistoryType, SchemaTable } from './types';
import CodeEditor from '@/components/workspace/CodeEditor';
import { SchemaViewer } from './components/SchemaViewer';
import { ResultsTable } from './components/ResultsTable';
import { QueryHistory } from './components/QueryHistory';
import { Button } from '@/components/ui/button';
import { Play, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { v4 as uuidv4 } from 'uuid';

export default function QueryBuilderWorkspace({ projectId, project, category }: WorkspaceModeProps) {
    const [state, setState] = useState<QueryBuilderState>({
        query: getDefaultQuery(),
        isExecuting: false,
        schema: getMockSchema(),
        history: [],
    });

    // Execute query
    const handleExecute = useCallback(async () => {
        if (!state.query.trim()) {
            toast.error('Please enter a query');
            return;
        }

        setState(prev => ({ ...prev, isExecuting: true, error: undefined }));

        try {
            // TODO: Call backend to execute query
            // For now, generate mock results
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockResult = generateMockResult(state.query);

            // Add to history
            const historyItem: QueryHistoryType = {
                id: uuidv4(),
                query: state.query,
                timestamp: Date.now(),
                success: true,
                rowCount: mockResult.rowCount,
                executionTime: mockResult.executionTime,
            };

            setState(prev => ({
                ...prev,
                result: mockResult,
                error: undefined,
                isExecuting: false,
                history: [...prev.history, historyItem],
            }));

            toast.success(`Query executed: ${mockResult.rowCount} rows returned`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Query execution failed';

            const historyItem: QueryHistoryType = {
                id: uuidv4(),
                query: state.query,
                timestamp: Date.now(),
                success: false,
            };

            setState(prev => ({
                ...prev,
                error: { message: errorMessage },
                result: undefined,
                isExecuting: false,
                history: [...prev.history, historyItem],
            }));

            toast.error(errorMessage);
        }
    }, [state.query]);

    // Handle table click - insert SELECT query
    const handleTableClick = useCallback((tableName: string) => {
        const selectQuery = `SELECT * FROM ${tableName} LIMIT 10;`;
        setState(prev => ({ ...prev, query: selectQuery }));
        toast.info(`Query template inserted for ${tableName}`);
    }, []);

    // Handle history click
    const handleHistoryClick = useCallback((query: string) => {
        setState(prev => ({ ...prev, query }));
    }, []);

    // Clear history
    const handleClearHistory = useCallback(() => {
        setState(prev => ({ ...prev, history: [] }));
        toast.success('History cleared');
    }, []);

    // Handle keyboard shortcut (Ctrl+Enter or Cmd+Enter)
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleExecute();
        }
    }, [handleExecute]);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-lg font-semibold">Query Builder</h2>
                <Button
                    onClick={handleExecute}
                    disabled={state.isExecuting}
                    className="gap-2"
                >
                    <Play className="h-4 w-4" />
                    {state.isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    {/* Left sidebar - Schema */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <SchemaViewer schema={state.schema} onTableClick={handleTableClick} />
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Center - Editor and Results */}
                    <ResizablePanel defaultSize={60} minSize={40}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Query editor */}
                            <ResizablePanel defaultSize={40} minSize={30}>
                                <div className="h-full flex flex-col">
                                    <div className="px-4 py-2 border-b border-border bg-muted/30">
                                        <h3 className="text-sm font-semibold">SQL Query</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Press Ctrl+Enter (Cmd+Enter on Mac) to execute
                                        </p>
                                    </div>
                                    <div className="flex-1 overflow-hidden" onKeyDown={handleKeyDown}>
                                        <CodeEditor
                                            value={state.query}
                                            onChange={(value) => setState(prev => ({ ...prev, query: value || '' }))}
                                            language="sql"
                                            height="100%"
                                        />
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle />

                            {/* Results */}
                            <ResizablePanel defaultSize={60} minSize={30}>
                                <div className="h-full">
                                    {state.error ? (
                                        <div className="flex flex-col items-center justify-center h-full p-4">
                                            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Query Error</h3>
                                            <pre className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg max-w-2xl">
                                                {state.error.message}
                                            </pre>
                                        </div>
                                    ) : state.result ? (
                                        <ResultsTable result={state.result} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <p>Execute a query to see results</p>
                                        </div>
                                    )}
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Right sidebar - History */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                        <QueryHistory
                            history={state.history}
                            onQueryClick={handleHistoryClick}
                            onClearHistory={handleClearHistory}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

// Default query template
function getDefaultQuery(): string {
    return `-- Welcome to Query Builder
-- Write your SQL queries here
-- Press Ctrl+Enter (Cmd+Enter on Mac) to execute

SELECT * FROM users LIMIT 10;
`;
}

// Mock schema
function getMockSchema(): SchemaTable[] {
    return [
        {
            name: 'users',
            rowCount: 150,
            columns: [
                { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true },
                { name: 'username', type: 'VARCHAR(50)', nullable: false },
                { name: 'email', type: 'VARCHAR(100)', nullable: false },
                { name: 'created_at', type: 'TIMESTAMP', nullable: false },
            ],
        },
        {
            name: 'posts',
            rowCount: 450,
            columns: [
                { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true },
                { name: 'user_id', type: 'INTEGER', nullable: false, isForeignKey: true },
                { name: 'title', type: 'VARCHAR(200)', nullable: false },
                { name: 'content', type: 'TEXT', nullable: true },
                { name: 'created_at', type: 'TIMESTAMP', nullable: false },
            ],
        },
        {
            name: 'comments',
            rowCount: 1200,
            columns: [
                { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true },
                { name: 'post_id', type: 'INTEGER', nullable: false, isForeignKey: true },
                { name: 'user_id', type: 'INTEGER', nullable: false, isForeignKey: true },
                { name: 'content', type: 'TEXT', nullable: false },
                { name: 'created_at', type: 'TIMESTAMP', nullable: false },
            ],
        },
    ];
}

// Generate mock results
function generateMockResult(query: string) {
    const startTime = Date.now();

    // Simple mock based on query
    if (query.toLowerCase().includes('users')) {
        return {
            columns: ['id', 'username', 'email', 'created_at'],
            rows: [
                [1, 'john_doe', 'john@example.com', '2024-01-15 10:30:00'],
                [2, 'jane_smith', 'jane@example.com', '2024-01-16 14:20:00'],
                [3, 'bob_wilson', 'bob@example.com', '2024-01-17 09:15:00'],
            ],
            rowCount: 3,
            executionTime: Date.now() - startTime + 45,
        };
    }

    return {
        columns: ['result'],
        rows: [['Query executed successfully']],
        rowCount: 1,
        executionTime: Date.now() - startTime + 30,
    };
}
