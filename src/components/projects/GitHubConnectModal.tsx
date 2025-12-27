"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Github, GitBranch, Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GitHubConnectModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  onConnect: (repoUrl: string) => void
}

const GitHubConnectModal = ({ isOpen, onClose, projectName, onConnect }: GitHubConnectModalProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [copied, setCopied] = useState(false)

  const cloneCommand = `git clone https://github.com/loops/starter-${projectName.toLowerCase().replace(/\s+/g, "-")}.git`
  const branchName = "starter"

  const handleAuthorize = () => {
    // Simulate OAuth flow
    setTimeout(() => {
      setIsAuthorized(true)
    }, 1000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Connect GitHub</h2>
                  <p className="text-xs text-muted-foreground">{projectName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isAuthorized ? (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Connect your GitHub account to clone the project and work locally in your preferred editor.
                </p>

                <Button className="w-full glow-button" onClick={handleAuthorize}>
                  <Github className="w-4 h-4 mr-2" />
                  Authorize with GitHub
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="w-4 h-4" />
                  GitHub connected successfully
                </div>

                {/* Clone command */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Clone command</label>
                  <div className="flex gap-2">
                    <Input value={cloneCommand} readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Branch info */}
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <span>Starter branch:</span>
                    <code className="px-2 py-0.5 bg-card rounded text-xs font-mono text-primary">{branchName}</code>
                  </div>
                </div>

                {/* Work locally tip */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-primary">Work locally tip:</strong> Clone the repository, checkout the
                    starter branch, and push your changes when ready for validation.
                  </p>
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={() => onConnect(cloneCommand)}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in GitHub
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GitHubConnectModal
