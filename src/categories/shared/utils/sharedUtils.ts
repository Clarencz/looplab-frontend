// Shared utilities for category services
// Import these in category-specific services

// --- Language Configuration ---
export type Language =
    | 'python'
    | 'javascript'
    | 'typescript'
    | 'rust'
    | 'go'
    | 'java'
    | 'cpp'
    | 'c'
    | 'ruby'
    | 'sql'

export const LANGUAGE_EXTENSIONS: Record<Language, string> = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    rust: 'rs',
    go: 'go',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    ruby: 'rb',
    sql: 'sql',
}

export const LANGUAGE_NAMES: Record<Language, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    rust: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    ruby: 'Ruby',
    sql: 'SQL',
}

// --- File Utilities ---
export function getLanguageFromExtension(ext: string): Language | null {
    const extLower = ext.toLowerCase().replace('.', '')
    for (const [lang, extension] of Object.entries(LANGUAGE_EXTENSIONS)) {
        if (extension === extLower) {
            return lang as Language
        }
    }
    return null
}

export function getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
}

export function isTestFile(filename: string, language: Language): boolean {
    const lower = filename.toLowerCase()
    const patterns = TEST_FILE_PATTERNS[language] || []
    return patterns.some(p => lower.includes(p))
}

// --- Test File Patterns ---
export const TEST_FILE_PATTERNS: Record<Language, string[]> = {
    python: ['test_', '_test.py', 'tests.py'],
    javascript: ['.test.js', '.spec.js', '__tests__'],
    typescript: ['.test.ts', '.spec.ts', '__tests__'],
    rust: ['_test.rs', 'tests/'],
    go: ['_test.go'],
    java: ['Test.java', 'Tests.java'],
    cpp: ['_test.cpp', 'test_'],
    c: ['_test.c', 'test_'],
    ruby: ['_spec.rb', '_test.rb'],
    sql: ['_test.sql'],
}

// --- Category Colors ---
export const CATEGORY_COLORS: Record<string, string> = {
    algorithms: '#6366f1', // Indigo
    programming: '#10b981', // Green
    'data-science': '#f59e0b', // Amber
    math: '#8b5cf6', // Purple
    finance: '#22c55e', // Green
    general: '#64748b', // Slate
}

export const CATEGORY_EMOJIS: Record<string, string> = {
    algorithms: '🧮',
    programming: '👨‍💻',
    'data-science': '📊',
    math: '📐',
    finance: '💹',
    general: '📚',
}

// --- Execution Timeouts ---
export const DEFAULT_TIMEOUTS: Record<Language, number> = {
    python: 30000,
    javascript: 30000,
    typescript: 30000,
    rust: 60000, // Compilation + run
    go: 30000,
    java: 60000, // JVM startup
    cpp: 45000, // Compilation
    c: 45000,
    ruby: 30000,
    sql: 15000,
}
