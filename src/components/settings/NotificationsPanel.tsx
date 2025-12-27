"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail, Bell } from "lucide-react"
import { motion } from "framer-motion"

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

export function NotificationsPanel() {
  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: "project-updates",
      label: "Project submission updates",
      description: "Get notified when your projects are reviewed",
      enabled: true,
    },
    {
      id: "account-activity",
      label: "Account activity",
      description: "Security alerts and account changes",
      enabled: true,
    },
    {
      id: "weekly-progress",
      label: "Weekly progress summaries",
      description: "Receive a weekly digest of your activity",
      enabled: false,
    },
    {
      id: "new-projects",
      label: "New project releases",
      description: "Be the first to know about new challenges",
      enabled: true,
    },
  ])

  const [inAppNotifications, setInAppNotifications] = useState<NotificationSetting[]>([
    {
      id: "challenge-reminders",
      label: "Challenge reminders",
      description: "Reminders about ongoing challenges",
      enabled: true,
    },
    {
      id: "ai-feedback",
      label: "AI feedback messages",
      description: "Notifications when AI reviews are ready",
      enabled: true,
    },
    { id: "system-updates", label: "System updates", description: "Important platform announcements", enabled: false },
  ])

  const toggleEmailSetting = (id: string) => {
    setEmailNotifications((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const toggleInAppSetting = (id: string) => {
    setInAppNotifications((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const NotificationItem = ({
    setting,
    onToggle,
  }: {
    setting: NotificationSetting
    onToggle: (id: string) => void
  }) => (
    <motion.div
      className="flex items-center justify-between py-4 border-b border-border last:border-0"
      initial={false}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-0.5">
        <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
          {setting.label}
        </Label>
        <p className="text-xs text-muted-foreground">{setting.description}</p>
      </div>
      <Switch id={setting.id} checked={setting.enabled} onCheckedChange={() => onToggle(setting.id)} />
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" /> Email Notifications
          </CardTitle>
          <CardDescription>Choose what updates you receive via email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {emailNotifications.map((setting) => (
              <NotificationItem key={setting.id} setting={setting} onToggle={toggleEmailSetting} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" /> In-App Notifications
          </CardTitle>
          <CardDescription>Control notifications within LoopLab</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {inAppNotifications.map((setting) => (
              <NotificationItem key={setting.id} setting={setting} onToggle={toggleInAppSetting} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
