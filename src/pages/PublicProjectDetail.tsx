"use client"

import type React from "react"

import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicProfileFooter } from "@/components/public-profile/PublicProfileFooter"
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiRedis,
  SiSocketdotio,
  SiExpress,
  SiRust,
} from "react-icons/si"

// Mock project detail data
const mockProjectData = {
  "ecommerce-api": {
    id: "1",
    slug: "ecommerce-api",
    title: "E-commerce REST API",
    coverImage: "/api-code-terminal-dark.jpg",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis"],
    description:
      "A complete RESTful API powering an e-commerce platform with user authentication, product management, shopping cart functionality, and Stripe payment integration. Built with scalability and security in mind.",
    issuesFixed: [
      "Fixed N+1 query problem in product listings",
      "Implemented rate limiting to prevent abuse",
      "Added Redis caching layer for frequently accessed data",
      "Resolved race condition in cart updates",
      "Optimized database indexes for search queries",
    ],
    completedAt: "December 2024",
    owner: {
      username: "alexcoder",
      fullName: "Alex Johnson",
      avatar: "/developer-avatar-portrait.jpg",
    },
  },
}

const techIcons: Record<string, React.ReactNode> = {
  "node.js": <SiNodedotjs className="w-5 h-5 text-green-500" />,
  express: <SiExpress className="w-5 h-5 text-foreground" />,
  postgresql: <SiPostgresql className="w-5 h-5 text-blue-400" />,
  redis: <SiRedis className="w-5 h-5 text-red-500" />,
  react: <SiReact className="w-5 h-5 text-cyan-400" />,
  typescript: <SiTypescript className="w-5 h-5 text-blue-500" />,
  "socket.io": <SiSocketdotio className="w-5 h-5 text-foreground" />,
  rust: <SiRust className="w-5 h-5 text-orange-500" />,
}

export default function PublicProjectDetail() {
  const { username, slug } = useParams<{ username: string; slug: string }>()

  // In production, fetch based on username and slug
  const project = mockProjectData["ecommerce-api"]

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <Link to={`/u/${username}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to @{username}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <img
              src={project.coverImage || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Title & Meta */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1.5 px-3 py-1.5 bg-primary/10 text-primary">
                  {techIcons[tech.toLowerCase()]}
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground">Completed {project.completedAt}</p>
          </div>

          {/* Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-mono text-lg">About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          {/* Issues Fixed */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-mono text-lg">Issues Fixed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {project.issuesFixed.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Owner Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <img
                  src={project.owner.avatar || "/placeholder.svg"}
                  alt={project.owner.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{project.owner.fullName}</p>
                  <p className="text-sm text-muted-foreground">@{project.owner.username}</p>
                </div>
                <Link to={`/u/${project.owner.username}`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    View Profile
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <PublicProfileFooter />
    </div>
  )
}
