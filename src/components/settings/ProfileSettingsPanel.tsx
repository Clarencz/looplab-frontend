"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Linkedin, Globe, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export function ProfileSettingsPanel() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    country: "",
    timezone: "",
    github: "",
    linkedin: "",
    portfolio: "",
  })

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.profile?.full_name || "",
        username: user.username || "",
        email: user.email || "",
        country: user.profile?.country || "",
        timezone: user.profile?.timezone || "",
        github: user.profile?.github_url || "",
        linkedin: user.profile?.linkedin_url || "",
        portfolio: user.profile?.portfolio_url || "",
      })
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveBasics = async () => {
    setSaving(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: profileData.fullName,
          username: profileData.username,
          country: profileData.country,
          timezone: profileData.timezone,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      await refreshUser()
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      })
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast({
        title: "Update failed",
        description: "Failed to save profile changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLinks = async () => {
    setSaving(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch('/api/v1/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          github_url: profileData.github,
          linkedin_url: profileData.linkedin,
          portfolio_url: profileData.portfolio,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update links')
      }

      await refreshUser()
      toast({
        title: "Links updated",
        description: "Your professional links have been saved",
      })
    } catch (error) {
      console.error('Failed to save links:', error)
      toast({
        title: "Update failed",
        description: "Failed to save professional links",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Basics Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Profile Basics</CardTitle>
          <CardDescription>Your core identity on LoopLab</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profile?.avatar_url || undefined} alt="Profile" />
              <AvatarFallback className="text-xl">
                {user.profile?.full_name?.charAt(0) || user.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Manage your avatar on the{" "}
                <a href="/profile" className="text-primary hover:underline">
                  Profile page
                </a>
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-muted"
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Email is managed through your OAuth provider
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={profileData.country} onValueChange={(value) => handleChange("country", value)}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={profileData.timezone} onValueChange={(value) => handleChange("timezone", value)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="Europe/London">GMT (London)</SelectItem>
                  <SelectItem value="Europe/Paris">CET (Paris)</SelectItem>
                  <SelectItem value="Asia/Tokyo">JST (Tokyo)</SelectItem>
                  <SelectItem value="Asia/Kolkata">IST (India)</SelectItem>
                  <SelectItem value="Africa/Nairobi">EAT (Nairobi)</SelectItem>
                  <SelectItem value="Africa/Lagos">WAT (Lagos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSaveBasics} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Professional Links Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Professional Links</CardTitle>
          <CardDescription>Connect your external profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" /> GitHub
            </Label>
            <Input
              id="github"
              value={profileData.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={profileData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Portfolio
            </Label>
            <Input
              id="portfolio"
              value={profileData.portfolio}
              onChange={(e) => handleChange("portfolio", e.target.value)}
              placeholder="yourwebsite.com"
            />
          </div>

          <Button onClick={handleSaveLinks} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Links
          </Button>
        </CardContent>
      </Card>

      {/* Profile Page Link */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
        <span>Advanced profile building is available on your</span>
        <a href="/profile" className="text-primary hover:underline inline-flex items-center gap-1">
          Profile Page <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
