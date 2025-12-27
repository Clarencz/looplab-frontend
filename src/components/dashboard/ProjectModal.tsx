"use client"

import type React from "react"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiRust,
  SiPostgresql,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
} from "react-icons/si"

interface ProjectModalProps {
  project: {
    id: string
    title: string
    coverImage: string
    techStack: string[]
    summary: string
    progress?: number
    isCompleted?: boolean
  }
}

const techIcons: Record<string, React.ReactNode> = {
  react: <SiReact className="w-4 h-4 text-cyan-400" />,
  typescript: <SiTypescript className="w-4 h-4 text-blue-500" />,
  nodejs: <SiNodedotjs className="w-4 h-4 text-green-500" />,
  python: <SiPython className="w-4 h-4 text-yellow-400" />,
  rust: <SiRust className="w-4 h-4 text-orange-500" />,
  postgresql: <SiPostgresql className="w-4 h-4 text-blue-400" />,
  tailwind: <SiTailwindcss className="w-4 h-4 text-cyan-400" />,
  javascript: <SiJavascript className="w-4 h-4 text-yellow-400" />,
  html: <SiHtml5 className="w-4 h-4 text-orange-500" />,
  css: <SiCss3 className="w-4 h-4 text-blue-500" />,
}

export function ProjectModal({ project }: ProjectModalProps) {
  const navigate = useNavigate()

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30">
      {/* Cover Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={project.coverImage || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Completed Badge */}
        {project.isCompleted && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-medium text-primary">
            Completed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-mono font-semibold text-foreground text-lg mb-2">{project.title}</h3>

        {/* Tech Stack Icons */}
        <div className="flex items-center gap-2 mb-3">
          {project.techStack.slice(0, 5).map((tech) => (
            <div key={tech} className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center" title={tech}>
              {techIcons[tech.toLowerCase()] || (
                <span className="text-xs text-muted-foreground">{tech.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.summary}</p>

        {/* Progress Bar (if ongoing) */}
        {project.progress !== undefined && !project.isCompleted && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-mono">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1.5" />
          </div>
        )}

        {/* View Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          View Project
        </Button>
      </div>
    </div>
  )
}
