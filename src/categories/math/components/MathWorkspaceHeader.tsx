import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import type { Project } from '@/types';

interface MathWorkspaceHeaderProps {
    project: Project;
    category?: any;
    score: number;
}

export function MathWorkspaceHeader({ project, category, score }: MathWorkspaceHeaderProps) {
    const { getBackUrl, getBackLabel } = useSmartNavigation();

    return (
        <div className="border-b p-4 space-y-3">
            <Link to={getBackUrl('/learning-paths')}>
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {getBackLabel('Back')}
                </Button>
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {category?.name || 'Math & Logic'} • Revolutionary Learning
                    </p>
                </div>
                {score > 0 && (
                    <Badge variant="default" className="text-lg px-4 py-2">
                        Score: {score.toFixed(0)}%
                    </Badge>
                )}
            </div>
        </div>
    );
}
