'use client';

import { useState } from 'react';
import { UserPlus, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { createUser } from '../services/userService';

export default function CreateUserPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...userData } = formData;
            await createUser(userData);
            setSuccess(true);

            // Redirect to all users page after 2 seconds
            setTimeout(() => {
                router.push('/all-users');
            }, 2000);
        } catch (err: any) {
            console.error('Failed to create user:', err);
            setApiError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Create New User" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-10">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-slate-50 border border-border rounded-lg">
                                    <UserPlus className="h-6 w-6 text-[#333333]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1A1A1A]">Create User Profile</h2>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        Establish new access credentials for a system user.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start shadow-sm">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-green-900">User created successfully!</p>
                                    <p className="text-sm text-green-700 mt-1">Redirecting to all users...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {apiError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start shadow-sm">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900">Error creating user</p>
                                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <div className="bg-white rounded-xl border border-border shadow-sm p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-2">
                                        Full Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 text-[11px] font-medium transition-all ${errors.name ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                            }`}
                                        placeholder="Legal Name"
                                    />
                                    {errors.name && <p className="mt-2 text-[10px] text-danger font-bold uppercase tracking-widest">{errors.name}</p>}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-2">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 text-[11px] font-medium transition-all ${errors.email ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                            }`}
                                        placeholder="auth@system.com"
                                    />
                                    {errors.email && <p className="mt-2 text-[10px] text-danger font-bold uppercase tracking-widest">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-2">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 text-[11px] font-medium transition-all ${errors.password ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-2 text-[10px] text-danger font-bold uppercase tracking-widest">{errors.password}</p>}
                                    <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">Complexity: Minimum 06 characters</p>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-600 mb-2">
                                        Confirm Password <span className="text-danger">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 text-[11px] font-medium transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                                }`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="mt-2 text-[10px] text-danger font-bold uppercase tracking-widest">{errors.confirmPassword}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end space-x-4 pt-8 border-t border-border mt-8">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/settings')}
                                        className="px-8 py-2.5 text-xs font-semibold text-slate-500 hover:text-[#1A1A1A] transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || success}
                                        className="px-10 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/10 disabled:opacity-30 flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Create User
                                            </>
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
