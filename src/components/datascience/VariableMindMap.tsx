import { useState, useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MarkerType,
    NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Network, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface Variable {
    id: string;
    name: string;
    type: 'independent' | 'dependent' | 'confounding' | 'mediating' | 'moderating';
    description?: string;
}

export interface VariableRelationship {
    id: string;
    source: string;
    target: string;
    type: 'causal' | 'correlational' | 'confounding' | 'mediating';
    strength: 'weak' | 'moderate' | 'strong';
    direction: 'positive' | 'negative' | 'unknown';
    justification: string;
}

export interface ValidationIssue {
    type: 'circular' | 'missing' | 'inconsistent' | 'untestable';
    severity: 'error' | 'warning' | 'info';
    message: string;
    variables?: string[];
}

interface VariableMindMapProps {
    initialVariables?: Variable[];
    initialRelationships?: VariableRelationship[];
    onUpdate?: (variables: Variable[], relationships: VariableRelationship[]) => void;
    readOnly?: boolean;
}

export function VariableMindMap({
    initialVariables = [],
    initialRelationships = [],
    onUpdate,
    readOnly = false,
}: VariableMindMapProps) {
    const [variables, setVariables] = useState<Variable[]>(initialVariables);
    const [relationships, setRelationships] = useState<VariableRelationship[]>(initialRelationships);
    const [newVariableName, setNewVariableName] = useState('');
    const [newVariableType, setNewVariableType] = useState<Variable['type']>('independent');
    const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);

    // Convert variables to React Flow nodes
    const initialNodes: Node[] = variables.map((variable, index) => ({
        id: variable.id,
        type: 'variableNode',
        position: { x: 250 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 150 },
        data: { variable },
    }));

    // Convert relationships to React Flow edges
    const initialEdges: Edge[] = relationships.map((rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: 'smoothstep',
        animated: rel.type === 'causal',
        label: `${rel.strength} ${rel.direction}`,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: rel.type === 'causal' ? '#10b981' : '#6b7280',
        },
        style: {
            stroke: rel.type === 'causal' ? '#10b981' : '#6b7280',
            strokeWidth: rel.strength === 'strong' ? 3 : rel.strength === 'moderate' ? 2 : 1,
        },
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const addVariable = () => {
        if (!newVariableName.trim()) return;

        const newVariable: Variable = {
            id: Date.now().toString(),
            name: newVariableName,
            type: newVariableType,
        };

        const updatedVariables = [...variables, newVariable];
        setVariables(updatedVariables);

        const newNode: Node = {
            id: newVariable.id,
            type: 'variableNode',
            position: { x: 250, y: 100 + variables.length * 150 },
            data: { variable: newVariable },
        };

        setNodes((nds) => [...nds, newNode]);
        setNewVariableName('');
        onUpdate?.(updatedVariables, relationships);
        validateGraph(updatedVariables, relationships);
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            if (!connection.source || !connection.target) return;

            const newRelationship: VariableRelationship = {
                id: `${connection.source}-${connection.target}`,
                source: connection.source,
                target: connection.target,
                type: 'causal',
                strength: 'moderate',
                direction: 'positive',
                justification: '',
            };

            const updatedRelationships = [...relationships, newRelationship];
            setRelationships(updatedRelationships);
            setEdges((eds) => addEdge(connection, eds));
            onUpdate?.(variables, updatedRelationships);
            validateGraph(variables, updatedRelationships);
        },
        [variables, relationships, onUpdate, setEdges]
    );

    const validateGraph = (vars: Variable[], rels: VariableRelationship[]) => {
        const issues: ValidationIssue[] = [];

        // Check for circular dependencies
        const detectCircular = (nodeId: string, visited: Set<string>, path: Set<string>): boolean => {
            if (path.has(nodeId)) {
                const cycle = Array.from(path);
                issues.push({
                    type: 'circular',
                    severity: 'error',
                    message: `Circular dependency detected: ${cycle.join(' → ')}`,
                    variables: cycle,
                });
                return true;
            }

            if (visited.has(nodeId)) return false;

            visited.add(nodeId);
            path.add(nodeId);

            const outgoing = rels.filter((r) => r.source === nodeId);
            for (const rel of outgoing) {
                detectCircular(rel.target, visited, path);
            }

            path.delete(nodeId);
            return false;
        };

        const visited = new Set<string>();
        vars.forEach((v) => {
            if (!visited.has(v.id)) {
                detectCircular(v.id, visited, new Set());
            }
        });

        // Check for isolated variables
        vars.forEach((v) => {
            const hasConnection = rels.some((r) => r.source === v.id || r.target === v.id);
            if (!hasConnection && vars.length > 1) {
                issues.push({
                    type: 'missing',
                    severity: 'warning',
                    message: `Variable "${v.name}" has no relationships`,
                    variables: [v.id],
                });
            }
        });

        // Check for confounders without proper connections
        const confounders = vars.filter((v) => v.type === 'confounding');
        confounders.forEach((conf) => {
            const outgoing = rels.filter((r) => r.source === conf.id);
            if (outgoing.length < 2) {
                issues.push({
                    type: 'inconsistent',
                    severity: 'warning',
                    message: `Confounding variable "${conf.name}" should affect multiple variables`,
                    variables: [conf.id],
                });
            }
        });

        setValidationIssues(issues);
    };

    const getTypeColor = (type: Variable['type']) => {
        switch (type) {
            case 'independent':
                return 'bg-blue-500';
            case 'dependent':
                return 'bg-green-500';
            case 'confounding':
                return 'bg-red-500';
            case 'mediating':
                return 'bg-purple-500';
            case 'moderating':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const nodeTypes: NodeTypes = {
        variableNode: ({ data }: { data: { variable: Variable } }) => (
            <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-primary bg-background">
                <div className="flex flex-col gap-1">
                    <Badge className={getTypeColor(data.variable.type)} variant="default">
                        {data.variable.type}
                    </Badge>
                    <div className="font-medium text-sm">{data.variable.name}</div>
                </div>
            </div>
        ),
    };

    return (
        <div className="space-y-4">
            {/* Add Variable Form */}
            {!readOnly && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Network className="h-5 w-5" />
                            Add Variable
                        </CardTitle>
                        <CardDescription>
                            Identify all variables in your analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                value={newVariableName}
                                onChange={(e) => setNewVariableName(e.target.value)}
                                placeholder="Variable name (e.g., 'Customer Age', 'Churn Rate')"
                                onKeyDown={(e) => e.key === 'Enter' && addVariable()}
                            />
                            <Select
                                value={newVariableType}
                                onValueChange={(value) => setNewVariableType(value as Variable['type'])}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="independent">Independent</SelectItem>
                                    <SelectItem value="dependent">Dependent</SelectItem>
                                    <SelectItem value="confounding">Confounding</SelectItem>
                                    <SelectItem value="mediating">Mediating</SelectItem>
                                    <SelectItem value="moderating">Moderating</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={addVariable}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Validation Issues */}
            {validationIssues.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            Validation Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {validationIssues.map((issue, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg border ${issue.severity === 'error'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                                        }`}
                                >
                                    <p className="text-sm font-medium">{issue.message}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Mind Map Canvas */}
            <Card>
                <CardHeader>
                    <CardTitle>Variable Relationship Map</CardTitle>
                    <CardDescription>
                        Draw connections between variables. Drag to connect, click to edit.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[600px] border rounded-lg">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Variable Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <Badge className="bg-blue-500">Independent</Badge>
                        <Badge className="bg-green-500">Dependent</Badge>
                        <Badge className="bg-red-500">Confounding</Badge>
                        <Badge className="bg-purple-500">Mediating</Badge>
                        <Badge className="bg-orange-500">Moderating</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
