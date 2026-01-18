"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code2, FileCode, Terminal, BookOpen, Trophy, Loader2, AlertCircle } from "lucide-react"
import Navbar from "@/components/Navbar"
import SkillsDonutChart from "@/components/dashboard/SkillsDonutChart"
import TotalHoursChart from "@/components/dashboard/TotalHoursChart"
import ProjectsCompletedCard from "@/components/dashboard/ProjectsCompletedCard"
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart"
import CalendarHeatmap from "@/components/dashboard/CalendarHeatmap"
import DynamicActivityFeed from "@/components/dashboard/DynamicActivityFeed"
import PerformanceOverview from "@/components/dashboard/PerformanceOverview"
import SkillGrowthTimeline from "@/components/dashboard/SkillGrowthTimeline"
import { getUserPaths, type UserPathsResponse } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"

interface UserStats {
  totalProjects: number
  completedProjects: number
  totalHours: number
  currentStreak: number
  longestStreak: number
}

const Stats = () => {
  const { user, loading: authLoading } = useAuth()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [userPaths, setUserPaths] = useState<UserPathsResponse | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loadingPaths, setLoadingPaths] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    }
  }, [authLoading, user])

  const loadData = async () => {
    await Promise.all([loadUserPaths(), loadUserStats()])
  }

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

  const loadUserStats = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats(data.data || data)
      } else {
        // Use default stats if endpoint not available
        setUserStats({
          totalProjects: 0,
          completedProjects: 0,
          totalHours: 0,
          currentStreak: 0,
          longestStreak: 0,
        })
      }
    } catch (error) {
      console.error('Failed to load user stats:', error)
      setError("Unable to load statistics")
      setUserStats({
        totalProjects: 0,
        completedProjects: 0,
        totalHours: 0,
        currentStreak: 0,
        longestStreak: 0,
      })
    } finally {
      setLoadingStats(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setLoadingStats(true)
    setLoadingPaths(true)
    loadData()
  }

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading statistics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // ProtectedRoute will handle redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background coding elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 opacity-5">
          <Code2 className="h-32 w-32 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-5">
          <Terminal className="h-40 w-40 text-accent" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-5">
          <FileCode className="h-24 w-24 text-primary" />
        </div>
        <div className="bg-grid-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl font-bold mb-1">Stats</h1>
            <p className="text-muted-foreground text-sm font-mono">
              Your progress, performance, and learning footprint
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
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

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <SkillsDonutChart />
          <TotalHoursChart />
          <ProjectsCompletedCard />
        </section>

        {/* Learning Paths Mastery Section */}
        {!loadingPaths && userPaths && (userPaths.activePaths.length > 0 || userPaths.completedPaths.length > 0) && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Learning Paths Mastery</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPaths.activePaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{path.progress?.percentage || 0}%</span>
                      </div>
                      <Progress value={path.progress?.percentage || 0} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{path.progress?.completedProjects || 0} / {path.totalProjects} projects</span>
                        <Badge variant="secondary">{path.difficulty}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {userPaths.completedPaths.map((path) => (
                <Card key={path.id} className="border-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="w-full justify-center">Completed</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <WeeklyActivityChart />
          <PerformanceOverview />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2">
            <CalendarHeatmap onDateSelect={setSelectedDate} />
          </div>
          <DynamicActivityFeed selectedDate={selectedDate} />
        </section>

        <section>
          <SkillGrowthTimeline />
        </section>
      </div>
    </div>
  )
}

export default Stats
