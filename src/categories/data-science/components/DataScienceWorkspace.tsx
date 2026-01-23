import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThinkingCanvas, ThinkingCanvasData } from '@/components/datascience/ThinkingCanvas';
import { VariableMindMap } from '@/components/datascience/VariableMindMap';
import { SocraticDialogue } from '@/components/datascience/SocraticDialogue';
import { MissingDataSimulator } from '@/components/datascience/MissingDataSimulator';
import { FeatureEngineeringJustifier } from '@/components/datascience/FeatureEngineeringJustifier';
import { StatisticalTestingValidator } from '@/components/datascience/StatisticalTestingValidator';
import { VisualizationStrategyPlanner } from '@/components/datascience/VisualizationStrategyPlanner';
import { BusinessRecommendationFramework } from '@/components/datascience/BusinessRecommendationFramework';
import { AnalyticalTrapsSystem } from '@/components/datascience/AnalyticalTrapsSystem';
import { SkillProgressionTracker } from '@/components/datascience/SkillProgressionTracker';
import { StakeholderSimulation } from '@/components/datascience/StakeholderSimulation';
import { LogicQualityGrader } from '@/components/datascience/LogicQualityGrader';
import { ComprehensiveFeedbackSystem } from '@/components/datascience/ComprehensiveFeedbackSystem';
import { Brain, Network, MessageCircle, TrendingUp, AlertCircle, Database, Wrench, BarChart3, Target, Skull, Award, Users, ArrowLeft } from 'lucide-react';

export default function DataScienceWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('thinking');
    const [thinkingData, setThinkingData] = useState<ThinkingCanvasData>({
        problemStatement: '',
        hypotheses: [],
        decisionLog: [],
        logicJournal: [],
    });

    const [whyQuestionCount, setWhyQuestionCount] = useState(0);
    const [avgReasoningScore, setAvgReasoningScore] = useState(0);

    const handleThinkingUpdate = (data: ThinkingCanvasData) => {
        setThinkingData(data);
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {category?.name || 'Data Science & Analytics'}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-full px-4 sm:px-6 lg:px-8 py-6">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">Analytical Thinking Workspace</h1>
                                <p className="text-muted-foreground mt-2">
                                    Learn to think like a senior data analyst. Focus on methodology, not tools.
                                </p>
                            </div>
                        </div>

                        {/* Scenario Card */}
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
                    </div>

                    {/* Main Workspace */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                            <TabsTrigger value="thinking" className="flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                Thinking
                            </TabsTrigger>
                            <TabsTrigger value="variables" className="flex items-center gap-2">
                                <Network className="h-4 w-4" />
                                Variables
                            </TabsTrigger>
                            <TabsTrigger value="dialogue" className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Dialogue
                            </TabsTrigger>
                            <TabsTrigger value="data" className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Data
                            </TabsTrigger>
                            <TabsTrigger value="analysis" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Analysis
                            </TabsTrigger>
                            <TabsTrigger value="learning" className="flex items-center gap-2">
                                <Skull className="h-4 w-4" />
                                Traps
                            </TabsTrigger>
                            <TabsTrigger value="assessment" className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Grade
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="thinking" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <ThinkingCanvas
                                        initialData={thinkingData}
                                        onUpdate={handleThinkingUpdate}
                                    />
                                </div>

                                {/* Guidance Panel */}
                                <div>
                                    <Card className="sticky top-24">
                                        <CardHeader>
                                            <CardTitle className="text-sm">Thinking Guide</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-sm">
                                            <div>
                                                <h4 className="font-semibold mb-2">1. Decompose the Problem</h4>
                                                <p className="text-muted-foreground">
                                                    Break down the stakeholder's claim into testable components.
                                                    Identify hidden assumptions.
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">2. Generate Hypotheses</h4>
                                                <p className="text-muted-foreground">
                                                    List ALL possible explanations, not just the obvious one.
                                                    Score each by testability and impact.
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">3. Think Causally</h4>
                                                <p className="text-muted-foreground">
                                                    Correlation ≠ Causation. What confounding variables exist?
                                                    How will you isolate the effect?
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <Badge variant="outline" className="mb-2">
                                                    💡 Pro Tip
                                                </Badge>
                                                <p className="text-muted-foreground">
                                                    The best analysts question everything, especially their own assumptions.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="variables" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <VariableMindMap />
                                </div>

                                {/* Variable Mapping Guide */}
                                <div>
                                    <Card className="sticky top-24">
                                        <CardHeader>
                                            <CardTitle className="text-sm">Mapping Guide</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-sm">
                                            <div>
                                                <h4 className="font-semibold mb-2">Variable Types</h4>
                                                <ul className="space-y-2 text-muted-foreground">
                                                    <li><strong>Independent:</strong> What you're testing (e.g., Price)</li>
                                                    <li><strong>Dependent:</strong> What you're measuring (e.g., Churn)</li>
                                                    <li><strong>Confounding:</strong> Hidden causes affecting both</li>
                                                    <li><strong>Mediating:</strong> Variables in the causal chain</li>
                                                    <li><strong>Moderating:</strong> Conditions that change the effect</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Common Pitfalls</h4>
                                                <ul className="space-y-2 text-muted-foreground">
                                                    <li>• Missing confounders (e.g., service quality)</li>
                                                    <li>• Circular dependencies</li>
                                                    <li>• Reverse causation</li>
                                                    <li>• Simpson's Paradox</li>
                                                </ul>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <Badge variant="outline" className="mb-2">
                                                    ⚠️ Remember
                                                </Badge>
                                                <p className="text-muted-foreground">
                                                    Every relationship you draw must be justified with logic or evidence.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="dialogue" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <SocraticDialogue
                                        context={{
                                            problemStatement: thinkingData.problemStatement,
                                            hypotheses: thinkingData.hypotheses,
                                        }}
                                        onResponse={(response) => {
                                            setWhyQuestionCount((prev) => prev + 1);
                                            if (response.aiEvaluation) {
                                                const score =
                                                    (response.aiEvaluation.logicScore +
                                                        response.aiEvaluation.completeness +
                                                        response.aiEvaluation.justificationDepth) /
                                                    3;
                                                setAvgReasoningScore(Math.round(score));
                                            }
                                        }}
                                    />
                                </div>

                                {/* Dialogue Guide */}
                                <div>
                                    <Card className="sticky top-24">
                                        <CardHeader>
                                            <CardTitle className="text-sm">Dialogue Guide</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-sm">
                                            <div>
                                                <h4 className="font-semibold mb-2">What We Evaluate</h4>
                                                <ul className="space-y-2 text-muted-foreground">
                                                    <li><strong>Logic Score:</strong> Soundness of reasoning</li>
                                                    <li><strong>Completeness:</strong> Consideration of alternatives</li>
                                                    <li><strong>Depth:</strong> Justification quality</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Strong Responses Include</h4>
                                                <ul className="space-y-2 text-muted-foreground">
                                                    <li>• Clear reasoning with "because"</li>
                                                    <li>• Alternative explanations</li>
                                                    <li>• Evidence or data references</li>
                                                    <li>• Edge case consideration</li>
                                                    <li>• Assumption acknowledgment</li>
                                                </ul>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <Badge variant="outline" className="mb-2">
                                                    🎯 Goal
                                                </Badge>
                                                <p className="text-muted-foreground">
                                                    Answer 20+ "why" questions per project. Deep thinking takes time.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Phase 4: Data Strategy */}
                        <TabsContent value="data" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <MissingDataSimulator />
                                <FeatureEngineeringJustifier />
                            </div>
                        </TabsContent>

                        {/* Phase 4: Analysis & Recommendations */}
                        <TabsContent value="analysis" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <StatisticalTestingValidator />
                                <VisualizationStrategyPlanner />
                                <BusinessRecommendationFramework />
                            </div>
                        </TabsContent>

                        {/* Phase 5: Learning Mechanics */}
                        <TabsContent value="learning" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <AnalyticalTrapsSystem />
                                </div>
                                <div className="space-y-6">
                                    <SkillProgressionTracker />
                                    <StakeholderSimulation />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Phase 6: Assessment & Feedback */}
                        <TabsContent value="assessment" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <LogicQualityGrader studentWork={thinkingData} />
                                <ComprehensiveFeedbackSystem studentWork={thinkingData} />
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Progress Footer */}
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
                </div>
            </main>
        </div>
    );
}
