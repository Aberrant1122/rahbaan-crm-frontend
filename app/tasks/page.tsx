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

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        return true;
    });

    return (
        <PrivateRoute>
            <div className="flex h-screen bg-background">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header title="Tasks" onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    {/* Filters and Actions */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex text-black items-center space-x-4">
                            <div className="relative">
                                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="pl-10 pr-4 py-2.5 text-xs font-semibold search-input w-72"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest search-input bg-white appearance-none min-w-[160px]"
                            >
                                <option value="all">Status: All</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest search-input bg-white appearance-none min-w-[160px]"
                            >
                                <option value="all">Priority: All</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <button 
                            onClick={() => router.push('/create-task')}
                            className="flex items-center px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                        </button>
                    </div>

                    {/* Task List */}
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-sm font-bold text-slate-900">
                                Active Tasks ({filteredTasks.length})
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-500">{error}</p>
                                    <button
                                        onClick={fetchTasks}
                                        className="mt-4 px-4 py-2 text-sm text-teal-600 hover:text-teal-700"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <TaskCard 
                                        key={task.id} 
                                        task={{
                                            id: task.id,
                                            title: task.title,
                                            description: task.description || '',
                                            dueDate: task.due_date || '',
                                            priority: task.priority,
                                            status: task.status,
                                            leadId: task.lead_id || 0,
                                            leadName: ''
                                        }}
                                        onStatusUpdate={(taskId, newStatus) => {
                                            // Update the task in local state
                                            setTasks(prevTasks => 
                                                prevTasks.map(t => 
                                                    t.id === taskId 
                                                        ? { ...t, status: newStatus }
                                                        : t
                                                )
                                            );
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-sm font-medium text-slate-400">No tasks found</p>
                                    <button
                                        onClick={() => router.push('/create-task')}
                                        className="mt-6 px-6 py-2.5 text-xs font-bold text-primary hover:text-white hover:bg-primary border border-primary rounded-xl transition-all"
                                    >
                                        Add Task
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
