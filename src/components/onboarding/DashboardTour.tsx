"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { X, ArrowRight, ArrowLeft } from "lucide-react"

const tourSteps = [
  {
    id: 1,
    target: "sidebar",
    title: "Navigation Sidebar",
    description: "Navigate between Dashboard, Projects, Profile, and Settings.",
    position: { top: "120px", left: "280px" },
    arrowDirection: "left",
  },
  {
    id: 2,
    target: "projects-grid",
    title: "Projects Grid",
    description: "Here you'll find all your projects with images, stack tags, and summaries.",
    position: { top: "300px", left: "50%" },
    arrowDirection: "top",
  },
  {
    id: 3,
    target: "start-button",
    title: "Start Button",
    description: "Click 'Start' on any project to open the built-in code sandbox.",
    position: { top: "400px", left: "40%" },
    arrowDirection: "top",
  },
  {
    id: 4,
    target: "skills-web",
    title: "Skills Graph",
    description: "Your skills graph updates automatically as you complete challenges.",
    position: { bottom: "200px", left: "50%" },
    arrowDirection: "bottom",
  },
  {
    id: 5,
    target: "public-profile",
    title: "Public Profile",
    description: "Your work appears at /u/:username—share it with anyone.",
    position: { top: "80px", right: "100px" },
    arrowDirection: "right",
  },
]

export function DashboardTour() {
  const { showTour, tourStep, setTourStep, completeTour } = useOnboarding()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !showTour) return null

  const currentStep = tourSteps[tourStep]
  const isLastStep = tourStep === tourSteps.length - 1
  const isFirstStep = tourStep === 0

  const handleNext = () => {
    if (isLastStep) {
      completeTour()
    } else {
      setTourStep(tourStep + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setTourStep(tourStep - 1)
    }
  }

  const handleSkip = () => {
    completeTour()
  }

  return (
    <AnimatePresence>
      {showTour && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleSkip}
          />

          {/* Tour Tooltip */}
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-50 w-80 bg-card rounded-xl border border-border shadow-2xl p-5"
            style={{
              top: currentStep.position.top,
              left: currentStep.position.left,
              right: currentStep.position.right,
              bottom: currentStep.position.bottom,
              transform: currentStep.position.left === "50%" ? "translateX(-50%)" : undefined,
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step Counter */}
            <div className="flex items-center gap-2 mb-3">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === tourStep ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-foreground mb-2">{currentStep.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button size="sm" onClick={handleNext}>
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
