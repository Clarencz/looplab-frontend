import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Brain, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

export interface SocraticQuestion {
    id: string;
    question: string;
    context: string;
    category: 'why' | 'assumption' | 'alternative' | 'validation' | 'edge-case';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface StudentResponse {
    questionId: string;
    response: string;
    timestamp: Date;
    aiEvaluation?: {
        logicScore: number; // 1-10
        completeness: number; // 1-10
        justificationDepth: number; // 1-10
        feedback: string;
        followUpQuestions: string[];
    };
}

interface SocraticDialogueProps {
    context: {
        problemStatement?: string;
        currentAction?: string;
        hypotheses?: any[];
    };
    onResponse?: (response: StudentResponse) => void;
}

export function SocraticDialogue({ context, onResponse }: SocraticDialogueProps) {
    const [questions, setQuestions] = useState<SocraticQuestion[]>([]);
    const [responses, setResponses] = useState<StudentResponse[]>([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Generate Socratic questions based on context
    const generateQuestions = () => {
        const newQuestions: SocraticQuestion[] = [];

        if (context.problemStatement) {
            newQuestions.push({
                id: '1',
                question: 'Why do you believe this is the right problem to solve?',
                context: 'Problem Statement',
                category: 'why',
                difficulty: 'beginner',
            });

            newQuestions.push({
                id: '2',
                question: 'What assumptions are embedded in this problem statement?',
                context: 'Problem Statement',
                category: 'assumption',
                difficulty: 'intermediate',
            });

            newQuestions.push({
                id: '3',
                question: 'What alternative explanations have you considered?',
                context: 'Problem Statement',
                category: 'alternative',
                difficulty: 'intermediate',
            });
        }

        if (context.currentAction) {
            newQuestions.push({
                id: '4',
                question: `Why is "${context.currentAction}" the right approach?`,
                context: 'Current Action',
                category: 'why',
                difficulty: 'beginner',
            });

            newQuestions.push({
                id: '5',
                question: 'When would this approach fail or give misleading results?',
                context: 'Current Action',
                category: 'edge-case',
                difficulty: 'advanced',
            });

            newQuestions.push({
                id: '6',
                question: 'How will you validate that this approach is working correctly?',
                context: 'Current Action',
                category: 'validation',
                difficulty: 'intermediate',
            });
        }

        setQuestions(newQuestions);
    };

    const submitResponse = (questionId: string) => {
        if (!currentResponse.trim()) return;

        setIsThinking(true);

        // Simulate AI evaluation
        setTimeout(() => {
            const evaluation = evaluateResponse(currentResponse);

            const response: StudentResponse = {
                questionId,
                response: currentResponse,
                timestamp: new Date(),
                aiEvaluation: evaluation,
            };

            setResponses([...responses, response]);
            onResponse?.(response);
            setCurrentResponse('');
            setIsThinking(false);

            // Generate follow-up questions
            if (evaluation.followUpQuestions.length > 0) {
                const followUps = evaluation.followUpQuestions.map((q, i) => ({
                    id: `followup-${Date.now()}-${i}`,
                    question: q,
                    context: 'Follow-up',
                    category: 'why' as const,
                    difficulty: 'intermediate' as const,
                }));
                setQuestions([...questions, ...followUps]);
            }
        }, 1500);
    };

    const evaluateResponse = (response: string): StudentResponse['aiEvaluation'] => {
        // Simple heuristic evaluation (in production, this would use actual AI)
        const wordCount = response.split(' ').length;
        const hasJustification = response.toLowerCase().includes('because') || response.toLowerCase().includes('since');
        const hasAlternatives = response.toLowerCase().includes('alternatively') || response.toLowerCase().includes('however');
        const hasEvidence = response.toLowerCase().includes('data') || response.toLowerCase().includes('evidence');

        const logicScore = Math.min(10, Math.floor(wordCount / 10) + (hasJustification ? 3 : 0));
        const completeness = Math.min(10, (hasAlternatives ? 5 : 0) + (hasEvidence ? 5 : 0));
        const justificationDepth = Math.min(10, (hasJustification ? 5 : 0) + Math.floor(wordCount / 15));

        const followUpQuestions: string[] = [];

        if (!hasJustification) {
            followUpQuestions.push('Can you explain the reasoning behind this choice?');
        }

        if (!hasAlternatives) {
            followUpQuestions.push('What other approaches did you consider and why did you reject them?');
        }

        if (!hasEvidence) {
            followUpQuestions.push('What evidence or data supports this reasoning?');
        }

        const avgScore = (logicScore + completeness + justificationDepth) / 3;
        let feedback = '';

        if (avgScore >= 8) {
            feedback = 'Strong reasoning! Your logic is sound and well-justified.';
        } else if (avgScore >= 6) {
            feedback = 'Good start, but consider deepening your justification and exploring alternatives.';
        } else {
            feedback = 'Your response needs more depth. Focus on explaining WHY and considering edge cases.';
        }

        return {
            logicScore,
            completeness,
            justificationDepth,
            feedback,
            followUpQuestions,
        };
    };

    const getCategoryIcon = (category: SocraticQuestion['category']) => {
        switch (category) {
            case 'why':
                return <HelpCircle className="h-4 w-4" />;
            case 'assumption':
                return <AlertTriangle className="h-4 w-4" />;
            case 'alternative':
                return <Brain className="h-4 w-4" />;
            case 'validation':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'edge-case':
                return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: SocraticQuestion['category']) => {
        switch (category) {
            case 'why':
                return 'bg-blue-500';
            case 'assumption':
                return 'bg-yellow-500';
            case 'alternative':
                return 'bg-purple-500';
            case 'validation':
                return 'bg-green-500';
            case 'edge-case':
                return 'bg-red-500';
        }
    };

    return (
        <div className="space-y-4">
            {/* Generate Questions Button */}
            {questions.length === 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <Button onClick={generateQuestions} className="w-full">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Start Socratic Dialogue
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Questions and Responses */}
            {questions.map((question) => {
                const response = responses.find((r) => r.questionId === question.id);

                return (
                    <Card key={question.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge className={getCategoryColor(question.category)}>
                                        {getCategoryIcon(question.category)}
                                        <span className="ml-1 capitalize">{question.category}</span>
                                    </Badge>
                                    <Badge variant="outline">{question.difficulty}</Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">{question.context}</span>
                            </div>
                            <CardTitle className="text-base mt-2">{question.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!response ? (
                                <>
                                    <Textarea
                                        value={currentResponse}
                                        onChange={(e) => setCurrentResponse(e.target.value)}
                                        placeholder="Type your response... Focus on explaining your reasoning."
                                        className="min-h-[100px]"
                                        disabled={isThinking}
                                    />
                                    <Button
                                        onClick={() => submitResponse(question.id)}
                                        disabled={!currentResponse.trim() || isThinking}
                                    >
                                        {isThinking ? 'AI is evaluating...' : 'Submit Response'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-medium mb-1">Your Response:</p>
                                        <p className="text-sm text-muted-foreground">{response.response}</p>
                                    </div>

                                    {response.aiEvaluation && (
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground">Logic</p>
                                                    <p className="text-2xl font-bold">
                                                        {response.aiEvaluation.logicScore}/10
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground">Completeness</p>
                                                    <p className="text-2xl font-bold">
                                                        {response.aiEvaluation.completeness}/10
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground">Depth</p>
                                                    <p className="text-2xl font-bold">
                                                        {response.aiEvaluation.justificationDepth}/10
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm font-medium mb-1">AI Feedback:</p>
                                                <p className="text-sm">{response.aiEvaluation.feedback}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Summary Stats */}
            {responses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Dialogue Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold">{responses.length}</p>
                                <p className="text-xs text-muted-foreground">Questions Answered</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {responses.length > 0
                                        ? Math.round(
                                            responses.reduce(
                                                (sum, r) =>
                                                    sum +
                                                    ((r.aiEvaluation?.logicScore || 0) +
                                                        (r.aiEvaluation?.completeness || 0) +
                                                        (r.aiEvaluation?.justificationDepth || 0)) /
                                                    3,
                                                0
                                            ) / responses.length
                                        )
                                        : 0}
                                    /10
                                </p>
                                <p className="text-xs text-muted-foreground">Avg Reasoning Score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
