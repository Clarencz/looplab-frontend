"use client"

import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, FileText } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { ProfileFormValues } from "@/lib/validation/profileValidation"

interface ProfessionalSummaryCardProps {
  isEditing: boolean
}

export function ProfessionalSummaryCard({ isEditing }: ProfessionalSummaryCardProps) {
  const { control, watch } = useFormContext<ProfileFormValues>()
  const summary = watch("summary") || ""
  const isComplete = summary.trim().length >= 50
  const maxLength = 1000

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-mono flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Professional Summary
        </CardTitle>
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              {isEditing ? (
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write a brief professional introduction about yourself. What are your key strengths, goals, and what kind of roles are you looking for?"
                    className="min-h-32 bg-secondary/50 border-border/50 resize-none"
                  />
                </FormControl>
              ) : (
                <p className="text-sm text-foreground leading-relaxed p-3 rounded-md bg-secondary/30 min-h-32">
                  {field.value || <span className="text-muted-foreground italic">No professional summary added yet</span>}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-muted-foreground mt-2">
          {summary.length}/{maxLength} characters (minimum 50)
        </p>
      </CardContent>
    </Card>
  )
}
