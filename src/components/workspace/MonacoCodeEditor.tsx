import { useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import type { editor } from "monaco-editor"

interface MonacoEditorProps {
    value: string
    onChange: (value: string) => void
    language: string
    readOnly?: boolean
}

export const MonacoCodeEditor = ({ value, onChange, language, readOnly = false }: MonacoEditorProps) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor

        // Focus editor on mount
        editor.focus()
    }

    const handleEditorChange = (value: string | undefined) => {
        onChange(value || "")
    }

    // Get language from file extension
    const getLanguage = (lang: string): string => {
        const languageMap: Record<string, string> = {
            js: "javascript",
            jsx: "javascript",
            ts: "typescript",
            tsx: "typescript",
            json: "json",
            html: "html",
            css: "css",
            scss: "scss",
            py: "python",
            rs: "rust",
            go: "go",
            java: "java",
            cpp: "cpp",
            c: "c",
            md: "markdown",
            yaml: "yaml",
            yml: "yaml",
            xml: "xml",
            sql: "sql",
            sh: "shell",
            bash: "shell",
        }
        return languageMap[lang.toLowerCase()] || "plaintext"
    }

    return (
        <Editor
            height="100%"
            language={getLanguage(language)}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
                readOnly,
                minimap: { enabled: true },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: "on",
                rulers: [80, 120],
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
                formatOnType: true,
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: true,
                folding: true,
                foldingStrategy: "indentation",
                showFoldingControls: "always",
                matchBrackets: "always",
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                autoIndent: "full",
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnCommitCharacter: true,
                snippetSuggestions: "inline",
                padding: { top: 16, bottom: 16 },
            }}
        />
    )
}
