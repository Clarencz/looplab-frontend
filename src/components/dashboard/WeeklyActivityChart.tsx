"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const weeklyData = [
  { day: "Mon", tasks: 8, progress: 15 },
  { day: "Tue", tasks: 12, progress: 28 },
  { day: "Wed", tasks: 6, progress: 35 },
  { day: "Thu", tasks: 15, progress: 52 },
  { day: "Fri", tasks: 10, progress: 68 },
  { day: "Sat", tasks: 18, progress: 85 },
  { day: "Sun", tasks: 5, progress: 100 },
]

const WeeklyActivityChart = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <Card className="p-5 border-glow bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="text-primary">&gt;</span>
            Weekly Activity
          </h3>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary/60" />
              <span className="text-muted-foreground">Tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-accent" />
              <span className="text-muted-foreground">Progress %</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.1} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "11px" }} />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "11px" }}
              label={{
                value: "Tasks",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: "10px", fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "11px" }}
              label={{
                value: "Progress %",
                angle: 90,
                position: "insideRight",
                style: { fontSize: "10px", fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar yAxisId="left" dataKey="tasks" fill="hsl(var(--primary))" opacity={0.6} radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="progress"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

export default WeeklyActivityChart
