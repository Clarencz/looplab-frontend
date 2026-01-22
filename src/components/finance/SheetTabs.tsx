import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export interface WorksheetData {
    id: string;
    name: string;
    data: any[][];
    columns?: any[];
}

export interface SheetTabsProps {
    sheets: WorksheetData[];
    activeSheetId: string;
    onSheetChange: (sheetId: string) => void;
    onSheetAdd?: () => void;
    onSheetRemove?: (sheetId: string) => void;
    onSheetRename?: (sheetId: string, newName: string) => void;
    children: React.ReactNode;
}

export default function SheetTabs({
    sheets,
    activeSheetId,
    onSheetChange,
    onSheetAdd,
    onSheetRemove,
    onSheetRename,
    children,
}: SheetTabsProps) {
    return (
        <Tabs value={activeSheetId} onValueChange={onSheetChange} className="w-full">
            <div className="flex items-center gap-2 border-b">
                <TabsList className="h-10 bg-transparent">
                    {sheets.map((sheet) => (
                        <TabsTrigger
                            key={sheet.id}
                            value={sheet.id}
                            className="relative group data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            <span>{sheet.name}</span>
                            {sheets.length > 1 && onSheetRemove && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSheetRemove(sheet.id);
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {onSheetAdd && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={onSheetAdd}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {sheets.map((sheet) => (
                <TabsContent key={sheet.id} value={sheet.id} className="mt-0">
                    {children}
                </TabsContent>
            ))}
        </Tabs>
    );
}
