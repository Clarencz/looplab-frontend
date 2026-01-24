import { StatisticalTestingValidator } from '@/components/datascience/StatisticalTestingValidator';
import { VisualizationStrategyPlanner } from '@/components/datascience/VisualizationStrategyPlanner';
import { BusinessRecommendationFramework } from '@/components/datascience/BusinessRecommendationFramework';

export function AnalysisTab() {
    return (
        <div className="grid grid-cols-1 gap-6">
            <StatisticalTestingValidator />
            <VisualizationStrategyPlanner />
            <BusinessRecommendationFramework />
        </div>
    );
}
