import React, { useState, useEffect } from 'react';
import { DesktopOnboarding } from './Onboarding';
import { DesktopInstaller } from './Installer';

export function DesktopEntry() {
    const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
        return localStorage.getItem('looplab_desktop_setup_complete') === 'true';
    });

    const handleInstallComplete = () => {
        localStorage.setItem('looplab_desktop_setup_complete', 'true');
        setIsSetupComplete(true);
    };

    if (!isSetupComplete) {
        return <DesktopInstaller onComplete={handleInstallComplete} />;
    }

    return <DesktopOnboarding />;
}
