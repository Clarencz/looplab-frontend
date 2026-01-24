import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThinkingCanvasData } from '@/components/datascience/ThinkingCanvas';
import { Brain, Network, MessageCircle, Database, BarChart3, Skull, Award } from 'lucide-react';

// Local components
import { DSWorkspaceHeader } from './DSWorkspaceHeader';
import { ScenarioCard } from './ScenarioCard';
import { ProgressFooter } from './ProgressFooter';

// Tab components
import { ThinkingTab } from './tabs/ThinkingTab';
import { VariablesTab } from './tabs/VariablesTab';
import { DialogueTab } from './tabs/DialogueTab';
import { DataTab } from './tabs/DataTab';
import { AnalysisTab } from './tabs/AnalysisTab';
import { LearningTab } from './tabs/LearningTab';
import { AssessmentTab } from './tabs/AssessmentTab';

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
            <DSWorkspaceHeader
                project={project}
                category={category}
                onBack={() => navigate(-1)}
            />

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
                        <ScenarioCard
                            whyQuestionCount={whyQuestionCount}
                            avgReasoningScore={avgReasoningScore}
                        />
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
                            <ThinkingTab
                                thinkingData={thinkingData}
                                onUpdate={handleThinkingUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="variables" className="space-y-6">
                            <VariablesTab />
                        </TabsContent>

                        <TabsContent value="dialogue" className="space-y-6">
                            <DialogueTab
                                problemStatement={thinkingData.problemStatement}
                                hypotheses={thinkingData.hypotheses}
                            />
                        </TabsContent>

                        <TabsContent value="data" className="space-y-6">
                            <DataTab />
                        </TabsContent>

                        <TabsContent value="analysis" className="space-y-6">
                            <AnalysisTab />
                        </TabsContent>

                        <TabsContent value="learning" className="space-y-6">
                            <LearningTab />
                        </TabsContent>

                        <TabsContent value="assessment" className="space-y-6">
                            <AssessmentTab studentWork={thinkingData} />
                        </TabsContent>
                    </Tabs>

                    {/* Progress Footer */}
                    <ProgressFooter
                        thinkingData={thinkingData}
                        whyQuestionCount={whyQuestionCount}
                        avgReasoningScore={avgReasoningScore}
                    />
                </div>
            </main>
        </div>
    );
}
