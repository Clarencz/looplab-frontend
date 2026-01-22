import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, AlertCircle } from 'lucide-react';
import { LedgerEntry } from './GeneralLedger';

export interface RedFlag {
    type: 'revenue_recognition' | 'inventory_buildup' | 'receivables_decline' | 'margin_compression' | 'unusual_expense';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    metric?: string;
    recommendation: string;
}

export interface RedFlagDetectionProps {
    ledgerEntries: LedgerEntry[];
    onFlagClick?: (flag: RedFlag) => void;
}

export default function RedFlagDetection({ ledgerEntries, onFlagClick }: RedFlagDetectionProps) {
    const detectRedFlags = (): RedFlag[] => {
        const flags: RedFlag[] = [];

        // 1. Revenue Recognition Red Flags
        const revenue = ledgerEntries
            .filter(e => e.account === 'Revenue' && e.credit)
            .reduce((sum, e) => sum + (e.credit || 0), 0);

        const receivables = ledgerEntries
            .filter(e => e.account === 'Receivables' && e.debit)
            .reduce((sum, e) => sum + (e.debit || 0), 0);

        if (receivables > revenue * 0.5) {
            flags.push({
                type: 'revenue_recognition',
                severity: 'high',
                title: 'High Receivables Relative to Revenue',
                description: 'Receivables are more than 50% of revenue, suggesting aggressive revenue recognition or collection issues.',
                metric: `Receivables: $${receivables.toFixed(2)} | Revenue: $${revenue.toFixed(2)}`,
                recommendation: 'Review revenue recognition policies and aging of receivables. Investigate if revenue is being recognized before cash collection.',
            });
        }

        // 2. Inventory Buildup
        const inventory = ledgerEntries
            .filter(e => e.account === 'Inventory' && e.debit)
            .reduce((sum, e) => sum + (e.debit || 0), 0);

        const cogs = ledgerEntries
            .filter(e => e.account === 'COGS' && e.debit)
            .reduce((sum, e) => sum + (e.debit || 0), 0);

        if (inventory > cogs * 2 && cogs > 0) {
            flags.push({
                type: 'inventory_buildup',
                severity: 'medium',
                title: 'Excessive Inventory Buildup',
                description: 'Inventory is more than 2x COGS, indicating potential obsolescence or overproduction.',
                metric: `Inventory: $${inventory.toFixed(2)} | COGS: $${cogs.toFixed(2)}`,
                recommendation: 'Review inventory turnover ratio. Check for slow-moving or obsolete inventory. Consider write-downs.',
            });
        }

        // 3. Margin Compression
        const expenses = ledgerEntries
            .filter(e => e.account === 'Expenses' && e.debit)
            .reduce((sum, e) => sum + (e.debit || 0), 0);

        const grossMargin = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0;
        const netMargin = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0;

        if (netMargin < 10 && revenue > 0) {
            flags.push({
                type: 'margin_compression',
                severity: 'high',
                title: 'Low Net Profit Margin',
                description: 'Net margin is below 10%, indicating pricing pressure or cost control issues.',
                metric: `Net Margin: ${netMargin.toFixed(1)}%`,
                recommendation: 'Analyze expense categories for cost reduction opportunities. Review pricing strategy. Benchmark against industry standards.',
            });
        }

        // 4. Unusual Expense Patterns
        const expenseEntries = ledgerEntries.filter(e => e.account === 'Expenses' && e.debit);
        if (expenseEntries.length > 0) {
            const avgExpense = expenses / expenseEntries.length;
            const unusualExpenses = expenseEntries.filter(e => (e.debit || 0) > avgExpense * 3);

            if (unusualExpenses.length > 0) {
                flags.push({
                    type: 'unusual_expense',
                    severity: 'medium',
                    title: 'Unusual Expense Transactions',
                    description: `${unusualExpenses.length} expense transaction(s) are 3x higher than average, requiring investigation.`,
                    metric: `Average Expense: $${avgExpense.toFixed(2)}`,
                    recommendation: 'Review large expense transactions for legitimacy. Check for duplicate entries or fraud. Verify proper authorization.',
                });
            }
        }

        // 5. Receivables Turnover Decline
        const cash = ledgerEntries
            .filter(e => e.account === 'Cash' && e.debit)
            .reduce((sum, e) => sum + (e.debit || 0), 0);

        if (receivables > cash * 2 && cash > 0) {
            flags.push({
                type: 'receivables_decline',
                severity: 'medium',
                title: 'High Receivables vs Cash',
                description: 'Receivables are more than 2x cash balance, suggesting collection problems.',
                metric: `Receivables: $${receivables.toFixed(2)} | Cash: $${cash.toFixed(2)}`,
                recommendation: 'Review accounts receivable aging report. Implement stricter credit policies. Accelerate collections.',
            });
        }

        return flags;
    };

    const redFlags = detectRedFlags();
    const highSeverityCount = redFlags.filter(f => f.severity === 'high').length;
    const mediumSeverityCount = redFlags.filter(f => f.severity === 'medium').length;

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'medium':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return <TrendingDown className="w-5 h-5 text-blue-600" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            default:
                return 'secondary';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Red Flag Detection</span>
                    <div className="flex gap-2">
                        {highSeverityCount > 0 && (
                            <Badge variant="destructive">
                                {highSeverityCount} High
                            </Badge>
                        )}
                        {mediumSeverityCount > 0 && (
                            <Badge variant="default">
                                {mediumSeverityCount} Medium
                            </Badge>
                        )}
                        {redFlags.length === 0 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                No Red Flags
                            </Badge>
                        )}
                    </div>
                </CardTitle>
                <CardDescription>
                    Automated detection of financial statement red flags and anomalies
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {redFlags.length === 0 ? (
                    <Alert>
                        <AlertDescription className="flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            No red flags detected. Financial statements appear healthy.
                        </AlertDescription>
                    </Alert>
                ) : (
                    redFlags.map((flag, index) => (
                        <Card
                            key={index}
                            className="border-l-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            style={{
                                borderLeftColor: flag.severity === 'high' ? '#ef4444' : flag.severity === 'medium' ? '#f59e0b' : '#3b82f6'
                            }}
                            onClick={() => onFlagClick?.(flag)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    {getSeverityIcon(flag.severity)}
                                    {flag.title}
                                    <Badge variant={getSeverityColor(flag.severity) as any} className="ml-auto">
                                        {flag.severity.toUpperCase()}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {flag.description}
                                </p>

                                {flag.metric && (
                                    <div className="bg-muted/50 p-2 rounded text-sm font-mono">
                                        {flag.metric}
                                    </div>
                                )}

                                <Alert>
                                    <AlertDescription className="text-sm">
                                        <strong>Recommendation:</strong> {flag.recommendation}
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
