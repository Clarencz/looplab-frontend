import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Undo2, Redo2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SheetTabs, { type WorksheetData } from '@/components/finance/SheetTabs';
import FormulaBar from '@/components/finance/FormulaBar';
import GeneralLedger, { type LedgerEntry } from '@/components/finance/GeneralLedger';
import ErrorPanel from '@/components/finance/ErrorPanel';
import { runAllValidations, type ValidationResult } from '@/components/finance/validation';

// Sample data with intentional errors
const generateSampleLedger = (): LedgerEntry[] => {
    return [
        { date: '2024-01-01', description: 'Opening Balance', account: 'Cash', debit: 10000, credit: null },
        { date: '2024-01-05', description: 'Office Supplies', account: 'Expenses', debit: 250, credit: null },
        { date: '2024-01-05', description: 'Office Supplies Payment', account: 'Cash', debit: null, credit: 250 },
        { date: '2024-01-10', description: 'Client Payment - Invoice #001', account: 'Cash', debit: 5000, credit: null },
        { date: '2024-01-10', description: 'Revenue Recognition', account: 'Revenue', debit: null, credit: 5000 },
        // ERROR 1: Duplicate payment
        { date: '2024-01-15', description: 'Rent Payment', account: 'Cash', debit: null, credit: 2000 },
        { date: '2024-01-15', description: 'Rent Payment', account: 'Cash', debit: null, credit: 2000 }, // DUPLICATE!
        { date: '2024-01-15', description: 'Rent Expense', account: 'Expenses', debit: 2000, credit: null },
        // ERROR 2: Transposed numbers ($1,234 should be $1,324)
        { date: '2024-01-20', description: 'Equipment Purchase', account: 'Assets', debit: 1234, credit: null }, // WRONG!
        { date: '2024-01-20', description: 'Equipment Payment', account: 'Cash', debit: null, credit: 1324 },
        { date: '2024-01-25', description: 'Salary Payment', account: 'Cash', debit: null, credit: 3500 },
        { date: '2024-01-25', description: 'Salary Expense', account: 'Expenses', debit: 3500, credit: null },
        // ERROR 3: Missing accrual
        { date: '2024-01-31', description: 'Utilities Expense', account: 'Expenses', debit: 450, credit: null },
        // Missing: Utilities Payable credit entry
    ];
};

export default function FinanceWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Workbook state
    const [sheets, setSheets] = useState<WorksheetData[]>([
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
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {category?.name || 'Finance & Economics'}
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUndo}
                        disabled={!canUndo}
                    >
                        <Undo2 className="w-4 h-4 mr-2" />
                        Undo
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRedo}
                        disabled={!canRedo}
                    >
                        <Redo2 className="w-4 h-4 mr-2" />
                        Redo
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleRunValidation}
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Run Validation
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Spreadsheet Area */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-0">
                                    {/* Formula Bar */}
                                    <FormulaBar
                                        selectedCell={selectedCell}
                                        cellValue={cellValue}
                                        cellFormula={cellFormula}
                                        onFormulaChange={handleFormulaChange}
                                        onFormulaSubmit={handleFormulaSubmit}
                                        onFormulaCancel={handleFormulaCancel}
                                    />

                                    {/* Sheet Tabs & Content */}
                                    <SheetTabs
                                        sheets={sheets}
                                        activeSheetId={activeSheetId}
                                        onSheetChange={setActiveSheetId}
                                    >
                                        <div className="p-4">
                                            <GeneralLedger
                                                entries={ledgerEntries}
                                                onEntriesChange={handleEntriesChange}
                                                readOnly={false}
                                            />
                                        </div>
                                    </SheetTabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Validation Panel */}
                        <div className="space-y-6">
                            <ErrorPanel
                                validationResult={validationResult}
                                onErrorClick={handleErrorClick}
                            />

                            {/* Instructions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Instructions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <p>• <strong>Error 1:</strong> Duplicate payment - Find the transaction recorded twice</p>
                                    <p>• <strong>Error 2:</strong> Transposed numbers - Find where debit ≠ credit</p>
                                    <p>• <strong>Error 3:</strong> Missing accrual - Find expense without payable</p>
                                    <p className="text-muted-foreground mt-4">
                                        💡 Tip: Click "Run Validation" to check your progress
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
