import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { ValidationResult, ErrorReport } from './validation';

export interface ErrorPanelProps {
    validationResult: ValidationResult | null;
    onErrorClick?: (rowIndex: number) => void;
}

export default function ErrorPanel({ validationResult, onErrorClick }: ErrorPanelProps) {
    if (!validationResult) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Validation
                    </CardTitle>
                    <CardDescription>
                        Error detection will run automatically as you edit the ledger
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const { totalErrors, errors, score, feedback } = validationResult;
    const allErrorsFound = totalErrors === 0;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <XCircle className="w-4 h-4" />;
            case 'medium':
                return <AlertCircle className="w-4 h-4" />;
            case 'low':
                return <Lightbulb className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {allErrorsFound ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                        Validation Results
                    </span>
                    <Badge variant={allErrorsFound ? 'default' : 'destructive'}>
                        Score: {score}/100
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {allErrorsFound
                        ? 'All errors found! Great work.'
                        : `${totalErrors} error type(s) detected`}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Feedback Messages */}
                <div className="space-y-2">
                    {feedback.map((message, index) => (
                        <Alert key={index} variant={allErrorsFound ? 'default' : 'destructive'}>
                            <AlertDescription className="text-sm">{message}</AlertDescription>
                        </Alert>
                    ))}
                </div>

                {/* Error Details */}
                {errors.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Error Details:</h4>
                        {errors.map((error, index) => (
                            <Card key={index} className="border-l-4" style={{
                                borderLeftColor: error.severity === 'high' ? '#ef4444' : error.severity === 'medium' ? '#f59e0b' : '#3b82f6'
                            }}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        {getSeverityIcon(error.severity)}
                                        {error.message}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                                        <p className="text-sm text-muted-foreground">{error.hint}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-muted-foreground">Affected rows:</span>
                                        {error.affectedRows.map((rowIndex) => (
                                            <Badge
                                                key={rowIndex}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary/10"
                                                onClick={() => onErrorClick?.(rowIndex)}
                                            >
                                                Row {rowIndex + 1}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
