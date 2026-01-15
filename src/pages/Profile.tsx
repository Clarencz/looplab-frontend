"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { PersonalInfoCard } from "@/components/profile/PersonalInfoCard"
import { ProfessionalSummaryCard } from "@/components/profile/ProfessionalSummaryCard"
import { SkillsCard } from "@/components/profile/SkillsCard"
import { ExperienceCard } from "@/components/profile/ExperienceCard"
import { EducationCard } from "@/components/profile/EducationCard"
import { ProjectTimeline } from "@/components/profile/ProjectTimeline"
import { CVPreviewOverlay } from "@/components/profile/CVPreviewOverlay"
import { AvatarUpload } from "@/components/profile/AvatarUpload"
import { PrivacySettingsCard } from "@/components/profile/PrivacySettingsCard"
import { BadgesCard } from "@/components/profile/BadgesCard"
import { getUserPaths, userProjectsApi, type UserPathsResponse } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, BookOpen, Loader2, Save } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { profileFormSchema, type ProfileFormValues } from "@/lib/validation/profileValidation"

// Project type for timeline display
interface UserProjectDisplay {
  id: string
  title: string
  techStack: string[]
  status: "completed" | "in-progress"
  summary: string
  completedAt?: string
}

export default function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCVPreview, setShowCVPreview] = useState(false)
  const [userPaths, setUserPaths] = useState<UserPathsResponse | null>(null)
  const [loadingPaths, setLoadingPaths] = useState(true)
  const [userProjects, setUserProjects] = useState<UserProjectDisplay[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  // Derive skills from completed projects
  const [derivedSkills, setDerivedSkills] = useState<string[]>([])

  // Initialize react-hook-form with Zod validation
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      subdomain: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
      skills: [],
      experiences: [],
      education: [],
    },
  })

  useEffect(() => {
    if (!authLoading && user) {
      loadUserPaths()
      loadUserProjects()
      loadProfileData()
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

  const loadUserProjects = async () => {
    try {
      const response = await userProjectsApi.list()
      // Transform to display format
      const projects: UserProjectDisplay[] = (response.data || []).map((up: any) => ({
        id: up.id,
        title: up.project?.name || 'Untitled Project',
        techStack: (up.project?.tech_stack || []).map((ts: any) => ts.name || ts.id),
        status: up.status === 'completed' ? 'completed' : 'in-progress',
        summary: up.project?.description || '',
        completedAt: up.completed_at ? new Date(up.completed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) : undefined,
      }))
      setUserProjects(projects)

      // Derive skills from completed project tech stacks
      const allSkills = new Set<string>()
      projects.filter(p => p.status === 'completed').forEach(p => {
        p.techStack.forEach(skill => allSkills.add(skill))
      })
      setDerivedSkills(Array.from(allSkills))
    } catch (error) {
      console.error('Failed to load user projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const loadProfileData = async () => {
    if (!user) return

    try {
      const accessToken = localStorage.getItem('access_token')

      // Load experiences
      const expResponse = await fetch('/api/v1/profile/experiences', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      })
      const experiences = expResponse.ok ? await expResponse.json() : []

      // Load education
      const eduResponse = await fetch('/api/v1/profile/education', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      })
      const education = eduResponse.ok ? await eduResponse.json() : []

      // Load skills
      const skillsResponse = await fetch('/api/v1/profile/skills', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        credentials: 'include',
      })
      const skillsData = skillsResponse.ok ? await skillsResponse.json() : []
      const manualSkills = skillsData.filter((s: any) => s.source === 'manual').map((s: any) => s.skillName)

      // Initialize form with loaded data
      methods.reset({
        fullName: user.profile?.full_name || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.profile?.location || "",
        subdomain: user.subdomain || "",
        linkedin: user.profile?.links?.linkedin || "",
        github: user.profile?.links?.github || "",
        portfolio: user.profile?.website || "",
        summary: user.profile?.bio || "",
        skills: manualSkills,
        experiences: experiences.map((exp: any) => ({
          title: exp.role,
          company: exp.company,
          timeline: exp.period || "",
          description: exp.description || "",
        })),
        education: education.map((edu: any) => ({
          school: edu.school,
          course: edu.course,
          year: edu.year || "",
        })),
      })
    } catch (error) {
      console.error('Failed to load profile data:', error)
    }
  }

  // Update form when user data loads (only on initial mount)
  const formInitialized = useRef(false)

  useEffect(() => {
    if (user && !formInitialized.current) {
      // Initial form setup is now handled by loadProfileData
      formInitialized.current = true
    }
  }, [user, methods])

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return
    setIsSaving(true)

    try {
      const accessToken = localStorage.getItem('access_token')

      // Save basic profile data
      const profileResponse = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: data.fullName,
          bio: data.summary,
          location: data.location,
          website: data.portfolio,
          links: {
            github: data.github,
            linkedin: data.linkedin,
            twitter: user.profile?.links?.twitter || "",
          },
        }),
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile')
      }

      // Save phone number
      if (data.phone) {
        await fetch('/api/v1/profile/phone', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({ phone: data.phone }),
        })
      }

      // Save experiences
      if (data.experiences && data.experiences.length > 0) {
        await fetch('/api/v1/profile/experiences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            experiences: data.experiences.map(exp => ({
              company: exp.company,
              role: exp.title,
              period: exp.timeline,
              description: exp.description,
            }))
          }),
        })
      }

      // Save education
      if (data.education && data.education.length > 0) {
        await fetch('/api/v1/profile/education', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            education: data.education.map(edu => ({
              school: edu.school,
              course: edu.course,
              year: edu.year,
            }))
          }),
        })
      }

      // Save manual skills
      if (data.skills && data.skills.length > 0) {
        await fetch('/api/v1/profile/skills', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            skills: data.skills.map(skill => ({ skill_name: skill }))
          }),
        })
      }

      // Save subdomain
      if (data.subdomain) {
        await fetch('/api/v1/profile/subdomain', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({ subdomain: data.subdomain }),
        })
      }

      // Refresh user data from backend in the background
      refreshUser().catch(err => console.error('Failed to refresh user:', err))

      // Keep the form values as they are (don't reset)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update failed",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    // Trigger form validation and submission
    await methods.handleSubmit(
      onSubmit,
      (errors) => {
        // Show validation errors
        console.error('Validation errors:', errors)
        toast({
          title: "Validation failed",
          description: "Please fix the errors in the form before saving.",
          variant: "destructive",
        })
      }
    )()
  }

  // Weighted profile completion calculation
  // Higher weights = more important fields
  const calculateCompletion = () => {
    const formValues = methods.watch()
    const weightedFields = [
      { filled: !!formValues.fullName, weight: 20 },      // Name is essential
      { filled: !!formValues.email, weight: 15 },          // Email is important
      { filled: !!formValues.summary, weight: 15 },        // Bio/summary
      { filled: !!formValues.location, weight: 5 },        // Location
      { filled: !!formValues.github, weight: 10 },         // GitHub link
      { filled: !!formValues.linkedin, weight: 10 },       // LinkedIn
      { filled: !!formValues.portfolio, weight: 5 },       // Portfolio website
      { filled: formValues.skills.length > 0 || derivedSkills.length > 0, weight: 10 }, // Skills
      { filled: formValues.experiences.length > 0, weight: 5 },         // Experience
      { filled: formValues.education.length > 0, weight: 5 },           // Education
    ]

    const totalWeight = weightedFields.reduce((sum, f) => sum + f.weight, 0)
    const earnedWeight = weightedFields.reduce((sum, f) => sum + (f.filled ? f.weight : 0), 0)

    return Math.round((earnedWeight / totalWeight) * 100)
  }

  const completionPercentage = calculateCompletion()

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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-32 flex-1">
        <ProfileHeader
          user={{
            name: user.username || "User",
            avatar: user.profile?.avatar_url || "/developer-avatar-portrait.jpg",
            tagline: user.profile?.bio || "Developer | Building with LoopLab",
          }}
          completionPercentage={completionPercentage}
          onEditProfile={() => setIsEditing(!isEditing)}
          onGenerateCV={() => setShowCVPreview(true)}
        />

        <FormProvider {...methods}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <PersonalInfoCard isEditing={isEditing} />

              <ProfessionalSummaryCard isEditing={isEditing} />

              <SkillsCard
                loopLabSkills={derivedSkills}
                isEditing={isEditing}
              />

              <ExperienceCard isEditing={isEditing} />

              <EducationCard isEditing={isEditing} />

              {/* Save Button - shown when editing */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Avatar Upload */}
              <AvatarUpload
                currentAvatar={user.profile?.avatar_url}
                userName={user.profile?.full_name || user.username}
                onUploadSuccess={() => {
                  // Refresh user data to get new avatar URL
                  refreshUser().catch(err => console.error('Failed to refresh user:', err))
                }}
              />

              {/* Privacy Settings */}
              <PrivacySettingsCard
                currentSettings={{
                  profilePublic: user.settings?.privacy?.profile_public ?? true,
                  showProjects: user.settings?.privacy?.show_projects ?? true,
                  showSkills: user.settings?.privacy?.show_skills ?? true,
                  showTimeline: user.settings?.privacy?.show_timeline ?? true,
                  showEmail: user.settings?.privacy?.show_email ?? false,
                  allowCvDownload: user.settings?.privacy?.allow_cv_download ?? false,
                }}
                onSettingsChange={() => {
                  // Refresh user data to get updated settings
                  refreshUser().catch(err => console.error('Failed to refresh user:', err))
                }}
              />

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
                          <Badge variant="secondary">{Math.round(path.progress?.percentage || 0)}%</Badge>
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

              {/* Project Timeline - Real data */}
              {loadingProjects ? (
                <Card>
                  <CardContent className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : (
                <ProjectTimeline projects={userProjects} />
              )}

            </div>
          </div>
        </FormProvider>
      </div>

      <Footer />

      {/* CV Preview Overlay - Full Page */}
      <CVPreviewOverlay
        isOpen={showCVPreview}
        onClose={() => setShowCVPreview(false)}
        profileData={{
          personalInfo: {
            fullName: methods.watch('fullName'),
            email: methods.watch('email'),
            phone: methods.watch('phone'),
            location: methods.watch('location'),
            linkedin: methods.watch('linkedin'),
            github: methods.watch('github'),
            portfolio: methods.watch('portfolio'),
          },
          summary: methods.watch('summary'),
          skills: methods.watch('skills'),
          loopLabSkills: derivedSkills,
          experiences: methods.watch('experiences'),
          education: methods.watch('education'),
          projects: userProjects,
        }}
      />
    </div >
  )
}
