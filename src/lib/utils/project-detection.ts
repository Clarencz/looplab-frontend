import type { WorkspaceFile } from '../api/types'

export type Language = 'javascript' | 'typescript' | 'python' | 'rust' | 'go' | 'java' | 'unknown'

/**
 * Detect the primary language of a project based on files
 */
export function detectLanguage(files: WorkspaceFile[]): Language {
    // Check for language-specific config files (highest priority)
    const hasFile = (name: string) => findFile(files, name) !== null

    if (hasFile('package.json')) return 'javascript'
    if (hasFile('Cargo.toml')) return 'rust'
    if (hasFile('go.mod')) return 'go'
    if (hasFile('requirements.txt') || hasFile('setup.py')) return 'python'
    if (hasFile('pom.xml') || hasFile('build.gradle')) return 'java'

    // Check file extensions (fallback)
    const extensions = getAllExtensions(files)

    if (extensions.has('ts') || extensions.has('tsx')) return 'typescript'
    if (extensions.has('js') || extensions.has('jsx')) return 'javascript'
    if (extensions.has('py')) return 'python'
    if (extensions.has('rs')) return 'rust'
    if (extensions.has('go')) return 'go'
    if (extensions.has('java')) return 'java'

    return 'unknown'
}

/**
 * Detect the entry point file for a project
 * Priority: 1) .looplab.json config, 2) Common patterns, 3) First source file
 */
export function detectEntryPoint(files: WorkspaceFile[], language: Language): string | null {
    // 1. Check for .looplab.json config file
    const configFile = findFile(files, '.looplab.json')
    if (configFile?.content) {
        try {
            const config = JSON.parse(configFile.content)
            if (config.entryPoint) {
                return config.entryPoint
            }
        } catch (e) {
            // Invalid JSON, continue to patterns
        }
    }

    // 2. Try common entry point patterns
    const patterns = getEntryPointPatterns(language)
    for (const pattern of patterns) {
        if (findFile(files, pattern)) {
            return pattern
        }
    }

    // 3. Fallback: find first source file of the right extension
    return findFirstSourceFile(files, language)
}

/**
 * Get common entry point patterns for a language
 */
function getEntryPointPatterns(language: Language): string[] {
    switch (language) {
        case 'python':
            return ['main.py', 'app.py', '__main__.py', 'run.py', 'server.py', 'src/main.py', 'src/app.py']
        case 'javascript':
            return ['index.js', 'src/index.js', 'app.js', 'server.js', 'main.js']
        case 'typescript':
            return ['index.ts', 'src/index.ts', 'app.ts', 'server.ts', 'main.ts']
        case 'rust':
            return ['src/main.rs', 'main.rs']
        case 'go':
            return ['main.go', 'cmd/main.go']
        case 'java':
            return ['src/Main.java', 'Main.java', 'src/main/java/Main.java']
        default:
            return ['index.js', 'main.py', 'main.rs', 'main.go']
    }
}

/**
 * Find first source file of the right type (excluding tests)
 */
function findFirstSourceFile(files: WorkspaceFile[], language: Language): string | null {
    const ext = getExtension(language)
    if (!ext) return null

    const extension = ext // Capture for TypeScript narrowing

    // Recursively search for first matching file
    function searchFiles(fileList: WorkspaceFile[], path: string = ''): string | null {
        for (const file of fileList) {
            const fullPath = path ? `${path}/${file.name}` : file.name

            if (file.type === 'file') {
                // Match extension and exclude tests
                if (file.name.endsWith(extension) &&
                    !file.name.includes('test') &&
                    !file.name.includes('.spec.') &&
                    !fullPath.includes('/test/')) {
                    return fullPath
                }
            }

            if (file.type === 'folder' && file.children) {
                const found = searchFiles(file.children, fullPath)
                if (found) return found
            }
        }
        return null
    }

    return searchFiles(files)
}

/**
 * Get file extension for a language
 */
function getExtension(language: Language): string | null {
    switch (language) {
        case 'python': return '.py'
        case 'javascript': return '.js'
        case 'typescript': return '.ts'
        case 'rust': return '.rs'
        case 'go': return '.go'
        case 'java': return '.java'
        default: return null
    }
}

/**
 * Find a file by path in the workspace file tree
 */
function findFile(files: WorkspaceFile[], path: string): WorkspaceFile | null {
    const parts = path.split('/')
    let current = files

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const found = current.find(f => f.name === part)

        if (!found) return null

        if (i === parts.length - 1) {
            return found.type === 'file' ? found : null
        }

        if (found.type === 'folder' && found.children) {
            current = found.children
        } else {
            return null
        }
    }

    return null
}

/**
 * Get all file extensions in the workspace
 */
function getAllExtensions(files: WorkspaceFile[]): Set<string> {
    const extensions = new Set<string>()

    function traverse(fileList: WorkspaceFile[]) {
        for (const file of fileList) {
            if (file.type === 'file') {
                const ext = file.name.split('.').pop()
                if (ext && ext !== file.name) {
                    extensions.add(ext)
                }
            }
            if (file.type === 'folder' && file.children) {
                traverse(file.children)
            }
        }
    }

    traverse(files)
    return extensions
}
