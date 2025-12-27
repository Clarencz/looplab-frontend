"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, Circle, Sparkles, TestTube2, Shield, Trophy, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ValidationStageProgress {
    id: string
    label: string
    status: "pending" | "running" | "complete" | "failed"
    score?: number
    passed?: number
    total?: number
    message?: string
}

interface ValidationProgressModalProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (result: any) => void
    userProjectId: string
    projectName: string
}

const ValidationProgressModal = ({
    isOpen,
    onClose,
    onComplete,
    userProjectId,
    projectName,
}: ValidationProgressModalProps) => {
    const [stages, setStages] = useState<ValidationStageProgress[]>([
        { id: "user_tests", label: "Your Tests", status: "pending" },
        { id: "backend_tests", label: "Validation Tests", status: "pending" },
        { id: "ai_review", label: "AI Code Review", status: "pending" },
    ])
    const [error, setError] = useState<string | null>(null)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        if (!isOpen || !userProjectId) return

        // Start SSE connection
        const startValidation = async () => {
            try {
                const token = localStorage.getItem("access_token")

                // Use fetch with streaming for SSE (EventSource doesn't support POST)
                const response = await fetch("/api/v1/user-projects/submit-stream", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userProjectId }),
                })

                if (!response.ok) {
                    throw new Error("Failed to start validation")
                }

                const reader = response.body?.getReader()
                if (!reader) {
                    throw new Error("No response body")
                }

                const decoder = new TextDecoder()
                let buffer = ""

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split("\n")
                    buffer = lines.pop() || ""

                    for (const line of lines) {
                        if (line.startsWith("event:")) {
                            const eventType = line.substring(6).trim()
                            continue
                        }
                        if (line.startsWith("data:")) {
                            const data = JSON.parse(line.substring(5).trim())
                            handleSSEEvent(data)
                        }
                    }
                }
            } catch (err: any) {
                console.error("Validation stream error:", err)
                setError(err.message || "Validation failed")
            }
        }

        const handleSSEEvent = (data: any) => {
            if (data.stage) {
                // Stage update
                setStages(prev => prev.map(stage => {
                    if (stage.id === data.stage) {
                        if (data.score !== undefined) {
                            // Stage complete
                            return {
                                ...stage,
                                status: "complete",
                                score: data.score,
                                passed: data.passed,
                                total: data.total,
                                message: data.message,
                            }
                        } else {
                            // Stage starting
                            return { ...stage, status: "running", message: data.message }
                        }
                    }
                    return stage
                }))
            }

            if (data.overallStatus) {
                // Validation complete - this is the final result
                setIsComplete(true)
                setTimeout(() => {
                    onComplete(data)
                }, 1500) // Small delay to show final state
            }

            if (data.message && !data.stage) {
                // Error message
                setError(data.message)
            }
        }

        startValidation()
    }, [isOpen, userProjectId])

    const getStageIcon = (stageId: string, status: string) => {
        if (status === "running") {
            return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        }
        if (status === "complete") {
            return <CheckCircle2 className="w-5 h-5 text-green-500" />
        }
        if (status === "failed") {
            return <AlertCircle className="w-5 h-5 text-red-500" />
        }

        // Pending
        switch (stageId) {
            case "user_tests":
                return <TestTube2 className="w-5 h-5 text-muted-foreground/40" />
            case "backend_tests":
                return <Shield className="w-5 h-5 text-muted-foreground/40" />
            case "ai_review":
                return <Sparkles className="w-5 h-5 text-muted-foreground/40" />
            default:
                return <Circle className="w-5 h-5 text-muted-foreground/40" />
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-6 text-center border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
                        {isComplete ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                            >
                                <Trophy className="w-8 h-8 text-green-500" />
                            </motion.div>
                        ) : (
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        )}
                        <h2 className="text-xl font-bold">
                            {isComplete ? "Validation Complete!" : "Validating Your Solution"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{projectName}</p>
                    </div>

                    {/* Stages */}
                    <div className="px-6 py-6 space-y-4">
                        {stages.map((stage, index) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${stage.status === "running"
                                        ? "bg-blue-500/10 border border-blue-500/30"
                                        : stage.status === "complete"
                                            ? "bg-green-500/5 border border-green-500/20"
                                            : "bg-muted/30 border border-border"
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {getStageIcon(stage.id, stage.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">{stage.label}</div>
                                    {stage.message && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {stage.message}
                                        </p>
                                    )}
                                </div>
                                {stage.status === "complete" && stage.score !== undefined && (
                                    <div className="flex-shrink-0 text-sm font-mono">
                                        <span className="text-green-500">{stage.score}</span>
                                        <span className="text-muted-foreground">/100</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="px-6 pb-4">
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {(error || isComplete) && (
                        <div className="px-6 py-4 border-t border-border flex justify-end">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ValidationProgressModal
