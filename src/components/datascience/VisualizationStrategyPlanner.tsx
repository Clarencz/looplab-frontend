import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, PieChart, LineChart, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

export interface VisualizationStrategy {
    id: string;
    purpose: string;
    chartType: 'bar' | 'line' | 'scatter' | 'pie' | 'heatmap' | 'box' | 'histogram' | 'other';
    audience: 'technical' | 'executive' | 'general';
    keyMessage: string;
    dataTransformation: string;
    potentialMisleading: string[];
    designChoices: string;
}

export interface BusinessRecommendation {
    id: string;
    finding: string;
    recommendation: string;
    confidence: 'low' | 'medium' | 'high';
    evidenceQuality: string;
    assumptions: string[];
    risks: string[];
    alternativeActions: string[];
    decisionImpact: string;
    nextSteps: string;
}

interface VisualizationStrategyPlannerProps {
    onStrategiesUpdate?: (strategies: VisualizationStrategy[]) => void;
}

export function VisualizationStrategyPlanner({ onStrategiesUpdate }: VisualizationStrategyPlannerProps) {
    const [strategies, setStrategies] = useState<VisualizationStrategy[]>([]);
    const [newStrategy, setNewStrategy] = useState<Partial<VisualizationStrategy>>({
        chartType: 'bar',
        audience: 'executive',
    });

    const getChartGuidance = (chartType: VisualizationStrategy['chartType']) => {
        switch (chartType) {
            case 'bar':
                return {
                    bestFor: 'Comparing categories or groups',
                    avoid: 'Too many categories (>10), 3D effects, starting y-axis at non-zero',
                };
            case 'line':
                return {
                    bestFor: 'Showing trends over time',
                    avoid: 'Non-temporal data, too many lines (>5), misleading y-axis scales',
                };
            case 'scatter':
                return {
                    bestFor: 'Showing relationships between two variables',
                    avoid: 'Implying causation, ignoring outliers, overplotting',
                };
            case 'pie':
                return {
                    bestFor: 'Showing parts of a whole (use sparingly!)',
                    avoid: 'More than 5 slices, 3D effects, comparing similar-sized slices',
                };
            case 'heatmap':
                return {
                    bestFor: 'Showing patterns in large datasets',
                    avoid: 'Poor color choices, missing scale, too granular',
                };
            case 'box':
                return {
                    bestFor: 'Showing distribution and outliers',
                    avoid: 'Non-technical audiences, hiding sample size',
                };
            case 'histogram':
                return {
                    bestFor: 'Showing data distribution',
                    avoid: 'Wrong bin sizes, implying causation',
                };
            default:
                return {
                    bestFor: 'Specify your use case',
                    avoid: 'Common visualization pitfalls',
                };
        }
    };

    const validateStrategy = (strategy: Partial<VisualizationStrategy>) => {
        const issues: string[] = [];

        if (!strategy.keyMessage || strategy.keyMessage.length < 10) {
            issues.push('⚠️ What is the ONE key message this chart should communicate?');
        }

        if (!strategy.designChoices || strategy.designChoices.length < 20) {
            issues.push('⚠️ Justify your design choices (colors, axes, labels, etc.)');
        }

        if (strategy.chartType === 'pie' && strategy.audience === 'technical') {
            issues.push('💡 Technical audiences often prefer bar charts over pie charts');
        }

        if (strategy.chartType === 'box' && strategy.audience !== 'technical') {
            issues.push('⚠️ Box plots can confuse non-technical audiences - consider alternatives');
        }

        if (!strategy.potentialMisleading || strategy.potentialMisleading.length === 0) {
            issues.push('⚠️ How could this visualization be misinterpreted?');
        }

        return issues;
    };

    const addStrategy = () => {
        if (!newStrategy.purpose || !newStrategy.keyMessage) return;

        const strategy: VisualizationStrategy = {
            id: Date.now().toString(),
            purpose: newStrategy.purpose!,
            chartType: newStrategy.chartType as VisualizationStrategy['chartType'],
            audience: newStrategy.audience as VisualizationStrategy['audience'],
            keyMessage: newStrategy.keyMessage!,
            dataTransformation: newStrategy.dataTransformation || '',
            potentialMisleading: newStrategy.potentialMisleading || [],
            designChoices: newStrategy.designChoices || '',
        };

        const updated = [...strategies, strategy];
        setStrategies(updated);
        onStrategiesUpdate?.(updated);

        setNewStrategy({
            chartType: 'bar',
            audience: 'executive',
        });
    };

    return (
        <div className="space-y-6">
            {/* Strategy Builder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Visualization Strategy Planner
                    </CardTitle>
                    <CardDescription>
                        Plan your visualizations with clear purpose and audience in mind
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Purpose */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Purpose (What question does this answer?)
                        </label>
                        <Textarea
                            value={newStrategy.purpose || ''}
                            onChange={(e) => setNewStrategy({ ...newStrategy, purpose: e.target.value })}
                            placeholder="e.g., Show that churn increased specifically for high-value customers after pricing change"
                        />
                    </div>

                    {/* Chart Type */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Chart Type</label>
                        <Select
                            value={newStrategy.chartType}
                            onValueChange={(value) =>
                                setNewStrategy({ ...newStrategy, chartType: value as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="scatter">Scatter Plot</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                                <SelectItem value="heatmap">Heatmap</SelectItem>
                                <SelectItem value="box">Box Plot</SelectItem>
                                <SelectItem value="histogram">Histogram</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        {newStrategy.chartType && (
                            <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                                <p>
                                    <strong>Best for:</strong> {getChartGuidance(newStrategy.chartType).bestFor}
                                </p>
                                <p className="mt-1">
                                    <strong>Avoid:</strong> {getChartGuidance(newStrategy.chartType).avoid}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Audience */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Target Audience</label>
                        <Select
                            value={newStrategy.audience}
                            onValueChange={(value) => setNewStrategy({ ...newStrategy, audience: value as any })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="executive">Executive (high-level insights)</SelectItem>
                                <SelectItem value="technical">Technical (detailed analysis)</SelectItem>
                                <SelectItem value="general">General (broad audience)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Key Message */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Key Message (ONE sentence takeaway)
                        </label>
                        <Textarea
                            value={newStrategy.keyMessage || ''}
                            onChange={(e) => setNewStrategy({ ...newStrategy, keyMessage: e.target.value })}
                            placeholder="e.g., High-value customers churned at 2x the rate after pricing change"
                        />
                    </div>

                    {/* Design Choices */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Design Choices (Colors, axes, labels, etc.)
                        </label>
                        <Textarea
                            value={newStrategy.designChoices || ''}
                            onChange={(e) => setNewStrategy({ ...newStrategy, designChoices: e.target.value })}
                            placeholder="e.g., Red for post-change to emphasize increase, y-axis starts at 0 to avoid exaggeration"
                        />
                    </div>

                    {/* Potential Misleading */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            How Could This Be Misinterpreted?
                        </label>
                        <Textarea
                            value={newStrategy.potentialMisleading?.join('\n') || ''}
                            onChange={(e) =>
                                setNewStrategy({
                                    ...newStrategy,
                                    potentialMisleading: e.target.value.split('\n').filter((s) => s.trim()),
                                })
                            }
                            placeholder="List potential misinterpretations (one per line)"
                        />
                    </div>

                    {/* Validation */}
                    {(newStrategy.purpose || newStrategy.keyMessage) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium mb-2">Validation:</p>
                            <div className="space-y-1 text-sm">
                                {validateStrategy(newStrategy).map((issue, i) => (
                                    <p key={i}>{issue}</p>
                                ))}
                                {validateStrategy(newStrategy).length === 0 && (
                                    <p className="text-green-600 dark:text-green-400">
                                        ✓ Strategy looks well-planned!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <Button onClick={addStrategy} className="w-full">
                        Add Visualization Strategy
                    </Button>
                </CardContent>
            </Card>

            {/* Strategies List */}
            {strategies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Visualization Strategies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {strategies.map((strategy) => (
                            <div key={strategy.id} className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold">{strategy.purpose}</h4>
                                        <Badge className="mt-1">{strategy.chartType}</Badge>
                                        <Badge variant="outline" className="mt-1 ml-2">
                                            {strategy.audience}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <p>
                                        <strong>Key Message:</strong> {strategy.keyMessage}
                                    </p>
                                    {strategy.designChoices && (
                                        <p className="mt-1">
                                            <strong>Design:</strong> {strategy.designChoices}
                                        </p>
                                    )}
                                    {strategy.potentialMisleading.length > 0 && (
                                        <div className="mt-2">
                                            <p className="font-medium">Potential Misinterpretations:</p>
                                            <ul className="list-disc list-inside text-muted-foreground">
                                                {strategy.potentialMisleading.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Visualization Best Practices */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Visualization Best Practices
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Start y-axis at zero (for bar charts)</p>
                            <p className="text-muted-foreground">
                                Non-zero baselines exaggerate differences
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Use color purposefully</p>
                            <p className="text-muted-foreground">
                                Red for negative, green for positive, consistent across charts
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Avoid chart junk</p>
                            <p className="text-muted-foreground">
                                3D effects, excessive gridlines, decorative elements distract from data
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Don't cherry-pick time ranges</p>
                            <p className="text-muted-foreground">
                                Show full context to avoid misleading trends
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
