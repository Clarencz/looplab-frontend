import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type LearningPath, type AdminCategory } from '@/lib/api/admin';
import { Plus, Edit, Trash2, Search, BookOpen, Globe, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";

export default function AdminLearningPaths() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
    const queryClient = useQueryClient();

    // Form state for controlled Select components
    const [formState, setFormState] = useState({
        categoryId: '',
        difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'mastery',
        tierRequired: 'free' as 'free' | 'pro' | 'premium',
    });

    // Edit form state
    const [editFormState, setEditFormState] = useState({
        categoryId: '',
        difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'mastery',
        tierRequired: 'free' as 'free' | 'pro' | 'premium',
    });

    // Fetch Paths
    const { data: paths, isLoading } = useQuery({
        queryKey: ['admin', 'learning-paths'],
        queryFn: () => adminApi.listLearningPaths(true),
    });

    // Fetch Categories for dropdown
    const { data: categories } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminApi.listCategories,
    });

    // Create Path Mutation
    const createMutation = useMutation({
        mutationFn: adminApi.createLearningPath,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'learning-paths'] });
            setIsCreateOpen(false);
            // Reset form state
            setFormState({
                categoryId: '',
                difficultyLevel: 'beginner',
                tierRequired: 'free',
            });
            toast.success("Learning path created successfully");
        },
        onError: (error: any) => {
            console.error('Create path error:', error);
            toast.error(error?.message || "Failed to create learning path");
        }
    });

    // Delete Path Mutation
    const deleteMutation = useMutation({
        mutationFn: adminApi.deletePath,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'learning-paths'] });
            toast.success("Learning path deleted");
        },
    });

    // Publish Path Mutation
    const publishMutation = useMutation({
        mutationFn: adminApi.publishPath,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'learning-paths'] });
            toast.success("Learning path published! It will now appear on the public site.");
        },
        onError: (error: any) => {
            console.error('Publish error:', error);
            toast.error(error?.message || "Failed to publish");
        }
    });

    // Unpublish Path Mutation
    const unpublishMutation = useMutation({
        mutationFn: adminApi.unpublishPath,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'learning-paths'] });
            toast.success("Learning path unpublished. It's now a draft.");
        },
        onError: (error: any) => {
            console.error('Unpublish error:', error);
            toast.error(error?.message || "Failed to unpublish");
        }
    });

    // Update Path Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateLearningPath(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'learning-paths'] });
            setIsEditOpen(false);
            setEditingPath(null);
            toast.success("Learning path updated successfully");
        },
        onError: (error: any) => {
            console.error('Update error:', error);
            toast.error(error?.message || "Failed to update learning path");
        }
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const selectedCategory = categories?.find(c => c.id === formState.categoryId);

        if (!formState.categoryId) {
            toast.error("Please select a category");
            return;
        }

        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const estimatedHours = parseInt(formData.get('estimated_hours') as string);
        const isPremium = (e.currentTarget.querySelector('#is_premium') as HTMLInputElement)?.checked || false;

        if (!name || !slug || !description || isNaN(estimatedHours)) {
            toast.error("Please fill in all required fields");
            return;
        }

        createMutation.mutate({
            name,
            slug,
            description,
            category: selectedCategory?.name || 'Uncategorized',
            categoryId: formState.categoryId,
            difficultyLevel: formState.difficultyLevel,
            estimatedHours: estimatedHours,
            tierRequired: formState.tierRequired,
            isPremium: isPremium,
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this path?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (path: LearningPath) => {
        setEditingPath(path);
        setEditFormState({
            categoryId: path.categoryId || '',
            difficultyLevel: path.difficultyLevel as any,
            tierRequired: path.tierRequired as any,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingPath) return;

        const formData = new FormData(e.currentTarget);
        const selectedCategory = categories?.find(c => c.id === editFormState.categoryId);

        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const estimatedHours = parseInt(formData.get('estimated_hours') as string);
        const isPremium = (e.currentTarget.querySelector('#edit_is_premium') as HTMLInputElement)?.checked || false;

        updateMutation.mutate({
            id: editingPath.id,
            data: {
                name,
                slug,
                description,
                category: selectedCategory?.name || editingPath.category,
                categoryId: editFormState.categoryId || undefined,
                difficultyLevel: editFormState.difficultyLevel,
                estimatedHours,
                tierRequired: editFormState.tierRequired,
                isPremium,
            }
        });
    };

    const filteredPaths = paths?.filter(path =>
        path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        path.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
                    <p className="text-gray-500">Manage learning paths and curriculum</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Path
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Learning Path</DialogTitle>
                            <DialogDescription>
                                Add a new learning path to the curriculum.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="Full Stack Web Dev" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" name="slug" placeholder="full-stack-web" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="A comprehensive guide..." required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formState.categoryId}
                                        onValueChange={(value) => setFormState(prev => ({ ...prev, categoryId: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_hours">Est. Hours</Label>
                                    <Input id="estimated_hours" name="estimated_hours" type="number" min="0" defaultValue="10" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select
                                        value={formState.difficultyLevel}
                                        onValueChange={(value: any) => setFormState(prev => ({ ...prev, difficultyLevel: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                            <SelectItem value="mastery">Mastery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tier Required</Label>
                                    <Select
                                        value={formState.tierRequired}
                                        onValueChange={(value: any) => setFormState(prev => ({ ...prev, tierRequired: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="pro">Pro</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="is_premium" name="is_premium" className="rounded border-gray-300" />
                                <Label htmlFor="is_premium">Is Premium Content?</Label>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Creating...' : 'Create Path'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Learning Path</DialogTitle>
                        <DialogDescription>
                            Update the learning path details.
                        </DialogDescription>
                    </DialogHeader>
                    {editingPath && (
                        <form onSubmit={handleUpdate} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_name">Name</Label>
                                    <Input id="edit_name" name="name" defaultValue={editingPath.name} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_slug">Slug</Label>
                                    <Input id="edit_slug" name="slug" defaultValue={editingPath.slug} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit_description">Description</Label>
                                <Textarea id="edit_description" name="description" defaultValue={editingPath.description} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={editFormState.categoryId}
                                        onValueChange={(value) => setEditFormState(prev => ({ ...prev, categoryId: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_estimated_hours">Est. Hours</Label>
                                    <Input id="edit_estimated_hours" name="estimated_hours" type="number" min="0" defaultValue={editingPath.estimatedHours} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select
                                        value={editFormState.difficultyLevel}
                                        onValueChange={(value: any) => setEditFormState(prev => ({ ...prev, difficultyLevel: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                            <SelectItem value="mastery">Mastery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tier Required</Label>
                                    <Select
                                        value={editFormState.tierRequired}
                                        onValueChange={(value: any) => setEditFormState(prev => ({ ...prev, tierRequired: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="pro">Pro</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="edit_is_premium" name="is_premium" defaultChecked={editingPath.isPremium} className="rounded border-gray-300" />
                                <Label htmlFor="edit_is_premium">Is Premium Content?</Label>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending ? 'Updating...' : 'Update Path'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search learning paths..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Paths Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPaths.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No learning paths found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredPaths.map((path) => (
                                <tr key={path.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{path.name}</div>
                                        <div className="text-sm text-gray-500">{path.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{path.category}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {path.difficultyLevel} • {path.estimatedHours}h
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${path.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {path.isActive ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-1">
                                        {path.isActive ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-yellow-600 hover:text-yellow-700"
                                                onClick={() => unpublishMutation.mutate(path.id)}
                                                disabled={unpublishMutation.isPending}
                                                title="Unpublish (make draft)"
                                            >
                                                <EyeOff className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700"
                                                onClick={() => publishMutation.mutate(path.id)}
                                                disabled={publishMutation.isPending}
                                                title="Publish (make public)"
                                            >
                                                <Globe className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(path)}
                                            title="Edit path"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleDelete(path.id)}
                                            title="Delete path"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
