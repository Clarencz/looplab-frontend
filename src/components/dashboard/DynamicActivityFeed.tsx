"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, Shield, Award, AlertTriangle, Zap } from "lucide-react"

interface Activity {
  id: number
  type: "completed" | "hours" | "validation" | "skills" | "badge" | "fail"
  text: string
  detail: string
  time: string
}

const activities: Activity[] = [
  {
    id: 1,
    type: "completed",
    text: "Completed project",
    detail: "Task Manager API",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "hours",
    text: "Logged",
    detail: "4.5 hours",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "validation",
    text: "Validation passed",
    detail: "All tests green",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "skills",
    text: "Skill points earned",
    detail: "+15 Backend",
    time: "3 hours ago",
  },
  {
    id: 5,
    type: "badge",
    text: "New badge unlocked",
    detail: "API Master",
    time: "3 hours ago",
  },
  {
    id: 6,
    type: "fail",
    text: "Test failed",
    detail: "Auth middleware",
    time: "5 hours ago",
  },
  {
    id: 7,
    type: "completed",
    text: "Completed project",
    detail: "Portfolio Website",
    time: "1 day ago",
  },
]

const iconMap = {
  completed: { icon: CheckCircle2, color: "text-primary bg-primary/10" },
  hours: { icon: Clock, color: "text-accent bg-accent/10" },
  validation: { icon: Shield, color: "text-green-500 bg-green-500/10" },
  skills: { icon: Zap, color: "text-yellow-500 bg-yellow-500/10" },
  badge: { icon: Award, color: "text-purple-500 bg-purple-500/10" },
  fail: { icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
}

const DynamicActivityFeed = ({ selectedDate }: { selectedDate?: string | null }) => {
  // Filter activities based on selected date (in real app, this would filter actual data)
  const filteredActivities = selectedDate
    ? activities.slice(0, 4) // Simulate filtered data
    : activities

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card className="p-5 border-glow bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-primary">&gt;</span>
            Activity Feed
          </h3>
          {selectedDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity) => {
              const { icon: Icon, color } = iconMap[activity.type]
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex gap-3 items-start"
                >
                  <div className={`p-2 rounded-full ${color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      {activity.text}{" "}
                      <span
                        className={`font-semibold ${activity.type === "fail" ? "text-destructive" : "text-primary"}`}
                      >
                        {activity.detail}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

export default DynamicActivityFeed
