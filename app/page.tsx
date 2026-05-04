'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PrivateRoute from './components/auth/PrivateRoute';
import KPICard from '@/components/KPICard';
import TaskCard from '@/components/TaskCard';
import { getLeads, Lead } from './services/leadsService';
import dashboardService, { DashboardKPI, PipelineStageCount, DashboardTask } from './services/dashboardService';
import analyticsService, { PerformanceMetric } from './services/analyticsService';
import { Task } from '@/types';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [kpis, setKpis] = useState<DashboardKPI[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStageCount[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<DashboardTask[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [pipelineLoading, setPipelineLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await getLeads({ limit: 5 });
        setLeads(response.data.leads);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Fetch KPIs from API
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setKpisLoading(true);
        const data = await dashboardService.getKPIs();
        setKpis(data);
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
      } finally {
        setKpisLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  // Fetch pipeline overview from API
  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        setPipelineLoading(true);
        const data = await dashboardService.getPipelineOverview();
        setPipelineStages(data);
      } catch (err) {
        console.error('Failed to fetch pipeline overview:', err);
      } finally {
        setPipelineLoading(false);
      }
    };

    fetchPipeline();
  }, []);

  // Fetch upcoming tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        const data = await dashboardService.getUpcomingTasks(3);
        setUpcomingTasks(data);
      } catch (err) {
        console.error('Failed to fetch upcoming tasks:', err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Fetch performance metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setMetricsLoading(true);
        const data = await analyticsService.getPerformanceMetrics();
        setPerformanceMetrics(data);
      } catch (err) {
        console.error('Failed to fetch performance metrics:', err);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Get recent leads (top 5)
  const recentLeads = leads.slice(0, 5);

  // Convert API tasks to TaskCard format
  const convertTasksForCard = (apiTasks: DashboardTask[]): Task[] => {
    return apiTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      priority: task.priority,
      status: task.status,
      leadId: task.leadId || 0,
      leadName: task.leadName
    }));
  };



  return (
    <PrivateRoute>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {kpisLoading ? (
                <div className="col-span-4 text-center py-12 text-slate-500 text-xs font-semibold">
                  Loading dashboard metrics...
                </div>
              ) : (
                kpis.map((kpi, index) => (
                  <KPICard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    change={kpi.change}
                    trend={kpi.trend}
                    icon={
                      kpi.title === 'Total Leads'
                        ? Users
                        : kpi.title === 'Revenue'
                          ? DollarSign
                          : kpi.title === 'Conversion Rate'
                            ? TrendingUp
                            : BarChart3
                    }
                  />
                ))
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Link
                href="/pipeline"
                className="glass-card p-5 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Pipeline</p>
                    <p className="text-xs text-[#1A1A1A] mt-1.5 font-bold">Manage Deals</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
              <Link
                href="/tasks"
                className="glass-card p-5 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Tasks</p>
                    <p className="text-xs text-[#1A1A1A] mt-1.5 font-bold">{upcomingTasks.length} Pending Tasks</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
              <Link
                href="/analytics"
                className="glass-card p-5 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Analytics</p>
                    <p className="text-xs text-[#1A1A1A] mt-1.5 font-bold">Performance Data</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </Link>
              <Link
                href="/add-lead"
                className="bg-primary rounded-2xl p-5 hover:bg-primary-hover transition-all duration-300 group shadow-lg shadow-blue-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs font-bold text-white/70">Leads</p>
                    <p className="text-xs text-white mt-1.5 font-bold">Create New Lead</p>
                  </div>
                  <UserPlus className="h-4 w-4 text-white" />
                </div>
              </Link>
            </div>

            {/* Pipeline Overview & Recent Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Mini Pipeline Overview */}
              <div className="lg:col-span-2 glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Pipeline Distribution</h3>
                  <Link
                    href="/pipeline"
                    className="text-slate-500 hover:text-primary text-xs font-bold flex items-center transition-all"
                  >
                    Full Board
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
                {pipelineLoading ? (
                  <div className="text-center py-12 text-slate-500 text-xs font-semibold">
                    Loading distribution...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {pipelineStages.map((stage, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-lg p-5 border border-border text-center hover:border-primary/30 transition-all"
                      >
                        <p className="text-xl font-bold text-[#1A1A1A] mb-1">
                          {stage.count}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">
                          {stage.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Leads */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Recent Leads</h3>
                  <Link
                    href="/leads"
                    className="text-slate-500 hover:text-primary text-xs font-bold transition-all"
                  >
                    All Leads
                  </Link>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-4">Syncing...</p>
                  ) : recentLeads.length === 0 ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-4">No leads found</p>
                  ) : (
                    recentLeads.map((lead) => (
                      <Link key={lead.id} href={`/leads/${lead.id}`}>
                        <div className="p-4 rounded-xl border border-border bg-slate-50 hover:border-primary/30 hover:bg-white transition-all cursor-pointer group">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#1A1A1A] truncate">{lead.name}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{lead.phone || lead.email}</p>
                            </div>
                            <span className={`ml-4 px-2.5 py-1 text-[10px] font-bold rounded-md ${lead.stage === 'Won' ? 'bg-success/10 text-success' :
                                lead.stage === 'Lost' ? 'bg-danger/10 text-danger' :
                                  'bg-slate-200 text-slate-500'
                              }`}>
                              {lead.stage}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Performance Metrics & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Metrics */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Performance</h3>
                  <Link
                    href="/analytics"
                    className="text-slate-500 hover:text-primary text-xs font-bold transition-all"
                  >
                    View Analytics
                  </Link>
                </div>
                <div className="space-y-8">
                  {metricsLoading ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-8">Loading...</p>
                  ) : performanceMetrics.length === 0 ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-8">No data available</p>
                  ) : (
                    performanceMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-[#1A1A1A]">{metric.metric}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-[#1A1A1A]">{metric.value}</span>
                              <span className="text-[10px] text-slate-500 font-medium">/ {metric.target}</span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-[4px]">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${metric.progress >= 90 ? 'bg-success' :
                                  metric.progress >= 70 ? 'bg-[#0066FF]' :
                                    'bg-slate-300'
                                }`}
                              style={{ width: `${Math.min(metric.progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Upcoming Tasks</h3>
                  <Link
                    href="/tasks"
                    className="text-slate-500 hover:text-primary text-xs font-bold transition-all"
                  >
                    All Tasks
                  </Link>
                </div>
                <div className="space-y-4">
                  {tasksLoading ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-8">Loading tasks...</p>
                  ) : upcomingTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-xs text-slate-500 font-bold">No upcoming tasks</p>
                    </div>
                  ) : (
                    convertTasksForCard(upcomingTasks).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
