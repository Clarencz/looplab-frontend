import FinanceSpreadsheet from './FinanceSpreadsheet';
import Handsontable from 'handsontable';

export interface LedgerEntry {
    date: string;
    description: string;
    account: string;
    debit: number | null;
    credit: number | null;
    balance?: number;
}

export interface GeneralLedgerProps {
    entries: LedgerEntry[];
    onEntriesChange?: (entries: LedgerEntry[]) => void;
    readOnly?: boolean;
}

export default function GeneralLedger({
    entries,
    onEntriesChange,
    readOnly = false,
}: GeneralLedgerProps) {
    // Convert entries to 2D array format for Handsontable
    const data = entries.map(entry => [
        entry.date,
        entry.description,
        entry.account,
        entry.debit,
        entry.credit,
        entry.balance || 0,
    ]);

    // Define column settings
    const columns: Handsontable.ColumnSettings[] = [
        {
            title: 'Date',
            type: 'date',
            dateFormat: 'YYYY-MM-DD',
            width: 120,
        },
        {
            title: 'Description',
            type: 'text',
            width: 250,
        },
        {
            title: 'Account',
            type: 'text',
            width: 150,
        },
        {
            title: 'Debit',
            type: 'numeric',
            numericFormat: {
                pattern: '$0,0.00',
            },
            width: 120,
        },
        {
            title: 'Credit',
            type: 'numeric',
            numericFormat: {
                pattern: '$0,0.00',
            },
            width: 120,
        },
        {
            title: 'Balance',
            type: 'numeric',
            numericFormat: {
                pattern: '$0,0.00',
            },
            width: 120,
            readOnly: true, // Balance is calculated
            className: 'htRight font-bold',
        },
    ];

    const handleCellChange = (changes: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) => {
        if (!changes || source === 'loadData') return;

        // Recalculate balances when debits/credits change
        const updatedEntries = [...entries];
        let runningBalance = 0;

        updatedEntries.forEach((entry, index) => {
            const debit = entry.debit || 0;
            const credit = entry.credit || 0;
            runningBalance += debit - credit;
            updatedEntries[index].balance = runningBalance;
        });

        onEntriesChange?.(updatedEntries);
    };

    return (
        <div className="general-ledger">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">General Ledger</h3>
                <p className="text-sm text-muted-foreground">
                    Track all financial transactions with running balance
                </p>
            </div>

            <FinanceSpreadsheet
                data={data}
                columns={columns}
                readOnly={readOnly}
                onCellChange={handleCellChange}
                height={500}
                className="ledger-grid"
            />
        </div>
    );
}
