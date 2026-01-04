"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicProfileHeader } from "@/components/public-profile/PublicProfileHeader"
import { PublicAboutSection } from "@/components/public-profile/PublicAboutSection"
import { PublicProjectsShowcase } from "@/components/public-profile/PublicProjectsShowcase"
import { PublicSkillsGraph } from "@/components/public-profile/PublicSkillsGraph"
import { PublicActivityTimeline } from "@/components/public-profile/PublicActivityTimeline"
import { PublicProfileFooter } from "@/components/public-profile/PublicProfileFooter"

interface PublicProfileData {
  username: string
  subdomain?: string
  fullName: string
  bio?: string
  tagline?: string
  avatarUrl?: string
  location?: string
  links: {
    portfolio?: string
    github?: string
    linkedin?: string
    twitter?: string
  }
  skills: string[]
  experiences: Array<{
    id: string
    company: string
    role: string
    period?: string
    description?: string
  }>
  education: Array<{
    id: string
    school: string
    course: string
    year?: string
  }>
  projects: Array<{
    id: string
    name: string
    description?: string
    techStack: string[]
    completedAt?: string
  }>
  joinedAt: string
  showEmail: boolean
  email?: string
  allowCvDownload: boolean
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return

      try {
        const response = await fetch(`/api/v1/u/${username}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Profile not found")
          } else if (response.status === 403) {
            setError("This profile is private")
          } else {
            setError("Failed to load profile")
          }
          setLoading(false)
          return
        }

        const data: PublicProfileData = await response.json()
        setProfileData(data)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{error || "Profile not found"}</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or is private.
          </p>
        </div>
      </div>
    )
  }

  // Transform API data to match component props
  const user = {
    username: profileData.username,
    fullName: profileData.fullName,
    avatar: profileData.avatarUrl || "/developer-avatar-portrait.jpg",
    tagline: profileData.tagline || `${profileData.fullName} | Developer`,
    bio: profileData.bio || "",
    country: profileData.location || "",
    languages: [], // Not in API yet
    yearsOfExperience: 0, // Calculate from experiences if needed
    preferredStack: profileData.skills.slice(0, 5),
    links: profileData.links,
    privacy: {
      showProjects: profileData.projects.length > 0,
      showSkills: profileData.skills.length > 0,
      showTimeline: profileData.experiences.length > 0 || profileData.education.length > 0,
      allowCVDownload: profileData.allowCvDownload,
    },
    projects: profileData.projects.map((project, index) => ({
      id: project.id,
      slug: `project-${index}`,
      title: project.name,
      coverImage: "/api-code-terminal-dark.jpg", // Default image
      techStack: project.techStack,
      description: project.description || "",
      issuesFixed: [], // Not in API
    })),
    skills: profileData.skills.map((skill, index) => ({
      name: skill,
      level: 70 + (index % 30), // Mock level for now
      proficiency: "Comfortable" as const,
    })),
    activityTimeline: [
      ...profileData.experiences.map((exp) => ({
        id: exp.id,
        type: "completed" as const,
        message: `${exp.role} at ${exp.company}`,
        date: exp.period || "Recently",
      })),
      ...profileData.education.map((edu) => ({
        id: edu.id,
        type: "started" as const,
        message: `${edu.course} at ${edu.school}`,
        date: edu.year || "Recently",
      })),
    ],
    joinedDate: new Date(profileData.joinedAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    }),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <PublicProfileHeader user={user} />

      <main className="container mx-auto px-6 py-12">
        {/* About Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <PublicAboutSection user={user} />
        </motion.div>

        {/* Projects Showcase */}
        {user.privacy.showProjects && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <PublicProjectsShowcase projects={user.projects} username={user.username} />
          </motion.div>
        )}

        {/* Skills Graph */}
        {user.privacy.showSkills && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <PublicSkillsGraph skills={user.skills} />
          </motion.div>
        )}

        {/* Activity Timeline */}
        {user.privacy.showTimeline && user.activityTimeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <PublicActivityTimeline activities={user.activityTimeline} />
          </motion.div>
        )}

        {/* CV Download Button */}
        {user.privacy.allowCVDownload && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="w-5 h-5" />
              Download CV (PDF)
            </Button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <PublicProfileFooter />
    </div>
  )
}
