import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LedgerEntry } from './GeneralLedger';

export interface RatioCalculatorProps {
    ledgerEntries: LedgerEntry[];
}

interface Ratio {
    name: string;
    value: number;
    formula: string;
    interpretation: string;
    benchmark?: number;
    status: 'good' | 'warning' | 'poor';
}

export default function RatioCalculator({ ledgerEntries }: RatioCalculatorProps) {
    // Calculate base values
    const cash = ledgerEntries
        .filter(e => e.account === 'Cash')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const receivables = ledgerEntries
        .filter(e => e.account === 'Receivables')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const inventory = ledgerEntries
        .filter(e => e.account === 'Inventory')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const currentAssets = cash + receivables + inventory;

    const totalAssets = currentAssets + ledgerEntries
        .filter(e => e.account === 'Assets')
        .reduce((sum, e) => sum + (e.debit || 0) - (e.credit || 0), 0);

    const currentLiabilities = ledgerEntries
        .filter(e => e.account === 'Payables')
        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

    const totalLiabilities = currentLiabilities + ledgerEntries
        .filter(e => e.account === 'Loans')
        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

    const revenue = ledgerEntries
        .filter(e => e.account === 'Revenue' && e.credit)
        .reduce((sum, e) => sum + (e.credit || 0), 0);

    const expenses = ledgerEntries
        .filter(e => e.account === 'Expenses' && e.debit)
        .reduce((sum, e) => sum + (e.debit || 0), 0);

    const netIncome = revenue - expenses;
    const equity = totalAssets - totalLiabilities;

    // Liquidity Ratios
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const quickRatio = currentLiabilities > 0 ? (cash + receivables) / currentLiabilities : 0;
    const cashRatio = currentLiabilities > 0 ? cash / currentLiabilities : 0;

    const liquidityRatios: Ratio[] = [
        {
            name: 'Current Ratio',
            value: currentRatio,
            formula: 'Current Assets / Current Liabilities',
            interpretation: 'Measures ability to pay short-term obligations',
            benchmark: 1.5,
            status: currentRatio >= 1.5 ? 'good' : currentRatio >= 1 ? 'warning' : 'poor',
        },
        {
            name: 'Quick Ratio',
            value: quickRatio,
            formula: '(Cash + Receivables) / Current Liabilities',
            interpretation: 'Measures ability to pay obligations without selling inventory',
            benchmark: 1.0,
            status: quickRatio >= 1 ? 'good' : quickRatio >= 0.5 ? 'warning' : 'poor',
        },
        {
            name: 'Cash Ratio',
            value: cashRatio,
            formula: 'Cash / Current Liabilities',
            interpretation: 'Most conservative liquidity measure',
            benchmark: 0.5,
            status: cashRatio >= 0.5 ? 'good' : cashRatio >= 0.2 ? 'warning' : 'poor',
        },
    ];

    // Profitability Ratios
    const grossMargin = revenue > 0 ? (revenue / revenue) * 100 : 0; // Simplified
    const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
    const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
    const roe = equity > 0 ? (netIncome / equity) * 100 : 0;

    const profitabilityRatios: Ratio[] = [
        {
            name: 'Net Profit Margin',
            value: netMargin,
            formula: '(Net Income / Revenue) × 100',
            interpretation: 'Percentage of revenue that becomes profit',
            benchmark: 10,
            status: netMargin >= 10 ? 'good' : netMargin >= 5 ? 'warning' : 'poor',
        },
        {
            name: 'Return on Assets (ROA)',
            value: roa,
            formula: '(Net Income / Total Assets) × 100',
            interpretation: 'How efficiently assets generate profit',
            benchmark: 5,
            status: roa >= 5 ? 'good' : roa >= 2 ? 'warning' : 'poor',
        },
        {
            name: 'Return on Equity (ROE)',
            value: roe,
            formula: '(Net Income / Equity) × 100',
            interpretation: 'Return generated on shareholders\' equity',
            benchmark: 15,
            status: roe >= 15 ? 'good' : roe >= 10 ? 'warning' : 'poor',
        },
    ];

    // Leverage Ratios
    const debtToEquity = equity > 0 ? totalLiabilities / equity : 0;
    const debtToAssets = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const equityMultiplier = equity > 0 ? totalAssets / equity : 0;

    const leverageRatios: Ratio[] = [
        {
            name: 'Debt-to-Equity',
            value: debtToEquity,
            formula: 'Total Liabilities / Equity',
            interpretation: 'Financial leverage and risk level',
            benchmark: 1.0,
            status: debtToEquity <= 1 ? 'good' : debtToEquity <= 2 ? 'warning' : 'poor',
        },
        {
            name: 'Debt-to-Assets',
            value: debtToAssets,
            formula: '(Total Liabilities / Total Assets) × 100',
            interpretation: 'Percentage of assets financed by debt',
            benchmark: 50,
            status: debtToAssets <= 50 ? 'good' : debtToAssets <= 70 ? 'warning' : 'poor',
        },
        {
            name: 'Equity Multiplier',
            value: equityMultiplier,
            formula: 'Total Assets / Equity',
            interpretation: 'Financial leverage multiplier',
            benchmark: 2.0,
            status: equityMultiplier <= 2 ? 'good' : equityMultiplier <= 3 ? 'warning' : 'poor',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'good':
                return <Badge variant="default" className="bg-green-600">Good</Badge>;
            case 'warning':
                return <Badge variant="default" className="bg-yellow-600">Fair</Badge>;
            case 'poor':
                return <Badge variant="destructive">Poor</Badge>;
            default:
                return <Badge variant="outline">N/A</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'warning':
                return <Minus className="w-4 h-4 text-yellow-600" />;
            case 'poor':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const RatioCard = ({ ratio }: { ratio: Ratio }) => (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                    <span>{ratio.name}</span>
                    {getStatusBadge(ratio.status)}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold font-mono">
                        {ratio.name.includes('%') || ratio.name.includes('Margin') || ratio.name.includes('ROA') || ratio.name.includes('ROE') || ratio.name.includes('Assets')
                            ? `${ratio.value.toFixed(1)}%`
                            : ratio.value.toFixed(2)}
                    </span>
                    {getStatusIcon(ratio.status)}
                </div>

                <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                        <strong>Formula:</strong> {ratio.formula}
                    </p>
                    <p className="text-muted-foreground">
                        {ratio.interpretation}
                    </p>
                    {ratio.benchmark && (
                        <p className="text-xs text-muted-foreground">
                            Benchmark: {ratio.name.includes('%') || ratio.name.includes('Margin') || ratio.name.includes('ROA') || ratio.name.includes('ROE') || ratio.name.includes('Assets')
                                ? `${ratio.benchmark}%`
                                : ratio.benchmark}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Ratio Calculator</CardTitle>
                <CardDescription>
                    Comprehensive analysis of financial health and performance
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="liquidity">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                        <TabsTrigger value="profitability">Profitability</TabsTrigger>
                        <TabsTrigger value="leverage">Leverage</TabsTrigger>
                    </TabsList>

                    <TabsContent value="liquidity" className="space-y-4 mt-4">
                        {liquidityRatios.map((ratio, index) => (
                            <RatioCard key={index} ratio={ratio} />
                        ))}
                    </TabsContent>

                    <TabsContent value="profitability" className="space-y-4 mt-4">
                        {profitabilityRatios.map((ratio, index) => (
                            <RatioCard key={index} ratio={ratio} />
                        ))}
                    </TabsContent>

                    <TabsContent value="leverage" className="space-y-4 mt-4">
                        {leverageRatios.map((ratio, index) => (
                            <RatioCard key={index} ratio={ratio} />
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
