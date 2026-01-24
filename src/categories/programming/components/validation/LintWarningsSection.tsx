// Lint Warnings Section Component

import { motion } from "framer-motion";
import { AlertTriangle, FileCode } from "lucide-react";

interface LintItem {
    file: string;
    line: number;
    rule: string;
    message: string;
    severity: 'error' | 'warning';
}

interface LintWarningsSectionProps {
    items: LintItem[];
}

export function LintWarningsSection({ items }: LintWarningsSectionProps) {
    if (items.length === 0) return null;

    return (
        <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Lint Warnings ({items.length})
            </h3>
            <div className="space-y-2">
                {items.slice(0, 10).map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`p-3 rounded-lg border text-sm ${item.severity === 'error'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-amber-500/10 border-amber-500/30'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-muted-foreground" />
                            <code className="text-xs">{item.file}:{item.line}</code>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${item.severity === 'error'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                {item.rule}
                            </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{item.message}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
