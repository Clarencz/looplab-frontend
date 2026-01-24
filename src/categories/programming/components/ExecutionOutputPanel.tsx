// Execution Output Panel Component

interface ExecutionOutputPanelProps {
    output: string[];
}

export function ExecutionOutputPanel({ output }: ExecutionOutputPanelProps) {
    if (output.length === 0) return null;

    return (
        <div className="mt-4 p-3 bg-muted rounded font-mono text-sm">
            {output.map((line, i) => (
                <div key={i}>{line}</div>
            ))}
        </div>
    );
}
