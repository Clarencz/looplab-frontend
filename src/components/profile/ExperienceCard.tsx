"use client"

import { useState } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CheckCircle2, Circle, Briefcase, Plus, ChevronDown, Trash2 } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { ProfileFormValues } from "@/lib/validation/profileValidation"

interface ExperienceCardProps {
  isEditing: boolean
}

export function ExperienceCard({ isEditing }: ExperienceCardProps) {
  const { control, watch } = useFormContext<ProfileFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  })

  const experiences = watch("experiences") || []
  const [isOpen, setIsOpen] = useState(experiences.length > 0)
  const isComplete = experiences.length > 0 && experiences.every((e) => e.company && e.role)

  const addExperience = () => {
    append({ id: Date.now().toString(), company: "", role: "", period: "", description: "" })
    setIsOpen(true)
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
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Experience {index + 1}</span>
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
                      name={`experiences.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Job Title" className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Company" className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.period`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Timeline (e.g., Jan 2022 - Present)" className="bg-secondary/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea {...field} placeholder="Brief description of your role..." className="bg-secondary/50 resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium">{experiences[index]?.role || "No title"}</p>
                    <p className="text-sm text-muted-foreground">
                      {experiences[index]?.company} {experiences[index]?.period && `• ${experiences[index].period}`}
                    </p>
                    {experiences[index]?.description && <p className="text-sm mt-2">{experiences[index].description}</p>}
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
