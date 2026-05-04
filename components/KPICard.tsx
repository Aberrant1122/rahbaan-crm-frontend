'use client';

import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
}

export default function KPICard({ title, value, change, trend, icon: Icon }: KPICardProps) {
    return (
        <div className="glass-card p-8 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-4 tracking-tighter">{value}</p>
                    <div className="flex items-center mt-6">
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}
                        >
                            {change}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-3">Velocity</span>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                    <Icon className="h-5 w-5 text-slate-600 group-hover:text-primary stroke-[2px] transition-colors" />
                </div>
            </div>
        </div>
    );
}
