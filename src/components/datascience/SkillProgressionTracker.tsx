import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertCircle, CheckCircle2, XCircle, Lightbulb, Target } from 'lucide-react';

export type SkillCategory =
    | 'problem_decomposition'
    | 'causal_reasoning'
    | 'hypothesis_generation'
    | 'data_quality'
    | 'feature_engineering'
    | 'statistical_testing'
    | 'visualization'
    | 'business_translation';

export type SkillLevel = 'novice' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
    category: SkillCategory;
    level: SkillLevel;
    experience: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    recentMistakes: string[];
    masteryIndicators: {
        indicator: string;
        achieved: boolean;
    }[];
}

export interface FailurePattern {
    id: string;
    type: 'repeated_mistake' | 'missing_step' | 'shallow_reasoning' | 'assumption_blindness' | 'tool_over_thinking';
    description: string;
    occurrences: number;
    lastOccurred: Date;
    suggestedFocus: string;
    relatedSkill: SkillCategory;
}

export interface ProgressiveHint {
    level: number; // 1-5, increasing specificity
    message: string;
    unlockCondition: string;
}

interface SkillProgressionTrackerProps {
    onSkillUpdate?: (skills: Skill[]) => void;
}

export function SkillProgressionTracker({ onSkillUpdate }: SkillProgressionTrackerProps) {
    const [skills, setSkills] = useState<Skill[]>([
        {
            category: 'problem_decomposition',
            level: 'novice',
            experience: 15,
            strengths: [],
            weaknesses: ['Accepting stakeholder claims at face value', 'Not identifying hidden assumptions'],
            recentMistakes: ['Didn\'t question the "pricing caused churn" claim'],
            masteryIndicators: [
                { indicator: 'Identify 3+ hidden assumptions in problem statement', achieved: false },
                { indicator: 'Generate 5+ alternative hypotheses', achieved: false },
                { indicator: 'Question stakeholder framing automatically', achieved: false },
            ],
        },
        {
            category: 'causal_reasoning',
            level: 'novice',
            experience: 20,
            strengths: [],
            weaknesses: ['Confusing correlation with causation', 'Missing confounding variables'],
            recentMistakes: ['Didn\'t consider service quality as confounder'],
            masteryIndicators: [
                { indicator: 'Draw complete causal diagram with 5+ variables', achieved: false },
                { indicator: 'Identify all confounders before analysis', achieved: true },
                { indicator: 'Explain why correlation ≠ causation with examples', achieved: false },
            ],
        },
        {
            category: 'hypothesis_generation',
            level: 'intermediate',
            experience: 45,
            strengths: ['Generating multiple hypotheses'],
            weaknesses: ['Not prioritizing by testability'],
            recentMistakes: [],
            masteryIndicators: [
                { indicator: 'Generate 5+ competing hypotheses', achieved: true },
                { indicator: 'Score hypotheses by testability and impact', achieved: false },
                { indicator: 'Include null hypothesis explicitly', achieved: true },
            ],
        },
        {
            category: 'data_quality',
            level: 'novice',
            experience: 10,
            strengths: [],
            weaknesses: ['Not checking missing data patterns', 'Imputing without justification'],
            recentMistakes: ['Imputed MNAR data with mean'],
            masteryIndicators: [
                { indicator: 'Identify MCAR vs MAR vs MNAR patterns', achieved: false },
                { indicator: 'Justify every imputation decision', achieved: false },
                { indicator: 'Validate data quality before analysis', achieved: false },
            ],
        },
        {
            category: 'feature_engineering',
            level: 'novice',
            experience: 25,
            strengths: [],
            weaknesses: ['Creating features without business logic', 'Data leakage'],
            recentMistakes: ['Created feature using future data'],
            masteryIndicators: [
                { indicator: 'Justify every feature with business logic', achieved: false },
                { indicator: 'Detect data leakage automatically', achieved: false },
                { indicator: 'Validate features don\'t use target variable', achieved: false },
            ],
        },
        {
            category: 'statistical_testing',
            level: 'intermediate',
            experience: 40,
            strengths: ['Formulating hypotheses'],
            weaknesses: ['Not checking test assumptions', 'Ignoring effect sizes'],
            recentMistakes: [],
            masteryIndicators: [
                { indicator: 'Check all test assumptions before running', achieved: false },
                { indicator: 'Report effect sizes, not just p-values', achieved: false },
                { indicator: 'Plan for both significant and non-significant results', achieved: true },
            ],
        },
        {
            category: 'visualization',
            level: 'novice',
            experience: 30,
            strengths: [],
            weaknesses: ['Choosing chart type before defining purpose', 'Misleading axes'],
            recentMistakes: ['Used non-zero y-axis baseline'],
            masteryIndicators: [
                { indicator: 'Define purpose before choosing chart type', achieved: false },
                { indicator: 'Identify potential misinterpretations', achieved: false },
                { indicator: 'Design for specific audience', achieved: true },
            ],
        },
        {
            category: 'business_translation',
            level: 'novice',
            experience: 20,
            strengths: [],
            weaknesses: ['Vague recommendations', 'Not quantifying impact'],
            recentMistakes: ['Recommended "improve retention" without specifics'],
            masteryIndicators: [
                { indicator: 'Quantify business impact ($, %, customers)', achieved: false },
                { indicator: 'Provide specific, actionable recommendations', achieved: false },
                { indicator: 'List assumptions and risks explicitly', achieved: false },
            ],
        },
    ]);

    const [failurePatterns, setFailurePatterns] = useState<FailurePattern[]>([
        {
            id: 'repeated-correlation-causation',
            type: 'repeated_mistake',
            description: 'Repeatedly confusing correlation with causation',
            occurrences: 3,
            lastOccurred: new Date(),
            suggestedFocus: 'Practice drawing causal diagrams and identifying confounders',
            relatedSkill: 'causal_reasoning',
        },
        {
            id: 'missing-assumption-check',
            type: 'missing_step',
            description: 'Not listing assumptions before analysis',
            occurrences: 5,
            lastOccurred: new Date(),
            suggestedFocus: 'Create a checklist: always list assumptions first',
            relatedSkill: 'problem_decomposition',
        },
    ]);

    const getLevelColor = (level: SkillLevel) => {
        switch (level) {
            case 'novice':
                return 'bg-red-500';
            case 'intermediate':
                return 'bg-yellow-500';
            case 'advanced':
                return 'bg-blue-500';
            case 'expert':
                return 'bg-green-500';
        }
    };

    const getLevelRequirements = (level: SkillLevel): string => {
        switch (level) {
            case 'novice':
                return 'Learning the basics, making common mistakes';
            case 'intermediate':
                return 'Understands concepts, needs practice';
            case 'advanced':
                return 'Consistently applies best practices';
            case 'expert':
                return 'Teaches others, catches subtle issues';
        }
    };

    const getSkillName = (category: SkillCategory): string => {
        const names: Record<SkillCategory, string> = {
            problem_decomposition: 'Problem Decomposition',
            causal_reasoning: 'Causal Reasoning',
            hypothesis_generation: 'Hypothesis Generation',
            data_quality: 'Data Quality Assessment',
            feature_engineering: 'Feature Engineering',
            statistical_testing: 'Statistical Testing',
            visualization: 'Visualization Strategy',
            business_translation: 'Business Translation',
        };
        return names[category];
    };

    const getNextLevelGuidance = (skill: Skill): string => {
        const unachieved = skill.masteryIndicators.filter((m) => !m.achieved);
        if (unachieved.length === 0) {
            return 'Ready to level up! Complete a few more exercises to advance.';
        }
        return `Focus on: ${unachieved.map((m) => m.indicator).join(', ')}`;
    };

    return (
        <div className="space-y-6">
            {/* Overall Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Your Analytical Skill Progression
                    </CardTitle>
                    <CardDescription>
                        Track your growth across 8 core analytical thinking skills
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {skills.map((skill) => (
                        <div key={skill.category} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">{getSkillName(skill.category)}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {getLevelRequirements(skill.level)}
                                    </p>
                                </div>
                                <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Experience</span>
                                    <span>{skill.experience}/100</span>
                                </div>
                                <Progress value={skill.experience} className="h-2" />
                            </div>

                            {/* Mastery Indicators */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Mastery Indicators:</p>
                                {skill.masteryIndicators.map((indicator, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        {indicator.achieved ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                                        )}
                                        <span className={indicator.achieved ? 'text-green-600 dark:text-green-400' : ''}>
                                            {indicator.indicator}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Weaknesses */}
                            {skill.weaknesses.length > 0 && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Areas to Improve:
                                    </p>
                                    <ul className="text-sm space-y-1">
                                        {skill.weaknesses.map((weakness, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recent Mistakes */}
                            {skill.recentMistakes.length > 0 && (
                                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-sm font-medium mb-1">Recent Mistakes:</p>
                                    <ul className="text-sm space-y-1">
                                        {skill.recentMistakes.map((mistake, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span>•</span>
                                                <span>{mistake}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Next Level Guidance */}
                            <Alert>
                                <Lightbulb className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>To reach {skill.level === 'novice' ? 'intermediate' : skill.level === 'intermediate' ? 'advanced' : 'expert'}:</strong>{' '}
                                    {getNextLevelGuidance(skill)}
                                </AlertDescription>
                            </Alert>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Failure Patterns */}
            {failurePatterns.length > 0 && (
                <Card className="border-2 border-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            Detected Failure Patterns
                        </CardTitle>
                        <CardDescription>
                            You're making the same mistakes repeatedly - let's fix these habits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {failurePatterns.map((pattern) => (
                            <div key={pattern.id} className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold">{pattern.description}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Related to: {getSkillName(pattern.relatedSkill)}
                                        </p>
                                    </div>
                                    <Badge variant="destructive">{pattern.occurrences}x</Badge>
                                </div>

                                <Alert className="bg-blue-50 dark:bg-blue-950">
                                    <Target className="h-4 w-4" />
                                    <AlertDescription>
                                        <strong>Suggested Focus:</strong> {pattern.suggestedFocus}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Learning Philosophy */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Growth Mindset Reminder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <strong>Mistakes are data.</strong> Every error teaches you what NOT to do. Senior analysts
                        have made thousands of mistakes - they just learned from them.
                    </p>
                    <p>
                        <strong>Progression is non-linear.</strong> You'll plateau, then suddenly breakthrough. Keep
                        practicing the fundamentals.
                    </p>
                    <p>
                        <strong>Mastery = automatic checking.</strong> When you automatically check for confounders,
                        data leakage, and assumptions, you've reached expert level.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
