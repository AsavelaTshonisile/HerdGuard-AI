import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import { 
  Users, 
  MapPin, 
  Layers, 
  ClipboardList, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving administrative platform statistics..." />;
  }

  if (!stats) {
    return <div>Unable to load administrator statistics.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-forest-700/80 text-forest-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-300" />
            <span>HerdGuard AI System Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 mt-1">
            System overview across all South African registered users, farms, and surveillance records
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-forest-500 hover:bg-forest-400 text-forest-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/incidents"
            className="px-4 py-2 bg-forest-800 hover:bg-forest-700 text-white border border-forest-600 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Incidents</span>
          </Link>
        </div>
      </div>

      <DisclaimerBanner />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={stats.total_users}
          subtitle={`${stats.farmers_count} Farmers • ${stats.professionals_count} Vets`}
          icon={Users}
          color="forest"
        />
        <StatCard
          title="Registered Farms"
          value={stats.total_farms}
          subtitle="All 9 provinces"
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Total Livestock"
          value={stats.total_livestock}
          subtitle="Active tagged cattle"
          icon={Layers}
          color="green"
        />
        <StatCard
          title="Health Reports"
          value={stats.total_health_reports}
          subtitle={`${stats.active_incidents} active outbreaks`}
          icon={ClipboardList}
          color="purple"
        />
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition flex items-start space-x-4"
        >
          <div className="p-3 rounded-xl bg-forest-50 text-forest-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-charcoal text-sm">User Management</h4>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Activate, deactivate, and review Farmer and Veterinary professional accounts.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/incidents"
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition flex items-start space-x-4"
        >
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-charcoal text-sm">Disease Incidents</h4>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Verify suspected outbreak reports and adjust official GIS surveillance levels.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/knowledge"
          className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition flex items-start space-x-4"
        >
          <div className="p-3 rounded-xl bg-sky-50 text-sky-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-charcoal text-sm">Knowledge Base</h4>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Manage curated agricultural documents powering the RAG AI Assistant.
            </p>
          </div>
        </Link>
      </div>

      {/* Platform Activity Logs */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-charcoal text-base">Live Activity Audit Trail</h3>
          <span className="text-xs text-charcoal-muted">System actions logged in database</span>
        </div>

        <div className="divide-y divide-gray-50 text-xs">
          {stats.recent_activities.length === 0 ? (
            <p className="py-4 text-center text-charcoal-muted">No activity logged.</p>
          ) : (
            stats.recent_activities.map((act, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-forest-600"></span>
                  <span className="font-bold text-forest-950 uppercase text-[11px] tracking-wider">
                    {act.action}
                  </span>
                  <span className="text-charcoal-muted">{act.details}</span>
                </div>
                <span className="text-gray-400 text-[11px] font-mono">{act.created_at}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
