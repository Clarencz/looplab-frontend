import { SocraticDialogue } from '@/components/datascience/SocraticDialogue';
import { GuidancePanel } from '../GuidancePanel';
import type { Hypothesis } from '@/components/datascience/ThinkingCanvas';

interface DialogueTabProps {
    problemStatement: string;
    hypotheses: Hypothesis[];
}

export function DialogueTab({ problemStatement, hypotheses }: DialogueTabProps) {
    const guidanceSections = [
        {
            heading: 'Socratic Method',
            content: (
                <p>
                    The AI will challenge your thinking with probing questions.
                    This isn't criticism—it's how senior analysts think.
                </p>
            ),
        },
        {
            heading: 'Good Questions to Ask',
            content: (
                <ul className="space-y-2">
                    <li>• "What evidence would disprove this?"</li>
                    <li>• "What am I assuming?"</li>
                    <li>• "What's the alternative explanation?"</li>
                    <li>• "How could I be wrong?"</li>
                </ul>
            ),
        },
        {
            heading: 'Red Flags',
            content: (
                <ul className="space-y-2">
                    <li>• Confirmation bias</li>
                    <li>• Anchoring on first hypothesis</li>
                    <li>• Ignoring contradictory data</li>
                    <li>• Oversimplifying causation</li>
                </ul>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <SocraticDialogue
                    context={{
                        problemStatement,
                        hypotheses,
                    }}
                />
            </div>

            <div>
                <GuidancePanel
                    title="Dialogue Guide"
                    sections={guidanceSections}
                    reminder="The goal isn't to be right—it's to find the truth."
                />
            </div>
        </div>
    );
}
