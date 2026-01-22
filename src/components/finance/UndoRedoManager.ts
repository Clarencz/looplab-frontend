/**
 * Undo/Redo Manager for Finance Workspace
 * Implements command pattern for reversible actions
 */

export interface UserAction {
    type: 'cell_edit' | 'row_insert' | 'row_delete' | 'sheet_add' | 'sheet_remove';
    timestamp: Date;
    data: {
        sheetId?: string;
        row?: number;
        col?: number;
        oldValue?: any;
        newValue?: any;
        rowData?: any;
    };
}

export class UndoRedoManager {
    private undoStack: UserAction[] = [];
    private redoStack: UserAction[] = [];
    private maxStackSize: number = 50;

    /**
     * Record a new action
     */
    recordAction(action: UserAction): void {
        this.undoStack.push(action);
        this.redoStack = []; // Clear redo stack on new action

        // Limit stack size
        if (this.undoStack.length > this.maxStackSize) {
            this.undoStack.shift();
        }
    }

    /**
     * Undo the last action
     */
    undo(): UserAction | null {
        const action = this.undoStack.pop();
        if (action) {
            this.redoStack.push(action);
            return action;
        }
        return null;
    }

    /**
     * Redo the last undone action
     */
    redo(): UserAction | null {
        const action = this.redoStack.pop();
        if (action) {
            this.undoStack.push(action);
            return action;
        }
        return null;
    }

    /**
     * Check if undo is available
     */
    canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    /**
     * Check if redo is available
     */
    canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    /**
     * Get undo stack size
     */
    getUndoCount(): number {
        return this.undoStack.length;
    }

    /**
     * Get redo stack size
     */
    getRedoCount(): number {
        return this.redoStack.length;
    }

    /**
     * Clear all history
     */
    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * Get action history (for audit trail)
     */
    getHistory(): UserAction[] {
        return [...this.undoStack];
    }

    /**
     * Get description of last action
     */
    getLastActionDescription(): string | null {
        if (this.undoStack.length === 0) return null;

        const action = this.undoStack[this.undoStack.length - 1];
        switch (action.type) {
            case 'cell_edit':
                return `Edited cell (${action.data.row}, ${action.data.col})`;
            case 'row_insert':
                return `Inserted row ${action.data.row}`;
            case 'row_delete':
                return `Deleted row ${action.data.row}`;
            case 'sheet_add':
                return `Added sheet`;
            case 'sheet_remove':
                return `Removed sheet`;
            default:
                return 'Unknown action';
        }
    }
}

/**
 * Keyboard shortcut handler
 */
export class KeyboardShortcutManager {
    private shortcuts: Map<string, () => void> = new Map();

    /**
     * Register a keyboard shortcut
     */
    register(key: string, callback: () => void): void {
        this.shortcuts.set(key.toLowerCase(), callback);
    }

    /**
     * Handle keyboard event
     */
    handleKeyDown(event: KeyboardEvent): boolean {
        const key = this.getKeyString(event);
        const callback = this.shortcuts.get(key);

        if (callback) {
            event.preventDefault();
            callback();
            return true;
        }

        return false;
    }

    /**
     * Convert keyboard event to key string
     */
    private getKeyString(event: KeyboardEvent): string {
        const parts: string[] = [];

        if (event.ctrlKey || event.metaKey) parts.push('ctrl');
        if (event.shiftKey) parts.push('shift');
        if (event.altKey) parts.push('alt');

        parts.push(event.key.toLowerCase());

        return parts.join('+');
    }

    /**
     * Unregister a shortcut
     */
    unregister(key: string): void {
        this.shortcuts.delete(key.toLowerCase());
    }

    /**
     * Clear all shortcuts
     */
    clear(): void {
        this.shortcuts.clear();
    }

    /**
     * Get all registered shortcuts
     */
    getShortcuts(): string[] {
        return Array.from(this.shortcuts.keys());
    }
}

/**
 * Default keyboard shortcuts for finance workspace
 */
export const DEFAULT_SHORTCUTS = {
    SAVE: 'ctrl+s',
    UNDO: 'ctrl+z',
    REDO_Y: 'ctrl+y',
    REDO_SHIFT_Z: 'ctrl+shift+z',
    FIND: 'ctrl+f',
    FIND_REPLACE: 'ctrl+h',
    RUN_VALIDATION: 'ctrl+enter',
    HELP: '?',
};
