import { useState } from 'react'
import { Node, Edge } from 'reactflow'
import { PipelineCanvas } from '@/components/datascience/PipelineCanvas'
import { PipelineStageData } from '@/components/datascience/PipelineStage'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Demo: Telco Churn Analysis Pipeline
const initialNodes: Node<PipelineStageData>[] = [
    {
        id: '1',
        type: 'pipelineStage',
        position: { x: 250, y: 0 },
        data: {
            label: 'Business Question',
            status: 'warning',
            description: '"Prove pricing caused churn increase"',
            isDecisionPoint: true,
            metrics: [
                { label: 'Stakeholder', value: 'Marketing' },
                { label: 'Decision Impact', value: '$2M' },
            ],
        },
    },
    {
        id: '2',
        type: 'pipelineStage',
        position: { x: 250, y: 200 },
        data: {
            label: 'Data Validation',
            status: 'failing',
            description: 'Customer data quality issues detected',
            metrics: [
                { label: 'Missing Values', value: '23%' },
                { label: 'Duplicate IDs', value: '847' },
                { label: 'Inconsistent Dates', value: '12%' },
            ],
        },
    },
    {
        id: '3',
        type: 'pipelineStage',
        position: { x: 250, y: 400 },
        data: {
            label: 'Transformation & Aggregation',
            status: 'warning',
            description: 'Average revenue stable, but distribution shifted',
            isDecisionPoint: true,
            metrics: [
                { label: 'Avg Revenue', value: '$47.23' },
                { label: 'Median Revenue', value: '$32.15' },
                { label: 'High-Value Churn', value: '+34%' },
            ],
        },
    },
    {
        id: '4',
        type: 'pipelineStage',
        position: { x: 250, y: 600 },
        data: {
            label: 'Feature Engineering',
            status: 'failing',
            description: 'Temporal leakage detected in features',
            metrics: [
                { label: 'Total Features', value: '23' },
                { label: 'Leaky Features', value: '3' },
                { label: 'Safe Features', value: '20' },
            ],
        },
    },
    {
        id: '5',
        type: 'pipelineStage',
        position: { x: 250, y: 800 },
        data: {
            label: 'Analysis & Insights',
            status: 'warning',
            description: 'Correlation found, but confounding factors present',
            isDecisionPoint: true,
            metrics: [
                { label: 'Pricing Correlation', value: '0.34' },
                { label: 'Service Quality', value: '0.67' },
                { label: 'Confidence', value: 'Low' },
            ],
        },
    },
    {
        id: '6',
        type: 'pipelineStage',
        position: { x: 250, y: 1000 },
        data: {
            label: 'Recommendation',
            status: 'pending',
            description: 'Model accuracy high, but wrong business conclusion',
            isDecisionPoint: true,
            metrics: [
                { label: 'Model Accuracy', value: '87%' },
                { label: 'Business Value', value: 'TBD' },
                { label: 'Action', value: 'Pending' },
            ],
        },
    },
]

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
]

export default function DataSciencePipeline() {
    const [selectedNode, setSelectedNode] = useState<Node<PipelineStageData> | null>(null)

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">Telco Churn Analysis Pipeline</h1>
                                <p className="text-muted-foreground mt-2">
                                    You're the analytics lead. Marketing claims pricing caused churn. Prove or disprove it.
                                </p>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                Data Science • Pilot Project
                            </Badge>
                        </div>

                        <div className="flex gap-4">
                            <Card className="flex-1">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Decision Impact</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">$2M</p>
                                    <p className="text-xs text-muted-foreground">Pricing reversion cost</p>
                                </CardContent>
                            </Card>

                            <Card className="flex-1">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Pipeline Health</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-red-500">3 Failing</p>
                                    <p className="text-xs text-muted-foreground">Stages need attention</p>
                                </CardContent>
                            </Card>

                            <Card className="flex-1">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Decision Checkpoints</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">4 Pending</p>
                                    <p className="text-xs text-muted-foreground">Require your judgment</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Pipeline Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="h-[800px]">
                                <CardHeader>
                                    <CardTitle>Pipeline Stages</CardTitle>
                                    <CardDescription>
                                        Click on a stage to view details and make decisions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[calc(100%-5rem)]">
                                    <PipelineCanvas
                                        initialNodes={initialNodes}
                                        initialEdges={initialEdges}
                                        onNodeClick={setSelectedNode}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Stage Details Panel */}
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Stage Details</CardTitle>
                                    <CardDescription>
                                        {selectedNode ? selectedNode.data.label : 'Select a stage to view details'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {selectedNode ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold mb-2">Current State</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedNode.data.description}
                                                </p>
                                            </div>

                                            {selectedNode.data.metrics && (
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-2">Metrics</h4>
                                                    <div className="space-y-2">
                                                        {selectedNode.data.metrics.map((metric, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">{metric.label}</span>
                                                                <span className="font-mono font-medium">{metric.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedNode.data.isDecisionPoint && (
                                                <div className="pt-4 border-t">
                                                    <Badge variant="outline" className="mb-3">
                                                        🎯 Decision Checkpoint
                                                    </Badge>
                                                    <Button className="w-full" size="sm">
                                                        Make Decision
                                                    </Button>
                                                </div>
                                            )}

                                            {!selectedNode.data.isDecisionPoint && (
                                                <Button className="w-full" variant="outline" size="sm">
                                                    View Stage Details
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Click on any pipeline stage to view details and make decisions
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
