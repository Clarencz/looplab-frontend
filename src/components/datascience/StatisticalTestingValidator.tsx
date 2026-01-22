import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart3, AlertTriangle, CheckCircle2, HelpCircle, TrendingUp } from 'lucide-react';

export interface StatisticalTest {
    id: string;
    testName: string;
    hypothesis: string;
    nullHypothesis: string;
    alternativeHypothesis: string;
    testType: 't-test' | 'chi-square' | 'anova' | 'regression' | 'correlation' | 'mann-whitney' | 'other';
    assumptions: string[];
    assumptionsChecked: boolean;
    sampleSize: number;
    expectedEffect: string;
    powerAnalysis: string;
    multipleTestingAwareness: boolean;
    interpretationPlan: string;
}

export interface TestValidation {
    testId: string;
    issues: string[];
    warnings: string[];
    suggestions: string[];
    isValid: boolean;
}

interface StatisticalTestingValidatorProps {
    onTestsUpdate?: (tests: StatisticalTest[]) => void;
}

export function StatisticalTestingValidator({ onTestsUpdate }: StatisticalTestingValidatorProps) {
    const [tests, setTests] = useState<StatisticalTest[]>([]);
    const [newTest, setNewTest] = useState<Partial<StatisticalTest>>({
        testType: 't-test',
        assumptions: [],
        assumptionsChecked: false,
        multipleTestingAwareness: false,
    });

    const getTestAssumptions = (testType: StatisticalTest['testType']): string[] => {
        switch (testType) {
            case 't-test':
                return [
                    'Normality: Data should be approximately normally distributed',
                    'Independence: Observations are independent',
                    'Homogeneity of variance: Equal variances between groups',
                ];
            case 'chi-square':
                return [
                    'Independence: Observations are independent',
                    'Expected frequency: All expected frequencies ≥ 5',
                    'Categorical data: Variables are categorical',
                ];
            case 'anova':
                return [
                    'Normality: Residuals are normally distributed',
                    'Independence: Observations are independent',
                    'Homogeneity of variance: Equal variances across groups',
                ];
            case 'regression':
                return [
                    'Linearity: Relationship is linear',
                    'Independence: Residuals are independent',
                    'Homoscedasticity: Constant variance of residuals',
                    'Normality: Residuals are normally distributed',
                    'No multicollinearity: Predictors are not highly correlated',
                ];
            case 'correlation':
                return [
                    'Linearity: Relationship is linear (for Pearson)',
                    'Normality: Variables are normally distributed (for Pearson)',
                    'No outliers: Extreme values can distort correlation',
                ];
            case 'mann-whitney':
                return [
                    'Independence: Observations are independent',
                    'Ordinal or continuous: Data is at least ordinal',
                    'Similar distributions: Groups have similar shaped distributions',
                ];
            default:
                return ['Specify assumptions for your chosen test'];
        }
    };

    const validateTest = (test: Partial<StatisticalTest>): TestValidation => {
        const issues: string[] = [];
        const warnings: string[] = [];
        const suggestions: string[] = [];

        // Check null hypothesis
        if (!test.nullHypothesis || test.nullHypothesis.length < 10) {
            issues.push('❌ Null hypothesis is missing or too brief');
        }

        // Check alternative hypothesis
        if (!test.alternativeHypothesis || test.alternativeHypothesis.length < 10) {
            issues.push('❌ Alternative hypothesis is missing or too brief');
        }

        // Check if hypotheses are actually different
        if (test.nullHypothesis && test.alternativeHypothesis) {
            if (test.nullHypothesis === test.alternativeHypothesis) {
                issues.push('❌ Null and alternative hypotheses cannot be the same');
            }
        }

        // Check assumptions
        if (!test.assumptionsChecked) {
            warnings.push('⚠️ You haven\'t confirmed checking test assumptions - this is critical!');
        }

        // Check sample size
        if (test.sampleSize && test.sampleSize < 30) {
            warnings.push(
                '⚠️ Small sample size (n < 30) - consider non-parametric tests or bootstrap methods'
            );
        }

        // Check power analysis
        if (!test.powerAnalysis || test.powerAnalysis.length < 20) {
            warnings.push('⚠️ Power analysis is missing - how do you know your sample size is adequate?');
        }

        // Check multiple testing
        if (!test.multipleTestingAwareness) {
            warnings.push(
                '⚠️ Running multiple tests? Remember to adjust for multiple comparisons (Bonferroni, FDR, etc.)'
            );
        }

        // Check interpretation plan
        if (!test.interpretationPlan || test.interpretationPlan.length < 20) {
            warnings.push('⚠️ How will you interpret the results? Plan for both significant and non-significant outcomes');
        }

        // Suggestions
        if (test.testType === 't-test' && test.sampleSize && test.sampleSize < 30) {
            suggestions.push('💡 Consider Mann-Whitney U test instead (non-parametric alternative)');
        }

        if (test.testType === 'regression' && !test.interpretationPlan?.toLowerCase().includes('effect size')) {
            suggestions.push('💡 Don\'t just report p-values - include effect sizes (R², coefficients)');
        }

        if (issues.length === 0 && warnings.length === 0) {
            suggestions.push('✅ Test design looks solid! Remember to validate assumptions before running.');
        }

        return {
            testId: test.id || '',
            issues,
            warnings,
            suggestions,
            isValid: issues.length === 0,
        };
    };

    const addTest = () => {
        if (!newTest.testName || !newTest.nullHypothesis || !newTest.alternativeHypothesis) return;

        const test: StatisticalTest = {
            id: Date.now().toString(),
            testName: newTest.testName!,
            hypothesis: newTest.hypothesis || '',
            nullHypothesis: newTest.nullHypothesis!,
            alternativeHypothesis: newTest.alternativeHypothesis!,
            testType: newTest.testType as StatisticalTest['testType'],
            assumptions: getTestAssumptions(newTest.testType as StatisticalTest['testType']),
            assumptionsChecked: newTest.assumptionsChecked || false,
            sampleSize: newTest.sampleSize || 0,
            expectedEffect: newTest.expectedEffect || '',
            powerAnalysis: newTest.powerAnalysis || '',
            multipleTestingAwareness: newTest.multipleTestingAwareness || false,
            interpretationPlan: newTest.interpretationPlan || '',
        };

        const updated = [...tests, test];
        setTests(updated);
        onTestsUpdate?.(updated);

        // Reset form
        setNewTest({
            testType: 't-test',
            assumptions: [],
            assumptionsChecked: false,
            multipleTestingAwareness: false,
        });
    };

    return (
        <div className="space-y-6">
            {/* Test Builder */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Statistical Test Designer
                    </CardTitle>
                    <CardDescription>
                        Design your statistical test with proper hypotheses and assumption checking
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Test Name */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Test Name</label>
                        <Input
                            value={newTest.testName || ''}
                            onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                            placeholder="e.g., Compare churn rates before/after pricing change"
                        />
                    </div>

                    {/* Test Type */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Test Type</label>
                        <Select
                            value={newTest.testType}
                            onValueChange={(value) =>
                                setNewTest({
                                    ...newTest,
                                    testType: value as StatisticalTest['testType'],
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="t-test">T-Test (compare means)</SelectItem>
                                <SelectItem value="chi-square">Chi-Square (categorical association)</SelectItem>
                                <SelectItem value="anova">ANOVA (compare multiple groups)</SelectItem>
                                <SelectItem value="regression">Regression (predict/explain)</SelectItem>
                                <SelectItem value="correlation">Correlation (relationship strength)</SelectItem>
                                <SelectItem value="mann-whitney">Mann-Whitney (non-parametric)</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Null Hypothesis */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Null Hypothesis (H₀) - What you're trying to disprove
                        </label>
                        <Textarea
                            value={newTest.nullHypothesis || ''}
                            onChange={(e) => setNewTest({ ...newTest, nullHypothesis: e.target.value })}
                            placeholder="e.g., There is NO difference in churn rates before and after the pricing change"
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Alternative Hypothesis */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Alternative Hypothesis (H₁) - What you believe is true
                        </label>
                        <Textarea
                            value={newTest.alternativeHypothesis || ''}
                            onChange={(e) => setNewTest({ ...newTest, alternativeHypothesis: e.target.value })}
                            placeholder="e.g., Churn rate INCREASED after the pricing change"
                            className="min-h-[80px]"
                        />
                    </div>

                    {/* Sample Size */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Sample Size</label>
                        <Input
                            type="number"
                            value={newTest.sampleSize || ''}
                            onChange={(e) => setNewTest({ ...newTest, sampleSize: parseInt(e.target.value) })}
                            placeholder="e.g., 1000"
                        />
                    </div>

                    {/* Power Analysis */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Power Analysis (How did you determine sample size?)
                        </label>
                        <Textarea
                            value={newTest.powerAnalysis || ''}
                            onChange={(e) => setNewTest({ ...newTest, powerAnalysis: e.target.value })}
                            placeholder="e.g., Power = 0.8, alpha = 0.05, expected effect size = 0.3"
                        />
                    </div>

                    {/* Interpretation Plan */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Interpretation Plan (How will you interpret results?)
                        </label>
                        <Textarea
                            value={newTest.interpretationPlan || ''}
                            onChange={(e) => setNewTest({ ...newTest, interpretationPlan: e.target.value })}
                            placeholder="e.g., If p < 0.05 AND effect size > 0.2, conclude pricing caused churn increase. If not significant, cannot rule out other factors."
                        />
                    </div>

                    {/* Assumptions Display */}
                    {newTest.testType && (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">Test Assumptions to Check:</p>
                            <ul className="space-y-1 text-sm">
                                {getTestAssumptions(newTest.testType).map((assumption, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-muted-foreground">•</span>
                                        <span>{assumption}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="assumptions-checked"
                                    checked={newTest.assumptionsChecked}
                                    onChange={(e) =>
                                        setNewTest({ ...newTest, assumptionsChecked: e.target.checked })
                                    }
                                    className="rounded"
                                />
                                <label htmlFor="assumptions-checked" className="text-sm cursor-pointer">
                                    I will validate these assumptions before running the test
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Multiple Testing */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="multiple-testing"
                            checked={newTest.multipleTestingAwareness}
                            onChange={(e) =>
                                setNewTest({ ...newTest, multipleTestingAwareness: e.target.checked })
                            }
                            className="rounded"
                        />
                        <label htmlFor="multiple-testing" className="text-sm cursor-pointer">
                            I'm aware of multiple testing issues and will adjust p-values if needed
                        </label>
                    </div>

                    {/* Validation Preview */}
                    {(newTest.nullHypothesis || newTest.alternativeHypothesis) && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium mb-2">Validation Preview:</p>
                            <div className="space-y-1 text-sm">
                                {validateTest(newTest).issues.map((issue, i) => (
                                    <p key={i} className="text-red-600 dark:text-red-400">
                                        {issue}
                                    </p>
                                ))}
                                {validateTest(newTest).warnings.map((warning, i) => (
                                    <p key={i} className="text-yellow-600 dark:text-yellow-400">
                                        {warning}
                                    </p>
                                ))}
                                {validateTest(newTest).suggestions.map((suggestion, i) => (
                                    <p key={i} className="text-blue-600 dark:text-blue-400">
                                        {suggestion}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button onClick={addTest} className="w-full">
                        Add Statistical Test
                    </Button>
                </CardContent>
            </Card>

            {/* Tests List */}
            {tests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Your Statistical Tests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tests.map((test) => {
                            const validation = validateTest(test);
                            return (
                                <div key={test.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold">{test.testName}</h4>
                                            <Badge className="mt-1">{test.testType}</Badge>
                                        </div>
                                        {validation.isValid ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="font-medium">H₀:</p>
                                            <p className="text-muted-foreground">{test.nullHypothesis}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">H₁:</p>
                                            <p className="text-muted-foreground">{test.alternativeHypothesis}</p>
                                        </div>
                                        {test.sampleSize > 0 && (
                                            <p>
                                                <strong>Sample Size:</strong> {test.sampleSize}
                                            </p>
                                        )}
                                    </div>

                                    {(validation.issues.length > 0 ||
                                        validation.warnings.length > 0 ||
                                        validation.suggestions.length > 0) && (
                                            <div className="pt-3 border-t space-y-1 text-sm">
                                                {validation.issues.map((issue, i) => (
                                                    <p key={i} className="text-red-600 dark:text-red-400">
                                                        {issue}
                                                    </p>
                                                ))}
                                                {validation.warnings.map((warning, i) => (
                                                    <p key={i} className="text-yellow-600 dark:text-yellow-400">
                                                        {warning}
                                                    </p>
                                                ))}
                                                {validation.suggestions.map((suggestion, i) => (
                                                    <p key={i}>{suggestion}</p>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Common Mistakes */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Common Statistical Testing Mistakes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="text-red-500">❌</span>
                        <div>
                            <p className="font-medium">P-hacking</p>
                            <p className="text-muted-foreground">
                                Running multiple tests until you find significance, then only reporting that one
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="text-red-500">❌</span>
                        <div>
                            <p className="font-medium">Ignoring assumptions</p>
                            <p className="text-muted-foreground">
                                Running parametric tests without checking normality, independence, etc.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="text-red-500">❌</span>
                        <div>
                            <p className="font-medium">Confusing significance with importance</p>
                            <p className="text-muted-foreground">
                                p &lt; 0.05 doesn't mean the effect is large or practically meaningful
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <div>
                            <p className="font-medium">Best Practice</p>
                            <p className="text-muted-foreground">
                                Pre-register your hypotheses, report effect sizes, and plan for non-significant results
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
