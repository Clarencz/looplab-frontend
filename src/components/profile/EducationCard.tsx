"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, GraduationCap, Plus, Trash2 } from "lucide-react"

interface Education {
  id: string
  school: string
  course: string
  year: string
}

interface EducationCardProps {
  education: Education[]
  onChange: (education: Education[]) => void
  isEditing: boolean
}

export function EducationCard({ education, onChange, isEditing }: EducationCardProps) {
  const isComplete = education.length > 0 && education.every((e) => e.school && e.course)

  const addEducation = () => {
    onChange([...education, { id: Date.now().toString(), school: "", course: "", year: "" }])
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const removeEducation = (id: string) => {
    onChange(education.filter((e) => e.id !== id))
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-mono flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Education
        </CardTitle>
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Education {index + 1}</span>
              {isEditing && (
                <Button size="icon" variant="ghost" onClick={() => removeEducation(edu.id)} className="h-6 w-6">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                  placeholder="School/University Name"
                  className="bg-secondary/50"
                />
                <Input
                  value={edu.course}
                  onChange={(e) => updateEducation(edu.id, "course", e.target.value)}
                  placeholder="Course/Degree Title"
                  className="bg-secondary/50"
                />
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                  placeholder="Year (e.g., 2020 - 2024)"
                  className="bg-secondary/50"
                />
              </>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">{edu.school || "No school"}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.course} {edu.year && `• ${edu.year}`}
                </p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button variant="outline" size="sm" onClick={addEducation} className="w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        )}
        {education.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground italic text-center py-4">No education added yet</p>
        )}
      </CardContent>
    </Card>
  )
}
