import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Chrome, ArrowLeft, Loader2, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
    const { user, loading, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    // Check if user is admin after login
    const checkAdminAccess = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.log('[AdminLogin] No access token found');
                return false;
            }

            // Fetch user roles from backend
            const response = await fetch('/api/v1/auth/session', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('[AdminLogin] Session check failed:', response.status);
                return false;
            }

            const data = await response.json();
            const userData = data.data?.user || data.user;
            const roles = userData?.roles || [];

            console.log('[AdminLogin] User roles:', roles);

            // Check for admin or super_admin role
            const isAdmin = roles.some((role: any) =>
                role.name === 'admin' || role.name === 'super_admin' ||
                role === 'admin' || role === 'super_admin'
            );

            if (isAdmin) {
                console.log('[AdminLogin] Admin access granted');
                return true;
            } else {
                console.log('[AdminLogin] Access denied - not an admin');
                return false;
            }
        } catch (error) {
            console.error('[AdminLogin] Error checking admin access:', error);
            return false;
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsSigningIn(true);
            setAccessDenied(false);

            // This will redirect to Google OAuth
            await signInWithGoogle();

            // After OAuth callback, check admin access
            // Note: This won't run because of redirect, but keeping for clarity
        } catch (error: any) {
            console.error('[AdminLogin] Sign in error:', error);
            toast({
                title: "Sign in failed",
                description: error.message || "Could not sign in with Google",
                variant: "destructive",
            });
            setIsSigningIn(false);
        }
    };

    // Check admin access when user is loaded
    if (user && !loading) {
        checkAdminAccess().then((isAdmin) => {
            if (isAdmin) {
                navigate("/admin");
            } else {
                setAccessDenied(true);
            }
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-6 left-6"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/")}
                        className="gap-2 text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Site
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Admin Logo */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="font-mono text-2xl font-bold text-white">LoopLab</span>
                            <span className="block text-sm text-blue-400 font-medium">Admin Portal</span>
                        </div>
                    </div>

                    {/* Access Denied Message */}
                    {accessDenied && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6"
                        >
                            <div className="flex items-center gap-3 text-red-400 mb-2">
                                <AlertCircle className="h-5 w-5" />
                                <h3 className="font-semibold">Access Denied</h3>
                            </div>
                            <p className="text-red-300/80 text-sm">
                                Your account does not have administrator privileges.
                                Please contact the system administrator if you believe this is an error.
                            </p>
                        </motion.div>
                    )}

                    {/* Auth card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="font-mono text-2xl font-bold text-white mb-2">
                                Admin Login
                            </h1>
                            <p className="text-slate-400">
                                Sign in with your authorized Google account
                            </p>
                        </div>

                        {/* Security badge */}
                        <div className="bg-slate-700/50 rounded-lg border border-slate-600 p-4 mb-8">
                            <div className="flex items-center gap-2 text-slate-300 mb-2">
                                <Shield className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium">Secure Authentication</span>
                            </div>
                            <p className="text-xs text-slate-400">
                                This portal uses Google OAuth with multi-factor authentication for enhanced security.
                            </p>
                        </div>

                        {/* Google sign in button */}
                        <Button
                            size="lg"
                            className="w-full justify-center gap-3 h-12 bg-white hover:bg-gray-100 text-gray-800 font-medium"
                            onClick={handleGoogleSignIn}
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Chrome className="h-5 w-5" />
                            )}
                            Continue with Google
                        </Button>

                        {/* Info text */}
                        <p className="text-center text-xs text-slate-500 mt-6">
                            Only authorized administrators can access this portal.
                        </p>
                    </div>

                    {/* Help text */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Need admin access? Contact your system administrator.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
