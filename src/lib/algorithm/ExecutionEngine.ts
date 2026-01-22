/**
 * Simple execution engine for algorithm visualization
 * Supports step-by-step execution and state tracking
 */

export interface ExecutionState {
    currentLine: number;
    variables: Map<string, any>;
    callStack: string[];
    dataStructure: {
        type: 'array' | 'tree' | 'graph' | 'heap';
        data: any;
        highlights?: number[];
        pointers?: { [key: string]: number };
    };
}

export interface ExecutionStep {
    line: number;
    variables: { [key: string]: any };
    dataStructure: any;
    highlights?: number[];
    pointers?: { [key: string]: number };
}

export class CodeExecutionEngine {
    private steps: ExecutionStep[] = [];
    private currentStep: number = 0;
    private isRunning: boolean = false;

    /**
     * Load execution steps (generated from code analysis)
     */
    loadSteps(steps: ExecutionStep[]): void {
        this.steps = steps;
        this.currentStep = 0;
    }

    /**
     * Get current execution state
     */
    getCurrentState(): ExecutionState | null {
        if (this.currentStep >= this.steps.length) {
            return null;
        }

        const step = this.steps[this.currentStep];
        return {
            currentLine: step.line,
            variables: new Map(Object.entries(step.variables)),
            callStack: [], // TODO: Implement call stack tracking
            dataStructure: {
                type: 'array', // TODO: Auto-detect type
                data: step.dataStructure,
                highlights: step.highlights,
                pointers: step.pointers,
            },
        };
    }

    /**
     * Execute one step
     */
    step(): ExecutionState | null {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            return this.getCurrentState();
        }
        return null;
    }

    /**
     * Step backward
     */
    stepBack(): ExecutionState | null {
        if (this.currentStep > 0) {
            this.currentStep--;
            return this.getCurrentState();
        }
        return null;
    }

    /**
     * Reset to beginning
     */
    reset(): ExecutionState | null {
        this.currentStep = 0;
        return this.getCurrentState();
    }

    /**
     * Check if can step forward
     */
    canStep(): boolean {
        return this.currentStep < this.steps.length - 1;
    }

    /**
     * Check if can reset
     */
    canReset(): boolean {
        return this.currentStep > 0;
    }

    /**
     * Get total steps
     */
    getTotalSteps(): number {
        return this.steps.length;
    }

    /**
     * Get current step number
     */
    getCurrentStepNumber(): number {
        return this.currentStep;
    }
}

/**
 * Generate execution steps for binary search (demo)
 */
export function generateBinarySearchSteps(
    array: number[],
    target: number
): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    let left = 0;
    let right = array.length - 1;

    // Initial state
    steps.push({
        line: 1,
        variables: { array, target, left, right },
        dataStructure: array,
        pointers: { left, right },
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // Calculate mid
        steps.push({
            line: 2,
            variables: { array, target, left, right, mid },
            dataStructure: array,
            pointers: { left, right, mid },
            highlights: [mid],
        });

        if (array[mid] === target) {
            // Found!
            steps.push({
                line: 3,
                variables: { array, target, left, right, mid },
                dataStructure: array,
                pointers: { mid },
                highlights: [mid],
            });
            break;
        } else if (array[mid] < target) {
            // Search right half
            left = mid + 1;
            steps.push({
                line: 4,
                variables: { array, target, left, right, mid },
                dataStructure: array,
                pointers: { left, right },
            });
        } else {
            // Search left half
            right = mid - 1;
            steps.push({
                line: 5,
                variables: { array, target, left, right, mid },
                dataStructure: array,
                pointers: { left, right },
            });
        }
    }

    // Not found
    if (left > right) {
        steps.push({
            line: 6,
            variables: { array, target, left, right },
            dataStructure: array,
            pointers: {},
        });
    }

    return steps;
}
