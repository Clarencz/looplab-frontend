"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { PersonalInfoCard } from "@/components/profile/PersonalInfoCard"
import { ProfessionalSummaryCard } from "@/components/profile/ProfessionalSummaryCard"
import { SkillsCard } from "@/components/profile/SkillsCard"
import { ExperienceCard } from "@/components/profile/ExperienceCard"
import { EducationCard } from "@/components/profile/EducationCard"
import { ProjectTimeline } from "@/components/profile/ProjectTimeline"
import { CVPreviewPanel } from "@/components/profile/CVPreviewPanel"
import { CVGenerateModal } from "@/components/profile/CVGenerateModal"
import { getUserPaths, type UserPathsResponse } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

// Sample projects data - would come from backend in real app
const sampleProjects = [
  {
    id: "1",
    title: "REST API with Node.js",
    techStack: ["Node.js", "Express", "MongoDB"],
    status: "completed" as const,
    summary: "Built a full REST API with authentication, CRUD operations, and proper error handling.",
    completedAt: "Dec 15, 2024",
  },
  {
    id: "2",
    title: "React Dashboard",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    status: "completed" as const,
    summary: "Created an interactive dashboard with charts, data tables, and responsive design.",
    completedAt: "Dec 10, 2024",
  },
  {
    id: "3",
    title: "CLI Task Manager",
    techStack: ["Python", "Click", "SQLite"],
    status: "in-progress" as const,
    summary: "Building a command-line task management tool with persistent storage.",
  },
]

const loopLabSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "REST APIs"]

export default function Profile() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showCVModal, setShowCVModal] = useState(false)
  const [userPaths, setUserPaths] = useState<UserPathsResponse | null>(null)
  const [loadingPaths, setLoadingPaths] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      loadUserPaths()
    }
  }, [authLoading, user])

  const loadUserPaths = async () => {
    try {
      const data = await getUserPaths()
      setUserPaths(data)
    } catch (error) {
      console.error('Failed to load user paths:', error)
    } finally {
      setLoadingPaths(false)
    }
  }

  // Initialize profile state from user data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  })

  const [summary, setSummary] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])

  // Update state when user data loads
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.profile?.full_name || user.username || "",
        email: user.email || "",
        phone: "",
        location: user.profile?.location || "",
        linkedin: user.profile?.links?.linkedin || "",
        github: user.profile?.links?.github || "",
        portfolio: user.profile?.website || "",
      })
      setSummary(user.profile?.bio || "")
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/users/me/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: personalInfo.fullName,
          bio: summary,
          location: personalInfo.location,
          website: personalInfo.portfolio,
          links: {
            github: personalInfo.github,
            linkedin: personalInfo.linkedin,
            twitter: user.profile?.links?.twitter || "",
          },
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        // Could show success toast here
      } else {
        console.error('Failed to update profile')
        // Could show error toast here
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // ProtectedRoute will handle redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <ProfileHeader
          user={{
            name: user.username || "User",
            avatar: user.profile?.avatar_url || "/developer-avatar-portrait.jpg",
            tagline: user.profile?.bio || "Developer | Building with LoopLab",
          }}
          completionPercentage={
            ((personalInfo.fullName ? 1 : 0) +
              (personalInfo.email ? 1 : 0) +
              (summary ? 1 : 0) +
              (skills.length > 0 || loopLabSkills.length > 0 ? 1 : 0) +
              (experiences.length > 0 ? 1 : 0) +
              (education.length > 0 ? 1 : 0) +
              (sampleProjects.length > 0 ? 1 : 0)) /
            7 *
            100
          }
          onEditProfile={() => setIsEditing(!isEditing)}
          onGenerateCV={() => setShowCVModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoCard
              data={personalInfo}
              isEditing={isEditing}
              onChange={setPersonalInfo}
            />

            <ProfessionalSummaryCard
              summary={summary}
              isEditing={isEditing}
              onChange={setSummary}
            />

            <SkillsCard
              skills={skills}
              loopLabSkills={loopLabSkills}
              isEditing={isEditing}
              onChange={setSkills}
            />

            <ExperienceCard
              experiences={experiences}
              isEditing={isEditing}
              onChange={setExperiences}
            />

            <EducationCard
              education={education}
              isEditing={isEditing}
              onChange={setEducation}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Learning Paths Progress */}
            {!loadingPaths && userPaths && (userPaths.activePaths.length > 0 || userPaths.completedPaths.length > 0) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <CardTitle>Learning Paths</CardTitle>
                  </div>
                  <CardDescription>Your progress in structured learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userPaths.activePaths.map((path) => (
                    <div key={path.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{path.title}</span>
                        <Badge variant="secondary">{path.progress?.percentage || 0}%</Badge>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${path.progress?.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {userPaths.completedPaths.map((path) => (
                    <div key={path.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="text-sm">{path.title}</span>
                      </div>
                      <Badge>Completed</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Project Timeline */}
            <ProjectTimeline projects={sampleProjects} />

            {/* CV Preview Panel */}
            <CVPreviewPanel
              profileData={{
                personalInfo,
                summary,
                skills,
                loopLabSkills,
                experiences,
                education,
                projects: sampleProjects,
              }}
              completionPercentage={
                ((personalInfo.fullName ? 1 : 0) +
                  (personalInfo.email ? 1 : 0) +
                  (summary ? 1 : 0) +
                  (skills.length > 0 || loopLabSkills.length > 0 ? 1 : 0) +
                  (experiences.length > 0 ? 1 : 0) +
                  (education.length > 0 ? 1 : 0) +
                  (sampleProjects.length > 0 ? 1 : 0)) /
                7 *
                100
              }
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* CV Generation Modal */}
      <CVGenerateModal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        completionStatus={{
          personalInfo: !!(personalInfo.fullName && personalInfo.email),
          skills: skills.length > 0 || loopLabSkills.length > 0,
          projects: sampleProjects.length > 0,
          summary: !!summary,
          education: education.length > 0,
        }}
      />
    </div>
  )
}
