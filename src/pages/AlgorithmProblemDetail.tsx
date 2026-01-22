import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    Play,
    Send,
    CheckCircle2,
    XCircle,
    Clock,
    Lightbulb,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Editor from '@monaco-editor/react';

interface AlgorithmProblem {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    category: string;
    description: string;
    constraints: string;
    examples: Array<{
        input: string;
        output: string;
        explanation: string;
    }>;
    starter_code: Record<string, string>;
    hints: Array<{
        order: number;
        content: string;
    }>;
    time_complexity: string;
    space_complexity: string;
    tags: string[];
}

interface TestResult {
    test_case_id: number;
    passed: boolean;
    input: any;
    expected_output: any;
    actual_output: any;
    execution_time_ms: number;
    error?: string;
}

interface SubmissionResult {
    submission_id: string;
    status: string;
    test_results: TestResult[];
    total_tests: number;
    passed_tests: number;
    execution_time_ms: number;
}

export default function AlgorithmProblemDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [problem, setProblem] = useState<AlgorithmProblem | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
    const [showHints, setShowHints] = useState(false);
    const [revealedHints, setRevealedHints] = useState<number[]>([]);

    useEffect(() => {
        fetchProblem();
    }, [slug]);

    useEffect(() => {
        if (problem && problem.starter_code[language]) {
            setCode(problem.starter_code[language]);
        }
    }, [language, problem]);

    const fetchProblem = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/algorithms/problems/${slug}`);
            const data = await response.json();
            setProblem(data);
            if (data.starter_code[language]) {
                setCode(data.starter_code[language]);
            }
        } catch (error) {
            console.error('Failed to fetch problem:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRunCode = async () => {
        if (!problem) return;

        setRunning(true);
        setTestResults([]);

        try {
            const response = await fetch('/api/v1/algorithms/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem_id: problem.id,
                    language,
                    code,
                }),
            });

            const result = await response.json();
            setTestResults(result.test_results || []);
        } catch (error) {
            console.error('Failed to run code:', error);
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!problem) return;

        setSubmitting(true);
        setSubmissionResult(null);

        try {
            const response = await fetch('/api/v1/algorithms/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem_id: problem.id,
                    language,
                    code,
                }),
            });

            const result = await response.json();

            // Poll for submission result
            if (result.submission_id) {
                pollSubmissionStatus(result.submission_id);
            }
        } catch (error) {
            console.error('Failed to submit:', error);
            setSubmitting(false);
        }
    };

    const pollSubmissionStatus = async (submissionId: string) => {
        const maxAttempts = 30;
        let attempts = 0;

        const poll = setInterval(async () => {
            attempts++;

            try {
                const response = await fetch(`/api/v1/algorithms/submissions/${submissionId}`);
                const result = await response.json();

                if (result.status !== 'pending' && result.status !== 'running') {
                    clearInterval(poll);
                    setSubmissionResult(result);
                    setSubmitting(false);
                }

                if (attempts >= maxAttempts) {
                    clearInterval(poll);
                    setSubmitting(false);
                }
            } catch (error) {
                console.error('Failed to poll submission:', error);
                clearInterval(poll);
                setSubmitting(false);
            }
        }, 1000);
    };

    const revealHint = (index: number) => {
        setRevealedHints([...revealedHints, index]);
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

    const getLanguageExtension = (lang: string) => {
        switch (lang) {
            case 'python':
                return 'python';
            case 'javascript':
                return 'javascript';
            case 'typescript':
                return 'typescript';
            case 'rust':
                return 'rust';
            case 'go':
                return 'go';
            default:
                return 'python';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertDescription>Problem not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="border-b p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Left Panel - Problem Description */}
                <div className="w-1/2 border-r overflow-auto">
                    <div className="p-6">
                        <Tabs defaultValue="description">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="examples">Examples</TabsTrigger>
                                <TabsTrigger value="constraints">Constraints</TabsTrigger>
                                <TabsTrigger value="hints">Hints</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="space-y-4 mt-4">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap">{problem.description}</p>
                                </div>

                                <div className="flex gap-2">
                                    {problem.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                {problem.time_complexity && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold">Complexity:</p>
                                        <div className="flex gap-4 text-sm">
                                            <span>Time: <code className="bg-muted px-2 py-1 rounded">{problem.time_complexity}</code></span>
                                            <span>Space: <code className="bg-muted px-2 py-1 rounded">{problem.space_complexity}</code></span>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="examples" className="space-y-4 mt-4">
                                {problem.examples.map((example, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="text-base">Example {index + 1}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div>
                                                <p className="text-sm font-semibold">Input:</p>
                                                <code className="block bg-muted p-2 rounded mt-1 text-sm">
                                                    {example.input}
                                                </code>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">Output:</p>
                                                <code className="block bg-muted p-2 rounded mt-1 text-sm">
                                                    {example.output}
                                                </code>
                                            </div>
                                            {example.explanation && (
                                                <div>
                                                    <p className="text-sm font-semibold">Explanation:</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {example.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="constraints" className="mt-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <pre className="whitespace-pre-wrap text-sm">{problem.constraints}</pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="hints" className="space-y-3 mt-4">
                                {problem.hints && problem.hints.length > 0 ? (
                                    problem.hints.map((hint, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-4">
                                                {revealedHints.includes(index) ? (
                                                    <div className="flex items-start gap-3">
                                                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                                                        <p className="text-sm">{hint.content}</p>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => revealHint(index)}
                                                        className="w-full"
                                                    >
                                                        <Lightbulb className="w-4 h-4 mr-2" />
                                                        Reveal Hint {index + 1}
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No hints available</p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Panel - Code Editor & Results */}
                <div className="w-1/2 flex flex-col">
                    {/* Code Editor */}
                    <div className="flex-1 min-h-0">
                        <Editor
                            height="100%"
                            language={getLanguageExtension(language)}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t p-4 flex gap-3">
                        <Button
                            onClick={handleRunCode}
                            disabled={running || submitting}
                            variant="outline"
                            className="flex-1"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            {running ? 'Running...' : 'Run Code'}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={running || submitting}
                            className="flex-1"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>

                    {/* Test Results */}
                    <div className="border-t p-4 overflow-auto max-h-80">
                        {testResults.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold">Test Results</h3>
                                {testResults.map((result, index) => (
                                    <Card key={index} className={result.passed ? 'border-green-600' : 'border-red-600'}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {result.passed ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <span className="font-semibold">
                                                        Test Case {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    {result.execution_time_ms}ms
                                                </div>
                                            </div>

                                            {!result.passed && (
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <p className="font-semibold">Input:</p>
                                                        <code className="block bg-muted p-2 rounded mt-1">
                                                            {JSON.stringify(result.input)}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Expected:</p>
                                                        <code className="block bg-muted p-2 rounded mt-1">
                                                            {JSON.stringify(result.expected_output)}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Got:</p>
                                                        <code className="block bg-muted p-2 rounded mt-1">
                                                            {JSON.stringify(result.actual_output)}
                                                        </code>
                                                    </div>
                                                    {result.error && (
                                                        <Alert variant="destructive">
                                                            <AlertDescription>{result.error}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {submissionResult && (
                            <div className="space-y-3">
                                <Card className={submissionResult.status === 'accepted' ? 'border-green-600' : 'border-red-600'}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {submissionResult.status === 'accepted' ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    <span className="text-green-600">Accepted!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                    <span className="text-red-600">Failed</span>
                                                </>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                Passed {submissionResult.passed_tests} / {submissionResult.total_tests} test cases
                                            </p>
                                            <p className="text-muted-foreground">
                                                Runtime: {submissionResult.execution_time_ms}ms
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
