import type { WorkspaceFile } from './types'
import type { ExecutionLog, ExecuteCodeRequest } from './execution-types'
import { getConfig } from '../config/env'

/**
 * Execute code and stream logs in real-time via Server-Sent Events
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

    const requestBody: ExecuteCodeRequest = {
        files,
        entryPoint,
        language,
    }

    // Use fetch with streaming response
    const controller = new AbortController()

    try {
        const response = await fetch(
            `${apiConfig.baseUrl}/user-projects/${userProjectId}/execute`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            }
        )

        if (!response.ok) {
            throw new Error(`Execution failed: ${response.statusText}`)
        }

        if (!response.body) {
            throw new Error('No response body')
        }

        // Read SSE stream
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        const readStream = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read()

                    if (done) {
                        onComplete()
                        break
                    }

                    const chunk = decoder.decode(value, { stream: true })
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6)
                            if (data === 'keep-alive') continue

                            try {
                                const log: ExecutionLog = JSON.parse(data)
                                onLog(log)
                            } catch (e) {
                                console.error('Failed to parse log:', e)
                            }
                        }
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    onError(error)
                }
            }
        }

        readStream()

        // Return cancel function
        return () => {
            controller.abort()
            reader.cancel()
        }
    } catch (error) {
        onError(error instanceof Error ? error : new Error('Unknown error'))
        return () => { } // No-op cancel function
    }
}
