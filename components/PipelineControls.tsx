'use client';

import { useState } from 'react';
import { Settings, ToggleLeft, ToggleRight, RefreshCw, Users, Filter } from 'lucide-react';

interface PipelineControlsProps {
    isDragEnabled: boolean;
    onToggleDrag: (enabled: boolean) => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    totalLeads?: number;
}

export default function PipelineControls({ 
    isDragEnabled, 
    onToggleDrag, 
    onRefresh, 
    isRefreshing = false,
    totalLeads = 0 
}: PipelineControlsProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-5">
                <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Active Pipeline</h2>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                        {totalLeads} Potential Leads In-System
                    </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-3">
                {/* Refresh Button */}
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-3 px-6 py-2.5 bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:shadow-md rounded-xl transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Synchronize</span>
                </button>

                {/* Filters Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-3 px-6 py-2.5 bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:shadow-md rounded-xl transition-all"
                >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter View</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-100 mx-1"></div>

                {/* Drag & Drop Toggle */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => onToggleDrag(!isDragEnabled)}
                        className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isDragEnabled 
                                ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                    >
                        {isDragEnabled ? (
                            <>
                                <ToggleRight className="h-4 w-4" />
                                <span>Draggable</span>
                            </>
                        ) : (
                            <>
                                <ToggleLeft className="h-4 w-4" />
                                <span>Static Mode</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}