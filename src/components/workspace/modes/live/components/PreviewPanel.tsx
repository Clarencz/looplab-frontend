import { useEffect, useRef, useState } from 'react';
import { PreviewPanelProps, ConsoleMessage, PreviewMode } from '../types';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

export function PreviewPanel({
    htmlContent,
    cssContent,
    jsContent,
    previewMode,
    onConsoleMessage,
}: PreviewPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(0);

    // Refresh preview when content changes
    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
                // Inject console interceptor
                const consoleScript = `
          <script>
            (function() {
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalError = console.error;
              const originalInfo = console.info;

              function sendToParent(type, args) {
                window.parent.postMessage({
                  type: 'console',
                  level: type,
                  message: Array.from(args).map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                  ).join(' ')
                }, '*');
              }

              console.log = function(...args) {
                sendToParent('log', args);
                originalLog.apply(console, args);
              };

              console.warn = function(...args) {
                sendToParent('warn', args);
                originalWarn.apply(console, args);
              };

              console.error = function(...args) {
                sendToParent('error', args);
                originalError.apply(console, args);
              };

              console.info = function(...args) {
                sendToParent('info', args);
                originalInfo.apply(console, args);
              };

              window.onerror = function(message, source, lineno, colno, error) {
                sendToParent('error', [message + ' at ' + source + ':' + lineno]);
                return false;
              };
            })();
          </script>
        `;

                const fullHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${cssContent}</style>
              ${consoleScript}
            </head>
            <body>
              ${htmlContent}
              <script>${jsContent}</script>
            </body>
          </html>
        `;

                iframeDoc.open();
                iframeDoc.write(fullHtml);
                iframeDoc.close();
            }
        }
    }, [htmlContent, cssContent, jsContent, key]);

    // Listen for console messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'console') {
                const message: ConsoleMessage = {
                    id: uuidv4(),
                    type: event.data.level,
                    message: event.data.message,
                    timestamp: Date.now(),
                };
                onConsoleMessage(message);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onConsoleMessage]);

    const getPreviewWidth = () => {
        switch (previewMode) {
            case 'mobile':
                return '375px';
            case 'tablet':
                return '768px';
            default:
                return '100%';
        }
    };

    return (
        <div className="h-full flex flex-col bg-muted/10">
            <div className="flex items-center justify-center p-2 border-b border-border bg-background/95">
                <div
                    className="bg-background border border-border rounded-lg overflow-hidden transition-all duration-300"
                    style={{ width: getPreviewWidth(), maxWidth: '100%' }}
                >
                    <iframe
                        ref={iframeRef}
                        key={key}
                        className="w-full h-[600px] bg-white"
                        title="Live Preview"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
            </div>
        </div>
    );
}
