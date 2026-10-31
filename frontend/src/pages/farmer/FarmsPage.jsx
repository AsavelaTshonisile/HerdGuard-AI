import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { farmsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { MapPin, Plus, Edit2, Trash2, Layers, Compass, ArrowRight, X } from 'lucide-react';

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    province: 'Free State',
    municipality: '',
    address: '',
    latitude: '',
    longitude: '',
    farm_type: 'smallholder',
    total_area_hectares: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    try {
      const res = await farmsAPI.getAll();
      setFarms(res.data);
    } catch (err) {
      console.error("Failed to load farms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      province: 'Free State',
      municipality: '',
      address: '',
      latitude: '',
      longitude: '',
      farm_type: 'smallholder',
      total_area_hectares: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      province: farm.province,
      municipality: farm.municipality,
      address: farm.address || '',
      latitude: farm.latitude !== null ? farm.latitude : '',
      longitude: farm.longitude !== null ? farm.longitude : '',
      farm_type: farm.farm_type,
      total_area_hectares: farm.total_area_hectares !== null ? farm.total_area_hectares : ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      total_area_hectares: formData.total_area_hectares ? parseFloat(formData.total_area_hectares) : null,
    };

    try {
      if (editingFarm) {
        await farmsAPI.update(editingFarm.id, payload);
      } else {
        await farmsAPI.create(payload);
      }
      setShowModal(false);
      loadFarms();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed. Please check form values.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (farmId, farmName) => {
    if (window.confirm(`Are you sure you want to delete farm "${farmName}"? This will deactivate linked records.`)) {
      try {
        await farmsAPI.delete(farmId);
        loadFarms();
      } catch (err) {
        alert("Failed to delete farm: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Registered Farms</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Manage your agricultural land parcels and location coordinates across South Africa
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register Farm Parcel</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading farm records..." />
      ) : farms.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No farms registered yet"
          description="Register your first farm parcel to start cataloging livestock and monitoring local disease risks."
          actionLabel="Register Farm"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-xl bg-forest-50 text-forest-700">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-charcoal text-base">{farm.name}</h3>
                      <span className="text-[11px] font-semibold text-forest-700 uppercase tracking-wide">
                        {farm.farm_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenEdit(farm)}
                      className="p-1.5 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-lg transition"
                      title="Edit farm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(farm.id, farm.name)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete farm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-charcoal-muted">
                  <div className="flex items-center justify-between">
                    <span>Province & District:</span>
                    <span className="font-semibold text-charcoal">{farm.municipality}, {farm.province}</span>
                  </div>

                  {farm.address && (
                    <div className="flex items-center justify-between">
                      <span>Address:</span>
                      <span className="font-medium text-charcoal truncate max-w-[180px]">{farm.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>GPS Coordinates:</span>
                    <span className="font-mono text-[11px] text-charcoal">
                      {farm.latitude !== null && farm.longitude !== null
                        ? `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}`
                        : 'Not specified'}
                    </span>
                  </div>

                  {farm.total_area_hectares && (
                    <div className="flex items-center justify-between">
                      <span>Land Area:</span>
                      <span className="font-semibold text-charcoal">{farm.total_area_hectares} ha</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-forest-800 font-semibold">
                  <Layers className="w-4 h-4 text-forest-600" />
                  <span>{farm.animals_count || 0} Registered Cattle</span>
                </div>

                <Link
                  to={`/animals?farm_id=${farm.id}`}
                  className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center space-x-1"
                >
                  <span>View Herd</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Farm Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">
              {editingFarm ? 'Edit Farm Details' : 'Register New Farm Parcel'}
            </h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Accurate coordinates enhance disease risk alerts in your local municipality.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vredehoek Cattle Farm"
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    {SA_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    District / Municipality *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    placeholder="e.g. Mangaung Metro"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Physical Address / Region
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot number, district, or road landmark"
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Latitude (Numeric)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g. -29.0852"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Longitude (Numeric)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g. 26.1596"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Farm Type
                  </label>
                  <select
                    value={formData.farm_type}
                    onChange={(e) => setFormData({ ...formData, farm_type: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="smallholder">Smallholder</option>
                    <option value="communal">Communal Pasture</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Total Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.total_area_hectares}
                    onChange={(e) => setFormData({ ...formData, total_area_hectares: e.target.value })}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
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
                  {submitting ? 'Saving...' : editingFarm ? 'Update Farm' : 'Create Farm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
