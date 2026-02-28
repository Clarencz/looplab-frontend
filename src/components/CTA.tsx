import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Terminal Icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6 text-balance">
            Stop watching tutorials.
            <br />
            <span className="text-gradient">Start actually learning.</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Whether you're a beginner finding your footing, a professional branching into new territory, or someone stuck on your fifth tutorial — MathemaLab gives you the structure to actually learn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="rounded-full px-8 h-14 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 transition-all text-base font-semibold" asChild>
              <a href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="glass-premium rounded-full px-8 h-14 border-white/10 hover:bg-white/5 transition-all text-base font-semibold" asChild>
              <a href="/#how-it-works">Pick Your First Topic</a>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required. Start for free.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;