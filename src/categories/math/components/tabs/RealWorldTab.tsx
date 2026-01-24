import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function RealWorldTab() {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        The Fence Optimization Problem
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="font-semibold mb-2">The Real Problem:</p>
                        <p className="text-sm">
                            You have 100 meters of fence. You want to build a rectangular garden.
                        </p>
                        <p className="text-sm mt-2 font-semibold">
                            What dimensions give you the MOST area?
                        </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg space-y-2">
                        <p className="font-semibold">The Math:</p>
                        <div className="text-sm space-y-1">
                            <p>Let width = x</p>
                            <p>Then length = (100 - 2x) / 2 = 50 - x</p>
                            <p className="mt-2">Area = x(50 - x) = 50x - x²</p>
                            <p className="mt-2 font-semibold text-primary">
                                This is a QUADRATIC! We need to find its maximum.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="font-semibold text-green-600 mb-2">Completing the Square:</p>
                        <div className="text-sm space-y-1">
                            <p>A = -(x² - 50x)</p>
                            <p>A = -(x² - 50x + 625 - 625)</p>
                            <p>A = -(x - 25)² + 625</p>
                            <p className="mt-2 font-semibold">
                                Maximum when (x - 25)² = 0, so x = 25
                            </p>
                            <p className="mt-2 text-green-600 font-bold">
                                The optimal garden is a 25×25 SQUARE!
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold mb-2">Why This Matters:</p>
                        <p className="text-sm">
                            Understanding (a+b)² and completing the square lets you:
                        </p>
                        <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                            <li>Optimize real-world problems (fencing, packaging, etc.)</li>
                            <li>Find maximum/minimum values without calculus</li>
                            <li>Understand why squares are often optimal shapes</li>
                            <li>Solve physics problems (projectile motion, etc.)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
