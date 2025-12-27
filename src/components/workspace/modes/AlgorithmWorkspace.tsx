/**
 * AlgorithmWorkspace - Step-through algorithm visualization
 * 
 * Features:
 * - Code editor with syntax highlighting
 * - Step-by-step execution
 * - Data structure visualization
 * - Variable inspection
 * - Playback controls
 */

import { useState, useCallback, useEffect } from 'react';
import { WorkspaceModeProps } from '../../types';
import { AlgorithmState, ExecutionStep } from './types';
import CodeEditor from '@/components/workspace/CodeEditor';
import { StepControls } from './components/StepControls';
import { VisualizationPanel } from './components/VisualizationPanel';
import { VariableInspector } from './components/VariableInspector';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { toast } from 'sonner';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export default function AlgorithmWorkspace({ projectId, project, category }: WorkspaceModeProps) {
    const [state, setState] = useState<AlgorithmState>({
        code: getDefaultCode(),
        executionTrace: [],
        currentStep: 0,
        isExecuting: false,
        isPaused: false,
        variables: {},
    });

    const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

    // Execute code and generate trace
    const handleExecute = useCallback(async () => {
        toast.info('Generating execution trace...');

        try {
            // TODO: Call backend to execute and get trace
            // For now, generate mock trace
            const mockTrace = generateMockTrace(state.code);

            setState(prev => ({
                ...prev,
                executionTrace: mockTrace,
                currentStep: 0,
                variables: mockTrace[0]?.variables || {},
            }));

            toast.success('Execution trace generated');
        } catch (error) {
            toast.error('Failed to execute code');
        }
    }, [state.code]);

    // Step forward
    const handleStepForward = useCallback(() => {
        setState(prev => {
            if (prev.currentStep >= prev.executionTrace.length - 1) return prev;

            const nextStep = prev.currentStep + 1;
            const step = prev.executionTrace[nextStep];

            return {
                ...prev,
                currentStep: nextStep,
                variables: step?.variables || prev.variables,
            };
        });
    }, []);

    // Step backward
    const handleStepBackward = useCallback(() => {
        setState(prev => {
            if (prev.currentStep <= 0) return prev;

            const prevStep = prev.currentStep - 1;
            const step = prev.executionTrace[prevStep];

            return {
                ...prev,
                currentStep: prevStep,
                variables: step?.variables || prev.variables,
            };
        });
    }, []);

    // Play execution
    const handlePlay = useCallback(() => {
        setState(prev => ({ ...prev, isExecuting: true, isPaused: false }));

        const interval = setInterval(() => {
            setState(prev => {
                if (prev.currentStep >= prev.executionTrace.length - 1) {
                    clearInterval(interval);
                    return { ...prev, isExecuting: false };
                }

                const nextStep = prev.currentStep + 1;
                const step = prev.executionTrace[nextStep];

                return {
                    ...prev,
                    currentStep: nextStep,
                    variables: step?.variables || prev.variables,
                };
            });
        }, 1000); // 1 second per step

        setPlaybackInterval(interval);
    }, []);

    // Pause execution
    const handlePause = useCallback(() => {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            setPlaybackInterval(null);
        }
        setState(prev => ({ ...prev, isExecuting: false, isPaused: true }));
    }, [playbackInterval]);

    // Reset to start
    const handleReset = useCallback(() => {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            setPlaybackInterval(null);
        }
        setState(prev => ({
            ...prev,
            currentStep: 0,
            isExecuting: false,
            isPaused: false,
            variables: prev.executionTrace[0]?.variables || {},
        }));
    }, [playbackInterval]);

    // Run to end
    const handleRunToEnd = useCallback(() => {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            setPlaybackInterval(null);
        }
        setState(prev => {
            const lastStep = prev.executionTrace.length - 1;
            const step = prev.executionTrace[lastStep];

            return {
                ...prev,
                currentStep: lastStep,
                isExecuting: false,
                variables: step?.variables || prev.variables,
            };
        });
    }, [playbackInterval]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (playbackInterval) {
                clearInterval(playbackInterval);
            }
        };
    }, [playbackInterval]);

    const currentVisualization = state.executionTrace[state.currentStep]?.visualization;

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-lg font-semibold">Algorithm Visualizer</h2>
                <Button onClick={handleExecute} className="gap-2">
                    <Play className="h-4 w-4" />
                    Execute & Visualize
                </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    {/* Code editor */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <div className="h-full flex flex-col">
                            <div className="px-4 py-2 border-b border-border bg-muted/30">
                                <h3 className="text-sm font-semibold">Code</h3>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CodeEditor
                                    value={state.code}
                                    onChange={(value) => setState(prev => ({ ...prev, code: value || '' }))}
                                    language="python"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Visualization and variables */}
                    <ResizablePanel defaultSize={60} minSize={40}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Visualization */}
                            <ResizablePanel defaultSize={70} minSize={50}>
                                <div className="h-full p-4">
                                    <VisualizationPanel
                                        visualization={currentVisualization}
                                        currentStep={state.currentStep}
                                    />
                                </div>
                            </ResizablePanel>

                            <ResizableHandle />

                            {/* Variables */}
                            <ResizablePanel defaultSize={30} minSize={20}>
                                <div className="h-full border-t border-border overflow-auto">
                                    <VariableInspector variables={state.variables} />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Step controls */}
            <StepControls
                currentStep={state.currentStep}
                totalSteps={state.executionTrace.length}
                isExecuting={state.isExecuting}
                isPaused={state.isPaused}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                onRunToEnd={handleRunToEnd}
            />
        </div>
    );
}

// Default code template
function getDefaultCode(): string {
    return `# Bubble Sort Algorithm
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the algorithm
data = [64, 34, 25, 12, 22, 11, 90]
result = bubble_sort(data)
print("Sorted array:", result)
`;
}

// Generate mock execution trace
function generateMockTrace(code: string): ExecutionStep[] {
    // TODO: Replace with actual backend trace generation
    const mockData = [64, 34, 25, 12, 22];

    return [
        {
            line: 1,
            variables: { arr: mockData, i: 0, j: 0 },
            visualization: {
                type: 'array',
                data: mockData,
                highlighted: [0, 1],
            },
            description: 'Starting bubble sort',
        },
        {
            line: 3,
            variables: { arr: [34, 64, 25, 12, 22], i: 0, j: 1 },
            visualization: {
                type: 'array',
                data: [34, 64, 25, 12, 22],
                highlighted: [1, 2],
            },
            description: 'Swapped 64 and 34',
        },
        {
            line: 3,
            variables: { arr: [34, 25, 64, 12, 22], i: 0, j: 2 },
            visualization: {
                type: 'array',
                data: [34, 25, 64, 12, 22],
                highlighted: [2, 3],
            },
            description: 'Swapped 64 and 25',
        },
        {
            line: 3,
            variables: { arr: [34, 25, 12, 64, 22], i: 0, j: 3 },
            visualization: {
                type: 'array',
                data: [34, 25, 12, 64, 22],
                highlighted: [3, 4],
            },
            description: 'Swapped 64 and 12',
        },
        {
            line: 3,
            variables: { arr: [34, 25, 12, 22, 64], i: 0, j: 4 },
            visualization: {
                type: 'array',
                data: [34, 25, 12, 22, 64],
                highlighted: [],
            },
            description: 'First pass complete',
        },
    ];
}
