import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

interface AnalysisStageProps {
    onDecision: (decision: { conclusion: string; confounders: string[]; justification: string }) => void
}

export function AnalysisStage({ onDecision }: AnalysisStageProps) {
    const [conclusion, setConclusion] = useState('')
    const [selectedConfounders, setSelectedConfounders] = useState<string[]>([])
    const [justification, setJustification] = useState('')

    const confounders = [
        { id: 'service_quality', name: 'Service Quality Decline', correlation: 0.67 },
        { id: 'competitor_promo', name: 'Competitor Promotion', correlation: 0.45 },
        { id: 'pricing', name: 'Pricing Changes', correlation: 0.34 },
        { id: 'network_outages', name: 'Network Outages', correlation: 0.52 },
    ]

    const toggleConfounder = (id: string) => {
        setSelectedConfounders(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleSubmit = () => {
        if (conclusion && selectedConfounders.length > 0 && justification) {
            onDecision({ conclusion, confounders: selectedConfounders, justification })
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Correlation ≠ Causation
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            Charts show pricing correlation, but multiple confounding factors present
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Correlation Analysis</CardTitle>
                    <CardDescription>
                        Factors correlated with churn increase
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {confounders.map((factor) => (
                        <div
                            key={factor.id}
                            className="p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleConfounder(factor.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedConfounders.includes(factor.id)}
                                        onChange={() => toggleConfounder(factor.id)}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">{factor.name}</span>
                                </div>
                                <span className="text-sm font-mono font-semibold">
                                    r = {factor.correlation}
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${factor.correlation > 0.6
                                            ? 'bg-red-500'
                                            : factor.correlation > 0.4
                                                ? 'bg-yellow-500'
                                                : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${factor.correlation * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Timeline Analysis</CardTitle>
                    <CardDescription>
                        Events in Q4 2024
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="w-24 text-xs text-muted-foreground">Oct 1</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">Pricing Change Implemented</div>
                                <div className="text-xs text-muted-foreground">+8% increase for premium plans</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-24 text-xs text-muted-foreground">Oct 15</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-red-600">Service Quality Decline Begins</div>
                                <div className="text-xs text-muted-foreground">Network infrastructure issues</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-24 text-xs text-muted-foreground">Nov 1</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">Churn Rate Increase Detected</div>
                                <div className="text-xs text-muted-foreground">+8% above baseline</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-24 text-xs text-muted-foreground">Nov 15</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium">Competitor Launches Promotion</div>
                                <div className="text-xs text-muted-foreground">50% off for 6 months</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                            Key Finding:
                        </p>
                        <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                            Service quality decline (r=0.67) started 2 weeks after pricing change and has stronger correlation than pricing (r=0.34)
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
                        Can you prove pricing caused the churn increase?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Your conclusion
                        </label>
                        <Textarea
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                            placeholder="State your conclusion about whether pricing caused the churn increase..."
                            className="min-h-[80px]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Identify confounding factors (select above)
                        </label>
                        {selectedConfounders.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedConfounders.map(id => {
                                    const factor = confounders.find(c => c.id === id)
                                    return (
                                        <span key={id} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                            {factor?.name}
                                        </span>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No confounders selected</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Justify with evidence
                        </label>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain your reasoning, cite correlation strengths, timeline evidence, and why you can/cannot prove causation..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!conclusion || selectedConfounders.length === 0 || !justification}
                            className="flex-1"
                        >
                            Submit Decision
                        </Button>
                        <Button variant="outline" onClick={() => {
                            setConclusion('')
                            setSelectedConfounders([])
                            setJustification('')
                        }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Remember:
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>Correlation strength doesn't prove causation</li>
                            <li>Timeline matters - what happened when?</li>
                            <li>Multiple factors can contribute simultaneously</li>
                            <li>Honest uncertainty is better than false confidence</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
