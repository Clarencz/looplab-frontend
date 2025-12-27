// Notebook cell types and interfaces

export type CellType = 'code' | 'markdown';

export type OutputType = 'text' | 'error' | 'html';

export interface CellOutput {
    type: OutputType;
    content: string;
    timestamp: number;
}

export interface NotebookCell {
    id: string;
    type: CellType;
    content: string;
    output?: CellOutput;
    executionCount?: number;
    isExecuting?: boolean;
}

export interface NotebookState {
    cells: NotebookCell[];
    executionCount: number;
    kernelState: Record<string, any>; // Variables, imports from previous executions
}

export interface NotebookToolbarProps {
    onAddCodeCell: () => void;
    onAddMarkdownCell: () => void;
    onRunAll: () => void;
    onClearOutputs: () => void;
    onSave: () => void;
    isSaving?: boolean;
}

export interface NotebookCellProps {
    cell: NotebookCell;
    isActive: boolean;
    onRun: (cellId: string) => void;
    onDelete: (cellId: string) => void;
    onMoveUp: (cellId: string) => void;
    onMoveDown: (cellId: string) => void;
    onContentChange: (cellId: string, content: string) => void;
    onFocus: (cellId: string) => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}
