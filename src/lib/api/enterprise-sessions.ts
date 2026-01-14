import { apiClient } from './client';

// ============================================================================
// Session Types
// ============================================================================

export interface AssessmentSession {
    id: string;
    assessmentId: string;
    candidateId: string;
    token: string;
    expiresAt: string;
    status: 'pending' | 'in_progress' | 'submitted' | 'expired' | 'flagged';
    startedAt?: string;
    submittedAt?: string;
    timeTakenMinutes?: number;
    cameraVerified: boolean;
    tabSwitches: number;
    copyPasteEvents: number;
    screenshotAttempts: number;
    cameraRecordingUrl?: string;
    recordingExpiresAt?: string;
    recordingDownloaded: boolean;
    submissionCode?: any;
    testsWritten?: any;
    executionResults?: any;
    aiScore?: number;
    aiReport?: any;
    manualScore?: number;
    manualNotes?: string;
    finalDecision?: 'pass' | 'fail' | 'pending';
    createdAt: string;
    updatedAt: string;
}

export interface CreateSessionRequest {
    assessmentId: string;
    candidateEmail: string;
    candidateFirstName?: string;
    candidateLastName?: string;
}

export interface AntiCheatingEvent {
    eventType: 'tab_switch' | 'copy_paste' | 'screenshot_attempt';
    cameraVerified?: boolean;
}

export interface SubmitSessionRequest {
    submissionCode: any;
    testsWritten: any;
    executionResults?: any;
}

// ============================================================================
// API Functions
// ============================================================================

export const createSession = async (data: CreateSessionRequest): Promise<{ session: AssessmentSession; assessmentUrl: string }> => {
    const response = await apiClient.post<{ session: AssessmentSession; assessmentUrl: string }>('/enterprise/sessions', data);
    return response.data;
};

export const getSessionByToken = async (token: string): Promise<AssessmentSession> => {
    const response = await apiClient.get<AssessmentSession>(`/enterprise/sessions/token/${token}`);
    return response.data;
};

export const startSession = async (id: string): Promise<AssessmentSession> => {
    const response = await apiClient.post<AssessmentSession>(`/enterprise/sessions/${id}/start`);
    return response.data;
};

export const logAntiCheatingEvent = async (id: string, event: AntiCheatingEvent): Promise<AssessmentSession> => {
    const response = await apiClient.post<AssessmentSession>(`/enterprise/sessions/${id}/anti-cheating`, event);
    return response.data;
};

export const submitSession = async (id: string, data: SubmitSessionRequest): Promise<AssessmentSession> => {
    const response = await apiClient.post<AssessmentSession>(`/enterprise/sessions/${id}/submit`, data);
    return response.data;
};
