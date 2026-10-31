import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import { 
  Stethoscope, 
  AlertTriangle, 
  FileCheck2, 
  Map, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getProfessionalStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load professional dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading veterinary surveillance dashboard..." />;
  }

  if (!stats) {
    return <div>Unable to load statistics.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-forest-700/80 text-forest-200 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-forest-300" />
            <span>Authorized Veterinary & Extension Officer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 mt-1">
            {user?.organization_or_practice || 'Provincial Veterinary Services'} • {user?.province || 'South Africa'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/disease-map"
            className="px-4 py-2.5 bg-forest-500 hover:bg-forest-400 text-forest-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-sm"
          >
            <Map className="w-4 h-4" />
            <span>Regional GIS Map</span>
          </Link>
          <Link
            to="/health-reports"
            className="px-4 py-2.5 bg-forest-800 hover:bg-forest-700 text-white border border-forest-600 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Review Queue</span>
          </Link>
        </div>
      </div>

      <DisclaimerBanner />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Pending Reviews"
          value={stats.pending_reviews_count}
          subtitle="Reports needing review"
          icon={Clock}
          color={stats.pending_reviews_count > 0 ? "amber" : "forest"}
        />
        <StatCard
          title="Urgent Alerts"
          value={stats.urgent_reports_count}
          subtitle="High threat syndromic risks"
          icon={ShieldAlert}
          color={stats.urgent_reports_count > 0 ? "rose" : "green"}
        />
        <StatCard
          title="Reviews Conducted"
          value={stats.total_reviewed_count}
          subtitle="Case investigations logged"
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Active Disease Incidents"
          value={stats.active_incidents_count}
          subtitle="Regional outbreak surveillance"
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Recent Incoming Reports Requiring Review */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-charcoal text-base">Incoming Livestock Health Reports</h3>
            <p className="text-xs text-charcoal-muted">Recent symptom cases reported by farmers</p>
          </div>
          <Link
            to="/health-reports"
            className="text-xs font-bold text-forest-700 hover:underline flex items-center space-x-1"
          >
            <span>All Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recent_reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-charcoal-muted bg-cream-surface/50 rounded-xl">
            No pending reports at this time. All submissions have been reviewed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Farm & Location</th>
                  <th className="py-3 px-4">Animal</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recent_reports.map((r) => (
                  <tr key={r.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-forest-900">
                      {r.reference_number}
                      <div className="text-[10px] text-charcoal-muted font-normal">{r.created_at}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-charcoal">{r.farm_name}</div>
                      <div className="text-[11px] text-charcoal-muted">{r.province}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {r.animal_tag}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.risk_category} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/health-reports/${r.id}`}
                        className="px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center space-x-1"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Analytics Row: Reports by Risk & Incidents by Province */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Reports by Risk Pie */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="font-bold text-charcoal text-base mb-1">Reports by Risk Classification</h3>
          <p className="text-xs text-charcoal-muted mb-4">Distribution of AI risk categories</p>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.reports_by_risk}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.reports_by_risk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#1B4332'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Province List */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="font-bold text-charcoal text-base mb-1">Disease Surveillance by Province</h3>
          <p className="text-xs text-charcoal-muted mb-4">Recorded active and contained incidents</p>

          {stats.incidents_by_province.length === 0 ? (
            <p className="text-xs text-charcoal-muted">No regional incident clusters recorded.</p>
          ) : (
            <div className="space-y-3">
              {stats.incidents_by_province.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-cream-surface/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-forest-700" />
                    <span className="font-semibold text-charcoal">{p.name}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-forest-100 text-forest-900 font-bold">
                    {p.value} incident{p.value > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
