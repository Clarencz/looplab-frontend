"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Play,
  Github,
  Clock,
  GitBranch,
  Server,
  CheckCircle2,
  Send,
  ExternalLink,
  History,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/Navbar"
import FileTreePreview, { type FileNode } from "@/components/projects/FileTreePreview"
import StartFlowOverlay from "@/components/projects/StartFlowOverlay"
import GitHubConnectModal from "@/components/projects/GitHubConnectModal"
import ValidationProgress from "@/components/projects/ValidationProgress"
import { useSmartNavigation } from "@/hooks/useSmartNavigation"

const ProjectDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getBackUrl, getBackLabel, buildNavUrl } = useSmartNavigation()

  const [showStartFlow, setShowStartFlow] = useState(false)
  const [showGitHubModal, setShowGitHubModal] = useState(false)
  const [projectStatus, setProjectStatus] = useState<"not-started" | "in-progress" | "ready-for-validation">(
    "not-started",
  )
  const [isValidating, setIsValidating] = useState(false)
  const [showValidationConfirm, setShowValidationConfirm] = useState(false)
  const [linkedRepo, setLinkedRepo] = useState<string | null>(null)

  // API state
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validation state (will be populated when validation runs)
  const [validationSteps, setValidationSteps] = useState<any[]>([])
  const [validationLogs, setValidationLogs] = useState<string[]>([])

  // Fetch project from API
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("No project ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/v1/projects/${id}`)

        if (!response.ok) {
          throw new Error(`Project not found (${response.status})`)
        }

        const data = await response.json()
        const projectData = data.data || data

        // Map API response to component expected format
        setProject({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          narrative: projectData.narrative,
          difficulty: projectData.difficulty?.charAt(0).toUpperCase() + projectData.difficulty?.slice(1) || "Beginner",
          tech: (projectData.techStack || []).map((t: any) => typeof t === 'string' ? t : t.name),
          image: projectData.coverImage,
          estimatedTime: projectData.estimatedTime,
          targetSkill: projectData.targetSkill,
          category: projectData.category, // Add category for routing logic
          filesPresent: projectData.fileStructure?.filter((f: any) => f.status !== 'missing').length || 0,
          filesTotal: projectData.fileStructure?.length || 0,
          status: "not-started",
          learningOutcome: projectData.learningOutcome,
          hasGitHubStarter: projectData.hasGithubStarter || false,
          includesBackend: projectData.includesBackend || false,
          repoContents: projectData.specification?.repoContents || "",
          whatsMissing: projectData.specification?.whatsMissing || "",
          validationContract: projectData.validationContract?.description || "",
          brokenAspects: projectData.specification?.brokenAspects || [],
          fileStructure: projectData.fileStructure || [],
        })
        setError(null)
      } catch (err) {
        console.error('Failed to fetch project:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  useEffect(() => {
    if (searchParams.get("start") === "true" && project) {
      setShowStartFlow(true)
    }
  }, [searchParams, project])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error || "Project not found"}</p>
        <Button variant="outline" onClick={() => navigate(getBackUrl('/projects'))}>
          {getBackLabel('Back to Projects')}
        </Button>
      </div>
    )
  }

  const handleStartInApp = () => {
    setShowStartFlow(false)

    // Check if this is a data-science category project
    // Route to the revolutionary DS pipeline instead of regular workspace
    const isDataScience = project.category === 'data-science' ||
      project.category === 'data science' ||
      project.category === 'analytics'

    if (isDataScience) {
      // Data science projects use the revolutionary analytical thinking platform
      navigate(buildNavUrl('/ds-pipeline'))
    } else {
      // All other projects use the regular workspace
      navigate(buildNavUrl(`/workspace/${project.id}`))
    }
  }

  const handleGitHubConnect = (repoUrl: string) => {
    setLinkedRepo(repoUrl)
    setShowGitHubModal(false)
    setProjectStatus("in-progress")
  }

  const handleSubmitForValidation = () => {
    setShowValidationConfirm(false)
    setProjectStatus("ready-for-validation")
    setIsValidating(true)
    // Simulate validation completion
    setTimeout(() => setIsValidating(false), 5000)
  }

  const difficultyColors = {
    Beginner: "bg-primary/10 text-primary border-primary/30",
    Intermediate: "bg-accent/10 text-accent border-accent/30",
    Advanced: "bg-destructive/10 text-destructive border-destructive/30",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate(getBackUrl('/projects'))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {getBackLabel('Back to Projects')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono border ${difficultyColors[project.difficulty]}`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">Practice: {project.targetSkill}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Narrative paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-muted-foreground leading-relaxed">{project.narrative}</p>
            </motion.div>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {projectStatus === "not-started" && (
                <>
                  <Button
                    size="lg"
                    className="flex-1 glow-button text-base py-6"
                    onClick={() => setShowStartFlow(true)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start in App
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 text-base py-6 bg-transparent"
                    onClick={() => setShowGitHubModal(true)}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Connect GitHub / Clone
                  </Button>
                </>
              )}
              {projectStatus === "in-progress" && (
                <>
                  <Button
                    size="lg"
                    className="flex-1 glow-button text-base py-6"
                    onClick={() => setShowValidationConfirm(true)}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit for Validation
                  </Button>
                  {linkedRepo && (
                    <Button size="lg" variant="outline" className="flex-1 text-base py-6 bg-transparent">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open in GitHub
                    </Button>
                  )}
                </>
              )}
              {projectStatus === "ready-for-validation" && !isValidating && (
                <Button size="lg" className="flex-1 glow-button text-base py-6" onClick={() => setIsValidating(true)}>
                  <Play className="w-5 h-5 mr-2" />
                  Run Validation
                </Button>
              )}
            </motion.div>

            {/* Linked repo info */}
            {linkedRepo && projectStatus !== "not-started" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-secondary/30 border border-border rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <GitBranch className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Linked repository:</span>
                  <code className="px-2 py-0.5 bg-card rounded text-xs font-mono text-primary">
                    github.com/user/task-manager-api
                  </code>
                </div>
              </motion.div>
            )}

            {/* Validation progress (when validating) */}
            {(projectStatus === "ready-for-validation" || isValidating) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ValidationProgress isRunning={isValidating} steps={validationSteps} logs={validationLogs} />
              </motion.div>
            )}

            {/* Project specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-primary">&gt;</span>
                Project Specification
              </h2>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h3 className="text-foreground font-medium mb-2">Repository Contents</h3>
                  <p>{project.repoContents}</p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">What's Missing or Broken</h3>
                  <p>{project.whatsMissing}</p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">Validation Contract</h3>
                  <p>{project.validationContract}</p>
                </div>
              </div>
            </motion.div>

            {/* File tree preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Accordion type="single" collapsible defaultValue="files" className="w-full">
                <AccordionItem value="files" className="border-border">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="text-primary">&gt;</span>
                      File Structure Preview
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {project.fileStructure && project.fileStructure.length > 0 ? (
                      <FileTreePreview files={project.fileStructure} />
                    ) : (
                      <div className="text-muted-foreground text-sm p-4 text-center">
                        <p>No file structure available yet.</p>
                        <p className="text-xs mt-2">Admin needs to import this project from GitHub to populate the file structure.</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>

          {/* Right rail - auxiliary panels */}
          <div className="space-y-6">
            {/* Project meta */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Time</p>
                  <p className="font-mono">{project.estimatedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">GitHub Starter</p>
                  <p className="font-mono">{project.hasGitHubStarter ? "Available" : "Not available"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Backend</p>
                  <p className="font-mono">{project.includesBackend ? "Included" : "Frontend only"}</p>
                </div>
              </div>

              {/* Tech stack */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Project History panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Project History</span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                {projectStatus === "not-started" ? (
                  <p className="text-muted-foreground">No activity yet. Start the project to begin tracking.</p>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-muted-foreground">Workspace created</p>
                    </div>
                    {linkedRepo && (
                      <div className="flex items-start gap-2">
                        <GitBranch className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-muted-foreground">Repository linked</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Resources panel - Dynamic based on tech stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Resources</span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                {project.tech && project.tech.length > 0 ? (
                  project.tech.slice(0, 3).map((tech: string, idx: number) => (
                    <a
                      key={idx}
                      href={`https://devdocs.io/${tech.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-muted-foreground hover:text-primary transition-colors"
                    >
                      {tech} documentation →
                    </a>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Documentation links will appear based on the project's tech stack.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Start Flow Overlay */}
      <StartFlowOverlay
        isOpen={showStartFlow}
        onClose={() => setShowStartFlow(false)}
        onConfirm={handleStartInApp}
        projectName={project.name}
      />

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        projectName={project.name}
        onConnect={handleGitHubConnect}
      />

      {/* Validation Confirmation Modal */}
      {showValidationConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setShowValidationConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Submit for Validation</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Validation will run in a sandbox environment. Only successful validation triggers a streak update. Make
              sure your code is ready before submitting.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowValidationConfirm(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 glow-button" onClick={handleSubmitForValidation}>
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectDetail
