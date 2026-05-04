'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, Phone, Mail, CheckCircle, Clock, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, getPriorityColor, getTaskStatusColor } from '@/lib/utils';
import { updateTaskStatus } from '@/app/services/tasksService';

interface TaskCardProps {
    task: Task;
    onStatusUpdate?: (taskId: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => void;
}

export default function TaskCard({ task, onStatusUpdate }: TaskCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowStatusDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = async (newStatus: 'Pending' | 'In Progress' | 'Completed') => {
        if (newStatus === task.status) return;

        try {
            setIsUpdating(true);
            await updateTaskStatus(task.id, newStatus);

            if (onStatusUpdate) {
                onStatusUpdate(task.id, newStatus);
            }

            setShowStatusDropdown(false);
        } catch (error: any) {
            console.error('Failed to update task status:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update task status';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Completed':
                return { bg: 'bg-emerald-50/50', text: 'text-emerald-600', icon: CheckCircle };
            case 'In Progress':
                return { bg: 'bg-blue-50/50', text: 'text-primary', icon: Clock };
            default:
                return { bg: 'bg-slate-50/50', text: 'text-slate-400', icon: AlertCircle };
        }
    };

    const statusConfig = getStatusConfig(task.status);

    return (
        <div className="flex items-center justify-between p-6 border border-slate-200/60 bg-white rounded-[20px] hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-300 group">
            <div className="flex items-center space-x-5 min-w-0 flex-1">
                <div className={`p-3.5 rounded-xl ${statusConfig.bg} transition-colors duration-300`}>
                    <statusConfig.icon className={`h-5 w-5 ${statusConfig.text} stroke-[2px]`} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 mt-2">
                        <span className="text-[12px] text-slate-500 flex items-center font-medium">
                            <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                            {formatDate(task.dueDate)}
                        </span>
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.priority === 'High'
                                ? 'bg-rose-50 text-rose-600'
                                : task.priority === 'Medium'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                        >
                            {task.priority}
                        </span>
                        <span className="text-[12px] text-slate-500 font-medium flex items-center">
                            <div className="w-1 h-1 rounded-full bg-slate-300 mr-2"></div>
                            {task.leadName || 'System'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 ml-6">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        disabled={isUpdating}
                        className={`flex items-center space-x-3 px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all border ${task.status === 'Completed'
                                ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-50'
                                : task.status === 'In Progress'
                                    ? 'bg-blue-50/50 text-primary border-blue-100/50 hover:bg-blue-50'
                                    : 'bg-slate-50/50 text-slate-500 border-slate-200/50 hover:bg-slate-100'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUpdating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <>
                                <span>{task.status}</span>
                                <ChevronDown className={`h-3.5 w-3.5 opacity-50 transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </button>

                    {showStatusDropdown && !isUpdating && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200/60 rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5">
                            {['Pending', 'In Progress', 'Completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status as 'Pending' | 'In Progress' | 'Completed')}
                                    className={`w-full text-left px-4 py-3 text-[12px] font-bold hover:bg-slate-50 rounded-xl transition-all ${status === task.status ? 'text-primary bg-blue-50/40' : 'text-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {status === 'Completed' && <CheckCircle className="h-4 w-4 text-emerald-500 stroke-[2px]" />}
                                        {status === 'In Progress' && <Clock className="h-4 w-4 text-primary stroke-[2px]" />}
                                        {status === 'Pending' && <AlertCircle className="h-4 w-4 text-slate-400 stroke-[2px]" />}
                                        <span>{status}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-1">
                    <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all duration-200">
                        <Phone className="h-[18px] w-[18px] stroke-[1.8px]" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all duration-200">
                        <Mail className="h-[18px] w-[18px] stroke-[1.8px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
