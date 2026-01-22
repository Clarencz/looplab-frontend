import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, AlertTriangle, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export interface Hypothesis {
    id: string;
    statement: string;
    testability: number; // 1-10
    businessImpact: number; // 1-10
    dataAvailability: number; // 1-10
    confoundingRisk: 'low' | 'medium' | 'high';
    justification: string;
    status: 'pending' | 'testing' | 'validated' | 'rejected';
}

export interface DecisionLogEntry {
    id: string;
    timestamp: Date;
    decision: string;
    reasoning: string;
    alternatives: string[];
    confidence: number; // 1-10
}

export interface ThinkingCanvasData {
    problemStatement: string;
    hypotheses: Hypothesis[];
    decisionLog: DecisionLogEntry[];
    logicJournal: string[];
}

interface ThinkingCanvasProps {
    initialData?: Partial<ThinkingCanvasData>;
    onUpdate?: (data: ThinkingCanvasData) => void;
    readOnly?: boolean;
}

export function ThinkingCanvas({ initialData, onUpdate, readOnly = false }: ThinkingCanvasProps) {
    const [data, setData] = useState<ThinkingCanvasData>({
        problemStatement: initialData?.problemStatement || '',
        hypotheses: initialData?.hypotheses || [],
        decisionLog: initialData?.decisionLog || [],
        logicJournal: initialData?.logicJournal || [],
    });

    const [newHypothesis, setNewHypothesis] = useState('');
    const [showHypothesisForm, setShowHypothesisForm] = useState(false);

    const updateData = (updates: Partial<ThinkingCanvasData>) => {
        const newData = { ...data, ...updates };
        setData(newData);
        onUpdate?.(newData);
    };

    const addHypothesis = () => {
        if (!newHypothesis.trim()) return;

        const hypothesis: Hypothesis = {
            id: Date.now().toString(),
            statement: newHypothesis,
            testability: 5,
            businessImpact: 5,
            dataAvailability: 5,
            confoundingRisk: 'medium',
            justification: '',
            status: 'pending',
        };

        updateData({
            hypotheses: [...data.hypotheses, hypothesis],
        });

        setNewHypothesis('');
        setShowHypothesisForm(false);
    };

    const removeHypothesis = (id: string) => {
        updateData({
            hypotheses: data.hypotheses.filter(h => h.id !== id),
        });
    };

    const updateHypothesis = (id: string, updates: Partial<Hypothesis>) => {
        updateData({
            hypotheses: data.hypotheses.map(h =>
                h.id === id ? { ...h, ...updates } : h
            ),
        });
    };

    const addLogicEntry = (entry: string) => {
        if (!entry.trim()) return;
        updateData({
            logicJournal: [...data.logicJournal, entry],
        });
    };

    return (
        <div className="space-y-6">
            {/* Problem Statement */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Problem Statement
                    </CardTitle>
                    <CardDescription>
                        What business question are you trying to answer? Be specific.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={data.problemStatement}
                        onChange={(e) => updateData({ problemStatement: e.target.value })}
                        placeholder="e.g., 'Marketing claims our recent pricing change caused a 15% increase in customer churn. Prove or disprove this claim.'"
                        className="min-h-[100px]"
                        disabled={readOnly}
                    />
                    {data.problemStatement && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">AI Analysis:</p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Assumption detected: "pricing change" is the sole cause</p>
                                <p>• Missing: Time period, customer segment, churn definition</p>
                                <p>• Causal claim requires: Control group or pre/post analysis</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hypotheses */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                Hypotheses
                            </CardTitle>
                            <CardDescription>
                                List all possible explanations. Score each by testability and impact.
                            </CardDescription>
                        </div>
                        {!readOnly && (
                            <Button
                                size="sm"
                                onClick={() => setShowHypothesisForm(!showHypothesisForm)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Hypothesis
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showHypothesisForm && (
                        <div className="p-4 border rounded-lg space-y-3">
                            <Input
                                value={newHypothesis}
                                onChange={(e) => setNewHypothesis(e.target.value)}
                                placeholder="Enter hypothesis statement..."
                                onKeyDown={(e) => e.key === 'Enter' && addHypothesis()}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={addHypothesis}>
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowHypothesisForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {data.hypotheses.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No hypotheses yet. Add your first hypothesis to begin.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {data.hypotheses.map((hypothesis) => (
                                <HypothesisCard
                                    key={hypothesis.id}
                                    hypothesis={hypothesis}
                                    onUpdate={(updates) => updateHypothesis(hypothesis.id, updates)}
                                    onRemove={() => removeHypothesis(hypothesis.id)}
                                    readOnly={readOnly}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Logic Journal */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Logic Journal
                    </CardTitle>
                    <CardDescription>
                        Document your reasoning, assumptions, and key decisions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.logicJournal.map((entry, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                                <span className="font-mono text-xs text-muted-foreground mr-2">
                                    #{index + 1}
                                </span>
                                {entry}
                            </div>
                        ))}
                        {data.logicJournal.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                Your reasoning steps will appear here as you work
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface HypothesisCardProps {
    hypothesis: Hypothesis;
    onUpdate: (updates: Partial<Hypothesis>) => void;
    onRemove: () => void;
    readOnly?: boolean;
}

function HypothesisCard({ hypothesis, onUpdate, onRemove, readOnly }: HypothesisCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: Hypothesis['status']) => {
        switch (status) {
            case 'validated':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            case 'testing':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getRiskColor = (risk: Hypothesis['confoundingRisk']) => {
        switch (risk) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            default:
                return 'bg-green-500';
        }
    };

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(hypothesis.status)}>
                            {hypothesis.status}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(hypothesis.confoundingRisk)}>
                            {hypothesis.confoundingRisk} confounding risk
                        </Badge>
                    </div>
                    <p className="text-sm font-medium">{hypothesis.statement}</p>
                </div>
                {!readOnly && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {isExpanded && (
                <div className="space-y-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground">Testability</label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={hypothesis.testability}
                                onChange={(e) => onUpdate({ testability: parseInt(e.target.value) })}
                                disabled={readOnly}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Business Impact</label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={hypothesis.businessImpact}
                                onChange={(e) => onUpdate({ businessImpact: parseInt(e.target.value) })}
                                disabled={readOnly}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Data Availability</label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={hypothesis.dataAvailability}
                                onChange={(e) => onUpdate({ dataAvailability: parseInt(e.target.value) })}
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground">Justification</label>
                        <Textarea
                            value={hypothesis.justification}
                            onChange={(e) => onUpdate({ justification: e.target.value })}
                            placeholder="Why is this hypothesis worth testing? What evidence supports it?"
                            className="mt-1"
                            disabled={readOnly}
                        />
                    </div>
                </div>
            )}

            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full"
            >
                {isExpanded ? 'Hide Details' : 'Show Details & Score'}
            </Button>
        </div>
    );
}
