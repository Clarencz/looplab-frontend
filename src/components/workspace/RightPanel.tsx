"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import WorkspaceTerminal from "./WorkspaceTerminal"
import SandboxedBrowser from "./SandboxedBrowser"

interface TerminalLine {
  type: "info" | "success" | "error" | "warning" | "input" | "output"
  content: string
}

interface RightPanelProps {
  logs: TerminalLine[]
  isRunning: boolean
  previewUrl: string
  previewContent?: string
  hasPreview: boolean
  isExpanded: boolean
  onToggleExpand: () => void
}

const RightPanel = ({
  logs,
  isRunning,
  previewUrl,
  previewContent,
  hasPreview,
  isExpanded,
  onToggleExpand,
}: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<"terminal" | "preview">("terminal")

  return (
    <div className="h-full flex flex-col bg-card">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "terminal" | "preview")}
        className="flex-1 flex flex-col"
      >
        <TabsList className="h-9 w-full justify-start rounded-none border-b border-border bg-card px-2 shrink-0">
          <TabsTrigger value="terminal" className="h-7 px-3 text-xs font-mono data-[state=active]:bg-secondary rounded">
            Terminal
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="h-7 px-3 text-xs font-mono data-[state=active]:bg-secondary rounded"
            disabled={!hasPreview}
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="flex-1 m-0 data-[state=inactive]:hidden">
          <WorkspaceTerminal logs={logs} isRunning={isRunning} />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 data-[state=inactive]:hidden">
          <SandboxedBrowser
            url={previewUrl}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
            previewContent={previewContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RightPanel
