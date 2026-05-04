'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PrivateRoute from '../components/auth/PrivateRoute';
import { createTask } from '../services/tasksService';
import { getLeads, Lead } from '../services/leadsService';
import {
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
    User,
    Tag,
    Activity,
} from 'lucide-react';

function CreateTaskForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'Medium',
        status: 'Pending',
        lead_id: '',
    });

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const priorityOptions = ['High', 'Medium', 'Low'];
    const statusOptions = ['Pending', 'In Progress', 'Completed'];

    useEffect(() => {
        fetchLeads();
        const leadId = searchParams.get('lead_id');
        if (leadId) {
            setFormData(prev => ({ ...prev, lead_id: leadId }));
        }
    }, [searchParams]);

    const fetchLeads = async () => {
        try {
            setLoadingLeads(true);
            const response = await getLeads();
            if (response.success) {
                const activeLeads = response.data.leads.filter(
                    lead => !['Won', 'Lost', 'Closed Won', 'Closed Lost'].includes(lead.stage)
                );
                setLeads(activeLeads);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoadingLeads(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                setApiError(null);

                const taskData = {
                    title: formData.title,
                    description: formData.description || undefined,
                    due_date: formData.due_date || undefined,
                    priority: formData.priority as 'High' | 'Medium' | 'Low',
                    status: formData.status as 'Pending' | 'In Progress' | 'Completed',
                    lead_id: formData.lead_id ? parseInt(formData.lead_id) : undefined,
                };

                const response = await createTask(taskData);

                if (response.success) {
                    setShowSuccess(true);
                    setTimeout(() => {
                        router.push('/tasks');
                    }, 2000);
                }
            } catch (error: any) {
                console.error('Error creating task:', error);
                setApiError(error.response?.data?.message || 'Failed to create task.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <PrivateRoute>
            <div className="flex h-screen bg-[#F8FAFC]">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header title="Create Operational Task" onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-8 md:p-12">
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-all group"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2.5 transition-transform group-hover:-translate-x-1 stroke-[2.5px]" />
                                <span className="text-[13px] font-bold">Back to Tasks</span>
                            </button>

                            {showSuccess && (
                                <div className="mb-8 bg-emerald-50/50 border border-emerald-100 rounded-[20px] p-5 flex items-center animate-slide-up">
                                    <div className="p-2.5 bg-emerald-500 rounded-xl mr-4 shadow-lg shadow-emerald-500/10">
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] text-emerald-900 font-bold">Task Created Successfully</p>
                                        <p className="text-[12px] text-emerald-600 font-medium">Redirecting to operations board...</p>
                                    </div>
                                </div>
                            )}

                            {apiError && (
                                <div className="mb-8 bg-rose-50/50 border border-rose-100 rounded-[20px] p-5 flex items-center animate-slide-up">
                                    <div className="p-2.5 bg-rose-500 rounded-xl mr-4 shadow-lg shadow-rose-500/10">
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <p className="text-[13px] text-rose-800 font-bold">{apiError}</p>
                                </div>
                            )}

                            <div className="premium-card overflow-hidden">
                                <div className="border-b border-slate-100 px-10 py-8 bg-slate-50/30">
                                    <h2 className="text-[16px] font-bold text-slate-900 tracking-tight">
                                        New Task Specifications
                                    </h2>
                                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                                        Fill in the details below to initiate a new operational workflow.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-[13px] font-bold text-slate-700 mb-3">
                                                Task Title <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative group">
                                                <FileText className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    className={`w-full pl-14 pr-6 py-3.5 text-[14px] font-medium transition-all rounded-xl border bg-white ${
                                                        errors.title
                                                            ? 'border-rose-300 bg-rose-50 focus:ring-rose-100'
                                                            : 'border-slate-200 focus:border-primary/30'
                                                    } shadow-sm`}
                                                    placeholder="Enter task objective..."
                                                />
                                            </div>
                                            {errors.title && (
                                                <p className="text-[11px] text-rose-500 font-bold mt-2 flex items-center">
                                                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-[13px] font-bold text-slate-700 mb-3">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={5}
                                                className="w-full px-6 py-4 text-[14px] font-medium border-slate-200 focus:border-primary/30 transition-all resize-none rounded-[18px] bg-white outline-none shadow-sm"
                                                placeholder="Provide detailed instructions or context..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-slate-700">
                                                Target Deadline
                                            </label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary pointer-events-none" />
                                                <input
                                                    type="date"
                                                    id="due_date"
                                                    name="due_date"
                                                    value={formData.due_date}
                                                    onChange={handleChange}
                                                    className="w-full pl-14 pr-6 py-3.5 text-[14px] font-medium border border-slate-200 rounded-xl focus:border-primary/30 bg-white shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-slate-700">
                                                Priority Tier
                                            </label>
                                            <div className="relative group">
                                                <Tag className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary pointer-events-none" />
                                                <select
                                                    id="priority"
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleChange}
                                                    className="w-full pl-14 pr-6 py-3.5 text-[14px] font-bold border border-slate-200 rounded-xl focus:border-primary/30 bg-white appearance-none cursor-pointer shadow-sm"
                                                >
                                                    {priorityOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option} Priority
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-slate-700">
                                                Initial State
                                            </label>
                                            <div className="relative group">
                                                <Activity className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary pointer-events-none" />
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    className="w-full pl-14 pr-6 py-3.5 text-[14px] font-bold border border-slate-200 rounded-xl focus:border-primary/30 bg-white appearance-none cursor-pointer shadow-sm"
                                                >
                                                    {statusOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-slate-700">
                                                Context (Lead Mapping)
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary pointer-events-none" />
                                                <select
                                                    id="lead_id"
                                                    name="lead_id"
                                                    value={formData.lead_id}
                                                    onChange={handleChange}
                                                    className="w-full pl-14 pr-6 py-3.5 text-[14px] font-bold border border-slate-200 rounded-xl focus:border-primary/30 bg-white appearance-none cursor-pointer shadow-sm"
                                                    disabled={loadingLeads}
                                                >
                                                    <option value="">No Active Lead Mapping</option>
                                                    {leads.map((lead) => (
                                                        <option key={lead.id} value={lead.id}>
                                                            {lead.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end space-x-6 mt-16 pt-10 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            disabled={loading}
                                            className="px-8 py-3 text-[14px] font-bold text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-10 py-3.5 text-[14px] font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2.5 animate-spin stroke-[2.5px]" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Initiate Task'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </PrivateRoute>
    );
}

export default function CreateTaskPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateTaskForm />
        </Suspense>
    );
}
