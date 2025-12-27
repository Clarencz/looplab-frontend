"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

const TotalHoursChart = () => {
  const totalHours = 142
  const avgHoursPerWeek = 12
  const mostProductiveDay = "Saturday"
  const maxHours = 200
  const percentage = (totalHours / maxHours) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="h-full"
    >
      <Card className="p-5 border-glow bg-gradient-card h-full">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Total Hours</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-36 h-36">
            {/* Clock face background */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" opacity="0.2" />
              {/* Progress arc */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.83} 283`}
                transform="rotate(-90 50 50)"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${percentage * 2.83} 283` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* Clock tick marks */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="12"
                  x2="50"
                  y2="16"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="1"
                  opacity="0.3"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{totalHours}h</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1 text-center">
          <p className="text-xs text-muted-foreground">
            Avg <span className="text-foreground font-medium">{avgHoursPerWeek}h</span>/week
          </p>
          <p className="text-xs text-muted-foreground">
            Most active: <span className="text-primary font-medium">{mostProductiveDay}</span>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export default TotalHoursChart
