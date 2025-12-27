// Algorithm workspace types and interfaces

export type VisualizationType = 'array' | 'tree' | 'graph' | 'stack' | 'queue' | 'linked_list';

export interface ExecutionStep {
    line: number;
    variables: Record<string, any>;
    visualization?: VisualizationData;
    description?: string;
}

export interface VisualizationData {
    type: VisualizationType;
    data: any;
    highlighted?: number[];
    metadata?: Record<string, any>;
}

export interface AlgorithmState {
    code: string;
    executionTrace: ExecutionStep[];
    currentStep: number;
    isExecuting: boolean;
    isPaused: boolean;
    variables: Record<string, any>;
}

export interface StepControlsProps {
    currentStep: number;
    totalSteps: number;
    isExecuting: boolean;
    isPaused: boolean;
    onStepForward: () => void;
    onStepBackward: () => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onRunToEnd: () => void;
}

export interface VisualizationPanelProps {
    visualization?: VisualizationData;
    currentStep: number;
}

export interface VariableInspectorProps {
    variables: Record<string, any>;
}
