import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface IntegratedTerminalProps {
    projectId: string;
    onClose: () => void;
}

export default function IntegratedTerminal({ projectId, onClose }: IntegratedTerminalProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm.js
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
                cursor: '#ffffff',
                black: '#000000',
                red: '#cd3131',
                green: '#0dbc79',
                yellow: '#e5e510',
                blue: '#2472c8',
                magenta: '#bc3fbc',
                cyan: '#11a8cd',
                white: '#e5e5e5',
                brightBlack: '#666666',
                brightRed: '#f14c4c',
                brightGreen: '#23d18b',
                brightYellow: '#f5f543',
                brightBlue: '#3b8eea',
                brightMagenta: '#d670d6',
                brightCyan: '#29b8db',
                brightWhite: '#e5e5e5',
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Welcome message
        term.writeln('\x1b[1;32m╔═══════════════════════════════════════╗\x1b[0m');
        term.writeln('\x1b[1;32m║   LoopLab Integrated Terminal        ║\x1b[0m');
        term.writeln('\x1b[1;32m╚═══════════════════════════════════════╝\x1b[0m');
        term.writeln('');
        term.writeln('\x1b[1;33mProject Terminal\x1b[0m - Run commands for your project');
        term.writeln('');
        term.write('$ ');

        // Simple command handling (mock for now)
        let currentLine = '';
        term.onData((data) => {
            const code = data.charCodeAt(0);

            if (code === 13) {
                // Enter key
                term.write('\r\n');
                handleCommand(currentLine.trim(), term);
                currentLine = '';
                term.write('$ ');
            } else if (code === 127) {
                // Backspace
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    term.write('\b \b');
                }
            } else if (code >= 32) {
                // Printable character
                currentLine += data;
                term.write(data);
            }
        });

        // Handle window resize
        const handleResize = () => {
            fitAddon.fit();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleCommand = (command: string, term: Terminal) => {
        if (!command) return;

        // Simple command handling (can be extended to use WebSocket for real shell)
        switch (command.toLowerCase()) {
            case 'clear':
                term.clear();
                break;
            case 'help':
                term.writeln('\x1b[1;36mAvailable commands:\x1b[0m');
                term.writeln('  clear  - Clear the terminal');
                term.writeln('  help   - Show this help message');
                term.writeln('  pwd    - Print working directory');
                term.writeln('  ls     - List files');
                term.writeln('');
                break;
            case 'pwd':
                term.writeln(`/projects/${projectId}`);
                break;
            case 'ls':
                term.writeln('\x1b[1;34mproject files would be listed here\x1b[0m');
                term.writeln('');
                break;
            default:
                if (command.startsWith('echo ')) {
                    term.writeln(command.substring(5));
                } else {
                    term.writeln(`\x1b[1;31mCommand not found: ${command}\x1b[0m`);
                    term.writeln('\x1b[90mType "help" for available commands\x1b[0m');
                }
                break;
        }
    };

    const clearTerminal = () => {
        if (xtermRef.current) {
            xtermRef.current.clear();
            xtermRef.current.write('$ ');
        }
    };

    return (
        <div
            className={`bg-gray-900 border-t border-gray-700 flex flex-col transition-all ${isMaximized ? 'fixed inset-0 z-50' : 'h-64'
                }`}
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-200">Terminal</span>
                    <span className="text-xs text-gray-500">Project: {projectId}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={clearTerminal}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Clear Terminal"
                    >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title={isMaximized ? 'Minimize' : 'Maximize'}
                    >
                        {isMaximized ? (
                            <Minimize2 className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Maximize2 className="h-4 w-4 text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Close Terminal"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div ref={terminalRef} className="flex-1 p-2 overflow-hidden" />
        </div>
    );
}
