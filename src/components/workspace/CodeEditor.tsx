"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MonacoCodeEditor } from "./MonacoCodeEditor"
import { DataFileViewer } from "./DataFileViewer"

// Data file extensions that should use DataFileViewer instead of Monaco
const DATA_EXTENSIONS = ['csv', 'tsv']

interface EditorTab {
  path: string
  name: string
  content: string
  isDirty?: boolean
}

interface CodeEditorProps {
  tabs: EditorTab[]
  activeTab: string | null
  onTabChange: (path: string) => void
  onTabClose: (path: string) => void
  onContentChange: (path: string, content: string) => void
}

// Get file extension from path
const getFileExtension = (path: string): string => {
  const parts = path.split(".")
  return parts.length > 1 ? parts[parts.length - 1] : "txt"
}

const CodeEditor = ({ tabs, activeTab, onTabChange, onTabClose, onContentChange }: CodeEditorProps) => {
  const [copied, setCopied] = useState(false)

  const activeTabData = tabs.find((t) => t.path === activeTab)

  const handleCopy = async () => {
    if (activeTabData) {
      await navigator.clipboard.writeText(activeTabData.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEditorChange = (value: string) => {
    if (activeTab) {
      onContentChange(activeTab, value)
    }
  }

  if (tabs.length === 0) {
    return (
      <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center text-muted-foreground max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="font-mono text-base mb-2">No file open</p>
          <p className="text-sm opacity-70">Select a file from the left panel to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex flex-col min-w-0">
      {/* Tabs bar */}
      <div className="h-9 bg-card border-b border-border flex items-center overflow-x-auto shrink-0">
        {tabs.map((tab) => (
          <div
            key={tab.path}
            className={cn(
              "group flex items-center gap-2 px-3 h-full border-r border-border cursor-pointer transition-colors",
              activeTab === tab.path ? "bg-background" : "bg-card hover:bg-secondary/30",
            )}
            onClick={() => onTabChange(tab.path)}
          >
            <span className="font-mono text-xs truncate max-w-32">
              {tab.name}
              {tab.isDirty && <span className="text-primary ml-1">*</span>}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.path)
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-secondary rounded p-0.5 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Editor toolbar */}
      <div className="h-8 bg-card/50 border-b border-border flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {activeTabData?.name}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Editor content - Monaco for code, DataFileViewer for data files */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTabData && (
          DATA_EXTENSIONS.includes(getFileExtension(activeTabData.path).toLowerCase()) ? (
            <DataFileViewer
              content={activeTabData.content}
              extension={getFileExtension(activeTabData.path)}
            />
          ) : (
            <MonacoCodeEditor
              value={activeTabData.content}
              onChange={handleEditorChange}
              language={getFileExtension(activeTabData.path)}
            />
          )
        )}
      </div>
    </div>
  )
}

export default CodeEditor
