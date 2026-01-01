import { useState } from "react"
import { TutorSession, InlineExplanation } from "@/lib/api/types"
import { ChevronLeft, ChevronRight, X, CheckCircle, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ComicTutorProps {
    session: TutorSession
    onNext?: () => void
    onPrevious?: () => void
    onComplete?: () => void
    onClose?: () => void
}

const AVATAR_EMOJIS: Record<string, string> = {
    "code-wizard": "🧙‍♂️",
    "data-scientist": "👨‍🔬",
    "math-professor": "👨‍🏫",
    "finance-expert": "💼",
    "algorithm-guru": "🤖",
}

const SEVERITY_COLORS: Record<string, string> = {
    critical: "bg-red-100 dark:bg-red-950 border-red-500",
    major: "bg-orange-100 dark:bg-orange-950 border-orange-500",
    minor: "bg-yellow-100 dark:bg-yellow-950 border-yellow-500",
    info: "bg-blue-100 dark:bg-blue-950 border-blue-500",
}

export function ComicTutor({
    session,
    onNext,
    onPrevious,
    onComplete,
    onClose,
}: ComicTutorProps) {
    const currentExplanation = session.explanations[session.currentIndex]
    const progress = ((session.currentIndex + 1) / session.totalCount) * 100
    const isFirst = session.currentIndex === 0
    const isLast = session.currentIndex === session.totalCount - 1

    const avatarEmoji = AVATAR_EMOJIS[session.summary.recommendedResources[0]?.resourceType] || "🤖"

    const handleNext = () => {
        if (!isLast && onNext) {
            onNext()
        } else if (isLast && onComplete) {
            onComplete()
        }
    }

    const handlePrevious = () => {
        if (!isFirst && onPrevious) {
            onPrevious()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-4xl">{avatarEmoji}</div>
                            <div>
                                <h2 className="text-2xl font-bold">AI Code Tutor</h2>
                                <p className="text-sm text-muted-foreground">
                                    Category: <Badge variant="outline">{session.categorySlug}</Badge>
                                </p>
                            </div>
                        </div>
                        {onClose && (
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">
                                Step {session.currentIndex + 1} of {session.totalCount}
                            </span>
                            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 overflow-y-auto p-6">
                    {currentExplanation && (
                        <div className="space-y-6">
                            {/* Issue Badge */}
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-sm px-3 py-1",
                                        SEVERITY_COLORS[currentExplanation.severity]
                                    )}
                                >
                                    {currentExplanation.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="secondary">{currentExplanation.issueType}</Badge>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold">{currentExplanation.title}</h3>

                            {/* Comic-style speech bubble */}
                            <div className="relative">
                                <div className="absolute -left-12 top-0 text-6xl">{avatarEmoji}</div>
                                <div className="ml-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-800 relative">
                                    {/* Speech bubble tail */}
                                    <div className="absolute -left-3 top-6 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-purple-200 dark:border-r-purple-800 border-b-[15px] border-b-transparent"></div>

                                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                        {currentExplanation.explanation}
                                    </p>
                                </div>
                            </div>

                            {/* Code Snippet */}
                            {currentExplanation.codeSnippet && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-muted-foreground">
                                        📍 {currentExplanation.filePath} (Lines {currentExplanation.lineStart}-
                                        {currentExplanation.lineEnd})
                                    </h4>
                                    <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                                        <code className="text-sm">{currentExplanation.codeSnippet}</code>
                                    </pre>
                                </div>
                            )}

                            {/* Suggested Fix */}
                            {currentExplanation.suggestedFix && (
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="h-5 w-5 text-green-600" />
                                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                                            Suggested Fix
                                        </h4>
                                    </div>
                                    <p className="text-sm text-green-800 dark:text-green-200">
                                        {currentExplanation.suggestedFix}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Footer Navigation */}
                <div className="p-6 border-t bg-muted/30">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirst}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="text-sm text-muted-foreground">
                            {isLast ? "Last step!" : `${session.totalCount - session.currentIndex - 1} more to go`}
                        </div>

                        <Button onClick={handleNext} className="gap-2">
                            {isLast ? (
                                <>
                                    Complete
                                    <CheckCircle className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
