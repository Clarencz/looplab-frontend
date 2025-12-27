// Shared Learning Path UI Components
// These are reused across all categories - only the data is different

import { motion } from 'framer-motion'
import { Trophy, Lock, CheckCircle, Circle, Star } from 'lucide-react'

interface SkillNode {
    id: string
    name: string
    description: string
    parentId?: string
    xpRequired: number
    icon: string
    unlocked?: boolean
}

interface Milestone {
    name: string
    description: string
    projectsRequired: number
    rewardXp: number
    achieved?: boolean
}

interface LearningPathCardProps {
    name: string
    description: string
    progress: number
    projectsCompleted: number
    totalProjects: number
    categorySlug: string
    onClick?: () => void
}

export function LearningPathCard({
    name,
    description,
    progress,
    projectsCompleted,
    totalProjects,
    categorySlug,
    onClick
}: LearningPathCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="p-6 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs capitalize">
                    {categorySlug}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    {projectsCompleted} of {totalProjects} projects completed
                </p>
            </div>
        </motion.div>
    )
}

interface SkillTreeProps {
    nodes: SkillNode[]
    userXp: number
}

export function SkillTree({ nodes, userXp }: SkillTreeProps) {
    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">Skill Tree</h3>
            <div className="space-y-3">
                {nodes.map((node) => {
                    const unlocked = userXp >= node.xpRequired
                    return (
                        <div
                            key={node.id}
                            className={`flex items-center gap-3 p-3 rounded-lg ${unlocked ? 'bg-primary/10' : 'bg-muted/50'
                                }`}
                        >
                            <span className="text-2xl">{node.icon}</span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${!unlocked && 'text-muted-foreground'}`}>
                                        {node.name}
                                    </span>
                                    {unlocked ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{node.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{node.xpRequired} XP</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

interface MilestoneListProps {
    milestones: Milestone[]
    projectsCompleted: number
}

export function MilestoneList({ milestones, projectsCompleted }: MilestoneListProps) {
    return (
        <div className="p-6 bg-card rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Milestones
            </h3>
            <div className="space-y-4">
                {milestones.map((milestone, i) => {
                    const achieved = projectsCompleted >= milestone.projectsRequired
                    const progress = Math.min(100, (projectsCompleted / milestone.projectsRequired) * 100)

                    return (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {achieved ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={achieved ? 'font-medium' : 'text-muted-foreground'}>
                                        {milestone.name}
                                    </span>
                                </div>
                                <span className="text-xs text-yellow-500">+{milestone.rewardXp} XP</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">{milestone.description}</p>
                            {!achieved && (
                                <div className="pl-6">
                                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {projectsCompleted}/{milestone.projectsRequired} projects
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

interface ProgressBadgeProps {
    level: number
    levelName: string
    icon: string
    xp: number
    nextLevelXp: number
}

export function ProgressBadge({ level, levelName, icon, xp, nextLevelXp }: ProgressBadgeProps) {
    const progress = nextLevelXp > 0 ? (xp / nextLevelXp) * 100 : 100

    return (
        <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-4">
                <div className="text-4xl">{icon}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{levelName}</span>
                        <span className="text-xs bg-primary/20 px-2 py-0.5 rounded">Level {level}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{xp} XP</span>
                        {nextLevelXp > 0 && (
                            <span className="text-xs text-muted-foreground">/ {nextLevelXp} to next level</span>
                        )}
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default {
    LearningPathCard,
    SkillTree,
    MilestoneList,
    ProgressBadge,
}
