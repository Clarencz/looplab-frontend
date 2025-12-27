"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const skillsData = [
  { name: "Frontend", value: 12, projects: 12, color: "hsl(var(--primary))" },
  { name: "Backend", value: 8, projects: 8, color: "hsl(var(--accent))" },
  { name: "Database", value: 5, projects: 5, color: "hsl(142, 76%, 36%)" },
  { name: "DevOps", value: 3, projects: 3, color: "hsl(38, 92%, 50%)" },
  { name: "Testing", value: 4, projects: 4, color: "hsl(280, 65%, 60%)" },
]

const SkillsDonutChart = () => {
  const totalSkills = skillsData.reduce((sum, skill) => sum + skill.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="h-full"
    >
      <Card className="p-5 border-glow bg-gradient-card h-full">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Skills Mastered</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 text-xs">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-muted-foreground">{data.projects} projects</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalSkills}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {skillsData.map((skill) => (
            <div key={skill.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: skill.color }} />
              <span className="text-xs text-muted-foreground">{skill.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export default SkillsDonutChart
