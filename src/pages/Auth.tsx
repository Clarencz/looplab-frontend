import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Chrome, ArrowLeft, Loader2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user, loading, signInWithGitHub: baseSignInWithGitHub, signInWithGoogle: baseSignInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState<"github" | "google" | null>(null);

  const isDesktopFlow = searchParams.get("flow") === "desktop";

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleGitHubSignIn = async () => {
    try {
      setIsSigningIn("github");
      if (isDesktopFlow) {
        const callback = searchParams.get("callback");
        const callbackQuery = callback ? `&callback=${encodeURIComponent(callback)}` : "";
        window.location.href = `/api/v1/auth/desktop?provider=github${callbackQuery}`;
      } else {
        await baseSignInWithGitHub();
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Could not sign in with GitHub",
        variant: "destructive",
      });
      setIsSigningIn(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn("google");
      if (isDesktopFlow) {
        const callback = searchParams.get("callback");
        const callbackQuery = callback ? `&callback=${encodeURIComponent(callback)}` : "";
        window.location.href = `/api/v1/auth/desktop?provider=google${callbackQuery}`;
      } else {
        await baseSignInWithGoogle();
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
      setIsSigningIn(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
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
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 overflow-hidden">
              <img src="/logo.png" alt="MathemaLab Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight">MathemaLab</span>
          </div>

          {/* Auth card */}
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to track your progress and streaks
              </p>
            </div>

            {/* Terminal decoration */}
            <div className="bg-background/80 rounded-xl border border-border p-4 mb-8 text-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
              </div>
              <div className="text-muted-foreground font-mono text-xs">
                <span className="text-primary">$</span> mml auth --login
              </div>
              <div className="text-foreground mt-1 font-mono text-xs">
                <span className="terminal-cursor">Awaiting authentication...</span>
              </div>
            </div>

            {/* OAuth buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-11"
                onClick={handleGitHubSignIn}
                disabled={isSigningIn !== null}
              >
                {isSigningIn === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Continue with GitHub
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-11"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn !== null}
              >
                {isSigningIn === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="h-4 w-4" />
                )}
                Continue with Google
              </Button>
            </div>

            {/* Info text */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Bottom text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            New to MathemaLab? Signing in will create your account automatically.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;