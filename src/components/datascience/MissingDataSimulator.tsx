import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, AlertTriangle, CheckCircle2, HelpCircle, TrendingUp } from 'lucide-react';

export interface MissingDataPattern {
    variable: string;
    missingPercentage: number;
    pattern: 'MCAR' | 'MAR' | 'MNAR'; // Missing Completely At Random, Missing At Random, Missing Not At Random
    detectedReason?: string;
}

export interface MissingDataStrategy {
    variable: string;
    approach: 'impute' | 'separate_category' | 'exclude' | 'collect_more';
    method?: 'mean' | 'median' | 'mode' | 'regression' | 'knn' | 'forward_fill' | 'backward_fill';
    justification: string;
    biasRisk: 'low' | 'medium' | 'high';
    validationPlan: string;
}

interface MissingDataSimulatorProps {
    onStrategyUpdate?: (strategies: MissingDataStrategy[]) => void;
}

export function MissingDataSimulator({ onStrategyUpdate }: MissingDataSimulatorProps) {
    const [patterns, setPatterns] = useState<MissingDataPattern[]>([
        {
            variable: 'Customer Income',
            missingPercentage: 42,
            pattern: 'MNAR',
            detectedReason: 'High-income customers more likely to skip this field',
        },
        {
            variable: 'Service Start Date',
            missingPercentage: 8,
            pattern: 'MCAR',
            detectedReason: 'Random data entry errors',
        },
        {
            variable: 'Support Tickets',
            missingPercentage: 15,
            pattern: 'MAR',
            detectedReason: 'Missing for customers who never contacted support',
        },
    ]);

    const [strategies, setStrategies] = useState<MissingDataStrategy[]>([]);
    const [selectedVariable, setSelectedVariable] = useState<string>('');
    const [currentStrategy, setCurrentStrategy] = useState<Partial<MissingDataStrategy>>({
        approach: 'impute',
        method: 'mean',
        biasRisk: 'medium',
    });

    const addStrategy = () => {
        if (!selectedVariable || !currentStrategy.justification) return;

        const newStrategy: MissingDataStrategy = {
            variable: selectedVariable,
            approach: currentStrategy.approach as MissingDataStrategy['approach'],
            method: currentStrategy.method,
            justification: currentStrategy.justification,
            biasRisk: currentStrategy.biasRisk as MissingDataStrategy['biasRisk'],
            validationPlan: currentStrategy.validationPlan || '',
        };

        const updated = [...strategies, newStrategy];
        setStrategies(updated);
        onStrategyUpdate?.(updated);

        // Reset form
        setSelectedVariable('');
        setCurrentStrategy({
            approach: 'impute',
            method: 'mean',
            biasRisk: 'medium',
            justification: '',
            validationPlan: '',
        });
    };

    const getPatternColor = (pattern: MissingDataPattern['pattern']) => {
        switch (pattern) {
            case 'MCAR':
                return 'bg-green-500';
            case 'MAR':
                return 'bg-yellow-500';
            case 'MNAR':
                return 'bg-red-500';
        }
    };

    const getPatternDescription = (pattern: MissingDataPattern['pattern']) => {
        switch (pattern) {
            case 'MCAR':
                return 'Missing Completely At Random - Safe to ignore or impute';
            case 'MAR':
                return 'Missing At Random - Can be predicted from other variables';
            case 'MNAR':
                return 'Missing Not At Random - Missingness is informative!';
        }
    };

    const evaluateStrategy = (strategy: Partial<MissingDataStrategy>, pattern: MissingDataPattern) => {
        const issues: string[] = [];

        if (pattern.pattern === 'MNAR' && strategy.approach === 'impute') {
            issues.push('⚠️ Imputing MNAR data introduces bias - missingness is informative');
        }

        if (pattern.missingPercentage > 30 && strategy.approach === 'impute') {
            issues.push('⚠️ High missing percentage - imputation may distort distribution');
        }

        if (strategy.approach === 'exclude' && pattern.missingPercentage > 20) {
            issues.push('⚠️ Excluding >20% of data may introduce selection bias');
        }

        if (strategy.approach === 'impute' && strategy.method === 'mean' && pattern.pattern === 'MAR') {
            issues.push('💡 Consider regression imputation for MAR data');
        }

        return issues;
    };

    return (
        <div className="space-y-6">
            {/* Missing Data Patterns */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Detected Missing Data Patterns
                    </CardTitle>
                    <CardDescription>
                        Understanding WHY data is missing is critical for choosing the right strategy
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {patterns.map((pattern, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold">{pattern.variable}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {pattern.detectedReason}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-500">
                                        {pattern.missingPercentage}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">missing</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={getPatternColor(pattern.pattern)}>
                                    {pattern.pattern}
                                </Badge>
                                <p className="text-sm text-muted-foreground">
                                    {getPatternDescription(pattern.pattern)}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Strategy Builder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Build Your Missing Data Strategy
                    </CardTitle>
                    <CardDescription>
                        Justify your approach based on the missing data pattern
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Variable Selection */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Select Variable</label>
                        <Select value={selectedVariable} onValueChange={setSelectedVariable}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a variable..." />
                            </SelectTrigger>
                            <SelectContent>
                                {patterns.map((pattern) => (
                                    <SelectItem key={pattern.variable} value={pattern.variable}>
                                        {pattern.variable} ({pattern.missingPercentage}% missing - {pattern.pattern})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedVariable && (
                        <>
                            {/* Approach Selection */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Approach</label>
                                <Select
                                    value={currentStrategy.approach}
                                    onValueChange={(value) =>
                                        setCurrentStrategy({ ...currentStrategy, approach: value as any })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="impute">Impute (fill in values)</SelectItem>
                                        <SelectItem value="separate_category">
                                            Separate Category (treat as distinct)
                                        </SelectItem>
                                        <SelectItem value="exclude">Exclude (remove rows)</SelectItem>
                                        <SelectItem value="collect_more">Collect More Data</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Method Selection (if imputing) */}
                            {currentStrategy.approach === 'impute' && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Imputation Method</label>
                                    <Select
                                        value={currentStrategy.method}
                                        onValueChange={(value) =>
                                            setCurrentStrategy({ ...currentStrategy, method: value as any })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mean">Mean (simple, assumes MCAR)</SelectItem>
                                            <SelectItem value="median">Median (robust to outliers)</SelectItem>
                                            <SelectItem value="mode">Mode (for categorical)</SelectItem>
                                            <SelectItem value="regression">
                                                Regression (predict from other variables)
                                            </SelectItem>
                                            <SelectItem value="knn">KNN (similar observations)</SelectItem>
                                            <SelectItem value="forward_fill">Forward Fill (time series)</SelectItem>
                                            <SelectItem value="backward_fill">Backward Fill (time series)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Justification */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Justification (Why is this approach valid?)
                                </label>
                                <Textarea
                                    value={currentStrategy.justification || ''}
                                    onChange={(e) =>
                                        setCurrentStrategy({ ...currentStrategy, justification: e.target.value })
                                    }
                                    placeholder="Explain your reasoning based on the missing data pattern..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            {/* Bias Risk Assessment */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Bias Risk</label>
                                <Select
                                    value={currentStrategy.biasRisk}
                                    onValueChange={(value) =>
                                        setCurrentStrategy({ ...currentStrategy, biasRisk: value as any })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low - Minimal impact on analysis</SelectItem>
                                        <SelectItem value="medium">Medium - Needs validation</SelectItem>
                                        <SelectItem value="high">High - Significant bias risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Validation Plan */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Validation Plan (How will you test this?)
                                </label>
                                <Textarea
                                    value={currentStrategy.validationPlan || ''}
                                    onChange={(e) =>
                                        setCurrentStrategy({ ...currentStrategy, validationPlan: e.target.value })
                                    }
                                    placeholder="e.g., Compare distributions before/after imputation, sensitivity analysis..."
                                />
                            </div>

                            {/* AI Evaluation */}
                            {currentStrategy.justification && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-medium mb-2">AI Evaluation:</p>
                                    <div className="space-y-1 text-sm">
                                        {evaluateStrategy(
                                            currentStrategy,
                                            patterns.find((p) => p.variable === selectedVariable)!
                                        ).map((issue, i) => (
                                            <p key={i}>{issue}</p>
                                        ))}
                                        {evaluateStrategy(
                                            currentStrategy,
                                            patterns.find((p) => p.variable === selectedVariable)!
                                        ).length === 0 && (
                                                <p className="text-green-600 dark:text-green-400">
                                                    ✓ Strategy looks reasonable for this pattern
                                                </p>
                                            )}
                                    </div>
                                </div>
                            )}

                            <Button onClick={addStrategy} className="w-full">
                                Add Strategy
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Strategies Summary */}
            {strategies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Missing Data Strategies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {strategies.map((strategy, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold">{strategy.variable}</h4>
                                    <Badge
                                        className={
                                            strategy.biasRisk === 'high'
                                                ? 'bg-red-500'
                                                : strategy.biasRisk === 'medium'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                        }
                                    >
                                        {strategy.biasRisk} bias risk
                                    </Badge>
                                </div>
                                <p className="text-sm mb-2">
                                    <strong>Approach:</strong> {strategy.approach}
                                    {strategy.method && ` (${strategy.method})`}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                    <strong>Justification:</strong> {strategy.justification}
                                </p>
                                {strategy.validationPlan && (
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Validation:</strong> {strategy.validationPlan}
                                    </p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Learning Points */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Key Learning Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <p>
                            <strong>MNAR is dangerous:</strong> If missingness is related to the missing value itself,
                            imputation introduces bias
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                        <p>
                            <strong>Consider "missing" as information:</strong> Sometimes a separate category is more
                            honest than imputation
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <p>
                            <strong>Always validate:</strong> Compare distributions before/after, run sensitivity
                            analyses
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
