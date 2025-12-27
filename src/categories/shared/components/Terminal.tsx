"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TerminalLine {
  type: "info" | "success" | "error" | "warning" | "input" | "output"
  content: string
  timestamp?: string
}

interface WorkspaceTerminalProps {
  logs: TerminalLine[]
  isRunning?: boolean
}

const WorkspaceTerminal = ({ logs, isRunning }: WorkspaceTerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "text-primary"
      case "error":
        return "text-destructive"
      case "warning":
        return "text-yellow-500"
      case "input":
        return "text-accent"
      case "output":
        return "text-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getPrefix = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "[SUCCESS]"
      case "error":
        return "[ERROR]"
      case "warning":
        return "[WARN]"
      case "input":
        return "$"
      default:
        return "[INFO]"
    }
  }

  return (
    <div className="h-full bg-[hsl(var(--code-bg))] flex flex-col">
      <div className="h-8 bg-card border-b border-border flex items-center px-3 shrink-0">
        <span className="text-xs font-mono text-muted-foreground">Terminal</span>
        {isRunning && (
          <span className="ml-2 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs text-accent font-mono">Running</span>
          </span>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto p-3 font-mono text-xs space-y-1"
        >
          {logs.map((line, i) => (
            <div key={i} className={cn("flex gap-2", getLineColor(line.type))}>
              <span className="opacity-60 shrink-0">{getPrefix(line.type)}</span>
              <span className="break-all whitespace-pre-wrap">{line.content}</span>
            </div>
          ))}

          {isRunning && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="opacity-60">$</span>
              <span className="terminal-cursor">_</span>
            </div>
          )}

          {logs.length === 0 && !isRunning && (
            <div className="text-muted-foreground">
              <p>Terminal ready. Click "Run" to execute the project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkspaceTerminal
