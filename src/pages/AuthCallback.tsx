import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresAt = searchParams.get('expires_at');

        if (accessToken && refreshToken) {
            // Store tokens in localStorage
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            if (expiresAt) {
                localStorage.setItem('expires_at', expiresAt);
            }

            // Redirect to dashboard
            navigate('/dashboard');
        } else {
            // No tokens, redirect to auth page
            navigate('/auth');
        }
    }, [searchParams, navigate]);

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
