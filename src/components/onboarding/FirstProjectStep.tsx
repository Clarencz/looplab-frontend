"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { ArrowLeft, Check } from "lucide-react"

interface FirstProjectStepProps {
  onNext: () => void
  onBack: () => void
}

const starterProjects = [
  {
    id: "todo-app",
    title: "Build a TODO App",
    description: "Classic starter project with CRUD operations and local storage",
    image: "/dashboard-ui-design-dark.jpg",
    difficulty: "Beginner",
    techStack: ["React", "TypeScript"],
  },
  {
    id: "api-database",
    title: "API + Database Mini-App",
    description: "Build a REST API with database integration and authentication",
    image: "/api-code-terminal-dark.jpg",
    difficulty: "Intermediate",
    techStack: ["Node.js", "PostgreSQL"],
  },
  {
    id: "react-bugs",
    title: "Fix Bugs in React App",
    description: "Debug and fix issues in an existing React application",
    image: "/blog-writing-platform-dark.jpg",
    difficulty: "Intermediate",
    techStack: ["React", "JavaScript"],
  },
  {
    id: "fullstack-app",
    title: "Small Full-Stack App",
    description: "Complete full-stack application with frontend and backend",
    image: "/portfolio-website-dark.jpg",
    difficulty: "Advanced",
    techStack: ["Next.js", "Prisma"],
  },
]

export function FirstProjectStep({ onNext, onBack }: FirstProjectStepProps) {
  const { onboardingData, updateOnboardingData } = useOnboarding()

  const selectProject = (projectId: string) => {
    updateOnboardingData({ firstProjectId: projectId })
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Pick Your First Project</h2>
        <p className="text-muted-foreground">Choose a starter project to begin your journey</p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {starterProjects.map((project) => {
          const isSelected = onboardingData.firstProjectId === project.id
          return (
            <button
              key={project.id}
              onClick={() => selectProject(project.id)}
              className={cn(
                "relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200",
                isSelected
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50",
              )}
            >
              {/* Project Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Difficulty Badge */}
                <span
                  className={cn(
                    "absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium",
                    project.difficulty === "Beginner"
                      ? "bg-green-500/90 text-white"
                      : project.difficulty === "Intermediate"
                        ? "bg-yellow-500/90 text-black"
                        : "bg-red-500/90 text-white",
                  )}
                >
                  {project.difficulty}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} className="flex-1" disabled={!onboardingData.firstProjectId}>
          Add to Dashboard & Start
        </Button>
      </div>
    </div>
  )
}
