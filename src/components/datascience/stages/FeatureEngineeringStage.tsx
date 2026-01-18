import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface FeatureEngineeringStageProps {
    onDecision: (decision: { safeFeatures: string[]; justification: string }) => void
}

const features = [
    { id: 'tenure_months', name: 'tenure_months', description: 'Months as customer', hasLeakage: false },
    { id: 'plan_type', name: 'plan_type', description: 'Current plan (basic/premium/enterprise)', hasLeakage: false },
    { id: 'avg_monthly_revenue', name: 'avg_monthly_revenue', description: 'Average monthly revenue', hasLeakage: false },
    { id: 'days_since_last_payment', name: 'days_since_last_payment', description: 'Days since last payment', hasLeakage: true, leakageReason: 'Includes future data - payment after churn date' },
    { id: 'service_quality_score', name: 'service_quality_score', description: 'Service quality score (1-10)', hasLeakage: false },
    { id: 'support_tickets_count', name: 'support_tickets_count', description: 'Number of support tickets', hasLeakage: false },
    { id: 'contract_end_date', name: 'contract_end_date', description: 'Contract end date', hasLeakage: false },
    { id: 'churn_probability', name: 'churn_probability', description: 'Model-predicted churn probability', hasLeakage: true, leakageReason: 'Uses churn outcome to predict itself (circular)' },
]

export function FeatureEngineeringStage({ onDecision }: FeatureEngineeringStageProps) {
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
    const [justification, setJustification] = useState('')

    const toggleFeature = (featureId: string) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId)
                ? prev.filter(id => id !== featureId)
                : [...prev, featureId]
        )
    }

    const handleSubmit = () => {
        if (selectedFeatures.length > 0 && justification) {
            onDecision({ safeFeatures: selectedFeatures, justification })
        }
    }

    const hasLeakyFeatures = selectedFeatures.some(id =>
        features.find(f => f.id === id)?.hasLeakage
    )

    return (
        <div className="space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100">
                            Temporal Leakage Detected
                        </h3>
                        <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                            Existing model uses features that include future data. Model has 95% accuracy in testing but will fail in production.
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Feature Audit</CardTitle>
                    <CardDescription>
                        Review each feature for temporal integrity
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={`p-3 rounded-lg border ${feature.hasLeakage
                                    ? 'border-red-500/30 bg-red-500/5'
                                    : 'border-border bg-card'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id={feature.id}
                                    checked={selectedFeatures.includes(feature.id)}
                                    onCheckedChange={() => toggleFeature(feature.id)}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <label
                                        htmlFor={feature.id}
                                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                    >
                                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                            {feature.name}
                                        </code>
                                        {feature.hasLeakage && (
                                            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                LEAKAGE
                                            </span>
                                        )}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {feature.description}
                                    </p>
                                    {feature.hasLeakage && (
                                        <p className="text-xs text-red-700 dark:text-red-300 mt-1 font-medium">
                                            ⚠️ {feature.leakageReason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Decision Checkpoint
                    </CardTitle>
                    <CardDescription>
                        Which features are safe to use in production?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {hasLeakyFeatures && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                                ⚠️ Warning: You've selected features with temporal leakage
                            </p>
                            <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                                These features will cause your model to fail in production
                            </p>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">
                                Justify your feature selection
                            </label>
                            <span className="text-xs text-muted-foreground">
                                {selectedFeatures.length} features selected
                            </span>
                        </div>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain which features you selected, why they're safe to use, and how you validated temporal integrity..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedFeatures.length === 0 || !justification}
                            className="flex-1"
                        >
                            Submit Decision
                        </Button>
                        <Button variant="outline" onClick={() => { setSelectedFeatures([]); setJustification('') }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Ask yourself:
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>"Would I know this feature value BEFORE the customer churned?"</li>
                            <li>"Does this feature use information from after the prediction date?"</li>
                            <li>"Can I recreate this feature in production with only past data?"</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
