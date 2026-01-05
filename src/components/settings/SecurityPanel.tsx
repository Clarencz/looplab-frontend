"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Shield, Monitor, Smartphone, Laptop, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { TwoFactorSetupModal } from "./TwoFactorSetupModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Session {
  id: string
  deviceInfo: string | null
  deviceType: string | null
  location: string | null
  lastActive: string
  isCurrent?: boolean
}

export function SecurityPanel() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [terminating, setTerminating] = useState<string | null>(null)
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [disableCode, setDisableCode] = useState("")
  const [disabling, setDisabling] = useState(false)

  // Load user 2FA status
  useEffect(() => {
    if (user) {
      // TODO: Add two_factor_enabled to user model
      setTwoFactorEnabled(false) // user.two_factor_enabled || false
    }
  }, [user])

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings/sessions', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Ensure sessions is always an array
        setSessions(Array.isArray(data) ? data : [])
      } else {
        setSessions([])
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    setTerminating(sessionId)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch(`/api/v1/settings/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to terminate session')
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast({
        title: "Session terminated",
        description: "The session has been successfully terminated",
      })
    } catch (error) {
      console.error('Failed to terminate session:', error)
      toast({
        title: "Termination failed",
        description: "Failed to terminate the session",
        variant: "destructive",
      })
    } finally {
      setTerminating(null)
    }
  }

  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      setShowSetupModal(true)
    } else {
      setShowDisableDialog(true)
    }
  }

  const handleDisable2FA = async () => {
    if (disableCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      })
      return
    }

    setDisabling(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ code: disableCode }),
      })

      if (!response.ok) {
        throw new Error('Failed to disable 2FA')
      }

      setTwoFactorEnabled(false)
      setShowDisableDialog(false)
      setDisableCode("")
      await refreshUser()

      toast({
        title: "2FA disabled",
        description: "Two-factor authentication has been disabled",
      })
    } catch (error) {
      console.error('Failed to disable 2FA:', error)
      toast({
        title: "Disable failed",
        description: "Invalid code or failed to disable 2FA",
        variant: "destructive",
      })
    } finally {
      setDisabling(false)
    }
  }

  const handle2FASetupSuccess = async () => {
    setTwoFactorEnabled(true)
    await refreshUser()
  }

  const getDeviceIcon = (type: string | null) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Monitor className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 5) return "Now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-6">
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
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">
                      Two-step verification adds security by requiring both your OAuth login and a code from your authenticator app.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No active sessions found</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {session.deviceInfo || "Unknown Device"}
                        {index === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Current</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location || "Unknown location"} · {formatLastActive(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {index !== 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminating === session.id}
                    >
                      {terminating === session.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Terminate"
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
        onSuccess={handle2FASetupSuccess}
      />

      {/* 2FA Disable Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Two-Factor Authentication?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This will remove the extra layer of security from your account.
              </p>
              <div className="space-y-2">
                <Label htmlFor="disable-code">Enter your 6-digit code to confirm</Label>
                <Input
                  id="disable-code"
                  placeholder="000000"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDisableCode("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable2FA}
              disabled={disableCode.length !== 6 || disabling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {disabling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disable 2FA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
