'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { createLead } from '../services/leadsService';
import {
    User,
    Building2,
    Mail,
    Phone,
    DollarSign,
    Tag,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Loader2,
} from 'lucide-react';

export default function AddLeadPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New Leads',
        priority: 'Medium',
        value: '',
        source: 'Website',
    });

    const statusOptions = [
        'New Leads',
        'Contacted',
        'Qualified',
        'Proposal',
        'Second Wing',
        'Closed Won',
        'Closed Lost',
    ];

    const priorityOptions = ['High', 'Medium', 'Low'];

    const sourceOptions = [
        'Website',
        'Referral',
        'Cold Call',
        'LinkedIn',
        'Email Campaign',
        'Trade Show',
        'Other',
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        }

        if (formData.value && isNaN(Number(formData.value))) {
            newErrors.value = 'Please enter a valid number';
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

                // Prepare data for API
                const leadData = {
                    name: formData.name,
                    email: formData.email || undefined,
                    phone: formData.phone,
                    company: formData.company || undefined,
                    stage: formData.status,
                    source: formData.source,
                    priority: formData.priority,
                    value: formData.value || undefined,
                };

                // Call API to create lead
                const response = await createLead(leadData);

                if (response.success) {
                    // Show success message
                    setShowSuccess(true);

                    // Reset form
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        status: 'New Leads',
                        priority: 'Medium',
                        value: '',
                        source: 'Website',
                    });

                    // Redirect to leads page after 2 seconds
                    setTimeout(() => {
                        router.push('/leads');
                    }, 2000);
                }
            } catch (error: any) {
                console.error('Error creating lead:', error);
                setApiError(error.response?.data?.message || 'Failed to create lead. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Add New Lead" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-slate-400 hover:text-slate-900 mb-10 transition-all group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Back to Directory</span>
                        </button>

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-emerald-800 font-medium">
                                        Lead created successfully!
                                    </p>
                                    <p className="text-xs text-emerald-700 mt-1">
                                        Redirecting to leads page...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {apiError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                                <p className="text-sm text-red-800 font-medium">
                                    {apiError}
                                </p>
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="glass-card overflow-hidden">
                            <div className="border-b border-slate-50 px-8 py-6 bg-slate-50/30">
                                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Lead Information</h2>
                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                                    Enter the core details to initialize a new lead.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 text-black">
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full pl-11 pr-4 py-3 text-[11px] font-medium transition-all rounded-xl ${errors.name
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input'
                                                    }`}
                                                placeholder="Legal Name"
                                            />
                                        </div>
                                        {errors.name && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.name}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 text-[11px] font-medium transition-all ${errors.email
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input focus:bg-white'
                                                    }`}
                                                placeholder="primary@domain.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.email}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Phone Number <span className="text-danger">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 text-[11px] font-medium transition-all ${errors.phone
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input focus:bg-white'
                                                    }`}
                                                placeholder="012 345 6789"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.phone}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Company Name <span className="text-danger">*</span>
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 text-[11px] font-medium transition-all ${errors.company
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input focus:bg-white'
                                                    }`}
                                                placeholder="Entity Name"
                                            />
                                        </div>
                                        {errors.company && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.company}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Lead Stage
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

                                    {/* Priority */}
                                    <div>
                                        <label
                                            htmlFor="priority"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Priority
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

                                    {/* Deal Value */}
                                    <div>
                                        <label
                                            htmlFor="value"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Deal Value (USD)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                id="value"
                                                name="value"
                                                value={formData.value}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 text-[11px] font-bold transition-all ${errors.value
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-100'
                                                        : 'search-input focus:bg-white'
                                                    }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.value && (
                                            <div className="flex items-center mt-1.5">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                                                <p className="text-xs text-red-600">{errors.value}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Source */}
                                    <div>
                                        <label
                                            htmlFor="source"
                                            className="block text-xs font-semibold text-slate-600 mb-2"
                                        >
                                            Lead Source
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                            <select
                                                id="source"
                                                name="source"
                                                value={formData.source}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 text-[11px] font-bold uppercase tracking-widest search-input focus:bg-white appearance-none"
                                            >
                                                {sourceOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end space-x-4 mt-12 pt-8 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        disabled={loading}
                                        className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-10 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Create Lead'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
