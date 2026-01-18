import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, CheckCircle2, Play, Search, Loader2, AlertCircle, Lock } from 'lucide-react';
import { listLearningPaths, startPath, getUserSubscription, type LearningPathWithProgress, type DifficultyLevel, type TierLevel } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { TierBadge } from '@/components/learning-paths/TierBadge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
    beginner: 'bg-green-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-purple-500',
    mastery: 'bg-orange-500',
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    mastery: 'Mastery',
};

const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'mastery'];

export default function LearningPaths() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const [paths, setPaths] = useState<LearningPathWithProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
    const [selectedTier, setSelectedTier] = useState<TierLevel | 'all'>('all');
    const [userTier, setUserTier] = useState<TierLevel>('free');
    const [enrollingPathId, setEnrollingPathId] = useState<string | null>(null);

    useEffect(() => {
        loadPaths();
        loadUserSubscription();

        // Handle URL params
        const categoryId = searchParams.get('categoryId');
        if (categoryId) {
            setSelectedCategory(categoryId);
        }
    }, [searchParams]);

    const loadPaths = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listLearningPaths();
            setPaths(data);
        } catch (error) {
            console.error('Failed to load learning paths:', error);
            setError('Unable to load learning paths. Please check your connection or try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadUserSubscription = async () => {
        if (!user) return;
        try {
            const subscription = await getUserSubscription();
            if (subscription) {
                setUserTier(subscription.tier.name);
            }
        } catch (error) {
            console.error('Failed to load user subscription:', error);
        }
    };

    const handleStartPath = async (pathId: string) => {
        if (!user) {
            toast({
                title: 'Authentication Required',
                description: 'Please sign in to start a learning path.',
                variant: 'destructive',
            });
            navigate('/auth');
            return;
        }

        try {
            setEnrollingPathId(pathId);
            const progress = await startPath(pathId);

            // Update the paths state to include the new progress
            setPaths(prevPaths =>
                prevPaths.map(p =>
                    p.id === pathId
                        ? { ...p, userProgress: progress }
                        : p
                )
            );

            toast({
                title: 'Learning Path Started!',
                description: 'You can now continue your learning journey.',
            });
        } catch (error) {
            console.error('Failed to start path:', error);
            toast({
                title: 'Failed to Start Path',
                description: 'Unable to start the learning path. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setEnrollingPathId(null);
        }
    };

    const categories = ['all', ...Array.from(new Set(paths.map(p => p.category)))];

    const filteredPaths = paths.filter(path => {
        const matchesSearch =
            path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory || path.categoryId === selectedCategory;
        const matchesDifficulty = !selectedDifficulty || path.difficultyLevel === selectedDifficulty;
        const matchesTier = selectedTier === 'all' || path.tierRequired === selectedTier;
        return matchesSearch && matchesCategory && matchesDifficulty && matchesTier;
    });

    const isPathLocked = (path: LearningPathWithProgress): boolean => {
        if (!user) return path.tierRequired !== 'free';
        const tierHierarchy: Record<TierLevel, number> = { free: 0, pro: 1, premium: 2 };
        return tierHierarchy[path.tierRequired] > tierHierarchy[userTier];
    };

    const activePaths = filteredPaths.filter(p => p.userProgress && !p.userProgress.completedAt);
    const availablePaths = filteredPaths.filter(p => !p.userProgress);
    const completedPaths = filteredPaths.filter(p => p.userProgress?.completedAt);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading learning paths...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
                    <p className="text-muted-foreground">
                        Structured journeys to master real-world skills through project-based learning
                    </p>
                </motion.div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={loadPaths}>
                                    Try Again
                                </Button>
                                {!user && (
                                    <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                                        Sign In
                                    </Button>
                                )}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search learning paths by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Category, Difficulty, and Tier Filters */}
                    <div className="flex flex-col gap-4">
                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="capitalize"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Difficulty Filter */}
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={selectedDifficulty === null ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedDifficulty(null)}
                                >
                                    All Levels
                                </Button>
                                {difficulties.map(difficulty => (
                                    <Button
                                        key={difficulty}
                                        variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                        className="capitalize"
                                    >
                                        {DIFFICULTY_LABELS[difficulty]}
                                    </Button>
                                ))}
                            </div>

                            {/* Tier Filter */}
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant={selectedTier === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedTier('all')}
                                >
                                    All Tiers
                                </Button>
                                <Button
                                    variant={selectedTier === 'free' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedTier('free')}
                                >
                                    Free
                                </Button>
                                <Button
                                    variant={selectedTier === 'pro' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedTier('pro')}
                                >
                                    Pro
                                </Button>
                                <Button
                                    variant={selectedTier === 'premium' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedTier('premium')}
                                >
                                    Premium
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Active Paths Section */}
                {activePaths.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-6 w-6" />
                            Continue Learning
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {activePaths.map((path, index) => (
                                <PathCard
                                    key={path.id}
                                    path={path}
                                    index={index}
                                    isLocked={isPathLocked(path)}
                                    userTier={userTier}
                                    onNavigate={() => navigate(`/learning-paths/${path.id}`)}
                                    onStartPath={() => handleStartPath(path.id)}
                                    isEnrolling={enrollingPathId === path.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Available Paths Section */}
                {availablePaths.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            {activePaths.length > 0 ? 'Explore More Paths' : 'Start Your Journey'}
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {availablePaths.map((path, index) => (
                                <PathCard
                                    key={path.id}
                                    path={path}
                                    index={index}
                                    isLocked={isPathLocked(path)}
                                    userTier={userTier}
                                    onNavigate={() => navigate(`/learning-paths/${path.id}`)}
                                    onStartPath={() => handleStartPath(path.id)}
                                    isEnrolling={enrollingPathId === path.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Completed Paths Section */}
                {completedPaths.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            Completed Paths
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedPaths.map((path, index) => (
                                <PathCard
                                    key={path.id}
                                    path={path}
                                    index={index}
                                    isLocked={isPathLocked(path)}
                                    userTier={userTier}
                                    onNavigate={() => navigate(`/learning-paths/${path.id}`)}
                                    onStartPath={() => handleStartPath(path.id)}
                                    isEnrolling={enrollingPathId === path.id}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {filteredPaths.length === 0 && !error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery || selectedCategory !== 'all' || selectedDifficulty ? 'No paths found' : 'No learning paths available'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || selectedCategory !== 'all' || selectedDifficulty
                                ? 'Try adjusting your search or filters'
                                : user
                                    ? 'Check back soon for new learning paths'
                                    : 'Sign in to access learning paths'
                            }
                        </p>
                        {!user && (
                            <Button onClick={() => navigate('/auth')}>
                                Sign In to Get Started
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
}

interface PathCardProps {
    path: LearningPathWithProgress;
    index: number;
    isLocked: boolean;
    userTier: TierLevel;
    onNavigate: () => void;
    onStartPath?: () => void;
    isEnrolling?: boolean;
}

function PathCard({ path, index, isLocked, userTier, onNavigate, onStartPath, isEnrolling = false }: PathCardProps) {
    const isCompleted = !!path.userProgress?.completedAt;
    const isInProgress = !!path.userProgress && !isCompleted;
    const progress = path.userProgress?.completionPercentage || 0;
    const navigate = useNavigate();

    const handleClick = () => {
        if (isLocked) {
            navigate('/pricing');
        } else {
            onNavigate();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={`hover:shadow-lg transition-all cursor-pointer group h-full relative ${isLocked ? 'opacity-75' : ''}`} onClick={handleClick}>
                {/* Lock Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center">
                        <div className="text-center p-4">
                            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">Upgrade Required</p>
                            <TierBadge tier={path.tierRequired} size="sm" />
                        </div>
                    </div>
                )}

                <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={DIFFICULTY_COLORS[path.difficultyLevel]}>
                                {DIFFICULTY_LABELS[path.difficultyLevel]}
                            </Badge>
                            <TierBadge tier={path.tierRequired} size="sm" />
                        </div>
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{path.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3">
                        {/* Progress Bar (if in progress) */}
                        {isInProgress && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                    {path.userProgress?.completedProjects} of {path.totalProjects} projects completed
                                </p>
                            </div>
                        )}

                        {/* Path Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{path.totalProjects} projects</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{path.estimatedHours}h</span>
                            </div>
                        </div>

                        <Badge variant="outline" className="capitalize">
                            {path.category}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        variant={isLocked ? 'default' : isInProgress ? 'default' : 'outline'}
                        disabled={isEnrolling}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isLocked) {
                                navigate('/pricing');
                            } else if (!isCompleted && !isInProgress && onStartPath) {
                                onStartPath();
                            } else {
                                onNavigate();
                            }
                        }}
                    >
                        {isLocked ? (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Upgrade to Unlock
                            </>
                        ) : isEnrolling ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enrolling...
                            </>
                        ) : isCompleted ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Completed • Review
                            </>
                        ) : isInProgress ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                Enrolled • Continue
                            </>
                        ) : (
                            <>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Start Path
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
