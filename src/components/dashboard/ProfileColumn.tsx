"use client"

import { useState, useEffect } from "react"
import { Flame, Trophy } from "lucide-react"

interface ProfileColumnProps {
  user: {
    avatar: string
    username: string
    tagline: string
    weeklyStreak: number
    projectsThisMonth: number
    projectsGoal: number
  }
}

export function ProfileColumn({ user }: ProfileColumnProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const progressPercent = Math.min((user.projectsThisMonth / user.projectsGoal) * 100, 100)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="w-64 flex-shrink-0">
      <div className={`sticky top-6 transition-all duration-300 ${isScrolled ? "pt-0" : "pt-0"}`}>
        {/* Avatar */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            isScrolled ? "flex-row gap-3" : "flex-col"
          }`}
        >
          <div
            className={`relative rounded-full overflow-hidden border-2 border-primary/30 transition-all duration-300 ${
              isScrolled ? "w-12 h-12" : "w-28 h-28"
            }`}
          >
            <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          </div>

          <div className={`transition-all duration-300 ${isScrolled ? "text-left" : "text-center mt-4"}`}>
            <h2
              className={`font-mono font-bold text-foreground transition-all duration-300 ${
                isScrolled ? "text-base" : "text-xl"
              }`}
            >
              {user.username}
            </h2>
            {!isScrolled && <p className="text-sm text-muted-foreground mt-1">{user.tagline}</p>}
          </div>
        </div>

        {/* Stats - Hidden when scrolled */}
        <div
          className={`mt-6 space-y-4 transition-all duration-300 ${
            isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          {/* Weekly Streak */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-foreground">{user.weeklyStreak}</p>
              <p className="text-xs text-muted-foreground">Week Streak</p>
            </div>
          </div>

          {/* Projects This Month - Progress Ring */}
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Projects This Month</span>
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-4">
              {/* Progress Ring */}
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 1.76} 176`}
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-mono font-bold text-foreground">{user.projectsThisMonth}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">of {user.projectsGoal} goal</p>
                <p className="text-xs text-primary mt-1">{Math.round(progressPercent)}% complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
