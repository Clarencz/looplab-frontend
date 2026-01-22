import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface JournalEntryLine {
    id: string;
    account: string;
    debit: number;
    credit: number;
}

export interface JournalEntryData {
    entryNumber: string;
    date: string;
    description: string;
    lines: JournalEntryLine[];
}

export interface JournalEntryBuilderProps {
    onPost: (entry: JournalEntryData) => void;
    accounts: string[];
}

export default function JournalEntryBuilder({ onPost, accounts }: JournalEntryBuilderProps) {
    const { toast } = useToast();

    const [entryNumber, setEntryNumber] = useState(`JE-${Date.now()}`);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [lines, setLines] = useState<JournalEntryLine[]>([
        { id: '1', account: '', debit: 0, credit: 0 },
        { id: '2', account: '', debit: 0, credit: 0 },
    ]);

    // Calculate totals
    const totalDebits = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
    const difference = totalDebits - totalCredits;

    const handleAddLine = () => {
        const newLine: JournalEntryLine = {
            id: `${Date.now()}`,
            account: '',
            debit: 0,
            credit: 0,
        };
        setLines([...lines, newLine]);
    };

    const handleRemoveLine = (id: string) => {
        if (lines.length > 2) {
            setLines(lines.filter(line => line.id !== id));
        }
    };

    const handleUpdateLine = (id: string, field: keyof JournalEntryLine, value: any) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                // If updating debit, clear credit and vice versa
                if (field === 'debit' && value > 0) {
                    return { ...line, debit: value, credit: 0 };
                } else if (field === 'credit' && value > 0) {
                    return { ...line, debit: 0, credit: value };
                }
                return { ...line, [field]: value };
            }
            return line;
        }));
    };

    const handlePost = () => {
        // Validation
        if (!description.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please enter a description for this journal entry.',
                variant: 'destructive',
            });
            return;
        }

        if (lines.some(line => !line.account)) {
            toast({
                title: 'Validation Error',
                description: 'All lines must have an account selected.',
                variant: 'destructive',
            });
            return;
        }

        if (!isBalanced) {
            toast({
                title: 'Validation Error',
                description: 'Debits must equal credits. Please balance the entry.',
                variant: 'destructive',
            });
            return;
        }

        if (totalDebits === 0) {
            toast({
                title: 'Validation Error',
                description: 'Entry must have at least one debit and one credit.',
                variant: 'destructive',
            });
            return;
        }

        // Post the entry
        const entry: JournalEntryData = {
            entryNumber,
            date,
            description,
            lines: lines.filter(line => line.debit > 0 || line.credit > 0),
        };

        onPost(entry);

        toast({
            title: 'Entry Posted',
            description: `Journal entry ${entryNumber} has been posted to the general ledger.`,
        });

        // Reset form
        setEntryNumber(`JE-${Date.now()}`);
        setDescription('');
        setLines([
            { id: '1', account: '', debit: 0, credit: 0 },
            { id: '2', account: '', debit: 0, credit: 0 },
        ]);
    };

    const handleCancel = () => {
        setDescription('');
        setLines([
            { id: '1', account: '', debit: 0, credit: 0 },
            { id: '2', account: '', debit: 0, credit: 0 },
        ]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Journal Entry Builder</span>
                    {isBalanced ? (
                        <Badge variant="default" className="bg-green-600">
                            <Check className="w-4 h-4 mr-1" />
                            Balanced
                        </Badge>
                    ) : (
                        <Badge variant="destructive">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Out of Balance
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Create compound journal entries with automatic debit/credit validation
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Entry Header */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Entry Number</Label>
                        <Input
                            value={entryNumber}
                            onChange={(e) => setEntryNumber(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a description for this journal entry..."
                        rows={2}
                    />
                </div>

                {/* Entry Lines */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Entry Lines</Label>
                        <Button size="sm" variant="outline" onClick={handleAddLine}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Line
                        </Button>
                    </div>

                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-muted-foreground px-2">
                        <div className="col-span-5">Account</div>
                        <div className="col-span-3 text-right">Debit</div>
                        <div className="col-span-3 text-right">Credit</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Lines */}
                    {lines.map((line, index) => (
                        <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5">
                                <Select
                                    value={line.account}
                                    onValueChange={(value) => handleUpdateLine(line.id, 'account', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account} value={account}>
                                                {account}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    value={line.debit || ''}
                                    onChange={(e) => handleUpdateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="text-right font-mono"
                                    step="0.01"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    value={line.credit || ''}
                                    onChange={(e) => handleUpdateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="text-right font-mono"
                                    step="0.01"
                                />
                            </div>
                            <div className="col-span-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveLine(line.id)}
                                    disabled={lines.length <= 2}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Totals */}
                    <div className="grid grid-cols-12 gap-2 pt-3 border-t">
                        <div className="col-span-5 flex items-center">
                            <span className="font-semibold">Totals:</span>
                        </div>
                        <div className="col-span-3">
                            <div className="text-right font-mono font-bold text-lg">
                                ${totalDebits.toFixed(2)}
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="text-right font-mono font-bold text-lg">
                                ${totalCredits.toFixed(2)}
                            </div>
                        </div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Balance Check */}
                    {!isBalanced && (
                        <div className="bg-destructive/10 border border-destructive rounded p-3">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <div>
                                    <p className="font-semibold">Entry is out of balance</p>
                                    <p className="text-sm">
                                        Difference: ${Math.abs(difference).toFixed(2)}
                                        {difference > 0 ? ' (debits exceed credits)' : ' (credits exceed debits)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button onClick={handlePost} disabled={!isBalanced} className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Post Entry
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
