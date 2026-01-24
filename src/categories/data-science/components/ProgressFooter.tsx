import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import type { ThinkingCanvasData } from '@/components/datascience/ThinkingCanvas';

interface ProgressFooterProps {
    thinkingData: ThinkingCanvasData;
    whyQuestionCount: number;
    avgReasoningScore: number;
}

export function ProgressFooter({ thinkingData, whyQuestionCount, avgReasoningScore }: ProgressFooterProps) {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Progress
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{thinkingData.hypotheses.length}</p>
                        <p className="text-xs text-muted-foreground">Hypotheses Generated</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{thinkingData.logicJournal.length}</p>
                        <p className="text-xs text-muted-foreground">Logic Entries</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{whyQuestionCount}</p>
                        <p className="text-xs text-muted-foreground">Questions Answered</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{avgReasoningScore}/10</p>
                        <p className="text-xs text-muted-foreground">Reasoning Quality</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
