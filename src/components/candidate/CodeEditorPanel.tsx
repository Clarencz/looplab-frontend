import Editor from '@monaco-editor/react';

interface CodeEditorPanelProps {
    filename: string;
    content: string;
    onChange: (filename: string, value: string | undefined) => void;
}

export default function CodeEditorPanel({ filename, content, onChange }: CodeEditorPanelProps) {
    const getLanguage = (file: string): string => {
        if (file.endsWith('.py')) return 'python';
        if (file.endsWith('.js')) return 'javascript';
        if (file.endsWith('.ts') || file.endsWith('.tsx')) return 'typescript';
        if (file.endsWith('.json')) return 'json';
        if (file.endsWith('.html')) return 'html';
        if (file.endsWith('.css')) return 'css';
        if (file.endsWith('.md')) return 'markdown';
        return 'plaintext';
    };

    return (
        <div className="flex-1 min-h-0">
            <Editor
                height="100%"
                language={getLanguage(filename)}
                value={content}
                onChange={(value) => onChange(filename, value)}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                }}
            />
        </div>
    );
}
