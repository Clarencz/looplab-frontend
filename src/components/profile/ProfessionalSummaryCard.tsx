"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, FileText } from "lucide-react"

interface ProfessionalSummaryCardProps {
  summary: string
  onChange: (summary: string) => void
  isEditing: boolean
}

export function ProfessionalSummaryCard({ summary, onChange, isEditing }: ProfessionalSummaryCardProps) {
  const isComplete = summary.trim().length >= 50

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
        {isEditing ? (
          <Textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a brief professional introduction about yourself. What are your key strengths, goals, and what kind of roles are you looking for?"
            className="min-h-32 bg-secondary/50 border-border/50 resize-none"
          />
        ) : (
          <p className="text-sm text-foreground leading-relaxed p-3 rounded-md bg-secondary/30 min-h-32">
            {summary || <span className="text-muted-foreground italic">No professional summary added yet</span>}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">{summary.length}/50 characters minimum</p>
      </CardContent>
    </Card>
  )
}
