'use client';

import Link from 'next/link';
import { User, ChevronRight, GripVertical } from 'lucide-react';
import { Lead } from '@/app/services/leadsService';
import { formatCurrency, formatDate, getStatusColor, getPriorityColor } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LeadCardProps {
    lead: Lead;
    compact?: boolean;
    isDraggable?: boolean;
}

export default function LeadCard({ lead, compact = false, isDraggable = false }: LeadCardProps) {
    const statusColor = getStatusColor(lead.stage);
    const priorityColor = getPriorityColor('Medium'); // Default priority since API doesn't provide it

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: lead.id.toString(),
        disabled: !isDraggable,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (compact) {
        return (
            <Link
                href={`/leads/${lead.id}`}
                className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-150 cursor-pointer"
            >
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead.name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.email || lead.phone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-900">
                        {lead.source}
                    </p>
                    <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 bg-${statusColor}-50 text-${statusColor}-700`}
                    >
                        {lead.stage}
                    </span>
                </div>
            </Link>
        );
    }

    if (isDraggable) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`bg-white rounded-xl border border-slate-100 p-4 hover:border-primary/20 transition-all duration-300 ${isDragging ? 'shadow-2xl border-primary/50 scale-[1.02] z-50' : 'shadow-sm'
                    } group`}
            >
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-primary transition-all"
                        >
                            <GripVertical className="h-3.5 w-3.5 stroke-[2.5px]" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-primary transition-colors tracking-tight">{lead.name}</p>
                    </div>
                </div>
                <div className="ml-9">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate">{lead.email || lead.phone}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50/50">
                        <span className="text-[9px] font-bold text-primary bg-blue-50/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                            {lead.source}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(lead.updated_at)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/leads/${lead.id}`}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer block group"
        >
            <div className="flex items-start justify-between mb-2">
                <p className="text-[11px] font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">{lead.name}</p>
                <ChevronRight className="h-3.5 w-3.5 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate mb-4">{lead.email || lead.phone}</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50/50">
                <span className="text-[9px] font-bold text-primary bg-blue-50/50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {lead.source}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{formatDate(lead.updated_at)}</span>
            </div>
        </Link>
    );
}
