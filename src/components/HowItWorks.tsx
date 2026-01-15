import { motion } from "framer-motion";
import { Download, Code2, Upload, Trophy, ArrowRight } from "lucide-react";

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
    <section id="how-it-works" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 mb-6"
          >
            <span className="font-mono text-xs sm:text-sm text-primary">// workflow</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4"
          >
            How <span className="text-gradient">LoopLab</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2"
          >
            Four steps. No fluff. Real learning through real work.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
            >
              {/* Content */}
              <div className={`space-y-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-4xl font-bold text-primary/30">{step.number}</span>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center gap-2 pt-4 text-primary/50">
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono text-sm">Next step</span>
                  </div>
                )}
              </div>

              {/* Code Block */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="code-block p-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/60" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">step-{step.number}.sh</span>
                  </div>
                  <pre className="font-mono text-sm text-muted-foreground whitespace-pre-wrap">
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
