import { VisualizationPanelProps } from '../types';
import { visualizers } from '../visualizers/DataStructures';

export function VisualizationPanel({ visualization, currentStep }: VisualizationPanelProps) {
    if (!visualization) {
        return (
            <div className="flex items-center justify-center h-full bg-muted/10 border border-border rounded-lg">
                <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No visualization available</p>
                    <p className="text-sm text-muted-foreground">
                        Run your code to see data structures visualized
                    </p>
                </div>
            </div>
        );
    }

    const Visualizer = visualizers[visualization.type];

    if (!Visualizer) {
        return (
            <div className="flex items-center justify-center h-full bg-muted/10 border border-border rounded-lg">
                <p className="text-muted-foreground">
                    Visualizer for "{visualization.type}" not implemented
                </p>
            </div>
        );
    }

    return (
        <div className="h-full bg-muted/10 border border-border rounded-lg overflow-auto">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold capitalize">
                        {visualization.type} Visualization
                    </h3>
                    <span className="text-xs text-muted-foreground">
                        Step {currentStep + 1}
                    </span>
                </div>
                <Visualizer data={visualization.data} highlighted={visualization.highlighted} />
            </div>
        </div>
    );
}
