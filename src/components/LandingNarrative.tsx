import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import slides
import slide1 from "@/assets/slides/slide_1.png";
import slide3 from "@/assets/slides/slide_3.png";
import slide5 from "@/assets/slides/slide_5.png";
import slide9 from "@/assets/slides/slide_9.png";

const slides = [
    {
        id: 1,
        src: slide1,
        alt: "The Hook",
        className: "rotate-[-3deg] hover:rotate-0 hover:z-50 hover:scale-[1.02]",
        wrapperClass: "z-10 md:translate-x-8 md:translate-y-2"
    },
    {
        id: 3,
        src: slide3,
        alt: "The Struggle",
        className: "rotate-[2deg] hover:rotate-0 hover:z-50 hover:scale-[1.02]",
        wrapperClass: "z-20 md:-translate-x-2 md:-translate-y-6"
    },
    {
        id: 5,
        src: slide5,
        alt: "The Diagnosis",
        className: "rotate-[-2deg] hover:rotate-0 hover:z-50 hover:scale-[1.02]",
        wrapperClass: "z-30 md:translate-x-6 md:translate-y-6"
    },
    {
        id: 9,
        src: slide9,
        alt: "The Solution",
        className: "rotate-[2deg] hover:rotate-0 hover:z-50 hover:scale-[1.02]",
        wrapperClass: "z-40 md:-translate-x-8 md:-translate-y-1"
    },
];

const LandingNarrative = () => {
    return (
        <section className="relative py-24 lg:py-32 bg-background overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-secondary/20" />
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-6"
                    >
                        <span className="text-xs font-medium text-muted-foreground">The Journey</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold sm:text-4xl md:text-5xl mb-4 text-balance"
                    >
                        The Reality <span className="text-gradient">Gap</span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Tutorials teach syntax. LoopLab teaches you to think like a developer.
                    </motion.p>
                </div>

                {/* Organic Cluster Layout */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 md:flex-wrap">
                    {slides.map((slide, index) => (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                            className={cn(
                                "relative w-full max-w-[280px] md:max-w-[400px] transition-all duration-300",
                                slide.wrapperClass
                            )}
                        >
                            <div className={cn(
                                "relative w-full aspect-[4/3] origin-center transition-all duration-300 ease-out cursor-pointer rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20",
                                slide.className
                            )}>
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="w-full h-full object-contain bg-card"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingNarrative;