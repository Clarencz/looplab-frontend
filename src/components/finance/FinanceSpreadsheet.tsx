import { useRef, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';

// Register Handsontable modules
registerAllModules();

export interface FinanceSpreadsheetProps {
    data: any[][];
    columns?: Handsontable.ColumnSettings[];
    readOnly?: boolean;
    onCellChange?: (changes: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) => void;
    height?: number | string;
    className?: string;
}

export default function FinanceSpreadsheet({
    data,
    columns,
    readOnly = false,
    onCellChange,
    height = 600,
    className = '',
}: FinanceSpreadsheetProps) {
    const hotTableRef = useRef<any>(null);

    const settings: Handsontable.GridSettings = {
        data,
        columns,
        colHeaders: true,
        rowHeaders: true,
        height,
        licenseKey: 'non-commercial-and-evaluation', // For development/evaluation
        readOnly,
        // Enable essential features
        contextMenu: true,
        manualColumnResize: true,
        manualRowResize: true,
        autoWrapRow: true,
        autoWrapCol: true,
        // Styling
        className: `htMiddle htCenter ${className}`,
        // Cell editing
        enterMoves: { row: 1, col: 0 },
        tabMoves: { row: 0, col: 1 },
        // Callbacks
        afterChange: onCellChange,
    };

    return (
        <div className="finance-spreadsheet-container">
            <HotTable
                ref={hotTableRef}
                settings={settings}
            />
        </div>
    );
}
