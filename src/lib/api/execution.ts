import type { WorkspaceFile } from './types'
import type { ExecutionLog, ExecuteCodeRequest } from './execution-types'
import { getConfig } from '../config/env'

/**
 * Get the main file content from workspace files
 */
function getMainFileContent(files: WorkspaceFile[], entryPoint: string): string {
    const findFile = (files: WorkspaceFile[], path: string): string | null => {
        for (const file of files) {
            if (file.type === 'file' && file.name === path) {
                return file.content || ''
            }
            if (file.type === 'folder' && file.children) {
                const found = findFile(file.children, path)
                if (found !== null) return found
            }
        }
        return null
    }
    return findFile(files, entryPoint) || ''
}

/**
 * Execute code using the backend Python execution endpoint
 */
export async function executeCode(
    userProjectId: string,
    files: WorkspaceFile[],
    entryPoint: string,
    language: string,
    onLog: (log: ExecutionLog) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): Promise<() => void> {
    const apiConfig = getConfig().api
    const token = localStorage.getItem('access_token')

    // Get the code from the entry point file
    const code = getMainFileContent(files, entryPoint)

    if (!code) {
        onError(new Error(`Could not find entry point file: ${entryPoint}`))
        return () => { }
    }

    const controller = new AbortController()

    try {
        onLog({
            level: 'info',
            message: `Running ${entryPoint}...`,
            timestamp: Date.now()
        })

        const response = await fetch(
            `${apiConfig.baseUrl}/projects/${userProjectId}/run`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    code,
                    language,
                }),
                signal: controller.signal,
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }))
            throw new Error(errorData.message || `Execution failed: ${response.statusText}`)
        }

        const result = await response.json()

        // Log the output
        if (result.output) {
            const lines = result.output.split('\n')
            for (const line of lines) {
                if (line.trim()) {
                    onLog({
                        level: result.exitCode === 0 ? 'info' : 'error',
                        message: line,
                        timestamp: Date.now()
                    })
                }
            }
        }

        // Log execution time
        onLog({
            level: 'info',
            message: `Execution completed in ${result.executionTimeMs}ms`,
            timestamp: Date.now()
        })

        if (result.timedOut) {
            onLog({
                level: 'warning',
                message: '⏱️ Execution timed out (5 second limit)',
                timestamp: Date.now()
            })
        }

        onComplete()
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            onLog({
                level: 'warning',
                message: 'Execution cancelled',
                timestamp: Date.now()
            })
        } else {
            onError(error instanceof Error ? error : new Error('Unknown error'))
        }
    }

    // Return cancel function
    return () => {
        controller.abort()
    }
}
