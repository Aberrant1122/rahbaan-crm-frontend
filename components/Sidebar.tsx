'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
    Home,
    Users,
    BarChart3,
    Settings,
    CheckSquare,
    Layers,
    X,
    UserPlus,
    Plus,
    Calendar,
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigationItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pipeline', href: '/pipeline', icon: Layers },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Add Lead', href: '/add-lead', icon: UserPlus },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Add Task', href: '/create-task', icon: Plus },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
        >
            <div className="flex items-center justify-between h-20 px-8 border-b border-slate-50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-[11px] font-bold text-white">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-slate-900 tracking-tight">{user?.name || 'Rahbaan'}</h1>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CRM Console</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden text-slate-400 hover:text-primary transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 relative group ${active
                                ? 'sidebar-link-active text-primary'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <Icon
                                className={`h-4 w-4 mr-4 transition-all duration-300 stroke-[2px] ${active ? 'text-primary' : 'text-slate-300 group-hover:text-primary'
                                    }`}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-8 mt-auto border-t border-slate-50">
                <div className="flex items-center space-x-3 text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                </div>
            </div>
        </div>
    );
}
