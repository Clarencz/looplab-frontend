"use client"

import type React from "react"

import { useState } from "react"
import { User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useOnboarding } from "@/contexts/OnboardingContext"

interface BasicProfileStepProps {
  onNext: () => void
}

export function BasicProfileStep({ onNext }: BasicProfileStepProps) {
  const { onboardingData, updateOnboardingData } = useOnboarding()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(onboardingData.avatar)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        updateOnboardingData({ avatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Let's get to know you</h2>
        <p className="text-muted-foreground">Set up your basic profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
              {avatarPreview ? (
                <img src={avatarPreview || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-4 h-4 text-primary-foreground" />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Name & Username Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Alex Developer"
              value={onboardingData.name}
              onChange={(e) => updateOnboardingData({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                placeholder="alexdev"
                className="pl-8"
                value={onboardingData.username}
                onChange={(e) => updateOnboardingData({ username: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country (optional)</Label>
          <Input
            id="country"
            placeholder="United States"
            value={onboardingData.country}
            onChange={(e) => updateOnboardingData({ country: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Short Bio (optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself..."
            rows={3}
            value={onboardingData.bio}
            onChange={(e) => updateOnboardingData({ bio: e.target.value })}
          />
        </div>

        {/* Continue Button */}
        <Button type="submit" size="lg" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  )
}
