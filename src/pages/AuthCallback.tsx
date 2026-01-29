import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresAt = searchParams.get('expires_at');
        const flow = searchParams.get('flow');

        if (accessToken && refreshToken) {
            // Store tokens in localStorage
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            if (expiresAt) {
                localStorage.setItem('expires_at', expiresAt);
            }

            if (flow === 'desktop') {
                // If this is the desktop flow, we don't redirect to dashboard automatically.
                // We show the UI below to open the desktop app.
                return;
            }

            // Redirect to dashboard
            navigate('/dashboard');
        } else {
            // No tokens, redirect to auth page
            navigate('/auth');
        }
    }, [searchParams, navigate]);

    const handleOpenDesktop = () => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresAt = searchParams.get('expires_at');

        // Construct deep link
        const deepLink = `looplab://auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}&expires_at=${expiresAt}`;
        window.location.href = deepLink;
    };

    if (searchParams.get('flow') === 'desktop' && searchParams.get('access_token')) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md text-center space-y-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto">
                        <span className="font-mono text-3xl font-bold text-primary-foreground">L</span>
                    </div>

                    <h1 className="text-2xl font-bold">Authentication Successful</h1>
                    <p className="text-muted-foreground">
                        You've successfully signed in. You can now return to the desktop application.
                    </p>

                    <div className="space-y-3">
                        <Button
                            className="w-full h-12 text-lg gap-2"
                            onClick={handleOpenDesktop}
                        >
                            Open Desktop App
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate('/dashboard')}
                        >
                            Stay on Web Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
