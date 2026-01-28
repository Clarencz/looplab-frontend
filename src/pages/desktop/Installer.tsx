import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallerProps {
    onComplete: () => void;
}

export function DesktopInstaller({ onComplete }: InstallerProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Initializing core systems...");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const increase = Math.random() * 2;
                const newProgress = Math.min(prev + increase, 100);

                // Update status text based on progress
                if (newProgress < 20) setStatus("Initializing core systems...");
                else if (newProgress < 40) setStatus("Verifying local AI models...");
                else if (newProgress < 60) setStatus("Optimizing vector database...");
                else if (newProgress < 80) setStatus("Configuring secure offline environment...");
                else setStatus("Finalizing setup...");

                if (newProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800); // Slight delay at 100%
                }
                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-mono">
            {/* Background Tech Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505]" />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-lg text-center"
            >
                {/* Logo / Header */}
                <div className="mb-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                        <img src="/favicon.png" className="w-10 h-10 invert brightness-0" alt="icon" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white/90">LoopLab Installer</h1>
                    <p className="text-sm text-cyan-500/80 mt-1">Version 1.0.0 • Stable</p>
                </div>

                {/* Progress Circle Visual */}
                <div className="relative w-64 h-64 mx-auto mb-12">
                    {/* Spinning Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-white/10"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border border-white/5"
                    />

                    {/* Center Stats */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    {/* Progress Ring (SVG) */}
                    <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
                        <circle
                            cx="50%" cy="50%" r="48%"
                            fill="none" stroke="#22d3ee" strokeWidth="2"
                            strokeDasharray="360"
                            strokeDashoffset={360 - (3.6 * progress)}
                            strokeLinecap="round"
                            className="transition-all duration-75 ease-out shadow-[0_0_15px_#22d3ee]"
                        />
                    </svg>
                </div>

                {/* Status Text */}
                <div className="h-8 mb-2">
                    <motion.p
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-cyan-400 text-sm tracking-wide"
                    >
                        {">"} {status}
                    </motion.p>
                </div>

                {/* File Path Micro-interaction */}
                <div className="text-[10px] text-zinc-600 truncate max-w-xs mx-auto">
                    /usr/local/looplab/models/v2/embedding_core.onnx
                </div>

            </motion.div>
        </div>
    );
}
