// AI Review Section Component

import { motion } from "framer-motion";
import { Sparkles, Lightbulb } from "lucide-react";

interface AIReviewSectionProps {
    score: number;
    insights: string[];
}

export function AIReviewSection({ score, insights }: AIReviewSectionProps) {
    if (insights.length === 0) return null;

    return (
        <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                AI Code Review ({score}/100)
            </h3>
            <div className="space-y-2">
                {insights.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex items-start gap-2 text-sm text-muted-foreground p-2 bg-muted/30 rounded"
                    >
                        <Lightbulb className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                        <span>{insight}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
