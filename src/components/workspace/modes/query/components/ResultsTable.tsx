import { QueryResult } from '../types';
import { Table } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock } from 'lucide-react';

interface ResultsTableProps {
    result: QueryResult;
}

export function ResultsTable({ result }: ResultsTableProps) {
    return (
        <div className="flex flex-col h-full">
            {/* Results header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">{result.rowCount} rows</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{result.executionTime}ms</span>
                    </div>
                </div>
            </div>

            {/* Results table */}
            <ScrollArea className="flex-1">
                <div className="p-4">
                    {result.rows.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Query executed successfully but returned no rows
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        {result.columns.map((column, index) => (
                                            <th
                                                key={index}
                                                className="px-4 py-2 text-left text-sm font-semibold border-b border-border"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.rows.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="px-4 py-2 text-sm font-mono border-b border-border"
                                                >
                                                    {cell === null ? (
                                                        <span className="text-muted-foreground italic">NULL</span>
                                                    ) : (
                                                        String(cell)
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
