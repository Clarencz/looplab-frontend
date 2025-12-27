"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Lock, Shield, Monitor, Smartphone, Laptop, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Session {
  id: string
  device: string
  type: "desktop" | "mobile" | "tablet"
  location: string
  lastActive: string
  isCurrent: boolean
}

const mockSessions: Session[] = [
  {
    id: "1",
    device: "Chrome on MacOS",
    type: "desktop",
    location: "San Francisco, CA",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    type: "mobile",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Firefox on Windows",
    type: "desktop",
    location: "New York, NY",
    lastActive: "3 days ago",
    isCurrent: false,
  },
]

export function SecurityPanel() {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoStepEnabled, setTwoStepEnabled] = useState(false)
  const [sessions, setSessions] = useState(mockSessions)

  const passwordsMatch = passwords.newPassword === passwords.confirmPassword && passwords.newPassword.length > 0
  const canSave = passwords.oldPassword.length > 0 && passwordsMatch

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }

  const getDeviceIcon = (type: Session["type"]) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Monitor className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" /> Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, oldPassword: e.target.value }))}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              className={passwords.confirmPassword && !passwordsMatch ? "border-destructive" : ""}
            />
            {passwords.confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
          <Button disabled={!canSave} className="mt-2">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Step Security Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" /> Two-Step Verification
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-sm">Enable Two-Step Verification</p>
                <p className="text-xs text-muted-foreground">
                  Require a verification code when signing in from new devices
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">
                      Two-step verification adds security by requiring both your password and a code sent to your phone.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch checked={twoStepEnabled} onCheckedChange={setTwoStepEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5" /> Active Sessions
          </CardTitle>
          <CardDescription>Manage devices where you're currently signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {getDeviceIcon(session.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {session.device}
                      {session.isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Current</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleTerminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
