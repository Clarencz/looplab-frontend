"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, FileText } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name: string
    avatar: string
    tagline: string
  }
  completionPercentage: number
  onEditProfile: () => void
  onGenerateCV: () => void
}

export function ProfileHeader({ user, completionPercentage, onEditProfile, onGenerateCV }: ProfileHeaderProps) {
  const isProfileComplete = completionPercentage >= 80

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-card via-card to-secondary/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="relative flex items-center justify-between p-8">
        {/* Left side - Avatar and info */}
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-lg">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-mono">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-mono text-foreground">{user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.tagline}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{completionPercentage}% complete</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onEditProfile} className="gap-2 bg-transparent">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button
            size="sm"
            onClick={onGenerateCV}
            disabled={!isProfileComplete}
            className={`gap-2 ${!isProfileComplete ? "opacity-50 cursor-not-allowed" : "glow-button"}`}
          >
            <FileText className="h-4 w-4" />
            Generate CV
          </Button>
        </div>
      </div>
    </div>
  )
}
