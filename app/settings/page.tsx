'use client';

import { useState } from 'react';
import { Users, UserPlus, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SecurityCard from '@/components/SecurityCard';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Control Panel" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Security Card */}
                        <div className="mb-10">
                            <SecurityCard />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* All Users */}
                             <Link href="/all-users">
                                 <div className="glass-card p-8 group cursor-pointer">
                                     <div className="flex items-center space-x-4 mb-6">
                                         <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-primary group-hover:border-primary transition-all">
                                             <Users className="h-5 w-5 text-slate-600 group-hover:text-white transition-all" />
                                         </div>
                                         <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Directory Access</h3>
                                     </div>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                         Inspect and manage systemic user nodes.
                                     </p>
                                 </div>
                             </Link>

                             {/* Create User */}
                             <Link href="/create-user">
                                 <div className="glass-card p-8 group cursor-pointer">
                                     <div className="flex items-center space-x-4 mb-6">
                                         <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-primary group-hover:border-primary transition-all">
                                             <UserPlus className="h-5 w-5 text-slate-600 group-hover:text-white transition-all" />
                                         </div>
                                         <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Node Deployment</h3>
                                     </div>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                         Provision new administrative or standard accounts.
                                     </p>
                                 </div>
                             </Link>

                             {/* Logout Section */}
                             <div className="bg-white rounded-xl border border-danger/20 p-8 md:col-span-2 mt-4">
                                 <div className="flex items-center justify-between">
                                     <div>
                                         <div className="flex items-center space-x-4 mb-3">
                                             <div className="p-3 bg-danger/5 rounded-lg">
                                                 <LogOut className="h-5 w-5 text-danger" />
                                             </div>
                                             <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">Termination</h3>
                                         </div>
                                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                                             Sever current session and clear local cache.
                                         </p>
                                     </div>
                                     <button
                                         onClick={handleLogout}
                                         disabled={isLoggingOut}
                                         className="px-8 py-3 bg-danger/10 hover:bg-danger text-danger hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-30 flex items-center space-x-3"
                                     >
                                         {isLoggingOut ? (
                                             <>
                                                 <Loader2 className="h-3 w-3 animate-spin" />
                                                 <span>Terminating...</span>
                                             </>
                                         ) : (
                                             <>
                                                 <LogOut className="h-3 w-3" />
                                                 <span>End Session</span>
                                             </>
                                         )}
                                     </button>
                                 </div>
                             </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
