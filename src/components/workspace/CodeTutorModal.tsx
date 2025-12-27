"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2, Lightbulb, Code2, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api/client"
import { toast } from "sonner"

interface Suggestion {
    type: "error" | "warning" | "hint" | "tip"
    line?: number
    message: string
    codeExample?: string
}

interface Message {
    id: string
    role: "tutor" | "student"
    content: string
    codeSnippet?: string
    timestamp: Date
}

interface CodeTutorModalProps {
    isOpen: boolean
    onClose: () => void
    userProjectId: string
    validationResult: any
}

const CodeTutorModal = ({
    isOpen,
    onClose,
    userProjectId,
    validationResult,
}: CodeTutorModalProps) => {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Initial analysis when modal opens
    useEffect(() => {
        if (isOpen && !sessionId) {
            analyzeCode()
        }
    }, [isOpen])

    const analyzeCode = async () => {
        setIsAnalyzing(true)
        try {
            const response = await apiClient.post("/tutor/analyze", {
                userProjectId,
                validationResult,
            })

            setSessionId(response.data.sessionId)
            setSuggestions(response.data.suggestions || [])

            // Add initial tutor message
            setMessages([{
                id: "initial",
                role: "tutor",
                content: response.data.analysis,
                timestamp: new Date(),
            }])

            if (response.data.encouragement) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: "encouragement",
                        role: "tutor",
                        content: response.data.encouragement,
                        timestamp: new Date(),
                    }])
                }, 1000)
            }
        } catch (error) {
            console.error("Analysis error:", error)
            toast.error("Failed to analyze code")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const sendMessage = async () => {
        if (!inputMessage.trim() || !sessionId) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "student",
            content: inputMessage,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage("")
        setIsLoading(true)

        try {
            const response = await apiClient.post("/tutor/chat", {
                sessionId,
                message: inputMessage,
            })

            const tutorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "tutor",
                content: response.data.reply,
                codeSnippet: response.data.codeExample,
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, tutorMessage])

            if (response.data.followUpQuestion) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 2).toString(),
                        role: "tutor",
                        content: response.data.followUpQuestion,
                        timestamp: new Date(),
                    }])
                }, 1500)
            }
        } catch (error) {
            console.error("Chat error:", error)
            toast.error("Failed to send message")
        } finally {
            setIsLoading(false)
        }
    }

    const getSuggestionIcon = (type: string) => {
        switch (type) {
            case "error":
                return "❌"
            case "warning":
                return "⚠️"
            case "hint":
                return "💡"
            case "tip":
                return "✨"
            default:
                return "ℹ️"
        }
    }

    const getSuggestionColor = (type: string) => {
        switch (type) {
            case "error":
                return "border-red-500/30 bg-red-500/5"
            case "warning":
                return "border-yellow-500/30 bg-yellow-500/5"
            case "hint":
                return "border-blue-500/30 bg-blue-500/5"
            case "tip":
                return "border-green-500/30 bg-green-500/5"
            default:
                return "border-muted bg-muted/20"
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
                    className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">AI Code Tutor</h2>
                                <p className="text-xs text-muted-foreground">Let's improve your code together</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Suggestions Panel */}
                    {suggestions.length > 0 && (
                        <div className="px-6 py-4 border-b border-border bg-muted/20">
                            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                Key Issues Found
                            </h3>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {suggestions.map((suggestion, i) => (
                                    <div
                                        key={i}
                                        className={`p-2 rounded-lg border text-sm ${getSuggestionColor(suggestion.type)}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-base">{getSuggestionIcon(suggestion.type)}</span>
                                            <div className="flex-1">
                                                {suggestion.line && (
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        Line {suggestion.line}:{" "}
                                                    </span>
                                                )}
                                                <span>{suggestion.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {isAnalyzing ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span className="ml-2 text-sm text-muted-foreground">Analyzing your code...</span>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "student" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.role === "student"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {message.role === "tutor" && (
                                                <Sparkles className="w-3 h-3 text-primary" />
                                            )}
                                            <span className="text-xs font-medium">
                                                {message.role === "tutor" ? "Tutor" : "You"}
                                            </span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        {message.codeSnippet && (
                                            <div className="mt-2 p-2 rounded bg-background/50 border border-border">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Code2 className="w-3 h-3" />
                                                    <span className="text-xs font-medium">Code Example</span>
                                                </div>
                                                <pre className="text-xs font-mono overflow-x-auto">
                                                    {message.codeSnippet}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-6 py-4 border-t border-border bg-muted/20">
                        <div className="flex items-center gap-2">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                placeholder="Ask a question about your code..."
                                disabled={isLoading || isAnalyzing}
                                className="flex-1"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading || isAnalyzing}
                                size="icon"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Ask questions about your code, errors, or how to improve
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default CodeTutorModal
