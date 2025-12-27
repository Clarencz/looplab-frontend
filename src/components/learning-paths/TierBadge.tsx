import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Crown, Sparkles } from "lucide-react"
import type { TierLevel } from "@/lib/api/types"

interface TierBadgeProps {
    tier: TierLevel
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
    className?: string
}

const TIER_CONFIG = {
    free: {
        label: 'Free',
        color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        icon: null,
    },
    pro: {
        label: 'Pro',
        color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        icon: Sparkles,
    },
    premium: {
        label: 'Premium',
        color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
        icon: Crown,
    },
} as const

const SIZE_CONFIG = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
} as const

export function TierBadge({
    tier,
    size = 'md',
    showIcon = true,
    className
}: TierBadgeProps) {
    const config = TIER_CONFIG[tier]
    const Icon = config.icon

    return (
        <Badge
            variant="outline"
            className={cn(
                config.color,
                SIZE_CONFIG[size],
                'font-medium',
                className
            )}
        >
            {showIcon && Icon && (
                <Icon className={cn(
                    "mr-1",
                    size === 'sm' && "h-3 w-3",
                    size === 'md' && "h-3.5 w-3.5",
                    size === 'lg' && "h-4 w-4"
                )} />
            )}
            {config.label}
        </Badge>
    )
}
