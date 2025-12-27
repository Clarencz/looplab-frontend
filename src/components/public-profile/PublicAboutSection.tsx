"use client"

import type React from "react"

import { Globe, Code2, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiRust,
  SiPostgresql,
  SiTailwindcss,
  SiJavascript,
} from "react-icons/si"

interface PublicAboutSectionProps {
  user: {
    bio: string
    country: string
    languages: string[]
    yearsOfExperience: number
    preferredStack: string[]
  }
}

const techIcons: Record<string, React.ReactNode> = {
  react: <SiReact className="w-4 h-4" />,
  typescript: <SiTypescript className="w-4 h-4" />,
  "node.js": <SiNodedotjs className="w-4 h-4" />,
  python: <SiPython className="w-4 h-4" />,
  rust: <SiRust className="w-4 h-4" />,
  postgresql: <SiPostgresql className="w-4 h-4" />,
  "tailwind css": <SiTailwindcss className="w-4 h-4" />,
  javascript: <SiJavascript className="w-4 h-4" />,
}

export function PublicAboutSection({ user }: PublicAboutSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-lg">
          <Code2 className="w-5 h-5 text-primary" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        <p className="text-muted-foreground leading-relaxed">{user.bio}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Country */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{user.country}</p>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <span className="text-xl">🗣️</span>
            <div>
              <p className="text-xs text-muted-foreground">Languages</p>
              <p className="text-sm font-medium text-foreground">{user.languages.join(", ")}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Briefcase className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Experience</p>
              <p className="text-sm font-medium text-foreground">{user.yearsOfExperience} years</p>
            </div>
          </div>
        </div>

        {/* Preferred Tech Stack */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Preferred Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {user.preferredStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {techIcons[tech.toLowerCase()]}
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
