import type { LedgerEntry } from '@/components/finance/GeneralLedger';

// Sample data with intentional errors for learning
export const generateSampleLedger = (): LedgerEntry[] => {
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
