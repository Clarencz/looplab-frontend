"use client"

import type React from "react"

import { CheckCircle2, Rocket, Play, Code2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  type: "completed" | "shipped" | "deployed" | "started"
  message: string
  date: string
}

interface PublicActivityTimelineProps {
  activities: Activity[]
}

const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-500 bg-green-500/10" },
  shipped: { icon: <Rocket className="w-4 h-4" />, color: "text-blue-500 bg-blue-500/10" },
  deployed: { icon: <Code2 className="w-4 h-4" />, color: "text-purple-500 bg-purple-500/10" },
  started: { icon: <Play className="w-4 h-4" />, color: "text-orange-500 bg-orange-500/10" },
}

export function PublicActivityTimeline({ activities }: PublicActivityTimelineProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono text-lg">
          <Rocket className="w-5 h-5 text-primary" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const { icon, color } = activityIcons[activity.type]
              return (
                <div key={activity.id} className="relative flex items-start gap-4 pl-1">
                  {/* Icon */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${color}`}>
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
