import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface QuestionFramingStageProps {
    onDecision: (decision: { question: string; justification: string }) => void
}

export function QuestionFramingStage({ onDecision }: QuestionFramingStageProps) {
    const [question, setQuestion] = useState('')
    const [justification, setJustification] = useState('')

    const handleSubmit = () => {
        if (question && justification) {
            onDecision({ question, justification })
        }
    }

    return (
        <div className="space-y-6">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Initial Framing (Problematic)
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            "Prove that pricing changes caused the 8% churn increase"
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Business Context</CardTitle>
                    <CardDescription>
                        Marketing Director claims pricing changes caused churn. $2M decision to revert pricing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Available Data:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Customer churn dates (23% missing)</li>
                            <li>Revenue per customer</li>
                            <li>Service quality scores</li>
                            <li>Plan types</li>
                            <li>Payment history</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Why is the initial framing problematic?</p>
                        <p className="text-xs text-muted-foreground">
                            It's asking you to prove a conclusion, not answer a question. This creates confirmation bias.
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
                        Reframe the question to be testable and unbiased
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            What question should we actually answer?
                        </label>
                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Example: What factors contributed to the 8% churn increase, and what is the relative impact of each?"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Justify your question
                        </label>
                        <Textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Explain why this question is better, what it allows you to test, and how it addresses the business need..."
                            className="min-h-[120px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!question || !justification}
                            className="flex-1"
                        >
                            Submit Decision
                        </Button>
                        <Button variant="outline" onClick={() => { setQuestion(''); setJustification('') }}>
                            Reset
                        </Button>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                            💡 Hint: Good questions are...
                        </p>
                        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5 list-disc list-inside">
                            <li>Testable with available data</li>
                            <li>Open to multiple answers</li>
                            <li>Aligned with business needs</li>
                            <li>Have clear success criteria</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
