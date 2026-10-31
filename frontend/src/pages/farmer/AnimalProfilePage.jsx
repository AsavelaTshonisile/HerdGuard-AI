import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { animalsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  Tag, 
  Layers, 
  MapPin, 
  Calendar, 
  Scale, 
  FileText, 
  Syringe, 
  PlusCircle, 
  ArrowLeft, 
  HeartPulse, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function AnimalProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadAnimalProfile();
  }, [id]);

  const loadAnimalProfile = async () => {
    setLoading(true);
    try {
      const res = await animalsAPI.getProfile(id);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load animal profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    setStatusMessage('');
    try {
      await animalsAPI.update(id, { health_status: newStatus });
      setProfile((prev) => ({
        ...prev,
        animal: { ...prev.animal, health_status: newStatus }
      }));
      setStatusMessage(`Status updated to ${newStatus}.`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert("Failed to update animal status: " + (err.response?.data?.detail || err.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading animal profile and history..." />;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <h3 className="text-base font-bold text-charcoal">Animal record not found</h3>
        <Link to="/animals" className="mt-4 inline-block text-xs font-semibold text-forest-700 hover:underline">
          Return to Livestock List
        </Link>
      </div>
    );
  }

  const { animal, health_reports, vaccinations } = profile;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/animals"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Livestock</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0">
            <Tag className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold text-charcoal font-mono">
                {animal.tag_number}
              </h1>
              <StatusBadge status={animal.health_status} size="lg" />
            </div>

            <p className="text-sm text-charcoal-muted mt-1 font-medium">
              {animal.name ? `${animal.name} • ` : ''}{animal.breed} ({animal.sex})
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-charcoal-muted">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                <span>{animal.farm_name}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-forest-600" />
                <span>{animal.approximate_age_months ? `${animal.approximate_age_months} months old` : 'Age unrecorded'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-forest-600" />
                <span>{animal.weight_kg ? `${animal.weight_kg} kg` : 'Weight unrecorded'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/health-reports/new?animal_id=${animal.id}&farm_id=${animal.farm_id}`}
            className="px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Symptoms</span>
          </Link>

          <Link
            to={`/vaccinations?animal_id=${animal.id}`}
            className="px-4 py-2.5 bg-cream hover:bg-cream-surface border border-gray-200 text-charcoal font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
          >
            <Syringe className="w-4 h-4 text-forest-700" />
            <span>Log Vaccine</span>
          </Link>
        </div>
      </div>

      {/* Quick Status Update Bar */}
      <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <span className="font-semibold text-forest-950 flex items-center space-x-1.5">
          <HeartPulse className="w-4 h-4 text-forest-700" />
          <span>Update Clinical Health Status:</span>
        </span>

        <div className="flex flex-wrap gap-2">
          {['healthy', 'monitoring', 'sick', 'quarantined'].map((s) => (
            <button
              key={s}
              onClick={() => handleQuickStatusChange(s)}
              disabled={updatingStatus || animal.health_status === s}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                animal.health_status === s
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-white hover:bg-forest-100 text-charcoal border border-forest-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {statusMessage && (
        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
          {statusMessage}
        </div>
      )}

      {/* Two Column Layout: Health Reports & Vaccinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Health History */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-charcoal text-base flex items-center space-x-2">
              <FileText className="w-5 h-5 text-forest-700" />
              <span>Symptom & Incident History</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-charcoal">
              {health_reports.length}
            </span>
          </div>

          {health_reports.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted">
              No health symptoms or disease incidents reported for this animal.
            </div>
          ) : (
            <div className="space-y-3">
              {health_reports.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-gray-100 bg-cream-surface/40 hover:bg-cream-surface transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-xs text-forest-900">{r.reference_number}</span>
                    <StatusBadge status={r.risk_category} size="xs" />
                  </div>

                  <div className="mt-2 text-xs text-charcoal font-medium">
                    Symptoms: {Array.isArray(r.symptoms) ? r.symptoms.join(', ').replace(/_/g, ' ') : r.symptoms}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-charcoal-muted">
                    <span>Severity: <strong className="capitalize text-charcoal">{r.severity}</strong> ({r.duration_days} days)</span>
                    <StatusBadge status={r.status} size="xs" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 text-right">
                    <Link
                      to={`/health-reports/${r.id}`}
                      className="text-[11px] font-bold text-forest-700 hover:underline"
                    >
                      View Report Assessment →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vaccination History */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-charcoal text-base flex items-center space-x-2">
              <Syringe className="w-5 h-5 text-forest-700" />
              <span>Vaccination Records</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-charcoal">
              {vaccinations.length}
            </span>
          </div>

          {vaccinations.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-muted">
              No vaccination records logged for this animal yet.
            </div>
          ) : (
            <div className="space-y-3">
              {vaccinations.map((v) => (
                <div key={v.id} className="p-3.5 rounded-xl border border-gray-100 bg-cream-surface/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal">{v.vaccine_name}</span>
                    <StatusBadge status={v.status} size="xs" />
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-charcoal-muted">
                    <div>
                      <span>Administered: </span>
                      <strong className="text-charcoal">{v.vaccination_date}</strong>
                    </div>
                    <div>
                      <span>Next Due: </span>
                      <strong className="text-charcoal">{v.next_due_date}</strong>
                    </div>
                  </div>

                  {v.administering_professional && (
                    <div className="mt-1 text-[11px] text-charcoal-muted">
                      Administered by: <span className="font-medium text-charcoal">{v.administering_professional}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
