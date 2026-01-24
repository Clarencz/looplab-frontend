import { Button } from '@/components/ui/button';
import { Save, Undo2, Redo2, Play } from 'lucide-react';

interface FinanceToolbarProps {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onSave: () => void;
    onRunValidation: () => void;
}

export function FinanceToolbar({
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onSave,
    onRunValidation,
}: FinanceToolbarProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
            >
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
            >
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onSave}
            >
                <Save className="w-4 h-4 mr-2" />
                Save
            </Button>

            <Button
                size="sm"
                onClick={onRunValidation}
            >
                <Play className="w-4 h-4 mr-2" />
                Run Validation
            </Button>
        </div>
    );
}
