import { motion } from "framer-motion";
import {
  Layers,
  Zap,
  FileCode2,
  Trophy,
  Cpu,
  GraduationCap,
  Brain,
  TrendingUp,
  Map,
  AlertCircle,
  Globe
} from "lucide-react";

const features = [
  { icon: Globe, title: "6 Learning Categories", description: "Finance, data analytics, math, algorithms, web dev, and programming. Every category has structured projects from beginner to advanced." },
  { icon: Brain, title: "AI Tutor Built In", description: "Get hints and explanations as you work. The AI never just gives you the answer — it guides you to find it yourself." },
  { icon: TrendingUp, title: "Adaptive Difficulty", description: "Projects automatically scale from beginner to advanced based on your progress. Always challenged, never overwhelmed." },
  { icon: FileCode2, title: "Learn by Fixing", description: "Every project has intentional gaps that teach real problem-solving. Fix broken code, fill in missing logic, complete incomplete systems." },
  { icon: Map, title: "Guided Learning Paths", description: "Structured progression through each category. Know exactly where you are and what comes next in your learning journey." },
  { icon: AlertCircle, title: "Mistake Explanations", description: "When you get something wrong, AI explains why your approach failed — not just what's wrong, but why it matters." },
  { icon: Cpu, title: "Real-World Problems", description: "Finance models, data pipelines, math proofs, algorithm implementations. Problems that mirror what practitioners actually work on." },
  { icon: Trophy, title: "Progress Tracking", description: "See your growth across topics over time. Track completions, streaks, and skill development in each category." },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/20" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-6 max-w-6xl">
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
            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-balance text-white"
          >
            Built for <span className="text-gradient">every kind of learner</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            MathemaLab bridges the gap between passive learning and real understanding — one project at a time.
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
              className="group relative rounded-2xl p-6 glass-premium hover:scale-[1.02] transition-all duration-300"
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