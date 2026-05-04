'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, loading, error: authError, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

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

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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
            await login({
                email: formData.email,
                password: formData.password,
            });

            // Redirect to dashboard on success
            router.push('/');
        } catch (err) {
            // Error is handled by AuthContext
            console.error('Login failed:', err);
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

            <div className="max-w-md w-full space-y-10 bg-white p-10 rounded-3xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl mb-8 shadow-inner transition-transform duration-500 hover:scale-105 group">
                        <div className="w-10 h-10 bg-[#0066FF] rounded-xl shadow-[0_8px_20px_rgba(0,102,255,0.3)] transition-all duration-500"></div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-slate-500 mt-3 font-medium">
                        Access your CRM workspace
                    </p>
                </div>

                <form className="mt-10 space-y-7" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-xs text-red-600 font-semibold text-center uppercase tracking-wider">{authError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="group">
                            <label htmlFor="email" className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-5 py-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.email ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
                                    }`}
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div className="group">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-[#0066FF]">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-bold text-[#0066FF] hover:text-blue-700 transition-colors uppercase tracking-widest">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 outline-none ${errors.password ? 'border-red-300 focus:border-red-500' : 'focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/5'
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
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${rememberMe ? 'bg-[#0066FF]' : 'bg-slate-200'}`}></div>
                                <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${rememberMe ? 'translate-x-5' : ''}`}></div>
                            </div>
                            <span className="ml-3 text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">Remember me</span>
                        </label>
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
                                    VERIFYING...
                                </span>
                            ) : (
                                <span className="uppercase tracking-[0.2em]">Sign In to System</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        New to Rahban CRM? <Link href="/register" className="text-[#0066FF] hover:text-blue-700 transition-all border-b border-[#0066FF]/30 hover:border-[#0066FF]">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
