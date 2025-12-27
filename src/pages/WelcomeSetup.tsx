"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { SetupStepIndicator } from "@/components/onboarding/SetupStepIndicator"
import { BasicProfileStep } from "@/components/onboarding/BasicProfileStep"
import { TechStackStep } from "@/components/onboarding/TechStackStep"
import { ExperienceGoalsStep } from "@/components/onboarding/ExperienceGoalsStep"
import { FirstProjectStep } from "@/components/onboarding/FirstProjectStep"

const steps = [
  { id: 1, title: "Basic Profile" },
  { id: 2, title: "Tech Stacks" },
  { id: 3, title: "Experience & Goals" },
  { id: 4, title: "First Project" },
]

export default function WelcomeSetup() {
  const navigate = useNavigate()
  const { currentStep, setCurrentStep, completeOnboarding } = useOnboarding()
  const [direction, setDirection] = useState(1)

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
      navigate("/dashboard")
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicProfileStep onNext={goToNextStep} />
      case 1:
        return <TechStackStep onNext={goToNextStep} onBack={goToPrevStep} />
      case 2:
        return <ExperienceGoalsStep onNext={goToNextStep} onBack={goToPrevStep} />
      case 3:
        return <FirstProjectStep onNext={goToNextStep} onBack={goToPrevStep} />
      default:
        return null
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header with Step Indicator */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <SetupStepIndicator steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
