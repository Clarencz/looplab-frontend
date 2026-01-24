import { LogicQualityGrader } from '@/components/datascience/LogicQualityGrader';
import { ComprehensiveFeedbackSystem } from '@/components/datascience/ComprehensiveFeedbackSystem';
import type { ThinkingCanvasData } from '@/components/datascience/ThinkingCanvas';

interface AssessmentTabProps {
    studentWork: ThinkingCanvasData;
}

export function AssessmentTab({ studentWork }: AssessmentTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LogicQualityGrader studentWork={studentWork} />
            <ComprehensiveFeedbackSystem studentWork={studentWork} />
        </div>
    );
}
