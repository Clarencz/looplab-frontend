"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    X, Trophy, TestTube2, Shield, Sparkles,
    CheckCircle2, XCircle, AlertCircle, ArrowRight,
    Lightbulb, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ValidationStage {
    name: string
    stageType: string
    status: "passed" | "failed"
    message?: string
}

interface InsightItem {
    label: string
    status: string
    file?: string
    lineNumber?: number
}

interface ValidationInsight {
    category: string
    items: InsightItem[]
}

interface ValidationResult {
    overallStatus: string
    score: number
    feedback: string
    stages: ValidationStage[]
    insights: ValidationInsight[]
    userTestsPassed: number
    userTestsTotal: number
    backendTestsPassed: number
    backendTestsTotal: number
    aiQualityScore: number
    aiInsights: string[]
}

interface ValidationResultModalProps {
    isOpen: boolean
    onClose: () => void
    result: ValidationResult | null
    projectName: string
    onOpenTutor?: () => void
}

const ValidationResultModal = ({
    isOpen,
    onClose,
    result,
    projectName,
    onOpenTutor
}: ValidationResultModalProps) => {
    if (!result) return null

    // Ensure safe defaults for all fields
    const isPassed = result.overallStatus === "passed"
    const stages = result.stages || []
    const insights = result.insights || []
    const aiInsights = result.aiInsights || []
    const userTestsPassed = result.userTestsPassed ?? 0
    const userTestsTotal = result.userTestsTotal ?? 1
    const backendTestsPassed = result.backendTestsPassed ?? 0
    const backendTestsTotal = result.backendTestsTotal ?? 1
    const aiQualityScore = result.aiQualityScore ?? 0

    const stageWeights = {
        user_tests: 25,
        backend_tests: 50,
        ai_review: 25,
    }

    const getStageIcon = (stageType: string) => {
        switch (stageType) {
            case "user_tests":
                return <TestTube2 className="w-5 h-5" />
            case "backend_tests":
                return <Shield className="w-5 h-5" />
            case "ai_review":
                return <Sparkles className="w-5 h-5" />
            default:
                return <CheckCircle2 className="w-5 h-5" />
        }
    }

    const getStageColor = (stageType: string) => {
        switch (stageType) {
            case "user_tests":
                return "text-blue-500 bg-blue-500/10"
            case "backend_tests":
                return "text-purple-500 bg-purple-500/10"
            case "ai_review":
                return "text-amber-500 bg-amber-500/10"
            default:
                return "text-gray-500 bg-gray-500/10"
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="flex-1 overflow-y-auto">
                            {/* Header with Score */}
                            <div className={`px-6 py-8 text-center ${isPassed ? 'bg-gradient-to-b from-green-500/10 to-transparent' : 'bg-gradient-to-b from-red-500/10 to-transparent'}`}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isPassed ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                                >
                                    {isPassed ? (
                                        <Trophy className="w-10 h-10 text-green-500" />
                                    ) : (
                                        <AlertCircle className="w-10 h-10 text-red-500" />
                                    )}
                                </motion.div>

                                <h2 className="text-2xl font-bold mb-2">
                                    {isPassed ? "Validation Passed!" : "Needs Improvement"}
                                </h2>

                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className={`text-5xl font-bold ${isPassed ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {result.score}
                                    </motion.span>
                                    <span className="text-xl text-muted-foreground">/100</span>
                                </div>

                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    {result.feedback}
                                </p>

                                <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 h-8 w-8">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Stages Breakdown */}
                            <div className="px-6 py-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Validation Stages
                                </h3>

                                <div className="space-y-3">
                                    {stages.map((stage, index) => (
                                        <motion.div
                                            key={stage.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border"
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStageColor(stage.stageType)}`}>
                                                {getStageIcon(stage.stageType)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{stage.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({stageWeights[stage.stageType as keyof typeof stageWeights] || 0}%)
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {stage.message || (stage.status === "passed" ? "All checks passed" : "Some checks failed")}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {stage.status === "passed" ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Test Results Summary */}
                            <div className="px-6 py-4 border-t border-border bg-muted/20">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Your Tests</p>
                                        <p className="font-mono text-lg">
                                            <span className={userTestsPassed === userTestsTotal ? 'text-green-500' : 'text-yellow-500'}>
                                                {userTestsPassed}
                                            </span>
                                            /{userTestsTotal}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Validation</p>
                                        <p className="font-mono text-lg">
                                            <span className={backendTestsPassed === backendTestsTotal ? 'text-green-500' : 'text-yellow-500'}>
                                                {backendTestsPassed}
                                            </span>
                                            /{backendTestsTotal}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">AI Score</p>
                                        <p className="font-mono text-lg">
                                            <span className={aiQualityScore >= 70 ? 'text-green-500' : 'text-yellow-500'}>
                                                {Math.round(aiQualityScore)}
                                            </span>
                                            /100
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Suggestions (shown on failure) */}
                            {!isPassed && insights.some(i => i.category === 'ai_suggestions') && (
                                <div className="px-6 py-4 border-t border-border bg-blue-500/5">
                                    <h3 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        💡 Suggestions for Improvement
                                    </h3>
                                    <ul className="space-y-3">
                                        {insights
                                            .filter(i => i.category === 'ai_suggestions')
                                            .flatMap(i => i.items)
                                            .map((item, i) => {
                                                const isEncouragement = item.label.includes('[ENCOURAGEMENT]')
                                                const isSuggestion = item.label.includes('[SUGGESTION]')
                                                const cleanLabel = item.label
                                                    .replace('[ENCOURAGEMENT]', '')
                                                    .replace('[SUGGESTION]', '')
                                                    .replace('[INSIGHT]', '')
                                                    .trim()

                                                return (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.5 + i * 0.1 }}
                                                        className={`p-3 rounded-lg ${isEncouragement
                                                            ? 'bg-green-500/10 border border-green-500/20'
                                                            : isSuggestion
                                                                ? 'bg-blue-500/10 border border-blue-500/20'
                                                                : 'bg-amber-500/10 border border-amber-500/20'
                                                            }`}
                                                    >
                                                        <span className={`text-sm ${isEncouragement ? 'text-green-400' :
                                                            isSuggestion ? 'text-blue-400' : 'text-amber-400'
                                                            }`}>
                                                            {cleanLabel}
                                                        </span>
                                                    </motion.li>
                                                )
                                            })}
                                    </ul>
                                </div>
                            )}

                            {/* AI Insights */}
                            {aiInsights.length > 0 && (
                                <div className="px-6 py-4 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        Code Review Insights
                                    </h3>
                                    <ul className="space-y-2">
                                        {aiInsights.slice(0, 5).map((insight, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.05 }}
                                                className="flex items-start gap-2 text-sm text-muted-foreground"
                                            >
                                                <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                                                <span>{insight}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                        {/* Footer - fixed at bottom */}
                        <div className="px-6 py-4 border-t border-border flex justify-between gap-3 flex-shrink-0 bg-card">
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
            )}
        </AnimatePresence>
    )
}

export default ValidationResultModal
