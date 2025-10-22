import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    HomeIcon,
    PaperAirplaneIcon,
    MapPinIcon,
    CogIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { name: 'Vuelos', href: route('admin.vuelos.index'), icon: PaperAirplaneIcon },
        { name: 'Ciudades', href: route('admin.ciudades.index'), icon: MapPinIcon },
        { name: 'Aeronaves', href: route('admin.aeronaves.index'), icon: BuildingOfficeIcon },
        { name: 'Reservas', href: route('admin.reservas.index'), icon: ChartBarIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                    <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-primary-700">
                        <div className="flex items-center justify-between px-4 py-6 bg-primary-800">
                            <span className="text-xl font-bold text-white">Admin Panel</span>
                            <button onClick={() => setSidebarOpen(false)} className="text-white">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-primary-600 rounded-lg transition-colors"
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow bg-primary-700 overflow-y-auto">
                    <div className="flex items-center px-4 py-6 bg-primary-800">
                        <ShieldCheckIcon className="w-8 h-8 text-secondary-500 mr-3" />
                        <div>
                            <div className="text-xl font-bold text-white">AirGuider</div>
                            <div className="text-xs text-primary-200">Panel Admin</div>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-sm font-medium text-white hover:bg-primary-600 rounded-lg transition-colors"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="px-4 py-4 bg-primary-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {auth?.user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-white">{auth?.user?.name}</div>
                                    <div className="text-xs text-primary-200">Administrador</div>
                                </div>
                            </div>
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="text-primary-100 hover:text-white"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64">
                {/* Top bar mobile */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow md:hidden">
                    <button
                        type="button"
                        className="px-4 text-gray-500 focus:outline-none md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700">{auth?.user?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

function ShieldCheckIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

