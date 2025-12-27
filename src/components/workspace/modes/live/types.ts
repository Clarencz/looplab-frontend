// Live Preview workspace types and interfaces

export type FileType = 'html' | 'css' | 'javascript';
export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface LiveFile {
    name: string;
    type: FileType;
    content: string;
}

export interface ConsoleMessage {
    id: string;
    type: 'log' | 'warn' | 'error' | 'info';
    message: string;
    timestamp: number;
}

export interface LivePreviewState {
    files: LiveFile[];
    activeFile: string | null;
    previewMode: PreviewMode;
    consoleMessages: ConsoleMessage[];
    isAutoRefresh: boolean;
}

export interface PreviewPanelProps {
    htmlContent: string;
    cssContent: string;
    jsContent: string;
    previewMode: PreviewMode;
    onConsoleMessage: (message: ConsoleMessage) => void;
}

export interface ConsolePanelProps {
    messages: ConsoleMessage[];
    onClear: () => void;
}

export interface FileTabsProps {
    files: LiveFile[];
    activeFile: string | null;
    onFileSelect: (fileName: string) => void;
    onFileAdd: (type: FileType) => void;
}
