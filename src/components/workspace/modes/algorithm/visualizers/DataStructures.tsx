import { VisualizationData } from '../types';

interface ArrayVisualizerProps {
    data: number[];
    highlighted?: number[];
}

export function ArrayVisualizer({ data, highlighted = [] }: ArrayVisualizerProps) {
    const maxValue = Math.max(...data, 1);

    return (
        <div className="flex items-end justify-center gap-2 h-64 p-4">
            {data.map((value, index) => {
                const isHighlighted = highlighted.includes(index);
                const height = (value / maxValue) * 100;

                return (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2 flex-1 max-w-[60px]"
                    >
                        <div
                            className={`w-full rounded-t transition-all duration-300 ${isHighlighted
                                    ? 'bg-primary shadow-lg'
                                    : 'bg-muted-foreground/30'
                                }`}
                            style={{ height: `${height}%` }}
                        />
                        <span className="text-xs font-mono">{value}</span>
                        <span className="text-xs text-muted-foreground">[{index}]</span>
                    </div>
                );
            })}
        </div>
    );
}

interface TreeNode {
    value: any;
    left?: TreeNode;
    right?: TreeNode;
}

interface TreeVisualizerProps {
    data: TreeNode;
    highlighted?: number[];
}

export function TreeVisualizer({ data, highlighted = [] }: TreeVisualizerProps) {
    return (
        <div className="flex items-center justify-center h-64 p-4">
            <div className="text-muted-foreground">
                Tree visualization coming soon...
            </div>
        </div>
    );
}

interface GraphVisualizerProps {
    data: any;
    highlighted?: number[];
}

export function GraphVisualizer({ data, highlighted = [] }: GraphVisualizerProps) {
    return (
        <div className="flex items-center justify-center h-64 p-4">
            <div className="text-muted-foreground">
                Graph visualization coming soon...
            </div>
        </div>
    );
}

interface StackVisualizerProps {
    data: any[];
    highlighted?: number[];
}

export function StackVisualizer({ data, highlighted = [] }: StackVisualizerProps) {
    return (
        <div className="flex flex-col-reverse items-center justify-end gap-2 h-64 p-4">
            {data.map((value, index) => {
                const isHighlighted = highlighted.includes(index);

                return (
                    <div
                        key={index}
                        className={`w-32 px-4 py-3 rounded border-2 text-center font-mono transition-all ${isHighlighted
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-muted/30'
                            }`}
                    >
                        {String(value)}
                    </div>
                );
            })}
            {data.length === 0 && (
                <div className="text-muted-foreground text-sm">Stack is empty</div>
            )}
        </div>
    );
}

interface QueueVisualizerProps {
    data: any[];
    highlighted?: number[];
}

export function QueueVisualizer({ data, highlighted = [] }: QueueVisualizerProps) {
    return (
        <div className="flex items-center justify-center gap-2 h-64 p-4">
            {data.map((value, index) => {
                const isHighlighted = highlighted.includes(index);

                return (
                    <div
                        key={index}
                        className={`px-4 py-3 rounded border-2 text-center font-mono transition-all ${isHighlighted
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-muted/30'
                            }`}
                    >
                        {String(value)}
                    </div>
                );
            })}
            {data.length === 0 && (
                <div className="text-muted-foreground text-sm">Queue is empty</div>
            )}
        </div>
    );
}

// Export all visualizers
export const visualizers = {
    array: ArrayVisualizer,
    tree: TreeVisualizer,
    graph: GraphVisualizer,
    stack: StackVisualizer,
    queue: QueueVisualizer,
    linked_list: QueueVisualizer, // Use queue visualizer for now
};
