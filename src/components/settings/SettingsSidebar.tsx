"use client"

import { cn } from "@/lib/utils"
import { User, Lock, Bell, Palette, Settings, Sparkles } from "lucide-react"
import type { SettingsTab } from "@/pages/Settings"

interface SettingsSidebarProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

const tabs = [
  { id: "profile" as const, label: "Profile Settings", icon: User },
  { id: "security" as const, label: "Password & Security", icon: Lock },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "appearance" as const, label: "Appearance", icon: Palette },
  { id: "account" as const, label: "Account Management", icon: Settings },
  { id: "onboarding" as const, label: "Onboarding", icon: Sparkles },
]

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <nav className="w-full md:w-64 shrink-0">
      <div className="bg-card rounded-xl border border-border p-2 shadow-sm">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <li key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-muted/50",
                    isActive && "bg-primary/10 text-primary border-l-2 border-primary",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn(isActive ? "text-primary" : "text-muted-foreground")}>{tab.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
