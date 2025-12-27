// Interactive AI Tutor Component
// Shows step-by-step inline explanations with an AI avatar

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface InlineExplanation {
    id: string
    filePath: string
    lineStart: number
    lineEnd: number
    issueType: 'error' | 'warning' | 'optimization' | 'bestPractice' | 'style' | 'security' | 'performance'
    title: string
    explanation: string
    codeSnippet?: string
    suggestedFix?: string
    avatarPosition: 'left' | 'right' | 'top' | 'bottom'
    severity: 'critical' | 'major' | 'minor' | 'info'
    order: number
}

interface TutoringSummary {
    totalIssues: number
    criticalCount: number
    majorCount: number
    minorCount: number
    keyLearnings: string[]
    recommendedResources: { title: string; url: string; resourceType: string }[]
}

interface TutoringSession {
    sessionId: string
    userProjectId: string
    categorySlug: string
    explanations: InlineExplanation[]
    currentIndex: number
    totalCount: number
    summary: TutoringSummary
    canRedo: boolean
}

interface TutoringStyle {
    avatarName: string
    avatarEmoji: string
    tone: string
    focusAreas: string[]
}

interface AiTutorProps {
    session: TutoringSession
    style: TutoringStyle
    onClose: () => void
    onRedo: () => void
    onComplete: () => void
}

const severityIcon = {
    critical: AlertCircle,
    major: AlertTriangle,
    minor: Info,
    info: Info,
}

const severityColor = {
    critical: 'text-red-500 bg-red-500/10 border-red-500/30',
    major: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
    minor: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
    info: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
}

export function InteractiveAiTutor({ session, style, onClose, onRedo, onComplete }: AiTutorProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showSummary, setShowSummary] = useState(false)

    const currentExplanation = session.explanations[currentIndex]
    const isLastExplanation = currentIndex === session.explanations.length - 1
    const hasExplanations = session.explanations.length > 0

    const handleNext = () => {
        if (isLastExplanation) {
            setShowSummary(true)
        } else {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (showSummary) {
            setShowSummary(false)
        } else if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    if (!hasExplanations) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 w-96 bg-card rounded-xl border border-border shadow-2xl p-6 z-50"
            >
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{style.avatarEmoji}</span>
                    <div>
                        <h3 className="font-bold">{style.avatarName}</h3>
                        <p className="text-sm text-muted-foreground">AI Tutor</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 hover:bg-muted rounded">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h4 className="font-semibold text-lg">Great job!</h4>
                    <p className="text-muted-foreground mt-2">No issues found in your code.</p>
                </div>
                <button
                    onClick={onComplete}
                    className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                    Continue
                </button>
            </motion.div>
        )
    }

    if (showSummary) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
            >
                <div className="w-full max-w-lg bg-card rounded-xl border border-border shadow-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">{style.avatarEmoji}</span>
                        <div>
                            <h3 className="font-bold text-lg">Review Complete!</h3>
                            <p className="text-sm text-muted-foreground">Here's your summary</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{session.summary.totalIssues}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center p-3 bg-red-500/10 rounded-lg">
                            <p className="text-2xl font-bold text-red-500">{session.summary.criticalCount}</p>
                            <p className="text-xs text-muted-foreground">Critical</p>
                        </div>
                        <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                            <p className="text-2xl font-bold text-orange-500">{session.summary.majorCount}</p>
                            <p className="text-xs text-muted-foreground">Major</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-500">{session.summary.minorCount}</p>
                            <p className="text-xs text-muted-foreground">Minor</p>
                        </div>
                    </div>

                    {session.summary.keyLearnings.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Key Learnings</h4>
                            <ul className="space-y-1">
                                {session.summary.keyLearnings.map((learning, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        {learning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3">
                        {session.canRedo && (
                            <button
                                onClick={onRedo}
                                className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-muted flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Redo Project
                            </button>
                        )}
                        <button
                            onClick={onComplete}
                            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                        >
                            Finish Review
                        </button>
                    </div>
                </div>
            </motion.div>
        )
    }

    const SeverityIcon = severityIcon[currentExplanation.severity]

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="fixed bottom-6 right-6 w-[420px] bg-card rounded-xl border border-border shadow-2xl z-50"
            >
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                    <span className="text-3xl">{style.avatarEmoji}</span>
                    <div className="flex-1">
                        <h3 className="font-bold">{style.avatarName}</h3>
                        <p className="text-xs text-muted-foreground">
                            Issue {currentIndex + 1} of {session.totalCount}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Issue Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${severityColor[currentExplanation.severity]}`}>
                        <SeverityIcon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">{currentExplanation.severity}</span>
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-lg">{currentExplanation.title}</h4>

                    {/* File Location */}
                    <p className="text-sm text-muted-foreground">
                        📁 {currentExplanation.filePath} • Lines {currentExplanation.lineStart}-{currentExplanation.lineEnd}
                    </p>

                    {/* Explanation */}
                    <p className="text-sm leading-relaxed">{currentExplanation.explanation}</p>

                    {/* Code Snippet */}
                    {currentExplanation.codeSnippet && (
                        <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                            <code>{currentExplanation.codeSnippet}</code>
                        </div>
                    )}

                    {/* Suggested Fix */}
                    {currentExplanation.suggestedFix && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-500 mb-1">💡 Suggested Fix</p>
                            <p className="text-sm">{currentExplanation.suggestedFix}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between p-4 border-t border-border">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-muted rounded disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    {/* Progress dots */}
                    <div className="flex gap-1">
                        {session.explanations.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : i < currentIndex ? 'bg-primary/50' : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded"
                    >
                        {isLastExplanation ? 'View Summary' : 'Next'}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default InteractiveAiTutor
