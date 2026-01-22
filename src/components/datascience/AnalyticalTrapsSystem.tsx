import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingDown, Users, Target, Skull } from 'lucide-react';

export type AnalyticalTrap = {
    id: string;
    name: string;
    type: 'simpsons_paradox' | 'survivorship_bias' | 'selection_bias' | 'confounding' | 'regression_to_mean' | 'base_rate_fallacy';
    description: string;
    scenario: string;
    misleadingConclusion: string;
    correctConclusion: string;
    howToDetect: string[];
    commonIn: string[];
    severity: 'critical' | 'high' | 'medium';
};

export type TrapDetection = {
    trapId: string;
    detected: boolean;
    detectedAt?: Date;
    studentExplanation?: string;
    correctnessScore: number;
};

interface AnalyticalTrapsSystemProps {
    onTrapDetection?: (detection: TrapDetection) => void;
}

export function AnalyticalTrapsSystem({ onTrapDetection }: AnalyticalTrapsSystemProps) {
    const [activeTrap, setActiveTrap] = useState<AnalyticalTrap | null>(null);
    const [detections, setDetections] = useState<TrapDetection[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [hintLevel, setHintLevel] = useState(0);

    const traps: AnalyticalTrap[] = [
        {
            id: 'simpsons-paradox',
            name: "Simpson's Paradox",
            type: 'simpsons_paradox',
            description: 'A trend appears in different groups but disappears or reverses when groups are combined',
            scenario: `You're analyzing treatment success rates:
            
Hospital A: 90% success rate (900/1000 patients)
Hospital B: 85% success rate (850/1000 patients)

Conclusion: Hospital A is better, right?

BUT when you segment by severity:
- Mild cases: A=95% (950/1000), B=97% (970/1000)
- Severe cases: A=80% (800/1000), B=82% (820/1000)

Hospital B is actually better for BOTH groups!`,
            misleadingConclusion: 'Hospital A has higher overall success rate, so it provides better care',
            correctConclusion: 'Hospital A treats more mild cases. Hospital B is better for both mild AND severe cases.',
            howToDetect: [
                'Always segment your data by potential confounders',
                'Check if trends reverse when you drill down',
                'Look for hidden grouping variables',
                'Compare like-for-like (same severity, same demographics)',
            ],
            commonIn: [
                'Medical treatment comparisons',
                'A/B test results across user segments',
                'University admission rates by department',
                'Baseball batting averages',
            ],
            severity: 'critical',
        },
        {
            id: 'survivorship-bias',
            name: 'Survivorship Bias',
            type: 'survivorship_bias',
            description: 'Focusing on "survivors" while ignoring those who didn\'t make it',
            scenario: `You're analyzing successful startups to find success patterns:

You study 100 successful tech companies and find:
- 80% had charismatic founders
- 70% pivoted at least once
- 60% raised VC funding early

Conclusion: These are the keys to success!

BUT you didn't study the 10,000 failed startups that had the SAME characteristics.`,
            misleadingConclusion: 'Charismatic founders, pivoting, and early VC funding cause success',
            correctConclusion: 'You need to study failed companies too. These traits might be common in BOTH successful and failed startups.',
            howToDetect: [
                'Ask: "Who is missing from this dataset?"',
                'Include failed/churned/inactive cases',
                'Compare survivors vs non-survivors',
                'Check if your sample is representative',
            ],
            commonIn: [
                'Customer retention analysis (ignoring churned customers)',
                'Investment advice (only studying successful investors)',
                'Product feature analysis (only surveying active users)',
                'Historical analysis (only studying winners)',
            ],
            severity: 'critical',
        },
        {
            id: 'selection-bias',
            name: 'Selection Bias',
            type: 'selection_bias',
            description: 'Your sample is not representative of the population',
            scenario: `You want to measure customer satisfaction:

You send a survey to all customers. 20% respond.
Average satisfaction: 8.5/10

Conclusion: Customers are very satisfied!

BUT who responds to surveys? Usually:
- Very happy customers (want to praise)
- Very unhappy customers (want to complain)
- NOT the average customer`,
            misleadingConclusion: 'Average satisfaction is 8.5/10 based on survey responses',
            correctConclusion: 'Survey respondents are not representative. True satisfaction is likely lower (non-responders are often neutral/dissatisfied).',
            howToDetect: [
                'Check response rates and non-response bias',
                'Compare respondents vs non-respondents on known variables',
                'Use random sampling when possible',
                'Weight responses to match population',
            ],
            commonIn: [
                'Survey analysis',
                'Clinical trials (healthy volunteers)',
                'User feedback (vocal minority)',
                'Historical data (missing records)',
            ],
            severity: 'high',
        },
        {
            id: 'confounding',
            name: 'Confounding Variables',
            type: 'confounding',
            description: 'A hidden variable causes both the treatment and outcome',
            scenario: `You find that ice cream sales correlate with drowning deaths.

Correlation: r = 0.85, p < 0.001

Conclusion: Ice cream causes drowning!

BUT the real cause is TEMPERATURE:
- Hot weather → people buy ice cream
- Hot weather → people swim more → more drownings`,
            misleadingConclusion: 'Ice cream sales cause drowning deaths (correlation = causation)',
            correctConclusion: 'Temperature is a confounding variable that causes both. No causal relationship between ice cream and drowning.',
            howToDetect: [
                'Draw a causal diagram (DAG)',
                'Ask: "What else could cause both variables?"',
                'Control for potential confounders',
                'Use randomized experiments when possible',
            ],
            commonIn: [
                'Observational studies',
                'Marketing attribution',
                'Health outcome analysis',
                'Business metric correlations',
            ],
            severity: 'critical',
        },
        {
            id: 'regression-to-mean',
            name: 'Regression to the Mean',
            type: 'regression_to_mean',
            description: 'Extreme values tend to be followed by more average values',
            scenario: `You identify the 10 worst-performing sales reps and give them special training.

Before training: Average sales = $50k
After training: Average sales = $75k

Conclusion: Training increased sales by 50%!

BUT these reps were selected BECAUSE they had an unusually bad month. They would likely improve anyway (regression to mean).`,
            misleadingConclusion: 'Training caused the 50% improvement in sales',
            correctConclusion: 'Improvement is likely due to regression to the mean. Need a control group to measure true training effect.',
            howToDetect: [
                'Use control groups',
                'Don\'t select based on extreme values',
                'Compare to baseline trend',
                'Expect extreme values to moderate',
            ],
            commonIn: [
                'Performance improvement programs',
                'Medical treatments (patients seek help when symptoms are worst)',
                'Sports performance analysis',
                'Quality improvement initiatives',
            ],
            severity: 'high',
        },
        {
            id: 'base-rate-fallacy',
            name: 'Base Rate Fallacy',
            type: 'base_rate_fallacy',
            description: 'Ignoring the baseline probability when evaluating evidence',
            scenario: `A fraud detection model is 95% accurate.
It flags a transaction as fraudulent.

Conclusion: 95% chance this is fraud!

BUT if only 0.1% of transactions are actually fraudulent:
- True positives: 0.1% × 95% = 0.095%
- False positives: 99.9% × 5% = 4.995%
- Probability of fraud given flag: 0.095% / (0.095% + 4.995%) = 1.9%

Only 1.9% chance of actual fraud!`,
            misleadingConclusion: '95% accuracy means 95% chance of fraud when flagged',
            correctConclusion: 'With low base rate (0.1%), most flags are false positives. Only 1.9% of flagged transactions are actually fraudulent.',
            howToDetect: [
                'Always consider base rates',
                'Use Bayes\' theorem',
                'Calculate positive predictive value (PPV)',
                'Don\'t confuse sensitivity with PPV',
            ],
            commonIn: [
                'Medical diagnosis (rare diseases)',
                'Fraud detection',
                'Spam filtering',
                'Predictive models with imbalanced data',
            ],
            severity: 'high',
        },
    ];

    const loadRandomTrap = () => {
        const randomTrap = traps[Math.floor(Math.random() * traps.length)];
        setActiveTrap(randomTrap);
        setShowHint(false);
        setHintLevel(0);
    };

    const getProgressiveHints = (trap: AnalyticalTrap): string[] => {
        const hints: { [key: string]: string[] } = {
            'simpsons_paradox': [
                '🤔 Have you tried breaking down the data by different groups?',
                '💡 What if Hospital A treats more easy cases and Hospital B treats more difficult cases?',
                '🎯 Try calculating success rates separately for mild vs severe patients',
            ],
            'survivorship_bias': [
                '🤔 Who is missing from this analysis?',
                '💡 What about the startups that failed? Did they have these same characteristics?',
                '🎯 You need to study BOTH successful and failed companies to find true patterns',
            ],
            'selection_bias': [
                '🤔 Who chose to respond to the survey?',
                '💡 Are survey respondents representative of all customers?',
                '🎯 Non-responders are often neutral or dissatisfied - they\'re missing from your data',
            ],
            'confounding': [
                '🤔 Is there a third variable that could cause both?',
                '💡 What seasonal factor affects both ice cream sales and swimming?',
                '🎯 Temperature is the confounding variable - it causes both ice cream sales and drownings',
            ],
            'regression_to_mean': [
                '🤔 Why were these reps selected for training?',
                '💡 If you select people BECAUSE they had a bad month, what happens next month?',
                '🎯 Extreme values naturally move toward the average - you need a control group',
            ],
            'base_rate_fallacy': [
                '🤔 How common is fraud in general?',
                '💡 If fraud is very rare (0.1%), what happens to false positives?',
                '🎯 With low base rates, most positive predictions are false positives - use Bayes\' theorem',
            ],
        };

        return hints[trap.type] || [];
    };

    const showNextHint = () => {
        if (activeTrap && hintLevel < getProgressiveHints(activeTrap).length) {
            setHintLevel(hintLevel + 1);
            setShowHint(true);
        }
    };

    const getSeverityColor = (severity: AnalyticalTrap['severity']) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500';
            case 'high':
                return 'bg-orange-500';
            case 'medium':
                return 'bg-yellow-500';
        }
    };

    useEffect(() => {
        loadRandomTrap();
    }, []);

    return (
        <div className="space-y-6">
            {/* Trap Introduction */}
            <Card className="border-2 border-red-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Skull className="h-5 w-5 text-red-500" />
                        Analytical Trap Detected
                    </CardTitle>
                    <CardDescription>
                        This scenario contains a common analytical mistake. Can you spot it?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeTrap && (
                        <>
                            <div className="flex items-center gap-2">
                                <Badge className={getSeverityColor(activeTrap.severity)}>
                                    {activeTrap.severity} severity
                                </Badge>
                                <Badge variant="outline">{activeTrap.name}</Badge>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">Scenario:</h4>
                                <pre className="text-sm whitespace-pre-wrap font-sans">
                                    {activeTrap.scenario}
                                </pre>
                            </div>

                            <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription>
                                    <strong>Common (Wrong) Conclusion:</strong>
                                    <p className="mt-1">{activeTrap.misleadingConclusion}</p>
                                </AlertDescription>
                            </Alert>

                            {/* Progressive Hints */}
                            {showHint && hintLevel > 0 && (
                                <div className="space-y-2">
                                    {getProgressiveHints(activeTrap)
                                        .slice(0, hintLevel)
                                        .map((hint, i) => (
                                            <Alert key={i} className="bg-blue-50 dark:bg-blue-950">
                                                <AlertDescription>{hint}</AlertDescription>
                                            </Alert>
                                        ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={showNextHint}
                                    variant="outline"
                                    disabled={hintLevel >= getProgressiveHints(activeTrap).length}
                                >
                                    Show Hint ({hintLevel}/{getProgressiveHints(activeTrap).length})
                                </Button>
                                <Button onClick={() => setShowHint(!showHint)} variant="outline">
                                    {showHint ? 'Hide' : 'Reveal'} Solution
                                </Button>
                                <Button onClick={loadRandomTrap}>Try Another Trap</Button>
                            </div>

                            {/* Solution */}
                            {showHint && hintLevel >= getProgressiveHints(activeTrap).length && (
                                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                                        ✓ Correct Analysis:
                                    </h4>
                                    <p className="text-sm mb-3">{activeTrap.correctConclusion}</p>

                                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                                        How to Detect This Trap:
                                    </h4>
                                    <ul className="space-y-1 text-sm">
                                        {activeTrap.howToDetect.map((method, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-green-600">•</span>
                                                <span>{method}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4 className="font-semibold mb-2 mt-3 text-green-700 dark:text-green-300">
                                        Common In:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeTrap.commonIn.map((area, i) => (
                                            <Badge key={i} variant="outline">
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Trap Library */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">All Analytical Traps</CardTitle>
                    <CardDescription>Master these to become a senior analyst</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {traps.map((trap) => (
                        <div
                            key={trap.id}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => {
                                setActiveTrap(trap);
                                setShowHint(false);
                                setHintLevel(0);
                            }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">{trap.name}</h4>
                                <Badge className={getSeverityColor(trap.severity)} variant="outline">
                                    {trap.severity}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{trap.description}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Learning Reminder */}
            <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                    <strong>Learning Goal:</strong> These traps appear in REAL analysis all the time. Senior analysts
                    know to check for them automatically. Practice until checking becomes second nature.
                </AlertDescription>
            </Alert>
        </div>
    );
}
