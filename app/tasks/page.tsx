'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PrivateRoute from '../components/auth/PrivateRoute';
import TaskCard from '@/components/TaskCard';

import { getTasks, Task } from '../services/tasksService';

export default function TasksPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getTasks();
            setTasks(response.data);
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            setError(err.response?.data?.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        return true;
    });

    return (
        <PrivateRoute>
            <div className="flex h-screen bg-[#F8FAFC]">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header title="Operational Tasks" onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-8 md:p-12">
                        {/* Executive Filters and Actions */}
                        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="relative group">
                                    <Search className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
                                        className="pl-12 pr-6 py-3 text-[14px] font-medium search-input w-full md:w-80 bg-white border-slate-200 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-5 py-3 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer min-w-[170px] shadow-sm"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <select
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                        className="px-5 py-3 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer min-w-[170px] shadow-sm"
                                    >
                                        <option value="all">All Priorities</option>
                                        <option value="High">High Priority</option>
                                        <option value="Medium">Medium Priority</option>
                                        <option value="Low">Low Priority</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={() => router.push('/create-task')}
                                className="flex items-center justify-center px-8 py-3.5 bg-primary text-white text-[13px] font-bold rounded-xl hover:bg-primary-hover transition-all shadow-xl shadow-blue-500/10 active:scale-95"
                            >
                                <Plus className="h-4.5 w-4.5 mr-2.5 stroke-[2.5px]" />
                                Create Task
                            </button>
                        </div>

                        {/* Task List Architecture */}
                        <div className="premium-card p-8">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                                        Backlog Overview
                                    </h3>
                                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 border border-slate-200/50">
                                        {filteredTasks.length} Units
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Database Sync Active</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary stroke-[2px]" />
                                        <p className="text-[13px] font-bold text-slate-400">Loading operational data...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-20 bg-rose-50/20 border border-rose-100 rounded-[24px]">
                                        <p className="text-rose-500 font-bold text-[14px]">{error}</p>
                                        <button
                                            onClick={fetchTasks}
                                            className="mt-6 px-8 py-3 bg-white text-rose-600 font-bold text-[12px] border border-rose-100 rounded-xl hover:bg-rose-50 transition-all"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : filteredTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredTasks.map((task) => (
                                            <TaskCard 
                                                key={task.id} 
                                                task={{
                                                    id: task.id,
                                                    title: task.title,
                                                    description: task.description || '',
                                                    dueDate: task.due_date || (task as any).dueDate,
                                                    priority: task.priority,
                                                    status: task.status,
                                                    leadId: task.lead_id || (task as any).leadId || 0,
                                                    leadName: (task as any).leadName || 'General'
                                                }}
                                                onStatusUpdate={(taskId, newStatus) => {
                                                    setTasks(prevTasks => 
                                                        prevTasks.map(t => 
                                                            t.id === taskId 
                                                                ? { ...t, status: newStatus }
                                                                : t
                                                        )
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Filter className="h-6 w-6 text-slate-200" />
                                        </div>
                                        <p className="text-[14px] font-bold text-slate-400">No tasks found matching current filters</p>
                                        <button
                                            onClick={() => router.push('/create-task')}
                                            className="mt-8 px-10 py-3.5 text-[12px] font-bold text-primary border-2 border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                            Initiate New Task
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </PrivateRoute>
    );
}
