import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssessment } from '../../lib/api/enterprise';
import { getAssessmentResults, triggerAIEvaluation, submitManualEvaluation } from '../../lib/api/enterprise-evaluation';
import type { AssessmentSession } from '../../lib/api/enterprise-sessions';
import { CheckCircle, XCircle, Clock, Brain, User, FileText } from 'lucide-react';
import { SessionCardSkeleton } from '../../components/enterprise/LoadingStates';
import { useToast } from '@/components/ui/use-toast';

export default function CandidateResults() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const queryClient = useQueryClient();
    const [selectedSession, setSelectedSession] = useState<AssessmentSession | null>(null);
    const [manualScore, setManualScore] = useState<number>(0);
    const [manualNotes, setManualNotes] = useState<string>('');

    // Fetch assessment
    const { data: assessmentData } = useQuery({
        queryKey: ['assessment', assessmentId],
        queryFn: () => getAssessment(assessmentId!),
        enabled: !!assessmentId,
    });

    // Fetch results
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['assessment-results', assessmentId],
        queryFn: () => getAssessmentResults(assessmentId!),
        enabled: !!assessmentId,
    });

    // Mutations
    const aiEvaluationMutation = useMutation({
        mutationFn: (sessionId: string) => triggerAIEvaluation({ sessionId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment-results', assessmentId] });
        },
    });

    const manualEvaluationMutation = useMutation({
        mutationFn: (data: any) => submitManualEvaluation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment-results', assessmentId] });
            setSelectedSession(null);
            setManualScore(0);
            setManualNotes('');
        },
    });

    const handleManualSubmit = (decision: 'pass' | 'fail') => {
        if (!selectedSession) return;

        manualEvaluationMutation.mutate({
            sessionId: selectedSession.id,
            manualScore,
            manualNotes: manualNotes || undefined,
            finalDecision: decision,
        });
    };

    const assessment = assessmentData?.assessment;

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">{assessment?.title} - Results</h1>
                    <p className="text-sm text-gray-500 mt-1">{sessions?.length || 0} candidate submissions</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sessions && sessions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sessions list */}
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onSelect={() => setSelectedSession(session)}
                                    onTriggerAI={() => aiEvaluationMutation.mutate(session.id)}
                                    isSelected={selectedSession?.id === session.id}
                                />
                            ))}
                        </div>

                        {/* Session details */}
                        {selectedSession && (
                            <div className="bg-white rounded-lg shadow p-6 sticky top-4 h-fit">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Evaluation</h2>

                                {/* AI Report */}
                                {selectedSession.aiReport && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Brain className="h-4 w-4" />
                                            AI Evaluation
                                        </h3>
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-2xl font-bold text-blue-900 mb-2">
                                                {selectedSession.aiScore?.toFixed(1)}/100
                                            </p>
                                            {selectedSession.aiReport.insights && (
                                                <div className="space-y-1">
                                                    {selectedSession.aiReport.insights.map((insight: string, i: number) => (
                                                        <p key={i} className="text-sm text-gray-700">• {insight}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Manual Evaluation */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Manual Review
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Score (0-100)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={manualScore}
                                                onChange={(e) => setManualScore(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Notes
                                            </label>
                                            <textarea
                                                value={manualNotes}
                                                onChange={(e) => setManualNotes(e.target.value)}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Add your evaluation notes..."
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleManualSubmit('pass')}
                                                disabled={manualEvaluationMutation.isPending}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Pass
                                            </button>
                                            <button
                                                onClick={() => handleManualSubmit('fail')}
                                                disabled={manualEvaluationMutation.isPending}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Fail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                        <p className="text-gray-500">Candidates will appear here once they submit their assessments</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface SessionCardProps {
    session: AssessmentSession;
    onSelect: () => void;
    onTriggerAI: () => void;
    isSelected: boolean;
}

function SessionCard({ session, onSelect, onTriggerAI, isSelected }: SessionCardProps) {
    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        in_progress: 'bg-blue-100 text-blue-800',
        submitted: 'bg-green-100 text-green-800',
        expired: 'bg-red-100 text-red-800',
        flagged: 'bg-yellow-100 text-yellow-800',
    };

    const decisionColors = {
        pass: 'text-green-600',
        fail: 'text-red-600',
        pending: 'text-gray-600',
    };

    return (
        <div
            onClick={onSelect}
            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="font-medium text-gray-900">Candidate #{session.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                        {session.submittedAt ? new Date(session.submittedAt).toLocaleDateString() : 'Not submitted'}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                    {session.status.replace('_', ' ')}
                </span>
            </div>

            {session.status === 'submitted' && (
                <div className="space-y-2">
                    {/* Scores */}
                    <div className="flex items-center gap-4 text-sm">
                        {session.aiScore !== null && session.aiScore !== undefined && (
                            <div className="flex items-center gap-1">
                                <Brain className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{session.aiScore.toFixed(1)}</span>
                            </div>
                        )}
                        {session.manualScore !== null && session.manualScore !== undefined && (
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">{session.manualScore.toFixed(1)}</span>
                            </div>
                        )}
                        {session.timeTakenMinutes && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-600" />
                                <span>{session.timeTakenMinutes}m</span>
                            </div>
                        )}
                    </div>

                    {/* Decision */}
                    {session.finalDecision && (
                        <p className={`text-sm font-medium ${decisionColors[session.finalDecision]}`}>
                            Decision: {session.finalDecision.toUpperCase()}
                        </p>
                    )}

                    {/* AI Evaluation button */}
                    {!session.aiScore && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTriggerAI();
                            }}
                            className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                            Run AI Evaluation
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
