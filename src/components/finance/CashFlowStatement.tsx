import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LedgerEntry } from './GeneralLedger';

export interface CashFlowStatementProps {
    ledgerEntries: LedgerEntry[];
    period: {
        startDate: string;
        endDate: string;
    };
}

export default function CashFlowStatement({ ledgerEntries, period }: CashFlowStatementProps) {
    // Calculate Net Income
    const revenue = ledgerEntries
        .filter(e => e.account === 'Revenue' && e.credit)
        .reduce((sum, e) => sum + (e.credit || 0), 0);

    const expenses = ledgerEntries
        .filter(e => e.account === 'Expenses' && e.debit)
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    const netIncome = revenue - expenses;

    // Operating Activities
    const receivablesChange = ledgerEntries
        .filter(e => e.account === 'Receivables')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const inventoryChange = ledgerEntries
        .filter(e => e.account === 'Inventory')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const payablesChange = ledgerEntries
        .filter(e => e.account === 'Payables')
        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

    // Adjustments to reconcile net income to cash from operations
    const operatingActivities = netIncome - receivablesChange - inventoryChange + payablesChange;

    // Investing Activities
    const assetPurchases = ledgerEntries
        .filter(e => e.account === 'Assets' && e.debit)
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    const investingActivities = -assetPurchases;

    // Financing Activities
    const loanProceeds = ledgerEntries
        .filter(e => e.account === 'Loans' && e.credit)
        .reduce((sum, e) => sum + (e.credit || 0), 0);

    const loanRepayments = ledgerEntries
        .filter(e => e.account === 'Loans' && e.debit)
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    const financingActivities = loanProceeds - loanRepayments;

    // Net Change in Cash
    const netCashChange = operatingActivities + investingActivities + financingActivities;

    // Beginning and Ending Cash
    const endingCash = ledgerEntries
        .filter(e => e.account === 'Cash')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const beginningCash = endingCash - netCashChange;

    // Free Cash Flow
    const freeCashFlow = operatingActivities + investingActivities;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getTrendIcon = (amount: number) => {
        if (amount > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (amount < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const sections = [
        {
            title: 'Operating Activities',
            items: [
                { label: 'Net Income', amount: netIncome },
                { label: 'Adjustments to reconcile net income:', amount: 0, isSubheading: true },
                { label: 'Increase in Accounts Receivable', amount: -receivablesChange, indent: 1 },
                { label: 'Increase in Inventory', amount: -inventoryChange, indent: 1 },
                { label: 'Increase in Accounts Payable', amount: payablesChange, indent: 1 },
            ],
            total: operatingActivities,
        },
        {
            title: 'Investing Activities',
            items: [
                { label: 'Purchase of Property & Equipment', amount: -assetPurchases },
            ],
            total: investingActivities,
        },
        {
            title: 'Financing Activities',
            items: [
                { label: 'Proceeds from Loans', amount: loanProceeds },
                { label: 'Repayment of Loans', amount: -loanRepayments },
            ],
            total: financingActivities,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cash Flow Statement</CardTitle>
                <CardDescription>
                    For the period: {period.startDate} to {period.endDate}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Cash Flow Sections */}
                {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                const indent = item.indent || 0;
                                const isSubheading = item.isSubheading;

                                return (
                                    <div
                                        key={itemIndex}
                                        className={`flex justify-between py-1 ${isSubheading ? 'text-sm text-muted-foreground font-semibold' : ''
                                            }`}
                                        style={{ paddingLeft: `${indent * 1.5}rem` }}
                                    >
                                        <span>{item.label}</span>
                                        {!isSubheading && (
                                            <div className="flex items-center gap-2">
                                                <span className={`font-mono ${item.amount < 0 ? 'text-red-600' : item.amount > 0 ? 'text-green-600' : ''
                                                    }`}>
                                                    {formatCurrency(item.amount)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="flex justify-between py-2 border-t font-semibold">
                                <span>Net Cash from {section.title}</span>
                                <div className="flex items-center gap-2">
                                    {getTrendIcon(section.total)}
                                    <span className={`font-mono ${section.total < 0 ? 'text-red-600' : section.total > 0 ? 'text-green-600' : ''
                                        }`}>
                                        {formatCurrency(section.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Net Change in Cash */}
                <div className="pt-4 border-t-2 border-primary">
                    <div className="space-y-2">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Net Change in Cash</span>
                            <div className="flex items-center gap-2">
                                {getTrendIcon(netCashChange)}
                                <span className={`font-mono ${netCashChange < 0 ? 'text-red-600' : netCashChange > 0 ? 'text-green-600' : ''
                                    }`}>
                                    {formatCurrency(netCashChange)}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Cash, Beginning of Period</span>
                            <span className="font-mono">{formatCurrency(beginningCash)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-primary border-t pt-2">
                            <span>Cash, End of Period</span>
                            <span className="font-mono">{formatCurrency(endingCash)}</span>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Operating Cash Flow</p>
                        <p className={`text-lg font-bold font-mono ${operatingActivities >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(operatingActivities)}
                        </p>
                        <Badge variant={operatingActivities >= 0 ? 'default' : 'destructive'} className="mt-1">
                            {operatingActivities >= 0 ? 'Positive' : 'Negative'}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Free Cash Flow</p>
                        <p className={`text-lg font-bold font-mono ${freeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(freeCashFlow)}
                        </p>
                        <Badge variant={freeCashFlow >= 0 ? 'default' : 'destructive'} className="mt-1">
                            {freeCashFlow >= 0 ? 'Healthy' : 'Concern'}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cash Conversion</p>
                        <p className={`text-lg font-bold font-mono ${netIncome > 0 && operatingActivities >= netIncome ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                            {netIncome > 0 ? ((operatingActivities / netIncome) * 100).toFixed(0) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {netIncome > 0 && operatingActivities >= netIncome ? 'Strong' : 'Weak'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
