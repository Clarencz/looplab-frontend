"use client"

import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicProfileHeader } from "@/components/public-profile/PublicProfileHeader"
import { PublicAboutSection } from "@/components/public-profile/PublicAboutSection"
import { PublicProjectsShowcase } from "@/components/public-profile/PublicProjectsShowcase"
import { PublicSkillsGraph } from "@/components/public-profile/PublicSkillsGraph"
import { PublicActivityTimeline } from "@/components/public-profile/PublicActivityTimeline"
import { PublicProfileFooter } from "@/components/public-profile/PublicProfileFooter"

// Mock user data - in production this would come from API based on username
const mockUserData = {
  username: "alexcoder",
  fullName: "Alex Johnson",
  avatar: "/developer-avatar-portrait.jpg",
  tagline: "Full-Stack Developer | Building cool stuff with React & Node.js",
  bio: "Passionate developer who loves solving complex problems and building scalable applications. Started coding at 16, never stopped since. Currently focused on full-stack web development and exploring the world of systems programming with Rust.",
  country: "United States",
  languages: ["English", "Spanish"],
  yearsOfExperience: 4,
  preferredStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  links: {
    portfolio: "https://alexjohnson.dev",
    github: "https://github.com/alexcoder",
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexcoder",
  },
  // Privacy settings - what's visible
  privacy: {
    showProjects: true,
    showSkills: true,
    showTimeline: true,
    allowCVDownload: true,
  },
  // Public projects (only those marked as public)
  projects: [
    {
      id: "1",
      slug: "ecommerce-api",
      title: "E-commerce REST API",
      coverImage: "/api-code-terminal-dark.jpg",
      techStack: ["Node.js", "Express", "PostgreSQL", "Redis"],
      description: "A complete RESTful API with authentication, cart management, and Stripe payment integration.",
      issuesFixed: ["Fixed N+1 query problem", "Implemented rate limiting", "Added Redis caching layer"],
    },
    {
      id: "2",
      slug: "task-dashboard",
      title: "Real-time Task Dashboard",
      coverImage: "/dashboard-ui-design-dark.jpg",
      techStack: ["React", "TypeScript", "Socket.io", "Tailwind CSS"],
      description: "Collaborative task management with drag-and-drop, real-time updates, and team features.",
      issuesFixed: ["Fixed WebSocket reconnection", "Optimized drag-drop performance", "Added offline support"],
    },
    {
      id: "3",
      slug: "cli-weather",
      title: "CLI Weather Tool",
      coverImage: "/terminal-cli-tool-dark.jpg",
      techStack: ["Rust", "Clap", "Reqwest"],
      description: "Beautiful command-line weather app with ASCII art visualizations and location detection.",
      issuesFixed: ["Fixed timezone handling", "Added multi-location support", "Improved error messages"],
    },
    {
      id: "4",
      slug: "portfolio-generator",
      title: "Portfolio Generator",
      coverImage: "/portfolio-website-dark.jpg",
      techStack: ["TypeScript", "React", "GitHub API"],
      description: "Auto-generates developer portfolios from GitHub repos with customizable themes.",
      issuesFixed: ["Fixed repo fetching pagination", "Added theme customization", "Implemented caching"],
    },
  ],
  skills: [
    { name: "JavaScript", level: 92, proficiency: "Advanced" as const },
    { name: "TypeScript", level: 85, proficiency: "Fluent" as const },
    { name: "React", level: 88, proficiency: "Fluent" as const },
    { name: "Node.js", level: 80, proficiency: "Fluent" as const },
    { name: "Python", level: 65, proficiency: "Comfortable" as const },
    { name: "Rust", level: 45, proficiency: "Learning" as const },
    { name: "SQL", level: 75, proficiency: "Comfortable" as const },
    { name: "CSS", level: 82, proficiency: "Fluent" as const },
  ],
  activityTimeline: [
    { id: "1", type: "completed", message: "Completed 3 backend challenges", date: "Jan 2025" },
    { id: "2", type: "shipped", message: "Shipped 2 critical bug fixes", date: "Jan 2025" },
    { id: "3", type: "deployed", message: "Deployed a Rust CLI service", date: "Dec 2024" },
    { id: "4", type: "completed", message: "Finished React Dashboard project", date: "Dec 2024" },
    { id: "5", type: "started", message: "Started learning Rust fundamentals", date: "Nov 2024" },
    { id: "6", type: "shipped", message: "Fixed 5 issues in E-commerce API", date: "Nov 2024" },
  ],
  joinedDate: "Sep 2024",
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>()

  // In production, fetch user data based on username
  const user = mockUserData

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
        {user.privacy.showTimeline && (
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
