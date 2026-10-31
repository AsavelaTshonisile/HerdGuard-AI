import React, { useState, useEffect } from 'react';
import { diseaseIncidentsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { AlertTriangle, Edit2, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIncident, setEditingIncident] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('Suspected');
  const [incidentStatus, setIncidentStatus] = useState('Active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const res = await diseaseIncidentsAPI.getAll();
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to load incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (inc) => {
    setEditingIncident(inc);
    setVerificationStatus(inc.verification_status);
    setIncidentStatus(inc.status);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await diseaseIncidentsAPI.update(editingIncident.id, {
        verification_status: verificationStatus,
        status: incidentStatus
      });
      setEditingIncident(null);
      loadIncidents();
    } catch (err) {
      alert("Failed to update incident: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Disease Incidents Management</h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Review, verify, and update official status for reported livestock health threats
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading disease incident logs..." />
      ) : incidents.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disease incidents" description="No incidents recorded in the database." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Disease Concern</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Verification Level</th>
                  <th className="py-3 px-4">Counts</th>
                  <th className="py-3 px-4">Reported Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3.5 px-4 font-bold text-forest-950">
                      {inc.disease_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal">{inc.municipality}</div>
                      <div className="text-[11px] text-charcoal-muted">{inc.province}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inc.verification_status} />
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {inc.affected_count} affected {inc.death_count > 0 ? `(${inc.death_count} dead)` : ''}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {inc.reported_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inc.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(inc)}
                        className="px-3 py-1 bg-forest-50 hover:bg-forest-100 text-forest-800 rounded-lg text-xs font-semibold transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingIncident && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingIncident(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-charcoal">
              Update Incident Verification: {editingIncident.disease_name}
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              {editingIncident.municipality}, {editingIncident.province}
            </p>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Verification Level *
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                >
                  <option value="Suspected">Suspected</option>
                  <option value="Professionally Reviewed">Professionally Reviewed</option>
                  <option value="Official Outbreak">Official Outbreak</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Outbreak Status *
                </label>
                <select
                  value={incidentStatus}
                  onChange={(e) => setIncidentStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Contained">Contained</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingIncident(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-charcoal font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Update Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
