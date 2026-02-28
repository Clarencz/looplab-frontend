import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[70vh] overflow-hidden pt-32 pb-16">
      {/* Glassmorphism overlay — strong frosted-glass effect */}
      <div className="absolute inset-0 bg-background/70 " />

      {/* Mesh gradient & Noise background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
      <div className="absolute inset-0 noise-underlay opacity-20" />

      {/* Aurora Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] aurora-glow-premium opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-4 font-black leading-[1.1] tracking-tight"
            >
              <span className="block text-2xl sm:text-3xl md:text-4xl text-white">
                where ambition and learning meet the interactive tools to grow your skillset
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed font-medium italic"
            >
              Guidance of your favourite teacher with AI smarterness.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              {user ? (
                <>
                  <Button variant="hero" size="lg" className="rounded-full px-8 h-12 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 transition-all text-sm font-semibold" asChild>
                    <a href="/dashboard">
                      Launch Hub
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="glass-premium rounded-full px-8 h-12 border-white/10 hover:bg-white/5 transition-all text-sm font-semibold" asChild>
                    <a href="/projects">Explore Paths</a>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {/* Verdant-style Easter badge */}
                    <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 backdrop-blur-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">This Easter</span>
                      <motion.span
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-base"
                      >
                        🥚→
                      </motion.span>
                    </div>
                    <Button variant="hero" size="lg" className="rounded-full px-8 h-12 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 transition-all text-sm font-semibold" asChild>
                      <a href="/auth">
                        Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <Button variant="outline" size="lg" className="glass-premium rounded-full px-8 h-12 border-white/10 hover:bg-white/5 transition-all text-sm font-semibold" asChild>
                    <a href="/#how-it-works">Watch Demo</a>
                  </Button>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-10 flex items-center gap-8"
            >
              {[
                { value: "6", label: "Categories" },
                { value: "AI", label: "Guided Projects" },
                { value: "∞", label: "Practice" },
              ].map((stat, index) => (
                <div key={index} className="text-left">
                  <div className="text-xl font-bold text-foreground mb-0.5">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;