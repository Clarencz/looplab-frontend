// Programming Category Validation Component
// Displays test results, linting warnings, coverage, and AI review

"use client"

import { motion } from "framer-motion"
import {
    Trophy,
    AlertCircle,
    TestTube2,
    Shield,
    AlertTriangle,
    Percent,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProgrammingValidationResult, CategoryValidationProps } from "@/categories/shared/interfaces/validation"

// Sub-components
import { ScoreCard } from "./validation/ScoreCard"
import { TestResultsSection } from "./validation/TestResultsSection"
import { LintWarningsSection } from "./validation/LintWarningsSection"
import { AIReviewSection } from "./validation/AIReviewSection"

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
                    <LintWarningsSection items={linting.items} />

                    {/* AI Review */}
                    <AIReviewSection score={aiReview.score} insights={aiReview.insights} />
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
