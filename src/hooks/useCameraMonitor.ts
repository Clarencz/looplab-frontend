import { useState, useEffect, useRef } from 'react';

interface CameraMonitorOptions {
    onCameraVerified?: (verified: boolean) => void;
    onError?: (error: string) => void;
}

export function useCameraMonitor({ onCameraVerified, onError }: CameraMonitorOptions = {}) {
    const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const requestCameraPermission = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            setStream(mediaStream);
            setCameraPermission('granted');
            setIsMonitoring(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            onCameraVerified?.(true);
        } catch (error) {
            setCameraPermission('denied');
            const errorMessage = error instanceof Error ? error.message : 'Camera access denied';
            onError?.(errorMessage);
            onCameraVerified?.(false);
        }
    };

    const stopMonitoring = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsMonitoring(false);
    };

    useEffect(() => {
        return () => {
            stopMonitoring();
        };
    }, []);

    return {
        cameraPermission,
        isMonitoring,
        videoRef,
        requestCameraPermission,
        stopMonitoring,
    };
}
