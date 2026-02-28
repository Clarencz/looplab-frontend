import { motion } from "framer-motion";

const cards = [
    {
        num: "01",
        title: "Real Scenarios, Not Syntax Drills",
        description: "Fix a broken financial model. Debug a flawed regression. Untangle messy datasets. Learn by actually solving — across Finance, Statistics, Programming, and more.",
        accent: "text-blue-400",
        borderColor: "border-blue-500/20",
        bgColor: "bg-blue-500/5",
    },
    {
        num: "02",
        title: "AI That Coaches, Not Answers",
        description: "MathemaLab's AI validates your work, scores your approach, and nudges you toward the right answer — without ever handing it to you.",
        accent: "text-purple-400",
        borderColor: "border-purple-500/20",
        bgColor: "bg-purple-500/5",
    },
    {
        num: "03",
        title: "Structured, Not Random",
        description: "Every challenge follows a curriculum designed by experts. You don't wander — you progress through levels that build real, demonstrable skills.",
        accent: "text-emerald-400",
        borderColor: "border-emerald-500/20",
        bgColor: "bg-emerald-500/5",
    },
    {
        num: "04",
        title: "Track What Matters",
        description: "See exactly where you're strong and where you're weak. Skill maps, streak tracking, and scoring that actually reflects understanding.",
        accent: "text-amber-400",
        borderColor: "border-amber-500/20",
        bgColor: "bg-amber-500/5",
    },
];

const LandingNarrative = () => {
    return (
        <section className="relative py-20 lg:py-28 bg-background/70 overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 bg-secondary/20" />
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Two-column: text left, cards right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* LEFT: Heading + description */}
                    <div className="flex flex-col items-start text-left lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-6"
                        >
                            <span className="text-xs font-medium text-muted-foreground">The Problem</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold sm:text-4xl md:text-5xl mb-6"
                        >
                            Stuck in <span className="text-gradient">Tutorial Hell?</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground max-w-md leading-relaxed"
                        >
                            Tutorials give you syntax. YouTube gives you walkthroughs. Neither teaches you to actually solve problems. MathemaLab does.
                        </motion.p>
                    </div>

                    {/* RIGHT: Stacked cards */}
                    <div className="flex flex-col gap-4">
                        {cards.map((card, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className={`flex-shrink-0 text-2xl font-mono font-bold ${card.accent} opacity-60`}>{card.num}</span>
                                        <div>
                                            <h3 className="text-base font-semibold text-foreground mb-1">{card.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LandingNarrative;