import { VariableInspectorProps } from '../types';

export function VariableInspector({ variables }: VariableInspectorProps) {
    const entries = Object.entries(variables);

    if (entries.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground text-sm">
                No variables to display
            </div>
        );
    }

    const formatValue = (value: any): string => {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (Array.isArray(value)) return `[${value.join(', ')}]`;
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return String(value);
    };

    const getTypeColor = (value: any): string => {
        if (value === null || value === undefined) return 'text-muted-foreground';
        if (typeof value === 'number') return 'text-blue-500';
        if (typeof value === 'string') return 'text-green-500';
        if (typeof value === 'boolean') return 'text-purple-500';
        if (Array.isArray(value)) return 'text-orange-500';
        return 'text-yellow-500';
    };

    return (
        <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold mb-3">Variables</h3>
            <div className="space-y-2">
                {entries.map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-start gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <span className="font-mono text-sm font-medium min-w-[80px]">
                            {key}:
                        </span>
                        <span className={`font-mono text-sm flex-1 ${getTypeColor(value)}`}>
                            {formatValue(value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
