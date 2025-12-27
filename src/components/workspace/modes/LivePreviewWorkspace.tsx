/**
 * LivePreviewWorkspace - Real-time web preview
 * 
 * Features:
 * - HTML/CSS/JS editor
 * - Live iframe preview
 * - Console output capture
 * - Responsive preview modes
 * - Hot reload
 */

import { useState, useCallback, useEffect } from 'react';
import { WorkspaceModeProps } from '../../types';
import { LivePreviewState, LiveFile, ConsoleMessage, PreviewMode, FileType } from './types';
import CodeEditor from '@/components/workspace/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ConsolePanel } from './components/ConsolePanel';
import { PreviewControls } from './components/PreviewControls';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LivePreviewWorkspace({ projectId, project, category }: WorkspaceModeProps) {
    const [state, setState] = useState<LivePreviewState>({
        files: getDefaultFiles(),
        activeFile: 'index.html',
        previewMode: 'desktop',
        consoleMessages: [],
        isAutoRefresh: true,
    });

    const [refreshKey, setRefreshKey] = useState(0);

    // Get active file content
    const activeFileContent = state.files.find(f => f.name === state.activeFile)?.content || '';

    // Get file contents by type
    const htmlContent = state.files.find(f => f.type === 'html')?.content || '';
    const cssContent = state.files.find(f => f.type === 'css')?.content || '';
    const jsContent = state.files.find(f => f.type === 'javascript')?.content || '';

    // Handle file content change
    const handleContentChange = useCallback((content: string) => {
        setState(prev => ({
            ...prev,
            files: prev.files.map(f =>
                f.name === prev.activeFile ? { ...f, content } : f
            ),
        }));
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback((fileName: string) => {
        setState(prev => ({ ...prev, activeFile: fileName }));
    }, []);

    // Handle preview mode change
    const handlePreviewModeChange = useCallback((mode: PreviewMode) => {
        setState(prev => ({ ...prev, previewMode: mode }));
    }, []);

    // Handle auto refresh toggle
    const handleAutoRefreshToggle = useCallback(() => {
        setState(prev => ({ ...prev, isAutoRefresh: !prev.isAutoRefresh }));
    }, []);

    // Handle manual refresh
    const handleManualRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // Handle console message
    const handleConsoleMessage = useCallback((message: ConsoleMessage) => {
        setState(prev => ({
            ...prev,
            consoleMessages: [...prev.consoleMessages, message],
        }));
    }, []);

    // Clear console
    const handleClearConsole = useCallback(() => {
        setState(prev => ({ ...prev, consoleMessages: [] }));
    }, []);

    // Auto refresh on content change
    useEffect(() => {
        if (state.isAutoRefresh) {
            const timeoutId = setTimeout(() => {
                setRefreshKey(prev => prev + 1);
            }, 500); // Debounce 500ms

            return () => clearTimeout(timeoutId);
        }
    }, [htmlContent, cssContent, jsContent, state.isAutoRefresh]);

    // Get language for active file
    const getLanguage = (fileName: string): string => {
        if (fileName.endsWith('.html')) return 'html';
        if (fileName.endsWith('.css')) return 'css';
        if (fileName.endsWith('.js')) return 'javascript';
        return 'plaintext';
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-lg font-semibold">Live Preview</h2>
            </div>

            {/* Preview Controls */}
            <PreviewControls
                previewMode={state.previewMode}
                onPreviewModeChange={handlePreviewModeChange}
                isAutoRefresh={state.isAutoRefresh}
                onAutoRefreshToggle={handleAutoRefreshToggle}
                onManualRefresh={handleManualRefresh}
            />

            {/* Main content */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                    {/* Code Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="h-full flex flex-col">
                            <Tabs value={state.activeFile} onValueChange={handleFileSelect} className="flex-1 flex flex-col">
                                <TabsList className="w-full justify-start rounded-none border-b">
                                    {state.files.map((file) => (
                                        <TabsTrigger key={file.name} value={file.name} className="gap-2">
                                            {file.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {state.files.map((file) => (
                                    <TabsContent
                                        key={file.name}
                                        value={file.name}
                                        className="flex-1 m-0 overflow-hidden"
                                    >
                                        <CodeEditor
                                            value={file.content}
                                            onChange={handleContentChange}
                                            language={getLanguage(file.name)}
                                            height="100%"
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* Preview and Console */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <ResizablePanelGroup direction="vertical">
                            {/* Preview */}
                            <ResizablePanel defaultSize={70} minSize={40}>
                                <PreviewPanel
                                    key={refreshKey}
                                    htmlContent={htmlContent}
                                    cssContent={cssContent}
                                    jsContent={jsContent}
                                    previewMode={state.previewMode}
                                    onConsoleMessage={handleConsoleMessage}
                                />
                            </ResizablePanel>

                            <ResizableHandle />

                            {/* Console */}
                            <ResizablePanel defaultSize={30} minSize={20}>
                                <ConsolePanel
                                    messages={state.consoleMessages}
                                    onClear={handleClearConsole}
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

// Default files
function getDefaultFiles(): LiveFile[] {
    return [
        {
            name: 'index.html',
            type: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Live Preview!</h1>
        <p>Edit the HTML, CSS, and JavaScript to see changes in real-time.</p>
        <button id="clickBtn">Click Me!</button>
        <p id="output"></p>
    </div>
</body>
</html>`,
        },
        {
            name: 'styles.css',
            type: 'css',
            content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    text-align: center;
}

h1 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 2.5rem;
}

p {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
}

button:hover {
    transform: scale(1.05);
}

#output {
    margin-top: 20px;
    font-weight: bold;
    color: #667eea;
}`,
        },
        {
            name: 'script.js',
            type: 'javascript',
            content: `// Welcome to Live Preview!
console.log('JavaScript is running!');

const button = document.getElementById('clickBtn');
const output = document.getElementById('output');

let clickCount = 0;

button.addEventListener('click', () => {
    clickCount++;
    output.textContent = \`Button clicked \${clickCount} time\${clickCount !== 1 ? 's' : ''}!\`;
    console.log('Button clicked:', clickCount);
});

console.info('Try clicking the button!');`,
        },
    ];
}
