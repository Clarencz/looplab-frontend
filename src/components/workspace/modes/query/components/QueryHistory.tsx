import { History, Trash2 } from 'lucide-react';
import { QueryHistory as QueryHistoryType } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface QueryHistoryProps {
    history: QueryHistoryType[];
    onQueryClick: (query: string) => void;
    onClearHistory: () => void;
}

export function QueryHistory({ history, onQueryClick, onClearHistory }: QueryHistoryProps) {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <History className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No query history</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Query History</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    className="h-7"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {history.slice().reverse().map((item) => (
                        <div
                            key={item.id}
                            className={`p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors ${item.success
                                    ? 'border-border'
                                    : 'border-destructive/50 bg-destructive/5'
                                }`}
                            onClick={() => onQueryClick(item.query)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </span>
                                {item.success && item.rowCount !== undefined && (
                                    <span className="text-xs text-muted-foreground">
                                        {item.rowCount} rows
                                    </span>
                                )}
                            </div>
                            <pre className="text-xs font-mono line-clamp-2">
                                {item.query}
                            </pre>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
