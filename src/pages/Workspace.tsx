"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/client"
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader"
import FilePanel, { type WorkspaceFile } from "@/components/workspace/FilePanel"
import CodeEditor from "@/components/workspace/CodeEditor"
import RightPanel from "@/components/workspace/RightPanel"
import SubmitModal from "@/components/workspace/SubmitModal"
import ValidationProgressModal from "@/components/workspace/ValidationProgressModal"
import CodeTutorModal from "@/components/workspace/CodeTutorModal"
// Category-based routing
import { CategoryRouter, ValidationRouter } from "@/categories/shared/components"
import type { Category } from "@/lib/api/types"

interface EditorTab {
  path: string
  name: string
  content: string
  isDirty: boolean
}

interface TerminalLine {
  type: "info" | "success" | "error" | "warning" | "input" | "output"
  content: string
}

// Helper to get file content from tree
const getFileContent = (files: WorkspaceFile[], path: string): string | null => {
  const parts = path.split("/")
  let current: WorkspaceFile[] | undefined = files

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const found: WorkspaceFile | undefined = current?.find((f: WorkspaceFile) => f.name === part)

    if (!found) return null

    if (i === parts.length - 1) {
      return found.content || ""
    }

    current = found.children
  }

  return null
}

const Workspace = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Project and user-project state
  const [project, setProject] = useState<{ id: string; name: string; hasPreview: boolean; categoryId?: string } | null>(null)
  const [userProject, setUserProject] = useState<any>(null)
  const [category, setCategory] = useState<Category | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [filePanelCollapsed, setFilePanelCollapsed] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [status, setStatus] = useState<"saved" | "unsaved" | "running">("saved")
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<TerminalLine[]>([])
  const [browserExpanded, setBrowserExpanded] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>()
  const [hasRun, setHasRun] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showTutorModal, setShowTutorModal] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false)
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([])
  const [cancelExecution, setCancelExecution] = useState<(() => void) | null>(null)

  // Load workspace from backend API on mount
  useEffect(() => {
    const loadWorkspace = async () => {
      if (!id) {
        navigate('/projects')
        return
      }

      try {
        // First, fetch the project details
        const projectResponse = await fetch(`/api/v1/projects/${id}`)
        if (!projectResponse.ok) {
          throw new Error('Project not found')
        }
        const projectData = (await projectResponse.json()).data

        setProject({
          id: projectData.id,
          name: projectData.name,
          hasPreview: projectData.includesBackend || false,
          categoryId: projectData.categoryId,
        })

        // Fetch category data to determine learning mode
        if (projectData.categoryId) {
          try {
            const categoryResponse = await fetch(`/api/v1/categories/${projectData.categoryId}`)
            if (categoryResponse.ok) {
              const categoryData = (await categoryResponse.json()).data
              setCategory(categoryData)
            }
          } catch (error) {
            console.error('Failed to fetch category:', error)
            // Continue without category - will default to IDE mode
          }
        }

        // Convert project fileStructure to WorkspaceFile format
        const convertFileStructure = (files: any[]): WorkspaceFile[] => {
          return files.map((file: any) => ({
            name: file.name,
            type: file.type === 'folder' ? 'folder' : 'file',
            status: file.status || 'present',
            content: file.content || '',
            children: file.children ? convertFileStructure(file.children) : undefined,
          }))
        }

        // Use project's file structure if available
        if (projectData.fileStructure && projectData.fileStructure.length > 0) {
          setWorkspaceFiles(convertFileStructure(projectData.fileStructure))
        }

        // Now try to load/create user-project workspace
        try {
          // Try to get existing user-project using API client
          const response = await apiClient.post('/user-projects', {
            projectSlug: projectData.slug
          })

          if (response.data) {
            setUserProject(response.data)

            // If user has saved workspace state, load it
            if (response.data.workspace && response.data.workspace.files && response.data.workspace.files.length > 0) {
              setWorkspaceFiles(response.data.workspace.files)
              setOpenTabs(response.data.workspace.openTabs || [])
              setActiveTab(response.data.workspace.activeTabPath || null)
              toast.success("Workspace loaded from server")
            } else {
              toast.info("Starting new workspace")
            }
          }
        } catch (error) {
          console.error('Failed to create/load user project:', error)
          // Continue with default workspace from project
        }

        // Fallback to localStorage
        const storageKey = `workspace-${id}`
        const savedWorkspace = localStorage.getItem(storageKey)
        if (savedWorkspace && workspaceFiles.length === 0) {
          const parsed = JSON.parse(savedWorkspace)
          if (parsed.files && parsed.files.length > 0) {
            setWorkspaceFiles(parsed.files)
            setOpenTabs(parsed.openTabs || [])
            setActiveTab(parsed.activeTab || null)
            toast.info("Workspace loaded from local cache")
          }
        }
      } catch (error) {
        console.error("Failed to load workspace:", error)
        toast.error("Failed to load project")
        navigate('/projects')
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkspace()
  }, [id, navigate])

  // Save workspace to backend API whenever files or tabs change
  useEffect(() => {
    if (!isLoading) {
      const saveWorkspace = async () => {
        try {
          const workspaceState = {
            files: workspaceFiles,
            openTabs,
            activeTabPath: activeTab,
            terminalLogs: logs,
            lastSavedAt: new Date().toISOString(),
          }

          // Save to backend API using API client
          await apiClient.put(`/user-projects/${id}/workspace`, workspaceState)
          setStatus("saved")

          // Also save to localStorage as backup
          const storageKey = `workspace-${id}`
          localStorage.setItem(storageKey, JSON.stringify({
            files: workspaceFiles,
            openTabs,
            activeTab,
            lastSaved: new Date().toISOString(),
          }))
        } catch (error) {
          console.error("Failed to save workspace:", error)
          // Fallback to localStorage
          const storageKey = `workspace-${id}`
          localStorage.setItem(storageKey, JSON.stringify({
            files: workspaceFiles,
            openTabs,
            activeTab,
            lastSaved: new Date().toISOString(),
          }))
          setStatus("saved")
        }
      }

      // Debounce saves to avoid too many API calls
      const timeoutId = setTimeout(saveWorkspace, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [workspaceFiles, openTabs, activeTab, id, isLoading, logs])

  useEffect(() => {
    // Only redirect if we're done loading and project failed to load
    if (!isLoading && !project) {
      navigate("/projects")
    }
  }, [project, navigate, isLoading])

  const handleFileSelect = (path: string) => {
    setSelectedFile(path)

    // Check if tab already exists
    const existingTab = openTabs.find((t) => t.path === path)
    if (existingTab) {
      setActiveTab(path)
      return
    }

    // Get file content and add new tab
    const content = getFileContent(workspaceFiles, path)
    if (content !== null) {
      const fileName = path.split("/").pop() || path
      const newTab: EditorTab = {
        path,
        name: fileName,
        content,
        isDirty: false,
      }
      setOpenTabs((prev) => [...prev, newTab])
      setActiveTab(path)
    }
  }

  const handleTabClose = (path: string) => {
    setOpenTabs((prev) => prev.filter((t) => t.path !== path))
    if (activeTab === path) {
      const remaining = openTabs.filter((t) => t.path !== path)
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].path : null)
    }
    if (selectedFile === path) {
      setSelectedFile(null)
    }
  }

  const handleContentChange = (path: string, content: string) => {
    // Reset submission flag when user makes changes
    if (hasSubmittedOnce) {
      setHasSubmittedOnce(false)
    }

    // Update tab content
    setOpenTabs((prev) => prev.map((t) => (t.path === path ? { ...t, content, isDirty: true } : t)))

    // Update file content in workspace files
    const updateFileContent = (files: WorkspaceFile[], targetPath: string, newContent: string): WorkspaceFile[] => {
      return files.map((file) => {
        if (file.type === "folder" && file.children) {
          return { ...file, children: updateFileContent(file.children, targetPath, newContent) }
        }
        if (file.type === "file" && targetPath.endsWith(file.name)) {
          return { ...file, content: newContent }
        }
        return file
      })
    }

    setWorkspaceFiles((prev) => updateFileContent(prev, path, content))
    setStatus("unsaved")
  }

  // File management handlers
  const handleCreateFile = (path: string, name: string) => {
    const newFile: WorkspaceFile = {
      name,
      type: "file",
      status: "present",
      content: getDefaultContent(name),
    }

    if (!path) {
      // Add to root
      setWorkspaceFiles((prev) => [...prev, newFile])
    } else {
      // Add to folder
      setWorkspaceFiles((prev) => addToFolder(prev, path, newFile))
    }

    // Open the new file
    const newPath = path ? `${path}/${name}` : name
    const newTab: EditorTab = {
      path: newPath,
      name,
      content: newFile.content || "",
      isDirty: false,
    }
    setOpenTabs((prev) => [...prev, newTab])
    setActiveTab(newPath)
    setSelectedFile(newPath)
    toast.success(`Created ${name}`)
  }

  const handleCreateFolder = (path: string, name: string) => {
    const newFolder: WorkspaceFile = {
      name,
      type: "folder",
      status: "present",
      children: [],
    }

    if (!path) {
      setWorkspaceFiles((prev) => [...prev, newFolder])
    } else {
      setWorkspaceFiles((prev) => addToFolder(prev, path, newFolder))
    }
    toast.success(`Created folder ${name}`)
  }

  const handleDeleteFile = (path: string) => {
    const fileName = path.split("/").pop() || path

    // Close tab if open
    setOpenTabs((prev) => prev.filter((t) => t.path !== path))
    if (activeTab === path) {
      const remaining = openTabs.filter((t) => t.path !== path)
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].path : null)
    }
    if (selectedFile === path) {
      setSelectedFile(null)
    }

    // Remove from file tree
    setWorkspaceFiles((prev) => removeFromTree(prev, path))
    toast.success(`Deleted ${fileName}`)
  }

  // Helper to get default content based on file extension
  const getDefaultContent = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "py":
        if (name.startsWith("test_")) {
          return `import pytest

def test_example():
    """Example test function"""
    assert 1 + 1 == 2

def test_another():
    """Another test"""
    result = True
    assert result is True
`
        }
        return `# ${name}\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()\n`
      case "js":
      case "ts":
        if (name.includes(".test.")) {
          return `describe('Example', () => {\n  it('should pass', () => {\n    expect(1 + 1).toBe(2);\n  });\n});\n`
        }
        return `// ${name}\n\nfunction main() {\n  console.log("Hello");\n}\n\nmain();\n`
      case "json":
        return `{\n  \n}\n`
      default:
        return `# ${name}\n`
    }
  }

  // Helper to add file to folder
  const addToFolder = (files: WorkspaceFile[], targetPath: string, newItem: WorkspaceFile): WorkspaceFile[] => {
    return files.map((file) => {
      if (file.type === "folder") {
        const currentPath = file.name
        if (targetPath === currentPath || targetPath.startsWith(currentPath + "/")) {
          if (targetPath === currentPath) {
            return { ...file, children: [...(file.children || []), newItem] }
          }
          return { ...file, children: addToFolder(file.children || [], targetPath, newItem) }
        }
      }
      return file
    })
  }

  // Helper to remove file from tree
  const removeFromTree = (files: WorkspaceFile[], targetPath: string): WorkspaceFile[] => {
    return files
      .filter((file) => {
        const currentPath = file.name
        return currentPath !== targetPath && !targetPath.startsWith(currentPath + "/")
      })
      .map((file) => {
        if (file.type === "folder" && file.children) {
          return { ...file, children: removeFromTree(file.children, targetPath) }
        }
        return file
      })
  }

  const handleRun = async () => {
    if (!id) return

    setIsRunning(true)
    setStatus("running")
    setLogs([])

    try {
      // Import execution API and detection utilities
      const { executeCode } = await import("@/lib/api/execution")
      const { detectLanguage, detectEntryPoint } = await import("@/lib/utils/project-detection")

      // Auto-detect language and entry point
      const language = detectLanguage(workspaceFiles)
      const detectedEntryPoint = detectEntryPoint(workspaceFiles, language)

      if (!detectedEntryPoint) {
        toast.error("Could not detect entry point. Please ensure your project has a main file (e.g., index.js, main.py)")
        setIsRunning(false)
        setStatus("saved")
        return
      }

      setLogs([{
        type: "info",
        content: `Detected ${language} project with entry point: ${detectedEntryPoint}`,
      }])

      // Execute code with real-time log streaming
      const cancel = await executeCode(
        id,
        workspaceFiles,
        detectedEntryPoint,
        language,
        // onLog callback
        (log) => {
          const terminalLine: TerminalLine = {
            type: log.level === "error" ? "error" : log.level === "info" ? "info" : "output",
            content: log.message,
          }
          setLogs((prev) => [...prev, terminalLine])
        },
        // onComplete callback
        () => {
          setIsRunning(false)
          setStatus("saved")
          setHasRun(true)
          setCancelExecution(null)

          if (project?.hasPreview) {
            setPreviewContent(`
              <!DOCTYPE html>
              <html>
                <head><title>Preview</title></head>
                <body style="font-family: system-ui; padding: 20px; background: #0a0a0a; color: #fff;">
                  <h1>Execution Complete</h1>
                  <p>Check the terminal for output</p>
                </body>
              </html>
            `)
          }
        },
        // onError callback
        (error) => {
          setIsRunning(false)
          setStatus("saved")
          setCancelExecution(null)
          setLogs((prev) => [
            ...prev,
            {
              type: "error",
              content: `Execution failed: ${error.message}`,
            },
          ])
          toast.error("Execution failed")
        }
      )

      // Store cancel function for Stop button
      setCancelExecution(() => cancel)
    } catch (error) {
      setIsRunning(false)
      setStatus("saved")
      setCancelExecution(null)
      setLogs([
        {
          type: "error",
          content: `Failed to start execution: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ])
      toast.error("Failed to start execution")
    }
  }

  const handleStop = () => {
    if (cancelExecution) {
      cancelExecution()
      setCancelExecution(null)
      setIsRunning(false)
      setStatus("saved")
      setLogs((prev) => [
        ...prev,
        {
          type: "warning",
          content: "Execution stopped by user",
        },
      ])
      toast.info("Execution stopped")
    }
  }

  const handleSubmit = () => {
    setShowSubmitModal(true)
  }

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false)
    setIsSubmitting(true)
    setHasSubmittedOnce(true) // Mark that user has submitted
    // Show the streaming progress modal
    setShowProgressModal(true)
  }

  const handleProgressModalClose = () => {
    setShowProgressModal(false)
    setIsSubmitting(false) // Reset submitting state when modal closes
  }

  const handleValidationComplete = (result: any) => {
    setShowProgressModal(false)
    setValidationResult(result)
    setShowResultModal(true)
    setIsSubmitting(false)

    if (result.overallStatus === "passed") {
      toast.success("Project validated successfully!", {
        description: `Score: ${result.score}/100`,
      })
    } else {
      toast.warning("Validation needs improvement", {
        description: `Score: ${result.score}/100`,
      })
    }
  }

  const handleResultModalClose = () => {
    setShowResultModal(false)
    setIsSubmitting(false) // Reset submitting state when result modal closes
    // Keep hasSubmittedOnce true so submit button stays disabled until they edit
  }


  if (!project) return null

  const filesChanged = openTabs.filter((t) => t.isDirty).length || 3

  // Category-based workspace routing
  // Programming category uses the default IDE workspace with Monaco editor
  // Other categories use CategoryRouter for specialized workspaces
  if (category && id && category.slug !== 'programming') {
    return <CategoryRouter projectId={id} project={project} category={category} />
  }

  // Otherwise, render the default IDE workspace
  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background flex items-center justify-center z-50"
        >
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-sm text-muted-foreground">Loading workspace...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-screen flex flex-col bg-background overflow-hidden"
        >
          <WorkspaceHeader
            projectName={project.name}
            status={status}
            onRun={handleRun}
            onStop={handleStop}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            hasRun={hasRun}
            isSubmitDisabled={hasSubmittedOnce && openTabs.filter(t => t.isDirty).length === 0}
          />

          <div className="flex-1 flex min-h-0 overflow-hidden h-full">
            <FilePanel
              files={workspaceFiles}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              isCollapsed={filePanelCollapsed}
              onToggleCollapse={() => setFilePanelCollapsed(!filePanelCollapsed)}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteFile={handleDeleteFile}
            />

            <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0 overflow-hidden h-full">
              <ResizablePanel
                defaultSize={browserExpanded ? 50 : 65}
                minSize={30}
                className="min-h-0 h-full overflow-hidden"
              >
                <CodeEditor
                  tabs={openTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onTabClose={handleTabClose}
                  onContentChange={handleContentChange}
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-border w-1 hover:bg-primary/50 transition-colors" />

              <ResizablePanel
                defaultSize={browserExpanded ? 50 : 35}
                minSize={20}
                className="min-h-0 h-full overflow-hidden"
              >
                <RightPanel
                  logs={logs}
                  isRunning={isRunning}
                  previewUrl="http://localhost:3000"
                  previewContent={previewContent}
                  hasPreview={project.hasPreview}
                  isExpanded={browserExpanded}
                  onToggleExpand={() => setBrowserExpanded(!browserExpanded)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <SubmitModal
            isOpen={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            onSubmit={handleConfirmSubmit}
            projectName={project.name}
            filesChanged={filesChanged}
            lastUpdated={new Date().toLocaleString()}
            hasRun={hasRun}
            workspaceFiles={workspaceFiles}
          />

          <ValidationProgressModal
            isOpen={showProgressModal}
            onClose={handleProgressModalClose}
            onComplete={handleValidationComplete}
            userProjectId={userProject?.id || id || ''}
            projectName={project.name}
          />

          <ValidationRouter
            isOpen={showResultModal}
            result={validationResult}
            category={category}
            projectName={project.name}
            onClose={handleResultModalClose}
            onOpenTutor={() => {
              setShowResultModal(false)
              setIsSubmitting(false)
              setShowTutorModal(true)
            }}
          />

          <CodeTutorModal
            isOpen={showTutorModal}
            onClose={() => setShowTutorModal(false)}
            userProjectId={userProject?.id || id || ''}
            validationResult={validationResult}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Workspace
