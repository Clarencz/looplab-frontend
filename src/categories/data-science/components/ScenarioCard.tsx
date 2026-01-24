import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ScenarioCardProps {
    whyQuestionCount: number;
    avgReasoningScore: number;
}

export function ScenarioCard({ whyQuestionCount, avgReasoningScore }: ScenarioCardProps) {
    return (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Scenario: Telco Churn Analysis
                </CardTitle>
                <CardDescription className="text-base">
                    <strong>Your Role:</strong> Senior Analytics Lead
                    <br />
                    <strong>Stakeholder Claim:</strong> "Our recent pricing change caused a 15% increase in customer churn."
                    <br />
                    <strong>Your Mission:</strong> Prove or disprove this claim using sound analytical thinking.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-2xl font-bold text-red-500">$2M</p>
                        <p className="text-xs text-muted-foreground">Cost of reverting pricing</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-2xl font-bold text-blue-500">{whyQuestionCount}</p>
                        <p className="text-xs text-muted-foreground">"Why" questions asked</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-2xl font-bold text-green-500">{avgReasoningScore}/10</p>
                        <p className="text-xs text-muted-foreground">Avg reasoning score</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
