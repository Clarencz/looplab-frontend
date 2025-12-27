import type { ICategoryExecutor, ExecutionContext, ExecutionResult } from '@/categories/shared/interfaces'
import { executeCode } from '@/lib/api/execution'
import type { ExecutionLog } from '@/lib/api/execution-types'

/**
 * Algorithms category executor
 * Handles execution for algorithm projects with test cases
 */
export class AlgorithmsExecutor implements ICategoryExecutor {
    private abortController: AbortController | null = null

    async execute(context: ExecutionContext): Promise<ExecutionResult> {
        const logs: ExecutionLog[] = []
        let output = ''
        let exitCode = 0
        const startTime = Date.now()

        return new Promise((resolve, reject) => {
            const cancelFn = executeCode(
                context.userProjectId,
                context.files,
                context.entryPoint,
                context.language,
                (log) => {
                    logs.push(log)
                    output += log.message + '\n'
                    if (log.type === 'stderr') {
                        exitCode = 1
                    }
                },
                () => {
                    // Execution complete
                    const executionTime = Date.now() - startTime
                    resolve({
                        output: output.trim(),
                        exitCode,
                        executionTime,
                        success: exitCode === 0,
                        logs,
                    })
                },
                (error) => {
                    reject(error)
                }
            )

            this.abortController = { abort: cancelFn } as any
        })
    }

    cancel(): void {
        if (this.abortController) {
            this.abortController.abort()
            this.abortController = null
        }
    }

    supportsLanguage(language: string): boolean {
        // Algorithms typically support these languages
        return ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'rust', 'go'].includes(language.toLowerCase())
    }
}
