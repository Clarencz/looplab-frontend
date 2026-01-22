import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LedgerEntry } from './GeneralLedger';

export interface FinancialPeriod {
    name: string;
    startDate: string;
    endDate: string;
}

export interface IncomeStatementProps {
    ledgerEntries: LedgerEntry[];
    period: FinancialPeriod;
    comparisonPeriod?: FinancialPeriod;
}

interface LineItem {
    label: string;
    amount: number;
    comparisonAmount?: number;
    isSubtotal?: boolean;
    isTotal?: boolean;
    indent?: number;
}

export default function IncomeStatement({
    ledgerEntries,
    period,
    comparisonPeriod,
}: IncomeStatementProps) {
    // Calculate revenue
    const revenue = ledgerEntries
        .filter(e => e.account === 'Revenue' && e.credit)
        .reduce((sum, e) => sum + (e.credit || 0), 0);

    // Calculate expenses
    const expenses = ledgerEntries
        .filter(e => e.account === 'Expenses' && e.debit)
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    // Calculate net income
    const netIncome = revenue - expenses;

    // Build line items
    const lineItems: LineItem[] = [
        { label: 'Revenue', amount: revenue, isSubtotal: true },
        { label: '', amount: 0 }, // Spacer
        { label: 'Operating Expenses', amount: expenses, isSubtotal: true },
        { label: '', amount: 0 }, // Spacer
        { label: 'Net Income', amount: netIncome, isTotal: true },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getTrendIcon = (current: number, previous: number) => {
        if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const getChangePercent = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / Math.abs(previous)) * 100;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Income Statement</CardTitle>
                <CardDescription>
                    For the period: {period.startDate} to {period.endDate}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {lineItems.map((item, index) => {
                        if (!item.label) return <div key={index} className="h-4" />; // Spacer

                        const isNegative = item.amount < 0;
                        const indent = item.indent || 0;

                        return (
                            <div
                                key={index}
                                className={`flex justify-between items-center py-2 ${item.isTotal ? 'border-t-2 border-b-2 border-primary font-bold text-lg' :
                                        item.isSubtotal ? 'border-t font-semibold' :
                                            ''
                                    }`}
                                style={{ paddingLeft: `${indent * 1.5}rem` }}
                            >
                                <span className={item.isTotal ? 'text-primary' : ''}>
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono ${item.isTotal ? 'text-primary font-bold' :
                                            isNegative ? 'text-red-600' :
                                                'text-foreground'
                                        }`}>
                                        {formatCurrency(item.amount)}
                                    </span>

                                    {item.comparisonAmount !== undefined && (
                                        <div className="flex items-center gap-2 min-w-[120px]">
                                            {getTrendIcon(item.amount, item.comparisonAmount)}
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {getChangePercent(item.amount, item.comparisonAmount).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Key Metrics */}
                <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-lg font-bold font-mono">{formatCurrency(revenue)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <p className="text-lg font-bold font-mono text-red-600">{formatCurrency(expenses)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Net Margin</p>
                        <p className="text-lg font-bold font-mono">
                            {revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
