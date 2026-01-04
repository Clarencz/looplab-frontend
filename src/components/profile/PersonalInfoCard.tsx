"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, User, Mail, Phone, MapPin, Linkedin, Github, Globe, Link2, Loader2, Check, X } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import type { ProfileFormValues } from "@/lib/validation/profileValidation"

interface PersonalInfoCardProps {
  isEditing: boolean
}

export function PersonalInfoCard({ isEditing }: PersonalInfoCardProps) {
  const { control, watch } = useFormContext<ProfileFormValues>()
  const [subdomainChecking, setSubdomainChecking] = useState(false)
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [subdomainMessage, setSubdomainMessage] = useState<string>("")

  const subdomain = watch("subdomain")

  // Check subdomain availability
  useEffect(() => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null)
      setSubdomainMessage("")
      return
    }

    const checkAvailability = async () => {
      setSubdomainChecking(true)
      try {
        const accessToken = localStorage.getItem('access_token')
        const response = await fetch(`/api/v1/profile/subdomain/check?subdomain=${encodeURIComponent(subdomain)}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setSubdomainAvailable(data.available)
          setSubdomainMessage(data.message || "")
        }
      } catch (error) {
        console.error('Failed to check subdomain:', error)
      } finally {
        setSubdomainChecking(false)
      }
    }

    const timer = setTimeout(checkAvailability, 500)
    return () => clearTimeout(timer)
  }, [subdomain])

  const fields = [
    { key: "fullName" as const, label: "Full Name", icon: User, placeholder: "John Doe" },
    { key: "email" as const, label: "Email", icon: Mail, placeholder: "john@example.com", type: "email" },
    { key: "phone" as const, label: "Phone Number", icon: Phone, placeholder: "+1 234 567 890" },
    { key: "location" as const, label: "Location", icon: MapPin, placeholder: "San Francisco, CA" },
  ] as const

  const socialFields = [
    { key: "linkedin" as const, label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/in/johndoe" },
    { key: "github" as const, label: "GitHub", icon: Github, placeholder: "github.com/johndoe" },
    { key: "portfolio" as const, label: "Portfolio Website", icon: Globe, placeholder: "johndoe.dev" },
  ] as const

  const formValues = watch()
  const filledFields = [...fields, ...socialFields].filter((f) => formValues[f.key]?.trim()).length
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
        {/* Basic Fields */}
        {fields.map((field) => {
          const Icon = field.icon
          return (
            <FormField
              key={field.key}
              control={control}
              name={field.key}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {field.label}
                  </FormLabel>
                  {isEditing ? (
                    <FormControl>
                      <Input
                        {...formField}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="bg-secondary/50 border-border/50"
                      />
                    </FormControl>
                  ) : (
                    <p className="text-sm text-foreground px-3 py-2 rounded-md bg-secondary/30">
                      {formField.value || <span className="text-muted-foreground italic">Not set</span>}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}

        {/* Subdomain Field */}
        <FormField
          control={control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-muted-foreground flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5" />
                Public Profile Subdomain
              </FormLabel>
              {isEditing ? (
                <>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="username"
                        className="bg-secondary/50 border-border/50 pr-10"
                      />
                    </FormControl>
                    {subdomainChecking && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {!subdomainChecking && subdomain && subdomain.length >= 3 && (
                      <>
                        {subdomainAvailable === true && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {subdomainAvailable === false && (
                          <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </>
                    )}
                  </div>
                  <FormDescription className="text-xs">
                    {field.value && field.value.length >= 3 ? (
                      <span className="flex items-center gap-1">
                        Your profile will be at: <code className="text-primary">{field.value}.looplab.academy</code>
                      </span>
                    ) : (
                      "Choose a unique subdomain for your public profile (3-63 characters)"
                    )}
                  </FormDescription>
                  {subdomainMessage && (
                    <p className={`text-xs ${subdomainAvailable ? 'text-green-500' : 'text-destructive'}`}>
                      {subdomainMessage}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-foreground px-3 py-2 rounded-md bg-secondary/30">
                  {field.value ? (
                    <code className="text-primary">{field.value}.looplab.academy</code>
                  ) : (
                    <span className="text-muted-foreground italic">Not set</span>
                  )}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Fields */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-sm font-medium text-muted-foreground mb-4">Social Links</p>
          <div className="space-y-4">
            {socialFields.map((field) => {
              const Icon = field.icon
              return (
                <FormField
                  key={field.key}
                  control={control}
                  name={field.key}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {field.label}
                      </FormLabel>
                      {isEditing ? (
                        <FormControl>
                          <Input
                            {...formField}
                            placeholder={field.placeholder}
                            className="bg-secondary/50 border-border/50"
                          />
                        </FormControl>
                      ) : (
                        <p className="text-sm text-foreground px-3 py-2 rounded-md bg-secondary/30">
                          {formField.value || <span className="text-muted-foreground italic">Not set</span>}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
