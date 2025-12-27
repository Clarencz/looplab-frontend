"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { ArrowLeft, Sprout, Flame, Rocket, Code2, Layout, Layers, Briefcase, GraduationCap } from "lucide-react"

interface ExperienceGoalsStepProps {
  onNext: () => void
  onBack: () => void
}

const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "Just starting out", icon: Sprout },
  { id: "intermediate", label: "Intermediate", description: "Some experience", icon: Flame },
  { id: "advanced", label: "Advanced", description: "Seasoned developer", icon: Rocket },
]

const goals = [
  { id: "backend", label: "Improve Backend", icon: Code2 },
  { id: "frontend", label: "Improve Frontend", icon: Layout },
  { id: "fullstack", label: "Learn Full Stack", icon: Layers },
  { id: "portfolio", label: "Build Portfolio", icon: Briefcase },
  { id: "interviews", label: "Prepare for Interviews", icon: GraduationCap },
]

export function ExperienceGoalsStep({ onNext, onBack }: ExperienceGoalsStepProps) {
  const { onboardingData, updateOnboardingData } = useOnboarding()

  const toggleGoal = (goalId: string) => {
    const updated = onboardingData.goals.includes(goalId)
      ? onboardingData.goals.filter((id) => id !== goalId)
      : [...onboardingData.goals, goalId]
    updateOnboardingData({ goals: updated })
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Experience & Goals</h2>
        <p className="text-muted-foreground">Help us personalize your learning journey</p>
      </div>

      {/* Experience Level */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">Your Experience Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {experienceLevels.map((level) => {
            const Icon = level.icon
            const isSelected = onboardingData.experienceLevel === level.id
            return (
              <button
                key={level.id}
                onClick={() =>
                  updateOnboardingData({ experienceLevel: level.id as "beginner" | "intermediate" | "advanced" })
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold text-foreground">{level.label}</span>
                  <span className="text-xs text-muted-foreground">{level.description}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">What do you want to focus on?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {goals.map((goal) => {
            const Icon = goal.icon
            const isSelected = onboardingData.goals.includes(goal.id)
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="text-sm font-medium text-foreground">{goal.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )
}
