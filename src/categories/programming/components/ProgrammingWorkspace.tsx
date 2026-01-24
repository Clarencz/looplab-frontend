// Programming & Software Workspace
// Connected to backend APIs for execution, validation, and AI tutoring

import { useState, useCallback } from 'react'
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

// Local components
import { ProgrammingWorkspaceHeader } from './ProgrammingWorkspaceHeader'
import { ExecutionOutputPanel } from './ExecutionOutputPanel'
import { ValidationSummary } from './ValidationSummary'

interface WorkspaceState {
    isExecuting: boolean
    isValidating: boolean
    isTutoring: boolean
    executionOutput: string[]
    validationResult: ValidationResult | null
    tutoringSession: TutoringSession | null
    tutoringStyle: TutoringStyle | null
}

export default function ProgrammingWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const [state, setState] = useState<WorkspaceState>({
        isExecuting: false,
        isValidating: false,
        isTutoring: false,
        executionOutput: [],
        validationResult: null,
        tutoringSession: null,
        tutoringStyle: null,
    })

    // Execute code
    const handleExecute = useCallback(async () => {
        // TODO: Get actual files from editor state
        const files: { path: string; content: string }[] = []
        const entryPoint = 'main.py'
        const language = 'python'

        setState(prev => ({ ...prev, isExecuting: true, executionOutput: [] }))

        try {
            await executeCode(
                projectId,
                files, // In a real app we'd pass actual file content here
                entryPoint,
                language,
                (log) => {
                    setState(prev => ({ ...prev, executionOutput: [...prev.executionOutput, log.message] }))
                },
                () => setState(prev => ({ ...prev, isExecuting: false })),
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

    // Validate project - routes to ProgrammingValidator
    const handleValidate = useCallback(async () => {
        // TODO: Get actual files from editor state
        const files: { path: string; content: string }[] = []
        const entryPoint = 'main.py'
        const language = 'python'

        setState(prev => ({ ...prev, isValidating: true }))

        try {
            const result = await validateProject({
                userProjectId: projectId,
                categorySlug: category?.slug || 'programming',
                files,
                entryPoint,
                language,
            })

            setState(prev => ({ ...prev, isValidating: false, validationResult: result }))
        } catch (error) {
            console.error('Validation error:', error)
            setState(prev => ({ ...prev, isValidating: false }))
        }
    }, [projectId, category])

    // Start AI tutoring - routes to ProgrammingAiTutor
    const handleStartTutoring = useCallback(async () => {
        if (!state.validationResult) return

        // TODO: Get actual files from editor state
        const files: { path: string; content: string }[] = []

        setState(prev => ({ ...prev, isTutoring: true }))

        try {
            const [session, style] = await Promise.all([
                createTutoringSession({
                    userProjectId: projectId,
                    categorySlug: category?.slug || 'programming',
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
                getTutoringStyle(category?.slug || 'programming'),
            ])

            setState(prev => ({ ...prev, tutoringSession: session, tutoringStyle: style }))
        } catch (error) {
            console.error('Tutoring error:', error)
            setState(prev => ({ ...prev, isTutoring: false }))
        }
    }, [projectId, category, state.validationResult])

    const handleCloseTutor = useCallback(() => {
        setState(prev => ({ ...prev, isTutoring: false, tutoringSession: null }))
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
            <ProgrammingWorkspaceHeader
                project={project}
                category={category}
                state={state}
                onExecute={handleExecute}
                onValidate={handleValidate}
                onStartTutoring={handleStartTutoring}
                hasValidationResult={!!state.validationResult}
            />

            <div className="flex-1 flex">
                <div className="flex-1 p-6">
                    <div className="h-full bg-card rounded-lg border border-border p-4">
                        <p className="text-muted-foreground">
                            Programming workspace - Full IDE with Monaco editor, file tree, terminal, and build tools
                        </p>

                        <ExecutionOutputPanel output={state.executionOutput} />

                        {state.validationResult && (
                            <ValidationSummary result={state.validationResult} />
                        )}
                    </div>
                </div>
            </div>

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
