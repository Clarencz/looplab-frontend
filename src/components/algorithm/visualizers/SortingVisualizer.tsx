import { motion } from 'framer-motion';

export interface SortingVisualizerProps {
    data: number[];
    comparing?: number[];
    swapping?: number[];
    sorted?: number[];
    pivot?: number;
}

export default function SortingVisualizer({
    data,
    comparing = [],
    swapping = [],
    sorted = [],
    pivot,
}: SortingVisualizerProps) {
    const maxValue = Math.max(...data, 1);
    const barWidth = Math.min(60, 600 / data.length - 4);

    const getBarColor = (index: number) => {
        if (sorted.includes(index)) {
            return 'bg-green-500';
        }
        if (pivot === index) {
            return 'bg-purple-500';
        }
        if (swapping.includes(index)) {
            return 'bg-red-500';
        }
        if (comparing.includes(index)) {
            return 'bg-yellow-500';
        }
        return 'bg-primary';
    };

    const getBarHeight = (value: number) => {
        return (value / maxValue) * 300;
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg mb-2">No data to sort</p>
                    <p className="text-sm">Array will appear here when available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            {/* Bars */}
            <div className="flex items-end gap-1 h-[350px]">
                {data.map((value, index) => (
                    <motion.div
                        key={`bar-${index}`}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                    >
                        {/* Value label */}
                        <span className="text-xs font-mono mb-1 text-muted-foreground">
                            {value}
                        </span>

                        {/* Bar */}
                        <motion.div
                            className={`${getBarColor(index)} rounded-t transition-all duration-300`}
                            style={{
                                width: `${barWidth}px`,
                                height: `${getBarHeight(value)}px`,
                            }}
                            animate={{
                                height: `${getBarHeight(value)}px`,
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Index label */}
                        <span className="text-xs font-mono mt-1 text-muted-foreground">
                            {index}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex gap-4 flex-wrap justify-center">
                {comparing.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded" />
                        <span className="text-sm text-muted-foreground">Comparing</span>
                    </div>
                )}

                {swapping.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded" />
                        <span className="text-sm text-muted-foreground">Swapping</span>
                    </div>
                )}

                {pivot !== undefined && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded" />
                        <span className="text-sm text-muted-foreground">Pivot</span>
                    </div>
                )}

                {sorted.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded" />
                        <span className="text-sm text-muted-foreground">Sorted</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded" />
                    <span className="text-sm text-muted-foreground">Unsorted</span>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-6 text-sm">
                <div>
                    <span className="text-muted-foreground">Array Size: </span>
                    <span className="font-mono font-semibold">{data.length}</span>
                </div>
                <div>
                    <span className="text-muted-foreground">Sorted: </span>
                    <span className="font-mono font-semibold">{sorted.length}/{data.length}</span>
                </div>
            </div>
        </div>
    );
}
