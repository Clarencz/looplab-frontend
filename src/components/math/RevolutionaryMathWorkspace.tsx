import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Lightbulb, TrendingUp, Zap, Eye } from 'lucide-react';
import ErrorHuntingWorkspace from '@/components/math/ErrorHuntingWorkspace';
import GeometricBuilder from '@/components/math/GeometricBuilder';
import InteractiveParabola from '@/components/math/InteractiveParabola';
import { quadraticExpansionProblem } from '@/lib/math/demoProblems';

export interface RevolutionaryMathWorkspaceProps {
    projectName?: string;
    lessonType?: 'quadratic-expansion' | 'parabola-exploration' | 'custom';
}

export default function RevolutionaryMathWorkspace({
    projectName = 'Quadratic Expansion Challenge',
    lessonType = 'quadratic-expansion',
}: RevolutionaryMathWorkspaceProps) {
    const [activeTab, setActiveTab] = useState('adversarial');
    const [score, setScore] = useState(0);

    const handleErrorHuntComplete = (finalScore: number) => {
        setScore(finalScore);
        setActiveTab('breakthrough');
    };

    const handleBuilderComplete = () => {
        setActiveTab('interactive');
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{projectName}</h1>
                        <p className="text-sm text-muted-foreground">
                            Revolutionary Math Learning: Challenge the Norm
                        </p>
                    </div>
                    {score > 0 && (
                        <Badge variant="default" className="text-lg px-4 py-2">
                            Score: {score.toFixed(0)}%
                        </Badge>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="border-b px-4">
                        <TabsList className="grid w-full grid-cols-5 max-w-4xl">
                            <TabsTrigger value="adversarial" className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                <span className="hidden sm:inline">Adversarial</span>
                            </TabsTrigger>
                            <TabsTrigger value="breakthrough" className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                <span className="hidden sm:inline">Breakthrough</span>
                            </TabsTrigger>
                            <TabsTrigger value="paradox" className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                <span className="hidden sm:inline">Paradox</span>
                            </TabsTrigger>
                            <TabsTrigger value="real-world" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                <span className="hidden sm:inline">Real-World</span>
                            </TabsTrigger>
                            <TabsTrigger value="interactive" className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Interactive</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {/* 1. ADVERSARIAL: Find What's Wrong */}
                        <TabsContent value="adversarial" className="h-full m-0">
                            <ErrorHuntingWorkspace
                                problem={quadraticExpansionProblem}
                                onComplete={handleErrorHuntComplete}
                            />
                        </TabsContent>

                        {/* 2. BREAKTHROUGH: Build It Yourself */}
                        <TabsContent value="breakthrough" className="h-full m-0">
                            <GeometricBuilder
                                a={5}
                                b={3}
                                onComplete={handleBuilderComplete}
                            />
                        </TabsContent>

                        {/* 3. PARADOX: Challenge Intuition */}
                        <TabsContent value="paradox" className="h-full m-0 p-4">
                            <div className="max-w-4xl mx-auto space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            The Missing 12 Paradox
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <p className="font-semibold mb-2">The Setup:</p>
                                            <p className="text-sm">
                                                If (a + b)² = a² + b², then let's test with a = 3, b = 2:
                                            </p>
                                            <div className="mt-4 space-y-2 text-sm">
                                                <p>(3 + 2)² should equal 3² + 2²</p>
                                                <p>5² should equal 9 + 4</p>
                                                <p className="text-lg font-bold text-destructive">25 should equal 13</p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-600/20">
                                            <p className="font-semibold text-yellow-600 mb-2">The Paradox:</p>
                                            <p className="text-sm">
                                                But 25 ≠ 13! There's a difference of 12.
                                            </p>
                                            <p className="text-sm mt-2">
                                                <strong>Where did the 12 go?</strong>
                                            </p>
                                        </div>

                                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-600/20">
                                            <p className="font-semibold text-green-600 mb-2">The Revelation:</p>
                                            <p className="text-sm">
                                                The missing 12 is the <strong>2ab term</strong>!
                                            </p>
                                            <p className="text-sm mt-2">
                                                2ab = 2 × 3 × 2 = 12
                                            </p>
                                            <p className="text-sm mt-2">
                                                The correct formula: (a+b)² = a² + <span className="text-green-600 font-bold">2ab</span> + b²
                                            </p>
                                            <p className="text-sm mt-2">
                                                = 9 + <span className="text-green-600 font-bold">12</span> + 4 = 25 ✓
                                            </p>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <p className="font-semibold mb-2">Try It Yourself:</p>
                                            <p className="text-sm">
                                                Pick any two numbers. Calculate (a+b)² and a²+b².
                                                How much are they different by? It's always 2ab!
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* 4. REAL-WORLD: Why It Matters */}
                        <TabsContent value="real-world" className="h-full m-0 p-4">
                            <div className="max-w-4xl mx-auto space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-500" />
                                            The Fence Optimization Problem
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                            <p className="font-semibold mb-2">The Real Problem:</p>
                                            <p className="text-sm">
                                                You have 100 meters of fence. You want to build a rectangular garden.
                                            </p>
                                            <p className="text-sm mt-2 font-semibold">
                                                What dimensions give you the MOST area?
                                            </p>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg space-y-2">
                                            <p className="font-semibold">The Math:</p>
                                            <div className="text-sm space-y-1">
                                                <p>Let width = x</p>
                                                <p>Then length = (100 - 2x) / 2 = 50 - x</p>
                                                <p className="mt-2">Area = x(50 - x) = 50x - x²</p>
                                                <p className="mt-2 font-semibold text-primary">
                                                    This is a QUADRATIC! We need to find its maximum.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                            <p className="font-semibold text-green-600 mb-2">Completing the Square:</p>
                                            <div className="text-sm space-y-1">
                                                <p>A = -(x² - 50x)</p>
                                                <p>A = -(x² - 50x + 625 - 625)</p>
                                                <p>A = -(x - 25)² + 625</p>
                                                <p className="mt-2 font-semibold">
                                                    Maximum when (x - 25)² = 0, so x = 25
                                                </p>
                                                <p className="mt-2 text-green-600 font-bold">
                                                    The optimal garden is a 25×25 SQUARE!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <p className="font-semibold mb-2">Why This Matters:</p>
                                            <p className="text-sm">
                                                Understanding (a+b)² and completing the square lets you:
                                            </p>
                                            <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                                                <li>Optimize real-world problems (fencing, packaging, etc.)</li>
                                                <li>Find maximum/minimum values without calculus</li>
                                                <li>Understand why squares are often optimal shapes</li>
                                                <li>Solve physics problems (projectile motion, etc.)</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* 5. INTERACTIVE: Superior Visualization */}
                        <TabsContent value="interactive" className="h-full m-0 p-4">
                            <div className="h-full max-w-6xl mx-auto">
                                <InteractiveParabola initialA={1} initialB={-4} initialC={3} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
