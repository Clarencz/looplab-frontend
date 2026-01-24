// Math & Logic Workspace - Revolutionary Learning
// Refactored into modular components for better maintainability

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Lightbulb, TrendingUp, Zap, Eye } from 'lucide-react';
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces';

// Local components
import { MathWorkspaceHeader } from './MathWorkspaceHeader';

// Tab components
import { AdversarialTab } from './tabs/AdversarialTab';
import { BreakthroughTab } from './tabs/BreakthroughTab';
import { ParadoxTab } from './tabs/ParadoxTab';
import { RealWorldTab } from './tabs/RealWorldTab';
import { InteractiveTab } from './tabs/InteractiveTab';

export default function MathWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
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
            <MathWorkspaceHeader
                project={project}
                category={category}
                score={score}
            />

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
                            <AdversarialTab onComplete={handleErrorHuntComplete} />
                        </TabsContent>

                        {/* 2. BREAKTHROUGH: Build It Yourself */}
                        <TabsContent value="breakthrough" className="h-full m-0">
                            <BreakthroughTab onComplete={handleBuilderComplete} />
                        </TabsContent>

                        {/* 3. PARADOX: Challenge Intuition */}
                        <TabsContent value="paradox" className="h-full m-0 p-4">
                            <ParadoxTab />
                        </TabsContent>

                        {/* 4. REAL-WORLD: Why It Matters */}
                        <TabsContent value="real-world" className="h-full m-0 p-4">
                            <RealWorldTab />
                        </TabsContent>

                        {/* 5. INTERACTIVE: Superior Visualization */}
                        <TabsContent value="interactive" className="h-full m-0 p-4">
                            <InteractiveTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
