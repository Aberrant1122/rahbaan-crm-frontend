'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const router = useRouter();
    const { register, loading, error: authError } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);

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
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Redirect to home page on success
            router.push('/');
        } catch (err) {
            // Error is handled by AuthContext
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0066FF] opacity-[0.05] blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0066FF] opacity-[0.03] blur-[120px]"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(0, 102, 255, 0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl mb-6 shadow-inner transition-transform duration-500 hover:scale-105 group">
                        <div className="w-10 h-10 bg-[#0066FF] rounded-xl shadow-[0_8px_20px_rgba(0,102,255,0.3)] transition-all duration-500"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                        Join the premium CRM ecosystem
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-xs text-red-600 font-semibold text-center uppercase tracking-wider">{authError}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="group">
                            <label htmlFor="name" className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-5 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
                                    }`}
                                placeholder="Legal Name"
                            />
                            {errors.name && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.name}</p>}
                        </div>

                        <div className="group">
                            <label htmlFor="email" className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-5 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.email ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
                                    }`}
                                placeholder="auth@system.com"
                            />
                            {errors.email && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div className="group">
                            <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.password ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{showPassword ? 'Hide' : 'Show'}</span>
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.password}</p>}
                        </div>

                        <div className="group">
                            <label htmlFor="confirmPassword" className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-5 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-xs font-bold rounded-xl text-white bg-[#0066FF] hover:bg-[#0052cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(0,102,255,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(0,102,255,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white/20 border-b-white rounded-full"></div>
                                    REGISTERING...
                                </span>
                            ) : (
                                <span className="uppercase tracking-[0.2em]">Create Account</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Already have an account? <Link href="/login" className="text-[#0066FF] hover:text-blue-700 transition-all border-b border-[#0066FF]/30 hover:border-[#0066FF]">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
