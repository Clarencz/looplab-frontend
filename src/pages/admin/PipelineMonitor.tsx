import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/admin';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

const AGENT_NAMES = {
    Analyzer: 'Project Analyzer',
    Mapper: 'Curriculum Mapper',
    Validator: 'Test Validator',
    Enhancer: 'Test Enhancer',
    Linker: 'Documentation Linker',
    Assessor: 'Difficulty Assessor',
    Reviewer: 'Final Reviewer',
};

const AGENT_DESCRIPTIONS = {
    Analyzer: 'Analyzing project structure, tech stack, and complexity',
    Mapper: 'Mapping project to curriculum topics and learning paths',
    Validator: 'Validating test quality and behavior-based testing',
    Enhancer: 'Enhancing tests for better coverage and quality',
    Linker: 'Adding documentation links and learning resources',
    Assessor: 'Assessing difficulty level and tier assignment',
    Reviewer: 'Performing final quality review and approval',
};

export default function PipelineMonitor() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    // Poll pipeline status every 2 seconds
    const { data: pipelineStatus, refetch } = useQuery({
        queryKey: ['admin', 'pipeline-status', projectId],
        queryFn: () => adminApi.getPipelineStatus(projectId!),
        enabled: !!projectId,
        refetchInterval: (data) => {
            // Stop polling if completed or failed
            if (data?.status === 'completed' || data?.status === 'failed') {
                return false;
            }
            return 2000; // Poll every 2 seconds
        },
    });

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'failed':
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'running':
                return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
            default:
                return <Clock className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'running':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const formatTime = (ms: number | null) => {
        if (!ms) return '-';
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const getOverallProgress = () => {
        if (!pipelineStatus?.agents) return 0;
        const completed = pipelineStatus.agents.filter(
            (a) => a.status.toLowerCase() === 'completed'
        ).length;
        return Math.round((completed / pipelineStatus.agents.length) * 100);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Projects
                </button>
                <h1 className="text-3xl font-bold text-gray-900">AI Pipeline Monitor</h1>
                <p className="text-gray-600 mt-2">
                    Track the progress of AI agents processing your project
                </p>
            </div>

            {/* Overall Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Pipeline Status</h2>
                        <p className="text-sm text-gray-600">Project ID: {projectId}</p>
                    </div>
                    <div
                        className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(
                            pipelineStatus?.status || 'pending'
                        )}`}
                    >
                        {pipelineStatus?.status || 'Loading...'}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-700">{getOverallProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${getOverallProgress()}%` }}
                        />
                    </div>
                </div>

                {/* Execution Time */}
                {pipelineStatus?.totalExecutionTimeMs !== undefined && (
                    <div className="text-sm text-gray-600">
                        Total Execution Time: <span className="font-semibold">
                            {formatTime(pipelineStatus.totalExecutionTimeMs)}
                        </span>
                    </div>
                )}
            </div>

            {/* Agent Status Cards */}
            <div className="space-y-4">
                {pipelineStatus?.agents.map((agent, index) => {
                    const agentKey = agent.agentName as keyof typeof AGENT_NAMES;
                    const agentName = AGENT_NAMES[agentKey] || agent.agentName;
                    const agentDesc = AGENT_DESCRIPTIONS[agentKey] || 'Processing...';

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start flex-1">
                                    <div className="mr-4 mt-1">{getStatusIcon(agent.status)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {index + 1}. {agentName}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                                    agent.status
                                                )}`}
                                            >
                                                {agent.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{agentDesc}</p>

                                        {/* Execution Time */}
                                        {agent.executionTimeMs !== null && (
                                            <div className="text-sm text-gray-500">
                                                <Clock className="w-4 h-4 inline mr-1" />
                                                Execution time: {formatTime(agent.executionTimeMs)}
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {agent.errorMessage && (
                                            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className="text-sm text-red-800 font-medium">Error:</p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    {agent.errorMessage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            {pipelineStatus?.status === 'completed' && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-green-900">
                                Pipeline Completed Successfully!
                            </h3>
                            <p className="text-sm text-green-700 mt-1">
                                The project is ready for review and approval
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/projects/${projectId}/review`)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Review Project
                        </button>
                    </div>
                </div>
            )}

            {pipelineStatus?.status === 'failed' && (
                <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-900">Pipeline Failed</h3>
                            <p className="text-sm text-red-700 mt-1">
                                One or more agents encountered errors during processing
                            </p>
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
