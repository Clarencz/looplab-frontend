import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

interface VisualizationStep {
    description: string;
    variables: Record<string, any>;
    array?: number[];
    highlightIndices?: number[];
    currentIndex?: number;
    comparisonIndices?: number[];
}

interface AlgorithmVisualizerProps {
    steps: VisualizationStep[];
    title: string;
}

export default function AlgorithmVisualizer({ steps, title }: AlgorithmVisualizerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000); // ms per step

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length, speed]);

    const handlePlay = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const step = steps[currentStep] || steps[0];

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Array Visualization */}
                    {step.array && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Array:</p>
                            <div className="flex gap-2 justify-center items-end h-48">
                                {step.array.map((value, index) => {
                                    const isHighlighted = step.highlightIndices?.includes(index);
                                    const isCurrent = step.currentIndex === index;
                                    const isComparison = step.comparisonIndices?.includes(index);

                                    let bgColor = 'bg-primary/20';
                                    if (isCurrent) bgColor = 'bg-blue-500';
                                    else if (isHighlighted) bgColor = 'bg-green-500';
                                    else if (isComparison) bgColor = 'bg-yellow-500';

                                    return (
                                        <div key={index} className="flex flex-col items-center gap-2">
                                            <div
                                                className={`w-12 ${bgColor} flex items-end justify-center transition-all duration-300`}
                                                style={{ height: `${(value / Math.max(...step.array)) * 150}px` }}
                                            >
                                                <span className="text-white font-bold mb-1">{value}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{index}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Variables */}
                    {step.variables && Object.keys(step.variables).length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">Variables:</p>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(step.variables).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                                        <code className="text-sm font-mono">{key}:</code>
                                        <code className="text-sm font-mono font-bold">
                                            {JSON.stringify(value)}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{step.description}</p>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span>Current</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span>Found/Match</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span>Comparing</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Controls */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Step {currentStep + 1} / {steps.length}</span>
                            <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                            disabled={currentStep === 0}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>
                        {isPlaying ? (
                            <Button size="icon" onClick={handlePause}>
                                <Pause className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button size="icon" onClick={handlePlay}>
                                <Play className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentStep === steps.length - 1}
                        >
                            <SkipForward className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Speed Control */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Speed:</span>
                            <span>{(1000 / speed).toFixed(1)}x</span>
                        </div>
                        <Slider
                            value={[1000 - speed]}
                            onValueChange={([value]) => setSpeed(1000 - value)}
                            min={0}
                            max={900}
                            step={100}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper function to generate visualization steps for Two Sum
export function generateTwoSumSteps(nums: number[], target: number): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const seen = new Map<number, number>();

    steps.push({
        description: `Starting Two Sum algorithm. Looking for two numbers that add up to ${target}.`,
        variables: { target, seen: {} },
        array: nums,
    });

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        steps.push({
            description: `Checking index ${i}: nums[${i}] = ${nums[i]}. Complement needed: ${complement}`,
            variables: {
                i,
                current: nums[i],
                complement,
                seen: Object.fromEntries(seen),
            },
            array: nums,
            currentIndex: i,
        });

        if (seen.has(complement)) {
            const j = seen.get(complement)!;
            steps.push({
                description: `Found! nums[${j}] + nums[${i}] = ${nums[j]} + ${nums[i]} = ${target}`,
                variables: {
                    i,
                    j,
                    result: [j, i],
                },
                array: nums,
                highlightIndices: [j, i],
            });
            break;
        }

        seen.set(nums[i], i);

        steps.push({
            description: `Adding nums[${i}] = ${nums[i]} to seen map at index ${i}`,
            variables: {
                i,
                seen: Object.fromEntries(seen),
            },
            array: nums,
            highlightIndices: Array.from(seen.values()),
        });
    }

    return steps;
}
