import { AnalyticalTrapsSystem } from '@/components/datascience/AnalyticalTrapsSystem';
import { SkillProgressionTracker } from '@/components/datascience/SkillProgressionTracker';
import { StakeholderSimulation } from '@/components/datascience/StakeholderSimulation';

export function LearningTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <AnalyticalTrapsSystem />
            </div>
            <div className="space-y-6">
                <SkillProgressionTracker />
                <StakeholderSimulation />
            </div>
        </div>
    );
}
