import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Cpu, ArrowRight, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

export function DesktopOnboarding() {
    const navigate = useNavigate();

    useEffect(() => {
        const setupListener = async () => {
            // Listen for auth completion signal (from store_auth_tokens or other sources)
            const unlistenAuth = await listen('auth-state-changed', (event) => {
                if (event.payload === 'authenticated') {
                    navigate('/dashboard');
                }
            });

            // Listen for deep link with tokens (from Rust backend)
            const unlistenDeepLink = await listen('auth-deep-link-received', async (event) => {
                const url = event.payload as string;
                console.log('Deep link received in frontend:', url);

                try {
                    // Manual parsing of query params since URL object might not handle custom protocol well in some envs
                    // But standard URL object usually works if the string is a valid URL
                    // looplab://auth/callback?access_token=...
                    const dummyUrl = url.replace('looplab://', 'http://localhost/');
                    const parsedUrl = new URL(dummyUrl);
                    const params = new URLSearchParams(parsedUrl.search);

                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');
                    const expiresAtStr = params.get('expires_at');

                    if (accessToken && refreshToken && expiresAtStr) {
                        const expiresAt = parseInt(expiresAtStr, 10);

                        // Store in localStorage for web compatibility (AuthContext)
                        localStorage.setItem('access_token', accessToken);
                        localStorage.setItem('refresh_token', refreshToken);
                        localStorage.setItem('expires_at', expiresAt.toString());

                        // Also persist via IPC for desktop security (future proofing)
                        await invoke('store_auth_tokens', {
                            accessToken,
                            refreshToken,
                            expiresAt
                        });
                    }
                } catch (e) {
                    console.error('Failed to parse deep link:', e);
                }
            });

            return () => {
                unlistenAuth();
                unlistenDeepLink();
            };
        };

        let unlistenFn: (() => void) | undefined;
        setupListener().then(fn => { unlistenFn = fn; });

        return () => {
            if (unlistenFn) unlistenFn();
        };
    }, [navigate]);

    const handleAuth = async () => {
        try {
            await invoke('open_auth_in_browser');
        } catch (error) {
            console.error('Failed to open auth in browser:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex overflow-hidden relative selection:bg-cyan-500/30">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />

            {/* Left Panel: Hero Visual */}
            <div className="w-1/2 flex items-center justify-center relative z-10 p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative group"
                >
                    {/* Logo Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-2xl rounded-full group-hover:blur-3xl transition-all duration-500" />

                    {/* Main Logo - Using Favicon as requested */}
                    <img
                        src="/favicon.png"
                        alt="LoopLab Logo"
                        className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl"
                    />
                </motion.div>
            </div>

            {/* Right Panel: Actions */}
            <div className="w-1/2 flex flex-col justify-center relative z-10 p-16">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="text-zinc-400 text-sm font-medium tracking-wider uppercase mb-2">Welcome to</h2>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            LoopLab Desktop
                        </h1>
                        <p className="text-zinc-500 mt-4 text-lg">
                            Your premium, offline-capable environment for mastering algorithms and building real-world projects.
                        </p>
                    </div>

                    {/* Glassmorphic Panel */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="space-y-4">
                            <Button
                                className="w-full h-12 text-lg bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
                                onClick={handleAuth}
                            >
                                <Cpu className="w-5 h-5 mr-2" />
                                Initialize Workspace
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-12 text-lg border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
                                onClick={handleAuth}
                            >
                                <Link className="w-5 h-5 mr-2" />
                                Connect Account
                            </Button>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="mt-8 flex items-center space-x-6 text-xs text-zinc-600 font-medium">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span>Local AI Active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <WifiOff className="w-3 h-3" />
                            <span>Offline Ready</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">v1.0.0</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
