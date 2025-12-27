"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Loader2, Terminal, FileText, Copy, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ValidationStep {
  id: string
  name: string
  status: "pending" | "running" | "passed" | "failed"
  message?: string
  isAISuggested?: boolean
  evidence?: string
}

interface ValidationProgressProps {
  isRunning: boolean
  steps: ValidationStep[]
  logs: string[]
}

const ValidationProgress = ({ isRunning, steps, logs }: ValidationProgressProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)

  const filteredLogs = logs.filter((log) => log.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusIcon = (status: ValidationStep["status"]) => {
    switch (status) {
      case "pending":
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
      case "running":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />
      case "passed":
        return <CheckCircle2 className="w-4 h-4 text-primary" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
    }
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${isRunning ? "border-primary/50 animate-pulse-glow" : "border-border"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Validation Progress</h3>
          {isRunning && (
            <span className="ml-auto text-xs text-primary font-mono flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Running...
            </span>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            {getStatusIcon(step.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm ${step.status === "failed" ? "text-destructive" : ""}`}>{step.name}</p>
                {step.isAISuggested && (
                  <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded">AI Suggested</span>
                )}
              </div>
              {step.message && <p className="text-xs text-muted-foreground mt-0.5">{step.message}</p>}
              {step.evidence && (
                <p className="text-xs text-muted-foreground mt-1 font-mono bg-secondary/50 p-2 rounded">
                  Evidence: {step.evidence}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="border-t border-border">
          <div className="p-3 flex items-center gap-2 border-b border-border bg-secondary/30">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Logs</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 pl-7 text-xs w-40"
                />
              </div>
              <Button variant="ghost" size="sm" className="h-7" onClick={handleCopyLogs}>
                <Copy className="w-3 h-3 mr-1" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="p-3 max-h-48 overflow-y-auto font-mono text-xs bg-[hsl(var(--code-bg))]">
            {filteredLogs.map((log, index) => (
              <div key={index} className="text-muted-foreground py-0.5">
                <span className="text-muted-foreground/50 mr-2">{String(index + 1).padStart(3, "0")}</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ValidationProgress
