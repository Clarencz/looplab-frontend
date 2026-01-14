import { Clock, Camera, AlertTriangle } from 'lucide-react';
import type { Assessment } from '../../lib/api/enterprise';

interface AssessmentIntroProps {
    assessment: Assessment;
    onStart: () => void;
    isStarting: boolean;
}

export default function AssessmentIntro({
    assessment,
    onStart,
    isStarting,
}: AssessmentIntroProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{assessment.title}</h1>
                {assessment.description && (
                    <p className="text-gray-600 mb-6">{assessment.description}</p>
                )}

                <div className="space-y-4 mb-8">
                    <InfoCard
                        icon={Clock}
                        iconColor="text-blue-600"
                        bgColor="bg-blue-50"
                        title="Time Limit"
                        description={`${assessment.timeLimitMinutes} minutes`}
                    />

                    <InfoCard
                        icon={Camera}
                        iconColor="text-green-600"
                        bgColor="bg-green-50"
                        title="Camera Required"
                        description="Your camera will be monitored during the assessment"
                    />

                    <InfoCard
                        icon={AlertTriangle}
                        iconColor="text-yellow-600"
                        bgColor="bg-yellow-50"
                        title="Anti-Cheating Measures"
                        description="Tab switches, copy/paste, and screenshots are monitored"
                    />
                </div>

                <button
                    onClick={onStart}
                    disabled={isStarting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isStarting ? 'Starting...' : 'Start Assessment'}
                </button>
            </div>
        </div>
    );
}

// Info card sub-component
interface InfoCardProps {
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    title: string;
    description: string;
}

function InfoCard({ icon: Icon, iconColor, bgColor, title, description }: InfoCardProps) {
    return (
        <div className={`flex items-center gap-3 p-4 ${bgColor} rounded-lg`}>
            <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
}
