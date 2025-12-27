"use client"

import { ArrowLeft, Play, Send, Circle, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface WorkspaceHeaderProps {
  projectName: string
  status: "saved" | "unsaved" | "running"
  onRun: () => void
  onStop?: () => void
  onSubmit: () => void
  isRunning?: boolean
  hasRun?: boolean
  isSubmitDisabled?: boolean
}

const WorkspaceHeader = ({ projectName, status, onRun, onStop, onSubmit, isRunning, hasRun = false, isSubmitDisabled = false }: WorkspaceHeaderProps) => {
  const navigate = useNavigate()

  const statusConfig = {
    saved: { label: "Saved", color: "text-primary" },
    unsaved: { label: "Unsaved", color: "text-yellow-500" },
    running: { label: "Running", color: "text-accent" },
  }

  const currentStatus = statusConfig[status]

  return (
    <TooltipProvider>
      <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>

          <div className="h-4 w-px bg-border" />

          <span className="font-mono text-sm font-medium">{projectName}</span>

          <div className="flex items-center gap-1.5">
            <Circle className={`w-2 h-2 fill-current ${currentStatus.color}`} />
            <span className={`text-xs font-mono ${currentStatus.color}`}>{currentStatus.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button size="sm" variant="destructive" className="h-8 px-3" onClick={onStop}>
              <Square className="w-3.5 h-3.5 mr-1.5" />
              Stop
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent" onClick={onRun}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Run
            </Button>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button size="sm" className="h-8 px-3 glow-button" onClick={onSubmit} disabled={!hasRun || isSubmitDisabled}>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Project
                </Button>
              </span>
            </TooltipTrigger>
            {(!hasRun || isSubmitDisabled) && (
              <TooltipContent>
                {!hasRun ? (
                  <p>Run your project at least once before submitting</p>
                ) : (
                  <p>Make changes to your code before resubmitting</p>
                )}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}

export default WorkspaceHeader
