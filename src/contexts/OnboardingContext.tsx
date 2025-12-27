"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface OnboardingData {
  name: string
  username: string
  country: string
  bio: string
  avatar: string | null
  techStacks: string[]
  experienceLevel: "beginner" | "intermediate" | "advanced" | null
  goals: string[]
  firstProjectId: string | null
}

interface OnboardingContextType {
  isFirstTimeUser: boolean
  hasCompletedOnboarding: boolean
  onboardingData: OnboardingData
  currentStep: number
  setCurrentStep: (step: number) => void
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  showTour: boolean
  setShowTour: (show: boolean) => void
  tourStep: number
  setTourStep: (step: number) => void
  completeTour: () => void
  tipsEnabled: boolean
  setTipsEnabled: (enabled: boolean) => void
}

const defaultOnboardingData: OnboardingData = {
  name: "",
  username: "",
  country: "",
  bio: "",
  avatar: null,
  techStacks: [],
  experienceLevel: null,
  goals: [],
  firstProjectId: null,
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData)
  const [currentStep, setCurrentStep] = useState(0)
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [tipsEnabled, setTipsEnabled] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("looplab_onboarding")
    if (stored) {
      const data = JSON.parse(stored)
      setHasCompletedOnboarding(data.completed || false)
      setOnboardingData(data.onboardingData || defaultOnboardingData)
      setTipsEnabled(data.tipsEnabled ?? true)
    } else {
      setIsFirstTimeUser(true)
    }
  }, [])

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true)
    setIsFirstTimeUser(false)
    localStorage.setItem(
      "looplab_onboarding",
      JSON.stringify({
        completed: true,
        onboardingData,
        tipsEnabled,
      }),
    )
    setShowTour(true)
  }

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false)
    setIsFirstTimeUser(true)
    setOnboardingData(defaultOnboardingData)
    setCurrentStep(0)
    setTourStep(0)
    localStorage.removeItem("looplab_onboarding")
  }

  const completeTour = () => {
    setShowTour(false)
    setTourStep(0)
  }

  return (
    <OnboardingContext.Provider
      value={{
        isFirstTimeUser,
        hasCompletedOnboarding,
        onboardingData,
        currentStep,
        setCurrentStep,
        updateOnboardingData,
        completeOnboarding,
        resetOnboarding,
        showTour,
        setShowTour,
        tourStep,
        setTourStep,
        completeTour,
        tipsEnabled,
        setTipsEnabled,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}
