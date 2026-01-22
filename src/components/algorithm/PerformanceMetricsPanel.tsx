import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Database, Zap } from 'lucide-react';

export interface PerformanceMetrics {
    timeComplexity: string;
    spaceComplexity: string;
    operationsCount: number;
    executionTime: number; // milliseconds
    memoryUsed?: number; // bytes
}

export interface PerformanceMetricsPanelProps {
    metrics: PerformanceMetrics | null;
}

export default function PerformanceMetricsPanel({ metrics }: PerformanceMetricsPanelProps) {
    if (!metrics) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Run your code to see performance metrics
                    </p>
                </CardContent>
            </Card>
        );
    }

    const formatTime = (ms: number) => {
        if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
        if (ms < 1000) return `${ms.toFixed(2)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const formatMemory = (bytes: number) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Complexity */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Time Complexity</span>
                        <Badge variant="outline" className="font-mono">
                            {metrics.timeComplexity}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Space Complexity</span>
                        <Badge variant="outline" className="font-mono">
                            {metrics.spaceComplexity}
                        </Badge>
                    </div>
                </div>

                {/* Runtime Metrics */}
                <div className="space-y-3 pt-3 border-t">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Execution Time</p>
                            <p className="text-lg font-mono font-bold">
                                {formatTime(metrics.executionTime)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Operations</p>
                            <p className="text-lg font-mono font-bold">
                                {metrics.operationsCount.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {metrics.memoryUsed !== undefined && (
                        <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Memory Used</p>
                                <p className="text-lg font-mono font-bold">
                                    {formatMemory(metrics.memoryUsed)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
