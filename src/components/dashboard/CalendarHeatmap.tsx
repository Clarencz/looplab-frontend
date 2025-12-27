"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectDay {
  date: string
  projects: Array<{
    name: string
    difficulty: "beginner" | "intermediate" | "advanced"
  }>
}

// Sample data for 5 weeks
const generateSampleData = (): ProjectDay[] => {
  const data: ProjectDay[] = []
  const today = new Date()

  for (let i = 34; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    // Randomly assign projects
    const projectCount = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0
    const difficulties: Array<"beginner" | "intermediate" | "advanced"> = ["beginner", "intermediate", "advanced"]
    const projects = Array.from({ length: projectCount }, (_, idx) => ({
      name: `Project ${idx + 1}`,
      difficulty: difficulties[Math.floor(Math.random() * 3)],
    }))

    data.push({ date: dateStr, projects })
  }

  return data
}

const CalendarHeatmap = ({ onDateSelect }: { onDateSelect?: (date: string) => void }) => {
  const [calendarData] = useState(generateSampleData())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "advanced":
        return "bg-destructive/80"
      case "intermediate":
        return "bg-accent/80"
      case "beginner":
        return "bg-primary/60"
      default:
        return "bg-muted/30"
    }
  }

  const getIntensityClass = (projects: ProjectDay["projects"]) => {
    if (projects.length === 0) return "bg-muted/20 border-muted/30"
    const maxDifficulty = projects.reduce(
      (max, p) => {
        const order = { beginner: 1, intermediate: 2, advanced: 3 }
        return order[p.difficulty] > order[max] ? p.difficulty : max
      },
      "beginner" as "beginner" | "intermediate" | "advanced",
    )
    return getDifficultyColor(maxDifficulty)
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  // Organize into weeks (5 weeks, 7 days each)
  const weeks: ProjectDay[][] = []
  for (let i = 0; i < 5; i++) {
    weeks.push(calendarData.slice(i * 7, (i + 1) * 7))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card className="p-5 border-glow bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-primary">&gt;</span>
            Project Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-primary/10 rounded transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">Last 5 weeks</span>
            <button className="p-1 hover:bg-primary/10 rounded transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <TooltipProvider>
          <div className="space-y-1.5">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-1.5">
                {week.map((day, dayIdx) => {
                  const date = new Date(day.date)
                  const dayNum = date.getDate()

                  return (
                    <Tooltip key={dayIdx}>
                      <TooltipTrigger asChild>
                        <motion.button
                          onClick={() => handleDateClick(day.date)}
                          className={`
                            aspect-square rounded-md border flex items-center justify-center
                            text-xs font-medium transition-all hover:scale-105
                            ${getIntensityClass(day.projects)}
                            ${selectedDate === day.date ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                          `}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {day.projects.length > 0 && <span className="text-foreground">{day.projects.length}</span>}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-card border-border">
                        <div className="text-xs space-y-1">
                          <p className="font-semibold">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                          {day.projects.length > 0 ? (
                            <div className="space-y-0.5">
                              {day.projects.map((project, idx) => (
                                <p key={idx} className="text-muted-foreground flex items-center gap-1">
                                  <span className={`w-2 h-2 rounded-full ${getDifficultyColor(project.difficulty)}`} />
                                  {project.name} ({project.difficulty})
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No projects</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/60" />
            <span className="text-muted-foreground">Beginner</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-accent/80" />
            <span className="text-muted-foreground">Intermediate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/80" />
            <span className="text-muted-foreground">Advanced</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default CalendarHeatmap
