import { LedgerEntry } from './GeneralLedger';

export interface ErrorReport {
    errorType: 'duplicate_payment' | 'transposed_numbers' | 'missing_accrual';
    affectedRows: number[];
    severity: 'high' | 'medium' | 'low';
    message: string;
    hint: string;
}

export interface ValidationResult {
    totalErrors: number;
    errors: ErrorReport[];
    score: number;
    feedback: string[];
}

/**
 * Detect duplicate payments in the ledger
 */
export function detectDuplicatePayments(ledger: LedgerEntry[]): ErrorReport {
    const seen = new Map<string, number[]>();
    const duplicates: number[] = [];

    ledger.forEach((entry, index) => {
        // Create a key from date, description, and credit amount
        const key = `${entry.date}-${entry.description}-${entry.credit}`;

        if (entry.credit && entry.credit > 0) {
            if (seen.has(key)) {
                const existingIndices = seen.get(key)!;
                duplicates.push(...existingIndices, index);
                seen.set(key, [...existingIndices, index]);
            } else {
                seen.set(key, [index]);
            }
        }
    });

    return {
        errorType: 'duplicate_payment',
        affectedRows: [...new Set(duplicates)],
        severity: 'high',
        message: 'Duplicate payment detected - same transaction recorded multiple times',
        hint: 'Look for identical date, description, and credit amount. One entry should be removed.',
    };
}

/**
 * Detect transposed numbers (where debit ≠ credit for related transactions)
 */
export function detectTransposedNumbers(ledger: LedgerEntry[]): ErrorReport {
    const errors: number[] = [];

    // Look for pairs of transactions on the same date
    for (let i = 0; i < ledger.length - 1; i++) {
        const current = ledger[i];
        const next = ledger[i + 1];

        // Check if they're related (same date, one has debit, other has credit)
        if (
            current.date === next.date &&
            current.debit &&
            next.credit &&
            current.debit > 0 &&
            next.credit > 0
        ) {
            // Check if amounts don't match (allowing for small rounding errors)
            const difference = Math.abs(current.debit - next.credit);
            if (difference > 0.01) {
                errors.push(i, i + 1);
            }
        }
    }

    return {
        errorType: 'transposed_numbers',
        affectedRows: [...new Set(errors)],
        severity: 'medium',
        message: 'Debit and credit amounts don\'t match - possible transposed digits',
        hint: 'Check if numbers were swapped (e.g., $1,234 vs $1,324). The debit should equal the credit.',
    };
}

/**
 * Detect missing accruals (expenses without corresponding payable/cash entries)
 */
export function detectMissingAccrual(ledger: LedgerEntry[]): ErrorReport {
    const missingAccruals: number[] = [];

    // Find all expense entries
    const expenseEntries = ledger
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => entry.account === 'Expenses' && entry.debit && entry.debit > 0);

    expenseEntries.forEach(({ entry, index }) => {
        // Check if there's a corresponding credit entry (Cash or Payables)
        const hasMatchingCredit = ledger.some((e, i) => {
            if (i === index) return false; // Skip the same entry

            // Look for matching date and amount
            return (
                e.date === entry.date &&
                e.credit &&
                Math.abs(e.credit - entry.debit!) < 0.01 &&
                (e.account === 'Cash' || e.account === 'Payables')
            );
        });

        if (!hasMatchingCredit) {
            missingAccruals.push(index);
        }
    });

    return {
        errorType: 'missing_accrual',
        affectedRows: missingAccruals,
        severity: 'high',
        message: 'Expense recorded without corresponding payable or cash payment',
        hint: 'Every expense debit should have a matching credit to Cash (if paid) or Payables (if accrued).',
    };
}

/**
 * Run all validation checks
 */
export function runAllValidations(ledger: LedgerEntry[]): ValidationResult {
    const errors = [
        detectDuplicatePayments(ledger),
        detectTransposedNumbers(ledger),
        detectMissingAccrual(ledger),
    ].filter((e) => e.affectedRows.length > 0);

    const totalErrors = errors.reduce((sum, e) => sum + e.affectedRows.length, 0);
    const score = calculateScore(errors);
    const feedback = generateFeedback(errors);

    return {
        totalErrors: errors.length,
        errors,
        score,
        feedback,
    };
}

/**
 * Calculate score based on errors found
 */
function calculateScore(errors: ErrorReport[]): number {
    const maxScore = 100;
    const errorCount = errors.length;

    if (errorCount === 0) return maxScore;

    // Deduct points based on severity
    let deductions = 0;
    errors.forEach((error) => {
        switch (error.severity) {
            case 'high':
                deductions += 30;
                break;
            case 'medium':
                deductions += 20;
                break;
            case 'low':
                deductions += 10;
                break;
        }
    });

    return Math.max(0, maxScore - deductions);
}

/**
 * Generate feedback messages
 */
function generateFeedback(errors: ErrorReport[]): string[] {
    const feedback: string[] = [];

    if (errors.length === 0) {
        feedback.push('✅ Perfect! All errors have been found and corrected.');
        feedback.push('Your ledger is now balanced and accurate.');
        return feedback;
    }

    feedback.push(`⚠️ ${errors.length} error type(s) remaining in the ledger.`);

    errors.forEach((error) => {
        feedback.push(`• ${error.message}`);
        feedback.push(`  💡 Hint: ${error.hint}`);
    });

    return feedback;
}
