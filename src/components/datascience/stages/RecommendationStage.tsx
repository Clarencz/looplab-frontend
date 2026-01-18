import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle, DollarSign, TrendingUp } from 'lucide-react'

interface RecommendationStageProps {
    onDecision: (decision: { recommendation: string; justification: string; confidence: string }) => void
}

export function RecommendationStage({ onDecision }: RecommendationStageProps) {
    const [recommendation, setRecommendation] = useState('')
    const [justification, setJustification] = useState('')
    const [confidence, setConfidence] = useState('')

    const handleSubmit = () => {
        if (recommendation && justification && confidence) {
            onDecision({ recommendation, justification, confidence })
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                            High Accuracy ≠ Business Value
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            Model has 87% accuracy but may recommend wrong business action
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Model Performance</CardTitle>
                    <CardDescription>
                        Technical metrics vs business impact
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-400">87%</div>
                        </div>
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">Precision</div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-400">84%</div>
                        </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Model's Recommendation:</p>
                        <p className="text-sm text-muted-foreground">
                            "Revert pricing changes to reduce churn" (based on r=0.34 correlation)
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Business Context</CardTitle>
                    <CardDescription>
                        Decision impact and evidence summary
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Pricing Reversion Cost</div>
                            <div className="flex items-baseline gap-1">
                                <DollarSign className="h-4 w-4 text-red-600" />
                                <span className="text-xl font-bold text-red-600">$2M</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Churn Increase</div>
                            <div className="flex items-baseline gap-1">
                                <TrendingUp className="h-4 w-4 text-red-600" />
                                <span className="text-xl font-bold text-red-600">+8%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold">Evidence Summary:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Pricing correlation: r=0.34 (moderate)</li>
                            <li>Service quality correlation: r=0.67 (strong)</li>
                            <li>Service decline started 2 weeks after pricing change</li>
                            <li>High-value customers churning most (enterprise segment)</li>
                            <li>Multiple confounding factors present</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                            Critical Question:
                        </p>
                        <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                            Should you spend $2M reverting pricing when service quality (r=0.67) has stronger correlation than pricing (r=0.34)?
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Final Decision Checkpoint
                    </CardTitle>
                    <CardDescription>
                        What should the company actually do?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Your recommendation
                        </label>
                        <Select value={recommendation} onValueChange={setRecommendation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your recommendation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="revert_pricing">Revert pricing changes ($2M cost)</SelectItem>
                                <SelectItem value="fix_service_quality">Fix service quality issues first</SelectItem>
                                <SelectItem value="targeted_retention">Targeted retention for enterprise customers</SelectItem>
                                <SelectItem value="run_experiment">Run controlled experiment (A/B test)</SelectItem>
                                <SelectItem value="need_more_data">Need more data before deciding</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Confidence level
                        </label>
                        <Select value={confidence} onValueChange={setConfidence}>
                            <SelectTrigger>
                                <SelectValue placeholder="How confident are you?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High - Strong evidence supports this</SelectItem>
                                <SelectItem value="medium">Medium - Reasonable evidence, some uncertainty</SelectItem>
                                <SelectItem value="low">Low - Significant uncertainty remains</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Justify your recommendation
                        </label>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain why this recommendation aligns with the evidence, addresses the business need, and is worth the cost/risk..."
                            className="min-h-[140px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!recommendation || !justification || !confidence}
                            className="flex-1"
                        >
                            Submit Final Decision
                        </Button>
                        <Button variant="outline" onClick={() => {
                            setRecommendation('')
                            setJustification('')
                            setConfidence('')
                        }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Good recommendations:
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>Match the strength of evidence</li>
                            <li>Address the actual root cause</li>
                            <li>Consider cost vs potential benefit</li>
                            <li>Acknowledge uncertainty honestly</li>
                            <li>Can be defended to stakeholders</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
