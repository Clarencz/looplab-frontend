import { useState } from 'react';
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
    LogOut,
    Menu,
    X
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-light min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 safe-area-top">
                <div className="flex items-center justify-between h-14 px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-primary-600">LoopLab Admin</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-primary-600">LoopLab Admin</h1>
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-lg
                                    transition-colors duration-200
                                    ${isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white safe-area-bottom">
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
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Add top padding on mobile for fixed header */}
                <main className="pt-16 lg:pt-0 py-6 lg:py-8 admin-container min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
