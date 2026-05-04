'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getLeads, Lead } from '../services/leadsService';

export default function LeadsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch leads from API
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getLeads();
                setLeads(response.data.leads);
            } catch (err: any) {
                console.error('Failed to fetch leads:', err);
                setError(err.response?.data?.message || 'Failed to load leads');
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // Filter leads
    const filteredLeads = leads.filter((lead) => {
        if (filterStatus !== 'all' && lead.stage !== filterStatus) return false;
        if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !lead.phone.includes(searchQuery)) return false;
        return true;
    });

    return (
        <div className="flex h-screen bg-background">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title="Leads Directory" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
                    {/* Filters and Actions */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative text-black">
                                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 text-xs font-semibold search-input w-72"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest search-input bg-white appearance-none min-w-[160px]"
                            >
                                <option value="all">Stage: All</option>
                                <option value="New">New</option>
                                <option value="Incoming">Incoming</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Proposal">Second Wing</option>
                                <option value="Second Wing">Second Wing</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                        <Link
                            href="/add-lead"
                            className="flex items-center px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lead
                        </Link>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            <span className="ml-3 text-slate-600">Loading leads...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-red-900">Error loading leads</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Leads Grid */}
                    {!loading && !error && (
                        <>
                            {filteredLeads.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-600">No leads found</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {searchQuery || filterStatus !== 'all'
                                            ? 'Try adjusting your filters'
                                            : 'Start by adding your first lead'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredLeads.map((lead) => (
                                        <Link key={lead.id} href={`/leads/${lead.id}`}>
                                            <div className="glass-card p-6 group cursor-pointer">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex-1">
                                                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{lead.name}</h3>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{lead.phone}</p>
                                                        {lead.email && (
                                                            <p className="text-[10px] text-slate-400 mt-1 truncate">{lead.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
                                                    <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider ${lead.stage === 'Won' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                            lead.stage === 'Lost' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                lead.stage === 'Incoming' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                    lead.stage === 'Contacted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                        'bg-slate-50 text-slate-500 border border-slate-100'
                                                        }`}>
                                                        {lead.stage}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{lead.source}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
