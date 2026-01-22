import { motion } from 'framer-motion';

export interface ArrayVisualizerProps {
    data: number[];
    highlights?: number[];
    pointers?: { [key: string]: number };
}

export default function ArrayVisualizer({
    data,
    highlights = [],
    pointers = {},
}: ArrayVisualizerProps) {
    const getElementColor = (index: number) => {
        if (highlights.includes(index)) {
            return 'bg-primary text-primary-foreground';
        }
        return 'bg-muted';
    };

    const getPointerColor = (name: string) => {
        const colors: { [key: string]: string } = {
            left: 'text-blue-500',
            right: 'text-red-500',
            mid: 'text-green-500',
            i: 'text-purple-500',
            j: 'text-orange-500',
        };
        return colors[name] || 'text-gray-500';
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            {/* Array Elements */}
            <div className="flex gap-2 mb-8">
                {data.map((value, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                    >
                        {/* Element Box */}
                        <div
                            className={`
                w-16 h-16 flex items-center justify-center
                border-2 border-border rounded
                font-mono text-lg font-bold
                transition-all duration-300
                ${getElementColor(index)}
              `}
                        >
                            {value}
                        </div>

                        {/* Index Label */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                            <span className="text-xs text-muted-foreground font-mono">{index}</span>
                        </div>

                        {/* Pointers */}
                        {Object.entries(pointers).map(([name, pointerIndex]) => {
                            if (pointerIndex === index) {
                                return (
                                    <motion.div
                                        key={name}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className={`text-xs font-semibold ${getPointerColor(name)}`}>
                                                {name}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 ${getPointerColor(name)}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 3l-7 7h4v7h6v-7h4l-7-7z" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                );
                            }
                            return null;
                        })}
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            {Object.keys(pointers).length > 0 && (
                <div className="flex gap-4 mt-4">
                    {Object.keys(pointers).map((name) => (
                        <div key={name} className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded-full ${getPointerColor(name).replace('text-', 'bg-')}`} />
                            <span className="text-xs font-mono">{name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
