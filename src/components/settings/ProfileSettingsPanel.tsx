"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Linkedin, Globe, ArrowRight } from "lucide-react"

export function ProfileSettingsPanel() {
  const [profileData, setProfileData] = useState({
    fullName: "Alex Johnson",
    username: "alexcoder",
    email: "alex@example.com",
    country: "United States",
    timezone: "America/Los_Angeles",
    github: "github.com/alexjohnson",
    linkedin: "linkedin.com/in/alexjohnson",
    portfolio: "alexjohnson.dev",
  })

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
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
              <AvatarImage src="/developer-avatar-portrait.jpg" alt="Profile" />
              <AvatarFallback className="text-xl">AJ</AvatarFallback>
            </Avatar>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Change
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Remove
              </Button>
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
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
              />
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-2">Save Changes</Button>
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

          <Button className="mt-2">Save Links</Button>
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
