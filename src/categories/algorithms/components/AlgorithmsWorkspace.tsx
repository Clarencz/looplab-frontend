// Algorithms & Problem Solving Workspace
// Connected to backend APIs for execution, validation, and AI tutoring

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'
import { InteractiveAiTutor } from '@/categories/shared/components/InteractiveAiTutor'
import {
    executeCode,
    validateProject,
    createTutoringSession,
    getTutoringStyle,
    type TutoringSession,
    type TutoringStyle,
    type ValidationResult,
} from '@/lib/api'

interface WorkspaceState {
    isExecuting: boolean
    isValidating: boolean
    isTutoring: boolean
    executionOutput: string[]
    validationResult: ValidationResult | null
    tutoringSession: TutoringSession | null
    tutoringStyle: TutoringStyle | null
}

export default function AlgorithmsWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const [state, setState] = useState<WorkspaceState>({
        isExecuting: false,
        isValidating: false,
        isTutoring: false,
        executionOutput: [],
        validationResult: null,
        tutoringSession: null,
        tutoringStyle: null,
    })

    // Execute code - streams output via SSE
    const handleExecute = useCallback(async (files: { path: string; content: string }[], entryPoint: string, language: string) => {
        setState(prev => ({ ...prev, isExecuting: true, executionOutput: [] }))

        try {
            await executeCode(
                projectId,
                files.map(f => ({ path: f.path, content: f.content })),
                entryPoint,
                language,
                (log) => {
                    setState(prev => ({ ...prev, executionOutput: [...prev.executionOutput, log.message] }))
                },
                () => {
                    setState(prev => ({ ...prev, isExecuting: false }))
                },
                (error) => {
                    console.error('Execution error:', error)
                    setState(prev => ({ ...prev, isExecuting: false }))
                }
            )
        } catch (error) {
            console.error('Failed to execute:', error)
            setState(prev => ({ ...prev, isExecuting: false }))
        }
    }, [projectId])

    // Validate project - routes to AlgorithmsValidator
    const handleValidate = useCallback(async (files: { path: string; content: string }[], entryPoint: string, language: string) => {
        setState(prev => ({ ...prev, isValidating: true }))

        try {
            const result = await validateProject({
                userProjectId: projectId,
                categorySlug: category?.slug || 'algorithms',
                files,
                entryPoint,
                language,
            })

            setState(prev => ({
                ...prev,
                isValidating: false,
                validationResult: result,
            }))
        } catch (error) {
            console.error('Validation error:', error)
            setState(prev => ({ ...prev, isValidating: false }))
        }
    }, [projectId, category])

    // Start AI tutoring session - routes to AlgorithmsAiTutor
    const handleStartTutoring = useCallback(async (files: { path: string; content: string }[]) => {
        if (!state.validationResult) return

        setState(prev => ({ ...prev, isTutoring: true }))

        try {
            const [session, style] = await Promise.all([
                createTutoringSession({
                    userProjectId: projectId,
                    categorySlug: category?.slug || 'algorithms',
                    files,
                    validationResult: {
                        passed: state.validationResult.overallStatus === 'passed',
                        score: state.validationResult.totalScore,
                        stages: state.validationResult.stages.map(s => ({
                            name: s.name,
                            status: s.status,
                            message: s.message,
                        })),
                    },
                }),
                getTutoringStyle(category?.slug || 'algorithms'),
            ])

            setState(prev => ({
                ...prev,
                tutoringSession: session,
                tutoringStyle: style,
            }))
        } catch (error) {
            console.error('Tutoring error:', error)
            setState(prev => ({ ...prev, isTutoring: false }))
        }
    }, [projectId, category, state.validationResult])

    const handleCloseTutor = useCallback(() => {
        setState(prev => ({
            ...prev,
            isTutoring: false,
            tutoringSession: null
        }))
    }, [])

    const handleRedoProject = useCallback(() => {
        setState(prev => ({
            ...prev,
            isTutoring: false,
            tutoringSession: null,
            validationResult: null,
            executionOutput: [],
        }))
    }, [])

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {category?.name || 'Algorithms & Problem Solving'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExecute([], 'main.py', 'python')}
                        disabled={state.isExecuting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {state.isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
                    </button>
                    <button
                        onClick={() => handleValidate([], 'main.py', 'python')}
                        disabled={state.isValidating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {state.isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                    </button>
                    {state.validationResult && (
                        <button
                            onClick={() => handleStartTutoring([])}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                        >
                            🧮 AI Assistance
                        </button>
                    )}
                </div>
            </header>

            {/* Main workspace area */}
            <div className="flex-1 flex">
                <div className="flex-1 p-6">
                    <div className="h-full bg-card rounded-lg border border-border p-4">
                        <p className="text-muted-foreground">
                            Algorithms workspace - Monaco editor, file tree, and terminal will be integrated here
                        </p>

                        {/* Execution output */}
                        {state.executionOutput.length > 0 && (
                            <div className="mt-4 p-3 bg-muted rounded font-mono text-sm">
                                {state.executionOutput.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        )}

                        {/* Validation result */}
                        {state.validationResult && (
                            <div className="mt-4 p-3 bg-muted rounded">
                                <h4 className="font-semibold">Validation Result</h4>
                                <p>Score: {state.validationResult.totalScore}%</p>
                                <p>Status: {state.validationResult.overallStatus}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Tutor overlay */}
            {state.tutoringSession && state.tutoringStyle && (
                <InteractiveAiTutor
                    session={state.tutoringSession}
                    style={state.tutoringStyle}
                    onClose={handleCloseTutor}
                    onRedo={handleRedoProject}
                    onComplete={handleCloseTutor}
                />
            )}
        </div>
    )
}
