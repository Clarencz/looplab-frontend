"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface Skill {
  name: string
  level: number
  proficiency: "Beginner" | "Learning" | "Comfortable" | "Fluent" | "Advanced"
}

interface PublicSkillsGraphProps {
  skills: Skill[]
}

export function PublicSkillsGraph({ skills }: PublicSkillsGraphProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  const centerX = 150
  const centerY = 150
  const maxRadius = 110
  const levels = 5

  const angleStep = (2 * Math.PI) / skills.length

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  }

  const skillPath =
    skills
      .map((skill, i) => {
        const point = getPoint(i, skill.level)
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
      })
      .join(" ") + " Z"

  const gridCircles = Array.from({ length: levels }, (_, i) => ((i + 1) / levels) * maxRadius)

  const proficiencyColors: Record<string, { text: string; bg: string }> = {
    Beginner: { text: "text-red-400", bg: "bg-red-400" },
    Learning: { text: "text-orange-400", bg: "bg-orange-400" },
    Comfortable: { text: "text-yellow-400", bg: "bg-yellow-400" },
    Fluent: { text: "text-green-400", bg: "bg-green-400" },
    Advanced: { text: "text-primary", bg: "bg-primary" },
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Skill Proficiency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <TooltipProvider>
            <svg viewBox="0 0 300 300" className="w-full max-w-[320px]">
              {/* Gradient and filter definitions */}
              <defs>
                <radialGradient id="publicSkillGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
                <filter id="publicNeonGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background glow */}
              <circle cx={centerX} cy={centerY} r={maxRadius} fill="url(#publicSkillGlow)" />

              {/* Grid circles */}
              {gridCircles.map((radius, i) => (
                <circle
                  key={i}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity={0.4}
                />
              ))}

              {/* Axis lines */}
              {skills.map((_, i) => {
                const point = getPoint(i, 100)
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={point.x}
                    y2={point.y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    opacity={0.3}
                  />
                )
              })}

              {/* Skill polygon */}
              <path
                d={skillPath}
                fill="hsl(var(--primary) / 0.15)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                filter="url(#publicNeonGlow)"
                className="transition-all duration-300"
              />

              {/* Skill points */}
              {skills.map((skill, i) => {
                const point = getPoint(i, skill.level)
                return (
                  <Tooltip key={skill.name}>
                    <TooltipTrigger asChild>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={hoveredSkill?.name === skill.name ? 7 : 5}
                        fill="hsl(var(--primary))"
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        filter="url(#publicNeonGlow)"
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-popover border border-border px-3 py-2">
                      <p className="font-mono text-sm text-foreground">{skill.name}</p>
                      <p className={`text-xs ${proficiencyColors[skill.proficiency].text}`}>{skill.proficiency}</p>
                      <p className="text-xs text-muted-foreground">{skill.level}% mastery</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}

              {/* Skill labels */}
              {skills.map((skill, i) => {
                const labelPoint = getPoint(i, 125)
                return (
                  <text
                    key={skill.name}
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[10px] font-mono"
                  >
                    {skill.name}
                  </text>
                )
              })}
            </svg>
          </TooltipProvider>
        </div>

        {/* Proficiency Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
          {Object.entries(proficiencyColors).map(([level, colors]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
              <span className="text-xs text-muted-foreground">{level}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
