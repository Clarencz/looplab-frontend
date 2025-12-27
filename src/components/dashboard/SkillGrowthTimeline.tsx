"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const skillsData = [
  { name: "Frontend", projects: 12, maxProjects: 20, color: "bg-primary" },
  { name: "Backend", projects: 8, maxProjects: 20, color: "bg-accent" },
  { name: "Database", projects: 5, maxProjects: 20, color: "bg-green-500" },
  { name: "DevOps", projects: 3, maxProjects: 20, color: "bg-yellow-500" },
  { name: "Testing", projects: 4, maxProjects: 20, color: "bg-purple-500" },
  { name: "Mobile", projects: 2, maxProjects: 20, color: "bg-pink-500" },
]

const SkillGrowthTimeline = () => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <Card className="p-5 border-glow bg-gradient-card">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <span className="text-primary">&gt;</span>
          Skill Growth
        </h3>

        <TooltipProvider>
          <div className="space-y-3">
            {skillsData.map((skill, index) => {
              const percentage = (skill.projects / skill.maxProjects) * 100

              return (
                <Tooltip key={skill.name}>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.projects}</span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${skill.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-card border-border">
                    <p className="text-xs">
                      <span className="font-semibold">{skill.projects}</span> projects tagged with {skill.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </Card>
    </motion.div>
  )
}

export default SkillGrowthTimeline
