'use client';

import { useState } from 'react';
import { Shield, User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { updateProfile } from '@/app/services/userService';
import { validateEmail, validatePassword, validatePasswordMatch, validateRequired } from '@/lib/validation';

export default function SecurityCard() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const nameError = validateRequired(formData.name, 'Name');
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password';
            }
            
            const passwordError = validatePassword(formData.newPassword);
            if (passwordError) newErrors.newPassword = passwordError;
            
            const matchError = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
            if (matchError) newErrors.confirmPassword = matchError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const updateData = {
                name: formData.name,
                email: formData.email,
                ...(formData.newPassword && {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            };

            const response = await updateProfile(updateData);

            if (response.success) {
                // Update user in auth context
                updateUser(response.user);
                
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                
                // Reset password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setErrors({});
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <Shield className="h-5 w-5 text-slate-600 stroke-[2px]" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Security Credentials</h3>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Identity & Access Management</p>
                    </div>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white border border-primary rounded-xl transition-all shadow-sm"
                    >
                        Modify Profile
                    </button>
                )}
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">{success}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">{error}</span>
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Full Identity
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 text-[11px] font-medium transition-all ${
                                    errors.name ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                }`}
                                placeholder="Legal Name"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[10px] text-danger font-bold uppercase tracking-widest mt-2">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Auth Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 text-[11px] font-medium transition-all rounded-xl ${
                                    errors.email ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input'
                                }`}
                                placeholder="auth@system.com"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[10px] text-danger font-bold uppercase tracking-widest mt-2">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-8 border-t border-border">
                        <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest mb-6">Security Rotation</h4>
                        
                        {/* Current Password */}
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 text-[11px] font-medium transition-all ${
                                        errors.currentPassword ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                    }`}
                                    placeholder="Current Authentication Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-xs text-red-600 mt-1">{errors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 text-[11px] font-medium transition-all ${
                                        errors.newPassword ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                    }`}
                                    placeholder="New Secure Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-xs text-red-600 mt-1">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 text-[11px] font-medium transition-all ${
                                        errors.confirmPassword ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'search-input focus:bg-white'
                                    }`}
                                    placeholder="Confirm Key Rotation"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                'Commit Changes'
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500">Full Name</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                            <p className="text-xs text-slate-500">Email Address</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">••••••••</p>
                            <p className="text-xs text-slate-500">Password</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}