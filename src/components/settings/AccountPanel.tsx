"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Download, Trash2 } from "lucide-react"
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

export function AccountPanel() {
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const username = "alexcoder"

  const canDelete = deleteConfirmation === username

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
            <span className="text-sm font-medium">November 15, 2024</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Account ID</span>
            <span className="text-sm font-mono text-muted-foreground">usr_a1b2c3d4e5</span>
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Request Data Export
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
                        Type <span className="font-mono font-bold">{username}</span> to confirm
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
                    disabled={!canDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
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
