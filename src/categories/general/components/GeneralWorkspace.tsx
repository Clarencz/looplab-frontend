// General Workspace (fallback)
// Connected to backend APIs for basic execution and validation

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import type { CategoryWorkspaceProps } from '@/categories/shared/interfaces'
import { executeCode, validateProject } from '@/lib/api'

export default function GeneralWorkspace({ projectId, project, category }: CategoryWorkspaceProps) {
    const [isExecuting, setIsExecuting] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const [output, setOutput] = useState<string[]>([])
    const [validationResult, setValidationResult] = useState<any>(null)

    const handleExecute = useCallback(async () => {
        setIsExecuting(true)
        setOutput([])
        try {
            await executeCode(
                projectId,
                [],
                'main.py',
                'python',
                (log) => setOutput(prev => [...prev, log.message]),
                () => setIsExecuting(false),
                (error) => {
                    console.error('Execution error:', error)
                    setIsExecuting(false)
                }
            )
        } catch (error) {
            console.error('Failed to execute:', error)
            setIsExecuting(false)
        }
    }, [projectId])

    const handleValidate = useCallback(async () => {
        setIsValidating(true)
        try {
            const result = await validateProject({
                userProjectId: projectId,
                categorySlug: category?.slug || 'general',
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

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold">{project.name}</h1>
                    <p className="text-sm text-muted-foreground">{category?.name || 'General'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run'}
                    </button>
                    <button
                        onClick={handleValidate}
                        disabled={isValidating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate'}
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6">
                <div className="h-full bg-card rounded-lg border border-border p-4">
                    <p className="text-muted-foreground">General workspace - Standard IDE</p>

                    {output.length > 0 && (
                        <div className="mt-4 p-3 bg-muted rounded font-mono text-sm">
                            {output.map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    )}

                    {validationResult && (
                        <div className="mt-4 p-3 bg-muted rounded">
                            <h4 className="font-semibold">Validation Result</h4>
                            <p>Score: {validationResult.totalScore}%</p>
                            <p>Status: {validationResult.overallStatus}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
