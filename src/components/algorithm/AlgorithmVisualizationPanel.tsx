import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';

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

export interface AlgorithmVisualizationPanelProps {
    executionState: ExecutionState | null;
    isPlaying: boolean;
    speed: number;
}

export default function AlgorithmVisualizationPanel({
    executionState,
    isPlaying,
    speed,
}: AlgorithmVisualizationPanelProps) {
    if (!executionState) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Visualization</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[calc(100%-80px)]">
                    <div className="text-center text-muted-foreground">
                        <p className="text-lg mb-2">No visualization data</p>
                        <p className="text-sm">Run your code to see the algorithm in action</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { dataStructure } = executionState;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <span>Visualization</span>
                    <div className="flex items-center gap-2 text-sm font-normal">
                        {isPlaying && (
                            <span className="flex items-center gap-1 text-green-600">
                                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                Playing
                            </span>
                        )}
                        <span className="text-muted-foreground">Speed: {speed}x</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <Tabs defaultValue="structure" className="h-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="structure">Structure</TabsTrigger>
                        <TabsTrigger value="variables">Variables</TabsTrigger>
                        <TabsTrigger value="callstack">Call Stack</TabsTrigger>
                    </TabsList>

                    <TabsContent value="structure" className="mt-4 h-[calc(100%-60px)]">
                        {dataStructure.type === 'array' && (
                            <ArrayVisualizer
                                data={dataStructure.data}
                                highlights={dataStructure.highlights}
                                pointers={dataStructure.pointers}
                            />
                        )}
                        {dataStructure.type === 'tree' && (
                            <TreeVisualizer
                                data={dataStructure.data}
                                highlights={dataStructure.highlights}
                            />
                        )}
                        {dataStructure.type === 'graph' && (
                            <GraphVisualizer
                                data={dataStructure.data}
                                highlights={dataStructure.highlights}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="variables" className="mt-4">
                        <div className="space-y-2">
                            {Array.from(executionState.variables.entries()).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex justify-between items-center p-2 bg-muted/50 rounded"
                                >
                                    <span className="font-mono text-sm font-semibold">{key}</span>
                                    <span className="font-mono text-sm text-muted-foreground">
                                        {JSON.stringify(value)}
                                    </span>
                                </div>
                            ))}
                            {executionState.variables.size === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No variables to display
                                </p>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="callstack" className="mt-4">
                        <div className="space-y-2">
                            {executionState.callStack.map((frame, index) => (
                                <div
                                    key={index}
                                    className="p-2 bg-muted/50 rounded font-mono text-sm"
                                >
                                    {frame}
                                </div>
                            ))}
                            {executionState.callStack.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Call stack is empty
                                </p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
