import { motion } from "framer-motion";
import { BookOpen, Cpu, MessageSquare, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Choose Your Topic",
    description: "Pick from 6 learning categories — finance, data analytics, math, algorithms, web dev, or programming — and set your level from beginner to advanced.",
    code: `// topic.config
{
  "category": "algorithms",
  "level": "beginner",
  "focus": "sorting"
}`,
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Generates Your Project",
    description: "MathemaLab generates a broken or incomplete project tailored exactly to your topic and skill level. No generic tutorials — real, targeted problems.",
    code: `// project.generated
{
  "type": "broken",
  "topic": "bubble sort",
  "gaps": ["loop logic", "swap fn"]
}`,
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Work With AI Guidance",
    description: "A built-in AI tutor watches your progress. It offers hints, explains the underlying concept, and asks guiding questions — it never just hands you the answer.",
    code: `// ai.tutor
> Hint: Check your loop
  boundary condition.
> Why does i stop at
  n-1 instead of n?`,
  },
  {
    number: "04",
    icon: Trophy,
    title: "Complete & Level Up",
    description: "Finish the project, see what you learned, and unlock the next challenge in your learning path. Every completion builds real understanding.",
    code: `// progress.stats
{
  "completed": 1,
  "concept": "bubble sort",
  "next": "merge sort"
}`,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Semi-transparent overlay so ballpit shows through */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Subtle gradient orbs */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-6"
          >
            <span className="text-xs font-medium text-muted-foreground">Workflow</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-balance text-white"
          >
            How <span className="text-gradient">MathemaLab</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Four steps. AI-guided. Learn by fixing real problems.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid gap-16 lg:gap-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              {/* Content */}
              <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Code Block */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="glass-premium p-6 overflow-hidden rounded-2xl">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/60" />
                    <span className="ml-2 text-xs text-muted-foreground">step-{step.number}.sh</span>
                  </div>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;