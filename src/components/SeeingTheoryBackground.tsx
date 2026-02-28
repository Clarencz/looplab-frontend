import { useEffect, useRef } from "react";
import * as d3 from "d3";

// Vibrant color palette
const COLORS = [
    "#14b8a6", // teal
    "#ec4899", // pink
    "#f59e0b", // amber
    "#6366f1", // indigo
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ef4444", // red
    "#06b6d4", // cyan
];

// Subject labels to inscribe on the balls
const SUBJECTS = [
    "Finance", "Programming", "Algorithms", "Data Analytics",
    "Data Science", "Statistics", "Probability", "Machine Learning",
    "Calculus", "Algebra", "Geometry", "Physics",
    "Economics", "Accounting", "Python", "JavaScript",
    "SQL", "R", "AI", "NLP",
    "Deep Learning", "Neural Nets", "Regression", "Clustering",
    "Blockchain", "Crypto", "Trading", "Risk",
    "Optimization", "Graph Theory", "Sorting", "Hashing",
    "Linear Algebra", "Matrices", "Vectors", "Tensors",
    "Bayesian", "Hypothesis", "Sampling", "Inference",
    "ETL", "Pipelines", "APIs", "REST",
    "Cloud", "DevOps", "Docker", "CI/CD",
    "Big Data", "Spark", "Hadoop", "Kafka",
    "Visualization", "Charts", "Dashboards", "Reports",
    "Game Theory", "Markov", "Monte Carlo", "Simulation",
];

interface Node extends d3.SimulationNodeDatum {
    radius: number;
    color: string;
    label: string;
}

const SeeingTheoryBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        let width = wrapper.clientWidth;
        let height = wrapper.clientHeight;

        // Set actual canvas resolution for high-DPI screens
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        context.scale(pixelRatio, pixelRatio);

        // 1. Initialize Nodes — bigger balls so text fits
        const NUM_NODES = 150;
        const nodes: Node[] = Array.from({ length: NUM_NODES }).map(() => {
            const radius = Math.random() * 20 + 10; // Sizes between 10 and 30
            return {
                radius,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                label: SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)],
                x: width / 2 + (Math.random() - 0.5) * width,
                y: height / 2 + (Math.random() - 0.5) * height,
            };
        });

        // The first node acts as the "mouse" repulsive/attractive force center
        const rootNode = nodes[0];
        rootNode.radius = 0; // Invisible
        rootNode.label = "";
        rootNode.fx = width / 2;
        rootNode.fy = height / 2;

        // 2. Setup D3 Force Simulation
        const simulation = d3
            .forceSimulation<Node>(nodes)
            .alphaTarget(0.1) // Keep the simulation running forever
            .velocityDecay(0.1) // Viscous "liquid" feel

            // Pull nodes gently toward the center
            .force("x", d3.forceX(width / 2).strength(0.015))
            .force("y", d3.forceY(height / 2).strength(0.015))

            // Prevent overlapping
            .force(
                "collide",
                d3
                    .forceCollide<Node>()
                    .radius((d) => d.radius + 2) // +2 padding
                    .iterations(3)
            )

            // Add a strong repulsion from the root node (mouse)
            .force("charge", d3.forceManyBody().strength((d, i) => (i === 0 ? -2000 : 0)));

        // 3. Render Loop (the "tick" event)
        simulation.on("tick", () => {
            context.clearRect(0, 0, width, height);

            // Skip the first node (index 0) since it's the invisible mouse tracker
            for (let i = 1; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.x === undefined || node.y === undefined) continue;

                // Draw the ball
                context.beginPath();
                context.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
                context.fillStyle = node.color;
                context.globalAlpha = 0.55;
                context.fill();
                context.closePath();

                // Draw the subject label inside the ball
                if (node.label) {
                    // Scale font size to fit inside the ball
                    const fontSize = Math.max(6, Math.min(node.radius * 0.55, 12));
                    context.globalAlpha = 0.9;
                    context.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
                    context.fillStyle = "#ffffff";
                    context.textAlign = "center";
                    context.textBaseline = "middle";

                    // Truncate label if it's too wide for the ball
                    const maxWidth = node.radius * 1.6;
                    const measured = context.measureText(node.label);
                    if (measured.width > maxWidth && node.label.length > 4) {
                        // Abbreviate: show first few chars
                        let truncated = node.label;
                        while (context.measureText(truncated + "…").width > maxWidth && truncated.length > 2) {
                            truncated = truncated.slice(0, -1);
                        }
                        context.fillText(truncated + "…", node.x, node.y);
                    } else {
                        context.fillText(node.label, node.x, node.y);
                    }
                }
            }
        });

        // 4. Mouse Interaction (attached to window since canvas doesn't capture events)
        const handlePointerMove = (e: PointerEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Only track if mouse is over the container vertically
            if (y >= 0 && y <= height) {
                rootNode.fx = x;
                rootNode.fy = y;
                simulation.alpha(0.3).restart();
            }
        };

        window.addEventListener("pointermove", handlePointerMove);

        // 5. Handle Resize
        const handleResize = () => {
            width = wrapper.clientWidth;
            height = wrapper.clientHeight;

            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            context.scale(pixelRatio, pixelRatio);

            // Update center forces
            simulation.force("x", d3.forceX(width / 2).strength(0.015));
            simulation.force("y", d3.forceY(height / 2).strength(0.015));

            // Re-center root if not explicitly tracking mouse
            if (rootNode.fx === undefined) {
                rootNode.fx = width / 2;
                rootNode.fy = height / 2;
            }

            simulation.alpha(0.3).restart();
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            simulation.stop();
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "fixed",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: 0,
            }}
            aria-hidden="true"
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

export default SeeingTheoryBackground;
