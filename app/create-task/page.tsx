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
        
        // Pre-select lead if passed as query parameter
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
                // Filter active leads (not Won or Lost)
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

                    setFormData({
                        title: '',
                        description: '',
                        due_date: '',
                        priority: 'Medium',
                        status: 'Pending',
                        lead_id: '',
                    });

                    setTimeout(() => {
                        router.push('/tasks');
                    }, 2000);
                }
            } catch (error: any) {
                console.error('Error creating task:', error);
                setApiError(error.response?.data?.message || 'Failed to create task. Please try again.');
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
            <div className="flex h-screen bg-background">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header title="Deploy New Workflow" onMenuClick={() => setSidebarOpen(true)} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-slate-400 hover:text-slate-900 mb-10 transition-all group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-3 transition-transform group-hover:-translate-x-1" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Return to Flow</span>
                        </button>

                        {showSuccess && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-emerald-800 font-medium">
                                        Task created successfully!
                                    </p>
                                    <p className="text-xs text-emerald-700 mt-1">
                                        Redirecting to tasks page...
                                    </p>
                                </div>
                            </div>
                        )}

                        {apiError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                                <p className="text-sm text-red-800 font-medium">
                                    {apiError}
                                </p>
                            </div>
                        )}

                        <div className="glass-card overflow-hidden">
                            <div className="border-b border-slate-50 px-8 py-6 bg-slate-50/30">
                                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                                    Workflow Specifications
                                </h2>
                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                                    Define the parameters for this task execution.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 text-black">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="title"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Objective <span className="text-danger">*</span>
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-3 text-[11px] font-medium transition-all rounded-xl ${
                                                    errors.title
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input'
                                                }`}
                                                placeholder="Primary Task Identification"
                                            />
                                        </div>
                                        {errors.title && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.title}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Operational Details
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-4 text-[11px] font-medium search-input transition-all resize-none rounded-xl"
                                            placeholder="Specify detailed instructions or context..."
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="due_date"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Deadline
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <input
                                                type="date"
                                                id="due_date"
                                                name="due_date"
                                                value={formData.due_date}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest search-input transition-all rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="priority"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Priority Tier
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest search-input focus:bg-white appearance-none"
                                        >
                                            {priorityOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Current State
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest search-input focus:bg-white appearance-none"
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="lead_id"
                                            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3"
                                        >
                                            Context (Lead Mapping)
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <select
                                                id="lead_id"
                                                name="lead_id"
                                                value={formData.lead_id}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest search-input appearance-none rounded-xl"
                                                disabled={loadingLeads}
                                            >
                                                <option value="">No Lead Assigned</option>
                                                {leads.map((lead) => (
                                                    <option key={lead.id} value={lead.id}>
                                                        {lead.name} • {lead.stage}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {loadingLeads && (
                                            <p className="text-xs text-slate-500 mt-1">Loading leads...</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 mt-12 pt-8 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        disabled={loading}
                                        className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-10 py-3 text-[10px] font-bold uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Deploy Task'
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
