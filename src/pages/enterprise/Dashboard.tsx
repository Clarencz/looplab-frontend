import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listCompanyAssessments, type Assessment } from '../../lib/api/enterprise';
import { createSession } from '../../lib/api/enterprise-sessions';
import { Building2, Plus, FileText, Clock, Users, Send, Copy, CheckCircle, ExternalLink, BarChart3 } from 'lucide-react';
import { AssessmentCardSkeleton } from '../../components/enterprise/LoadingStates';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export default function EnterpriseDashboard() {
    // Test company ID - replace with real company from auth context in production
    const companyId = '00000000-0000-0000-0000-000000000001';
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

    const { data: assessments, isLoading } = useQuery({
        queryKey: ['company-assessments', companyId],
        queryFn: () => listCompanyAssessments(companyId),
        enabled: true, // Enabled for testing - set to false in production until auth is ready
    });

    const handleCreateAssessment = () => {
        // TODO: Navigate to assessment creation page
        alert('Assessment creation flow coming soon!');
    };

    const handleInviteCandidate = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setShowInviteModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Enterprise Dashboard</h1>
                                <p className="text-sm text-gray-500">Manage technical assessments & candidates</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateAssessment}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus className="h-5 w-5" />
                            <span className="font-medium">Create Assessment</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<FileText className="h-6 w-6 text-blue-600" />}
                        label="Total Assessments"
                        value="0"
                        bgColor="bg-blue-50"
                        iconBg="bg-blue-100"
                    />
                    <StatCard
                        icon={<Users className="h-6 w-6 text-green-600" />}
                        label="Active Candidates"
                        value="0"
                        bgColor="bg-green-50"
                        iconBg="bg-green-100"
                    />
                    <StatCard
                        icon={<Clock className="h-6 w-6 text-purple-600" />}
                        label="Pending Reviews"
                        value="0"
                        bgColor="bg-purple-50"
                        iconBg="bg-purple-100"
                    />
                    <StatCard
                        icon={<BarChart3 className="h-6 w-6 text-orange-600" />}
                        label="Completion Rate"
                        value="0%"
                        bgColor="bg-orange-50"
                        iconBg="bg-orange-100"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <QuickActionCard
                            icon={<Plus className="h-5 w-5" />}
                            title="Create Assessment"
                            description="Set up a new technical challenge"
                            onClick={handleCreateAssessment}
                        />
                        <QuickActionCard
                            icon={<Send className="h-5 w-5" />}
                            title="Invite Candidates"
                            description="Send assessment links"
                            onClick={() => alert('Select an assessment first')}
                        />
                        <QuickActionCard
                            icon={<BarChart3 className="h-5 w-5" />}
                            title="View Analytics"
                            description="Track performance metrics"
                            onClick={() => alert('Analytics coming soon!')}
                        />
                    </div>
                </div>

                {/* Assessments List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Your Assessments</h2>
                        <span className="text-sm text-gray-500">{assessments?.length || 0} total</span>
                    </div>
                    <div className="p-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                <AssessmentCardSkeleton />
                                <AssessmentCardSkeleton />
                                <AssessmentCardSkeleton />
                            </div>
                        ) : assessments && assessments.length > 0 ? (
                            <div className="space-y-4">
                                {assessments.map((assessment) => (
                                    <EnhancedAssessmentCard
                                        key={assessment.id}
                                        assessment={assessment}
                                        onInvite={() => handleInviteCandidate(assessment)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    Create your first assessment to start evaluating candidates
                                </p>
                                <button
                                    onClick={handleCreateAssessment}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create Your First Assessment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && selectedAssessment && (
                <InviteCandidateModal
                    assessment={selectedAssessment}
                    onClose={() => {
                        setShowInviteModal(false);
                        setSelectedAssessment(null);
                    }}
                />
            )}
        </div>
    );
}

// Components
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    bgColor: string;
    iconBg: string;
}

function StatCard({ icon, label, value, bgColor, iconBg }: StatCardProps) {
    return (
        <div className={`${bgColor} rounded-xl p-6 border border-gray-200 transition-all hover:shadow-md`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}

interface QuickActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
        >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </button>
    );
}

interface EnhancedAssessmentCardProps {
    assessment: Assessment;
    onInvite: () => void;
}

function EnhancedAssessmentCard({ assessment, onInvite }: EnhancedAssessmentCardProps) {
    const statusColors = {
        draft: 'bg-gray-100 text-gray-800 border-gray-300',
        active: 'bg-green-100 text-green-800 border-green-300',
        archived: 'bg-red-100 text-red-800 border-red-300',
    };

    const difficultyColors = {
        junior: 'text-green-600',
        mid: 'text-yellow-600',
        senior: 'text-red-600',
    };

    return (
        <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all bg-white">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{assessment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[assessment.status]}`}>
                            {assessment.status}
                        </span>
                    </div>
                    {assessment.description && (
                        <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {assessment.timeLimitMinutes} min
                        </span>
                        {assessment.difficulty && (
                            <span className={`font-medium ${difficultyColors[assessment.difficulty]}`}>
                                {assessment.difficulty.charAt(0).toUpperCase() + assessment.difficulty.slice(1)} Level
                            </span>
                        )}
                        <span className="capitalize">{assessment.evaluationMode} evaluation</span>
                        <span className="capitalize">{assessment.creationMethod.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link
                    to={`/enterprise/assessments/${assessment.id}/results`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    <BarChart3 className="h-4 w-4" />
                    View Results
                </Link>
                <button
                    onClick={onInvite}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Send className="h-4 w-4" />
                    Invite Candidate
                </button>
            </div>
        </div>
    );
}

interface InviteCandidateModalProps {
    assessment: Assessment;
    onClose: () => void;
}

function InviteCandidateModal({ assessment, onClose }: InviteCandidateModalProps) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const createSessionMutation = useMutation({
        mutationFn: createSession,
        onSuccess: (data) => {
            const fullUrl = `${window.location.origin}${data.assessmentUrl}`;
            setGeneratedUrl(fullUrl);
            toast({
                title: 'Session created!',
                description: 'Assessment link generated successfully.',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create assessment session.',
                variant: 'destructive',
            });
        },
    });

    const handleGenerate = () => {
        if (!email) {
            toast({
                title: 'Email required',
                description: 'Please enter candidate email.',
                variant: 'destructive',
            });
            return;
        }

        createSessionMutation.mutate({
            assessmentId: assessment.id,
            candidateEmail: email,
            candidateFirstName: firstName || undefined,
            candidateLastName: lastName || undefined,
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: 'Assessment link copied to clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Invite Candidate</h2>
                <p className="text-sm text-gray-600 mb-6">Assessment: <span className="font-medium">{assessment.title}</span></p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="candidate@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {generatedUrl && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-2">Assessment Link Generated:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={generatedUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
                            />
                            <button
                                onClick={handleCopy}
                                className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-green-700 mt-2">
                            Send this link to the candidate. It expires in 24 hours.
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={createSessionMutation.isPending}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {createSessionMutation.isPending ? 'Generating...' : 'Generate Link'}
                    </button>
                </div>
            </div>
        </div>
    );
}
