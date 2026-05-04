'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import analyticsService from '@/app/services/analyticsService';

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6');

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getOverview(parseInt(selectedPeriod));

      setRevenueData(data.revenueTrend);
      setConversionData(data.conversionFunnel);
      setPerformanceData(data.performanceMetrics);
      setDistributionData(data.pipelineDistribution);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Analytics Dashboard" onMenuClick={() => setSidebarOpen(true)} />

        {/* Analytics content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-slate-600">Loading analytics data...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Date Range and Actions */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <select
                    className="px-4 py-2.5 text-xs font-semibold search-input bg-white appearance-none min-w-[180px]"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="6">Last 6 Months</option>
                    <option value="12">Last 12 Months</option>
                    <option value="1">Last 30 Days</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-blue-500/20">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    Filters
                  </button>
                  <button className="flex items-center px-6 py-2.5 border border-slate-100 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export
                  </button>
                </div>
              </div>
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {performanceData.map((metric, index) => (
                  <div key={index} className="glass-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.metric}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-4 tracking-tighter">{metric.value}</p>
                        <div className="mt-6">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-400 font-medium">Target: {metric.target}</span>
                            <span className="font-bold text-primary">{metric.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${metric.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <TrendingUp className="h-5 w-5 text-slate-600 stroke-[2px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Trend */}
                <div className="glass-card p-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-8">Revenue & Leads Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        stroke="#cbd5e1"
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        stroke="#cbd5e1"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        stroke="#cbd5e1"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0066FF"
                        strokeWidth={3}
                        name="Revenue ($)"
                        dot={{ fill: '#0066FF', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="leads"
                        stroke="#1A1A1A"
                        strokeWidth={3}
                        name="Leads"
                        dot={{ fill: '#1A1A1A', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Conversion Funnel */}
                <div className="glass-card p-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-8">Lead Conversion Funnel</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        stroke="#cbd5e1"
                      />
                      <YAxis
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        stroke="#cbd5e1"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pipeline Distribution */}
              <div className="glass-card p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-8">Pipeline Distribution</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
