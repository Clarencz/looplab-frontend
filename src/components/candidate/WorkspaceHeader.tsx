import { Clock, Camera, Send } from 'lucide-react';
import { formatTime } from '../../hooks/useAssessmentSession';

interface WorkspaceHeaderProps {
    title: string;
    timeRemaining: number | null;
    isMonitoring: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export default function WorkspaceHeader({
    title,
    timeRemaining,
    isMonitoring,
    isSubmitting,
    onSubmit,
}: WorkspaceHeaderProps) {
    return (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
                <h1 className="text-white font-semibold truncate">{title}</h1>
                {timeRemaining !== null && (
                    <TimerDisplay seconds={timeRemaining} />
                )}
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
                <CameraIndicator isMonitoring={isMonitoring} />
                <SubmitButton isSubmitting={isSubmitting} onSubmit={onSubmit} />
            </div>
        </div>
    );
}

// Timer display sub-component
function TimerDisplay({ seconds }: { seconds: number }) {
    const isLowTime = seconds < 300; // Less than 5 minutes

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isLowTime ? 'bg-red-600' : 'bg-gray-700'
            }`}>
            <Clock className={`h-4 w-4 ${isLowTime ? 'text-white' : 'text-blue-400'}`} />
            <span className="text-white font-mono">{formatTime(seconds)}</span>
        </div>
    );
}

// Camera indicator sub-component
function CameraIndicator({ isMonitoring }: { isMonitoring: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <Camera className={`h-5 w-5 ${isMonitoring ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-sm text-gray-300 hidden sm:inline">
                {isMonitoring ? 'Monitoring' : 'Not monitoring'}
            </span>
        </div>
    );
}

// Submit button sub-component
function SubmitButton({ isSubmitting, onSubmit }: { isSubmitting: boolean; onSubmit: () => void }) {
    return (
        <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        </button>
    );
}
