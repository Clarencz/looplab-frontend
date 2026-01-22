import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GeometricBuilderProps {
    a: number;
    b: number;
    onComplete?: () => void;
}

export default function GeometricBuilder({
    a: initialA = 5,
    b: initialB = 3,
    onComplete,
}: GeometricBuilderProps) {
    const [step, setStep] = useState(0);
    const [showFormula, setShowFormula] = useState(false);

    const steps = [
        {
            title: "Start with a square field",
            description: `You have a square field of side length 'a' (${initialA} meters)`,
            highlight: ['original'],
        },
        {
            title: "Extend it to the right",
            description: `Add 'b' (${initialB} meters) to the right. What's the area of this strip?`,
            highlight: ['original', 'right-strip'],
            formula: 'a × b',
        },
        {
            title: "Extend it downward",
            description: `Add 'b' (${initialB} meters) downward. What's the area of this strip?`,
            highlight: ['original', 'right-strip', 'bottom-strip'],
            formula: 'a × b',
        },
        {
            title: "Fill the corner",
            description: `Don't forget the corner! What's its area?`,
            highlight: ['original', 'right-strip', 'bottom-strip', 'corner'],
            formula: 'b × b',
        },
        {
            title: "The AHA! Moment",
            description: `Total area = a² + ab + ab + b² = a² + 2ab + b²`,
            highlight: ['original', 'right-strip', 'bottom-strip', 'corner'],
            isAha: true,
        },
    ];

    const currentStep = steps[step];
    const scale = 40; // pixels per unit

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            setShowFormula(true);
            onComplete?.();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 p-4">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Build It Yourself: (a + b)²</span>
                        <Badge>
                            Step {step + 1} / {steps.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="font-semibold">{currentStep.title}</p>
                        <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Interactive Visualization */}
            <Card className="flex-1">
                <CardContent className="h-full flex items-center justify-center p-8">
                    <svg
                        viewBox={`0 0 ${(initialA + initialB + 2) * scale} ${(initialA + initialB + 2) * scale}`}
                        className="w-full max-w-2xl aspect-square"
                    >
                        {/* Grid */}
                        <defs>
                            <pattern
                                id="grid"
                                width={scale}
                                height={scale}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={`M ${scale} 0 L 0 0 0 ${scale}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    className="text-muted-foreground opacity-20"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width={(initialA + initialB + 2) * scale}
                            height={(initialA + initialB + 2) * scale}
                            fill="url(#grid)"
                        />

                        {/* Original square (a²) */}
                        <AnimatePresence>
                            {currentStep.highlight.includes('original') && (
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <rect
                                        x={scale}
                                        y={scale}
                                        width={initialA * scale}
                                        height={initialA * scale}
                                        fill="#3b82f6"
                                        fillOpacity={0.7}
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={scale + (initialA * scale) / 2}
                                        y={scale + (initialA * scale) / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white font-bold text-2xl"
                                    >
                                        a²
                                    </text>
                                    {/* Dimension labels */}
                                    <text
                                        x={scale + (initialA * scale) / 2}
                                        y={scale - 10}
                                        textAnchor="middle"
                                        className="fill-foreground font-semibold"
                                    >
                                        a = {initialA}
                                    </text>
                                    <text
                                        x={scale - 10}
                                        y={scale + (initialA * scale) / 2}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        className="fill-foreground font-semibold"
                                    >
                                        a = {initialA}
                                    </text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Right strip (ab) */}
                        <AnimatePresence>
                            {currentStep.highlight.includes('right-strip') && (
                                <motion.g
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <rect
                                        x={scale + initialA * scale}
                                        y={scale}
                                        width={initialB * scale}
                                        height={initialA * scale}
                                        fill="#10b981"
                                        fillOpacity={0.7}
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={scale + initialA * scale + (initialB * scale) / 2}
                                        y={scale + (initialA * scale) / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white font-bold text-xl"
                                    >
                                        ab
                                    </text>
                                    <text
                                        x={scale + initialA * scale + (initialB * scale) / 2}
                                        y={scale - 10}
                                        textAnchor="middle"
                                        className="fill-foreground font-semibold"
                                    >
                                        b = {initialB}
                                    </text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Bottom strip (ab) */}
                        <AnimatePresence>
                            {currentStep.highlight.includes('bottom-strip') && (
                                <motion.g
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <rect
                                        x={scale}
                                        y={scale + initialA * scale}
                                        width={initialA * scale}
                                        height={initialB * scale}
                                        fill="#10b981"
                                        fillOpacity={0.7}
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={scale + (initialA * scale) / 2}
                                        y={scale + initialA * scale + (initialB * scale) / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white font-bold text-xl"
                                    >
                                        ab
                                    </text>
                                    <text
                                        x={scale - 10}
                                        y={scale + initialA * scale + (initialB * scale) / 2}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        className="fill-foreground font-semibold"
                                    >
                                        b = {initialB}
                                    </text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Corner square (b²) */}
                        <AnimatePresence>
                            {currentStep.highlight.includes('corner') && (
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <rect
                                        x={scale + initialA * scale}
                                        y={scale + initialA * scale}
                                        width={initialB * scale}
                                        height={initialB * scale}
                                        fill="#f59e0b"
                                        fillOpacity={0.7}
                                        stroke="white"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={scale + initialA * scale + (initialB * scale) / 2}
                                        y={scale + initialA * scale + (initialB * scale) / 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white font-bold text-xl"
                                    >
                                        b²
                                    </text>
                                </motion.g>
                            )}
                        </AnimatePresence>

                        {/* Total dimensions */}
                        {step >= 3 && (
                            <>
                                <line
                                    x1={scale}
                                    y1={(initialA + initialB + 1.5) * scale}
                                    x2={scale + (initialA + initialB) * scale}
                                    y2={(initialA + initialB + 1.5) * scale}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-primary"
                                />
                                <text
                                    x={scale + ((initialA + initialB) * scale) / 2}
                                    y={(initialA + initialB + 2) * scale}
                                    textAnchor="middle"
                                    className="fill-primary font-bold text-lg"
                                >
                                    a + b = {initialA + initialB}
                                </text>
                            </>
                        )}
                    </svg>
                </CardContent>
            </Card>

            {/* Formula Breakdown */}
            {currentStep.isAha && (
                <Alert className="border-green-600">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                        <p className="font-semibold text-green-600 mb-2">The AHA! Moment:</p>
                        <div className="space-y-1 text-sm">
                            <p>Total area = (a + b)² = (a + b) × (a + b)</p>
                            <p className="text-blue-600">• Blue square: a² = {initialA}² = {initialA * initialA}</p>
                            <p className="text-green-600">• Green strips: 2ab = 2 × {initialA} × {initialB} = {2 * initialA * initialB}</p>
                            <p className="text-orange-600">• Orange corner: b² = {initialB}² = {initialB * initialB}</p>
                            <p className="font-bold mt-2">
                                Total: {initialA * initialA} + {2 * initialA * initialB} + {initialB * initialB} ={' '}
                                {(initialA + initialB) * (initialA + initialB)}
                            </p>
                            <p className="font-bold text-lg mt-2">
                                (a + b)² = a² + 2ab + b²
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Navigation */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="flex-1"
                >
                    Previous
                </Button>
                <Button onClick={handleNext} className="flex-1">
                    {step < steps.length - 1 ? 'Next Step' : 'Complete'}
                </Button>
            </div>

            {/* Why It Matters */}
            {showFormula && (
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                        <p className="font-semibold mb-2">Why This Matters:</p>
                        <p className="text-sm">
                            This visual proof shows WHY (a+b)² ≠ a² + b². The two green strips (2ab) are the "missing piece" that students often forget. By building it geometrically, you can SEE where every term comes from!
                        </p>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
