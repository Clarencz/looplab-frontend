"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Download, Trash2, Loader2 } from "lucide-react"
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
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export function AccountPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canDelete = deleteConfirmation === user?.username

  const handleExportData = async () => {
    setExporting(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings/export', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to request data export')
      }

      toast({
        title: "Export requested",
        description: "Your data export has been requested. You'll receive an email with a download link shortly.",
      })
    } catch (error) {
      console.error('Failed to export data:', error)
      toast({
        title: "Export failed",
        description: "Failed to request data export. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/settings/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      })

      // Clear local storage and redirect to home
      localStorage.clear()
      navigate('/')
    } catch (error) {
      console.error('Failed to delete account:', error)
      toast({
        title: "Deletion failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Status Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Account Status</CardTitle>
          <CardDescription>Your LoopLab account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Account Type</span>
            <Badge variant="secondary">Free</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Account ID</span>
            <span className="text-sm font-mono text-muted-foreground">{user.id.slice(0, 13)}...</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Export Data Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Export My Data</CardTitle>
          <CardDescription>Download a copy of your LoopLab data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Export includes your profile information, project history, achievements, and CV data. The export will be
            prepared and sent to your email.
          </p>
          <Button variant="outline" onClick={handleExportData} disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Request Data Export
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card className="shadow-sm border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
            <h4 className="font-medium text-sm mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-4">
                    <p>
                      This action cannot be undone. This will permanently delete your account and remove all of your
                      data from our servers.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-delete" className="text-foreground">
                        Type <span className="font-mono font-bold">{user.username}</span> to confirm
                      </Label>
                      <Input
                        id="confirm-delete"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="Enter your username"
                        className="border-destructive/50 focus-visible:ring-destructive/30"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!canDelete || deleting}
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
