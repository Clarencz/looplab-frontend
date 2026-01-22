import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, MessageCircle, ThumbsUp, ThumbsDown, AlertTriangle, Target } from 'lucide-react';

export type StakeholderPersona = {
    id: string;
    name: string;
    role: string;
    personality: 'skeptical' | 'supportive' | 'technical' | 'business_focused' | 'impatient';
    expertise: 'high' | 'medium' | 'low';
    biases: string[];
    commonQuestions: string[];
    responseStyle: string;
};

export type StakeholderInteraction = {
    id: string;
    stakeholderId: string;
    studentMessage: string;
    stakeholderResponse: string;
    feedback: {
        clarity: number; // 1-10
        technicalAccuracy: number; // 1-10
        businessRelevance: number; // 1-10
        persuasiveness: number; // 1-10
        suggestions: string[];
    };
    timestamp: Date;
};

interface StakeholderSimulationProps {
    onInteraction?: (interaction: StakeholderInteraction) => void;
}

export function StakeholderSimulation({ onInteraction }: StakeholderSimulationProps) {
    const stakeholders: StakeholderPersona[] = [
        {
            id: 'ceo-sarah',
            name: 'Sarah Chen',
            role: 'CEO',
            personality: 'impatient',
            expertise: 'low',
            biases: ['Wants quick answers', 'Dislikes technical jargon', 'Focuses on revenue impact'],
            commonQuestions: [
                'Bottom line - what should we do?',
                'How much will this cost us?',
                'Can you explain this without the statistics?',
                'How confident are you in this recommendation?',
            ],
            responseStyle: 'Direct, impatient, wants executive summary only',
        },
        {
            id: 'cto-marcus',
            name: 'Marcus Rodriguez',
            role: 'CTO',
            personality: 'technical',
            expertise: 'high',
            biases: ['Wants to see methodology', 'Questions statistical rigor', 'Skeptical of correlations'],
            commonQuestions: [
                'What test did you use and why?',
                'Did you check the assumptions?',
                'How did you handle confounding variables?',
                'What\'s the effect size, not just p-value?',
            ],
            responseStyle: 'Technical, detail-oriented, will catch methodological errors',
        },
        {
            id: 'cmo-jennifer',
            name: 'Jennifer Park',
            role: 'CMO',
            personality: 'skeptical',
            expertise: 'medium',
            biases: ['Defends marketing decisions', 'Questions data quality', 'Wants customer insights'],
            commonQuestions: [
                'Are you sure the data is accurate?',
                'Did you consider seasonal effects?',
                'What about customer segments - is this true for everyone?',
                'How does this compare to industry benchmarks?',
            ],
            responseStyle: 'Defensive, questions assumptions, wants segmentation',
        },
        {
            id: 'cfo-david',
            name: 'David Thompson',
            role: 'CFO',
            personality: 'business_focused',
            expertise: 'medium',
            biases: ['ROI-focused', 'Risk-averse', 'Wants cost-benefit analysis'],
            commonQuestions: [
                'What\'s the ROI of this recommendation?',
                'What are the financial risks?',
                'Do we have budget for this?',
                'What if we do nothing - what\'s the cost?',
            ],
            responseStyle: 'Numbers-focused, wants financial justification',
        },
        {
            id: 'vp-ops-lisa',
            name: 'Lisa Wang',
            role: 'VP Operations',
            personality: 'supportive',
            expertise: 'medium',
            biases: ['Wants actionable steps', 'Concerned about implementation', 'Team-oriented'],
            commonQuestions: [
                'How do we actually implement this?',
                'What resources do we need?',
                'What\'s the timeline?',
                'How will this affect the team?',
            ],
            responseStyle: 'Supportive but practical, wants implementation details',
        },
    ];

    const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderPersona>(stakeholders[0]);
    const [studentMessage, setStudentMessage] = useState('');
    const [interactions, setInteractions] = useState<StakeholderInteraction[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);

    const generateStakeholderResponse = (
        stakeholder: StakeholderPersona,
        message: string
    ): { response: string; feedback: StakeholderInteraction['feedback'] } => {
        let response = '';
        const feedback: StakeholderInteraction['feedback'] = {
            clarity: 5,
            technicalAccuracy: 5,
            businessRelevance: 5,
            persuasiveness: 5,
            suggestions: [],
        };

        const messageLower = message.toLowerCase();

        // Evaluate based on stakeholder personality
        switch (stakeholder.personality) {
            case 'impatient':
                if (message.length > 500) {
                    response = `Sarah interrupts: "I don't have time for a novel. Give me the 30-second version."`;
                    feedback.clarity = 3;
                    feedback.suggestions.push('Too long - executives want 2-3 sentences max');
                } else if (messageLower.includes('p-value') || messageLower.includes('statistical')) {
                    response = `Sarah looks confused: "I don't care about p-values. Just tell me - should we revert the pricing or not?"`;
                    feedback.clarity = 4;
                    feedback.suggestions.push('Avoid technical jargon with non-technical stakeholders');
                } else if (messageLower.includes('recommend') && messageLower.includes('$')) {
                    response = `Sarah nods: "Okay, that's clear. What's the risk if we do this?"`;
                    feedback.clarity = 8;
                    feedback.businessRelevance = 8;
                    feedback.persuasiveness = 7;
                } else {
                    response = `Sarah: "Get to the point - what should we do?"`;
                    feedback.clarity = 5;
                    feedback.suggestions.push('Start with the recommendation, then justify');
                }
                break;

            case 'technical':
                if (!messageLower.includes('test') && !messageLower.includes('method')) {
                    response = `Marcus raises an eyebrow: "What statistical test did you use? Did you check the assumptions?"`;
                    feedback.technicalAccuracy = 4;
                    feedback.suggestions.push('Technical stakeholders want methodology details');
                } else if (messageLower.includes('correlation') && !messageLower.includes('causation')) {
                    response = `Marcus: "Correlation doesn't equal causation. How did you rule out confounding variables?"`;
                    feedback.technicalAccuracy = 5;
                    feedback.suggestions.push('Always address causation vs correlation with technical audiences');
                } else if (messageLower.includes('effect size') || messageLower.includes('confidence interval')) {
                    response = `Marcus nods approvingly: "Good - you're reporting effect sizes, not just p-values. What about the assumptions?"`;
                    feedback.technicalAccuracy = 9;
                    feedback.clarity = 8;
                } else {
                    response = `Marcus: "Walk me through your methodology."`;
                    feedback.technicalAccuracy = 6;
                }
                break;

            case 'skeptical':
                if (!messageLower.includes('segment') && !messageLower.includes('group')) {
                    response = `Jennifer challenges: "Is this true for ALL customer segments? Or just certain groups?"`;
                    feedback.businessRelevance = 5;
                    feedback.suggestions.push('Skeptical stakeholders want segmentation and edge cases');
                } else if (messageLower.includes('data quality') || messageLower.includes('validated')) {
                    response = `Jennifer: "Okay, but how do we know the data is accurate? What about missing values?"`;
                    feedback.technicalAccuracy = 7;
                    feedback.businessRelevance = 7;
                } else {
                    response = `Jennifer looks doubtful: "I'm not convinced. Show me the data."`;
                    feedback.persuasiveness = 4;
                    feedback.suggestions.push('Anticipate objections and address them proactively');
                }
                break;

            case 'business_focused':
                if (!messageLower.includes('$') && !messageLower.includes('roi') && !messageLower.includes('cost')) {
                    response = `David: "What's the financial impact? I need numbers."`;
                    feedback.businessRelevance = 4;
                    feedback.suggestions.push('Always quantify business impact in dollars');
                } else if (messageLower.includes('risk')) {
                    response = `David: "Good - you're thinking about risks. What's the cost of doing nothing?"`;
                    feedback.businessRelevance = 8;
                    feedback.persuasiveness = 7;
                } else {
                    response = `David: "Show me the ROI calculation."`;
                    feedback.businessRelevance = 6;
                }
                break;

            case 'supportive':
                if (messageLower.includes('implement') || messageLower.includes('next steps')) {
                    response = `Lisa smiles: "Great! Let's talk about implementation. What resources do we need?"`;
                    feedback.clarity = 8;
                    feedback.businessRelevance = 8;
                    feedback.persuasiveness = 8;
                } else {
                    response = `Lisa: "I like the direction. How do we actually do this?"`;
                    feedback.businessRelevance = 7;
                    feedback.suggestions.push('Supportive stakeholders still want concrete next steps');
                }
                break;
        }

        return { response, feedback };
    };

    const sendMessage = () => {
        if (!studentMessage.trim()) return;

        const { response, feedback } = generateStakeholderResponse(selectedStakeholder, studentMessage);

        const interaction: StakeholderInteraction = {
            id: Date.now().toString(),
            stakeholderId: selectedStakeholder.id,
            studentMessage,
            stakeholderResponse: response,
            feedback,
            timestamp: new Date(),
        };

        setInteractions([...interactions, interaction]);
        onInteraction?.(interaction);
        setStudentMessage('');
        setShowFeedback(true);
    };

    const getPersonalityColor = (personality: StakeholderPersona['personality']) => {
        switch (personality) {
            case 'skeptical':
                return 'bg-red-500';
            case 'supportive':
                return 'bg-green-500';
            case 'technical':
                return 'bg-blue-500';
            case 'business_focused':
                return 'bg-purple-500';
            case 'impatient':
                return 'bg-orange-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Stakeholder Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Stakeholder Simulation
                    </CardTitle>
                    <CardDescription>
                        Practice presenting your analysis to different stakeholder personas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {stakeholders.map((stakeholder) => (
                            <div
                                key={stakeholder.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedStakeholder.id === stakeholder.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                                onClick={() => setSelectedStakeholder(stakeholder)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold">{stakeholder.name}</h4>
                                        <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                                    </div>
                                    <Badge className={getPersonalityColor(stakeholder.personality)}>
                                        {stakeholder.personality}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{stakeholder.responseStyle}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Current Stakeholder Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">
                        Presenting to: {selectedStakeholder.name} ({selectedStakeholder.role})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-sm font-medium mb-1">Biases:</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedStakeholder.biases.map((bias, i) => (
                                <Badge key={i} variant="outline">
                                    {bias}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-1">Common Questions:</p>
                        <ul className="text-sm space-y-1">
                            {selectedStakeholder.commonQuestions.map((q, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span className="italic">"{q}"</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Message Input */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Your Message
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        value={studentMessage}
                        onChange={(e) => setStudentMessage(e.target.value)}
                        placeholder={`Present your findings to ${selectedStakeholder.name}...`}
                        className="min-h-[120px]"
                    />
                    <Button onClick={sendMessage} className="w-full">
                        Send Message
                    </Button>
                </CardContent>
            </Card>

            {/* Interaction History */}
            {interactions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Conversation History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {interactions.map((interaction) => {
                            const stakeholder = stakeholders.find((s) => s.id === interaction.stakeholderId)!;
                            return (
                                <div key={interaction.id} className="space-y-3 border-b pb-4 last:border-b-0">
                                    {/* Student Message */}
                                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                                        <p className="text-sm font-medium mb-1">You:</p>
                                        <p className="text-sm">{interaction.studentMessage}</p>
                                    </div>

                                    {/* Stakeholder Response */}
                                    <div className="bg-muted p-3 rounded-lg">
                                        <p className="text-sm font-medium mb-1">{stakeholder.name}:</p>
                                        <p className="text-sm">{interaction.stakeholderResponse}</p>
                                    </div>

                                    {/* Feedback */}
                                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                        <p className="text-sm font-medium mb-2">AI Feedback:</p>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div className="text-sm">
                                                <span className="font-medium">Clarity:</span> {interaction.feedback.clarity}/10
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Technical:</span>{' '}
                                                {interaction.feedback.technicalAccuracy}/10
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Business:</span>{' '}
                                                {interaction.feedback.businessRelevance}/10
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium">Persuasive:</span>{' '}
                                                {interaction.feedback.persuasiveness}/10
                                            </div>
                                        </div>
                                        {interaction.feedback.suggestions.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium mb-1">Suggestions:</p>
                                                <ul className="text-sm space-y-1">
                                                    {interaction.feedback.suggestions.map((suggestion, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span>💡</span>
                                                            <span>{suggestion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Tips */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Communication Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5" />
                        <p>
                            <strong>Know your audience:</strong> Technical details for CTO, business impact for CEO
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5" />
                        <p>
                            <strong>Start with the answer:</strong> Busy executives want the conclusion first
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-500 mt-0.5" />
                        <p>
                            <strong>Avoid jargon:</strong> Not everyone knows what "p-value" or "heteroscedasticity" means
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <p>
                            <strong>Anticipate objections:</strong> Address concerns before they're raised
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
