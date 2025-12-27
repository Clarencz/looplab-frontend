"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, FileText, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

interface CVPreviewPanelProps {
  profileData: {
    personalInfo: {
      fullName: string
      email: string
      phone: string
      location: string
      linkedin: string
      github: string
      portfolio: string
    }
    summary: string
    skills: string[]
    loopLabSkills: string[]
    experiences: Array<{
      title: string
      company: string
      timeline: string
      description: string
    }>
    education: Array<{
      school: string
      course: string
      year: string
    }>
    projects: Array<{
      title: string
      techStack: string[]
      summary: string
    }>
  }
  completionPercentage: number
}

export function CVPreviewPanel({ profileData, completionPercentage }: CVPreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const canExpand = completionPercentage >= 50

  const allSkills = [...new Set([...profileData.skills, ...profileData.loopLabSkills])]

  return (
    <Card className={`bg-card/50 border-border/50 ${!canExpand ? "opacity-60" : ""}`}>
      <Collapsible open={isOpen && canExpand} onOpenChange={canExpand ? setIsOpen : undefined}>
        <CardHeader className="pb-4">
          <CollapsibleTrigger
            className={`flex items-center justify-between w-full ${!canExpand ? "cursor-not-allowed" : "hover:text-primary"} transition-colors`}
            disabled={!canExpand}
          >
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your CV Preview
            </CardTitle>
            <div className="flex items-center gap-2">
              {!canExpand && <span className="text-xs text-muted-foreground">Fill more fields to preview</span>}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {/* CV Preview - Clean Professional Layout */}
            <div className="bg-white text-gray-900 rounded-lg p-8 shadow-lg">
              {/* Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.personalInfo.fullName || "Your Name"}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  {profileData.personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {profileData.personalInfo.email}
                    </span>
                  )}
                  {profileData.personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {profileData.personalInfo.phone}
                    </span>
                  )}
                  {profileData.personalInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {profileData.personalInfo.location}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {profileData.personalInfo.linkedin && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="h-3.5 w-3.5" /> {profileData.personalInfo.linkedin}
                    </span>
                  )}
                  {profileData.personalInfo.github && (
                    <span className="flex items-center gap-1">
                      <Github className="h-3.5 w-3.5" /> {profileData.personalInfo.github}
                    </span>
                  )}
                  {profileData.personalInfo.portfolio && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> {profileData.personalInfo.portfolio}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Left Column - Skills */}
                <div className="space-y-6">
                  {allSkills.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-1.5">
                        {allSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileData.education.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">Education</h2>
                      <div className="space-y-3">
                        {profileData.education.map((edu, i) => (
                          <div key={i}>
                            <p className="font-medium text-sm">{edu.school}</p>
                            <p className="text-xs text-gray-600">{edu.course}</p>
                            {edu.year && <p className="text-xs text-gray-500">{edu.year}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Summary, Experience, Projects */}
                <div className="col-span-2 space-y-6">
                  {profileData.summary && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">
                        Professional Summary
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">{profileData.summary}</p>
                    </div>
                  )}

                  {profileData.experiences.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">Experience</h2>
                      <div className="space-y-4">
                        {profileData.experiences.map((exp, i) => (
                          <div key={i}>
                            <p className="font-medium text-sm">{exp.title}</p>
                            <p className="text-xs text-gray-600">
                              {exp.company} {exp.timeline && `| ${exp.timeline}`}
                            </p>
                            {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {profileData.projects.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">
                        Verified Projects
                      </h2>
                      <div className="space-y-3">
                        {profileData.projects.slice(0, 4).map((project, i) => (
                          <div key={i}>
                            <p className="font-medium text-sm">{project.title}</p>
                            <p className="text-xs text-gray-600">{project.techStack.join(", ")}</p>
                            <p className="text-xs text-gray-700 mt-1">{project.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
