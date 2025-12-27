import { Play, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/workspace/CodeEditor';
import { NotebookCellProps } from '../types';
import { CellOutput } from './CellOutput';
import { cn } from '@/lib/utils';

export function NotebookCell({
    cell,
    isActive,
    onRun,
    onDelete,
    onMoveUp,
    onMoveDown,
    onContentChange,
    onFocus,
    canMoveUp,
    canMoveDown,
}: NotebookCellProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Shift+Enter to run cell
        if (e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            onRun(cell.id);
        }
    };

    return (
        <div
            className={cn(
                'group relative border rounded-lg transition-all',
                isActive
                    ? 'border-primary shadow-md'
                    : 'border-border hover:border-primary/50'
            )}
            onClick={() => onFocus(cell.id)}
        >
            {/* Cell toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                        {cell.type === 'code' ? 'Code' : 'Markdown'}
                        {cell.executionCount !== undefined && ` [${cell.executionCount}]`}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRun(cell.id);
                        }}
                        disabled={cell.isExecuting}
                        title="Run cell (Shift+Enter)"
                    >
                        {cell.isExecuting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp(cell.id);
                        }}
                        disabled={!canMoveUp}
                        title="Move up"
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown(cell.id);
                        }}
                        disabled={!canMoveDown}
                        title="Move down"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(cell.id);
                        }}
                        title="Delete cell"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Cell content */}
            <div className="p-3" onKeyDown={handleKeyDown}>
                {cell.type === 'code' ? (
                    <div className="min-h-[100px]">
                        <CodeEditor
                            value={cell.content}
                            onChange={(value) => onContentChange(cell.id, value || '')}
                            language="python"
                            height="auto"
                            minHeight={100}
                        />
                    </div>
                ) : (
                    <textarea
                        value={cell.content}
                        onChange={(e) => onContentChange(cell.id, e.target.value)}
                        className="w-full min-h-[100px] bg-transparent border-none outline-none resize-none font-mono text-sm"
                        placeholder="Write markdown here..."
                    />
                )}

                {/* Cell output */}
                {cell.output && <CellOutput output={cell.output} />}
            </div>
        </div>
    );
}
