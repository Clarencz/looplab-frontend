import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type AdminCategory } from '@/lib/api/admin';
import { Plus, Edit2, Trash2, GripVertical, X, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function AdminCategories() {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<AdminCategory>>({});
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminApi.listCategories,
    });

    const createMutation = useMutation({
        mutationFn: adminApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            setIsCreating(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            adminApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            setEditingId(null);
            setEditForm({});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: adminApi.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });

    const reorderMutation = useMutation({
        mutationFn: adminApi.reorderCategories,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createMutation.mutate({
            name: formData.get('name') as string,
            display_name: formData.get('display_name') as string,
            description: formData.get('description') as string,
            icon: formData.get('icon') as string,
            color: formData.get('color') as string,
        });
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setEditForm({
            name: category.name,
            description: category.description,
            icon: category.icon,
            color: category.color,
        });
    };

    const handleUpdate = (id: string) => {
        updateMutation.mutate({ id, data: editForm });
    };

    const handleToggleActive = (category: Category) => {
        updateMutation.mutate({
            id: category.id,
            data: { isActive: !category.isActive },
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !categories) return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update displayOrder for all affected items
        const orders = items.map((item, index) => ({
            id: item.id,
            displayOrder: index,
        }));

        // Optimistically update the UI
        queryClient.setQueryData(['admin', 'categories'], items);

        // Send to server
        reorderMutation.mutate(orders);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Create New Category</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name (slug)
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="web-development"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="display_name"
                                    required
                                    placeholder="Web Development"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    name="icon"
                                    placeholder="code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    name="color"
                                    defaultValue="#3B82F6"
                                    className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Category'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Categories</h2>
                </div>
                {isLoading ? (
                    <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
                ) : categories?.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No categories yet. Create one to get started.
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="divide-y divide-gray-200"
                                >
                                    {categories?.map((category: Category, index: number) => (
                                        <Draggable
                                            key={category.id}
                                            draggableId={category.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`px-6 py-4 ${snapshot.isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {editingId === category.id ? (
                                                        // Edit Mode
                                                        <div className="space-y-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.name || ''}
                                                                        onChange={(e) =>
                                                                            setEditForm({ ...editForm, name: e.target.value })
                                                                        }
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                        Icon
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.icon || ''}
                                                                        onChange={(e) =>
                                                                            setEditForm({ ...editForm, icon: e.target.value })
                                                                        }
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                    Description
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.description || ''}
                                                                    onChange={(e) =>
                                                                        setEditForm({ ...editForm, description: e.target.value })
                                                                    }
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleUpdate(category.id)}
                                                                    disabled={updateMutation.isPending}
                                                                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                                                >
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingId(null);
                                                                        setEditForm({});
                                                                    }}
                                                                    className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                                                >
                                                                    <X className="w-3 h-3 mr-1" />
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // View Mode
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing"
                                                                >
                                                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                                                </div>
                                                                <div
                                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                                                                    style={{ backgroundColor: category.color || '#3B82F6' }}
                                                                >
                                                                    {category.icon || category.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                                                                    <p className="text-sm text-gray-500">{category.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleToggleActive(category)}
                                                                    className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${category.isActive
                                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                                        }`}
                                                                    title="Click to toggle status"
                                                                >
                                                                    {category.isActive ? 'Active' : 'Inactive'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEdit(category)}
                                                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(category.id)}
                                                                    className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>
        </div>
    );
}
