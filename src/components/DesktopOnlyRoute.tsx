import { isTauri } from '@/utils/platform';
import DownloadApp from '@/pages/DownloadApp';

interface DesktopOnlyRouteProps {
    children: React.ReactNode;
}

/**
 * Route guard that restricts access to desktop-only features.
 * On web: Shows download page
 * On desktop: Renders children normally
 */
export const DesktopOnlyRoute = ({ children }: DesktopOnlyRouteProps) => {
    // Check if running in Tauri (desktop app)
    if (!isTauri()) {
        // Web user trying to access desktop feature - show download page
        return <DownloadApp />;
    }

    // Desktop user - render the protected content
    return <>{children}</>;
};
