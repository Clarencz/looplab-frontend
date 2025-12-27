"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileCheck, PlayCircle, Clock, CheckCircle2, AlertCircle, TestTube2, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkspaceFile {
  name: string
  type: "file" | "folder"
  content?: string
  children?: WorkspaceFile[]
}

interface SubmitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  projectName: string
  filesChanged: number
  lastUpdated: string
  hasRun: boolean
  workspaceFiles?: WorkspaceFile[]
  userTestRequirements?: {
    minTests: number
    testFilePattern: string
  }
}

interface CheckItem {
  label: string
  status: "passed" | "pending" | "warning" | "failed"
  detail?: string
}

// Helper to find test files recursively
const findTestFiles = (files: WorkspaceFile[], pattern: string): string[] => {
  const results: string[] = []
  for (const file of files) {
    if (file.type === "file" && file.name.includes(pattern)) {
      results.push(file.name)
    }
    if (file.type === "folder" && file.children) {
      results.push(...findTestFiles(file.children, pattern))
    }
  }
  return results
}

// Helper to detect language
const detectLanguage = (files: WorkspaceFile[]): string => {
  const hasFile = (name: string) => files.some(f => f.name === name || f.children?.some(c => c.name === name))
  if (hasFile("requirements.txt") || hasFile("main.py")) return "python"
  if (hasFile("package.json")) return "javascript"
  if (hasFile("Cargo.toml")) return "rust"
  return "unknown"
}

const SubmitModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectName,
  filesChanged,
  lastUpdated,
  hasRun,
  workspaceFiles = [],
  userTestRequirements,
}: SubmitModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Detect test files in workspace
  const language = useMemo(() => detectLanguage(workspaceFiles), [workspaceFiles])
  const testPattern = useMemo(() => {
    if (userTestRequirements?.testFilePattern) return userTestRequirements.testFilePattern.replace("*", "")
    return language === "python" ? "test_" : ".test."
  }, [userTestRequirements, language])

  const testFiles = useMemo(() => findTestFiles(workspaceFiles, testPattern), [workspaceFiles, testPattern])
  const minTests = userTestRequirements?.minTests ?? 1
  const hasEnoughTests = testFiles.length >= minTests

  // Calculate readiness based on checks
  const checks: CheckItem[] = useMemo(() => [
    {
      label: "Project Runs Successfully",
      status: hasRun ? "passed" : "pending",
      detail: hasRun ? "Project executed without errors" : "Run your project first"
    },
    {
      label: `Test Files (${testFiles.length}/${minTests} required)`,
      status: hasEnoughTests ? "passed" : testFiles.length > 0 ? "warning" : "pending",
      detail: hasEnoughTests
        ? `Found: ${testFiles.join(", ")}`
        : `Add test files matching ${testPattern}*`
    },
    {
      label: "Files Saved",
      status: "passed",
      detail: `${filesChanged} files modified`
    },
  ], [hasRun, testFiles, minTests, hasEnoughTests, testPattern, filesChanged])

  const passedChecks = checks.filter((c) => c.status === "passed").length
  const readinessScore = Math.round((passedChecks / checks.length) * 100)
  const canSubmit = hasRun && hasEnoughTests

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit()
    }, 500)
  }

  const getStatusIcon = (status: CheckItem["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case "failed":
        return <X className="w-4 h-4 text-red-500" />
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
            transition={{ duration: 0.2, delay: 0.1 }}
            className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Submit Project</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex">
              {/* Left Panel - Submission Summary */}
              <div className="w-1/3 p-6 border-r border-border bg-muted/30">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Submission Summary</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="font-medium">{projectName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{lastUpdated}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Language Detected</p>
                    <p className="text-sm capitalize">{language}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Readiness Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${readinessScore}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className={`h-full rounded-full ${readinessScore >= 80
                              ? "bg-green-500"
                              : readinessScore >= 50
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                            }`}
                        />
                      </div>
                      <span className="text-sm font-mono">{readinessScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Pre-flight Checks */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Pre-flight Checks</p>
                  <div className="space-y-3">
                    {checks.map((check, i) => (
                      <motion.div
                        key={check.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(check.status)}
                          <span className={check.status === "passed" ? "text-foreground" : "text-muted-foreground"}>
                            {check.label}
                          </span>
                        </div>
                        {check.detail && (
                          <p className="text-xs text-muted-foreground pl-6 truncate" title={check.detail}>
                            {check.detail}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center - Validation Stages Preview */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                    <FileCheck className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">Ready to Submit?</h3>

                  <p className="text-muted-foreground max-w-md mb-6">
                    Your project will be validated across 3 stages:
                  </p>

                  {/* Validation Stages Preview */}
                  <div className="flex justify-center gap-4 mb-8">
                    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border w-28">
                      <TestTube2 className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="text-xs font-medium">Your Tests</span>
                      <span className="text-[10px] text-muted-foreground">25%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border w-28">
                      <Shield className="w-5 h-5 text-purple-500 mb-1" />
                      <span className="text-xs font-medium">Validation</span>
                      <span className="text-[10px] text-muted-foreground">50%</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 border border-border w-28">
                      <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
                      <span className="text-xs font-medium">AI Review</span>
                      <span className="text-[10px] text-muted-foreground">25%</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="glow-button px-8"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !canSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Submit Now
                      </>
                    )}
                  </Button>

                  {!canSubmit && (
                    <p className="text-xs text-muted-foreground mt-4">
                      {!hasRun
                        ? "Run your project at least once before submitting."
                        : !hasEnoughTests
                          ? `Add at least ${minTests} test file(s) to submit.`
                          : "Complete the checklist to submit."}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SubmitModal
