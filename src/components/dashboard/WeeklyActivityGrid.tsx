"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface WeekData {
  week: number
  year: number
  started: number
  completed: number
  submitted: number
}

interface WeeklyActivityGridProps {
  data: WeekData[]
}

export function WeeklyActivityGrid({ data }: WeeklyActivityGridProps) {
  const [hoveredWeek, setHoveredWeek] = useState<WeekData | null>(null)

  const getIntensity = (week: WeekData) => {
    const total = week.started + week.completed + week.submitted
    if (total === 0) return 0
    if (total <= 2) return 1
    if (total <= 4) return 2
    if (total <= 6) return 3
    return 4
  }

  const intensityClasses = ["bg-muted/30", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary/80"]

  // Organize data into rows of 12 weeks
  const rows: WeekData[][] = []
  for (let i = 0; i < data.length; i += 12) {
    rows.push(data.slice(i, i + 12))
  }

  return (
    <TooltipProvider>
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="font-mono font-semibold text-foreground text-lg mb-4">Projects Worked On</h3>

        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5">
              {row.map((week) => (
                <Tooltip key={`${week.year}-${week.week}`}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-8 h-8 rounded-md cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50 ${
                        intensityClasses[getIntensity(week)]
                      }`}
                      onMouseEnter={() => setHoveredWeek(week)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-popover border border-border px-3 py-2">
                    <p className="font-mono text-sm text-foreground">
                      Week {week.week} · {week.year}
                    </p>
                    <div className="flex flex-col gap-0.5 mt-1 text-xs text-muted-foreground">
                      <span>{week.started} started</span>
                      <span>{week.completed} completed</span>
                      <span>{week.submitted} submitted</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            {intensityClasses.map((cls, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${cls}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </TooltipProvider>
  )
}
