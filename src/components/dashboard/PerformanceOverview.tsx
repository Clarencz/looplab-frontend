"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts"
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react"

const trendData = [
  { week: "W1", score: 72 },
  { week: "W2", score: 78 },
  { week: "W3", score: 75 },
  { week: "W4", score: 82 },
  { week: "W5", score: 85 },
  { week: "W6", score: 88 },
  { week: "W7", score: 84 },
  { week: "W8", score: 91 },
]

const PerformanceOverview = () => {
  const successRate = 87
  const failRate = 13
  const avgFixTime = "2.3h"
  const avgAttempts = 1.4

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <Card className="p-5 border-glow bg-gradient-card">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <span className="text-primary">&gt;</span>
          Performance Overview
        </h3>

        {/* Success/Fail ratio */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Success</span>
            </div>
            <p className="text-xl font-bold text-primary">{successRate}%</p>
          </div>
          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <p className="text-xl font-bold text-destructive">{failRate}%</p>
          </div>
        </div>

        {/* Additional metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Avg time to fix
            </span>
            <span className="font-medium">{avgFixTime}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <RotateCcw className="h-3 w-3" />
              Avg attempts
            </span>
            <span className="font-medium">{avgAttempts}</span>
          </div>
        </div>

        {/* Performance Trend mini chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Performance Trend</p>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#performanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PerformanceOverview
