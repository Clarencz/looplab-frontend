import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export interface TAccountEntry {
    date: string;
    description: string;
    amount: number;
    side: 'debit' | 'credit';
}

export interface TAccountProps {
    accountName: string;
    accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    entries: TAccountEntry[];
    showBalance?: boolean;
}

export default function TAccount({
    accountName,
    accountType,
    entries,
    showBalance = true,
}: TAccountProps) {
    // Separate debits and credits
    const debits = entries.filter(e => e.side === 'debit');
    const credits = entries.filter(e => e.side === 'credit');

    // Calculate totals
    const totalDebits = debits.reduce((sum, e) => sum + e.amount, 0);
    const totalCredits = credits.reduce((sum, e) => sum + e.amount, 0);

    // Determine normal balance side
    const normalBalanceSide = ['asset', 'expense'].includes(accountType) ? 'debit' : 'credit';

    // Calculate balance
    const balance = totalDebits - totalCredits;
    const balanceSide: 'debit' | 'credit' = balance >= 0 ? 'debit' : 'credit';
    const balanceAmount = Math.abs(balance);

    // Get account type color
    const getAccountTypeColor = () => {
        switch (accountType) {
            case 'asset':
                return 'bg-blue-100 text-blue-800';
            case 'liability':
                return 'bg-red-100 text-red-800';
            case 'equity':
                return 'bg-purple-100 text-purple-800';
            case 'revenue':
                return 'bg-green-100 text-green-800';
            case 'expense':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Pad arrays to same length for visual alignment
    const maxLength = Math.max(debits.length, credits.length);
    const paddedDebits = [...debits, ...Array(maxLength - debits.length).fill(null)];
    const paddedCredits = [...credits, ...Array(maxLength - credits.length).fill(null)];

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <span>{accountName}</span>
                    <Badge className={getAccountTypeColor()}>
                        {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Normal balance: {normalBalanceSide === 'debit' ? 'Debit' : 'Credit'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* T-Account Structure */}
                <div className="border-2 border-primary rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-2 bg-primary/10 border-b-2 border-primary">
                        <div className="p-3 text-center font-semibold border-r-2 border-primary">
                            Debit
                        </div>
                        <div className="p-3 text-center font-semibold">
                            Credit
                        </div>
                    </div>

                    {/* Entries */}
                    <div className="grid grid-cols-2 min-h-[200px]">
                        {/* Debit Side */}
                        <div className="border-r-2 border-primary">
                            {paddedDebits.map((entry, index) => (
                                <div
                                    key={index}
                                    className={`p-2 border-b ${entry ? 'hover:bg-muted/50' : ''}`}
                                >
                                    {entry ? (
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {entry.date}
                                                </p>
                                                <p className="text-sm truncate" title={entry.description}>
                                                    {entry.description}
                                                </p>
                                            </div>
                                            <span className="text-sm font-mono font-semibold whitespace-nowrap">
                                                {formatCurrency(entry.amount)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="h-12" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Credit Side */}
                        <div>
                            {paddedCredits.map((entry, index) => (
                                <div
                                    key={index}
                                    className={`p-2 border-b ${entry ? 'hover:bg-muted/50' : ''}`}
                                >
                                    {entry ? (
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {entry.date}
                                                </p>
                                                <p className="text-sm truncate" title={entry.description}>
                                                    {entry.description}
                                                </p>
                                            </div>
                                            <span className="text-sm font-mono font-semibold whitespace-nowrap">
                                                {formatCurrency(entry.amount)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="h-12" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="grid grid-cols-2 bg-muted border-t-2 border-primary">
                        <div className="p-3 border-r-2 border-primary">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Debits:</span>
                                <span className="font-mono font-bold">
                                    {formatCurrency(totalDebits)}
                                </span>
                            </div>
                        </div>
                        <div className="p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Credits:</span>
                                <span className="font-mono font-bold">
                                    {formatCurrency(totalCredits)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Balance */}
                    {showBalance && (
                        <div className="bg-primary/5 border-t-2 border-primary">
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Balance:</span>
                                        <Badge variant={balanceSide === normalBalanceSide ? 'default' : 'destructive'}>
                                            {balanceSide === 'debit' ? 'Debit' : 'Credit'}
                                        </Badge>
                                    </div>
                                    <span className="text-lg font-mono font-bold text-primary">
                                        {formatCurrency(balanceAmount)}
                                    </span>
                                </div>
                                {balanceSide !== normalBalanceSide && (
                                    <p className="text-xs text-destructive mt-1">
                                        ⚠️ Abnormal balance - review for errors
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Visual Flow Indicator */}
                {entries.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Debit</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-semibold text-foreground">{accountName}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span>Credit</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
