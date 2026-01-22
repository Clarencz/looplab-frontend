import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export interface ExecutionControlsProps {
    isPlaying: boolean;
    speed: number;
    onPlay: () => void;
    onPause: () => void;
    onStep: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    canStep: boolean;
    canReset: boolean;
}

export default function ExecutionControls({
    isPlaying,
    speed,
    onPlay,
    onPause,
    onStep,
    onReset,
    onSpeedChange,
    canStep,
    canReset,
}: ExecutionControlsProps) {
    return (
        <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
                {isPlaying ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPause}
                    >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPlay}
                        disabled={!canStep}
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onStep}
                    disabled={!canStep || isPlaying}
                >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Step
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    disabled={!canReset}
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-3 flex-1 max-w-xs">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Speed:</span>
                <Slider
                    value={[speed]}
                    onValueChange={([value]) => onSpeedChange(value)}
                    min={0.5}
                    max={4}
                    step={0.5}
                    className="flex-1"
                />
                <span className="text-sm font-mono font-semibold w-12">{speed}x</span>
            </div>
        </div>
    );
}
