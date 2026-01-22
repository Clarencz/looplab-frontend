import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LedgerEntry } from './GeneralLedger';

export interface BalanceSheetProps {
    ledgerEntries: LedgerEntry[];
    asOfDate: string;
}

interface BalanceSheetSection {
    title: string;
    items: { label: string; amount: number; indent?: number }[];
    total: number;
}

export default function BalanceSheet({ ledgerEntries, asOfDate }: BalanceSheetProps) {
    // Calculate Assets
    const cash = ledgerEntries
        .filter(e => e.account === 'Cash')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const receivables = ledgerEntries
        .filter(e => e.account === 'Receivables')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const inventory = ledgerEntries
        .filter(e => e.account === 'Inventory')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const assets = ledgerEntries
        .filter(e => e.account === 'Assets')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const currentAssets = cash + receivables + inventory;
    const totalAssets = currentAssets + assets;

    // Calculate Liabilities
    const payables = ledgerEntries
        .filter(e => e.account === 'Payables')
        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

    const loans = ledgerEntries
        .filter(e => e.account === 'Loans')
        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

    const currentLiabilities = payables;
    const longTermLiabilities = loans;
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    // Calculate Equity
    const revenue = ledgerEntries
        .filter(e => e.account === 'Revenue')
        .reduce((sum, e) => sum + (e.credit || 0), 0);

    const expenses = ledgerEntries
        .filter(e => e.account === 'Expenses')
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    const netIncome = revenue - expenses;
    const retainedEarnings = netIncome; // Simplified
    const commonStock = 10000; // Placeholder
    const totalEquity = commonStock + retainedEarnings;

    // Verify accounting equation: Assets = Liabilities + Equity
    const difference = totalAssets - (totalLiabilities + totalEquity);
    const isBalanced = Math.abs(difference) < 0.01;

    // Calculate key metrics
    const workingCapital = currentAssets - currentLiabilities;
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const sections: BalanceSheetSection[] = [
        {
            title: 'Assets',
            items: [
                { label: 'Current Assets:', amount: 0, indent: 0 },
                { label: 'Cash', amount: cash, indent: 1 },
                { label: 'Accounts Receivable', amount: receivables, indent: 1 },
                { label: 'Inventory', amount: inventory, indent: 1 },
                { label: 'Total Current Assets', amount: currentAssets, indent: 0 },
                { label: '', amount: 0 }, // Spacer
                { label: 'Fixed Assets:', amount: 0, indent: 0 },
                { label: 'Property & Equipment', amount: assets, indent: 1 },
                { label: 'Total Fixed Assets', amount: assets, indent: 0 },
            ],
            total: totalAssets,
        },
        {
            title: 'Liabilities',
            items: [
                { label: 'Current Liabilities:', amount: 0, indent: 0 },
                { label: 'Accounts Payable', amount: payables, indent: 1 },
                { label: 'Total Current Liabilities', amount: currentLiabilities, indent: 0 },
                { label: '', amount: 0 }, // Spacer
                { label: 'Long-term Liabilities:', amount: 0, indent: 0 },
                { label: 'Long-term Debt', amount: loans, indent: 1 },
                { label: 'Total Long-term Liabilities', amount: longTermLiabilities, indent: 0 },
            ],
            total: totalLiabilities,
        },
        {
            title: 'Equity',
            items: [
                { label: 'Common Stock', amount: commonStock, indent: 0 },
                { label: 'Retained Earnings', amount: retainedEarnings, indent: 0 },
            ],
            total: totalEquity,
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Balance Sheet</span>
                    {isBalanced ? (
                        <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Balanced
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Out of Balance
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>As of {asOfDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Balance Sheet Sections */}
                {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        <h3 className="text-lg font-semibold mb-3 text-primary">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item, itemIndex) => {
                                if (!item.label) return <div key={itemIndex} className="h-2" />; // Spacer

                                const isBold = item.label.startsWith('Total') || !item.label.endsWith(':');
                                const isSubheading = item.label.endsWith(':');
                                const indent = item.indent || 0;

                                return (
                                    <div
                                        key={itemIndex}
                                        className={`flex justify-between py-1 ${isBold && !isSubheading ? 'font-semibold border-t' : ''
                                            } ${isSubheading ? 'font-semibold text-muted-foreground' : ''}`}
                                        style={{ paddingLeft: `${indent * 1.5}rem` }}
                                    >
                                        <span>{item.label}</span>
                                        {!isSubheading && item.amount !== 0 && (
                                            <span className="font-mono">
                                                {formatCurrency(item.amount)}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="flex justify-between py-2 border-t-2 border-primary font-bold text-lg">
                                <span>Total {section.title}</span>
                                <span className="font-mono text-primary">
                                    {formatCurrency(section.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Accounting Equation Verification */}
                <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="space-y-2">
                        <div className="flex justify-between font-semibold">
                            <span>Total Liabilities + Equity:</span>
                            <span className="font-mono">
                                {formatCurrency(totalLiabilities + totalEquity)}
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Total Assets:</span>
                            <span className="font-mono">
                                {formatCurrency(totalAssets)}
                            </span>
                        </div>
                        <div className={`flex justify-between text-lg font-bold pt-2 border-t ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                            <span>Difference:</span>
                            <span className="font-mono">
                                {formatCurrency(Math.abs(difference))}
                            </span>
                        </div>
                    </div>

                    {isBalanced ? (
                        <Alert className="mt-3 bg-green-100 border-green-300">
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                            <AlertDescription className="text-green-700">
                                ✓ Accounting equation verified: Assets = Liabilities + Equity
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert className="mt-3 bg-red-100 border-red-300">
                            <XCircle className="w-4 h-4 text-red-700" />
                            <AlertDescription className="text-red-700">
                                ✗ Balance sheet is out of balance. Review entries for errors.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Working Capital</p>
                        <p className={`text-lg font-bold font-mono ${workingCapital >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(workingCapital)}
                        </p>
                        {workingCapital >= 0 ? (
                            <TrendingUp className="w-4 h-4 mx-auto text-green-600" />
                        ) : (
                            <TrendingDown className="w-4 h-4 mx-auto text-red-600" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current Ratio</p>
                        <p className={`text-lg font-bold font-mono ${currentRatio >= 1.5 ? 'text-green-600' : currentRatio >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {currentRatio.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {currentRatio >= 1.5 ? 'Healthy' : currentRatio >= 1 ? 'Adequate' : 'Weak'}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
                        <p className={`text-lg font-bold font-mono ${debtToEquity <= 1 ? 'text-green-600' : debtToEquity <= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {debtToEquity.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {debtToEquity <= 1 ? 'Low Risk' : debtToEquity <= 2 ? 'Moderate' : 'High Risk'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
