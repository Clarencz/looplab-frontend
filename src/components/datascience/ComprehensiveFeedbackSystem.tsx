import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Award, TrendingUp } from 'lucide-react';

export interface FeedbackItem {
    category: string;
    type: 'strength' | 'weakness' | 'critical' | 'suggestion';
    message: string;
    impact: 'high' | 'medium' | 'low';
    actionable: string;
}

export interface ComprehensiveFeedback {
    overallScore: number;
    grade: string;
    feedbackItems: FeedbackItem[];
    biasesDetected: string[];
    edgeCasesConsidered: number;
    alternativesExplored: number;
    justificationDepth: 'shallow' | 'adequate' | 'deep' | 'exceptional';
    keyTakeaways: string[];
    improvementPriorities: string[];
}

interface ComprehensiveFeedbackSystemProps {
    studentWork: any;
}

export function ComprehensiveFeedbackSystem({ studentWork }: ComprehensiveFeedbackSystemProps) {
    const [feedback] = useState<ComprehensiveFeedback>(() => generateFeedback(studentWork));

    function generateFeedback(work: any): ComprehensiveFeedback {
        const feedbackItems: FeedbackItem[] = [];
        const biasesDetected: string[] = [];
        let edgeCasesConsidered = 0;
        let alternativesExplored = 0;
        let justificationDepth: ComprehensiveFeedback['justificationDepth'] = 'shallow';

        // Analyze bias awareness
        if (work.problemStatement) {
            const statement = work.problemStatement.toLowerCase();

            if (!statement.includes('bias') && !statement.includes('confound')) {
                biasesDetected.push('Confirmation bias - accepting stakeholder claim without questioning');
                feedbackItems.push({
                    category: 'Bias Awareness',
                    type: 'critical',
                    message: 'No consideration of potential biases in problem framing',
                    impact: 'high',
                    actionable: 'Ask: What biases might the stakeholder have? What are they not telling me?',
                });
            }

            if (!statement.includes('segment') && !statement.includes('group')) {
                biasesDetected.push('Aggregation bias - treating all customers as homogeneous');
                feedbackItems.push({
                    category: 'Bias Awareness',
                    type: 'weakness',
                    message: 'Did not consider different customer segments',
                    impact: 'medium',
                    actionable: 'Break down by segments: high-value vs low-value, new vs old customers',
                });
            }
        }

        // Analyze edge case consideration
        if (work.hypotheses) {
            work.hypotheses.forEach((h: any) => {
                if (h.justification?.toLowerCase().includes('edge') ||
                    h.justification?.toLowerCase().includes('exception') ||
                    h.justification?.toLowerCase().includes('outlier')) {
                    edgeCasesConsidered++;
                }
            });

            if (edgeCasesConsidered === 0) {
                feedbackItems.push({
                    category: 'Edge Cases',
                    type: 'weakness',
                    message: 'No edge cases or exceptions considered',
                    impact: 'medium',
                    actionable: 'Ask: When might this NOT be true? What are the exceptions?',
                });
            } else if (edgeCasesConsidered >= 3) {
                feedbackItems.push({
                    category: 'Edge Cases',
                    type: 'strength',
                    message: `Considered ${edgeCasesConsidered} edge cases`,
                    impact: 'high',
                    actionable: 'Great! Continue this practice.',
                });
            }
        }

        // Analyze alternatives explored
        if (work.hypotheses) {
            alternativesExplored = work.hypotheses.length;

            if (alternativesExplored >= 5) {
                feedbackItems.push({
                    category: 'Alternative Exploration',
                    type: 'strength',
                    message: `Generated ${alternativesExplored} competing hypotheses`,
                    impact: 'high',
                    actionable: 'Excellent! This shows thorough thinking.',
                });
            } else if (alternativesExplored >= 3) {
                feedbackItems.push({
                    category: 'Alternative Exploration',
                    type: 'suggestion',
                    message: `Only ${alternativesExplored} hypotheses - aim for 5+`,
                    impact: 'medium',
                    actionable: 'Generate more alternatives: What ELSE could explain this?',
                });
            } else {
                feedbackItems.push({
                    category: 'Alternative Exploration',
                    type: 'critical',
                    message: 'Too few alternatives - only explored obvious explanation',
                    impact: 'high',
                    actionable: 'Force yourself to generate 5+ competing hypotheses before committing',
                });
            }
        }

        if (work.recommendations) {
            const rec = work.recommendations[0];
            if (rec?.alternativeActions && rec.alternativeActions.length >= 2) {
                feedbackItems.push({
                    category: 'Alternative Exploration',
                    type: 'strength',
                    message: 'Provided alternative recommendations',
                    impact: 'medium',
                    actionable: 'Good! Stakeholders appreciate options.',
                });
            }
        }

        // Analyze justification depth
        let totalJustificationLength = 0;
        let justificationCount = 0;

        if (work.hypotheses) {
            work.hypotheses.forEach((h: any) => {
                if (h.justification) {
                    totalJustificationLength += h.justification.length;
                    justificationCount++;
                }
            });
        }

        if (work.features) {
            work.features.forEach((f: any) => {
                if (f.businessLogic) {
                    totalJustificationLength += f.businessLogic.length;
                    justificationCount++;
                }
            });
        }

        if (work.recommendations) {
            work.recommendations.forEach((r: any) => {
                if (r.evidenceQuality) {
                    totalJustificationLength += r.evidenceQuality.length;
                    justificationCount++;
                }
            });
        }

        const avgJustificationLength = justificationCount > 0 ? totalJustificationLength / justificationCount : 0;

        if (avgJustificationLength > 150) {
            justificationDepth = 'exceptional';
            feedbackItems.push({
                category: 'Justification Depth',
                type: 'strength',
                message: 'Exceptional justification depth - detailed reasoning throughout',
                impact: 'high',
                actionable: 'Maintain this level of rigor!',
            });
        } else if (avgJustificationLength > 100) {
            justificationDepth = 'deep';
            feedbackItems.push({
                category: 'Justification Depth',
                type: 'strength',
                message: 'Good justification depth',
                impact: 'medium',
                actionable: 'Keep explaining your reasoning',
            });
        } else if (avgJustificationLength > 50) {
            justificationDepth = 'adequate';
            feedbackItems.push({
                category: 'Justification Depth',
                type: 'suggestion',
                message: 'Adequate but could be deeper',
                impact: 'medium',
                actionable: 'Explain WHY in more detail - what\'s your reasoning?',
            });
        } else {
            justificationDepth = 'shallow';
            feedbackItems.push({
                category: 'Justification Depth',
                type: 'critical',
                message: 'Shallow justifications - not enough reasoning',
                impact: 'high',
                actionable: 'Every claim needs detailed justification: WHY do you believe this?',
            });
        }

        // Calculate overall score
        const strengthCount = feedbackItems.filter((f) => f.type === 'strength').length;
        const criticalCount = feedbackItems.filter((f) => f.type === 'critical').length;
        const weaknessCount = feedbackItems.filter((f) => f.type === 'weakness').length;

        let overallScore = 70;
        overallScore += strengthCount * 10;
        overallScore -= criticalCount * 15;
        overallScore -= weaknessCount * 5;
        overallScore = Math.max(0, Math.min(100, overallScore));

        const grade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F';

        // Generate key takeaways
        const keyTakeaways: string[] = [];
        if (alternativesExplored >= 5) {
            keyTakeaways.push('Strong alternative exploration - you\'re thinking broadly');
        }
        if (biasesDetected.length > 2) {
            keyTakeaways.push('Need to develop bias awareness - question your assumptions');
        }
        if (justificationDepth === 'exceptional' || justificationDepth === 'deep') {
            keyTakeaways.push('Excellent justification depth - you explain your reasoning well');
        }
        if (edgeCasesConsidered === 0) {
            keyTakeaways.push('Missing edge case consideration - think about exceptions');
        }

        // Generate improvement priorities
        const improvementPriorities: string[] = [];
        const criticalItems = feedbackItems.filter((f) => f.type === 'critical' && f.impact === 'high');
        criticalItems.slice(0, 3).forEach((item) => {
            improvementPriorities.push(item.actionable);
        });

        if (improvementPriorities.length === 0) {
            improvementPriorities.push('Continue practicing with more complex scenarios');
            improvementPriorities.push('Challenge yourself with analytical traps');
        }

        return {
            overallScore,
            grade,
            feedbackItems,
            biasesDetected,
            edgeCasesConsidered,
            alternativesExplored,
            justificationDepth,
            keyTakeaways,
            improvementPriorities,
        };
    }

    const getTypeIcon = (type: FeedbackItem['type']) => {
        switch (type) {
            case 'strength':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'weakness':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'critical':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'suggestion':
                return <TrendingUp className="h-4 w-4 text-blue-500" />;
        }
    };

    const getTypeColor = (type: FeedbackItem['type']) => {
        switch (type) {
            case 'strength':
                return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
            case 'weakness':
                return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
            case 'critical':
                return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
            case 'suggestion':
                return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
        }
    };

    const getJustificationColor = (depth: ComprehensiveFeedback['justificationDepth']) => {
        switch (depth) {
            case 'exceptional':
                return 'bg-green-500';
            case 'deep':
                return 'bg-blue-500';
            case 'adequate':
                return 'bg-yellow-500';
            case 'shallow':
                return 'bg-red-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Overall Assessment */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Comprehensive Assessment
                        </span>
                        <Badge className="text-2xl px-4 py-2">{feedback.grade}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Score</span>
                            <span className="text-sm font-medium">{feedback.overallScore}/100</span>
                        </div>
                        <Progress value={feedback.overallScore} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{feedback.alternativesExplored}</p>
                            <p className="text-xs text-muted-foreground">Alternatives Explored</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{feedback.edgeCasesConsidered}</p>
                            <p className="text-xs text-muted-foreground">Edge Cases Considered</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{feedback.biasesDetected.length}</p>
                            <p className="text-xs text-muted-foreground">Biases Detected</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <Badge className={getJustificationColor(feedback.justificationDepth)}>
                                {feedback.justificationDepth}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Justification Depth</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Takeaways */}
            {feedback.keyTakeaways.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Key Takeaways
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {feedback.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="font-bold">{i + 1}.</span>
                                    <span>{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Detailed Feedback</CardTitle>
                    <CardDescription>
                        {feedback.feedbackItems.length} feedback items across all categories
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {feedback.feedbackItems.map((item, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${getTypeColor(item.type)}`}>
                            <div className="flex items-start gap-2">
                                {getTypeIcon(item.type)}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium">{item.category}</p>
                                        <Badge variant="outline" className="text-xs">
                                            {item.impact} impact
                                        </Badge>
                                    </div>
                                    <p className="text-sm mb-2">{item.message}</p>
                                    <p className="text-sm text-muted-foreground italic">
                                        → {item.actionable}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Biases Detected */}
            {feedback.biasesDetected.length > 0 && (
                <Card className="border-2 border-orange-500">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Cognitive Biases Detected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {feedback.biasesDetected.map((bias, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-orange-500">⚠️</span>
                                    <span>{bias}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Improvement Priorities */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Top Improvement Priorities
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {feedback.improvementPriorities.map((priority, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="font-bold">{i + 1}.</span>
                                <span>{priority}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Philosophy */}
            <Alert>
                <AlertDescription>
                    <strong>Remember:</strong> We grade your THINKING, not your code. A perfect Python script with
                    flawed logic gets an F. A well-reasoned analysis with syntax errors gets an A.
                </AlertDescription>
            </Alert>
        </div>
    );
}
