"use client"

import { useState } from "react"
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  AlertCircle,
  PanelLeftClose,
  PanelLeft,
  Plus,
  FolderPlus,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface WorkspaceFile {
  name: string
  type: "file" | "folder"
  status?: "present" | "missing" | "needs-work"
  children?: WorkspaceFile[]
  content?: string
}

interface FilePanelProps {
  files: WorkspaceFile[]
  selectedFile: string | null
  onFileSelect: (filePath: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  onCreateFile?: (path: string, name: string) => void
  onCreateFolder?: (path: string, name: string) => void
  onDeleteFile?: (path: string) => void
}

const FileIcon = ({ type, isOpen, status }: { type: "file" | "folder"; isOpen?: boolean; status?: string }) => {
  if (type === "folder") {
    return isOpen ? (
      <FolderOpen className="w-4 h-4 text-primary shrink-0" />
    ) : (
      <Folder className="w-4 h-4 text-primary shrink-0" />
    )
  }

  const getFileColor = () => {
    if (status === "missing") return "text-destructive"
    if (status === "needs-work") return "text-yellow-500"
    return "text-muted-foreground"
  }

  return <File className={cn("w-4 h-4 shrink-0", getFileColor())} />
}

const FileTreeItem = ({
  file,
  depth,
  selectedFile,
  onFileSelect,
  path,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
}: {
  file: WorkspaceFile
  depth: number
  selectedFile: string | null
  onFileSelect: (path: string) => void
  path: string
  onCreateFile?: (path: string, name: string) => void
  onCreateFolder?: (path: string, name: string) => void
  onDeleteFile?: (path: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2)
  const [showMenu, setShowMenu] = useState(false)
  const currentPath = path ? `${path}/${file.name}` : file.name
  const isSelected = selectedFile === currentPath

  const handleClick = () => {
    if (file.type === "folder") {
      setIsOpen(!isOpen)
    } else {
      onFileSelect(currentPath)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteFile?.(currentPath)
  }

  return (
    <div
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 text-sm hover:bg-secondary/50 rounded transition-colors group",
          isSelected && "bg-secondary text-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {file.type === "folder" && (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {isOpen ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </span>
        )}
        {file.type === "file" && <span className="w-4" />}

        <FileIcon type={file.type} isOpen={isOpen} status={file.status} />

        <span
          className={cn(
            "truncate text-left font-mono text-xs flex-1",
            file.status === "missing" && "text-destructive",
            file.status === "needs-work" && "text-yellow-500",
          )}
        >
          {file.name}
        </span>

        {file.status === "missing" && <AlertCircle className="w-3 h-3 text-destructive shrink-0" />}
        {file.status === "needs-work" && <AlertCircle className="w-3 h-3 text-yellow-500 shrink-0" />}

        {/* Delete button - visible on hover */}
        {showMenu && onDeleteFile && (
          <button
            onClick={handleDelete}
            className="p-0.5 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete"
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        )}
      </button>

      {file.type === "folder" && isOpen && file.children && (
        <div>
          {file.children.map((child, i) => (
            <FileTreeItem
              key={i}
              file={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              path={currentPath}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const FilePanel = ({
  files,
  selectedFile,
  onFileSelect,
  isCollapsed,
  onToggleCollapse,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
}: FilePanelProps) => {
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  const handleCreateFile = () => {
    if (newItemName.trim()) {
      onCreateFile?.("", newItemName.trim())
      setNewItemName("")
      setShowNewFileDialog(false)
    }
  }

  const handleCreateFolder = () => {
    if (newItemName.trim()) {
      onCreateFolder?.("", newItemName.trim())
      setNewItemName("")
      setShowNewFolderDialog(false)
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-10 bg-card border-r border-border flex flex-col items-center py-2 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleCollapse}>
          <PanelLeft className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="w-56 bg-card border-r border-border flex flex-col shrink-0">
        <div className="h-10 border-b border-border flex items-center justify-between px-2 gap-1">
          <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wide px-1">Files</span>

          <div className="flex items-center gap-0.5">
            {/* New File Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowNewFileDialog(true)}
              title="New File"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>

            {/* New Folder Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowNewFolderDialog(true)}
              title="New Folder"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </Button>

            {/* Collapse Button */}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleCollapse}>
              <PanelLeftClose className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {files.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <File className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-xs text-muted-foreground">No files yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowNewFileDialog(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add File
                </Button>
              </div>
            ) : (
              files.map((file, i) => (
                <FileTreeItem
                  key={i}
                  file={file}
                  depth={0}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                  path=""
                  onCreateFile={onCreateFile}
                  onCreateFolder={onCreateFolder}
                  onDeleteFile={onDeleteFile}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* New File Dialog */}
      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Enter a name for the new file. Include extension (e.g., test_main.py)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="test_solution.py"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile} disabled={!newItemName.trim()}>
              Create File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="tests"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newItemName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FilePanel
