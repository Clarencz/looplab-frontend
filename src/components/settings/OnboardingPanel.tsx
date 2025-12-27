"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useOnboarding } from "@/contexts/OnboardingContext"
import { useNavigate } from "react-router-dom"
import { RotateCcw, Eye, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function OnboardingPanel() {
  const navigate = useNavigate()
  const { tipsEnabled, setTipsEnabled, resetOnboarding, setShowTour } = useOnboarding()
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleRerunOnboarding = () => {
    resetOnboarding()
    navigate("/welcome")
  }

  const handleRetakeTour = () => {
    setShowTour(true)
    navigate("/dashboard")
  }

  const handleClearProgress = () => {
    resetOnboarding()
    setShowClearDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Onboarding</h2>
        <p className="text-sm text-muted-foreground">Manage your onboarding experience and tips</p>
      </div>

      {/* Onboarding Actions Card */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
        {/* Rerun Onboarding */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Rerun Onboarding</h3>
            <p className="text-sm text-muted-foreground">Start the welcome flow from the beginning</p>
          </div>
          <Button variant="outline" onClick={handleRerunOnboarding}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <div className="border-t border-border" />

        {/* Retake Dashboard Tour */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Dashboard Tour</h3>
            <p className="text-sm text-muted-foreground">Take the guided tour of the dashboard again</p>
          </div>
          <Button variant="outline" onClick={handleRetakeTour}>
            <Eye className="w-4 h-4 mr-2" />
            Take Tour
          </Button>
        </div>

        <div className="border-t border-border" />

        {/* Enable/Disable Tips */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Show Tips</h3>
            <p className="text-sm text-muted-foreground">Display helpful tips throughout the app</p>
          </div>
          <Switch checked={tipsEnabled} onCheckedChange={setTipsEnabled} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl border border-destructive/30 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-destructive mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-foreground">Clear Onboarding Progress</h4>
            <p className="text-sm text-muted-foreground">Reset all onboarding data and start fresh</p>
          </div>
          <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Onboarding Progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your onboarding data including profile setup, selected tech stacks, and goals.
                  You'll need to complete the onboarding again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearProgress}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear Progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
