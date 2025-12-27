import { Database, Table2, History } from 'lucide-react';
import { SchemaTable } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SchemaViewerProps {
    schema: SchemaTable[];
    onTableClick?: (tableName: string) => void;
}

export function SchemaViewer({ schema, onTableClick }: SchemaViewerProps) {
    if (schema.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <Database className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No schema available</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5" />
                    <h3 className="font-semibold">Database Schema</h3>
                </div>

                {schema.map((table) => (
                    <div
                        key={table.name}
                        className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onTableClick?.(table.name)}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Table2 className="h-4 w-4 text-primary" />
                            <span className="font-mono font-semibold text-sm">{table.name}</span>
                            {table.rowCount !== undefined && (
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {table.rowCount} rows
                                </span>
                            )}
                        </div>

                        <div className="space-y-1 ml-6">
                            {table.columns.map((column) => (
                                <div
                                    key={column.name}
                                    className="flex items-center gap-2 text-xs font-mono"
                                >
                                    <span className={column.isPrimaryKey ? 'text-yellow-500 font-bold' : ''}>
                                        {column.name}
                                    </span>
                                    <span className="text-muted-foreground">{column.type}</span>
                                    {column.isPrimaryKey && (
                                        <span className="text-yellow-500 text-[10px]">PK</span>
                                    )}
                                    {column.isForeignKey && (
                                        <span className="text-blue-500 text-[10px]">FK</span>
                                    )}
                                    {!column.nullable && (
                                        <span className="text-red-500 text-[10px]">NOT NULL</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
