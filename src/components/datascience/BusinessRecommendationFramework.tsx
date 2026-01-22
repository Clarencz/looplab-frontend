import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, AlertTriangle, CheckCircle2, Target, DollarSign } from 'lucide-react';

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

interface BusinessRecommendationFrameworkProps {
    onRecommendationsUpdate?: (recommendations: BusinessRecommendation[]) => void;
}

export function BusinessRecommendationFramework({ onRecommendationsUpdate }: BusinessRecommendationFrameworkProps) {
    const [recommendations, setRecommendations] = useState<BusinessRecommendation[]>([]);
    const [newRec, setNewRec] = useState<Partial<BusinessRecommendation>>({
        confidence: 'medium',
        assumptions: [],
        risks: [],
        alternativeActions: [],
    });

    const validateRecommendation = (rec: Partial<BusinessRecommendation>) => {
        const issues: string[] = [];

        if (!rec.finding || rec.finding.length < 20) {
            issues.push('⚠️ What did you find? Be specific about the data.');
        }

        if (!rec.recommendation || rec.recommendation.length < 20) {
            issues.push('⚠️ What action should the business take?');
        }

        if (!rec.evidenceQuality || rec.evidenceQuality.length < 20) {
            issues.push('⚠️ How strong is your evidence? What are the limitations?');
        }

        if (!rec.assumptions || rec.assumptions.length === 0) {
            issues.push('⚠️ What assumptions are you making? List them explicitly.');
        }

        if (!rec.risks || rec.risks.length === 0) {
            issues.push('⚠️ What could go wrong if they follow your recommendation?');
        }

        if (!rec.alternativeActions || rec.alternativeActions.length === 0) {
            issues.push('💡 Consider alternative actions - rarely is there only one solution');
        }

        if (!rec.decisionImpact || rec.decisionImpact.length < 20) {
            issues.push('⚠️ What is the business impact? Quantify if possible ($, %, customers)');
        }

        if (!rec.nextSteps || rec.nextSteps.length < 20) {
            issues.push('⚠️ What are the concrete next steps to implement this?');
        }

        // Confidence checks
        if (rec.confidence === 'high' && (!rec.evidenceQuality || rec.evidenceQuality.length < 50)) {
            issues.push('⚠️ High confidence requires strong evidence justification');
        }

        if (rec.confidence === 'low' && rec.recommendation?.includes('must') || rec.recommendation?.includes('should')) {
            issues.push('💡 Low confidence recommendations should use softer language (consider, explore, test)');
        }

        return issues;
    };

    const addRecommendation = () => {
        if (!newRec.finding || !newRec.recommendation) return;

        const recommendation: BusinessRecommendation = {
            id: Date.now().toString(),
            finding: newRec.finding!,
            recommendation: newRec.recommendation!,
            confidence: newRec.confidence as BusinessRecommendation['confidence'],
            evidenceQuality: newRec.evidenceQuality || '',
            assumptions: newRec.assumptions || [],
            risks: newRec.risks || [],
            alternativeActions: newRec.alternativeActions || [],
            decisionImpact: newRec.decisionImpact || '',
            nextSteps: newRec.nextSteps || '',
        };

        const updated = [...recommendations, recommendation];
        setRecommendations(updated);
        onRecommendationsUpdate?.(updated);

        setNewRec({
            confidence: 'medium',
            assumptions: [],
            risks: [],
            alternativeActions: [],
        });
    };

    const getConfidenceColor = (confidence: BusinessRecommendation['confidence']) => {
        switch (confidence) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-red-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Recommendation Builder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Business Recommendation Framework
                    </CardTitle>
                    <CardDescription>
                        Translate your analysis into actionable business recommendations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Finding */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Key Finding (What did the data show?)
                        </label>
                        <Textarea
                            value={newRec.finding || ''}
                            onChange={(e) => setNewRec({ ...newRec, finding: e.target.value })}
                            placeholder="e.g., Churn rate increased from 12% to 18% among customers paying &gt;$50/month after the pricing change"
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Recommendation */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Recommendation (What should the business do?)
                        </label>
                        <Textarea
                            value={newRec.recommendation || ''}
                            onChange={(e) => setNewRec({ ...newRec, recommendation: e.target.value })}
                            placeholder="e.g., Revert pricing for high-value customers and implement grandfathering for existing customers"
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Confidence */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Confidence Level</label>
                        <Select
                            value={newRec.confidence}
                            onValueChange={(value) => setNewRec({ ...newRec, confidence: value as any })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High - Strong evidence, low uncertainty</SelectItem>
                                <SelectItem value="medium">Medium - Good evidence, some uncertainty</SelectItem>
                                <SelectItem value="low">Low - Limited evidence, high uncertainty</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Evidence Quality */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Evidence Quality (How strong is your evidence?)
                        </label>
                        <Textarea
                            value={newRec.evidenceQuality || ''}
                            onChange={(e) => setNewRec({ ...newRec, evidenceQuality: e.target.value })}
                            placeholder="e.g., Based on 3 months of data (n=5,000), controlled for seasonality, p<0.01, effect size=0.35"
                        />
                    </div>

                    {/* Assumptions */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Key Assumptions (What are you assuming?)
                        </label>
                        <Textarea
                            value={newRec.assumptions?.join('\n') || ''}
                            onChange={(e) =>
                                setNewRec({
                                    ...newRec,
                                    assumptions: e.target.value.split('\n').filter((s) => s.trim()),
                                })
                            }
                            placeholder="List assumptions (one per line)&#10;e.g., Pricing is the primary driver (not service quality)&#10;e.g., Churn behavior is stable over time"
                        />
                    </div>

                    {/* Risks */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Risks (What could go wrong?)
                        </label>
                        <Textarea
                            value={newRec.risks?.join('\n') || ''}
                            onChange={(e) =>
                                setNewRec({
                                    ...newRec,
                                    risks: e.target.value.split('\n').filter((s) => s.trim()),
                                })
                            }
                            placeholder="List risks (one per line)&#10;e.g., Revenue loss from price reversion&#10;e.g., Competitor pricing changes"
                        />
                    </div>

                    {/* Alternative Actions */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Alternative Actions (What else could they do?)
                        </label>
                        <Textarea
                            value={newRec.alternativeActions?.join('\n') || ''}
                            onChange={(e) =>
                                setNewRec({
                                    ...newRec,
                                    alternativeActions: e.target.value.split('\n').filter((s) => s.trim()),
                                })
                            }
                            placeholder="List alternatives (one per line)&#10;e.g., Offer loyalty discounts instead of reverting prices&#10;e.g., Improve service quality to justify pricing"
                        />
                    </div>

                    {/* Decision Impact */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Decision Impact (Quantify the business impact)
                        </label>
                        <Textarea
                            value={newRec.decisionImpact || ''}
                            onChange={(e) => setNewRec({ ...newRec, decisionImpact: e.target.value })}
                            placeholder="e.g., Estimated $2M annual revenue loss if pricing reverted, but potential to retain 500 high-value customers worth $3M"
                        />
                    </div>

                    {/* Next Steps */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Next Steps (How to implement?)
                        </label>
                        <Textarea
                            value={newRec.nextSteps || ''}
                            onChange={(e) => setNewRec({ ...newRec, nextSteps: e.target.value })}
                            placeholder="e.g., 1) Run A/B test with 10% of high-value customers, 2) Monitor churn for 30 days, 3) Scale if successful"
                        />
                    </div>

                    {/* Validation */}
                    {(newRec.finding || newRec.recommendation) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium mb-2">Validation:</p>
                            <div className="space-y-1 text-sm">
                                {validateRecommendation(newRec).map((issue, i) => (
                                    <p key={i}>{issue}</p>
                                ))}
                                {validateRecommendation(newRec).length === 0 && (
                                    <p className="text-green-600 dark:text-green-400">
                                        ✓ Recommendation is well-structured!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <Button onClick={addRecommendation} className="w-full">
                        Add Business Recommendation
                    </Button>
                </CardContent>
            </Card>

            {/* Recommendations List */}
            {recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Business Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">Finding:</h4>
                                        <p className="text-sm text-muted-foreground">{rec.finding}</p>
                                    </div>
                                    <Badge className={getConfidenceColor(rec.confidence)}>
                                        {rec.confidence} confidence
                                    </Badge>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-1">Recommendation:</h4>
                                    <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                                </div>

                                {rec.decisionImpact && (
                                    <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <DollarSign className="h-4 w-4 text-green-600 mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium">Business Impact:</p>
                                            <p className="text-muted-foreground">{rec.decisionImpact}</p>
                                        </div>
                                    </div>
                                )}

                                {rec.assumptions.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Assumptions:</p>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                                            {rec.assumptions.map((assumption, i) => (
                                                <li key={i}>{assumption}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {rec.risks.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                            Risks:
                                        </p>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                                            {rec.risks.map((risk, i) => (
                                                <li key={i}>{risk}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {rec.alternativeActions.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Alternatives:</p>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                                            {rec.alternativeActions.map((alt, i) => (
                                                <li key={i}>{alt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Best Practices */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Recommendation Best Practices
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Be specific and actionable</p>
                            <p className="text-muted-foreground">
                                "Revert pricing for &gt;$50/month customers" not "improve retention"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Quantify impact</p>
                            <p className="text-muted-foreground">
                                Use numbers: $2M revenue, 500 customers, 6% churn reduction
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="font-medium">State assumptions explicitly</p>
                            <p className="text-muted-foreground">
                                Don't hide what you're assuming - make it transparent
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Provide alternatives</p>
                            <p className="text-muted-foreground">
                                Rarely is there only one solution - give options
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
