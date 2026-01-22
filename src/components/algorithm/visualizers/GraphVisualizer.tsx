import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface GraphVertex {
    id: string;
    value: any;
    x?: number;
    y?: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight?: number;
    directed?: boolean;
}

export interface GraphVisualizerProps {
    vertices: GraphVertex[];
    edges: GraphEdge[];
    highlights?: string[];
    visitedOrder?: string[];
    shortestPath?: string[];
}

export default function GraphVisualizer({
    vertices,
    edges,
    highlights = [],
    visitedOrder = [],
    shortestPath = [],
}: GraphVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

    // Simple force-directed layout (simplified version)
    useEffect(() => {
        if (vertices.length === 0) return;

        const newPositions = new Map<string, { x: number; y: number }>();
        const width = 800;
        const height = 600;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Circular layout for simplicity
        vertices.forEach((vertex, index) => {
            const angle = (2 * Math.PI * index) / vertices.length;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            newPositions.set(vertex.id, { x, y });
        });

        setPositions(newPositions);
    }, [vertices]);

    const getVertexColor = (vertexId: string) => {
        if (shortestPath.includes(vertexId)) {
            return 'fill-green-500 stroke-green-700';
        }
        if (highlights.includes(vertexId)) {
            return 'fill-primary stroke-primary-foreground';
        }
        if (visitedOrder.includes(vertexId)) {
            return 'fill-blue-400 stroke-blue-600';
        }
        return 'fill-muted stroke-border';
    };

    const getEdgeColor = (edge: GraphEdge) => {
        const fromInPath = shortestPath.includes(edge.from);
        const toInPath = shortestPath.includes(edge.to);
        const fromIndex = shortestPath.indexOf(edge.from);
        const toIndex = shortestPath.indexOf(edge.to);

        if (fromInPath && toInPath && Math.abs(fromIndex - toIndex) === 1) {
            return 'stroke-green-500';
        }
        return 'stroke-border';
    };

    if (vertices.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-2">No graph data</p>
                    <p className="text-sm">Graph will appear here when available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-auto">
            <svg
                ref={svgRef}
                className="w-full h-full min-h-[400px]"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Edges */}
                <g className="edges">
                    {edges.map((edge, index) => {
                        const fromPos = positions.get(edge.from);
                        const toPos = positions.get(edge.to);

                        if (!fromPos || !toPos) return null;

                        const midX = (fromPos.x + toPos.x) / 2;
                        const midY = (fromPos.y + toPos.y) / 2;

                        return (
                            <g key={`edge-${index}`}>
                                {/* Edge line */}
                                <motion.line
                                    x1={fromPos.x}
                                    y1={fromPos.y}
                                    x2={toPos.x}
                                    y2={toPos.y}
                                    className={`${getEdgeColor(edge)} transition-all duration-300`}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    markerEnd={edge.directed ? 'url(#arrowhead)' : undefined}
                                />

                                {/* Edge weight */}
                                {edge.weight !== undefined && (
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                                    >
                                        <circle
                                            cx={midX}
                                            cy={midY}
                                            r="15"
                                            className="fill-background stroke-border"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={midX}
                                            y={midY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-foreground font-mono text-xs font-semibold"
                                        >
                                            {edge.weight}
                                        </text>
                                    </motion.g>
                                )}
                            </g>
                        );
                    })}
                </g>

                {/* Arrow marker for directed edges */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 10 3, 0 6"
                            className="fill-border"
                        />
                    </marker>
                </defs>

                {/* Vertices */}
                <g className="vertices">
                    {vertices.map((vertex, index) => {
                        const pos = positions.get(vertex.id);
                        if (!pos) return null;

                        const visitIndex = visitedOrder.indexOf(vertex.id);
                        const hasVisitOrder = visitIndex !== -1;

                        return (
                            <g key={vertex.id}>
                                {/* Vertex circle */}
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="30"
                                    className={`${getVertexColor(vertex.id)} transition-all duration-300`}
                                    strokeWidth="3"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                />

                                {/* Vertex label */}
                                <motion.text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-foreground font-mono font-bold text-sm pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                                >
                                    {vertex.value}
                                </motion.text>

                                {/* Visit order badge */}
                                {hasVisitOrder && (
                                    <g>
                                        <motion.circle
                                            cx={pos.x + 25}
                                            cy={pos.y - 25}
                                            r="12"
                                            className="fill-blue-500"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.3, delay: visitIndex * 0.1 }}
                                        />
                                        <motion.text
                                            x={pos.x + 25}
                                            y={pos.y - 25}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-white font-bold text-xs"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: visitIndex * 0.1 + 0.1 }}
                                        >
                                            {visitIndex + 1}
                                        </motion.text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur border rounded p-3 space-y-2">
                <p className="text-sm font-semibold mb-2">Legend</p>

                {visitedOrder.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-blue-600" />
                        <span className="text-xs text-muted-foreground">Visited</span>
                    </div>
                )}

                {shortestPath.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-700" />
                        <span className="text-xs text-muted-foreground">Shortest Path</span>
                    </div>
                )}

                {highlights.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary border-2 border-primary-foreground" />
                        <span className="text-xs text-muted-foreground">Current</span>
                    </div>
                )}
            </div>
        </div>
    );
}
