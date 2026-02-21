import { motion } from "framer-motion";
import {
  GitBranch,
  Layers,
  Shield,
  Zap,
  FileCode2,
  Trophy,
  MonitorSmartphone,
  Cpu
} from "lucide-react";

const features = [
  {
    icon: FileCode2,
    title: "Full Project Delivery",
    description: "Receive complete, realistic projects with intentional bugs, missing files, and incomplete features.",
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description: "Clone projects, work in your IDE, and push back for validation. Seamless Git workflow.",
  },
  {
    icon: Shield,
    title: "AI-Powered Validation",
    description: "Automated testing ensures your solution actually works. We check functionality, not just syntax.",
  },
  {
    icon: Trophy,
    title: "Project Streaks",
    description: "Earn weekly streaks by completing validated projects. Track progress without meaningless gamification.",
  },
  {
    icon: Layers,
    title: "Multi-Stack Support",
    description: "React, Express, HTML/CSS, Python, and more. Choose your learning path across 50+ technologies.",
  },
  {
    icon: MonitorSmartphone,
    title: "Use Any Editor",
    description: "VS Code, WebStorm, Vim, or our optional built-in editor. Your tools, your workflow, your choice.",
  },
  {
    icon: Zap,
    title: "Real Bug Patterns",
    description: "Projects contain realistic bugs developers actually face: race conditions, edge cases, logic errors.",
  },
  {
    icon: Cpu,
    title: "Portfolio Export",
    description: "Export completed projects as portfolio-ready code. Show employers real work, not tutorial clones.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/20" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-muted-foreground">Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-balance"
          >
            Built for <span className="text-gradient">real developers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            No fluff. No hand-holding. Just the features you need to build real skills.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/20 hover:bg-card/80 card-hover"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;