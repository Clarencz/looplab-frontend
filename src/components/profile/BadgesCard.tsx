"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDisplay } from "./BadgeDisplay"
import { Trophy, Loader2 } from "lucide-react"

interface Badge {
    id: string
    name: string
    description: string
    icon: string
    color: string
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    earnedAt?: string
}

export function BadgesCard() {
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const accessToken = localStorage.getItem('access_token')
                const response = await fetch('/api/v1/profile/badges', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include',
                })

                if (response.ok) {
                    const data = await response.json()
                    setBadges(data)
                }
            } catch (error) {
                console.error('Failed to fetch badges:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBadges()
    }, [])

    if (loading) {
        return (
            <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    if (badges.length === 0) {
        return null  // Don't show card if no badges
    }

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle>Achievements</CardTitle>
                </div>
                <CardDescription>
                    {badges.length} {badges.length === 1 ? 'badge' : 'badges'} earned
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                        <BadgeDisplay
                            key={badge.id}
                            name={badge.name}
                            description={badge.description}
                            icon={badge.icon}
                            color={badge.color}
                            tier={badge.tier}
                            earnedAt={badge.earnedAt}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
