import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthReportsAPI, farmsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  AlertTriangle,
  Calendar,
  FileCheck
} from 'lucide-react';

export default function HealthReportsPage() {
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    loadReports();
  }, [selectedFarm, selectedRisk, selectedStatus]);

  const loadFarms = async () => {
    try {
      const res = await farmsAPI.getAll();
      setFarms(res.data);
    } catch (err) {
      console.error("Failed to load farms:", err);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedFarm) params.farm_id = selectedFarm;
      if (selectedRisk) params.risk_category = selectedRisk;
      if (selectedStatus) params.status = selectedStatus;

      const res = await healthReportsAPI.getAll(params);
      setReports(res.data);
    } catch (err) {
      console.error("Failed to load health reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Livestock Health Reports</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Review reported symptom incidents, preliminary AI risk categories, and professional veterinarian feedback
          </p>
        </div>

        <Link
          to="/health-reports/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Symptoms</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-wrap gap-3">
        <select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          <option value="">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          <option value="">All Risk Categories</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Moderate Risk">Moderate Risk</option>
          <option value="High Risk">High Risk</option>
          <option value="Urgent Attention Required">Urgent Attention Required</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          <option value="">All Review Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Professional Review Required">Professional Review Required</option>
          <option value="Action Recommended">Action Recommended</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Reports Table */}
      {loading ? (
        <LoadingSpinner message="Loading health reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No health reports found"
          description="Report animal symptoms whenever an animal displays signs of illness or reduced production."
          actionLabel="Submit Health Report"
          onAction={() => window.location.href = '/health-reports/new'}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Farm & Animal</th>
                  <th className="py-3 px-4">Symptoms Reported</th>
                  <th className="py-3 px-4">Preliminary AI Risk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                      {r.reference_number}
                      <div className="text-[10px] font-normal text-charcoal-muted">
                        {r.first_noticed_date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal">{r.farm_name}</div>
                      <div className="text-[11px] text-charcoal-muted font-mono">
                        {r.animal_tag ? `Tag: ${r.animal_tag}` : 'Herd Observation'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="line-clamp-2 text-charcoal font-medium">
                        {r.symptoms.map(s => s.replace(/_/g, ' ')).join(', ')}
                      </div>
                      <div className="text-[11px] text-charcoal-muted mt-0.5">
                        Severity: <strong className="capitalize">{r.severity}</strong> • {r.duration_days} day(s)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.risk_category} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status} />
                      {r.reviews && r.reviews.length > 0 && (
                        <div className="text-[10px] text-teal-800 font-semibold mt-1 flex items-center space-x-1">
                          <FileCheck className="w-3 h-3" />
                          <span>Vet Reviewed</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/health-reports/${r.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-800 rounded-lg text-xs font-semibold transition"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
