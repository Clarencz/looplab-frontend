import { motion } from "framer-motion";
import { Flame, CheckCircle2, Clock, Code2 } from "lucide-react";

const weekData = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: true },
  { day: "Thu", completed: false },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: false, current: true },
];

const recentProjects = [
  { name: "React Auth Flow", tech: "React", difficulty: "Intermediate", status: "completed" },
  { name: "Express REST API", tech: "Node.js", difficulty: "Intermediate", status: "completed" },
  { name: "CSS Grid Layout", tech: "CSS", difficulty: "Beginner", status: "in-progress" },
];

const StreakPreview = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow opacity-30" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 mb-6"
          >
            <Flame className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm text-primary">// your profile</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4"
          >
            Track your <span className="text-gradient">progress</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Build meaningful streaks with completed, validated projects — not empty checkmarks.
          </motion.p>
        </div>

        {/* Profile Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            {/* Header Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-primary/60" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">profile.looplab.dev</span>
            </div>

            <div className="p-6 sm:p-8">
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="font-mono text-2xl font-bold text-primary-foreground">AL</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-xl font-bold">Alex Chen</h3>
                  <p className="text-sm text-muted-foreground">@alexchen • Joined 3 months ago</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="streak-badge px-2 py-1 rounded-md text-xs font-mono">
                      <Flame className="inline h-3 w-3 mr-1" />
                      12 week streak
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">Level: Code Surgeon</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Projects", value: "28", icon: Code2 },
                  { label: "Current Streak", value: "12", icon: Flame },
                  { label: "Hours Coded", value: "156", icon: Clock },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-secondary/50 p-4 text-center border border-border">
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <div className="font-mono text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Weekly Activity */}
              <div className="mb-8">
                <h4 className="font-mono text-sm font-semibold mb-4 text-muted-foreground">THIS WEEK</h4>
                <div className="flex justify-between gap-2">
                  {weekData.map((day) => (
                    <div key={day.day} className="flex-1 text-center">
                      <div
                        className={`h-10 w-full rounded-lg mb-2 flex items-center justify-center transition-all ${
                          day.completed
                            ? "bg-primary/20 border border-primary/40"
                            : day.current
                            ? "bg-secondary border border-dashed border-muted-foreground/30"
                            : "bg-secondary/30 border border-border"
                        }`}
                      >
                        {day.completed && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Projects */}
              <div>
                <h4 className="font-mono text-sm font-semibold mb-4 text-muted-foreground">RECENT PROJECTS</h4>
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <div
                      key={project.name}
                      className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          project.status === "completed" ? "bg-primary" : "bg-yellow-500"
                        }`} />
                        <div>
                          <div className="font-mono text-sm font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.tech} • {project.difficulty}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        project.status === "completed" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {project.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreakPreview;
