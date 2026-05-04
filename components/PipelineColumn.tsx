'use client';

import { Plus } from 'lucide-react';
import { PipelineStage } from '@/types';
import { Lead } from '@/app/services/leadsService';
import LeadCard from './LeadCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface PipelineColumnProps {
    stage: PipelineStage;
    leads: Lead[];
    onAddLead?: () => void;
    isDragEnabled?: boolean;
}

export default function PipelineColumn({ stage, leads, onAddLead, isDragEnabled = false }: PipelineColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.name,
    });

    const leadIds = leads.map(lead => lead.id.toString());

    return (
        <div
            ref={setNodeRef}
            className={`flex-shrink-0 w-80 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-sm ${isOver && isDragEnabled ? 'ring-4 ring-primary/5 border-primary/20 bg-white' : ''
                } transition-all duration-300`}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">{stage.name}</h4>
                    <span
                        className="text-[10px] font-bold text-primary bg-blue-50 px-2.5 py-0.5 rounded-full"
                    >
                        {stage.count}
                    </span>
                </div>
                {onAddLead && (
                    <button
                        onClick={onAddLead}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1 scrollbar-hide">
                {isDragEnabled ? (
                    <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} isDraggable={true} />
                        ))}
                    </SortableContext>
                ) : (
                    leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} isDraggable={false} />
                    ))
                )}
            </div>
        </div>
    );
}
