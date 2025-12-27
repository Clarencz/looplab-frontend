import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminAnalytics() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    const { data: revenue } = useQuery({
        queryKey: ['admin', 'analytics', 'revenue', period],
        queryFn: () => adminApi.getRevenueAnalytics(period),
    });

    const { data: users } = useQuery({
        queryKey: ['admin', 'analytics', 'users', period],
        queryFn: () => adminApi.getUserAnalytics(period),
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                </select>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        ${revenue?.total_revenue.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        ${revenue?.period_revenue.toLocaleString() || '0'} this period
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {users?.total_users.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        +{users?.new_users_period || '0'} new users this period
                    </p>
                </div>
            </div>

            {/* Revenue by Day Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue?.revenue_by_day || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Revenue ($)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue by Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue by Payment Method
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={revenue?.revenue_by_method || []}
                                dataKey="amount"
                                nameKey="method"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {revenue?.revenue_by_method?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue by Country
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={revenue?.revenue_by_country || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="country" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={users?.user_growth_by_day || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="new_users"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="New Users"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_users"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Total Users"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
