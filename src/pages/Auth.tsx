import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Chrome, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user, loading, signInWithGitHub, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState<"github" | "google" | null>(null);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleGitHubSignIn = async () => {
    try {
      setIsSigningIn("github");
      await signInWithGitHub();
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
      await signInWithGoogle();
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
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
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
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="font-mono text-xl font-bold text-primary-foreground">L</span>
            </div>
            <span className="font-mono text-2xl font-bold text-foreground">LoopLab</span>
          </div>

          {/* Auth card */}
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="font-mono text-xl sm:text-2xl font-bold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to track your progress and streaks
              </p>
            </div>

            {/* Terminal decoration */}
            <div className="bg-background/80 rounded-lg border border-border p-4 mb-8 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-terminal-green/60" />
              </div>
              <div className="text-muted-foreground">
                <span className="text-terminal-green">$</span> looplab auth --login
              </div>
              <div className="text-foreground mt-1">
                <span className="terminal-cursor">Awaiting authentication...</span>
              </div>
            </div>

            {/* OAuth buttons */}
            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-12 font-mono"
                onClick={handleGitHubSignIn}
                disabled={isSigningIn !== null}
              >
                {isSigningIn === "github" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Github className="h-5 w-5" />
                )}
                Continue with GitHub
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-12 font-mono"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn !== null}
              >
                {isSigningIn === "google" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="h-5 w-5" />
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
            New to LoopLab? Signing in will create your account automatically.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
