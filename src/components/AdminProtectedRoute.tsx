import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log('[AdminProtectedRoute] Checking access...', { user: user?.email, loading });

    // Show loading spinner while checking authentication
    if (loading) {
        console.log('[AdminProtectedRoute] Still loading auth state...');
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to admin login if not authenticated
    if (!user) {
        console.log('[AdminProtectedRoute] No user, redirecting to /admin/login');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // For now, allow any authenticated user to access admin
    // TODO: Re-enable role checking once backend is stable
    console.log('[AdminProtectedRoute] User authenticated, granting admin access:', user.email);
    return <>{children}</>;
};

