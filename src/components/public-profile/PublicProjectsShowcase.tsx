"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiRust,
  SiPostgresql,
  SiTailwindcss,
  SiJavascript,
  SiRedis,
  SiSocketdotio,
  SiExpress,
} from "react-icons/si"

interface Project {
  id: string
  slug: string
  title: string
  coverImage: string
  techStack: string[]
  description: string
  issuesFixed: string[]
}

interface PublicProjectsShowcaseProps {
  projects: Project[]
  username: string
}

const techIcons: Record<string, React.ReactNode> = {
  react: <SiReact className="w-3.5 h-3.5 text-cyan-400" />,
  typescript: <SiTypescript className="w-3.5 h-3.5 text-blue-500" />,
  "node.js": <SiNodedotjs className="w-3.5 h-3.5 text-green-500" />,
  python: <SiPython className="w-3.5 h-3.5 text-yellow-400" />,
  rust: <SiRust className="w-3.5 h-3.5 text-orange-500" />,
  postgresql: <SiPostgresql className="w-3.5 h-3.5 text-blue-400" />,
  "tailwind css": <SiTailwindcss className="w-3.5 h-3.5 text-cyan-400" />,
  javascript: <SiJavascript className="w-3.5 h-3.5 text-yellow-400" />,
  redis: <SiRedis className="w-3.5 h-3.5 text-red-500" />,
  "socket.io": <SiSocketdotio className="w-3.5 h-3.5 text-foreground" />,
  express: <SiExpress className="w-3.5 h-3.5 text-foreground" />,
  clap: <span className="text-xs">🦀</span>,
  reqwest: <span className="text-xs">🌐</span>,
  "github api": <span className="text-xs">🔗</span>,
}

function ProjectCard({ project, username }: { project: Project; username: string }) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30">
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={project.coverImage || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-mono font-semibold text-foreground text-lg mb-2">{project.title}</h3>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="gap-1 text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground"
            >
              {techIcons[tech.toLowerCase()]}
              {tech}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

        {/* Issues Fixed */}
        <div className="space-y-1.5 mb-4">
          {project.issuesFixed.slice(0, 2).map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{issue}</span>
            </div>
          ))}
          {project.issuesFixed.length > 2 && (
            <p className="text-xs text-muted-foreground/60 pl-5">+{project.issuesFixed.length - 2} more fixes</p>
          )}
        </div>

        {/* View Project Link */}
        <Link to={`/u/${username}/project/${project.slug}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
          >
            View Project
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function PublicProjectsShowcase({ projects, username }: PublicProjectsShowcaseProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-xl font-semibold text-foreground">Projects Showcase</h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {projects.length} Public
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} username={username} />
        ))}
      </div>
    </section>
  )
}
