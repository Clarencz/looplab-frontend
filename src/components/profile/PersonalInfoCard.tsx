"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, User, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
}

interface PersonalInfoCardProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  isEditing: boolean
}

export function PersonalInfoCard({ data, onChange, isEditing }: PersonalInfoCardProps) {
  const fields = [
    { key: "fullName", label: "Full Name", icon: User, placeholder: "John Doe" },
    { key: "email", label: "Email", icon: Mail, placeholder: "john@example.com", type: "email" },
    { key: "phone", label: "Phone Number", icon: Phone, placeholder: "+1 234 567 890" },
    { key: "location", label: "Location", icon: MapPin, placeholder: "San Francisco, CA" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/johndoe" },
    { key: "github", label: "GitHub", icon: Github, placeholder: "github.com/johndoe" },
    { key: "portfolio", label: "Portfolio Website", icon: Globe, placeholder: "johndoe.dev" },
  ] as const

  const filledFields = fields.filter((f) => data[f.key]?.trim()).length
  const isComplete = filledFields >= 4 // At least 4 fields filled

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-mono flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => {
          const Icon = field.icon
          return (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                {field.label}
              </Label>
              {isEditing ? (
                <Input
                  type={field.type || "text"}
                  value={data[field.key]}
                  onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="bg-secondary/50 border-border/50"
                />
              ) : (
                <p className="text-sm text-foreground px-3 py-2 rounded-md bg-secondary/30">
                  {data[field.key] || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
