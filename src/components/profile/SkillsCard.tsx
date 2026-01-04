"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Code2, Plus, X } from "lucide-react"
import type { ProfileFormValues } from "@/lib/validation/profileValidation"

interface SkillsCardProps {
  loopLabSkills: string[]
  isEditing: boolean
}

export function SkillsCard({ loopLabSkills, isEditing }: SkillsCardProps) {
  const { watch, setValue } = useFormContext<ProfileFormValues>()
  const [newSkill, setNewSkill] = useState("")
  const skills = watch("skills") || []
  const allSkills = [...new Set([...skills, ...loopLabSkills])]
  const isComplete = allSkills.length >= 3

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setValue("skills", [...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setValue("skills", skills.filter((s) => s !== skill))
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-mono flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Skills
        </CardTitle>
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LoopLab auto-synced skills */}
        {loopLabSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Auto-synced from LoopLab projects:</p>
            <div className="flex flex-wrap gap-2">
              {loopLabSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Manual skills */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Additional skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                {isEditing && (
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add skill input */}
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill..."
              className="bg-secondary/50 border-border/50"
            />
            <Button size="sm" variant="outline" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
