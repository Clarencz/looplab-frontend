// Validation Summary Component (inline display)

import type { ValidationResult } from '@/lib/api';

interface ValidationSummaryProps {
    result: ValidationResult;
}

export function ValidationSummary({ result }: ValidationSummaryProps) {
    return (
        <div className="mt-4 p-3 bg-muted rounded">
            <h4 className="font-semibold">Validation Result</h4>
            <p>Score: {result.totalScore}%</p>
            <p>Status: {result.overallStatus}</p>
        </div>
    );
}
