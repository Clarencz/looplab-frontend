"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/Navbar"
import ProjectTile, { type Project } from "@/components/projects/ProjectTile"
import { useAuth } from "@/contexts/AuthContext"

const difficulties = ["Beginner", "Intermediate", "Advanced"]

const Projects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = localStorage.getItem('access_token')
      const headers: HeadersInit = accessToken
        ? { 'Authorization': `Bearer ${accessToken}` }
        : {}

      const response = await fetch('/api/v1/projects', {
        headers,
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || data.projects || [])
      } else if (response.status === 401) {
        // Not authenticated - could show public projects or redirect
        setProjects([])
        setError("Please sign in to view projects")
      } else {
        setError("Failed to load projects. Please try again.")
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
      setError("Unable to connect to the server. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.targetSkill && project.targetSkill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDifficulty = !selectedDifficulty || project.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Pick a project, fix what's broken, and validate your solution.</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadProjects}>
                  Try Again
                </Button>
                {!user && (
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
                    Sign In
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, skill, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDifficulty === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
              >
                All
              </Button>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Project grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredProjects.map((project, index) => (
              <ProjectTile key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        ) : !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">
              {searchQuery || selectedDifficulty ? "No projects found" : "No projects available"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || selectedDifficulty
                ? "Try adjusting your search or filters"
                : user
                  ? "Check back soon for new projects"
                  : "Sign in to access projects"
              }
            </p>
            {!user && (
              <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
                Sign In to Get Started
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Projects
