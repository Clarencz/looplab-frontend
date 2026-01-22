import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, Check, X } from 'lucide-react';

export interface FormulaBarProps {
    selectedCell: { row: number; col: number } | null;
    cellValue: string | number | null;
    cellFormula: string | null;
    onFormulaChange: (formula: string) => void;
    onFormulaSubmit: () => void;
    onFormulaCancel: () => void;
}

export default function FormulaBar({
    selectedCell,
    cellValue,
    cellFormula,
    onFormulaChange,
    onFormulaSubmit,
    onFormulaCancel,
}: FormulaBarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const cellReference = selectedCell
        ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}`
        : '';

    const displayValue = cellFormula || cellValue?.toString() || '';

    const handleStartEdit = () => {
        setIsEditing(true);
        setEditValue(displayValue);
    };

    const handleSubmit = () => {
        onFormulaChange(editValue);
        onFormulaSubmit();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValue('');
        onFormulaCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
            {/* Cell Reference */}
            <div className="flex items-center gap-1 px-3 py-1 bg-background border rounded min-w-[80px]">
                <Calculator className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-mono font-semibold">
                    {cellReference || '--'}
                </span>
            </div>

            {/* Formula Input */}
            <div className="flex-1 flex items-center gap-2">
                {isEditing ? (
                    <>
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 font-mono text-sm"
                            placeholder="Enter formula or value..."
                            autoFocus
                        />
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={handleSubmit}
                        >
                            <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={handleCancel}
                        >
                            <X className="h-4 w-4 text-red-600" />
                        </Button>
                    </>
                ) : (
                    <div
                        className="flex-1 px-3 py-2 bg-background border rounded cursor-text hover:border-primary/50 transition-colors"
                        onClick={handleStartEdit}
                    >
                        <span className="text-sm font-mono">
                            {displayValue || <span className="text-muted-foreground">Click to edit...</span>}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
