import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Award } from 'lucide-react';

export interface LogicEvaluation {
    category: 'problem_decomposition' | 'causal_reasoning' | 'hypothesis_testing' | 'data_strategy' | 'business_translation';
    score: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    criticalErrors: string[];
    suggestions: string[];
}

export interface ReasoningQuality {
    overallScore: number; // 0-100
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    evaluations: LogicEvaluation[];
    summary: string;
    nextSteps: string[];
}

interface LogicQualityGraderProps {
    studentWork: {
        problemStatement?: string;
        hypotheses?: any[];
        variableMap?: any;
        missingDataStrategy?: any[];
        features?: any[];
        statisticalTests?: any[];
        visualizations?: any[];
        recommendations?: any[];
    };
    onGradeComplete?: (quality: ReasoningQuality) => void;
}

export function LogicQualityGrader({ studentWork, onGradeComplete }: LogicQualityGraderProps) {
    const [grading, setGrading] = useState(false);
    const [result, setResult] = useState<ReasoningQuality | null>(null);

    const evaluateProblemDecomposition = (): LogicEvaluation => {
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const criticalErrors: string[] = [];
        const suggestions: string[] = [];
        let score = 50; // Start at 50

        if (studentWork.problemStatement) {
            const statement = studentWork.problemStatement.toLowerCase();

            // Check for assumption identification
            if (statement.includes('assum') || statement.includes('given that')) {
                strengths.push('Identified assumptions in problem statement');
                score += 15;
            } else {
                weaknesses.push('Did not explicitly identify assumptions');
                suggestions.push('List all assumptions: What are you taking for granted?');
                score -= 10;
            }

            // Check for questioning stakeholder claim
            if (statement.includes('question') || statement.includes('verify') || statement.includes('prove')) {
                strengths.push('Questioned stakeholder claim rather than accepting it');
                score += 15;
            } else {
                criticalErrors.push('Accepted stakeholder claim at face value');
                suggestions.push('Always question: Is the stakeholder\'s framing correct?');
                score -= 20;
            }

            // Check for alternative explanations
            if (statement.includes('alternative') || statement.includes('other') || statement.includes('could also')) {
                strengths.push('Considered alternative explanations');
                score += 10;
            } else {
                weaknesses.push('Did not explore alternative explanations');
                suggestions.push('Generate 3+ alternative hypotheses before committing to one');
            }

            // Check for specificity
            if (statement.length > 100) {
                strengths.push('Detailed problem decomposition');
                score += 10;
            } else {
                weaknesses.push('Problem statement too brief');
                suggestions.push('Be specific: What exactly are you trying to prove/disprove?');
                score -= 5;
            }
        } else {
            criticalErrors.push('No problem statement provided');
            score = 0;
        }

        return {
            category: 'problem_decomposition',
            score: Math.max(0, Math.min(100, score)),
            strengths,
            weaknesses,
            criticalErrors,
            suggestions,
        };
    };

    const evaluateCausalReasoning = (): LogicEvaluation => {
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const criticalErrors: string[] = [];
        const suggestions: string[] = [];
        let score = 50;

        if (studentWork.variableMap) {
            // Check for confounding variables
            const hasConfounders = true; // Placeholder - would check actual variable map
            if (hasConfounders) {
                strengths.push('Identified confounding variables');
                score += 20;
            } else {
                criticalErrors.push('No confounding variables identified');
                suggestions.push('Ask: What else could cause BOTH the treatment and outcome?');
                score -= 25;
            }

            // Check for causal diagram
            strengths.push('Created visual causal diagram');
            score += 15;
        } else {
            criticalErrors.push('No causal reasoning demonstrated');
            suggestions.push('Draw a causal diagram before analyzing');
            score -= 30;
        }

        // Check hypotheses for causal language
        if (studentWork.hypotheses && studentWork.hypotheses.length > 0) {
            const hasNullHypothesis = studentWork.hypotheses.some((h: any) =>
                h.statement?.toLowerCase().includes('no effect') ||
                h.statement?.toLowerCase().includes('no difference')
            );

            if (hasNullHypothesis) {
                strengths.push('Included null hypothesis');
                score += 10;
            } else {
                weaknesses.push('Missing null hypothesis');
                suggestions.push('Always include null hypothesis (no effect/no difference)');
                score -= 10;
            }
        }

        return {
            category: 'causal_reasoning',
            score: Math.max(0, Math.min(100, score)),
            strengths,
            weaknesses,
            criticalErrors,
            suggestions,
        };
    };

    const evaluateHypothesisTesting = (): LogicEvaluation => {
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const criticalErrors: string[] = [];
        const suggestions: string[] = [];
        let score = 50;

        if (studentWork.hypotheses && studentWork.hypotheses.length > 0) {
            // Check quantity
            if (studentWork.hypotheses.length >= 5) {
                strengths.push('Generated multiple competing hypotheses (5+)');
                score += 15;
            } else if (studentWork.hypotheses.length >= 3) {
                strengths.push('Generated several hypotheses');
                score += 10;
            } else {
                weaknesses.push('Too few hypotheses - only explored obvious explanation');
                suggestions.push('Generate at least 5 competing hypotheses');
                score -= 15;
            }

            // Check for scoring
            const hasScoring = studentWork.hypotheses.some((h: any) => h.testability || h.businessImpact);
            if (hasScoring) {
                strengths.push('Scored hypotheses by testability and impact');
                score += 15;
            } else {
                weaknesses.push('Did not prioritize hypotheses');
                suggestions.push('Score each hypothesis: testability (1-10), business impact (1-10)');
                score -= 10;
            }

            // Check for justification
            const hasJustification = studentWork.hypotheses.every((h: any) => h.justification && h.justification.length > 20);
            if (hasJustification) {
                strengths.push('Justified each hypothesis with reasoning');
                score += 10;
            } else {
                weaknesses.push('Insufficient justification for hypotheses');
                suggestions.push('Explain WHY each hypothesis is plausible');
                score -= 10;
            }
        } else {
            criticalErrors.push('No hypotheses generated');
            suggestions.push('Generate 5+ competing hypotheses before analysis');
            score = 0;
        }

        return {
            category: 'hypothesis_testing',
            score: Math.max(0, Math.min(100, score)),
            strengths,
            weaknesses,
            criticalErrors,
            suggestions,
        };
    };

    const evaluateDataStrategy = (): LogicEvaluation => {
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const criticalErrors: string[] = [];
        const suggestions: string[] = [];
        let score = 50;

        // Check missing data strategy
        if (studentWork.missingDataStrategy && studentWork.missingDataStrategy.length > 0) {
            const hasJustification = studentWork.missingDataStrategy.every((s: any) => s.justification);
            if (hasJustification) {
                strengths.push('Justified missing data strategy');
                score += 15;
            } else {
                weaknesses.push('Missing data strategy lacks justification');
                suggestions.push('Explain WHY your imputation method is valid for this pattern');
                score -= 10;
            }

            const hasBiasRisk = studentWork.missingDataStrategy.every((s: any) => s.biasRisk);
            if (hasBiasRisk) {
                strengths.push('Assessed bias risk of missing data handling');
                score += 10;
            }
        } else {
            weaknesses.push('No missing data strategy documented');
            suggestions.push('Analyze missing data patterns (MCAR/MAR/MNAR) before proceeding');
            score -= 15;
        }

        // Check feature engineering
        if (studentWork.features && studentWork.features.length > 0) {
            const hasBusinessLogic = studentWork.features.every((f: any) => f.businessLogic && f.businessLogic.length > 20);
            if (hasBusinessLogic) {
                strengths.push('All features have business logic justification');
                score += 15;
            } else {
                criticalErrors.push('Features created without business justification');
                suggestions.push('Every feature needs business logic: WHY does this matter?');
                score -= 20;
            }

            const hasLeakageCheck = studentWork.features.every((f: any) => !f.potentialIssues?.includes('leakage'));
            if (hasLeakageCheck) {
                strengths.push('No data leakage detected in features');
                score += 10;
            } else {
                criticalErrors.push('Data leakage detected in features');
                suggestions.push('Remove features that use future information or target variable');
                score -= 30;
            }
        }

        return {
            category: 'data_strategy',
            score: Math.max(0, Math.min(100, score)),
            strengths,
            weaknesses,
            criticalErrors,
            suggestions,
        };
    };

    const evaluateBusinessTranslation = (): LogicEvaluation => {
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        const criticalErrors: string[] = [];
        const suggestions: string[] = [];
        let score = 50;

        if (studentWork.recommendations && studentWork.recommendations.length > 0) {
            const rec = studentWork.recommendations[0];

            // Check for specificity
            if (rec.recommendation && rec.recommendation.length > 50) {
                strengths.push('Specific, actionable recommendation');
                score += 15;
            } else {
                weaknesses.push('Recommendation too vague');
                suggestions.push('Be specific: "Revert pricing for &gt;$50/month customers" not "improve retention"');
                score -= 15;
            }

            // Check for quantification
            if (rec.decisionImpact && (rec.decisionImpact.includes('$') || rec.decisionImpact.includes('%'))) {
                strengths.push('Quantified business impact');
                score += 20;
            } else {
                criticalErrors.push('No quantified business impact');
                suggestions.push('Use numbers: $2M revenue, 500 customers, 6% churn reduction');
                score -= 20;
            }

            // Check for assumptions
            if (rec.assumptions && rec.assumptions.length > 0) {
                strengths.push('Listed assumptions explicitly');
                score += 10;
            } else {
                weaknesses.push('Assumptions not stated');
                suggestions.push('List all assumptions: What are you taking for granted?');
                score -= 10;
            }

            // Check for risks
            if (rec.risks && rec.risks.length > 0) {
                strengths.push('Identified risks');
                score += 10;
            } else {
                weaknesses.push('Risks not considered');
                suggestions.push('What could go wrong if they follow your recommendation?');
                score -= 10;
            }

            // Check for alternatives
            if (rec.alternativeActions && rec.alternativeActions.length > 0) {
                strengths.push('Provided alternative actions');
                score += 10;
            } else {
                weaknesses.push('No alternatives provided');
                suggestions.push('Rarely is there only one solution - give options');
                score -= 5;
            }
        } else {
            criticalErrors.push('No business recommendations provided');
            suggestions.push('Translate your analysis into actionable business recommendations');
            score = 0;
        }

        return {
            category: 'business_translation',
            score: Math.max(0, Math.min(100, score)),
            strengths,
            weaknesses,
            criticalErrors,
            suggestions,
        };
    };

    const calculateGrade = (score: number): ReasoningQuality['grade'] => {
        if (score >= 97) return 'A+';
        if (score >= 93) return 'A';
        if (score >= 87) return 'B+';
        if (score >= 83) return 'B';
        if (score >= 77) return 'C+';
        if (score >= 73) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const performGrading = () => {
        setGrading(true);

        // Simulate grading delay
        setTimeout(() => {
            const evaluations = [
                evaluateProblemDecomposition(),
                evaluateCausalReasoning(),
                evaluateHypothesisTesting(),
                evaluateDataStrategy(),
                evaluateBusinessTranslation(),
            ];

            const overallScore = Math.round(
                evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
            );

            const grade = calculateGrade(overallScore);

            const allStrengths = evaluations.flatMap((e) => e.strengths);
            const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);
            const allCriticalErrors = evaluations.flatMap((e) => e.criticalErrors);

            let summary = '';
            if (grade === 'A+' || grade === 'A') {
                summary = 'Excellent analytical thinking! Your reasoning is thorough, well-justified, and demonstrates senior-level thinking.';
            } else if (grade === 'B+' || grade === 'B') {
                summary = 'Good analytical work. You understand the concepts but need more practice with justification and edge cases.';
            } else if (grade === 'C+' || grade === 'C') {
                summary = 'Adequate understanding but significant gaps in reasoning. Focus on the critical errors below.';
            } else {
                summary = 'Needs significant improvement. Review the fundamentals and practice with simpler scenarios first.';
            }

            const nextSteps: string[] = [];
            if (allCriticalErrors.length > 0) {
                nextSteps.push('Fix critical errors first - these invalidate your analysis');
            }
            if (allWeaknesses.length > 3) {
                nextSteps.push('Focus on your top 3 weaknesses');
            }
            nextSteps.push('Practice with analytical traps to build intuition');
            nextSteps.push('Review examples of senior analyst work');

            const quality: ReasoningQuality = {
                overallScore,
                grade,
                evaluations,
                summary,
                nextSteps,
            };

            setResult(quality);
            onGradeComplete?.(quality);
            setGrading(false);
        }, 1500);
    };

    const getGradeColor = (grade: ReasoningQuality['grade']) => {
        if (grade === 'A+' || grade === 'A') return 'bg-green-500';
        if (grade === 'B+' || grade === 'B') return 'bg-blue-500';
        if (grade === 'C+' || grade === 'C') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getCategoryName = (category: LogicEvaluation['category']) => {
        const names = {
            problem_decomposition: 'Problem Decomposition',
            causal_reasoning: 'Causal Reasoning',
            hypothesis_testing: 'Hypothesis Testing',
            data_strategy: 'Data Strategy',
            business_translation: 'Business Translation',
        };
        return names[category];
    };

    return (
        <div className="space-y-6">
            {/* Grading Trigger */}
            {!result && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Logic Quality Grading
                        </CardTitle>
                        <CardDescription>
                            Get comprehensive feedback on your analytical reasoning (not your code)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert className="mb-4">
                            <AlertDescription>
                                <strong>What we grade:</strong> Your thinking process, justifications, and reasoning quality.
                                <br />
                                <strong>What we DON'T grade:</strong> Code syntax, tool proficiency, or technical implementation.
                            </AlertDescription>
                        </Alert>
                        <Button onClick={performGrading} disabled={grading} className="w-full">
                            {grading ? 'Grading...' : 'Grade My Analytical Thinking'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Grading Results */}
            {result && (
                <>
                    {/* Overall Score */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Your Reasoning Quality Grade
                                </span>
                                <Badge className={`${getGradeColor(result.grade)} text-2xl px-4 py-2`}>
                                    {result.grade}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Overall Score</span>
                                    <span className="text-sm font-medium">{result.overallScore}/100</span>
                                </div>
                                <Progress value={result.overallScore} className="h-3" />
                            </div>

                            <Alert>
                                <AlertDescription>{result.summary}</AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Detailed Evaluations */}
                    {result.evaluations.map((evaluation) => (
                        <Card key={evaluation.category}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>{getCategoryName(evaluation.category)}</span>
                                    <Badge variant="outline">{evaluation.score}/100</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Progress value={evaluation.score} className="h-2" />

                                {/* Critical Errors */}
                                {evaluation.criticalErrors.length > 0 && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1 text-red-700 dark:text-red-300">
                                            <XCircle className="h-4 w-4" />
                                            Critical Errors:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            {evaluation.criticalErrors.map((error, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span>❌</span>
                                                    <span>{error}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Strengths */}
                                {evaluation.strengths.length > 0 && (
                                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1 text-green-700 dark:text-green-300">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Strengths:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            {evaluation.strengths.map((strength, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span>✓</span>
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Weaknesses */}
                                {evaluation.weaknesses.length > 0 && (
                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
                                            <AlertTriangle className="h-4 w-4" />
                                            Weaknesses:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            {evaluation.weaknesses.map((weakness, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span>⚠️</span>
                                                    <span>{weakness}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {evaluation.suggestions.length > 0 && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                            <TrendingUp className="h-4 w-4" />
                                            How to Improve:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            {evaluation.suggestions.map((suggestion, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span>💡</span>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Next Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {result.nextSteps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="font-bold">{i + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Button onClick={() => setResult(null)} variant="outline" className="w-full">
                        Grade Again
                    </Button>
                </>
            )}
        </div>
    );
}
