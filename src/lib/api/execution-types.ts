// Execution types for code execution feature
export interface ExecutionLog {
    timestamp: string
    level: 'info' | 'error' | 'output'
    message: string
}

export interface ExecuteCodeRequest {
    files: WorkspaceFile[]
    entryPoint: string
    language: string
}


