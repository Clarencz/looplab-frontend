import { motion } from "framer-motion";
import { Download, Code2, Upload, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Get a Broken Project",
    description: "Select your tech stack and difficulty. LoopLab generates a real project with missing files, bugs, and incomplete features.",
    code: `// project.config
{
  "stack": "react",
  "difficulty": "intermediate",
  "status": "broken"
}`,
  },
  {
    number: "02",
    icon: Code2,
    title: "Fix in Your IDE",
    description: "Clone to your machine or connect via GitHub. Use VS Code, WebStorm, or any editor. No restrictions, no handholding.",
    code: `$ git clone looplab/project-xyz
$ cd project-xyz
$ code .  # Your editor, your rules`,
  },
  {
    number: "03",
    icon: Upload,
    title: "Submit for Validation",
    description: "Push your completed code back. LoopLab runs automated tests, checks functionality, and validates your solution.",
    code: `$ git push origin main
> Running validation...
> ✓ Build passed
> ✓ Tests passed`,
  },
  {
    number: "04",
    icon: Trophy,
    title: "Earn Your Streak",
    description: "Validated projects count toward your weekly streak. Build a portfolio of real, working projects you actually fixed.",
    code: `// profile.stats
{
  "streak": 5,
  "projects": 12,
  "rank": "Code Surgeon"
}`,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-balance"
          >
            How <span className="text-gradient">LoopLab</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Four steps. No fluff. Real learning through real work.
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
                <div className="code-block p-6 overflow-hidden">
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