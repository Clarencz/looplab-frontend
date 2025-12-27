import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { Category } from '@/lib/api/types'

interface CategoryCardProps {
    category: Category
    onClick: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
    // Dynamically get the Lucide icon component
    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Folder

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className="cursor-pointer h-full border-2 hover:border-primary/50 transition-all group"
                onClick={onClick}
            >
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div
                            className="p-3 rounded-lg mb-4"
                            style={{ backgroundColor: `${category.color}15` }}
                        >
                            <IconComponent
                                className="h-8 w-8"
                                style={{ color: category.color }}
                            />
                        </div>
                        {category.pathCount !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                                {category.pathCount} {category.pathCount === 1 ? 'path' : 'paths'}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {category.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        <span>Explore paths</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
