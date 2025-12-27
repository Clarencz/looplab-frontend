"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, FileText, Download, Save, Share2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CVGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  completionStatus: {
    personalInfo: boolean
    skills: boolean
    projects: boolean
    summary: boolean
    education: boolean
  }
}

type Step = "check" | "style" | "generate" | "download"

const cvStyles = [
  { id: "classic", name: "Classic", description: "Traditional professional layout" },
  { id: "modern", name: "Modern", description: "Clean contemporary design" },
  { id: "minimal", name: "Minimal", description: "Simple and elegant" },
  { id: "tech", name: "Tech Portfolio", description: "Developer-focused style" },
]

export function CVGenerateModal({ isOpen, onClose, completionStatus }: CVGenerateModalProps) {
  const [step, setStep] = useState<Step>("check")
  const [selectedStyle, setSelectedStyle] = useState("modern")
  const [isGenerating, setIsGenerating] = useState(false)

  const completionItems = [
    { key: "personalInfo", label: "Personal Info", completed: completionStatus.personalInfo },
    { key: "skills", label: "Skills", completed: completionStatus.skills },
    { key: "projects", label: "Projects", completed: completionStatus.projects },
    { key: "summary", label: "Professional Summary", completed: completionStatus.summary },
    { key: "education", label: "Education", completed: completionStatus.education },
  ]

  const allRequired = completionStatus.personalInfo && completionStatus.skills && completionStatus.projects
  const canProceed = allRequired

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setStep("download")
    }, 2500)
  }

  const handleClose = () => {
    setStep("check")
    setSelectedStyle("modern")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-mono flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {step === "check" && "Profile Completion Check"}
            {step === "style" && "Choose CV Style"}
            {step === "generate" && "Generating Your CV"}
            {step === "download" && "CV Ready!"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Completion Check */}
          {step === "check" && (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                {completionItems.map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-3 rounded-lg ${item.completed
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-secondary/50 border border-border/50"
                      }`}
                  >
                    <span className="text-sm">{item.label}</span>
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button onClick={() => setStep("style")} disabled={!canProceed} className="flex-1">
                  Continue
                </Button>
              </div>
              {!canProceed && (
                <p className="text-xs text-muted-foreground text-center">
                  Complete at least Personal Info, Skills, and Projects to generate your CV
                </p>
              )}
            </motion.div>
          )}

          {/* Step 2: Style Selection */}
          {step === "style" && (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {cvStyles.map((style) => (
                  <Card
                    key={style.id}
                    className={`p-4 cursor-pointer transition-all ${selectedStyle === style.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-primary/50"
                      }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="h-16 bg-secondary/50 rounded mb-3 flex items-center justify-center">
                      <div className="w-12 h-12 bg-muted rounded" />
                    </div>
                    <p className="font-medium text-sm">{style.name}</p>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                  </Card>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("check")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => {
                    setStep("generate")
                    handleGenerate()
                  }}
                  className="flex-1"
                >
                  Generate
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Generating */}
          {step === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 flex flex-col items-center justify-center space-y-4"
            >
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-mono">Building Your CV...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </motion.div>
          )}

          {/* Step 4: Download */}
          {step === "download" && (
            <motion.div
              key="download"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-mono">CV Generated Successfully!</p>
                <p className="text-sm text-muted-foreground text-center">
                  Your CV now includes your verified LoopLab projects and will update automatically as you complete more
                  challenges.
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download CV (PDF)
                </Button>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Save className="h-4 w-4" />
                  Save to Profile
                </Button>
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  Share CV Link (Coming Soon)
                </Button>
              </div>
              <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
