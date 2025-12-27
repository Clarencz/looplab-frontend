"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Globe, Twitter, MapPin, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PublicProfileHeaderProps {
  user: {
    username: string
    fullName: string
    avatar: string
    tagline: string
    country: string
    joinedDate: string
    links: {
      portfolio?: string
      github?: string
      linkedin?: string
      twitter?: string
    }
  }
}

export function PublicProfileHeader({ user }: PublicProfileHeaderProps) {
  return (
    <header className="relative bg-gradient-to-b from-muted/50 to-background border-b border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          {/* Avatar */}
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback className="text-3xl font-mono bg-primary text-primary-foreground">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Name & Username */}
          <h1 className="mt-6 text-3xl font-bold text-foreground">{user.fullName}</h1>
          <p className="mt-1 text-muted-foreground font-mono">@{user.username}</p>

          {/* Tagline */}
          {user.tagline && <p className="mt-3 text-lg text-muted-foreground max-w-lg">{user.tagline}</p>}

          {/* Location & Joined */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {user.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.country}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {user.joinedDate}
            </span>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-3">
            {user.links.portfolio && (
              <a
                href={user.links.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Portfolio"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
            {user.links.github && (
              <a
                href={user.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {user.links.linkedin && (
              <a
                href={user.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {user.links.twitter && (
              <a
                href={user.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Future: Follow Button */}
          {/* <Button variant="outline" className="mt-6 bg-transparent">Follow</Button> */}
        </motion.div>
      </div>
    </header>
  )
}
