import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [autoTriggerInitiated, setAutoTriggerInitiated] = useState(false);
    const [countdown, setCountdown] = useState(2); // Short visual countdown

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresAt = searchParams.get('expires_at');
        const code = searchParams.get('code');
        const flow = searchParams.get('flow');

        // Handle desktop flow with the "Bulletproof Hybrid Flow"
        if (flow === 'desktop' && code) {
            console.log('[AuthCallback] Desktop flow detected. Waiting 1.5s for session to settle...');

            // Auto-trigger deep link after 1.5s
            const triggerTimer = setTimeout(() => {
                const deepLink = `looplab://auth/callback?code=${code}`;
                console.log('[AuthCallback] Auto-triggering deep link:', deepLink);
                window.location.href = deepLink;
                setAutoTriggerInitiated(true);
            }, 1500);

            // Visual countdown for UX
            const countdownTimer = setInterval(() => {
                setCountdown(prev => Math.max(0, prev - 1));
            }, 750);

            return () => {
                clearTimeout(triggerTimer);
                clearInterval(countdownTimer);
            };
        }

        // Handle web OAuth flow
        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            if (expiresAt) {
                localStorage.setItem('expires_at', expiresAt);
            }
            navigate('/dashboard');
        } else if (!flow || flow !== 'desktop') {
            console.log('[AuthCallback] No valid session found, redirecting to /auth');
            navigate('/auth');
        }
    }, [searchParams, navigate]);

    const handleManualOpen = () => {
        const code = searchParams.get('code');
        if (code) {
            window.location.href = `looplab://auth/callback?code=${code}`;
            setAutoTriggerInitiated(true);
        }
    };

    const flow = searchParams.get('flow');
    const code = searchParams.get('code');

    // Premium Success UI for Desktop Flow
    if (flow === 'desktop' && code) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background flex items-center justify-center border-2 border-primary">
                                <span className="text-[10px] font-bold text-primary">{countdown > 0 ? countdown : '!'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Login Successful</h1>
                        <p className="text-muted-foreground text-lg">
                            We're redirecting you back to the LoopLab desktop app.
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button
                            className="w-full h-12 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
                            onClick={handleManualOpen}
                        >
                            Open Desktop App
                            <ArrowRight className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                            {autoTriggerInitiated ? (
                                <p>Requested deep link trigger. If nothing happens, click the button above.</p>
                            ) : (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <p>Auto-launching in {countdown}s...</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-12">
                        <p className="text-xs text-muted-foreground opacity-50 uppercase tracking-widest font-semibold">
                            LoopLab Security • Secure OAuth Handshake
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Default Web Flow fallback
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
