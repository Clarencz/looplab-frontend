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

      <div className="relative flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
        {/* Left side - Avatar and info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/30 shadow-lg flex-shrink-0">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl sm:text-2xl font-mono">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 sm:space-y-2 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-foreground truncate">{user.name}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{user.tagline}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="h-2 w-24 sm:w-32 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{completionPercentage}% complete</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onEditProfile} className="gap-1.5 sm:gap-2 bg-transparent text-xs sm:text-sm">
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Edit Profile</span>
            <span className="xs:hidden">Edit</span>
          </Button>
          <Button
            size="sm"
            onClick={onGenerateCV}
            disabled={!isProfileComplete}
            className={`gap-1.5 sm:gap-2 text-xs sm:text-sm ${!isProfileComplete ? "opacity-50 cursor-not-allowed" : "glow-button"}`}
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Preview CV</span>
            <span className="xs:hidden">CV</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
