import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, GripVertical, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { listSubscriptionTiers, type SubscriptionTier } from '@/lib/api'

interface TierFormData {
    name: string
    displayName: string
    description: string
    priceMonthly: string
    priceYearly: string
    features: string[]
    isActive: boolean
    sortOrder: number
}

const defaultTierData: TierFormData = {
    name: '',
    displayName: '',
    description: '',
    priceMonthly: '0',
    priceYearly: '0',
    features: [''],
    isActive: true,
    sortOrder: 0
}

export default function AdminPricing() {
    const [tiers, setTiers] = useState<SubscriptionTier[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null)
    const [formData, setFormData] = useState<TierFormData>(defaultTierData)
    const { toast } = useToast()

    useEffect(() => {
        loadTiers()
    }, [])

    const loadTiers = async () => {
        try {
            setLoading(true)
            const data = await listSubscriptionTiers()
            setTiers(data)
        } catch (error) {
            console.error('Failed to load tiers:', error)
            toast({
                title: 'Error',
                description: 'Failed to load pricing tiers',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (tier?: SubscriptionTier) => {
        if (tier) {
            setEditingTier(tier)
            const features = tier.features as Record<string, any>
            setFormData({
                name: tier.name,
                displayName: tier.displayName,
                description: tier.name === 'free' ? 'Perfect for getting started' :
                    tier.name === 'pro' ? 'For serious learners' :
                        tier.name === 'premium' ? 'For career advancement' : '',
                priceMonthly: tier.priceMonthly,
                priceYearly: tier.priceYearly,
                features: features.list || [''],
                isActive: true,
                sortOrder: 0
            })
        } else {
            setEditingTier(null)
            setFormData(defaultTierData)
        }
        setEditDialogOpen(true)
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            // In a real implementation, this would call the API
            // For now, we'll simulate a save
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: 'Success',
                description: `Tier "${formData.displayName}" has been ${editingTier ? 'updated' : 'created'}`,
            })

            setEditDialogOpen(false)
            loadTiers()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save tier',
                variant: 'destructive'
            })
        } finally {
            setSaving(false)
        }
    }

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }))
    }

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    const updateFeature = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }))
    }

    const getTierBadgeColor = (tierName: string) => {
        switch (tierName) {
            case 'free':
                return 'bg-green-500/10 text-green-600 border-green-500/20'
            case 'pro':
                return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
            case 'premium':
                return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Pricing Management</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Manage subscription tiers and pricing plans
                    </p>
                </div>
                <Button onClick={() => openEditDialog()} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                </Button>
            </div>

            {/* Pricing Tiers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Tiers</CardTitle>
                    <CardDescription>
                        Configure pricing, features, and visibility for each tier
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Tier</TableHead>
                                        <TableHead>Monthly</TableHead>
                                        <TableHead>Yearly</TableHead>
                                        <TableHead>Features</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tiers.map((tier) => {
                                        const features = tier.features as Record<string, any>
                                        return (
                                            <TableRow key={tier.id}>
                                                <TableCell>
                                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getTierBadgeColor(tier.name)}>
                                                            {tier.displayName}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    ${tier.priceMonthly}
                                                </TableCell>
                                                <TableCell className="font-mono">
                                                    ${tier.priceYearly}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {features.list?.length || 0} features
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm text-green-600">Active</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openEditDialog(tier)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{tiers.length}</div>
                        <p className="text-sm text-muted-foreground">Active Tiers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            ${tiers.find(t => t.name === 'premium')?.priceMonthly || '0'}
                        </div>
                        <p className="text-sm text-muted-foreground">Highest Monthly</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">17%</div>
                        <p className="text-sm text-muted-foreground">Yearly Discount</p>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTier ? `Edit ${editingTier.displayName}` : 'Create New Tier'}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the pricing tier details and features
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Internal Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., pro"
                                    disabled={!!editingTier}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    placeholder="e.g., Pro Plan"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g., For serious learners"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priceMonthly">Monthly Price ($)</Label>
                                <Input
                                    id="priceMonthly"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.priceMonthly}
                                    onChange={(e) => setFormData(prev => ({ ...prev, priceMonthly: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceYearly">Yearly Price ($)</Label>
                                <Input
                                    id="priceYearly"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.priceYearly}
                                    onChange={(e) => setFormData(prev => ({ ...prev, priceYearly: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Features</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Feature
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            placeholder={`Feature ${index + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFeature(index)}
                                            disabled={formData.features.length === 1}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Active</Label>
                                <p className="text-sm text-muted-foreground">
                                    Show this tier on the pricing page
                                </p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {editingTier ? 'Save Changes' : 'Create Tier'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
