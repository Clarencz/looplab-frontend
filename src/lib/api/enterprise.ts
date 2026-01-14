import { apiClient } from './client';

// ============================================================================
// Types
// ============================================================================

export interface Company {
    id: string;
    name: string;
    slug: string;
    contactEmail: string;
    subscriptionId?: string;
    assessmentsRemaining: number;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Assessment {
    id: string;
    companyId: string;
    createdBy: string;
    title: string;
    description?: string;
    creationMethod: 'ai_broken' | 'pre_broken' | 'ai_generated';
    originalProjectUrl?: string;
    industryProblemDescription?: string;
    brokenProjectData: any;
    breakingConfig?: any;
    timeLimitMinutes: number;
    requiredLanguage?: string;
    difficulty?: 'junior' | 'mid' | 'senior';
    evaluationMode: 'automated' | 'manual' | 'hybrid';
    status: 'draft' | 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface CreateCompanyRequest {
    name: string;
    slug: string;
    contactEmail: string;
    logoUrl?: string;
}

export interface CreateAssessmentRequest {
    companyId: string;
    title: string;
    description?: string;
    creationMethod: 'ai_broken' | 'pre_broken' | 'ai_generated';
    originalProjectUrl?: string;
    industryProblemDescription?: string;
    brokenProjectData: any;
    breakingConfig?: any;
    timeLimitMinutes: number;
    requiredLanguage?: string;
    difficulty?: 'junior' | 'mid' | 'senior';
    evaluationMode: 'automated' | 'manual' | 'hybrid';
}

// ============================================================================
// API Functions
// ============================================================================

// Company APIs
export const createCompany = async (data: CreateCompanyRequest): Promise<Company> => {
    const response = await apiClient.post<{ success: boolean; data: Company }>('/enterprise/companies', data);
    return response.data;
};

export const getCompany = async (id: string): Promise<Company> => {
    const response = await apiClient.get<{ success: boolean; data: Company }>(`/enterprise/companies/${id}`);
    return response.data;
};

export const addCompanyAdmin = async (companyId: string, userId: string): Promise<any> => {
    const response = await apiClient.post(`/enterprise/companies/${companyId}/admins`, { userId });
    return response.data;
};

// Assessment APIs
export const createAssessment = async (data: CreateAssessmentRequest): Promise<Assessment> => {
    const response = await apiClient.post<{ success: boolean; data: Assessment }>('/enterprise/assessments', data);
    return response.data;
};

export const getAssessment = async (id: string): Promise<Assessment> => {
    const response = await apiClient.get<{ success: boolean; data: Assessment }>(`/enterprise/assessments/${id}`);
    return response.data;
};

export const listCompanyAssessments = async (companyId: string): Promise<Assessment[]> => {
    const response = await apiClient.get<Assessment[]>(`/enterprise/companies/${companyId}/assessments`);
    return response;
};

export const updateAssessmentStatus = async (
    id: string,
    status: 'draft' | 'active' | 'archived'
): Promise<Assessment> => {
    const response = await apiClient.patch<{ success: boolean; data: Assessment }>(`/enterprise/assessments/${id}/status`, { status });
    return response.data;
};
