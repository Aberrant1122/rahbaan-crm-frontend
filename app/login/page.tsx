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
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#0066FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="max-w-md w-full space-y-12 bg-white p-12 rounded-2xl border border-border shadow-2xl z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 border border-border rounded-xl mb-8">
                        <div className="w-8 h-8 bg-[#0066FF] rounded-lg"></div>
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                        Welcome Back
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        Please enter your credentials to continue.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-200">
                            <p className="text-sm text-red-800">{authError}</p>
                        </div>
                    )}

                    <div className="space-y-8">
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 text-[11px] font-medium transition-all ${errors.email ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                    }`}
                                placeholder="auth@system.com"
                            />
                            {errors.email && <p className="mt-2 text-[10px] text-danger font-bold uppercase tracking-widest">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 text-[11px] font-medium transition-all ${errors.password ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0066FF] transition-colors"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-xs text-danger font-medium">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-border rounded cursor-pointer transition-all"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <div className="text-xs">
                            <a href="#" className="font-semibold text-primary hover:text-blue-700 transition-all">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#0066FF] hover:bg-[#0052cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-blue-500/20"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white/20 border-b-white rounded-full"></div>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
