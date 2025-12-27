"use client"

import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function PublicProfileFooter() {
  const [reportReason, setReportReason] = useState("")

  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">© 2025 LoopLab. All rights reserved.</p>

          {/* Powered by */}
          <p className="text-sm text-muted-foreground font-mono">
            Powered by <span className="text-primary font-semibold">LoopLab</span>
          </p>

          {/* Report Profile */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
                <Flag className="w-4 h-4" />
                Report Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Profile</DialogTitle>
                <DialogDescription>
                  If you believe this profile violates our community guidelines, please let us know.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for report</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe why you're reporting this profile..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  )
}
