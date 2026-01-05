"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail, Bell, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface NotificationPreferences {
  email: {
    projectUpdates: boolean
    accountActivity: boolean
    weeklyProgress: boolean
    newProjects: boolean
  }
  inApp: {
    challengeReminders: boolean
    aiFeedback: boolean
    systemUpdates: boolean
  }
}

export function NotificationsPanel() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      projectUpdates: true,
      accountActivity: true,
      weeklyProgress: false,
      newProjects: true,
    },
    inApp: {
      challengeReminders: true,
      aiFeedback: true,
      systemUpdates: false,
    },
  })

  // Load settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.notifications) {
          setPreferences(data.notifications)
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (newPreferences: NotificationPreferences) => {
    setSaving(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          notifications: newPreferences,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: "Update failed",
        description: "Failed to save notification preferences",
        variant: "destructive",
      })
      // Revert on error
      fetchSettings()
    } finally {
      setSaving(false)
    }
  }

  const toggleEmailSetting = (key: keyof NotificationPreferences['email']) => {
    const newPreferences = {
      ...preferences,
      email: {
        ...preferences.email,
        [key]: !preferences.email[key],
      },
    }
    setPreferences(newPreferences)
    saveSettings(newPreferences)
  }

  const toggleInAppSetting = (key: keyof NotificationPreferences['inApp']) => {
    const newPreferences = {
      ...preferences,
      inApp: {
        ...preferences.inApp,
        [key]: !preferences.inApp[key],
      },
    }
    setPreferences(newPreferences)
    saveSettings(newPreferences)
  }

  const emailSettings: NotificationSetting[] = [
    {
      id: "projectUpdates",
      label: "Project submission updates",
      description: "Get notified when your projects are reviewed",
      enabled: preferences.email.projectUpdates,
    },
    {
      id: "accountActivity",
      label: "Account activity",
      description: "Security alerts and account changes",
      enabled: preferences.email.accountActivity,
    },
    {
      id: "weeklyProgress",
      label: "Weekly progress summaries",
      description: "Receive a weekly digest of your activity",
      enabled: preferences.email.weeklyProgress,
    },
    {
      id: "newProjects",
      label: "New project releases",
      description: "Be the first to know about new challenges",
      enabled: preferences.email.newProjects,
    },
  ]

  const inAppSettings: NotificationSetting[] = [
    {
      id: "challengeReminders",
      label: "Challenge reminders",
      description: "Reminders about ongoing challenges",
      enabled: preferences.inApp.challengeReminders,
    },
    {
      id: "aiFeedback",
      label: "AI feedback messages",
      description: "Notifications when AI reviews are ready",
      enabled: preferences.inApp.aiFeedback,
    },
    {
      id: "systemUpdates",
      label: "System updates",
      description: "Important platform announcements",
      enabled: preferences.inApp.systemUpdates,
    },
  ]

  const NotificationItem = ({
    setting,
    onToggle,
    disabled,
  }: {
    setting: NotificationSetting
    onToggle: (id: string) => void
    disabled?: boolean
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
      <Switch
        id={setting.id}
        checked={setting.enabled}
        onCheckedChange={() => onToggle(setting.id)}
        disabled={disabled}
      />
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" /> Email Notifications
              </CardTitle>
              <CardDescription>Choose what updates you receive via email</CardDescription>
            </div>
            {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {emailSettings.map((setting) => (
              <NotificationItem
                key={setting.id}
                setting={setting}
                onToggle={toggleEmailSetting}
                disabled={saving}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" /> In-App Notifications
              </CardTitle>
              <CardDescription>Control notifications within LoopLab</CardDescription>
            </div>
            {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {inAppSettings.map((setting) => (
              <NotificationItem
                key={setting.id}
                setting={setting}
                onToggle={toggleInAppSetting}
                disabled={saving}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
