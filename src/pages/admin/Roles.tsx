import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string;
    permissions: string[];
    userCount: number;
    isSystem: boolean;
    createdAt: string;
}

export default function AdminRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('/api/v1/admin/roles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoles(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
                    <p className="text-gray-500">Manage user roles and access permissions</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Role
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Roles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg border p-12 text-center text-gray-500">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No roles found</p>
                    </div>
                ) : (
                    filteredRoles.map((role) => (
                        <div key={role.id} className="bg-white rounded-lg border shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{role.displayName}</h3>
                                        <p className="text-sm text-gray-500">{role.name}</p>
                                    </div>
                                </div>
                                {role.isSystem && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                        System
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Users className="h-4 w-4" />
                                    {role.userCount} users
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" disabled={role.isSystem}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        disabled={role.isSystem}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
