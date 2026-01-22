import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle2, Circle, Clock } from 'lucide-react';

interface AlgorithmProblem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    tags: string[];
    acceptance_rate: number;
    total_submissions: number;
    user_status?: 'not_started' | 'attempted' | 'solved';
}

export default function AlgorithmProblems() {
    const [problems, setProblems] = useState<AlgorithmProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<string>('all');
    const [category, setCategory] = useState<string>('all');

    useEffect(() => {
        fetchProblems();
    }, [difficulty, category, search]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (difficulty !== 'all') params.append('difficulty', difficulty);
            if (category !== 'all') params.append('category', category);
            if (search) params.append('search', search);

            const response = await fetch(`/api/v1/algorithms/problems?${params}`);
            const data = await response.json();
            setProblems(data.problems || []);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'easy':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'hard':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'solved':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'attempted':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Algorithm Problems</h1>
                <p className="text-muted-foreground">
                    Master algorithms through real-world problem solving
                </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search problems..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Difficulties</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="arrays">Arrays</SelectItem>
                                <SelectItem value="strings">Strings</SelectItem>
                                <SelectItem value="linked-lists">Linked Lists</SelectItem>
                                <SelectItem value="trees">Trees</SelectItem>
                                <SelectItem value="graphs">Graphs</SelectItem>
                                <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Problems List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading problems...</p>
                </div>
            ) : problems.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No problems found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {problems.map((problem) => (
                        <Link key={problem.id} to={`/algorithms/${problem.slug}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Status Icon */}
                                            <div>{getStatusIcon(problem.user_status)}</div>

                                            {/* Problem Info */}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-1">
                                                    {problem.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="capitalize">{problem.category}</span>
                                                    <span>•</span>
                                                    <span>{problem.acceptance_rate.toFixed(1)}% Acceptance</span>
                                                    <span>•</span>
                                                    <span>{problem.total_submissions} submissions</span>
                                                </div>
                                            </div>

                                            {/* Difficulty Badge */}
                                            <Badge className={getDifficultyColor(problem.difficulty)}>
                                                {problem.difficulty}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {problem.tags && problem.tags.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {problem.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
