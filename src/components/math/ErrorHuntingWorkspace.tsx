import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

export interface MathError {
    id: string;
    location: { start: number; end: number };
    type: 'missing_term' | 'wrong_sign' | 'wrong_formula' | 'distribution_error';
    explanation: string;
    hint: string;
    counterexample?: string;
}

export interface ErrorHuntingProblem {
    id: string;
    title: string;
    brokenSolution: string;
    correctSolution: string;
    errors: MathError[];
    realWorldContext: string;
    whyItMatters: string;
}

export interface ErrorHuntingWorkspaceProps {
    problem: ErrorHuntingProblem;
    onComplete: (score: number) => void;
}

export default function ErrorHuntingWorkspace({
    problem,
    onComplete,
}: ErrorHuntingWorkspaceProps) {
    const [foundErrors, setFoundErrors] = useState<Set<string>>(new Set());
    const [confidence, setConfidence] = useState(50);
    const [counterexample, setCounterexample] = useState('');
    const [showHints, setShowHints] = useState(false);
    const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
    const [testResult, setTestResult] = useState<{ value: string; broken: number; correct: number } | null>(null);

    const handleErrorClick = (errorId: string) => {
        const newFound = new Set(foundErrors);
        if (newFound.has(errorId)) {
            newFound.delete(errorId);
        } else {
            newFound.add(errorId);
        }
        setFoundErrors(newFound);
        setSelectedErrorId(errorId);
    };

    const handleTestCounterexample = () => {
        if (!counterexample) return;

        try {
            const x = parseFloat(counterexample);
            if (isNaN(x)) {
                alert('Please enter a valid number');
                return;
            }

            // Example: Testing (x+3)² = x² + 9
            const brokenResult = x * x + 9;
            const correctResult = (x + 3) * (x + 3);

            setTestResult({
                value: counterexample,
                broken: brokenResult,
                correct: correctResult,
            });
        } catch (error) {
            alert('Error evaluating expression');
        }
    };

    const score = (foundErrors.size / problem.errors.length) * 100;
    const allFound = foundErrors.size === problem.errors.length;

    return (
        <div className="h-full flex flex-col gap-4 p-4 overflow-auto">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-destructive" />
                            <span>{problem.title}</span>
                        </div>
                        <Badge variant={allFound ? 'default' : 'secondary'}>
                            {foundErrors.size} / {problem.errors.length} errors found
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{problem.realWorldContext}</p>
                </CardContent>
            </Card>

            {/* Broken Solution */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive" />
                        Student's Solution (BROKEN)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                        <BlockMath math={problem.brokenSolution} />
                    </div>

                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold">Your Mission:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Click on parts of the equation you think are wrong</li>
                            <li>Find ALL {problem.errors.length} errors</li>
                            <li>Prove it's wrong with a specific number</li>
                        </ul>
                    </div>

                    {/* Interactive Error Markers */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {problem.errors.map((error) => (
                            <Button
                                key={error.id}
                                variant={foundErrors.has(error.id) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleErrorClick(error.id)}
                                className={foundErrors.has(error.id) ? 'bg-green-600' : ''}
                            >
                                {foundErrors.has(error.id) ? (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                )}
                                Error {error.id}
                            </Button>
                        ))}
                    </div>

                    {/* Selected Error Details */}
                    {selectedErrorId && foundErrors.has(selectedErrorId) && (
                        <Alert className="mt-4">
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Error Type:</strong>{' '}
                                {problem.errors.find((e) => e.id === selectedErrorId)?.type.replace('_', ' ')}
                                <br />
                                <strong>Explanation:</strong>{' '}
                                {problem.errors.find((e) => e.id === selectedErrorId)?.explanation}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Confidence Meter */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">How confident are you?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Confidence:</span>
                            <span className="text-sm font-mono font-bold">{confidence}%</span>
                        </div>
                        <Slider
                            value={[confidence]}
                            onValueChange={([value]) => setConfidence(value)}
                            min={0}
                            max={100}
                            step={5}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {confidence < 30 && "You're not sure yet. Keep investigating!"}
                        {confidence >= 30 && confidence < 70 && "You're getting there. Look for more clues."}
                        {confidence >= 70 && "You're confident! Prove it with a counterexample."}
                    </p>
                </CardContent>
            </Card>

            {/* Counterexample Tester */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Prove It's Wrong</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">
                        Find a value of <InlineMath math="x" /> that shows the broken solution gives a different answer:
                    </p>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Enter x value..."
                            value={counterexample}
                            onChange={(e) => setCounterexample(e.target.value)}
                        />
                        <Button onClick={handleTestCounterexample}>Test</Button>
                    </div>

                    {testResult && (
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                            <p className="text-sm font-semibold">
                                Testing with x = {testResult.value}:
                            </p>
                            <div className="space-y-1 text-sm">
                                <p className="text-destructive">
                                    Broken solution: {testResult.broken}
                                </p>
                                <p className="text-green-600">
                                    Correct solution: {testResult.correct}
                                </p>
                                {testResult.broken !== testResult.correct && (
                                    <p className="font-semibold text-green-600 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Proof found! {testResult.broken} ≠ {testResult.correct}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Hints */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                        <span>Need Help?</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHints(!showHints)}
                        >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            {showHints ? 'Hide' : 'Show'} Hints
                        </Button>
                    </CardTitle>
                </CardHeader>
                {showHints && (
                    <CardContent className="space-y-2">
                        {problem.errors.map((error, index) => (
                            <Alert key={error.id}>
                                <AlertDescription>
                                    <strong>Hint {index + 1}:</strong> {error.hint}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </CardContent>
                )}
            </Card>

            {/* Correct Solution (shown after all errors found) */}
            {allFound && (
                <Card className="border-green-600">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Correct Solution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-600/20">
                            <BlockMath math={problem.correctSolution} />
                        </div>
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm font-semibold mb-2">Why This Matters:</p>
                            <p className="text-sm">{problem.whyItMatters}</p>
                        </div>
                        <Button
                            className="mt-4 w-full"
                            onClick={() => onComplete(score)}
                        >
                            Complete Challenge ({score.toFixed(0)}% score)
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
