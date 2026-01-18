import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, AlertTriangle, Clock, Lock } from 'lucide-react'

export type StageStatus = 'passing' | 'failing' | 'warning' | 'pending' | 'blocked'

export interface PipelineStageData {
    label: string
    status: StageStatus
    description?: string
    metrics?: { label: string; value: string }[]
    isDecisionPoint?: boolean
}

const statusConfig = {
    passing: {
        icon: CheckCircle,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        badge: 'bg-green-500/20 text-green-700'
    },
    failing: {
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        badge: 'bg-red-500/20 text-red-700'
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        badge: 'bg-yellow-500/20 text-yellow-700'
    },
    pending: {
        icon: Clock,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        badge: 'bg-gray-500/20 text-gray-600'
    },
    blocked: {
        icon: Lock,
        color: 'text-gray-400',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        badge: 'bg-gray-500/20 text-gray-600'
    }
}

export const PipelineStage = memo(({ data, selected }: NodeProps<PipelineStageData>) => {
    const config = statusConfig[data.status]
    const Icon = config.icon

    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-primary" />

            <Card className={`
        w-80 transition-all duration-200
        ${selected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
        ${config.border} border-2
      `}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold flex-1">
                            {data.label}
                        </CardTitle>
                        <div className={`p-1.5 rounded-lg ${config.bg}`}>
                            <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                    </div>

                    <Badge variant="secondary" className={`w-fit text-xs ${config.badge}`}>
                        {data.status.toUpperCase()}
                    </Badge>
                </CardHeader>

                {(data.description || data.metrics) && (
                    <CardContent className="pt-0 space-y-3">
                        {data.description && (
                            <p className="text-sm text-muted-foreground">
                                {data.description}
                            </p>
                        )}

                        {data.metrics && data.metrics.length > 0 && (
                            <div className="space-y-1.5">
                                {data.metrics.map((metric, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{metric.label}</span>
                                        <span className="font-mono font-medium">{metric.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.isDecisionPoint && (
                            <div className="pt-2 border-t">
                                <Badge variant="outline" className="text-xs">
                                    🎯 Decision Checkpoint
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            <Handle type="source" position={Position.Bottom} className="!bg-primary" />
        </div>
    )
})

PipelineStage.displayName = 'PipelineStage'
