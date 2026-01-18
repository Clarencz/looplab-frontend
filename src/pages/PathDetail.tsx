import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lock, Play, Trophy, LogOut, ArrowRight } from 'lucide-react';
import { getPathDetail, startPath, type PathDetailResponse, type PathProjectDetail } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const DIFFICULTY_COLORS = {
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-purple-500',
    mastery: 'bg-orange-500',
};

export default function PathDetail() {
    const { pathId } = useParams<{ pathId: string }>();
    const navigate = useNavigate();
    const [pathDetail, setPathDetail] = useState<PathDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        if (pathId) {
            loadPathDetail();
        }
    }, [pathId]);

    const loadPathDetail = async () => {
        if (!pathId) return;

        try {
            setLoading(true);
            const data = await getPathDetail(pathId);
            setPathDetail(data);
        } catch (error) {
            console.error('Failed to load path detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartPath = async () => {
        if (!pathId) return;

        try {
            setStarting(true);
            await startPath(pathId);
            await loadPathDetail(); // Reload to get updated progress
        } catch (error) {
            console.error('Failed to start path:', error);
        } finally {
            setStarting(false);
        }
    };

    const handleProjectClick = (project: PathProjectDetail) => {
        if (project.isLocked) return;
        // Pass navigation context so back button returns here
        navigate(`/projects/${project.projectSlug}?from=path&pathId=${pathId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading path details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!pathDetail) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Path not found</h2>
                    <Button onClick={() => navigate('/learning-paths')}>Back to Learning Paths</Button>
                </div>
            </div>
        );
    }

    const progress = pathDetail.userProgress?.completionPercentage || 0;
    const isCompleted = !!pathDetail.userProgress?.completedAt;
    const hasStarted = !!pathDetail.userProgress;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => navigate('/learning-paths')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Learning Paths
                </Button>

                {/* Exit/Leave Path option for in-progress paths */}
                {hasStarted && !isCompleted && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/learning-paths')}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Exit Path
                    </Button>
                )}
            </div>

            {/* Path Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {pathDetail.icon && <span className="text-4xl">{pathDetail.icon}</span>}
                            <h1 className="text-4xl font-bold">{pathDetail.name}</h1>
                        </div>
                        <p className="text-lg text-muted-foreground mb-4">{pathDetail.description}</p>

                        <div className="flex items-center gap-4 flex-wrap">
                            <Badge className={DIFFICULTY_COLORS[pathDetail.difficultyLevel as keyof typeof DIFFICULTY_COLORS]}>
                                {pathDetail.difficultyLevel}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{pathDetail.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                <span>{pathDetail.projects.length} projects</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{pathDetail.estimatedHours} hours</span>
                            </div>
                        </div>
                    </div>

                    {isCompleted && (
                        <div className="flex flex-col items-center gap-2">
                            <Trophy className="h-12 w-12 text-yellow-500" />
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                Completed
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {hasStarted && !isCompleted && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Your Progress</span>
                                    <span className="text-muted-foreground">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                                <p className="text-sm text-muted-foreground">
                                    {pathDetail.userProgress?.completedProjects} of {pathDetail.projects.length} projects completed
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Start/Continue Path Button */}
                {!isCompleted && (
                    <Card className={hasStarted ? "border-primary/30 bg-primary/5" : "bg-primary/5 border-primary/20"}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold mb-1">
                                        {hasStarted ? 'Continue your journey' : 'Ready to start your journey?'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {hasStarted
                                            ? `You're ${progress}% through — keep going!`
                                            : 'Begin this learning path and unlock your first project'
                                        }
                                    </p>
                                </div>
                                {hasStarted ? (
                                    <Button
                                        onClick={() => {
                                            const nextProject = pathDetail.projects.find(p => !p.isCompleted && !p.isLocked);
                                            if (nextProject) {
                                                // Pass navigation context so back button returns here
                                                navigate(`/projects/${nextProject.projectSlug}?from=path&pathId=${pathId}`);
                                            }
                                        }}
                                        size="lg"
                                        className="gap-2"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                        Continue Learning
                                    </Button>
                                ) : (
                                    <Button onClick={handleStartPath} disabled={starting} size="lg">
                                        {starting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Starting...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" />
                                                Start Path
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Separator className="my-8" />

            {/* Project Timeline */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Learning Journey</h2>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

                    {/* Projects */}
                    <div className="space-y-6">
                        {pathDetail.projects.map((project, index) => (
                            <ProjectNode
                                key={project.projectId}
                                project={project}
                                index={index}
                                onClick={() => handleProjectClick(project)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ProjectNodeProps {
    project: PathProjectDetail;
    index: number;
    onClick: () => void;
}

function ProjectNode({ project, index, onClick }: ProjectNodeProps) {
    const isLocked = project.isLocked;
    const isCompleted = project.isCompleted;
    const isAvailable = !isLocked && !isCompleted;

    return (
        <div className="relative pl-20">
            {/* Node Circle */}
            <div
                className={cn(
                    'absolute left-5 top-6 w-6 h-6 rounded-full border-4 z-10',
                    isCompleted && 'bg-green-500 border-green-500',
                    isAvailable && 'bg-primary border-primary',
                    isLocked && 'bg-muted border-border'
                )}
            >
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-white absolute -top-0.5 -left-0.5" />}
                {isLocked && <Lock className="h-3 w-3 text-muted-foreground absolute top-0.5 left-0.5" />}
            </div>

            {/* Project Card */}
            <Card
                className={cn(
                    'transition-all',
                    !isLocked && 'hover:shadow-lg cursor-pointer',
                    isLocked && 'opacity-60 cursor-not-allowed',
                    isCompleted && 'border-green-200 bg-green-50/50 dark:bg-green-950/20'
                )}
                onClick={onClick}
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Project {index + 1}
                                </span>
                                {project.isRequired && (
                                    <Badge variant="outline" className="text-xs">Required</Badge>
                                )}
                                {isCompleted && (
                                    <Badge className="bg-green-500 text-xs">Completed</Badge>
                                )}
                                {isLocked && (
                                    <Badge variant="secondary" className="text-xs">Locked</Badge>
                                )}
                            </div>
                            <CardTitle className={cn(!isLocked && 'group-hover:text-primary')}>
                                {project.projectName}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                                {project.projectDescription}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                        {project.techStack.slice(0, 4).map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                            </Badge>
                        ))}
                        {project.techStack.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                                +{project.techStack.length - 4} more
                            </Badge>
                        )}
                    </div>

                    {isCompleted && project.completedAt && (
                        <p className="text-xs text-muted-foreground mt-3">
                            Completed {new Date(project.completedAt).toLocaleDateString()}
                        </p>
                    )}

                    {isLocked && (
                        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Complete previous projects to unlock
                        </p>
                    )}

                    {isAvailable && !isCompleted && (
                        <Button className="mt-3" size="sm">
                            <Play className="mr-2 h-3 w-3" />
                            {project.isLocked === false && index === 0 ? 'Start Project' : 'Continue Project'}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
