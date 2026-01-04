"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrivacySettings {
    profilePublic: boolean
    showProjects: boolean
    showSkills: boolean
    showTimeline: boolean
    showEmail: boolean
    allowCvDownload: boolean
}

interface PrivacySettingsCardProps {
    currentSettings: PrivacySettings
    onSettingsChange: (settings: PrivacySettings) => void
}

export function PrivacySettingsCard({ currentSettings, onSettingsChange }: PrivacySettingsCardProps) {
    const [settings, setSettings] = useState<PrivacySettings>(currentSettings)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    const handleToggle = async (key: keyof PrivacySettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
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
                    settings: {
                        privacy: newSettings
                    }
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to update privacy settings')
            }

            onSettingsChange(newSettings)

            toast({
                title: "Privacy settings updated",
                description: "Your changes have been saved",
            })
        } catch (error) {
            console.error('Failed to update privacy settings:', error)
            // Revert on error
            setSettings(settings)
            toast({
                title: "Update failed",
                description: "Failed to save privacy settings",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle>Privacy Settings</CardTitle>
                    </div>
                    {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <CardDescription>
                    Control what's visible on your public profile
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Profile Public */}
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="profile-public" className="text-sm font-medium flex items-center gap-2">
                            {settings.profilePublic ? (
                                <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                            Make profile public
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                            Allow others to view your profile at /u/your-subdomain
                        </p>
                    </div>
                    <Switch
                        id="profile-public"
                        checked={settings.profilePublic}
                        onCheckedChange={(checked) => handleToggle('profilePublic', checked)}
                        disabled={saving}
                    />
                </div>

                <div className="border-t border-border/50 pt-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                        The following settings only apply when your profile is public:
                    </p>

                    {/* Show Projects */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="show-projects" className="text-sm font-medium">
                                Show completed projects
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Display your project portfolio
                            </p>
                        </div>
                        <Switch
                            id="show-projects"
                            checked={settings.showProjects}
                            onCheckedChange={(checked) => handleToggle('showProjects', checked)}
                            disabled={saving || !settings.profilePublic}
                        />
                    </div>

                    {/* Show Skills */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="show-skills" className="text-sm font-medium">
                                Show skills
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Display your technical skills
                            </p>
                        </div>
                        <Switch
                            id="show-skills"
                            checked={settings.showSkills}
                            onCheckedChange={(checked) => handleToggle('showSkills', checked)}
                            disabled={saving || !settings.profilePublic}
                        />
                    </div>

                    {/* Show Timeline */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="show-timeline" className="text-sm font-medium">
                                Show experience & education
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Display your work history and education
                            </p>
                        </div>
                        <Switch
                            id="show-timeline"
                            checked={settings.showTimeline}
                            onCheckedChange={(checked) => handleToggle('showTimeline', checked)}
                            disabled={saving || !settings.profilePublic}
                        />
                    </div>

                    {/* Show Email */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="show-email" className="text-sm font-medium">
                                Show email address
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Allow visitors to see your email
                            </p>
                        </div>
                        <Switch
                            id="show-email"
                            checked={settings.showEmail}
                            onCheckedChange={(checked) => handleToggle('showEmail', checked)}
                            disabled={saving || !settings.profilePublic}
                        />
                    </div>

                    {/* Allow CV Download */}
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                            <Label htmlFor="allow-cv" className="text-sm font-medium">
                                Allow CV downloads
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Let visitors download your CV as PDF
                            </p>
                        </div>
                        <Switch
                            id="allow-cv"
                            checked={settings.allowCvDownload}
                            onCheckedChange={(checked) => handleToggle('allowCvDownload', checked)}
                            disabled={saving || !settings.profilePublic}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
