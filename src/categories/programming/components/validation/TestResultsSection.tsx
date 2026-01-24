// Test Results Section Component

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface TestResult {
    name: string;
    status: string;
    message?: string;
    duration?: number;
}

interface TestResultsSectionProps {
    title: string;
    icon: React.ReactNode;
    results: TestResult[];
}

export function TestResultsSection({ title, icon, results }: TestResultsSectionProps) {
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return (
        <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                {icon}
                {title}
                <span className="text-xs text-muted-foreground">
                    ({passed} passed, {failed} failed)
                </span>
            </h3>
            <div className="space-y-1.5">
                {results.map((test, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center gap-3 p-2 rounded-lg text-sm ${test.status === 'passed'
                                ? 'bg-green-500/5 border border-green-500/20'
                                : test.status === 'failed'
                                    ? 'bg-red-500/5 border border-red-500/20'
                                    : 'bg-muted/30 border border-border'
                            }`}
                    >
                        {test.status === 'passed' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : test.status === 'failed' ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="flex-1 font-mono text-xs">{test.name}</span>
                        {test.duration !== undefined && (
                            <span className="text-xs text-muted-foreground">
                                {test.duration}ms
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
