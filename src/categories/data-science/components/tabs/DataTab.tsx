import { MissingDataSimulator } from '@/components/datascience/MissingDataSimulator';
import { FeatureEngineeringJustifier } from '@/components/datascience/FeatureEngineeringJustifier';

export function DataTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MissingDataSimulator />
            <FeatureEngineeringJustifier />
        </div>
    );
}
