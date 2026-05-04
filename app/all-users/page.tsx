'use client';

import { useState, useEffect } from 'react';
import { Users as UsersIcon, Loader2, AlertCircle, Trash2, Shield, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getAllUsers, deleteUser, User as UserType } from '../services/userService';

export default function AllUsersPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Fetch all users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllUsers();
            setUsers(response.data.users);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            setDeletingId(id);
            await deleteUser(id);
            // Refresh the user list
            await fetchUsers();
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Shield className="h-3 w-3 mr-1.5" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <User className="h-3 w-3 mr-1.5" />
                Standard User
            </span>
        );
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="User Directory" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                         <div className="mb-10">
                             <div className="flex items-center space-x-4 mb-4">
                                 <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                     <UsersIcon className="h-6 w-6 text-slate-600 stroke-[2px]" />
                                 </div>
                                 <div>
                                     <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">System Users</h2>
                                     <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                                         {loading ? 'Loading...' : `${users.length} registered users`}
                                     </p>
                                 </div>
                             </div>
                         </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                                <span className="ml-3 text-slate-600 font-medium">Loading users...</span>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start shadow-sm">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900">Error loading users</p>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Users Table */}
                        {!loading && !error && (
                            <div className="glass-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                         <thead className="bg-slate-50/50">
                                             <tr>
                                                 <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                     User Identity
                                                 </th>
                                                 <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                     Auth Email
                                                 </th>
                                                 <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                     Clearance Level
                                                 </th>
                                                 <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                     Deployment Date
                                                 </th>
                                                 <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                     Termination
                                                 </th>
                                             </tr>
                                         </thead>
                                         <tbody className="bg-white divide-y divide-slate-50">
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-16 text-center">
                                                        <UsersIcon className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                                        <p className="text-xs text-slate-400 font-bold">No users found</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-9 w-9 flex-shrink-0">
                                                                    <div className="h-9 w-9 rounded-lg bg-slate-50 border border-border flex items-center justify-center group-hover:border-primary transition-all">
                                                                        <span className="text-[11px] font-bold text-[#1A1A1A] group-hover:text-primary">
                                                                            {user.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-xs font-bold text-[#1A1A1A]">
                                                                        {user.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="text-[11px] font-medium text-slate-500">{user.email}</div>
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            {getRoleBadge(user.role)}
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap text-xs font-medium text-slate-500">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-8 py-5 whitespace-nowrap text-right text-[10px] font-medium">
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                disabled={deletingId === user.id}
                                                                className="text-danger hover:scale-110 disabled:opacity-30 transition-all inline-flex items-center"
                                                            >
                                                                {deletingId === user.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
