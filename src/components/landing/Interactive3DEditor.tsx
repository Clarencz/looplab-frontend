import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle, PlayCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// Step definitions for the animation
const STEPS = [
    {
        id: 1,
        title: 'Broken Project',
        subtitle: 'Find the bug',
        icon: Bug,
        iconColor: 'text-red-400',
        bgGlow: 'from-red-500/20 via-orange-500/10 to-transparent',
        code: `// auth.js - Line 12
import { getUser } from './api';

export async function authenticate(token) {
  const user = getUser(token);
  
  // ❌ TypeError: Cannot read 'name' of undefined
  return user.name;
}`,
        highlights: [{ line: 7, type: 'error' }],
        status: 'error',
    },
    {
        id: 2,
        title: 'Fixed Code',
        subtitle: 'Bug squashed',
        icon: CheckCircle,
        iconColor: 'text-green-400',
        bgGlow: 'from-green-500/20 via-emerald-500/10 to-transparent',
        code: `// auth.js - Line 12
import { getUser } from './api';

export async function authenticate(token) {
  const user = await getUser(token);
  
  // ✅ Added null check + await
  return user?.name ?? 'Guest';
}`,
        highlights: [{ line: 5, type: 'fixed' }, { line: 8, type: 'fixed' }],
        status: 'success',
    },
    {
        id: 3,
        title: 'Validation',
        subtitle: 'Running tests',
        icon: PlayCircle,
        iconColor: 'text-blue-400',
        bgGlow: 'from-blue-500/20 via-cyan-500/10 to-transparent',
        code: `$ mml validate

Running test suite...

✓ auth.test.js
  ✓ authenticate returns user name (12ms)
  ✓ authenticate handles null user (8ms)
  ✓ authenticate handles missing token (5ms)

All tests passed! 3/3`,
        highlights: [],
        status: 'validating',
    },
    {
        id: 4,
        title: 'AI Feedback',
        subtitle: 'Learn & improve',
        icon: Sparkles,
        iconColor: 'text-purple-400',
        bgGlow: 'from-purple-500/20 via-pink-500/10 to-transparent',
        code: `💡 AI Code Review:

Great fix! Here's what you learned:

1. Always use 'await' with async functions
2. Optional chaining (?.) prevents null errors
3. Nullish coalescing (??) provides defaults

🎯 Skill unlocked: Async Error Handling
⭐ +25 XP earned`,
        highlights: [],
        status: 'feedback',
    },
];

const AUTO_CYCLE_INTERVAL = 4000; // 4 seconds per step

export default function Interactive3DEditor() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-cycle through steps
    useEffect(() => {
        if (!isAutoPlaying || isPaused) return;

        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % STEPS.length);
        }, AUTO_CYCLE_INTERVAL);

        return () => clearInterval(timer);
    }, [isAutoPlaying, isPaused]);

    // Manual navigation
    const goToStep = useCallback((index: number) => {
        setCurrentStep(index);
        setIsAutoPlaying(false); // Stop auto-play on manual navigation
    }, []);

    const goNext = useCallback(() => {
        setCurrentStep((prev) => (prev + 1) % STEPS.length);
        setIsAutoPlaying(false);
    }, []);

    const goPrev = useCallback(() => {
        setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
        setIsAutoPlaying(false);
    }, []);

    // Resume auto-play after 10 seconds of inactivity
    useEffect(() => {
        if (isAutoPlaying) return;

        const timer = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, [isAutoPlaying, currentStep]);

    const step = STEPS[currentStep];
    const StepIcon = step.icon;

    return (
        <div
            className="relative w-full max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Aurora Glow Background */}
            <div className="absolute -inset-4 sm:-inset-8 opacity-60">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-radial ${step.bgGlow} blur-3xl`}
                />
            </div>

            {/* 3D Tilted Editor Container */}
            <motion.div
                className="relative"
                style={{
                    perspective: '1000px',
                }}
            >
                <motion.div
                    initial={{ rotateX: 10, rotateY: -5 }}
                    animate={{ rotateX: 8, rotateY: -3 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                    className="relative"
                >
                    {/* Editor Window */}
                    <div className="relative rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                        {/* Window Header */}
                        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10 bg-gray-800/50">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500/80" />
                                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500/80" />
                            </div>

                            {/* Step Badge */}
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10"
                            >
                                <StepIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${step.iconColor}`} />
                                <span className="text-[10px] sm:text-xs font-medium text-white/70">{step.title}</span>
                            </motion.div>

                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-xs text-white/40 font-mono">mathemalab</span>
                            </div>
                        </div>

                        {/* Code Content */}
                        <div className="relative p-3 sm:p-6 min-h-[200px] sm:min-h-[280px] overflow-x-auto">
                            <AnimatePresence mode="wait">
                                <motion.pre
                                    key={step.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre"
                                >
                                    {step.code.split('\n').map((line, idx) => {
                                        const highlight = step.highlights.find(h => h.line === idx + 1);
                                        const isError = highlight?.type === 'error';
                                        const isFixed = highlight?.type === 'fixed';

                                        return (
                                            <div
                                                key={idx}
                                                className={`
                          px-2 py-0.5 -mx-2 rounded
                          ${isError ? 'bg-red-500/20 border-l-2 border-red-500' : ''}
                          ${isFixed ? 'bg-green-500/20 border-l-2 border-green-500' : ''}
                        `}
                                            >
                                                <span className="text-white/30 select-none mr-2 sm:mr-4 inline-block w-4 sm:w-6 text-right text-[10px] sm:text-sm">
                                                    {idx + 1}
                                                </span>
                                                <span className={`
                          ${line.includes('//') && line.includes('❌') ? 'text-red-400' : ''}
                          ${line.includes('//') && line.includes('✅') ? 'text-green-400' : ''}
                          ${line.includes('✓') ? 'text-green-400' : ''}
                          ${line.includes('💡') || line.includes('🎯') || line.includes('⭐') ? 'text-purple-300' : ''}
                          ${line.startsWith('$') ? 'text-cyan-400' : ''}
                          ${!line.includes('//') && !line.includes('✓') && !line.includes('💡') && !line.includes('🎯') && !line.includes('⭐') && !line.startsWith('$') ? 'text-gray-300' : ''}
                        `}>
                                                    {line || ' '}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </motion.pre>
                            </AnimatePresence>
                        </div>

                        {/* Footer with Progress */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-white/10 bg-gray-800/30">
                            <div className="flex items-center justify-between">
                                {/* Step Indicators */}
                                <div className="flex items-center gap-2">
                                    {STEPS.map((s, idx) => (
                                        <button
                                            key={s.id}
                                            onClick={() => goToStep(idx)}
                                            className={`
                        relative h-2 rounded-full transition-all duration-300 cursor-pointer
                        ${idx === currentStep ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'}
                      `}
                                            aria-label={`Go to step ${idx + 1}: ${s.title}`}
                                        >
                                            {idx === currentStep && isAutoPlaying && !isPaused && (
                                                <motion.div
                                                    className="absolute inset-0 bg-primary/50 rounded-full"
                                                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ duration: AUTO_CYCLE_INTERVAL / 1000, ease: 'linear' }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goPrev}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        aria-label="Previous step"
                                    >
                                        <ChevronLeft className="h-4 w-4 text-white/60" />
                                    </button>
                                    <button
                                        onClick={goNext}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        aria-label="Next step"
                                    >
                                        <ChevronRight className="h-4 w-4 text-white/60" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reflection Effect */}
                    <div
                        className="absolute -bottom-12 left-4 right-4 h-12 bg-gradient-to-b from-gray-900/20 to-transparent rounded-b-xl blur-sm"
                        style={{ transform: 'rotateX(180deg) scaleY(0.3)' }}
                    />
                </motion.div>
            </motion.div>

            {/* Step Labels Below - Hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex justify-center gap-6 mt-8">
                {STEPS.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                        <button
                            key={s.id}
                            onClick={() => goToStep(idx)}
                            className={`
                flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer
                ${idx === currentStep ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}
              `}
                        >
                            <div className={`
                p-2 rounded-lg border transition-all
                ${idx === currentStep
                                    ? `bg-white/10 border-white/20 ${s.iconColor}`
                                    : 'bg-white/5 border-transparent text-white/40'
                                }
              `}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium text-white/60">{s.subtitle}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
