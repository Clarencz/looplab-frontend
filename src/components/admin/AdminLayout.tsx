import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FolderTree,
    BookOpen,
    BarChart3,
    Shield,
    FileText,
    FileCode,
    CreditCard,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Learning Paths', href: '/admin/paths', icon: BookOpen },
    { name: 'Projects', href: '/admin/projects', icon: FileCode },
    { name: 'Pricing', href: '/admin/pricing', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Roles', href: '/admin/roles', icon: Shield },
    { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
];

export default function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="admin-light min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-primary-600">LoopLab Admin</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                <main className="py-8 px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
