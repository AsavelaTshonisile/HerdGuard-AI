import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vaccinationsAPI, farmsAPI, animalsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { 
  Syringe, 
  Plus, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Tag, 
  X 
} from 'lucide-react';

const COMMON_SA_VACCINES = [
  'Anthrax Spore Vaccine (Onderstepoort)',
  'Brucellosis S19 Strain (Compulsory Heifers)',
  'Brucellosis RB51 Strain',
  'Blackquarter / Sponsbloed (Clostridium chauvoei)',
  'Lumpy Skin Disease (Neethling strain)',
  'Rift Valley Fever (Clone 13)',
  'Botulism / Lamsiekte Vaccine',
  'Bovine Respiratory Disease (Infectious IBR/Pasteurella)',
  'Tick-Borne Redwater Live Blood Vaccine',
  'Heartwater Blood Vaccine'
];

export default function VaccinationsPage() {
  const [searchParams] = useSearchParams();
  const initialAnimalId = searchParams.get('animal_id') || '';

  const [vaccinations, setVaccinations] = useState([]);
  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    farm_id: '',
    animal_id: initialAnimalId,
    vaccine_name: COMMON_SA_VACCINES[0],
    batch_number: '',
    vaccination_date: todayStr,
    next_due_date: nextYearStr,
    administering_professional: '',
    notes: '',
    status: 'completed'
  });

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    loadVaccinations();
  }, [selectedFarm, selectedStatus]);

  useEffect(() => {
    if (formData.farm_id) {
      loadAnimalsForFarm(formData.farm_id);
    }
  }, [formData.farm_id]);

  const loadFarms = async () => {
    try {
      const res = await farmsAPI.getAll();
      setFarms(res.data);
      if (res.data.length > 0 && !formData.farm_id) {
        setFormData((prev) => ({ ...prev, farm_id: res.data[0].id.toString() }));
      }
    } catch (err) {
      console.error("Failed to load farms:", err);
    }
  };

  const loadAnimalsForFarm = async (fId) => {
    try {
      const res = await animalsAPI.getAll({ farm_id: fId });
      setAnimals(res.data);
      if (res.data.length > 0 && !formData.animal_id) {
        setFormData((prev) => ({ ...prev, animal_id: res.data[0].id.toString() }));
      }
    } catch (err) {
      console.error("Failed to load animals for farm:", err);
    }
  };

  const loadVaccinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedFarm) params.farm_id = selectedFarm;
      if (selectedStatus) params.status = selectedStatus;
      if (initialAnimalId) params.animal_id = initialAnimalId;

      const res = await vaccinationsAPI.getAll(params);
      setVaccinations(res.data);
    } catch (err) {
      console.error("Failed to load vaccinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.animal_id || !formData.farm_id) {
      setError('Please select both a farm parcel and an animal.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        farm_id: parseInt(formData.farm_id),
        animal_id: parseInt(formData.animal_id),
      };
      await vaccinationsAPI.create(payload);
      setShowModal(false);
      loadVaccinations();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to record vaccination.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Vaccination Management</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Track statutory herd inoculations, schedule boosters, and monitor compliance
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={farms.length === 0}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Record Vaccination</span>
        </button>
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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Vaccinations Table */}
      {loading ? (
        <LoadingSpinner message="Loading vaccination records..." />
      ) : vaccinations.length === 0 ? (
        <EmptyState
          icon={Syringe}
          title="No vaccination records found"
          description="Maintain compliance with Anthrax, Brucellosis, and Blackquarter programs by logging immunizations."
          actionLabel="Log First Vaccination"
          onAction={handleOpenModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-cream-surface/70 uppercase text-[10px] font-bold tracking-wider text-charcoal-muted border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Animal Tag</th>
                  <th className="py-3 px-4">Vaccine Name</th>
                  <th className="py-3 px-4">Administered Date</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Batch Number / Officer</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vaccinations.map((v) => (
                  <tr key={v.id} className="hover:bg-cream-surface/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-forest-900">
                      <div className="flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-forest-600" />
                        <span>{v.animal_tag || 'Cattle Record'}</span>
                      </div>
                      <div className="text-[10px] text-charcoal-muted font-normal pl-5">
                        {v.farm_name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-charcoal">
                      {v.vaccine_name}
                      {v.notes && (
                        <div className="text-[11px] text-charcoal-muted font-normal mt-0.5">{v.notes}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {v.vaccination_date}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      {v.next_due_date}
                    </td>

                    <td className="py-3.5 px-4 text-charcoal-muted">
                      <div>Batch: <strong className="text-charcoal font-mono">{v.batch_number || '—'}</strong></div>
                      <div>{v.administering_professional || 'Farmer Administered'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={v.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Vaccination Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">Log Animal Vaccination</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Keep verified immunization records to prevent livestock mortality and disease spread.
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
                    Farm Parcel *
                  </label>
                  <select
                    required
                    value={formData.farm_id}
                    onChange={(e) => setFormData({ ...formData, farm_id: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Cattle Ear Tag *
                  </label>
                  <select
                    required
                    value={formData.animal_id}
                    onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    {animals.map((a) => (
                      <option key={a.id} value={a.id}>
                        Tag {a.tag_number} ({a.breed})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Vaccine Name *
                </label>
                <select
                  value={formData.vaccine_name}
                  onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                >
                  {COMMON_SA_VACCINES.map((vac) => (
                    <option key={vac} value={vac}>{vac}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Vaccination Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.vaccination_date}
                    onChange={(e) => setFormData({ ...formData, vaccination_date: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Next Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.next_due_date}
                    onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Batch / Lot Number
                  </label>
                  <input
                    type="text"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    placeholder="e.g. ANT-2024-08"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Administering Professional
                  </label>
                  <input
                    type="text"
                    value={formData.administering_professional}
                    onChange={(e) => setFormData({ ...formData, administering_professional: e.target.value })}
                    placeholder="Dr. Ndlovu or Self"
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Cold chain conditions, reaction observations..."
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
                  {submitting ? 'Recording...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
