import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, AlertTriangle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

export interface Feature {
    id: string;
    name: string;
    formula: string;
    category: 'interaction' | 'transformation' | 'aggregation' | 'temporal' | 'domain_specific';
    businessLogic: string;
    potentialIssues: string[];
    validationStatus: 'pending' | 'approved' | 'rejected';
}

export interface FeatureValidation {
    featureId: string;
    hasDataLeakage: boolean;
    hasMulticollinearity: boolean;
    hasBusinessSense: boolean;
    isTestable: boolean;
    feedback: string[];
}

interface FeatureEngineeringJustifierProps {
    onFeaturesUpdate?: (features: Feature[]) => void;
}

export function FeatureEngineeringJustifier({ onFeaturesUpdate }: FeatureEngineeringJustifierProps) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [newFeature, setNewFeature] = useState<Partial<Feature>>({
        category: 'interaction',
        validationStatus: 'pending',
    });

    const addFeature = () => {
        if (!newFeature.name || !newFeature.formula || !newFeature.businessLogic) return;

        const feature: Feature = {
            id: Date.now().toString(),
            name: newFeature.name,
            formula: newFeature.formula,
            category: newFeature.category as Feature['category'],
            businessLogic: newFeature.businessLogic,
            potentialIssues: [],
            validationStatus: 'pending',
        };

        // Validate feature
        const validation = validateFeature(feature);
        feature.potentialIssues = validation.feedback;
        feature.validationStatus = validation.hasDataLeakage ? 'rejected' : 'approved';

        const updated = [...features, feature];
        setFeatures(updated);
        onFeaturesUpdate?.(updated);

        // Reset form
        setNewFeature({
            category: 'interaction',
            validationStatus: 'pending',
            name: '',
            formula: '',
            businessLogic: '',
        });
    };

    const validateFeature = (feature: Feature): FeatureValidation => {
        const feedback: string[] = [];
        let hasDataLeakage = false;
        let hasMulticollinearity = false;
        let hasBusinessSense = true;
        let isTestable = true;

        // Check for temporal leakage keywords
        const leakageKeywords = ['future', 'after', 'next', 'later', 'outcome', 'result', 'churn'];
        const formulaLower = feature.formula.toLowerCase();

        if (leakageKeywords.some((keyword) => formulaLower.includes(keyword))) {
            hasDataLeakage = true;
            feedback.push(
                '🚨 CRITICAL: Potential data leakage detected! Feature may use information from the future.'
            );
        }

        // Check for business logic justification
        if (feature.businessLogic.length < 20) {
            hasBusinessSense = false;
            feedback.push('⚠️ Business logic justification is too brief. Explain WHY this feature matters.');
        }

        // Check for formula complexity
        const operators = (feature.formula.match(/[\+\-\*\/\(\)]/g) || []).length;
        if (operators > 10) {
            feedback.push(
                '💡 Complex formula - consider breaking into multiple features for interpretability.'
            );
        }

        // Check for interaction features
        if (feature.category === 'interaction' && !feature.formula.includes('*')) {
            feedback.push('💡 Interaction features typically involve multiplication or combinations.');
        }

        // Check for transformation features
        if (feature.category === 'transformation') {
            const transformKeywords = ['log', 'sqrt', 'square', 'exp', 'normalize'];
            if (!transformKeywords.some((keyword) => formulaLower.includes(keyword))) {
                feedback.push('💡 Transformation features usually apply mathematical functions (log, sqrt, etc.).');
            }
        }

        // Positive feedback
        if (feedback.length === 0) {
            feedback.push('✅ Feature looks good! No obvious issues detected.');
        }

        return {
            featureId: feature.id,
            hasDataLeakage,
            hasMulticollinearity,
            hasBusinessSense,
            isTestable,
            feedback,
        };
    };

    const getCategoryIcon = (category: Feature['category']) => {
        return <Wrench className="h-4 w-4" />;
    };

    const getCategoryColor = (category: Feature['category']) => {
        switch (category) {
            case 'interaction':
                return 'bg-blue-500';
            case 'transformation':
                return 'bg-purple-500';
            case 'aggregation':
                return 'bg-green-500';
            case 'temporal':
                return 'bg-orange-500';
            case 'domain_specific':
                return 'bg-pink-500';
        }
    };

    return (
        <div className="space-y-6">
            {/* Feature Builder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        Feature Engineering Justifier
                    </CardTitle>
                    <CardDescription>
                        Create features with business logic justification. We'll validate for data leakage and
                        interpretability.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Feature Name */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Feature Name</label>
                        <Input
                            value={newFeature.name || ''}
                            onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                            placeholder="e.g., customer_tenure_price_ratio"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Feature Category</label>
                        <Select
                            value={newFeature.category}
                            onValueChange={(value) => setNewFeature({ ...newFeature, category: value as any })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="interaction">
                                    Interaction (combining variables)
                                </SelectItem>
                                <SelectItem value="transformation">
                                    Transformation (mathematical functions)
                                </SelectItem>
                                <SelectItem value="aggregation">
                                    Aggregation (sum, mean, count)
                                </SelectItem>
                                <SelectItem value="temporal">Temporal (time-based)</SelectItem>
                                <SelectItem value="domain_specific">
                                    Domain-Specific (business rules)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Formula */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Formula (How is it calculated?)
                        </label>
                        <Input
                            value={newFeature.formula || ''}
                            onChange={(e) => setNewFeature({ ...newFeature, formula: e.target.value })}
                            placeholder="e.g., tenure_months / monthly_price"
                        />
                    </div>

                    {/* Business Logic */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Business Logic (WHY does this feature matter?)
                        </label>
                        <Textarea
                            value={newFeature.businessLogic || ''}
                            onChange={(e) => setNewFeature({ ...newFeature, businessLogic: e.target.value })}
                            placeholder="Explain the business reasoning... e.g., 'Customers with longer tenure relative to price may be more loyal'"
                            className="min-h-[100px]"
                        />
                    </div>

                    <Button onClick={addFeature} className="w-full">
                        Create & Validate Feature
                    </Button>
                </CardContent>
            </Card>

            {/* Features List */}
            {features.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Engineered Features
                        </CardTitle>
                        <CardDescription>
                            {features.filter((f) => f.validationStatus === 'approved').length} approved,{' '}
                            {features.filter((f) => f.validationStatus === 'rejected').length} rejected
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className={`border rounded-lg p-4 ${feature.validationStatus === 'rejected'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                        : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2">
                                            {feature.name}
                                            {feature.validationStatus === 'approved' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            )}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            <code className="bg-muted px-2 py-0.5 rounded">{feature.formula}</code>
                                        </p>
                                    </div>
                                    <Badge className={getCategoryColor(feature.category)}>
                                        {feature.category}
                                    </Badge>
                                </div>

                                <div className="mb-3">
                                    <p className="text-sm font-medium mb-1">Business Logic:</p>
                                    <p className="text-sm text-muted-foreground">{feature.businessLogic}</p>
                                </div>

                                {feature.potentialIssues.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Validation Feedback:</p>
                                        {feature.potentialIssues.map((issue, i) => (
                                            <p key={i} className="text-sm">
                                                {issue}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Common Pitfalls */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Common Feature Engineering Pitfalls
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Data Leakage</p>
                            <p className="text-muted-foreground">
                                Using information that wouldn't be available at prediction time (e.g., future data,
                                outcome variables)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Multicollinearity</p>
                            <p className="text-muted-foreground">
                                Creating features that are highly correlated with existing ones (adds noise, not
                                signal)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Overfitting</p>
                            <p className="text-muted-foreground">
                                Creating too many features or overly complex transformations that memorize training
                                data
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Best Practice</p>
                            <p className="text-muted-foreground">
                                Every feature should have clear business logic. If you can't explain WHY it matters,
                                don't create it.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Example Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Example: Good vs Bad Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="border-l-4 border-green-500 pl-3">
                        <p className="font-medium text-green-600 dark:text-green-400">✓ GOOD</p>
                        <p className="font-mono text-xs">tenure_to_price_ratio = tenure_months / monthly_price</p>
                        <p className="text-muted-foreground mt-1">
                            Logic: Customers with longer tenure relative to price may have higher perceived value
                        </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-3">
                        <p className="font-medium text-red-600 dark:text-red-400">✗ BAD (Data Leakage)</p>
                        <p className="font-mono text-xs">
                            churned_next_month = if customer_status == 'churned' then 1 else 0
                        </p>
                        <p className="text-muted-foreground mt-1">
                            Problem: Uses the outcome variable - this is the target, not a feature!
                        </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-3">
                        <p className="font-medium text-yellow-600 dark:text-yellow-400">⚠ QUESTIONABLE</p>
                        <p className="font-mono text-xs">
                            complex_score = (tenure * price) / (support_tickets + 1) * log(usage)
                        </p>
                        <p className="text-muted-foreground mt-1">
                            Problem: Too complex to interpret - what does this actually measure?
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
