import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ErrorPanel from '@/components/finance/ErrorPanel';
import type { ValidationResult } from '@/components/finance/validation';

interface ValidationPanelProps {
    validationResult: ValidationResult | null;
    onErrorClick: (rowIndex: number) => void;
}

export function ValidationPanel({ validationResult, onErrorClick }: ValidationPanelProps) {
    return (
        <div className="space-y-6">
            <ErrorPanel
                validationResult={validationResult}
                onErrorClick={onErrorClick}
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
    );
}
