import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react'

interface AggregationStageProps {
    onDecision: (decision: { metric: string; justification: string }) => void
}

export function AggregationStage({ onDecision }: AggregationStageProps) {
    const [metric, setMetric] = useState('')
    const [justification, setJustification] = useState('')

    const handleSubmit = () => {
        if (metric && justification) {
            onDecision({ metric, justification })
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Misleading Aggregation Detected
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            Current dashboard shows "average revenue stable" but hides distribution shift
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Average Revenue</CardTitle>
                        <CardDescription className="text-xs">Current metric</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">$47.23</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                +0.2%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Looks stable, no alarm raised
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Median Revenue</CardTitle>
                        <CardDescription className="text-xs">Alternative metric</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">$32.15</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <TrendingDown className="h-3 w-3 text-red-600" />
                                -12%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Shows significant decline
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Distribution Analysis</CardTitle>
                    <CardDescription>
                        Revenue distribution by customer segment
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Basic Plan ($20-40)</span>
                                <span className="text-muted-foreground">60% of customers</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Premium Plan ($40-100)</span>
                                <span className="text-muted-foreground">30% of customers</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[30%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="flex items-center gap-2">
                                    Enterprise Plan ($100+)
                                    <span className="text-xs text-red-600 font-semibold">⚠️ High churn</span>
                                </span>
                                <span className="text-muted-foreground">10% of customers</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[10%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                            Key Finding:
                        </p>
                        <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                            High-value enterprise customers churning at +34% rate. Average hides this because they're only 10% of customer base.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Decision Checkpoint
                    </CardTitle>
                    <CardDescription>
                        What metric actually matters here?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Choose the right metric
                        </label>
                        <Select value={metric} onValueChange={setMetric}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the metric that matters" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="average">Average revenue (current)</SelectItem>
                                <SelectItem value="median">Median revenue</SelectItem>
                                <SelectItem value="segmented">Segmented churn rate by plan type</SelectItem>
                                <SelectItem value="weighted">Revenue-weighted churn rate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Explain why this metric matters
                        </label>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain why this metric is appropriate for the business context, what it reveals that averages hide, and how it affects the pricing decision..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!metric || !justification}
                            className="flex-1"
                        >
                            Submit Decision
                        </Button>
                        <Button variant="outline" onClick={() => { setMetric(''); setJustification('') }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Think about:
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>Which customers generate most revenue?</li>
                            <li>Does losing 10% of high-value customers matter more than average suggests?</li>
                            <li>What metric would marketing actually care about?</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
