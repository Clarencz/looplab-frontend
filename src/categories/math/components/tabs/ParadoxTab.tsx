import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export function ParadoxTab() {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        The Missing 12 Paradox
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold mb-2">The Setup:</p>
                        <p className="text-sm">
                            If (a + b)² = a² + b², then let's test with a = 3, b = 2:
                        </p>
                        <div className="mt-4 space-y-2 text-sm">
                            <p>(3 + 2)² should equal 3² + 2²</p>
                            <p>5² should equal 9 + 4</p>
                            <p className="text-lg font-bold text-destructive">25 should equal 13</p>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-600/20">
                        <p className="font-semibold text-yellow-600 mb-2">The Paradox:</p>
                        <p className="text-sm">
                            But 25 ≠ 13! There's a difference of 12.
                        </p>
                        <p className="text-sm mt-2">
                            <strong>Where did the 12 go?</strong>
                        </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-600/20">
                        <p className="font-semibold text-green-600 mb-2">The Revelation:</p>
                        <p className="text-sm">
                            The missing 12 is the <strong>2ab term</strong>!
                        </p>
                        <p className="text-sm mt-2">
                            2ab = 2 × 3 × 2 = 12
                        </p>
                        <p className="text-sm mt-2">
                            The correct formula: (a+b)² = a² + <span className="text-green-600 font-bold">2ab</span> + b²
                        </p>
                        <p className="text-sm mt-2">
                            = 9 + <span className="text-green-600 font-bold">12</span> + 4 = 25 ✓
                        </p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold mb-2">Try It Yourself:</p>
                        <p className="text-sm">
                            Pick any two numbers. Calculate (a+b)² and a²+b².
                            How much are they different by? It's always 2ab!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
