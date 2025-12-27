import { Terminal, Trash2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ConsolePanelProps } from '../types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <AlertCircle className="h-4 w-4 text-destructive" />;
            case 'warn':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'info':
                return <Info className="h-4 w-4 text-blue-500" />;
            default:
                return <Terminal className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getMessageClass = (type: string) => {
        switch (type) {
            case 'error':
                return 'text-destructive bg-destructive/10';
            case 'warn':
                return 'text-yellow-600 dark:text-yellow-500 bg-yellow-500/10';
            case 'info':
                return 'text-blue-600 dark:text-blue-500 bg-blue-500/10';
            default:
                return 'text-foreground';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Console</h3>
                    <span className="text-xs text-muted-foreground">
                        {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="h-7"
                    disabled={messages.length === 0}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {messages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No console output yet
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-2 p-2 rounded text-sm font-mono ${getMessageClass(msg.type)}`}
                            >
                                <div className="mt-0.5">{getIcon(msg.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <pre className="whitespace-pre-wrap break-words">{msg.message}</pre>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
