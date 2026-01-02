// Programming Category Validation Component
// Displays test results, linting warnings, coverage, and AI review

"use client"

import { motion } from "framer-motion"
import {
    Trophy,
    AlertCircle,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileCode,
    TestTube2,
    Shield,
    Sparkles,
    TrendingUp,
    X,
    Lightbulb,
    Percent
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProgrammingValidationResult, CategoryValidationProps } from "@/categories/shared/interfaces/validation"

interface Props extends Omit<CategoryValidationProps, 'result'> {
    result: ProgrammingValidationResult
}

export default function ProgrammingValidation({
    result,
    category,
    projectName,
    onClose,
    onOpenTutor
}: Props) {
    const isPassed = result.overallStatus === "passed"
    const { userTests, backendTests, linting, coverage, aiReview } = result

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className={`px-6 py-6 text-center relative ${isPassed ? 'bg-gradient-to-b from-green-500/10 to-transparent' : 'bg-gradient-to-b from-red-500/10 to-transparent'}`}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${isPassed ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                    >
                        {isPassed ? (
                            <Trophy className="w-8 h-8 text-green-500" />
                        ) : (
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        )}
                    </motion.div>

                    <h2 className="text-xl font-bold mb-1">
                        {isPassed ? "All Tests Passed!" : "Tests Need Attention"}
                    </h2>
                    <p className="text-sm text-muted-foreground">{projectName}</p>

                    <div className="flex items-center justify-center gap-2 mt-3">
                        <span className={`text-4xl font-bold ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                            {result.score}
                        </span>
                        <span className="text-lg text-muted-foreground">/100</span>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {/* Score Breakdown */}
                    <div className="grid grid-cols-4 gap-3">
                        <ScoreCard
                            icon={<TestTube2 className="w-4 h-4" />}
                            label="Your Tests"
                            value={`${userTests.passed}/${userTests.total}`}
                            color={userTests.passed === userTests.total ? "green" : "yellow"}
                        />
                        <ScoreCard
                            icon={<Shield className="w-4 h-4" />}
                            label="Validation"
                            value={`${backendTests.passed}/${backendTests.total}`}
                            color={backendTests.passed === backendTests.total ? "green" : "yellow"}
                        />
                        <ScoreCard
                            icon={<AlertTriangle className="w-4 h-4" />}
                            label="Lint Issues"
                            value={`${linting.errors + linting.warnings}`}
                            color={linting.errors === 0 ? (linting.warnings === 0 ? "green" : "yellow") : "red"}
                        />
                        <ScoreCard
                            icon={<Percent className="w-4 h-4" />}
                            label="Coverage"
                            value={coverage ? `${coverage.percentage}%` : "N/A"}
                            color={coverage && coverage.percentage >= 70 ? "green" : "yellow"}
                        />
                    </div>

                    {/* User Tests Section */}
                    {userTests.results.length > 0 && (
                        <TestResultsSection
                            title="Your Tests"
                            icon={<TestTube2 className="w-4 h-4 text-blue-500" />}
                            results={userTests.results}
                        />
                    )}

                    {/* Backend Tests Section */}
                    {backendTests.results.length > 0 && (
                        <TestResultsSection
                            title="Validation Tests"
                            icon={<Shield className="w-4 h-4 text-purple-500" />}
                            results={backendTests.results}
                        />
                    )}

                    {/* Linting Warnings */}
                    {linting.items.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Lint Warnings ({linting.items.length})
                            </h3>
                            <div className="space-y-2">
                                {linting.items.slice(0, 10).map((item, i) => (
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
                    )}

                    {/* AI Review */}
                    {aiReview.insights.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                AI Code Review ({aiReview.score}/100)
                            </h3>
                            <div className="space-y-2">
                                {aiReview.insights.map((insight, i) => (
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
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex justify-between bg-card">
                    <div>
                        {!isPassed && onOpenTutor && (
                            <Button variant="outline" onClick={onOpenTutor} className="gap-2">
                                <span>🤖</span>
                                Get Help from AI Tutor
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {!isPassed && (
                            <Button onClick={onClose}>
                                Continue Editing
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// Sub-components
function ScoreCard({ icon, label, value, color }: {
    icon: React.ReactNode
    label: string
    value: string
    color: "green" | "yellow" | "red"
}) {
    const colorClasses = {
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
    }

    return (
        <div className={`p-3 rounded-lg border text-center ${colorClasses[color]}`}>
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-mono font-bold">{value}</p>
        </div>
    )
}

function TestResultsSection({ title, icon, results }: {
    title: string
    icon: React.ReactNode
    results: { name: string; status: string; message?: string; duration?: number }[]
}) {
    const passed = results.filter(r => r.status === 'passed').length
    const failed = results.filter(r => r.status === 'failed').length

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
    )
}
