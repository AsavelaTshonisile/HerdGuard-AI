import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { animalsAPI, farmsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  Calendar, 
  Scale, 
  ArrowRight, 
  X,
  HeartPulse
} from 'lucide-react';

const COMMON_BREEDS = [
  'Bonsmara',
  'Nguni',
  'Brahman',
  'Brahman Cross',
  'Afrikaner',
  'Drakensberger',
  'Holstein-Friesian',
  'Angus',
  'Simmentaler',
  'Other / Crossbred'
];

export default function LivestockPage() {
  const [searchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farm_id') || '';

  const [animals, setAnimals] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(initialFarmId);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Register Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tag_number: '',
    name: '',
    farm_id: '',
    species: 'cattle',
    breed: 'Bonsmara',
    sex: 'Heifer',
    approximate_age_months: '',
    weight_kg: '',
    health_status: 'healthy',
    additional_notes: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [search, selectedFarm, selectedStatus]);

  const loadFarms = async () => {
    try {
      const res = await farmsAPI.getAll();
      setFarms(res.data);
      if (res.data.length > 0 && !formData.farm_id) {
        setFormData((prev) => ({ ...prev, farm_id: res.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load farms:", err);
    }
  };

  const loadAnimals = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedFarm) params.farm_id = selectedFarm;
      if (selectedStatus) params.health_status = selectedStatus;

      const res = await animalsAPI.getAll(params);
      setAnimals(res.data);
    } catch (err) {
      console.error("Failed to load animals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = () => {
    setError('');
    setFormData({
      tag_number: '',
      name: '',
      farm_id: farms.length > 0 ? farms[0].id : '',
      species: 'cattle',
      breed: 'Bonsmara',
      sex: 'Heifer',
      approximate_age_months: '',
      weight_kg: '',
      health_status: 'healthy',
      additional_notes: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.farm_id) {
      setError('Please register or select a farm first.');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      farm_id: parseInt(formData.farm_id),
      approximate_age_months: formData.approximate_age_months ? parseInt(formData.approximate_age_months) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
    };

    try {
      await animalsAPI.create(payload);
      setShowModal(false);
      loadAnimals();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to register livestock.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Livestock Records</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Track individual animal profiles, ear tag numbers, breed, and clinical history
          </p>
        </div>

        <button
          onClick={handleOpenRegister}
          disabled={farms.length === 0}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Animal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag number, name, or breed..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Farm selector */}
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

          {/* Health Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
          >
            <option value="">All Health Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="monitoring">Monitoring</option>
            <option value="sick">Sick</option>
            <option value="quarantined">Quarantined</option>
          </select>
        </div>
      </div>

      {/* Livestock Table */}
      {loading ? (
        <LoadingSpinner message="Searching registered livestock..." />
      ) : animals.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No livestock found"
          description={
            farms.length === 0
              ? "You must register a farm before adding cattle records."
              : "No animals match your search filters or none have been added yet."
          }
          actionLabel={farms.length > 0 ? "Register First Animal" : "Register a Farm First"}
          onAction={farms.length > 0 ? handleOpenRegister : null}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Tag Number / Name</th>
                  <th className="py-3 px-4">Farm</th>
                  <th className="py-3 px-4">Breed & Sex</th>
                  <th className="py-3 px-4">Age / Weight</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {animals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-forest-950 flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                        <span>{animal.tag_number}</span>
                      </div>
                      {animal.name && (
                        <div className="text-[11px] text-charcoal-muted pl-5">{animal.name}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {animal.farm_name || 'Assigned Farm'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal">{animal.breed}</div>
                      <div className="text-[11px] text-charcoal-muted capitalize">{animal.sex}</div>
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      <div>{animal.approximate_age_months ? `${animal.approximate_age_months} months` : '—'}</div>
                      <div>{animal.weight_kg ? `${animal.weight_kg} kg` : '—'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={animal.health_status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/animals/${animal.id}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-800 rounded-lg text-xs font-semibold transition"
                      >
                        <span>Profile & History</span>
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

      {/* Animal Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">Register Cattle</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Add individual livestock ear tag identification for traceable health monitoring.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Ear Tag Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag_number}
                    onChange={(e) => setFormData({ ...formData, tag_number: e.target.value })}
                    placeholder="e.g. ZA-FS-2024-042"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Animal Name / Description
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bessie or Star Cow"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Farm Parcel *
                </label>
                <select
                  required
                  value={formData.farm_id}
                  onChange={(e) => setFormData({ ...formData, farm_id: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.province})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Cattle Breed *
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    {COMMON_BREEDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Sex / Category *
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="Heifer">Heifer</option>
                    <option value="Cow">Cow</option>
                    <option value="Bull">Bull</option>
                    <option value="Steer">Steer</option>
                    <option value="Calf">Calf</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Approximate Age (Months)
                  </label>
                  <input
                    type="number"
                    value={formData.approximate_age_months}
                    onChange={(e) => setFormData({ ...formData, approximate_age_months: e.target.value })}
                    placeholder="e.g. 24"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    placeholder="e.g. 450"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Initial Health Status
                </label>
                <select
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                >
                  <option value="healthy">Healthy</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="sick">Sick</option>
                  <option value="quarantined">Quarantined</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  placeholder="Ear notches, markings, maternal lineage, etc."
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-charcoal font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Cattle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
