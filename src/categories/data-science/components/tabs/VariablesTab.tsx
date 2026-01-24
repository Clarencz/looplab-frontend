import { VariableMindMap } from '@/components/datascience/VariableMindMap';
import { GuidancePanel } from '../GuidancePanel';

export function VariablesTab() {
    const guidanceSections = [
        {
            heading: 'Variable Types',
            content: (
                <ul className="space-y-2">
                    <li><strong>Independent:</strong> What you're testing (e.g., Price)</li>
                    <li><strong>Dependent:</strong> What you're measuring (e.g., Churn)</li>
                    <li><strong>Confounding:</strong> Hidden causes affecting both</li>
                    <li><strong>Mediating:</strong> Variables in the causal chain</li>
                    <li><strong>Moderating:</strong> Conditions that change the effect</li>
                </ul>
            ),
        },
        {
            heading: 'Common Pitfalls',
            content: (
                <ul className="space-y-2">
                    <li>• Missing confounders (e.g., service quality)</li>
                    <li>• Circular dependencies</li>
                    <li>• Reverse causation</li>
                    <li>• Simpson's Paradox</li>
                </ul>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <VariableMindMap />
            </div>

            <div>
                <GuidancePanel
                    title="Mapping Guide"
                    sections={guidanceSections}
                    reminder="Every relationship you draw must be justified with logic or evidence."
                />
            </div>
        </div>
    );
}
