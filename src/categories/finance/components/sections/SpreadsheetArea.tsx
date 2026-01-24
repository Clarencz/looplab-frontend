import { Card, CardContent } from '@/components/ui/card';
import FormulaBar from '@/components/finance/FormulaBar';
import SheetTabs, { type WorksheetData } from '@/components/finance/SheetTabs';
import GeneralLedger, { type LedgerEntry } from '@/components/finance/GeneralLedger';

interface SpreadsheetAreaProps {
    sheets: WorksheetData[];
    activeSheetId: string;
    onSheetChange: (sheetId: string) => void;
    selectedCell: { row: number; col: number } | null;
    cellValue: string | number | null;
    cellFormula: string | null;
    onFormulaChange: (formula: string) => void;
    onFormulaSubmit: () => void;
    onFormulaCancel: () => void;
    ledgerEntries: LedgerEntry[];
    onEntriesChange: (entries: LedgerEntry[]) => void;
}

export function SpreadsheetArea({
    sheets,
    activeSheetId,
    onSheetChange,
    selectedCell,
    cellValue,
    cellFormula,
    onFormulaChange,
    onFormulaSubmit,
    onFormulaCancel,
    ledgerEntries,
    onEntriesChange,
}: SpreadsheetAreaProps) {
    return (
        <Card>
            <CardContent className="p-0">
                {/* Formula Bar */}
                <FormulaBar
                    selectedCell={selectedCell}
                    cellValue={cellValue}
                    cellFormula={cellFormula}
                    onFormulaChange={onFormulaChange}
                    onFormulaSubmit={onFormulaSubmit}
                    onFormulaCancel={onFormulaCancel}
                />

                {/* Sheet Tabs & Content */}
                <SheetTabs
                    sheets={sheets}
                    activeSheetId={activeSheetId}
                    onSheetChange={onSheetChange}
                >
                    <div className="p-4">
                        <GeneralLedger
                            entries={ledgerEntries}
                            onEntriesChange={onEntriesChange}
                            readOnly={false}
                        />
                    </div>
                </SheetTabs>
            </CardContent>
        </Card>
    );
}
