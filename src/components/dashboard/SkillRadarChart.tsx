"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Skill {
  name: string
  level: number // 0-100
  proficiency: "Beginner" | "Learning" | "Comfortable" | "Fluent" | "Advanced"
}

interface SkillRadarChartProps {
  skills: Skill[]
}

export function SkillRadarChart({ skills }: SkillRadarChartProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  const centerX = 150
  const centerY = 150
  const maxRadius = 120
  const levels = 5

  // Calculate points for each skill
  const angleStep = (2 * Math.PI) / skills.length

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  }

  // Create polygon path for skill values
  const skillPath =
    skills
      .map((skill, i) => {
        const point = getPoint(i, skill.level)
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
      })
      .join(" ") + " Z"

  // Create grid circles
  const gridCircles = Array.from({ length: levels }, (_, i) => {
    const radius = ((i + 1) / levels) * maxRadius
    return radius
  })

  const proficiencyColors: Record<string, string> = {
    Beginner: "text-red-400",
    Learning: "text-orange-400",
    Comfortable: "text-yellow-400",
    Fluent: "text-green-400",
    Advanced: "text-primary",
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-border">
      <h3 className="font-mono font-semibold text-foreground text-lg mb-4">Skill Proficiency Web</h3>

      <div className="relative flex justify-center">
        <TooltipProvider>
          <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
            {/* Radial gradient for glow effect */}
            <defs>
              <radialGradient id="skillGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
              <filter id="neonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background glow */}
            <circle cx={centerX} cy={centerY} r={maxRadius} fill="url(#skillGlow)" />

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
                opacity={0.5}
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
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              filter="url(#neonGlow)"
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
                      r={hoveredSkill?.name === skill.name ? 8 : 6}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      filter="url(#neonGlow)"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover border border-border px-3 py-2">
                    <p className="font-mono text-sm text-foreground">{skill.name}</p>
                    <p className={`text-xs ${proficiencyColors[skill.proficiency]}`}>{skill.proficiency}</p>
                    <p className="text-xs text-muted-foreground">{skill.level}% mastery</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {/* Skill labels */}
            {skills.map((skill, i) => {
              const labelPoint = getPoint(i, 115)
              return (
                <text
                  key={skill.name}
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-xs font-mono"
                >
                  {skill.name}
                </text>
              )
            })}
          </svg>
        </TooltipProvider>
      </div>

      {/* Proficiency Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-border">
        {Object.entries(proficiencyColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color.replace("text-", "bg-")}`} />
            <span className="text-xs text-muted-foreground">{level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
