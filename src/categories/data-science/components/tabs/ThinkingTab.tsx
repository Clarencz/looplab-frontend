import { ThinkingCanvas, ThinkingCanvasData } from '@/components/datascience/ThinkingCanvas';
import { GuidancePanel } from '../GuidancePanel';

interface ThinkingTabProps {
    thinkingData: ThinkingCanvasData;
    onUpdate: (data: ThinkingCanvasData) => void;
}

export function ThinkingTab({ thinkingData, onUpdate }: ThinkingTabProps) {
    const guidanceSections = [
        {
            heading: '1. Decompose the Problem',
            content: (
                <p>
                    Break down the stakeholder's claim into testable components.
                    Identify hidden assumptions.
                </p>
            ),
        },
        {
            heading: '2. Generate Hypotheses',
            content: (
                <p>
                    List ALL possible explanations, not just the obvious one.
                    Score each by testability and impact.
                </p>
            ),
        },
        {
            heading: '3. Think Causally',
            content: (
                <p>
                    Correlation ≠ Causation. What confounding variables exist?
                    How will you isolate the effect?
                </p>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ThinkingCanvas
                    initialData={thinkingData}
                    onUpdate={onUpdate}
                />
            </div>

            <div>
                <GuidancePanel
                    title="Thinking Guide"
                    sections={guidanceSections}
                    reminder="The best analysts question everything, especially their own assumptions."
                />
            </div>
        </div>
    );
}
