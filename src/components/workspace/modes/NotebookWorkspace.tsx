/**
 * NotebookWorkspace - Jupyter-style notebook interface
 * 
 * Features:
 * - Cell-based code execution
 * - Inline output display
 * - Markdown cells
 * - State persistence between cells
 */

import { useCallback, useState } from 'react';
import { WorkspaceModeProps } from '../../types';
import { useNotebookState } from './hooks/useNotebookState';
import { useCellExecution } from './hooks/useCellExecution';
import { NotebookToolbar } from './components/NotebookToolbar';
import { NotebookCell } from './components/NotebookCell';
import { toast } from 'sonner';

export default function NotebookWorkspace({ projectId, project, category }: WorkspaceModeProps) {
    const {
        state,
        activeCell,
        setActiveCell,
        addCell,
        deleteCell,
        moveCellUp,
        moveCellDown,
        updateCellContent,
        updateCellOutput,
        setCellExecuting,
        setCellExecutionCount,
        updateKernelState,
        incrementExecutionCount,
        clearAllOutputs,
    } = useNotebookState();

    const { executeCell } = useCellExecution();
    const [isSaving, setIsSaving] = useState(false);

    // Run a single cell
    const handleRunCell = useCallback(async (cellId: string) => {
        const cell = state.cells.find(c => c.id === cellId);
        if (!cell) return;

        setCellExecuting(cellId, true);

        try {
            const { output, newState } = await executeCell(cell, state.kernelState);

            const executionCount = incrementExecutionCount();
            setCellExecutionCount(cellId, executionCount);
            updateCellOutput(cellId, output);
            updateKernelState(newState);

            toast.success('Cell executed successfully');
        } catch (error) {
            toast.error('Cell execution failed');
            updateCellOutput(cellId, {
                type: 'error',
                content: error instanceof Error ? error.message : 'Unknown error',
                timestamp: Date.now(),
            });
        } finally {
            setCellExecuting(cellId, false);
        }
    }, [state.cells, state.kernelState, executeCell, setCellExecuting, incrementExecutionCount, setCellExecutionCount, updateCellOutput, updateKernelState]);

    // Run all cells
    const handleRunAll = useCallback(async () => {
        toast.info('Running all cells...');

        for (const cell of state.cells) {
            await handleRunCell(cell.id);
        }

        toast.success('All cells executed');
    }, [state.cells, handleRunCell]);

    // Save notebook
    const handleSave = useCallback(async () => {
        setIsSaving(true);

        try {
            // TODO: Implement backend save
            // await apiClient.put(`/user-projects/${projectId}/notebook`, {
            //   cells: state.cells,
            //   executionCount: state.executionCount,
            // });

            // Simulate save
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success('Notebook saved');
        } catch (error) {
            toast.error('Failed to save notebook');
        } finally {
            setIsSaving(false);
        }
    }, [state.cells, state.executionCount]);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Toolbar */}
            <NotebookToolbar
                onAddCodeCell={() => addCell('code')}
                onAddMarkdownCell={() => addCell('markdown')}
                onRunAll={handleRunAll}
                onClearOutputs={clearAllOutputs}
                onSave={handleSave}
                isSaving={isSaving}
            />

            {/* Cells */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.cells.map((cell, index) => (
                    <NotebookCell
                        key={cell.id}
                        cell={cell}
                        isActive={activeCell === cell.id}
                        onRun={handleRunCell}
                        onDelete={deleteCell}
                        onMoveUp={moveCellUp}
                        onMoveDown={moveCellDown}
                        onContentChange={updateCellContent}
                        onFocus={setActiveCell}
                        canMoveUp={index > 0}
                        canMoveDown={index < state.cells.length - 1}
                    />
                ))}

                {state.cells.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No cells yet. Click "+ Code" or "+ Markdown" to add a cell.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
