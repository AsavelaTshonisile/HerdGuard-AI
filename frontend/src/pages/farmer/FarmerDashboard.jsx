import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import {
  Layers,
  HeartPulse,
  AlertTriangle,
  FileText,
  Clock,
  Syringe,
  PlusCircle,
  MapPin,
  Bot,
  Map,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getFarmerStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Unable to load real-time dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving real-time herd intelligence from database..." />;
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-charcoal">{error || "Failed to load dashboard"}</h3>
        <button
          onClick={loadDashboardStats}
          className="mt-4 px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const hasLivestock = stats.total_livestock > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-3xl bg-forest-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-forest-700/80 text-forest-200 text-xs font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400"></span>
            <span>Active Herd Health Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 mt-1">
            {user?.organization_or_practice || 'Livestock Farm'} • {user?.province || 'South Africa'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2.5 relative z-10">
          <Link
            to="/health-reports/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-forest-950 font-bold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Symptoms</span>
          </Link>

          <Link
            to="/animals"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white border border-forest-600 font-medium text-xs transition"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Herd</span>
          </Link>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Cattle"
          value={stats.total_livestock}
          subtitle="Registered in database"
          icon={Layers}
          color="forest"
        />
        <StatCard
          title="Healthy"
          value={stats.healthy_animals}
          subtitle={`${stats.total_livestock > 0 ? Math.round((stats.healthy_animals / stats.total_livestock) * 100) : 0}% of herd`}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Attention Needed"
          value={stats.animals_requiring_attention}
          subtitle={`${stats.sick_animals} sick • ${stats.quarantined_animals} quarantined`}
          icon={AlertTriangle}
          color={stats.animals_requiring_attention > 0 ? "rose" : "green"}
        />
        <StatCard
          title="Health Reports"
          value={stats.submitted_reports}
          subtitle={`${stats.pending_professional_reviews} awaiting review`}
          icon={FileText}
          color="blue"
        />
      </div>

      {/* Secondary Alerts & Vaccination Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vaccination Status Box */}
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stats.overdue_vaccinations > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <Syringe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal">Herd Vaccination Compliance</h4>
              <p className="text-xs text-charcoal-muted mt-0.5">
                {stats.upcoming_vaccinations} upcoming in 30 days •{' '}
                <span className={stats.overdue_vaccinations > 0 ? 'text-red-600 font-bold' : ''}>
                  {stats.overdue_vaccinations} overdue
                </span>
              </p>
            </div>
          </div>
          <Link
            to="/vaccinations"
            className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center space-x-1"
          >
            <span>View Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Assistant Quick Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-forest-800 to-forest-900 text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-forest-700 text-forest-200 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">HerdGuard AI Assistant</h4>
              <p className="text-xs text-forest-200 mt-0.5">
                Ask questions on symptoms, biosecurity & DALRRD guidelines
              </p>
            </div>
          </div>
          <Link
            to="/assistant"
            className="px-3 py-1.5 bg-forest-600 hover:bg-forest-500 rounded-lg text-xs font-bold transition"
          >
            Ask AI
          </Link>
        </div>
      </div>

      {/* Visual Charts Grid */}
      {hasLivestock ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Status Distribution Chart */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal">Herd Health Breakdown</h3>
                <p className="text-xs text-charcoal-muted">Clinical condition of registered cattle</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.health_status_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.health_status_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#1B4332'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} cattle`, 'Count']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breed Distribution Bar Chart */}
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal">Breed Distribution</h3>
                <p className="text-xs text-charcoal-muted">Cattle breeds registered on your farms</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.breed_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${value} cattle`, 'Breed Count']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Reports Timeline Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal">Health Incident Activity</h3>
                <p className="text-xs text-charcoal-muted">Symptom reports logged over the past 7 days</p>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.reports_timeline} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${value} report(s)`, 'Submissions']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1B4332"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#52B788' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State if farmer has no livestock yet */
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <Layers className="w-12 h-12 text-forest-700 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-charcoal">No livestock registered yet</h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
            Get started by adding your cattle ear tag numbers, breed, and health status to begin real-time monitoring.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              to="/animals"
              className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold rounded-xl transition"
            >
              Add First Animal
            </Link>
            <Link
              to="/farms"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold rounded-xl transition"
            >
              Register Farm Details
            </Link>
          </div>
        </div>
      )}

      {/* Recent Farm Activity Feed */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <h3 className="text-base font-bold text-charcoal mb-4">Recent Farm Activity</h3>
        {stats.recent_activity.length === 0 ? (
          <p className="text-xs text-charcoal-muted">No recent activity logged for this account.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recent_activity.map((act, index) => (
              <div key={index} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-forest-600"></span>
                  <span className="font-semibold text-charcoal">{act.action.replace('_', ' ')}</span>
                  <span className="text-charcoal-muted">{act.details}</span>
                </div>
                <span className="text-gray-400 text-[11px]">{act.created_at}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
