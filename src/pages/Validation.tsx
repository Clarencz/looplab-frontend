"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Circle,
  FileCode,
  Shield,
  Layers,
  Globe,
  Terminal,
  FileOutput,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Trophy,
  RotateCcw,
  FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ValidationStage {
  id: string
  name: string
  icon: React.ReactNode
  status: "pending" | "running" | "passed" | "failed"
  message?: string
}

interface InsightSection {
  title: string
  items: { label: string; status: "pass" | "fail" | "info"; file?: string }[]
}

const projectsData: Record<number, { name: string }> = {
  1: { name: "Task Manager API" },
  2: { name: "Portfolio Website" },
  3: { name: "Real-time Chat App" },
  4: { name: "E-commerce Dashboard" },
}

const Validation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const project = projectsData[Number(id)]

  const [stages, setStages] = useState<ValidationStage[]>([
    { id: "structure", name: "Structure Check", icon: <Layers className="w-4 h-4" />, status: "pending" },
    { id: "integrity", name: "File Integrity", icon: <Shield className="w-4 h-4" />, status: "pending" },
    { id: "components", name: "Required Components", icon: <FileCode className="w-4 h-4" />, status: "pending" },
    { id: "browser", name: "Browser Behavior", icon: <Globe className="w-4 h-4" />, status: "pending" },
    { id: "terminal", name: "Terminal Behavior", icon: <Terminal className="w-4 h-4" />, status: "pending" },
    { id: "output", name: "Project Output", icon: <FileOutput className="w-4 h-4" />, status: "pending" },
    { id: "ai", name: "AI Feedback", icon: <Sparkles className="w-4 h-4" />, status: "pending" },
  ])

  const [showResults, setShowResults] = useState(false)
  const [overallResult, setOverallResult] = useState<"passed" | "failed" | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>(["file-comments"])

  const insights: InsightSection[] = [
    {
      title: "File-Level Comments",
      items: [
        { label: "index.js - Entry point configured correctly", status: "pass" },
        { label: "auth.js - Missing JWT verification logic", status: "fail", file: "src/middleware/auth.js" },
        { label: "tasks.js - CRUD operations need completion", status: "fail", file: "src/api/tasks.js" },
        { label: "package.json - Dependencies up to date", status: "pass" },
      ],
    },
    {
      title: "Run-Time Behaviors",
      items: [
        { label: "Server starts successfully on port 3000", status: "pass" },
        { label: "MongoDB connection established", status: "pass" },
        { label: "API routes respond to requests", status: "info" },
      ],
    },
    {
      title: "Error Captures",
      items: [
        { label: "No unhandled promise rejections", status: "pass" },
        { label: "Error middleware catches exceptions", status: "pass" },
      ],
    },
    {
      title: "Suggested Improvements",
      items: [
        { label: "Add input validation with express-validator", status: "info" },
        { label: "Implement rate limiting for API endpoints", status: "info" },
        { label: "Add comprehensive error messages", status: "info" },
      ],
    },
  ]

  // Simulate validation stages running one by one
  useEffect(() => {
    const runValidation = async () => {
      for (let i = 0; i < stages.length; i++) {
        // Set current stage to running
        setStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s)))

        // Wait for stage to complete
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

        // Determine if stage passes or fails (simulate some failures for demo)
        const failedStages = ["components"] // These will fail for demo
        const passed = !failedStages.includes(stages[i].id)

        setStages((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: passed ? "passed" : "failed",
                  message: passed ? undefined : "Some issues found",
                }
              : s,
          ),
        )
      }

      // Show results after all stages complete
      setTimeout(() => {
        setShowResults(true)
        const allPassed = stages.every((s) => s.id === "components" || true) // Demo: all pass except components
        setOverallResult(allPassed ? "passed" : "failed")
      }, 500)
    }

    runValidation()
  }, [])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleFixInEditor = (file: string) => {
    navigate(`/workspace/${id}?file=${encodeURIComponent(file)}`)
  }

  const handleAddToProfile = () => {
    toast.success("Project added to your profile!")
    navigate("/stats")
  }

  const handleResubmit = () => {
    navigate(`/workspace/${id}`)
  }

  const getStageIcon = (status: ValidationStage["status"], defaultIcon: React.ReactNode) => {
    switch (status) {
      case "running":
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />
      case "passed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  if (!project) {
    navigate("/projects")
    return null
  }

  const failedCount = stages.filter((s) => s.status === "failed").length
  const passedCount = stages.filter((s) => s.status === "passed").length
  const isPassed = failedCount === 0 && passedCount === stages.length

  return (
    <div className="min-h-screen bg-background">
      {/* Validation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/workspace/${id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workspace
            </Button>

            <div className="h-4 w-px bg-border" />

            <div>
              <h1 className="font-semibold">{project.name}</h1>
              <p className="text-xs text-muted-foreground">Submitted {new Date().toLocaleString()}</p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`px-3 py-1 ${
              showResults
                ? isPassed
                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                  : "bg-red-500/10 text-red-500 border-red-500/30"
                : "bg-primary/10 text-primary border-primary/30"
            }`}
          >
            {showResults ? (isPassed ? "Passed" : "Needs Fixes") : "Running Checks"}
          </Badge>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left - Validation Timeline */}
          <div className="w-64 shrink-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Validation Progress</h3>
            <div className="space-y-1">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    stage.status === "running" ? "bg-primary/5" : ""
                  }`}
                >
                  {getStageIcon(stage.status, stage.icon)}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate ${
                        stage.status === "pending" ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {stage.name}
                    </p>
                    {stage.message && <p className="text-xs text-red-500">{stage.message}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Center - Main Validation Summary */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card border border-border rounded-xl p-12 text-center"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Validating Your Project</h2>
                  <p className="text-muted-foreground">Running automated checks on your submission...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Overall Result Card */}
                  <div
                    className={`bg-card border rounded-xl p-8 text-center ${
                      isPassed ? "border-green-500/30" : "border-red-500/30"
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        isPassed ? "bg-green-500/10" : "bg-red-500/10"
                      }`}
                    >
                      {isPassed ? (
                        <Trophy className="w-10 h-10 text-green-500" />
                      ) : (
                        <XCircle className="w-10 h-10 text-red-500" />
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{isPassed ? "Project Passed!" : "Fix Required"}</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {isPassed
                        ? "Your project runs correctly and matches the expected behavior. Great work!"
                        : "Some elements function well, but a few areas need improvement before completion."}
                    </p>
                  </div>

                  {/* Detailed Insights */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h3 className="font-semibold">Detailed Insights</h3>
                    </div>

                    <div className="divide-y divide-border">
                      {insights.map((section) => (
                        <div key={section.title}>
                          <button
                            onClick={() => toggleSection(section.title)}
                            className="w-full px-6 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-sm font-medium">{section.title}</span>
                            {expandedSections.includes(section.title) ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedSections.includes(section.title) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-4 space-y-2">
                                  {section.items.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                                    >
                                      <div className="flex items-center gap-2">
                                        {item.status === "pass" ? (
                                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : item.status === "fail" ? (
                                          <XCircle className="w-4 h-4 text-red-500" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-blue-500" />
                                        )}
                                        <span className="text-sm">{item.label}</span>
                                      </div>

                                      {item.file && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs"
                                          onClick={() => handleFixInEditor(item.file!)}
                                        >
                                          Fix in Editor
                                          <ExternalLink className="w-3 h-3 ml-1" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Claim Project or Retry */}
                  {isPassed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-6 text-center"
                    >
                      <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">Project Completed!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You've successfully finished this LoopLab project. Would you like to add it to your public
                        profile?
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <Button onClick={handleAddToProfile} className="glow-button">
                          Add to Profile
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/projects/${id}`)}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-muted/30 border border-border rounded-xl p-6 text-center"
                    >
                      <h3 className="text-lg font-semibold mb-2">Your project is close!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Review the issues above and make the necessary adjustments. You can resubmit as many times as
                        needed.
                      </p>
                      <Button onClick={handleResubmit}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Return to Workspace
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Validation
