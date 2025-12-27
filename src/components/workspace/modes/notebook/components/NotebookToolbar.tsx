import { Plus, Play, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotebookToolbarProps } from '../types';

export function NotebookToolbar({
    onAddCodeCell,
    onAddMarkdownCell,
    onRunAll,
    onClearOutputs,
    onSave,
    isSaving = false,
}: NotebookToolbarProps) {
    return (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddCodeCell}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Code
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddMarkdownCell}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Markdown
                </Button>
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRunAll}
                    className="gap-2"
                >
                    <Play className="h-4 w-4" />
                    Run All
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearOutputs}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Clear Outputs
                </Button>
            </div>

            <div className="flex-1" />

            <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="gap-2"
            >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );
}
