import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface TreeNode {
    value: any;
    left?: TreeNode;
    right?: TreeNode;
    id?: string;
}

export interface TreeVisualizerProps {
    data: TreeNode | null;
    highlights?: string[];
    traversalOrder?: number[];
}

interface NodePosition {
    x: number;
    y: number;
    node: TreeNode;
    id: string;
}

export default function TreeVisualizer({
    data,
    highlights = [],
    traversalOrder = [],
}: TreeVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Calculate tree layout
    const calculateLayout = (
        node: TreeNode | null | undefined,
        depth: number = 0,
        position: number = 0,
        positions: NodePosition[] = [],
        idCounter: { value: number } = { value: 0 }
    ): NodePosition[] => {
        if (!node) return positions;

        const id = node.id || `node-${idCounter.value++}`;
        const nodeWidth = 60;
        const levelHeight = 80;
        const horizontalSpacing = 40;

        // Calculate position
        const x = position * (nodeWidth + horizontalSpacing) + 300;
        const y = depth * levelHeight + 50;

        positions.push({ x, y, node, id });

        // Recursively calculate positions for children
        if (node.left) {
            calculateLayout(node.left, depth + 1, position * 2, positions, idCounter);
        }
        if (node.right) {
            calculateLayout(node.right, depth + 1, position * 2 + 1, positions, idCounter);
        }

        return positions;
    };

    const positions = data ? calculateLayout(data) : [];

    // Calculate edges
    const edges: { from: NodePosition; to: NodePosition }[] = [];
    positions.forEach((pos) => {
        if (pos.node.left) {
            const leftChild = positions.find((p) => p.node === pos.node.left);
            if (leftChild) {
                edges.push({ from: pos, to: leftChild });
            }
        }
        if (pos.node.right) {
            const rightChild = positions.find((p) => p.node === pos.node.right);
            if (rightChild) {
                edges.push({ from: pos, to: rightChild });
            }
        }
    });

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-2">No tree data</p>
                    <p className="text-sm">Tree will appear here when available</p>
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
                    {edges.map((edge, index) => (
                        <motion.line
                            key={`edge-${index}`}
                            x1={edge.from.x}
                            y1={edge.from.y}
                            x2={edge.to.x}
                            y2={edge.to.y}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-border"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        />
                    ))}
                </g>

                {/* Nodes */}
                <g className="nodes">
                    {positions.map((pos, index) => {
                        const isHighlighted = highlights.includes(pos.id);
                        const orderIndex = traversalOrder.indexOf(index);
                        const hasOrder = orderIndex !== -1;

                        return (
                            <g key={pos.id}>
                                {/* Node circle */}
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="25"
                                    className={`
                    transition-all duration-300
                    ${isHighlighted
                                            ? 'fill-primary stroke-primary-foreground'
                                            : 'fill-muted stroke-border'
                                        }
                  `}
                                    strokeWidth="2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                />

                                {/* Node value */}
                                <motion.text
                                    x={pos.x}
                                    y={pos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`
                    font-mono font-bold text-sm
                    ${isHighlighted ? 'fill-primary-foreground' : 'fill-foreground'}
                  `}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                                >
                                    {pos.node.value}
                                </motion.text>

                                {/* Traversal order badge */}
                                {hasOrder && (
                                    <g>
                                        <motion.circle
                                            cx={pos.x + 20}
                                            cy={pos.y - 20}
                                            r="12"
                                            className="fill-blue-500"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.3, delay: orderIndex * 0.1 }}
                                        />
                                        <motion.text
                                            x={pos.x + 20}
                                            y={pos.y - 20}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-white font-bold text-xs"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: orderIndex * 0.1 + 0.1 }}
                                        >
                                            {orderIndex + 1}
                                        </motion.text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Legend */}
            {traversalOrder.length > 0 && (
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur border rounded p-3">
                    <p className="text-sm font-semibold mb-2">Traversal Order</p>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            1
                        </div>
                        <span className="text-xs text-muted-foreground">First visited</span>
                    </div>
                </div>
            )}
        </div>
    );
}
