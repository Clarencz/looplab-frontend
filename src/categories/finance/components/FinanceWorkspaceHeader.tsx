import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Project } from '@/types';

interface FinanceWorkspaceHeaderProps {
    project: Project;
    category?: any;
    onBack: () => void;
}

export function FinanceWorkspaceHeader({ project, category, onBack }: FinanceWorkspaceHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
            <div>
                <h1 className="text-xl font-bold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                    {category?.name || 'Finance & Economics'}
                </p>
            </div>
        </div>
    );
}
