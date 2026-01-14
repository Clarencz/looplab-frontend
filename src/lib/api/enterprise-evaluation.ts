import { apiClient } from './client';
import type { AssessmentSession } from './enterprise-sessions';

// ============================================================================
// Evaluation Types
// ============================================================================

export interface TriggerAIEvaluationRequest {
    sessionId: string;
}

export interface ManualEvaluationRequest {
    sessionId: string;
    manualScore: number;
    manualNotes?: string;
    finalDecision: 'pass' | 'fail' | 'pending';
}

// ============================================================================
// API Functions
// ============================================================================

export const triggerAIEvaluation = async (data: TriggerAIEvaluationRequest): Promise<{ session: AssessmentSession }> => {
    const response = await apiClient.post<{ session: AssessmentSession }>('/enterprise/evaluation/ai', data);
    return response.data;
};

export const submitManualEvaluation = async (data: ManualEvaluationRequest): Promise<{ session: AssessmentSession }> => {
    const response = await apiClient.post<{ session: AssessmentSession }>('/enterprise/evaluation/manual', data);
    return response.data;
};

export const getAssessmentResults = async (assessmentId: string): Promise<AssessmentSession[]> => {
    const response = await apiClient.get<AssessmentSession[]>(`/enterprise/assessments/${assessmentId}/results`);
    return response.data;
};
