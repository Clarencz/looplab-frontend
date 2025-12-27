"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StartFlowOverlayProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  projectName: string
}

const StartFlowOverlay = ({ isOpen, onClose, onConfirm, projectName }: StartFlowOverlayProps) => {
  const steps = [
    "This project will be provided as a repository you can clone or open in the browser.",
    "Edits may be done in your editor of choice if you connect GitHub.",
    "When you finish, send the repo back for validation to complete the project.",
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card border border-border rounded-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Start Project</h2>
                <p className="text-sm text-muted-foreground">{projectName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Workflow steps */}
            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted-foreground">Here's how the workflow works:</p>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-mono text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
              <p className="text-xs text-muted-foreground">
                This setup does not teach or hint how to solve the project. It only confirms what will happen when you
                start.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1 glow-button" onClick={onConfirm}>
                <Check className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StartFlowOverlay
