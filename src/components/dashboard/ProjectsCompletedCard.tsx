"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Clock, Star } from "lucide-react"

const ProjectsCompletedCard = () => {
  const projectsCompleted = 32
  const completionRate = 87
  const avgTurnaround = "4.2 days"
  const aiQualityRating = 4.5

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full"
    >
      <Card className="p-5 border-glow bg-gradient-card h-full">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Projects Completed</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-3xl font-bold">{projectsCompleted}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Completion Rate
            </span>
            <span className="font-medium text-primary">{completionRate}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Avg Turnaround
            </span>
            <span className="font-medium">{avgTurnaround}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Star className="h-3 w-3" />
              AI Quality
            </span>
            <span className="font-medium text-accent">{aiQualityRating}/5</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProjectsCompletedCard
