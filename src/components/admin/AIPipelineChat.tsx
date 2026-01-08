import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Sparkles, Loader2, CheckCircle, XCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface ChatMessage {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
    specs?: PipelineSpecs | null;
}

interface PipelineSpecs {
    topics: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_time: string;
    excluded_areas: string[];
    ready_to_generate: boolean;
}

interface PipelineStatus {
    stage: string;
    progress: number;
    message: string;
    completed: boolean;
    error?: string;
}

interface Props {
    projectId: string;
    projectName: string;
    files: Array<{ name: string; type: string; content?: string }>;
    onLevelsGenerated?: (levels: Array<{ name: string; files: Array<{ name: string; type: string; status: string; content: string }> }>) => void;
}

export default function AIPipelineChat({ projectId, projectName, files, onLevelsGenerated }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentSpecs, setCurrentSpecs] = useState<PipelineSpecs | null>(null);
    const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initial analysis when component mounts
    useEffect(() => {
        if (messages.length === 0) {
            analyzeProject();
        }
    }, []);

    // Poll pipeline status when running
    useEffect(() => {
        if (!taskId) return;

        const interval = setInterval(async () => {
            try {
                const status = await apiClient.get<{ data: PipelineStatus }>(
                    `/admin/projects/${projectId}/pipeline-status/${taskId}`
                );
                const statusData = status.data || status;
                setPipelineStatus(statusData);

                if (statusData.completed || statusData.error) {
                    clearInterval(interval);
                    setTaskId(null);

                    if (statusData.error) {
                        addMessage('assistant', `❌ Pipeline failed: ${statusData.error}`);
                    } else {
                        addMessage('assistant', `✅ Levels generated successfully! The 3 difficulty levels are now available for review in the Metadata tab.`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch pipeline status:', error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [taskId, projectId]);

    const addMessage = (role: 'assistant' | 'user', content: string, specs?: PipelineSpecs | null) => {
        const message: ChatMessage = {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date(),
            specs,
        };
        setMessages(prev => [...prev, message]);
        return message;
    };

    const analyzeProject = async () => {
        setIsAnalyzing(true);

        try {
            // Call backend to analyze project files
            const response = await apiClient.post<{ data: { analysis: string; suggested_topics: string[] } }>(
                `/admin/projects/${projectId}/analyze`,
                { files: files.map(f => ({ name: f.name, type: f.type })) }
            );

            const data = response.data || response;
            const topics = data.suggested_topics || ['data processing', 'algorithms', 'testing'];

            addMessage('assistant',
                `I've analyzed **${projectName}** and found ${files.length} files.\n\n` +
                `Based on the code, this project appears to cover:\n` +
                topics.map(t => `• ${t}`).join('\n') +
                `\n\nWhat learning areas would you like this project to test? ` +
                `You can say something like:\n` +
                `• "Focus on data processing and visualization"\n` +
                `• "Make this beginner-friendly, skip the ML parts"\n` +
                `• "Test all areas at intermediate level"`
            );
        } catch (error) {
            // Fallback if analysis endpoint doesn't exist yet
            addMessage('assistant',
                `I've loaded **${projectName}** with ${files.length} files.\n\n` +
                `What learning areas would you like this project to test?\n\n` +
                `You can tell me things like:\n` +
                `• "Focus on data cleaning and visualization"\n` +
                `• "Make this for beginners, test basic concepts only"\n` +
                `• "Advanced level, cover error handling and optimization"`
            );
        } finally {
            setIsAnalyzing(false);
            inputRef.current?.focus();
        }
    };

    // Chat mutation to send messages
    const chatMutation = useMutation({
        mutationFn: async (message: string) => {
            const response = await apiClient.post<{
                data: {
                    reply: string;
                    specs?: PipelineSpecs;
                }
            }>(`/admin/projects/${projectId}/pipeline-chat`, {
                message,
                context: messages.map(m => ({ role: m.role, content: m.content })),
            });
            return response.data || response;
        },
        onSuccess: (data) => {
            addMessage('assistant', data.reply, data.specs);
            if (data.specs) {
                setCurrentSpecs(data.specs);
            }
        },
        onError: (error: any) => {
            console.error('Chat error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
            addMessage('assistant',
                `❌ **AI Chat Error**\n\n` +
                `Failed to connect to AI: ${errorMessage}\n\n` +
                `Please check:\n` +
                `• AI Pipeline service is running on port 8001\n` +
                `• Backend can reach the AI service\n` +
                `• API quota hasn't been exceeded`
            );
        },
    });

    const handleSend = () => {
        if (!input.trim() || chatMutation.isPending) return;

        addMessage('user', input);
        chatMutation.mutate(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleGenerate = async () => {
        if (!currentSpecs) return;

        addMessage('assistant', '🚀 Generating learning levels... This may take a few minutes.');

        try {
            const response = await apiClient.post<{ data: { task_id: string } }>(
                `/admin/projects/${projectId}/run-ai-pipeline`,
                {
                    topics: currentSpecs.topics,
                    difficulty: currentSpecs.difficulty,
                }
            );

            const data = response.data || response;
            setTaskId(data.task_id);
            setPipelineStatus({
                stage: 'Generating',
                progress: 10,
                message: 'AI is creating learning levels...',
                completed: false,
            });

            // For now, generate mock files while pipeline runs
            // In production, these would come from polling the pipeline result
            if (onLevelsGenerated) {
                const mockLevels = currentSpecs.topics.map((topic, idx) => ({
                    name: `Level ${idx + 1}: ${topic}`,
                    files: [
                        {
                            name: `${topic.toLowerCase().replace(/\s+/g, '_')}_starter.py`,
                            type: 'file',
                            status: 'broken',
                            content: `# ${topic} - Starter Level
# Difficulty: ${currentSpecs.difficulty}
# Topics: ${currentSpecs.topics.join(', ')}

# TODO: Complete the implementation
def main():
    """
    Your task: Implement ${topic}
    """
    pass

if __name__ == "__main__":
    main()
`,
                        },
                    ],
                }));

                onLevelsGenerated(mockLevels);
                addMessage('assistant',
                    `✅ Generated ${mockLevels.length} learning levels!\\n\\n` +
                    `Check the "AI-Generated" section in the file tree.\\n` +
                    `• Preview each file\\n` +
                    `• Click "Approve" to add to project\\n` +
                    `• Click "Reject" to discard`
                );
            }

            setCurrentSpecs(null);
        } catch (error: any) {
            toast.error('Failed to generate levels');
            addMessage('assistant', `❌ Failed to generate: ${error.message}`);
        }
    };

    const handleAdjust = () => {
        setCurrentSpecs(null);
        addMessage('assistant', 'No problem! Tell me what you\'d like to change.');
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Sparkles className="h-5 w-5" />
                <div>
                    <h3 className="font-semibold">AI Pipeline Assistant</h3>
                    <p className="text-xs text-purple-100">Configure how to break this project into learning levels</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing project files...</span>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                        >
                            <div className="whitespace-pre-wrap text-sm">
                                {message.content.split('\n').map((line, i) => (
                                    <p key={i} className={line.startsWith('•') || line.startsWith('✓') ? 'ml-2' : ''}>
                                        {line.startsWith('**') ? (
                                            <strong>{line.replace(/\*\*/g, '')}</strong>
                                        ) : line}
                                    </p>
                                ))}
                            </div>

                            {/* Action buttons for specs */}
                            {message.specs?.ready_to_generate && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <Button
                                        size="sm"
                                        onClick={handleGenerate}
                                        className="gap-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <Play className="h-3 w-3" />
                                        Generate Levels
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleAdjust}
                                    >
                                        Adjust
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Pipeline Status */}
                {pipelineStatus && !pipelineStatus.completed && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="font-medium text-blue-800">{pipelineStatus.stage}</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${pipelineStatus.progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-blue-700">{pipelineStatus.message}</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tell me what areas to test..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={chatMutation.isPending || !!taskId}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || chatMutation.isPending || !!taskId}
                        className="gap-1"
                    >
                        {chatMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
