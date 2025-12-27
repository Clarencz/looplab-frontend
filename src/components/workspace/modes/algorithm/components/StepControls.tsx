import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { StepControlsProps } from '../types';

export function StepControls({
    currentStep,
    totalSteps,
    isExecuting,
    isPaused,
    onStepForward,
    onStepBackward,
    onPlay,
    onPause,
    onReset,
    onRunToEnd,
}: StepControlsProps) {
    return (
        <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 py-3 space-y-3">
                {/* Progress slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </span>
                        <span className="text-muted-foreground">
                            {totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0}%
                        </span>
                    </div>
                    <Slider
                        value={[currentStep]}
                        max={Math.max(0, totalSteps - 1)}
                        step={1}
                        disabled={totalSteps === 0}
                        className="w-full"
                    />
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onReset}
                        disabled={totalSteps === 0}
                        title="Reset to start"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onStepBackward}
                        disabled={currentStep === 0 || isExecuting}
                        title="Step backward"
                    >
                        <SkipBack className="h-4 w-4" />
                    </Button>

                    {isPaused || !isExecuting ? (
                        <Button
                            variant="default"
                            size="icon"
                            onClick={onPlay}
                            disabled={totalSteps === 0 || currentStep >= totalSteps - 1}
                            title="Play"
                            className="h-10 w-10"
                        >
                            <Play className="h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="icon"
                            onClick={onPause}
                            title="Pause"
                            className="h-10 w-10"
                        >
                            <Pause className="h-5 w-5" />
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onStepForward}
                        disabled={currentStep >= totalSteps - 1 || isExecuting}
                        title="Step forward"
                    >
                        <SkipForward className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onRunToEnd}
                        disabled={totalSteps === 0 || currentStep >= totalSteps - 1 || isExecuting}
                        title="Run to end"
                    >
                        <FastForward className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
