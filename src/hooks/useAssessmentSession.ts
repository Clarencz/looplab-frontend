import { useEffect, useState, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startSession, logAntiCheatingEvent, submitSession } from '../lib/api/enterprise-sessions';
import type { Assessment } from '../lib/api/enterprise';
import type { AssessmentSession } from '../lib/api/enterprise-sessions';

interface UseAssessmentSessionProps {
    session: AssessmentSession | undefined;
    assessment: Assessment | undefined;
    onSubmitSuccess: () => void;
}

interface AntiCheatingEvent {
    eventType: 'tab_switch' | 'copy_paste' | 'screenshot_attempt';
    cameraVerified?: boolean;
}

export function useAssessmentSession({
    session,
    assessment,
    onSubmitSuccess,
}: UseAssessmentSessionProps) {
    const [hasStarted, setHasStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [files, setFiles] = useState<Record<string, string>>({});
    const [activeFile, setActiveFile] = useState<string>('');

    // Mutations
    const startMutation = useMutation({
        mutationFn: (sessionId: string) => startSession(sessionId),
        onSuccess: () => {
            setHasStarted(true);
        },
    });

    const logAntiCheatingMutation = useMutation({
        mutationFn: ({ sessionId, event }: { sessionId: string; event: AntiCheatingEvent }) =>
            logAntiCheatingEvent(sessionId, event),
    });

    const submitMutation = useMutation({
        mutationFn: ({ sessionId, data }: { sessionId: string; data: any }) =>
            submitSession(sessionId, data),
        onSuccess: onSubmitSuccess,
    });

    // Initialize files from broken project data
    useEffect(() => {
        if (assessment?.brokenProjectData) {
            const projectFiles = assessment.brokenProjectData as Record<string, string>;
            setFiles(projectFiles);

            // Set first file as active
            const fileNames = Object.keys(projectFiles);
            if (fileNames.length > 0) {
                setActiveFile(fileNames[0]);
            }
        }
    }, [assessment]);

    // Timer countdown
    useEffect(() => {
        if (hasStarted && assessment) {
            setTimeRemaining(assessment.timeLimitMinutes * 60); // Convert to seconds

            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev === null || prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [hasStarted, assessment]);

    // Log anti-cheating event
    const logEvent = useCallback((event: AntiCheatingEvent) => {
        if (session) {
            logAntiCheatingMutation.mutate({
                sessionId: session.id,
                event,
            });
        }
    }, [session, logAntiCheatingMutation]);

    // Handle file change
    const handleFileChange = useCallback((filename: string, value: string | undefined) => {
        if (value !== undefined) {
            setFiles(prev => ({ ...prev, [filename]: value }));
        }
    }, []);

    // Handle submission
    const handleSubmit = useCallback(() => {
        if (!session) return;

        const testsFolder = Object.keys(files)
            .filter(f => f.startsWith('tests/'))
            .reduce((acc, key) => ({ ...acc, [key]: files[key] }), {});

        submitMutation.mutate({
            sessionId: session.id,
            data: {
                submissionCode: files,
                testsWritten: testsFolder,
            },
        });
    }, [session, files, submitMutation]);

    // Handle start
    const handleStart = useCallback(async (requestCameraPermission: () => Promise<boolean>) => {
        if (!session) return;

        // Request camera permission first
        await requestCameraPermission();

        // Start session
        startMutation.mutate(session.id);
    }, [session, startMutation]);

    // Check if time expired and auto-submit
    useEffect(() => {
        if (timeRemaining === 0 && hasStarted) {
            handleSubmit();
        }
    }, [timeRemaining, hasStarted, handleSubmit]);

    // File list
    const fileNames = useMemo(() => Object.keys(files), [files]);

    return {
        // State
        hasStarted,
        timeRemaining,
        files,
        activeFile,
        fileNames,

        // Actions
        setActiveFile,
        handleFileChange,
        handleSubmit,
        handleStart,
        logEvent,

        // Mutation states
        isStarting: startMutation.isPending,
        isSubmitting: submitMutation.isPending,
    };
}

// Helper function for time formatting
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
