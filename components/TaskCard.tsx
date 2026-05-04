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

    const priorityColor = getPriorityColor(task.priority);
    const statusColor = getTaskStatusColor(task.status);

    const StatusIcon = task.status === 'Completed'
        ? CheckCircle
        : task.status === 'In Progress'
            ? Clock
            : AlertCircle;

    const handleStatusChange = async (newStatus: 'Pending' | 'In Progress' | 'Completed') => {
        if (newStatus === task.status) return;

        try {
            setIsUpdating(true);
            console.log('Updating task status:', { taskId: task.id, newStatus });

            const result = await updateTaskStatus(task.id, newStatus);
            console.log('Status update result:', result);

            // Call parent callback if provided
            if (onStatusUpdate) {
                onStatusUpdate(task.id, newStatus);
            }

            setShowStatusDropdown(false);
        } catch (error: any) {
            console.error('Failed to update task status:', error);

            // Show detailed error message
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update task status';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Completed':
                return { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle };
            case 'In Progress':
                return { bg: 'bg-primary/10', text: 'text-primary', icon: Clock };
            default:
                return { bg: 'bg-slate-100', text: 'text-slate-500', icon: AlertCircle };
        }
    };

    const statusConfig = getStatusConfig(task.status);

    return (
        <div className="flex items-center justify-between p-5 border border-slate-100 bg-white rounded-2xl hover:border-primary/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl ${statusConfig.bg} shadow-sm`}>
                    <statusConfig.icon className={`h-5 w-5 ${statusConfig.text}`} />
                </div>
                <div>
                    <p className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors">{task.title}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-[10px] text-slate-400 flex items-center font-bold uppercase tracking-wider">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-300" />
                            {formatDate(task.dueDate)}
                        </span>
                        <span
                            className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${task.priority === 'High'
                                ? 'bg-rose-50 text-rose-600'
                                : task.priority === 'Medium'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                        >
                            {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mr-2"></div>
                            {task.leadName}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                {/* Status Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        disabled={isUpdating}
                        className={`flex items-center space-x-2 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                : task.status === 'In Progress'
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <>
                                <span>{task.status}</span>
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </>
                        )}
                    </button>

                    {showStatusDropdown && !isUpdating && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in">
                            <div className="p-1">
                                {['Pending', 'In Progress', 'Completed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status as 'Pending' | 'In Progress' | 'Completed')}
                                        className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 rounded-lg transition-all ${status === task.status ? 'text-primary bg-blue-50/50' : 'text-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {status === 'Completed' && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                                            {status === 'In Progress' && <Clock className="h-3.5 w-3.5 text-blue-500" />}
                                            {status === 'Pending' && <AlertCircle className="h-3.5 w-3.5 text-slate-400" />}
                                            <span>{status}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all">
                    <Phone className="h-4 w-4 stroke-[1.8px]" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all">
                    <Mail className="h-4 w-4 stroke-[1.8px]" />
                </button>
            </div>
        </div>
    );
}
