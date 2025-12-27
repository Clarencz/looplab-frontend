"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { ArrowLeft } from "lucide-react"

interface TechStackStepProps {
  onNext: () => void
  onBack: () => void
}

const techStacks = [
  { id: "javascript", label: "JavaScript", icon: "JS", color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
  { id: "typescript", label: "TypeScript", icon: "TS", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { id: "python", label: "Python", icon: "PY", color: "bg-green-500/20 text-green-600 border-green-500/30" },
  { id: "java", label: "Java", icon: "JV", color: "bg-red-500/20 text-red-600 border-red-500/30" },
  { id: "rust", label: "Rust", icon: "RS", color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
  { id: "go", label: "Go", icon: "GO", color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
  { id: "csharp", label: "C#", icon: "C#", color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  { id: "flutter", label: "Flutter", icon: "FL", color: "bg-sky-500/20 text-sky-600 border-sky-500/30" },
  { id: "react", label: "React", icon: "RE", color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
  { id: "nextjs", label: "Next.js", icon: "NX", color: "bg-foreground/10 text-foreground border-foreground/20" },
  { id: "vue", label: "Vue", icon: "VU", color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
  { id: "angular", label: "Angular", icon: "NG", color: "bg-red-500/20 text-red-600 border-red-500/30" },
  { id: "nodejs", label: "Node.js", icon: "ND", color: "bg-green-500/20 text-green-600 border-green-500/30" },
  { id: "mongodb", label: "MongoDB", icon: "MG", color: "bg-green-500/20 text-green-600 border-green-500/30" },
  { id: "postgresql", label: "PostgreSQL", icon: "PG", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { id: "docker", label: "Docker", icon: "DK", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
]

export function TechStackStep({ onNext, onBack }: TechStackStepProps) {
  const { onboardingData, updateOnboardingData } = useOnboarding()
  const selectedStacks = onboardingData.techStacks

  const toggleStack = (stackId: string) => {
    const updated = selectedStacks.includes(stackId)
      ? selectedStacks.filter((id) => id !== stackId)
      : [...selectedStacks, stackId]
    updateOnboardingData({ techStacks: updated })
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Tech Stacks</h2>
        <p className="text-muted-foreground">Choose the technologies you know or want to learn</p>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {techStacks.map((stack) => {
          const isSelected = selectedStacks.includes(stack.id)
          return (
            <button
              key={stack.id}
              onClick={() => toggleStack(stack.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm border",
                  stack.color,
                )}
              >
                {stack.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{stack.label}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Count */}
      <div className="text-center mb-6">
        <span className="text-sm text-muted-foreground">{selectedStacks.length} selected</span>
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
