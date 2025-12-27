"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, File, Folder, AlertCircle, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FileNode {
  name: string
  type: "file" | "folder"
  status: "present" | "missing" | "broken"
  intent?: string
  children?: FileNode[]
}

interface FileTreePreviewProps {
  files: FileNode[]
  onFileSelect?: (file: FileNode) => void
}

const FileTreePreview = ({ files, onFileSelect }: FileTreePreviewProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]))
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleFileClick = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const getStatusIcon = (status: FileNode["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="w-3 h-3 text-primary" />
      case "missing":
        return <AlertCircle className="w-3 h-3 text-destructive" />
      case "broken":
        return <AlertCircle className="w-3 h-3 text-amber-500" />
    }
  }

  const renderNode = (node: FileNode, path = "", depth = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedFolders.has(fullPath)

    return (
      <div key={fullPath}>
        <button
          onClick={() => (node.type === "folder" ? toggleFolder(fullPath) : handleFileClick(node))}
          className={`
            w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-md
            hover:bg-secondary/50 transition-colors
            ${selectedFile?.name === node.name ? "bg-secondary" : ""}
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <Folder className="w-4 h-4 text-primary" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="w-4 h-4 text-muted-foreground" />
            </>
          )}
          <span
            className={`flex-1 font-mono text-xs ${node.status === "missing" ? "text-muted-foreground line-through" : ""}`}
          >
            {node.name}
          </span>
          {node.type === "file" && getStatusIcon(node.status)}
        </button>

        {node.type === "folder" && isExpanded && node.children && (
          <div>{node.children.map((child) => renderNode(child, fullPath, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* File tree */}
      <div className="p-2 max-h-64 overflow-y-auto">{files.map((node) => renderNode(node))}</div>

      {/* File preview pane */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-secondary/30"
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs">{selectedFile.name}</span>
                  {getStatusIcon(selectedFile.status)}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedFile(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              {selectedFile.intent && <p className="text-xs text-muted-foreground">{selectedFile.intent}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileTreePreview
