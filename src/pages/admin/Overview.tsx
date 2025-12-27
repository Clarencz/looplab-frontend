import { useQuery } from '@tanstack/react-query';
import { adminApi, type OverviewStats } from '@/lib/api/admin';
import {
    Users,
    DollarSign,
    TrendingUp,
    BookOpen,
    Activity,
    CreditCard
} from 'lucide-react';

function StatCard({
    title,
    value,
    icon: Icon,
    trend
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 mt-1">{trend}</p>
                    )}
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                </div>
            </div>
        </div>
    );
}

export default function AdminOverview() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'overview'],
        queryFn: adminApi.getOverview,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.total_users.toLocaleString()}
                    icon={Users}
                    trend={`${stats.active_users_30d} active (30d)`}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.total_revenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend={`$${stats.revenue_30d.toLocaleString()} (30d)`}
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.active_subscriptions.toLocaleString()}
                    icon={CreditCard}
                    trend={`${stats.total_subscriptions} total`}
                />
                <StatCard
                    title="Learning Paths"
                    value={stats.total_paths.toLocaleString()}
                    icon={BookOpen}
                    trend={`${stats.total_projects} projects`}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/users"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <Users className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="font-medium text-gray-900">Manage Users</span>
                    </a>
                    <a
                        href="/admin/categories"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="font-medium text-gray-900">Manage Content</span>
                    </a>
                    <a
                        href="/admin/analytics"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                    >
                        <TrendingUp className="w-5 h-5 text-primary-600 mr-3" />
                        <span className="font-medium text-gray-900">View Analytics</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
