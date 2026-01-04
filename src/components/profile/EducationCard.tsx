"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, GraduationCap, Plus, Trash2 } from "lucide-react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import type { ProfileFormValues } from "@/lib/validation/profileValidation"

interface EducationCardProps {
  isEditing: boolean
}

export function EducationCard({ isEditing }: EducationCardProps) {
  const { control, watch } = useFormContext<ProfileFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  })

  const education = watch("education") || []
  const isComplete = education.length > 0 && education.every((e) => e.school && e.course)

  const addEducation = () => {
    append({ id: Date.now().toString(), school: "", course: "", year: "" })
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
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Education {index + 1}</span>
              {isEditing && (
                <Button size="icon" variant="ghost" onClick={() => remove(index)} className="h-6 w-6">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <>
                <FormField
                  control={control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="School/University Name" className="bg-secondary/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`education.${index}.course`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Course/Degree Title" className="bg-secondary/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`education.${index}.year`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="Year (e.g., 2020 - 2024)" className="bg-secondary/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">{education[index]?.school || "No school"}</p>
                <p className="text-sm text-muted-foreground">
                  {education[index]?.course} {education[index]?.year && `• ${education[index].year}`}
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
