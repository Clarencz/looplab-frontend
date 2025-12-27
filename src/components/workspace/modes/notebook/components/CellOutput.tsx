import { CellOutput as CellOutputType } from '../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface CellOutputProps {
    output: CellOutputType;
}

export function CellOutput({ output }: CellOutputProps) {
    const getOutputClass = () => {
        switch (output.type) {
            case 'error':
                return 'bg-destructive/10 border-destructive/20 text-destructive';
            case 'html':
                return 'bg-muted/50 border-border';
            default:
                return 'bg-muted/30 border-border';
        }
    };

    const getIcon = () => {
        if (output.type === 'error') {
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        }
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    };

    return (
        <div className={`mt-2 rounded-md border p-3 ${getOutputClass()}`}>
            <div className="flex items-start gap-2">
                <div className="mt-0.5">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    {output.type === 'html' ? (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: output.content }}
                        />
                    ) : (
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                            {output.content}
                        </pre>
                    )}
                </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
                {new Date(output.timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
}
