import { motion } from 'framer-motion';

export interface HeapVisualizerProps {
    data: number[];
    highlights?: number[];
    type?: 'min' | 'max';
    showArray?: boolean;
}

export default function HeapVisualizer({
    data,
    highlights = [],
    type = 'min',
    showArray = true,
}: HeapVisualizerProps) {
    // Calculate tree positions from heap array
    const calculateTreePositions = () => {
        const positions: { index: number; x: number; y: number; value: number }[] = [];
        const nodeWidth = 50;
        const levelHeight = 80;
        const baseWidth = 600;

        const getLevel = (index: number) => Math.floor(Math.log2(index + 1));
        const getPositionInLevel = (index: number) => {
            const level = getLevel(index);
            const firstInLevel = Math.pow(2, level) - 1;
            return index - firstInLevel;
        };

        data.forEach((value, index) => {
            const level = getLevel(index);
            const posInLevel = getPositionInLevel(index);
            const nodesInLevel = Math.pow(2, level);
            const spacing = baseWidth / (nodesInLevel + 1);

            const x = spacing * (posInLevel + 1);
            const y = level * levelHeight + 50;

            positions.push({ index, x, y, value });
        });

        return positions;
    };

    const positions = calculateTreePositions();

    // Calculate edges (parent-child connections)
    const edges: { from: number; to: number }[] = [];
    data.forEach((_, index) => {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;

        if (leftChild < data.length) {
            edges.push({ from: index, to: leftChild });
        }
        if (rightChild < data.length) {
            edges.push({ from: index, to: rightChild });
        }
    });

    // Check heap property
    const checkHeapProperty = (parentIndex: number, childIndex: number): boolean => {
        if (childIndex >= data.length) return true;

        if (type === 'min') {
            return data[parentIndex] <= data[childIndex];
        } else {
            return data[parentIndex] >= data[childIndex];
        }
    };

    const getNodeColor = (index: number) => {
        if (highlights.includes(index)) {
            return 'fill-primary stroke-primary-foreground';
        }
        return 'fill-muted stroke-border';
    };

    const getEdgeColor = (from: number, to: number) => {
        const isValid = checkHeapProperty(from, to);
        if (!isValid) {
            return 'stroke-red-500';
        }
        return 'stroke-border';
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-2">No heap data</p>
                    <p className="text-sm">Heap will appear here when available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Tree Visualization */}
            <div className="flex-1 relative overflow-auto">
                <svg
                    className="w-full h-full min-h-[300px]"
                    viewBox="0 0 600 400"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Edges */}
                    <g className="edges">
                        {edges.map((edge, index) => {
                            const fromPos = positions.find((p) => p.index === edge.from);
                            const toPos = positions.find((p) => p.index === edge.to);

                            if (!fromPos || !toPos) return null;

                            return (
                                <motion.line
                                    key={`edge-${index}`}
                                    x1={fromPos.x}
                                    y1={fromPos.y}
                                    x2={toPos.x}
                                    y2={toPos.y}
                                    className={`${getEdgeColor(edge.from, edge.to)} transition-all duration-300`}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                />
                            );
                        })}
                    </g>

                    {/* Nodes */}
                    <g className="nodes">
                        {positions.map((pos, index) => (
                            <g key={pos.index}>
                                {/* Node circle */}
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r="20"
                                    className={`${getNodeColor(pos.index)} transition-all duration-300`}
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
                                    className="fill-foreground font-mono font-bold text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                                >
                                    {pos.value}
                                </motion.text>

                                {/* Index label */}
                                <motion.text
                                    x={pos.x}
                                    y={pos.y + 30}
                                    textAnchor="middle"
                                    className="fill-muted-foreground font-mono text-xs"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                                >
                                    [{pos.index}]
                                </motion.text>
                            </g>
                        ))}
                    </g>
                </svg>

                {/* Heap Type Badge */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur border rounded px-3 py-1">
                    <span className="text-sm font-semibold">
                        {type === 'min' ? 'Min Heap' : 'Max Heap'}
                    </span>
                </div>
            </div>

            {/* Array Representation */}
            {showArray && (
                <div className="border-t p-4 bg-muted/30">
                    <p className="text-sm font-semibold mb-2">Array Representation:</p>
                    <div className="flex gap-1 flex-wrap">
                        {data.map((value, index) => (
                            <motion.div
                                key={index}
                                className={`
                  w-12 h-12 flex items-center justify-center
                  border-2 rounded font-mono text-sm font-bold
                  transition-all duration-300
                  ${highlights.includes(index)
                                        ? 'bg-primary text-primary-foreground border-primary-foreground'
                                        : 'bg-background border-border'
                                    }
                `}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                {value}
                            </motion.div>
                        ))}
                    </div>

                    {/* Heap Property Validation */}
                    <div className="mt-3 flex items-center gap-2">
                        {edges.every((edge) => checkHeapProperty(edge.from, edge.to)) ? (
                            <>
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm text-green-600 font-semibold">
                                    Valid {type === 'min' ? 'Min' : 'Max'} Heap
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm text-red-600 font-semibold">
                                    Invalid Heap Property
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
