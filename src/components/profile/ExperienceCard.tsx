"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CheckCircle2, Circle, Briefcase, Plus, ChevronDown, Trash2 } from "lucide-react"

interface Experience {
  id: string
  title: string
  company: string
  timeline: string
  description: string
}

interface ExperienceCardProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
  isEditing: boolean
}

export function ExperienceCard({ experiences, onChange, isEditing }: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(experiences.length > 0)
  const isComplete = experiences.length > 0 && experiences.every((e) => e.title && e.company)

  const addExperience = () => {
    onChange([...experiences, { id: Date.now().toString(), title: "", company: "", timeline: "", description: "" }])
    setIsOpen(true)
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const removeExperience = (id: string) => {
    onChange(experiences.filter((e) => e.id !== id))
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary transition-colors">
            <CardTitle className="text-lg font-mono flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Experience
              <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </CardTitle>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Experience {index + 1}</span>
                  {isEditing && (
                    <Button size="icon" variant="ghost" onClick={() => removeExperience(exp.id)} className="h-6 w-6">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      placeholder="Job Title"
                      className="bg-secondary/50"
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company"
                      className="bg-secondary/50"
                    />
                    <Input
                      value={exp.timeline}
                      onChange={(e) => updateExperience(exp.id, "timeline", e.target.value)}
                      placeholder="Timeline (e.g., Jan 2022 - Present)"
                      className="bg-secondary/50"
                    />
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="Brief description of your role..."
                      className="bg-secondary/50 resize-none"
                    />
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium">{exp.title || "No title"}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} {exp.timeline && `• ${exp.timeline}`}
                    </p>
                    {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addExperience} className="w-full gap-2 bg-transparent">
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
