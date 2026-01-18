"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { SettingsSidebar } from "@/components/settings/SettingsSidebar"
import { SecurityPanel } from "@/components/settings/SecurityPanel"
import { NotificationsPanel } from "@/components/settings/NotificationsPanel"
import { AppearancePanel } from "@/components/settings/AppearancePanel"
import { AccountPanel } from "@/components/settings/AccountPanel"
import { OnboardingPanel } from "@/components/settings/OnboardingPanel"

export type SettingsTab = "security" | "notifications" | "appearance" | "account" | "onboarding"

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("security")

  const renderPanel = () => {
    switch (activeTab) {
      case "security":
        return <SecurityPanel />
      case "notifications":
        return <NotificationsPanel />
      case "appearance":
        return <AppearancePanel />
      case "account":
        return <AccountPanel />
      case "onboarding":
        return <OnboardingPanel />
      default:
        return <SecurityPanel />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-mono text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and configurations</p>
          </div>

          {/* Settings Layout: Sidebar + Content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar */}
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Right Content Panel */}
            <div className="flex-1 min-w-0">{renderPanel()}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
