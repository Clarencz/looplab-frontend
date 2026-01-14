import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSessionByToken } from '../../lib/api/enterprise-sessions';
import { getAssessment } from '../../lib/api/enterprise';
import { useCameraMonitor } from '../../hooks/useCameraMonitor';
import { useAntiCheating } from '../../hooks/useAntiCheating';
import { useAssessmentSession } from '../../hooks/useAssessmentSession';

// Components
import {
    AssessmentIntro,
    WorkspaceHeader,
    FileTree,
    CodeEditorPanel,
} from '../../components/candidate';

export default function AssessmentWorkspace() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    // Fetch session
    const { data: session, isLoading: sessionLoading } = useQuery({
        queryKey: ['assessment-session', token],
        queryFn: () => getSessionByToken(token!),
        enabled: !!token,
    });

    // Fetch assessment
    const { data: assessmentData } = useQuery({
        queryKey: ['assessment', session?.assessmentId],
        queryFn: () => getAssessment(session!.assessmentId),
        enabled: !!session?.assessmentId,
    });

    const assessment = assessmentData?.assessment;

    // Session management hook
    const {
        hasStarted,
        timeRemaining,
        files,
        activeFile,
        fileNames,
        setActiveFile,
        handleFileChange,
        handleSubmit,
        handleStart,
        logEvent,
        isStarting,
        isSubmitting,
    } = useAssessmentSession({
        session,
        assessment,
        onSubmitSuccess: () => navigate('/candidate/assessment/complete'),
    });

    // Camera monitoring
    const {
        isMonitoring,
        videoRef,
        requestCameraPermission,
    } = useCameraMonitor({
        onCameraVerified: (verified) => {
            if (session && verified) {
                logEvent({ eventType: 'tab_switch', cameraVerified: true });
            }
        },
    });

    // Anti-cheating detection
    useAntiCheating({
        onTabSwitch: () => logEvent({ eventType: 'tab_switch' }),
        onCopyPaste: () => logEvent({ eventType: 'copy_paste' }),
        onScreenshotAttempt: () => logEvent({ eventType: 'screenshot_attempt' }),
    });

    // Loading state
    if (sessionLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading assessment...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!session || !assessment) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Session not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // Pre-start screen
    if (!hasStarted) {
        return (
            <AssessmentIntro
                assessment={assessment}
                onStart={() => handleStart(requestCameraPermission)}
                isStarting={isStarting}
            />
        );
    }

    // Assessment workspace
    return (
        <div className="h-screen flex flex-col bg-gray-900">
            <WorkspaceHeader
                title={assessment.title}
                timeRemaining={timeRemaining}
                isMonitoring={isMonitoring}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <FileTree
                    files={fileNames}
                    activeFile={activeFile}
                    onFileSelect={setActiveFile}
                />

                <CodeEditorPanel
                    filename={activeFile}
                    content={files[activeFile] || ''}
                    onChange={handleFileChange}
                />
            </div>

            {/* Hidden camera feed */}
            <video
                ref={videoRef}
                autoPlay
                muted
                className="hidden"
            />

            {/* Screenshot prevention overlay */}
            <div className="fixed inset-0 pointer-events-none" style={{ userSelect: 'none' }} />
        </div>
    );
}
