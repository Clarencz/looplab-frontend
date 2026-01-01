import { CategoryValidationResult } from "@/lib/api/types"
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ValidationResultsProps {
    result: CategoryValidationResult
    onRedo?: () => void
    onGetHelp?: () => void
}

export function ValidationResults({ result, onRedo, onGetHelp }: ValidationResultsProps) {
    const { passed, score, criteriaResults, insights, categorySlug } = result

    // Calculate criteria stats
    const totalCriteria = Object.keys(criteriaResults).length
    const passedCriteria = Object.values(criteriaResults).filter(Boolean).length
    const passRate = totalCriteria > 0 ? (passedCriteria / totalCriteria) * 100 : 0

    return (
        <Card className={`border-2 ${passed ? "border-green-500" : "border-red-500"}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {passed ? (
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                            <XCircle className="h-8 w-8 text-red-500" />
                        )}
                        <div>
                            <CardTitle className="text-2xl">
                                {passed ? "Validation Passed! 🎉" : "Validation Failed"}
                            </CardTitle>
                            <CardDescription>
                                Category: <Badge variant="outline">{categorySlug}</Badge>
                            </CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{score}%</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Criteria Passed</span>
                        <span className="font-medium">
                            {passedCriteria} / {totalCriteria}
                        </span>
                    </div>
                    <Progress value={passRate} className="h-3" />
                </div>

                {/* Criteria Results */}
                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Validation Criteria
                    </h3>
                    <div className="grid gap-2">
                        {Object.entries(criteriaResults).map(([criterion, isPassed]) => (
                            <div
                                key={criterion}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                                <span className="text-sm font-medium capitalize">
                                    {criterion.replace(/_/g, " ")}
                                </span>
                                {isPassed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights */}
                {insights.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Insights & Suggestions
                        </h3>
                        <div className="space-y-2">
                            {insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                                >
                                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                        {insight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    {onRedo && (
                        <Button onClick={onRedo} variant="outline" className="flex-1">
                            Try Again
                        </Button>
                    )}
                    {onGetHelp && !passed && (
                        <Button onClick={onGetHelp} className="flex-1">
                            Get AI Help 🤖
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
