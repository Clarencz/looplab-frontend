import { useState, useEffect } from 'react';

interface AntiCheatingOptions {
    onTabSwitch?: () => void;
    onCopyPaste?: () => void;
    onScreenshotAttempt?: () => void;
}

export function useAntiCheating({ onTabSwitch, onCopyPaste, onScreenshotAttempt }: AntiCheatingOptions = {}) {
    const [tabSwitches, setTabSwitches] = useState(0);
    const [copyPasteEvents, setCopyPasteEvents] = useState(0);
    const [screenshotAttempts, setScreenshotAttempts] = useState(0);

    useEffect(() => {
        // Tab switch detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitches(prev => prev + 1);
                onTabSwitch?.();
            }
        };

        // Copy/paste detection
        const handleCopy = (e: ClipboardEvent) => {
            setCopyPasteEvents(prev => prev + 1);
            onCopyPaste?.();
        };

        const handlePaste = (e: ClipboardEvent) => {
            setCopyPasteEvents(prev => prev + 1);
            onCopyPaste?.();
        };

        // Screenshot attempt detection (keyboard shortcuts)
        const handleKeyDown = (e: KeyboardEvent) => {
            // Detect common screenshot shortcuts
            if (
                (e.key === 'PrintScreen') ||
                (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac
                (e.ctrlKey && e.key === 'PrintScreen') || // Windows
                (e.metaKey && e.shiftKey && e.key === 's') // Some screenshot tools
            ) {
                setScreenshotAttempts(prev => prev + 1);
                onScreenshotAttempt?.();
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onTabSwitch, onCopyPaste, onScreenshotAttempt]);

    return {
        tabSwitches,
        copyPasteEvents,
        screenshotAttempts,
    };
}
