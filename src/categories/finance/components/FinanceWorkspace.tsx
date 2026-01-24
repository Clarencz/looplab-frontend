import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces';
import { useToast } from '@/hooks/use-toast';
import type { WorksheetData } from '@/components/finance/SheetTabs';
import type { LedgerEntry } from '@/components/finance/GeneralLedger';
import { runAllValidations, type ValidationResult } from '@/components/finance/validation';

// Local components
import { FinanceWorkspaceHeader } from './FinanceWorkspaceHeader';
import { FinanceToolbar } from './FinanceToolbar';
import { SpreadsheetArea } from './sections/SpreadsheetArea';
import { ValidationPanel } from './sections/ValidationPanel';
import { generateSampleLedger } from './sampleData';

export default function FinanceWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Workbook state
    const [sheets] = useState<WorksheetData[]>([
        {
            id: 'general-ledger',
            name: 'General Ledger',
            data: [],
            columns: [],
        },
    ]);
    const [activeSheetId, setActiveSheetId] = useState('general-ledger');

    // Ledger data
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(generateSampleLedger());

    // Formula bar state
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [cellValue, setCellValue] = useState<string | number | null>(null);
    const [cellFormula, setCellFormula] = useState<string | null>(null);

    // Validation state
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

    // Undo/Redo (simplified for now)
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Auto-save timer
    const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

    // Run validation whenever ledger changes
    useEffect(() => {
        const result = runAllValidations(ledgerEntries);
        setValidationResult(result);
    }, [ledgerEntries]);

    // Auto-save setup
    useEffect(() => {
        if (autoSaveTimer.current) {
            clearTimeout(autoSaveTimer.current);
        }

        autoSaveTimer.current = setTimeout(() => {
            handleSave();
        }, 30000); // Auto-save every 30 seconds

        return () => {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
            }
        };
    }, [ledgerEntries]);

    const handleEntriesChange = (newEntries: LedgerEntry[]) => {
        setLedgerEntries(newEntries);
    };

    const handleFormulaChange = (formula: string) => {
        // TODO: Update cell with formula
        console.log('Formula changed:', formula);
    };

    const handleFormulaSubmit = () => {
        // TODO: Apply formula to cell
        console.log('Formula submitted');
    };

    const handleFormulaCancel = () => {
        // TODO: Cancel formula editing
        console.log('Formula cancelled');
    };

    const handleSave = () => {
        // Save to localStorage
        const saveData = {
            timestamp: new Date().toISOString(),
            ledgerEntries,
            validationResult,
        };

        localStorage.setItem('finance-workspace-state', JSON.stringify(saveData));

        toast({
            title: 'Progress Saved',
            description: 'Your work has been saved automatically.',
        });
    };

    const handleUndo = () => {
        // TODO: Implement undo
        toast({
            title: 'Undo',
            description: 'Undo functionality coming soon!',
        });
    };

    const handleRedo = () => {
        // TODO: Implement redo
        toast({
            title: 'Redo',
            description: 'Redo functionality coming soon!',
        });
    };

    const handleErrorClick = (rowIndex: number) => {
        // TODO: Scroll to and highlight the error row
        toast({
            title: 'Error Location',
            description: `Error found in row ${rowIndex + 1}`,
        });
    };

    const handleRunValidation = () => {
        const result = runAllValidations(ledgerEntries);
        setValidationResult(result);

        toast({
            title: 'Validation Complete',
            description: `Found ${result.totalErrors} error type(s). Score: ${result.score}/100`,
        });
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                <FinanceWorkspaceHeader
                    project={project}
                    category={category}
                    onBack={() => navigate(-1)}
                />

                {/* Toolbar */}
                <FinanceToolbar
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onSave={handleSave}
                    onRunValidation={handleRunValidation}
                />
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Spreadsheet Area */}
                        <div className="lg:col-span-2">
                            <SpreadsheetArea
                                sheets={sheets}
                                activeSheetId={activeSheetId}
                                onSheetChange={setActiveSheetId}
                                selectedCell={selectedCell}
                                cellValue={cellValue}
                                cellFormula={cellFormula}
                                onFormulaChange={handleFormulaChange}
                                onFormulaSubmit={handleFormulaSubmit}
                                onFormulaCancel={handleFormulaCancel}
                                ledgerEntries={ledgerEntries}
                                onEntriesChange={handleEntriesChange}
                            />
                        </div>

                        {/* Validation Panel */}
                        <ValidationPanel
                            validationResult={validationResult}
                            onErrorClick={handleErrorClick}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
