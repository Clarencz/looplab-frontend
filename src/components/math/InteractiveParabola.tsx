import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as d3 from 'd3';

export interface InteractiveParabolaProps {
    initialA?: number;
    initialB?: number;
    initialC?: number;
}

export default function InteractiveParabola({
    initialA = 1,
    initialB = -4,
    initialC = 3,
}: InteractiveParabolaProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [a, setA] = useState(initialA);
    const [b, setB] = useState(initialB);
    const [c, setC] = useState(initialC);

    // Calculate key features
    const discriminant = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    const roots: number[] = [];
    if (discriminant >= 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        roots.push(root1, root2);
    }

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        // Clear previous
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Scales
        const xScale = d3
            .scaleLinear()
            .domain([-10, 10])
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([-10, 10])
            .range([height - margin.bottom, margin.top]);

        // Axes
        svg
            .append('g')
            .attr('transform', `translate(0,${yScale(0)})`)
            .call(d3.axisBottom(xScale))
            .attr('class', 'axis');

        svg
            .append('g')
            .attr('transform', `translate(${xScale(0)},0)`)
            .call(d3.axisLeft(yScale))
            .attr('class', 'axis');

        // Grid
        svg
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .tickSize(-(height - margin.top - margin.bottom))
                    .tickFormat(() => '')
            )
            .style('stroke-opacity', 0.1);

        svg
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(${margin.left},0)`)
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(-(width - margin.left - margin.right))
                    .tickFormat(() => '')
            )
            .style('stroke-opacity', 0.1);

        // Function
        const f = (x: number) => a * x * x + b * x + c;
        const points = d3.range(-10, 10, 0.1).map((x) => ({ x, y: f(x) }));

        const line = d3
            .line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y));

        // Draw parabola
        svg
            .append('path')
            .datum(points)
            .attr('fill', 'none')
            .attr('stroke', 'hsl(var(--primary))')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Vertex
        if (vertexX >= -10 && vertexX <= 10 && vertexY >= -10 && vertexY <= 10) {
            svg
                .append('circle')
                .attr('cx', xScale(vertexX))
                .attr('cy', yScale(vertexY))
                .attr('r', 6)
                .attr('fill', 'green')
                .attr('stroke', 'white')
                .attr('stroke-width', 2);

            svg
                .append('text')
                .attr('x', xScale(vertexX))
                .attr('y', yScale(vertexY) - 15)
                .attr('text-anchor', 'middle')
                .attr('fill', 'green')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text(`Vertex (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})`);

            // Axis of symmetry
            svg
                .append('line')
                .attr('x1', xScale(vertexX))
                .attr('y1', margin.top)
                .attr('x2', xScale(vertexX))
                .attr('y2', height - margin.bottom)
                .attr('stroke', 'green')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '5,5')
                .attr('opacity', 0.5);
        }

        // Roots
        roots.forEach((root) => {
            if (root >= -10 && root <= 10) {
                svg
                    .append('circle')
                    .attr('cx', xScale(root))
                    .attr('cy', yScale(0))
                    .attr('r', 6)
                    .attr('fill', 'red')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);

                svg
                    .append('text')
                    .attr('x', xScale(root))
                    .attr('y', yScale(0) + 20)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'red')
                    .attr('font-size', '11px')
                    .attr('font-weight', 'bold')
                    .text(`x = ${root.toFixed(2)}`);
            }
        });
    }, [a, b, c, vertexX, vertexY, roots]);

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Graph */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                        <span>Interactive Parabola</span>
                        <Badge variant={discriminant >= 0 ? 'default' : 'destructive'}>
                            {discriminant >= 0 ? `${roots.length} root${roots.length !== 1 ? 's' : ''}` : 'No real roots'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <svg ref={svgRef} className="border rounded" />
                </CardContent>
            </Card>

            {/* Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Drag to Explore</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="standard">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="standard">Standard</TabsTrigger>
                            <TabsTrigger value="vertex">Vertex</TabsTrigger>
                            <TabsTrigger value="factored">Factored</TabsTrigger>
                        </TabsList>

                        <TabsContent value="standard" className="space-y-4 mt-4">
                            <div className="text-center font-mono text-lg mb-4">
                                y = {a}x² + {b}x + {c}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">a (width):</label>
                                        <span className="text-sm font-mono font-bold">{a}</span>
                                    </div>
                                    <Slider
                                        value={[a]}
                                        onValueChange={([value]) => setA(value)}
                                        min={-5}
                                        max={5}
                                        step={0.1}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {a > 0 ? '↑ Opens upward' : a < 0 ? '↓ Opens downward' : '— Flat line'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">b (shift):</label>
                                        <span className="text-sm font-mono font-bold">{b}</span>
                                    </div>
                                    <Slider
                                        value={[b]}
                                        onValueChange={([value]) => setB(value)}
                                        min={-10}
                                        max={10}
                                        step={0.1}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">c (height):</label>
                                        <span className="text-sm font-mono font-bold">{c}</span>
                                    </div>
                                    <Slider
                                        value={[c]}
                                        onValueChange={([value]) => setC(value)}
                                        min={-10}
                                        max={10}
                                        step={0.1}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        y-intercept at (0, {c})
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="vertex" className="space-y-4 mt-4">
                            <div className="text-center font-mono text-lg mb-4">
                                y = {a}(x - {vertexX.toFixed(2)})² + {vertexY.toFixed(2)}
                            </div>
                            <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                                <p><strong>Vertex form:</strong> y = a(x - h)² + k</p>
                                <p>• h = {vertexX.toFixed(2)} (x-coordinate of vertex)</p>
                                <p>• k = {vertexY.toFixed(2)} (y-coordinate of vertex)</p>
                                <p>• Vertex is at ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="factored" className="space-y-4 mt-4">
                            {roots.length === 2 ? (
                                <>
                                    <div className="text-center font-mono text-lg mb-4">
                                        y = {a}(x - {roots[0].toFixed(2)})(x - {roots[1].toFixed(2)})
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                                        <p><strong>Factored form:</strong> y = a(x - r₁)(x - r₂)</p>
                                        <p>• r₁ = {roots[0].toFixed(2)}</p>
                                        <p>• r₂ = {roots[1].toFixed(2)}</p>
                                        <p>• Roots are where the parabola crosses the x-axis</p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-destructive/10 rounded-lg text-sm">
                                    <p className="font-semibold">No real roots!</p>
                                    <p className="mt-2">Discriminant (b² - 4ac) = {discriminant.toFixed(2)}</p>
                                    <p>When discriminant &lt; 0, the parabola doesn't cross the x-axis.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Key Features</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-green-600">Vertex</p>
                        <p className="font-mono">({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</p>
                    </div>
                    <div>
                        <p className="font-semibold text-red-600">Roots</p>
                        <p className="font-mono">
                            {roots.length > 0 ? roots.map(r => r.toFixed(2)).join(', ') : 'None'}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Discriminant</p>
                        <p className="font-mono">{discriminant.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Opens</p>
                        <p className="font-mono">{a > 0 ? 'Upward ↑' : 'Downward ↓'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
