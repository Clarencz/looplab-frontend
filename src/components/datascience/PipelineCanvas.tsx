import { useCallback, useMemo } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { PipelineStage, PipelineStageData } from './PipelineStage'

const nodeTypes = {
    pipelineStage: PipelineStage,
}

interface PipelineCanvasProps {
    initialNodes?: Node<PipelineStageData>[]
    initialEdges?: Edge[]
    onNodeClick?: (node: Node<PipelineStageData>) => void
}

export function PipelineCanvas({
    initialNodes = [],
    initialEdges = [],
    onNodeClick
}: PipelineCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const handleNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node<PipelineStageData>) => {
            onNodeClick?.(node)
        },
        [onNodeClick]
    )

    const defaultEdgeOptions = useMemo(
        () => ({
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: 'hsl(var(--primary))',
            },
        }),
        []
    )

    return (
        <div className="w-full h-full bg-background">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                className="bg-background"
            >
                <Background className="bg-muted/30" />
                <Controls className="bg-card border border-border" />
                <MiniMap
                    className="bg-card border border-border"
                    nodeColor={(node) => {
                        const status = (node.data as PipelineStageData).status
                        const colors = {
                            passing: '#22c55e',
                            failing: '#ef4444',
                            warning: '#eab308',
                            pending: '#9ca3af',
                            blocked: '#9ca3af',
                        }
                        return colors[status] || '#9ca3af'
                    }}
                />
            </ReactFlow>
        </div>
    )
}
