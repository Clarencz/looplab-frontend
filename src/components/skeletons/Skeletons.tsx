export const ProjectCardSkeleton = () => {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-muted" />

            {/* Content skeleton */}
            <div className="p-5 space-y-3">
                {/* Title */}
                <div className="h-6 bg-muted rounded w-3/4" />

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-20" />
                    <div className="h-6 bg-muted rounded w-16" />
                </div>

                {/* Button */}
                <div className="h-10 bg-muted rounded w-full mt-4" />
            </div>
        </div>
    )
}

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-64" />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6">
                        <div className="h-4 bg-muted rounded w-24 mb-4" />
                        <div className="h-8 bg-muted rounded w-16" />
                    </div>
                ))}
            </div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
