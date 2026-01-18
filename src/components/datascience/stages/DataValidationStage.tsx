import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface DataValidationStageProps {
    onDecision: (decision: { strategy: string; justification: string }) => void
}

export function DataValidationStage({ onDecision }: DataValidationStageProps) {
    const [strategy, setStrategy] = useState('')
    const [justification, setJustification] = useState('')

    const handleSubmit = () => {
        if (strategy && justification) {
            onDecision({ strategy, justification })
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100">
                            Data Quality Issues Detected
                        </h3>
                        <div className="text-sm text-red-800 dark:text-red-200 mt-2 space-y-1">
                            <p>• 23% of churn dates are missing</p>
                            <p>• 2 duplicate customer IDs found</p>
                            <p>• Inconsistent timestamp formats</p>
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Data Sample</CardTitle>
                    <CardDescription>
                        Customer churn data with quality issues
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{`customer_id | churn_date  | revenue | plan_type  | quality_score
------------|-------------|---------|------------|---------------
C001        | NULL        | 47.23   | premium    | 8.2
C002        | 2024-01-20  | 32.15   | basic      | 6.1
C001        | 2024-01-22  | 47.23   | premium    | 8.2  ⚠️ DUPLICATE
C003        | NULL        | 125.50  | enterprise | 4.3
C004        | 2024-01-25  | 28.99   | basic      | 7.8
C005        | NULL        | 89.00   | premium    | 3.1`}</pre>
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
                        How do you handle the 23% missing churn dates?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Choose your strategy
                        </label>
                        <Select value={strategy} onValueChange={setStrategy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a data handling strategy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="exclude">Exclude all rows with missing churn dates</SelectItem>
                                <SelectItem value="impute_median">Impute with median churn date</SelectItem>
                                <SelectItem value="flag_separate">Flag as separate category (active customers)</SelectItem>
                                <SelectItem value="exclude_analysis">Exclude from churn analysis, keep for revenue analysis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Justify your decision
                        </label>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain why this strategy is appropriate, what risks it introduces, and how it affects your analysis..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!strategy || !justification}
                            className="flex-1"
                        >
                            Submit Decision
                        </Button>
                        <Button variant="outline" onClick={() => { setStrategy(''); setJustification('') }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Consider:
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>Missing churn dates might mean "still active customer"</li>
                            <li>Excluding 23% of data could introduce bias</li>
                            <li>Imputation creates artificial data</li>
                            <li>Document your assumptions</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
