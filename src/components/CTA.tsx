import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Terminal Icon */}
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 animate-pulse-glow">
            <Terminal className="h-10 w-10 text-primary" />
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6">
            Stop watching tutorials.
            <br />
            <span className="text-gradient">Start shipping code.</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Get your first broken project now. Fix it, submit it, and start building 
            real skills that actually matter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Get Your First Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="terminal" size="lg">
              <code className="text-sm">$ looplab init</code>
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
