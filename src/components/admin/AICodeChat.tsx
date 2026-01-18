import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Code, Bug, RefreshCw, FileCode, Lightbulb, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AICodeChatProps {
    projectId: string;
    currentFile?: string;
    selectedCode?: string;
    language?: string;
    onInsertCode?: (code: string) => void;
    onExplainCode?: (code: string) => Promise<string>;
    onFixCode?: (code: string) => Promise<Array<{ issue: string; fix: string }>>;
    onRefactorCode?: (code: string) => Promise<Array<{ description: string; code: string }>>;
    onGenerateTests?: (code: string) => Promise<string>;
}

export default function AICodeChat({
    projectId,
    currentFile,
    selectedCode,
    language = 'typescript',
    onInsertCode,
    onExplainCode,
    onFixCode,
    onRefactorCode,
    onGenerateTests,
}: AICodeChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (role: 'user' | 'assistant', content: string) => {
        const message: ChatMessage = {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, message]);
        return message;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        addMessage('user', userMessage);

        setIsLoading(true);
        try {
            // Build context
            const context = {
                fileName: currentFile,
                selectedCode,
                language,
            };

            const response = await apiClient.post<{ response: string; code?: string }>(
                `/admin/projects/${projectId}/ai/chat`,
                {
                    message: userMessage,
                    context,
                }
            );

            addMessage('assistant', response.response);

            // If AI returned code, offer to insert it
            if (response.code && onInsertCode) {
                addMessage('assistant', `\`\`\`${language}\n${response.code}\n\`\`\``);
            }
        } catch (error: any) {
            addMessage('assistant', `Error: ${error.message || 'Failed to get AI response'}`);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleQuickAction = async (action: string) => {
        if (!selectedCode) {
            toast.error('Please select some code first');
            return;
        }

        setIsLoading(true);
        try {
            switch (action) {
                case 'explain':
                    if (onExplainCode) {
                        const explanation = await onExplainCode(selectedCode);
                        addMessage('user', 'Explain this code');
                        addMessage('assistant', explanation);
                    }
                    break;

                case 'fix':
                    if (onFixCode) {
                        const fixes = await onFixCode(selectedCode);
                        addMessage('user', 'Find bugs in this code');
                        if (fixes.length > 0) {
                            const fixesText = fixes.map((f, i) =>
                                `${i + 1}. **${f.issue}**\n\`\`\`${language}\n${f.fix}\n\`\`\``
                            ).join('\n\n');
                            addMessage('assistant', `Found ${fixes.length} issue(s):\n\n${fixesText}`);
                        } else {
                            addMessage('assistant', 'No issues found! The code looks good.');
                        }
                    }
                    break;

                case 'refactor':
                    if (onRefactorCode) {
                        const suggestions = await onRefactorCode(selectedCode);
                        addMessage('user', 'Suggest refactorings');
                        if (suggestions.length > 0) {
                            const suggestionsText = suggestions.map((s, i) =>
                                `${i + 1}. **${s.description}**\n\`\`\`${language}\n${s.code}\n\`\`\``
                            ).join('\n\n');
                            addMessage('assistant', `Here are ${suggestions.length} refactoring suggestion(s):\n\n${suggestionsText}`);
                        } else {
                            addMessage('assistant', 'The code is already well-structured!');
                        }
                    }
                    break;

                case 'test':
                    if (onGenerateTests) {
                        const tests = await onGenerateTests(selectedCode);
                        addMessage('user', 'Generate tests for this code');
                        if (tests) {
                            addMessage('assistant', `Here are the generated tests:\n\n\`\`\`${language}\n${tests}\n\`\`\``);
                        } else {
                            addMessage('assistant', 'Could not generate tests for this code.');
                        }
                    }
                    break;
            }
        } catch (error: any) {
            toast.error(`Failed to ${action} code: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { id: 'explain', label: 'Explain', icon: Lightbulb, color: 'blue' },
        { id: 'fix', label: 'Find Bugs', icon: Bug, color: 'red' },
        { id: 'refactor', label: 'Refactor', icon: RefreshCw, color: 'purple' },
        { id: 'test', label: 'Generate Tests', icon: FileCode, color: 'green' },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold">AI Assistant</h3>
                </div>
                {currentFile && (
                    <span className="text-xs text-gray-400 truncate max-w-[150px]">
                        {currentFile}
                    </span>
                )}
            </div>

            {/* Quick Actions */}
            {selectedCode && (
                <div className="px-3 py-2 bg-gray-800/50 border-b border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Quick Actions on Selection:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => handleQuickAction(action.id)}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${action.color === 'blue' ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300' :
                                        action.color === 'red' ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300' :
                                            action.color === 'purple' ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300' :
                                                'bg-green-600/20 hover:bg-green-600/30 text-green-300'
                                    } disabled:opacity-50`}
                            >
                                <action.icon className="h-3 w-3" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <div className="p-4 bg-purple-600/20 rounded-full">
                            <Code className="h-8 w-8 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-200">AI Code Assistant</h4>
                            <p className="text-sm text-gray-400 mt-1 max-w-xs">
                                Ask questions, get explanations, or request code improvements
                            </p>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>• Select code for quick actions</p>
                            <p>• Ask "How does this work?"</p>
                            <p>• Request "Add error handling"</p>
                        </div>
                    </div>
                )}

                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-lg px-4 py-2 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                                }`}
                        >
                            <div className="text-sm whitespace-pre-wrap break-words">
                                {message.content.split('```').map((part, i) => {
                                    if (i % 2 === 1) {
                                        // Code block
                                        const lines = part.split('\n');
                                        const lang = lines[0];
                                        const code = lines.slice(1).join('\n');
                                        return (
                                            <pre key={i} className="bg-gray-950 rounded p-3 my-2 overflow-x-auto">
                                                <code className="text-xs font-mono">{code}</code>
                                            </pre>
                                        );
                                    }
                                    // Regular text
                                    return <span key={i}>{part}</span>;
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-800 border-t border-gray-700">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask AI about your code..."
                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
