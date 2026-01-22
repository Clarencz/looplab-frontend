import { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/workspace/CodeEditor';
import AlgorithmVisualizationPanel, { ExecutionState } from '@/components/algorithm/AlgorithmVisualizationPanel';
import ExecutionControls from '@/components/algorithm/ExecutionControls';
import PerformanceMetricsPanel, { PerformanceMetrics } from '@/components/algorithm/PerformanceMetricsPanel';
import { CodeExecutionEngine, generateBinarySearchSteps } from '@/lib/algorithm/ExecutionEngine';
import { Card } from '@/components/ui/card';

export interface AlgorithmWorkspaceProps {
    projectId: string;
    projectName: string;
    files: any[];
    onFilesChange: (files: any[]) => void;
}

export default function AlgorithmWorkspace({
    projectId,
    projectName,
    files,
    onFilesChange,
}: AlgorithmWorkspaceProps) {
    const [executionEngine] = useState(() => new CodeExecutionEngine());
    const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [openTabs, setOpenTabs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // Initialize with demo data (Binary Search example)
    useEffect(() => {
        // Generate demo execution steps for binary search
        const demoArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        const demoTarget = 13;
        const steps = generateBinarySearchSteps(demoArray, demoTarget);

        executionEngine.loadSteps(steps);
        setExecutionState(executionEngine.getCurrentState());

        // Set demo metrics
        setMetrics({
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(1)',
            operationsCount: steps.length,
            executionTime: 2.5,
            memoryUsed: 1024,
        });
    }, [executionEngine]);

    const handlePlay = () => {
        setIsPlaying(true);

        const interval = setInterval(() => {
            const newState = executionEngine.step();
            if (newState) {
                setExecutionState(newState);
            } else {
                setIsPlaying(false);
                clearInterval(interval);
            }
        }, 1000 / speed);

        return () => clearInterval(interval);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleStep = () => {
        const newState = executionEngine.step();
        if (newState) {
            setExecutionState(newState);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        const newState = executionEngine.reset();
        setExecutionState(newState);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    };

    const handleContentChange = (path: string, content: string) => {
        // Update file content
        // TODO: Implement file update logic
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b p-4">
                <h1 className="text-xl font-bold">{projectName}</h1>
                <p className="text-sm text-muted-foreground">Algorithm Visualization Workspace</p>
            </div>

            {/* Execution Controls */}
            <ExecutionControls
                isPlaying={isPlaying}
                speed={speed}
                onPlay={handlePlay}
                onPause={handlePause}
                onStep={handleStep}
                onReset={handleReset}
                onSpeedChange={handleSpeedChange}
                canStep={executionEngine.canStep()}
                canReset={executionEngine.canReset()}
            />

            {/* Main Content */}
            <div className="flex-1 min-h-0">
                <ResizablePanelGroup direction="horizontal">
                    {/* Left: Code Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <CodeEditor
                            tabs={openTabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            onTabClose={(path) => {
                                setOpenTabs(prev => prev.filter(t => t.path !== path));
                            }}
                            onContentChange={handleContentChange}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle className="bg-border w-1" />

                    {/* Right: Visualization & Metrics */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col">
                            {/* Visualization Panel */}
                            <div className="flex-1 min-h-0 p-4">
                                <AlgorithmVisualizationPanel
                                    executionState={executionState}
                                    isPlaying={isPlaying}
                                    speed={speed}
                                />
                            </div>

                            {/* Performance Metrics */}
                            <div className="p-4 border-t">
                                <PerformanceMetricsPanel metrics={metrics} />
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Instructions Card (Optional) */}
            <Card className="m-4 p-4 bg-muted/30">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <p className="text-sm text-muted-foreground">
                    Use the controls above to step through the algorithm. Watch the visualization to understand how binary search works!
                </p>
            </Card>
        </div>
    );
}
