'use client';

import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
    const { user } = useAuth();
    return (
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center space-x-6">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h2 className="text-sm font-bold tracking-tight text-slate-900">{title}</h2>
            </div>
            <div className="flex items-center space-x-10">
                <div className="relative hidden md:block">
                    <Search className="h-3.5 w-3.5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        className="pl-10 pr-4 py-2.5 text-[11px] font-medium search-input w-72 transition-all"
                    />
                </div>
                <div className="flex items-center space-x-6">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all relative group">
                        <Bell className="h-4 w-4 stroke-[1.8px]" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-white"></span>
                    </button>
                    <div className="h-4 w-[1px] bg-slate-100"></div>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-[10px] font-bold text-slate-900 tracking-wide">
                                {user?.name || 'Guest'}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                Administrator
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                            <User className="h-4 w-4 text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
