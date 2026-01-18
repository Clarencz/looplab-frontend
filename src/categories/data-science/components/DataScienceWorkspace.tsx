// Data Science & Analytics Workspace with Pipeline Visualization
// Connected to backend APIs for execution, validation, and AI tutoring

import { useState, useCallback } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'
import { InteractiveAiTutor } from '@/categories/shared/components/InteractiveAiTutor'
import { PipelineCanvas } from '@/components/datascience/PipelineCanvas'
import { PipelineStageData } from '@/components/datascience/PipelineStage'
import { Node, Edge } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    executeCode,
    validateProject,
    createTutoringSession,
    getTutoringStyle,
} from '@/lib/api'

export default function DataScienceWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const navigate = useNavigate()
    const [isExecuting, setIsExecuting] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const [validationResult, setValidationResult] = useState<any>(null)
    const [tutoringSession, setTutoringSession] = useState<any>(null)
    const [tutoringStyle, setTutoringStyle] = useState<any>(null)
    const [selectedStage, setSelectedStage] = useState<Node<PipelineStageData> | null>(null)

    // Pipeline stages for the project
    const [pipelineNodes] = useState<Node<PipelineStageData>[]>([
        {
            id: '1',
            type: 'pipelineStage',
            position: { x: 250, y: 0 },
            data: {
                label: 'Business Question',
                status: 'warning',
                description: 'Define the analytical question',
                isDecisionPoint: true,
            },
        },
        {
            id: '2',
            type: 'pipelineStage',
            position: { x: 250, y: 150 },
            data: {
                label: 'Data Validation',
                status: 'pending',
                description: 'Assess data quality',
            },
        },
        {
            id: '3',
            type: 'pipelineStage',
            position: { x: 250, y: 300 },
            data: {
                label: 'Transformation',
                status: 'pending',
                description: 'Clean and transform data',
            },
        },
        {
            id: '4',
            type: 'pipelineStage',
            position: { x: 250, y: 450 },
            data: {
                label: 'Analysis',
                status: 'pending',
                description: 'Perform analysis',
                isDecisionPoint: true,
            },
        },
    ])

    const [pipelineEdges] = useState<Edge[]>([
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
    ])

    // Validate - routes to DataScienceValidator
    const handleValidate = useCallback(async () => {
        setIsValidating(true)
        try {
            const result = await validateProject({
                userProjectId: projectId,
                categorySlug: category?.slug || 'data-science',
                files: [],
                entryPoint: 'notebook.ipynb',
                language: 'python',
            })
            setValidationResult(result)
        } catch (error) {
            console.error('Validation error:', error)
        } finally {
            setIsValidating(false)
        }
    }, [projectId, category])

    // Start AI tutoring - routes to DataScienceAiTutor
    const handleStartTutoring = useCallback(async () => {
        if (!validationResult) return
        try {
            const [session, style] = await Promise.all([
                createTutoringSession({
                    userProjectId: projectId,
                    categorySlug: category?.slug || 'data-science',
                    files: [],
                }),
                getTutoringStyle(category?.slug || 'data-science'),
            ])
            setTutoringSession(session)
            setTutoringStyle(style)
        } catch (error) {
            console.error('Tutoring error:', error)
        }
    }, [projectId, category, validationResult])

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {category?.name || 'Data Science & Analytics'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" size="sm">Run Analysis</Button>
                    <Button
                        onClick={handleValidate}
                        disabled={isValidating}
                        variant="secondary"
                        size="sm"
                    >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate Pipeline'}
                    </Button>
                    {validationResult && (
                        <Button onClick={handleStartTutoring} variant="outline" size="sm">
                            📊 AI Assistant
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Pipeline Visualization */}
                <div className="w-80 border-r border-border p-4 overflow-y-auto">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-sm">Pipeline Stages</CardTitle>
                            <CardDescription className="text-xs">
                                Track your analytical workflow
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-5rem)]">
                            <PipelineCanvas
                                initialNodes={pipelineNodes}
                                initialEdges={pipelineEdges}
                                onNodeClick={setSelectedStage}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Workspace */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="h-full bg-card rounded-lg border border-border p-6">
                        {selectedStage ? (
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{selectedStage.data.label}</h2>
                                    <p className="text-muted-foreground">{selectedStage.data.description}</p>
                                </div>

                                {selectedStage.data.isDecisionPoint && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                                            🎯 Decision Checkpoint
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This stage requires your judgment and decision-making
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <h3 className="text-sm font-semibold mb-2">Workspace</h3>
                                    <div className="bg-muted/30 rounded-lg p-4 min-h-[400px]">
                                        <p className="text-sm text-muted-foreground">
                                            Stage-specific workspace will appear here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <p className="text-muted-foreground mb-4">
                                        Select a pipeline stage to begin
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm">Pandas</span>
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm">Matplotlib</span>
                                        <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm">Scikit-learn</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {tutoringSession && tutoringStyle && (
                <InteractiveAiTutor
                    session={tutoringSession}
                    style={tutoringStyle}
                    onClose={() => setTutoringSession(null)}
                    onRedo={() => { setTutoringSession(null); setValidationResult(null) }}
                    onComplete={() => setTutoringSession(null)}
                />
            )}
        </div>
    )
}
