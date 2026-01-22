import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import slides
import slide1 from "@/assets/slides/slide_1.png";
// slide 2 omitted as per plan
import slide3 from "@/assets/slides/slide_3.png";
// slide 4 omitted
import slide5 from "@/assets/slides/slide_5.png";
// slides 6-8 omitted
import slide9 from "@/assets/slides/slide_9.png";

const slides = [
    {
        id: 1,
        src: slide1,
        alt: "The Hook",
        className: "rotate-[-4deg] hover:rotate-0 hover:z-50 hover:scale-105",
        wrapperClass: "z-10 md:translate-x-12 md:translate-y-4"
    },
    {
        id: 3,
        src: slide3,
        alt: "The Struggle",
        className: "rotate-[2deg] hover:rotate-0 hover:z-50 hover:scale-105",
        wrapperClass: "z-20 md:-translate-x-4 md:-translate-y-8"
    },
    {
        id: 5,
        src: slide5,
        alt: "The Diagnosis",
        className: "rotate-[-2deg] hover:rotate-0 hover:z-50 hover:scale-105",
        wrapperClass: "z-30 md:translate-x-8 md:translate-y-8"
    },
    {
        id: 9,
        src: slide9,
        alt: "The Solution",
        className: "rotate-[3deg] hover:rotate-0 hover:z-50 hover:scale-105",
        wrapperClass: "z-40 md:-translate-x-10 md:-translate-y-2"
    },
];

const LandingNarrative = () => {
    return (
        <section className="relative pt-24 pb-12 bg-background overflow-hidden">
            {/* Subtle texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        The Reality <span className="text-primary/90 decoration-wavy underline decoration-primary/30 underline-offset-4">Gap</span>
                    </motion.h2>
                </div>

                {/* Organic Cluster Layout */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 md:flex-wrap">
                    {slides.map((slide, index) => (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: "backOut" }}
                            className={cn(
                                "relative w-full max-w-[320px] md:max-w-[450px] transition-all duration-300",
                                slide.wrapperClass
                            )}
                        >
                            <div className={cn(
                                "relative w-full aspect-[4/3] origin-center transition-all duration-300 ease-out cursor-pointer",
                                slide.className
                            )}>
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className="w-full h-full object-contain filter drop-shadow-xl"
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
