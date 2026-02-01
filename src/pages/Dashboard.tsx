"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ProfileColumn } from "@/components/dashboard/ProfileColumn"
import { ProjectModal } from "@/components/dashboard/ProjectModal"
import { WeeklyActivityGrid } from "@/components/dashboard/WeeklyActivityGrid"
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart"
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist"
import { DashboardTour } from "@/components/onboarding/DashboardTour"
import { getUserPaths, type LearningPathWithProgress } from "@/lib/api"
import { UnifiedProjectService, type UnifiedProject } from "@/lib/storage/projects-unified"
import { isTauri } from "@/utils/platform"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, Play, Loader2, AlertCircle, HardDrive, Cloud, Sparkles, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserStats {
  weeklyStreak: number
  projectsThisMonth: number
  projectsGoal: number
  totalProjects: number
  completedProjects: number
}

interface TechStack {
  id: string
  name: string
  icon: string
  category: string
}

interface Project {
  id: string
  title: string
  coverImage?: string
  techStack: TechStack[] | string[]
  summary: string
  isCompleted?: boolean
  progress?: number
  isLocal?: boolean
  isPublished?: boolean
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [activePaths, setActivePaths] = useState<LearningPathWithProgress[]>([])
  const [loadingPaths, setLoadingPaths] = useState(true)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData()
    }
  }, [authLoading, user])

  const loadDashboardData = async () => {
    await Promise.all([
      loadUserPaths(),
      loadUserStats(),
      loadUserProjects()
    ])
  }

  const loadUserPaths = async () => {
    try {
      const data = await getUserPaths()
      setActivePaths(data.activePaths || [])
    } catch (error) {
      console.error('Failed to load user paths:', error)
    } finally {
      setLoadingPaths(false)
    }
  }

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/v1/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats(data.data || data)
      } else {
        // Use default stats if endpoint not available
        setUserStats({
          weeklyStreak: 0,
          projectsThisMonth: 0,
          projectsGoal: 6,
          totalProjects: 0,
          completedProjects: 0,
        })
      }
    } catch (error) {
      console.error('Failed to load user stats:', error)
      setUserStats({
        weeklyStreak: 0,
        projectsThisMonth: 0,
        projectsGoal: 6,
        totalProjects: 0,
        completedProjects: 0,
      })
    } finally {
      setLoadingStats(false)
    }
  }

  const loadUserProjects = async () => {
    try {
      if (isTauri()) {
        // Desktop: Use unified service (local + cloud)
        const unifiedProjects = await UnifiedProjectService.listProjects()
        // Take first 6 projects
        const recentProjects = unifiedProjects.slice(0, 6).map(p => ({
          id: p.id,
          title: p.name,
          summary: p.description,
          techStack: [],
          isLocal: p.isLocal,
          isPublished: p.isPublished,
        }))
        setProjects(recentProjects)
      } else {
        // Web: Use existing cloud API
        const response = await fetch('/api/v1/projects?status=in_progress&limit=6', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setProjects(data.data || data.projects || [])
        } else {
          setProjects([])
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
      setProjects([])
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setLoadingStats(true)
    setLoadingProjects(true)
    setLoadingPaths(true)
    loadDashboardData()
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

  const userData = {
    avatar: user.profile.avatarUrl || "/developer-avatar-portrait.jpg",
    username: user.username,
    tagline: user.profile.bio || "Developer | Building with LoopLab",
    weeklyStreak: userStats?.weeklyStreak || 0,
    projectsThisMonth: userStats?.projectsThisMonth || 0,
    projectsGoal: userStats?.projectsGoal || 6,
  }

  const isLoading = loadingStats || loadingProjects || loadingPaths

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardTour />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Layout: Profile Column + Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Profile Column - Full width on mobile */}
            <div className="w-full lg:w-auto">
              <ProfileColumn user={userData} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <OnboardingChecklist />

              {/* Desktop-Only Classroom Tools */}
              {isTauri() && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Classroom Tools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/create-scenario')}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Create Custom Scenario</CardTitle>
                        <Sparkles className="h-4 w-4 text-purple-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">New Challenge</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Design AI-powered learning challenges for your students.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/admin')}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Student Analytics</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Manage Class</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Track progress and review class performance.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Learning Paths Section */}
              {!loadingPaths && activePaths.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Continue Learning</h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate('/learning-paths')}>
                      View All
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    {activePaths.map((path) => (
                      <Card key={path.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/learning-paths/${path.id}`)}>
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg mb-1">{path.title}</CardTitle>
                              <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                            </div>
                            <Badge variant="secondary" className="self-start whitespace-nowrap">
                              {path.progress?.completedProjects || 0}/{path.totalProjects} Projects
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{path.progress?.percentage || 0}%</span>
                            </div>
                            <Progress value={path.progress?.percentage || 0} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Projects Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight">Recent Projects</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate('/projects')}>
                    View All
                  </Button>
                </div>

                {loadingProjects ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                        {project.coverImage ? (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                            <img
                              src={project.coverImage}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : null}
                        <CardHeader>
                          <div className="flex items-center justify-between mb-1">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            {isTauri() && (
                              <div className="flex gap-1">
                                {project.isLocal && !project.isPublished && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                                    <HardDrive className="h-3 w-3 mr-1" />
                                    Local
                                  </Badge>
                                )}
                                {project.isPublished && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                    <Cloud className="h-3 w-3 mr-1" />
                                    Published
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">{project.summary}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.techStack.map((tech, index) => {
                              const techName = typeof tech === 'string' ? tech : tech.name
                              const techKey = typeof tech === 'string' ? tech : tech.id
                              return (
                                <Badge key={techKey || index} variant="secondary" className="text-xs">
                                  {techName}
                                </Badge>
                              )
                            })}
                          </div>
                          {project.isCompleted ? (
                            <Badge className="w-full justify-center bg-green-500">✓ Completed</Badge>
                          ) : project.progress !== undefined && project.progress > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} />
                              <Button variant="default" size="sm" className="w-full mt-2">
                                <Play className="mr-2 h-4 w-4" />
                                Continue Project
                              </Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="w-full">
                              <Play className="mr-2 h-4 w-4" />
                              Start Project
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Start your first project to begin your learning journey
                      </p>
                      <Button onClick={() => navigate('/projects')}>
                        Browse Projects
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
