// Finance & Economics Workspace
// Connected to backend APIs with financial chart support

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'
import { InteractiveAiTutor } from '@/categories/shared/components/InteractiveAiTutor'
import { validateProject, createTutoringSession, getTutoringStyle } from '@/lib/api'

export default function FinanceWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const [isValidating, setIsValidating] = useState(false)
    const [validationResult, setValidationResult] = useState<any>(null)
    const [tutoringSession, setTutoringSession] = useState<any>(null)
    const [tutoringStyle, setTutoringStyle] = useState<any>(null)

    // Validate - routes to FinanceValidator
    const handleValidate = useCallback(async () => {
        setIsValidating(true)
        try {
            const result = await validateProject({
                userProjectId: projectId,
                categorySlug: category?.slug || 'finance',
                files: [],
                entryPoint: 'main.py',
                language: 'python',
            })
            setValidationResult(result)
        } catch (error) {
            console.error('Validation error:', error)
        } finally {
            setIsValidating(false)
        }
    }, [projectId, category])

    // Start AI tutoring - routes to FinanceAiTutor
    const handleStartTutoring = useCallback(async () => {
        if (!validationResult) return
        try {
            const [session, style] = await Promise.all([
                createTutoringSession({
                    userProjectId: projectId,
                    categorySlug: category?.slug || 'finance',
                    files: [],
                }),
                getTutoringStyle(category?.slug || 'finance'),
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
                <div>
                    <h1 className="text-xl font-bold">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">{category?.name || 'Finance & Economics'}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg">Run</button>
                    <button
                        onClick={handleValidate}
                        disabled={isValidating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                    </button>
                    {validationResult && (
                        <button onClick={handleStartTutoring} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                            💹 AI Assistance
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex">
                <div className="flex-1 p-6">
                    <div className="h-full bg-card rounded-lg border border-border p-4">
                        <p className="text-muted-foreground">Finance workspace with candlestick charts and time series</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Candlestick Charts</span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Time Series</span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Portfolio Analysis</span>
                        </div>
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
