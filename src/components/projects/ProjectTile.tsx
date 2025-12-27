"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, MoreVertical, Play, Bookmark, Eye, Trophy, GitBranch, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"

// Language/framework icons mapping
const languageIcons: Record<string, string> = {
  React: "⚛️",
  "Node.js": "🟢",
  Express: "🚂",
  TypeScript: "📘",
  JavaScript: "📒",
  Python: "🐍",
  MongoDB: "🍃",
  PostgreSQL: "🐘",
  HTML: "🌐",
  CSS: "🎨",
  "Tailwind CSS": "💨",
  "Socket.io": "🔌",
  Recharts: "📊",
}

export interface Project {
  id: number
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  tech: string[]
  image: string
  estimatedTime: string
  brokenAspects: string[]
  targetSkill: string
  filesPresent: number
  filesTotal: number
  status: "not-started" | "active" | "completed"
  learningOutcome: string
  hasGitHubStarter: boolean
  includesBackend: boolean
}

interface ProjectTileProps {
  project: Project
  index?: number
}

const ProjectTile = ({ project, index = 0 }: ProjectTileProps) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const difficultyColors = {
    Beginner: "bg-primary/10 text-primary border-primary/30",
    Intermediate: "bg-accent/10 text-accent border-accent/30",
    Advanced: "bg-destructive/10 text-destructive border-destructive/30",
  }

  const statusStyles = {
    "not-started": "",
    active: "ring-2 ring-primary/50 shadow-lg shadow-primary/10",
    completed: "",
  }

  const techArray = project.tech || []
  const primaryTech = techArray[0] || 'Code'
  const primaryIcon = languageIcons[primaryTech] || "💻"

  const handleTileClick = () => {
    navigate(`/projects/${project.id}`)
  }

  const handleStartProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/projects/${project.id}?start=true`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completed ribbon */}
      {project.status === "completed" && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
      )}

      <div
        onClick={handleTileClick}
        className={`
          cursor-pointer rounded-xl overflow-hidden bg-card border border-border 
          h-full flex flex-col transition-all duration-300
          hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
          ${statusStyles[project.status]}
          ${project.status === "active" ? "translate-y-[-2px]" : ""}
        `}
      >
        {/* Thumbnail */}
        <div className="relative h-36 bg-muted overflow-hidden">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

          {/* Language badge overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-card/90 backdrop-blur-sm rounded-md border border-border">
            <span className="text-sm">{primaryIcon}</span>
            <span className="text-xs font-mono text-foreground">{primaryTech}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {project.name}
          </h3>

          {/* Target skill meta sentence */}
          <p className="text-xs text-muted-foreground mb-3 font-mono">Practice: {project.targetSkill}</p>

          {/* File progress meter */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>
                      {project.filesPresent}/{project.filesTotal} files present
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full transition-all"
                      style={{ width: `${(project.filesPresent / project.filesTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1.5 text-xs">
                  <p>
                    <strong>Learning outcome:</strong> {project.learningOutcome}
                  </p>
                  <p className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    GitHub starter: {project.hasGitHubStarter ? "Available" : "Not available"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Server className="w-3 h-3" />
                    Backend: {project.includesBackend ? "Included" : "Frontend only"}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Badges row */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-xs font-mono border ${difficultyColors[project.difficulty]}`}>
              {project.difficulty}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-secondary text-secondary-foreground">
              <Clock className="w-3 h-3" />
              {project.estimatedTime}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center gap-2">
            <Button size="sm" className="flex-1 glow-button" onClick={handleStartProject}>
              <Play className="w-3 h-3 mr-1" />
              Start Project
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/projects/${project.id}`)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save for later
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectTile
