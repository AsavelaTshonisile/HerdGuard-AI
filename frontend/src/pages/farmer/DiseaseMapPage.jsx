import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { diseaseIncidentsAPI, farmsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import { 
  Map as MapIcon, 
  AlertTriangle, 
  MapPin, 
  Plus, 
  Filter, 
  ShieldAlert, 
  Info,
  Calendar,
  X 
} from 'lucide-react';

const SA_PROVINCES = [
  'All Provinces',
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

// Helper to create distinctive Leaflet HTML divIcons
const createColoredMarker = (color, symbol) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 13px;
    ">${symbol}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const suspectMarker = createColoredMarker('#F59E0B', '⚠');
const reviewedMarker = createColoredMarker('#2563EB', '🔍');
const officialMarker = createColoredMarker('#DC2626', '⛔');
const farmMarker = createColoredMarker('#1B4332', '⌂');

export default function DiseaseMapPage() {
  const [incidents, setIncidents] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Report Incident Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    disease_name: '',
    province: 'Free State',
    municipality: '',
    latitude: '',
    longitude: '',
    reported_date: new Date().toISOString().split('T')[0],
    verification_status: 'Suspected',
    affected_count: 1,
    death_count: 0,
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    loadMapData();
  }, [selectedProvince, selectedStatus]);

  const loadMapData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedProvince !== 'All Provinces') params.province = selectedProvince;
      const res = await diseaseIncidentsAPI.getMapData(params);
      
      let filteredIncidents = res.data.incidents;
      if (selectedStatus !== 'All') {
        filteredIncidents = filteredIncidents.filter(i => i.verification_status === selectedStatus);
      }

      setIncidents(filteredIncidents);
      setFarms(res.data.farms);
    } catch (err) {
      console.error("Failed to load disease incident map data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setShowModal(true);
  };

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        affected_count: parseInt(formData.affected_count) || 1,
        death_count: parseInt(formData.death_count) || 0,
      };

      await diseaseIncidentsAPI.create(payload);
      setShowModal(false);
      loadMapData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit disease incident.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Disease Risk Intelligence & GIS Map</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Real-time geographical surveillance across South Africa’s 9 provinces. Suspected vs Verified incidents.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Report Suspected Incident</span>
        </button>
      </div>

      <DisclaimerBanner message="Geographical disease incidents reflect farmer-submitted suspected cases and verified veterinary investigations. Official outbreak quarantine declarations rest strictly with the National Department of Agriculture, Land Reform and Rural Development (DALRRD)." />

      {/* Filter and Legend Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="px-3 py-2 bg-cream border border-gray-200 rounded-xl font-medium text-charcoal focus:bg-white"
          >
            {SA_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-cream border border-gray-200 rounded-xl font-medium text-charcoal focus:bg-white"
          >
            <option value="All">All Verification Levels</option>
            <option value="Suspected">Suspected Incidents</option>
            <option value="Professionally Reviewed">Professionally Reviewed</option>
            <option value="Official Outbreak">Official Outbreaks</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white font-bold">⚠</span>
            <span className="text-charcoal-muted">Suspected</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">🔍</span>
            <span className="text-charcoal-muted">Vet Reviewed</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[9px] text-white font-bold">⛔</span>
            <span className="text-charcoal-muted">Official Outbreak</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-forest-800 flex items-center justify-center text-[9px] text-white font-bold">⌂</span>
            <span className="text-charcoal-muted">Farms</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[540px] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner message="Rendering geographical map markers..." />
          </div>
        ) : (
          <MapContainer
            center={[-29.0, 25.5]} // Center of South Africa (Free State / Northern Cape border)
            zoom={6}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Farm Markers */}
            {farms.map((f) => (
              <Marker
                key={`farm-${f.id}`}
                position={[f.latitude, f.longitude]}
                icon={farmMarker}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <h4 className="font-bold text-forest-900 text-sm">{f.name}</h4>
                    <p className="text-gray-600 mt-0.5">{f.municipality}, {f.province}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-forest-100 text-forest-800 font-semibold uppercase text-[10px]">
                      {f.farm_type}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Disease Incident Markers */}
            {incidents.map((inc) => {
              const markerIcon = inc.verification_status === 'Official Outbreak'
                ? officialMarker
                : inc.verification_status === 'Professionally Reviewed'
                ? reviewedMarker
                : suspectMarker;

              return (
                <Marker
                  key={`incident-${inc.id}`}
                  position={[inc.latitude, inc.longitude]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="p-1.5 text-xs max-w-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-charcoal">{inc.disease_name}</span>
                      </div>
                      <StatusBadge status={inc.verification_status} size="xs" />
                      
                      <div className="mt-2 text-gray-700 space-y-0.5">
                        <p><strong>Location: </strong>{inc.municipality}, {inc.province}</p>
                        <p><strong>Affected: </strong>{inc.affected_count} cattle (Deaths: {inc.death_count})</p>
                        <p><strong>Reported: </strong>{inc.reported_date}</p>
                        <p><strong>Status: </strong><span className="font-semibold">{inc.status}</span></p>
                        {inc.description && (
                          <p className="mt-1 text-gray-600 text-[11px] leading-snug">{inc.description}</p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Incident List Summary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-charcoal text-sm">
            Active Disease Incidents ({incidents.length})
          </h3>
          <span className="text-xs text-charcoal-muted">Sorted by report date</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Disease Concern</th>
                <th className="py-3 px-4">Location (District, Province)</th>
                <th className="py-3 px-4">Verification Level</th>
                <th className="py-3 px-4">Affected / Mortalities</th>
                <th className="py-3 px-4">Reported Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {incidents.map((i) => (
                <tr key={i.id} className="hover:bg-cream-surface/50 transition">
                  <td className="py-3 px-4 font-bold text-forest-950">
                    {i.disease_name}
                  </td>
                  <td className="py-3 px-4 text-charcoal">
                    {i.municipality}, {i.province}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={i.verification_status} />
                  </td>
                  <td className="py-3 px-4 text-charcoal-muted">
                    {i.affected_count} affected {i.death_count > 0 ? `(${i.death_count} dead)` : ''}
                  </td>
                  <td className="py-3 px-4 text-charcoal-muted">
                    {i.reported_date}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={i.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">Report Suspected Disease Incident</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Help notify neighboring farmers and veterinary services of potential biosecurity risks.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitIncident} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Suspected Disease Concern *
                </label>
                <input
                  type="text"
                  required
                  value={formData.disease_name}
                  onChange={(e) => setFormData({ ...formData, disease_name: e.target.value })}
                  placeholder="e.g. Lumpy Skin Disease / Redwater suspicion"
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
                    {SA_PROVINCES.filter(p => p !== 'All Provinces').map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
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
                    placeholder="e.g. Chris Hani District"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Latitude (Numerical) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g. -29.1"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Longitude (Numerical) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g. 26.2"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Estimated Affected Cattle *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.affected_count}
                    onChange={(e) => setFormData({ ...formData, affected_count: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Mortality / Deaths
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.death_count}
                    onChange={(e) => setFormData({ ...formData, death_count: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Incident Description & Observations
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe lesions, affected camps, recent communal water trough usage..."
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
                  {submitting ? 'Reporting...' : 'Submit Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
