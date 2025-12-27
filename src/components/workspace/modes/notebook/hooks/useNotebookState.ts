import { useState, useCallback } from 'react';
import { NotebookCell, NotebookState, CellType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useNotebookState(initialCells: NotebookCell[] = []) {
    const [state, setState] = useState<NotebookState>({
        cells: initialCells.length > 0 ? initialCells : [createDefaultCell()],
        executionCount: 0,
        kernelState: {},
    });

    const [activeCell, setActiveCell] = useState<string | null>(
        initialCells.length > 0 ? initialCells[0].id : null
    );

    // Create a new cell
    const createCell = useCallback((type: CellType): NotebookCell => {
        return {
            id: uuidv4(),
            type,
            content: '',
            output: undefined,
            executionCount: undefined,
            isExecuting: false,
        };
    }, []);

    // Add cell
    const addCell = useCallback((type: CellType, afterCellId?: string) => {
        setState(prev => {
            const newCell = createCell(type);

            if (!afterCellId) {
                // Add to end
                return {
                    ...prev,
                    cells: [...prev.cells, newCell],
                };
            }

            // Add after specific cell
            const index = prev.cells.findIndex(c => c.id === afterCellId);
            const newCells = [...prev.cells];
            newCells.splice(index + 1, 0, newCell);

            return {
                ...prev,
                cells: newCells,
            };
        });
    }, [createCell]);

    // Delete cell
    const deleteCell = useCallback((cellId: string) => {
        setState(prev => {
            const newCells = prev.cells.filter(c => c.id !== cellId);

            // Ensure at least one cell exists
            if (newCells.length === 0) {
                newCells.push(createCell('code'));
            }

            return {
                ...prev,
                cells: newCells,
            };
        });

        // Update active cell if deleted
        if (activeCell === cellId) {
            setState(prev => {
                const firstCell = prev.cells[0];
                setActiveCell(firstCell?.id || null);
                return prev;
            });
        }
    }, [activeCell, createCell]);

    // Move cell up
    const moveCellUp = useCallback((cellId: string) => {
        setState(prev => {
            const index = prev.cells.findIndex(c => c.id === cellId);
            if (index <= 0) return prev;

            const newCells = [...prev.cells];
            [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];

            return {
                ...prev,
                cells: newCells,
            };
        });
    }, []);

    // Move cell down
    const moveCellDown = useCallback((cellId: string) => {
        setState(prev => {
            const index = prev.cells.findIndex(c => c.id === cellId);
            if (index < 0 || index >= prev.cells.length - 1) return prev;

            const newCells = [...prev.cells];
            [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];

            return {
                ...prev,
                cells: newCells,
            };
        });
    }, []);

    // Update cell content
    const updateCellContent = useCallback((cellId: string, content: string) => {
        setState(prev => ({
            ...prev,
            cells: prev.cells.map(cell =>
                cell.id === cellId ? { ...cell, content } : cell
            ),
        }));
    }, []);

    // Update cell output
    const updateCellOutput = useCallback((cellId: string, output: NotebookCell['output']) => {
        setState(prev => ({
            ...prev,
            cells: prev.cells.map(cell =>
                cell.id === cellId ? { ...cell, output } : cell
            ),
        }));
    }, []);

    // Set cell executing state
    const setCellExecuting = useCallback((cellId: string, isExecuting: boolean) => {
        setState(prev => ({
            ...prev,
            cells: prev.cells.map(cell =>
                cell.id === cellId ? { ...cell, isExecuting } : cell
            ),
        }));
    }, []);

    // Set cell execution count
    const setCellExecutionCount = useCallback((cellId: string, count: number) => {
        setState(prev => ({
            ...prev,
            cells: prev.cells.map(cell =>
                cell.id === cellId ? { ...cell, executionCount: count } : cell
            ),
        }));
    }, []);

    // Update kernel state
    const updateKernelState = useCallback((newState: Record<string, any>) => {
        setState(prev => ({
            ...prev,
            kernelState: { ...prev.kernelState, ...newState },
        }));
    }, []);

    // Increment execution count
    const incrementExecutionCount = useCallback(() => {
        setState(prev => ({
            ...prev,
            executionCount: prev.executionCount + 1,
        }));
        return state.executionCount + 1;
    }, [state.executionCount]);

    // Clear all outputs
    const clearAllOutputs = useCallback(() => {
        setState(prev => ({
            ...prev,
            cells: prev.cells.map(cell => ({
                ...cell,
                output: undefined,
                executionCount: undefined,
            })),
        }));
    }, []);

    return {
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
    };
}

// Helper to create default cell
function createDefaultCell(): NotebookCell {
    return {
        id: uuidv4(),
        type: 'code',
        content: '# Welcome to Notebook Mode\n# Write your code here and press Shift+Enter to run\n',
        output: undefined,
        executionCount: undefined,
        isExecuting: false,
    };
}
