import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Project } from '@/types';

interface DSWorkspaceHeaderProps {
    project: Project;
    category?: any;
    onBack: () => void;
}

export function DSWorkspaceHeader({ project, category, onBack }: DSWorkspaceHeaderProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {category?.name || 'Data Science & Analytics'}
                    </p>
                </div>
            </div>
        </header>
    );
}
