"use client"

import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

interface BadgeDisplayProps {
    name: string
    description: string
    icon: string  // Lucide icon name
    color: string  // Hex color
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    earnedAt?: string
    locked?: boolean
}

const tierStyles = {
    bronze: "from-amber-600/20 to-amber-900/20 border-amber-600/50",
    silver: "from-slate-400/20 to-slate-600/20 border-slate-400/50",
    gold: "from-yellow-500/20 to-yellow-700/20 border-yellow-500/50",
    platinum: "from-purple-500/20 to-purple-700/20 border-purple-500/50",
}

const tierGlow = {
    bronze: "shadow-amber-600/20",
    silver: "shadow-slate-400/20",
    gold: "shadow-yellow-500/30",
    platinum: "shadow-purple-500/30",
}

export function BadgeDisplay({
    name,
    description,
    icon,
    color,
    tier,
    earnedAt,
    locked = false,
}: BadgeDisplayProps) {
    // Dynamically get the Lucide icon
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Award

    return (
        <div className="group relative">
            <div
                className={cn(
                    "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300",
                    "bg-gradient-to-br backdrop-blur-sm",
                    locked
                        ? "opacity-40 grayscale border-border/30"
                        : `${tierStyles[tier]} hover:scale-105 hover:shadow-lg ${tierGlow[tier]}`
                )}
            >
                {/* Badge Icon */}
                <div
                    className={cn(
                        "relative w-16 h-16 rounded-full flex items-center justify-center mb-2",
                        "bg-gradient-to-br",
                        locked ? "from-muted to-muted-foreground/20" : ""
                    )}
                    style={{
                        background: locked
                            ? undefined
                            : `linear-gradient(135deg, ${color}40, ${color}20)`,
                    }}
                >
                    <IconComponent
                        className="w-8 h-8"
                        style={{ color: locked ? "currentColor" : color }}
                        strokeWidth={2}
                    />

                    {/* Tier indicator */}
                    {!locked && (
                        <div
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold"
                            style={{ backgroundColor: color }}
                        >
                            {tier === 'bronze' && '🥉'}
                            {tier === 'silver' && '🥈'}
                            {tier === 'gold' && '🥇'}
                            {tier === 'platinum' && '💎'}
                        </div>
                    )}
                </div>

                {/* Badge Name */}
                <h4 className="text-sm font-semibold text-center line-clamp-2">
                    {name}
                </h4>

                {/* Earned Date (if unlocked) */}
                {earnedAt && !locked && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {new Date(earnedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                )}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48">
                <p className="text-xs font-medium mb-1">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
                {earnedAt && (
                    <p className="text-xs text-primary mt-1">
                        Earned {new Date(earnedAt).toLocaleDateString()}
                    </p>
                )}
                {locked && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                        Not yet earned
                    </p>
                )}
            </div>
        </div>
    )
}
