import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';

export interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    reconciled: boolean;
}

export interface ReconciliationItem {
    id: string;
    description: string;
    amount: number;
    type: 'outstanding_check' | 'deposit_in_transit' | 'bank_error' | 'book_error';
}

export interface BankReconciliationProps {
    bankBalance: number;
    bookBalance: number;
    bankTransactions: BankTransaction[];
    bookTransactions: BankTransaction[];
    onReconcile: (reconciledItems: ReconciliationItem[]) => void;
}

export default function BankReconciliation({
    bankBalance: initialBankBalance,
    bookBalance: initialBookBalance,
    bankTransactions: initialBankTransactions,
    bookTransactions: initialBookTransactions,
    onReconcile,
}: BankReconciliationProps) {
    const [bankBalance, setBankBalance] = useState(initialBankBalance);
    const [bookBalance, setBookBalance] = useState(initialBookBalance);
    const [bankTransactions, setBankTransactions] = useState(initialBankTransactions);
    const [bookTransactions, setBookTransactions] = useState(initialBookTransactions);

    const [outstandingChecks, setOutstandingChecks] = useState<ReconciliationItem[]>([]);
    const [depositsInTransit, setDepositsInTransit] = useState<ReconciliationItem[]>([]);
    const [bankErrors, setBankErrors] = useState<ReconciliationItem[]>([]);
    const [bookErrors, setBookErrors] = useState<ReconciliationItem[]>([]);

    // Calculate adjusted balances
    const totalOutstandingChecks = outstandingChecks.reduce((sum, item) => sum + item.amount, 0);
    const totalDepositsInTransit = depositsInTransit.reduce((sum, item) => sum + item.amount, 0);
    const totalBankErrors = bankErrors.reduce((sum, item) => sum + item.amount, 0);
    const totalBookErrors = bookErrors.reduce((sum, item) => sum + item.amount, 0);

    const adjustedBankBalance = bankBalance + totalDepositsInTransit - totalOutstandingChecks + totalBankErrors;
    const adjustedBookBalance = bookBalance + totalBookErrors;

    const isReconciled = Math.abs(adjustedBankBalance - adjustedBookBalance) < 0.01;
    const difference = adjustedBankBalance - adjustedBookBalance;

    const handleToggleReconciled = (transactionId: string, isBank: boolean) => {
        if (isBank) {
            setBankTransactions(prev =>
                prev.map(t => t.id === transactionId ? { ...t, reconciled: !t.reconciled } : t)
            );
        } else {
            setBookTransactions(prev =>
                prev.map(t => t.id === transactionId ? { ...t, reconciled: !t.reconciled } : t)
            );
        }
    };

    const handleAddOutstandingCheck = () => {
        const newItem: ReconciliationItem = {
            id: `oc-${Date.now()}`,
            description: 'Outstanding Check',
            amount: 0,
            type: 'outstanding_check',
        };
        setOutstandingChecks(prev => [...prev, newItem]);
    };

    const handleAddDepositInTransit = () => {
        const newItem: ReconciliationItem = {
            id: `dit-${Date.now()}`,
            description: 'Deposit in Transit',
            amount: 0,
            type: 'deposit_in_transit',
        };
        setDepositsInTransit(prev => [...prev, newItem]);
    };

    const handleUpdateItem = (
        id: string,
        field: 'description' | 'amount',
        value: string | number,
        type: 'outstanding_check' | 'deposit_in_transit' | 'bank_error' | 'book_error'
    ) => {
        const updateFn = (items: ReconciliationItem[]) =>
            items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );

        switch (type) {
            case 'outstanding_check':
                setOutstandingChecks(updateFn);
                break;
            case 'deposit_in_transit':
                setDepositsInTransit(updateFn);
                break;
            case 'bank_error':
                setBankErrors(updateFn);
                break;
            case 'book_error':
                setBookErrors(updateFn);
                break;
        }
    };

    const handleRemoveItem = (
        id: string,
        type: 'outstanding_check' | 'deposit_in_transit' | 'bank_error' | 'book_error'
    ) => {
        const removeFn = (items: ReconciliationItem[]) => items.filter(item => item.id !== id);

        switch (type) {
            case 'outstanding_check':
                setOutstandingChecks(removeFn);
                break;
            case 'deposit_in_transit':
                setDepositsInTransit(removeFn);
                break;
            case 'bank_error':
                setBankErrors(removeFn);
                break;
            case 'book_error':
                setBookErrors(removeFn);
                break;
        }
    };

    const handleCompleteReconciliation = () => {
        const allItems = [
            ...outstandingChecks,
            ...depositsInTransit,
            ...bankErrors,
            ...bookErrors,
        ];
        onReconcile(allItems);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Bank Reconciliation</span>
                        {isReconciled ? (
                            <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Reconciled
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <XCircle className="w-4 h-4 mr-1" />
                                Not Reconciled
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Match bank statement with book records to ensure accuracy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bank Statement Balance</label>
                            <Input
                                type="number"
                                value={bankBalance}
                                onChange={(e) => setBankBalance(parseFloat(e.target.value) || 0)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Book Balance</label>
                            <Input
                                type="number"
                                value={bookBalance}
                                onChange={(e) => setBookBalance(parseFloat(e.target.value) || 0)}
                                className="font-mono"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reconciliation Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outstanding Checks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Outstanding Checks</span>
                            <Button size="sm" variant="outline" onClick={handleAddOutstandingCheck}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </CardTitle>
                        <CardDescription>Checks written but not yet cleared</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {outstandingChecks.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <Input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value, 'outstanding_check')}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={item.amount || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'amount', parseFloat(e.target.value) || 0, 'outstanding_check')}
                                    className="w-32 font-mono"
                                />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveItem(item.id, 'outstanding_check')}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        {outstandingChecks.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No outstanding checks
                            </p>
                        )}
                        {outstandingChecks.length > 0 && (
                            <div className="pt-2 border-t flex justify-between items-center">
                                <span className="text-sm font-medium">Total:</span>
                                <span className="font-mono font-semibold">
                                    ${totalOutstandingChecks.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Deposits in Transit */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Deposits in Transit</span>
                            <Button size="sm" variant="outline" onClick={handleAddDepositInTransit}>
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </CardTitle>
                        <CardDescription>Deposits made but not yet recorded by bank</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {depositsInTransit.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <Input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value, 'deposit_in_transit')}
                                    className="flex-1"
                                />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={item.amount || ''}
                                    onChange={(e) => handleUpdateItem(item.id, 'amount', parseFloat(e.target.value) || 0, 'deposit_in_transit')}
                                    className="w-32 font-mono"
                                />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveItem(item.id, 'deposit_in_transit')}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        {depositsInTransit.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No deposits in transit
                            </p>
                        )}
                        {depositsInTransit.length > 0 && (
                            <div className="pt-2 border-t flex justify-between items-center">
                                <span className="text-sm font-medium">Total:</span>
                                <span className="font-mono font-semibold">
                                    ${totalDepositsInTransit.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reconciliation Summary */}
            <Card className={isReconciled ? 'border-green-500' : 'border-yellow-500'}>
                <CardHeader>
                    <CardTitle className="text-base">Reconciliation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex justify-between">
                            <span>Bank Statement Balance:</span>
                            <span className="font-semibold">${bankBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>+ Deposits in Transit:</span>
                            <span>${totalDepositsInTransit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>- Outstanding Checks:</span>
                            <span>(${totalOutstandingChecks.toFixed(2)})</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                            <span>+/- Bank Errors:</span>
                            <span>${totalBankErrors.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Adjusted Bank Balance:</span>
                            <span>${adjustedBankBalance.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-3 mt-3"></div>

                        <div className="flex justify-between">
                            <span>Book Balance:</span>
                            <span className="font-semibold">${bookBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                            <span>+/- Book Errors:</span>
                            <span>${totalBookErrors.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Adjusted Book Balance:</span>
                            <span>${adjustedBookBalance.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-3 mt-3"></div>

                        <div className={`flex justify-between text-lg font-bold ${isReconciled ? 'text-green-600' : 'text-red-600'}`}>
                            <span>Difference:</span>
                            <span>${Math.abs(difference).toFixed(2)}</span>
                        </div>

                        {isReconciled && (
                            <div className="flex items-center gap-2 text-green-600 justify-center pt-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold">Reconciliation Complete!</span>
                            </div>
                        )}

                        {!isReconciled && difference !== 0 && (
                            <div className="flex items-center gap-2 text-yellow-600 justify-center pt-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">
                                    {difference > 0
                                        ? 'Bank balance is higher - check for missing book entries'
                                        : 'Book balance is higher - check for missing bank entries'}
                                </span>
                            </div>
                        )}
                    </div>

                    {isReconciled && (
                        <Button
                            className="w-full mt-4"
                            onClick={handleCompleteReconciliation}
                        >
                            Complete Reconciliation
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
