import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { healthReportsAPI, farmsAPI, animalsAPI, aiAPI } from '../../services/api';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import StatusBadge from '../../components/StatusBadge';
import { 
  PlusCircle, 
  AlertTriangle, 
  Bot, 
  ArrowLeft, 
  Calendar, 
  Layers, 
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

const SYMPTOM_OPTIONS = [
  { id: 'loss_of_appetite', label: 'Loss of appetite / Inappetence', desc: 'Reluctance or refusal to feed or graze' },
  { id: 'fever', label: 'Elevated body temperature / High fever', desc: 'Hot ears/horns, shivering, dry muzzle' },
  { id: 'excessive_salivation', label: 'Excessive salivation / Drooling / Foaming', desc: 'Stringy foam or saliva dripping from mouth' },
  { id: 'mouth_lesions', label: 'Mouth / Muzzle / Tongue Blisters & Ulcers', desc: 'Visible raw sores, blisters, or ulcers' },
  { id: 'lameness', label: 'Lameness / Limping / Reluctance to walk', desc: 'Difficulty stepping, sore hooves, recumbent' },
  { id: 'diarrhoea', label: 'Diarrhoea / Scours', desc: 'Watery, profuse, foul-smelling, or dark stools' },
  { id: 'respiratory_difficulties', label: 'Respiratory difficulties / Coughing', desc: 'Rapid shallow breathing, nasal discharge' },
  { id: 'unusual_behaviour', label: 'Unusual behaviour / Nervous signs', desc: 'Circling, head pressing, disorientation, aggression' },
  { id: 'reduced_milk_production', label: 'Sudden drop in milk yield', desc: 'Sharp unexpected decline in daily production' },
  { id: 'swelling', label: 'Swelling / Edema', desc: 'Swollen dewlap, brisket, legs, or muscle areas' },
  { id: 'sudden_weakness', label: 'Sudden weakness / Collapse', desc: 'Unable to stand, staggering, recumbency' },
  { id: 'bleeding_or_dark_urine', label: 'Dark red/brown urine or bleeding', desc: 'Blood in urine, nose bleeding, pale gums' },
  { id: 'skin_nodules', label: 'Skin nodules / Firm round lumps', desc: 'Raised nodules on hide, neck, or body' },
  { id: 'other_symptoms', label: 'Other non-specific symptoms', desc: 'Dullness, hair loss, general malaise' }
];

export default function SubmitReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farm_id') || '';
  const initialAnimalId = searchParams.get('animal_id') || '';

  const [farms, setFarms] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form states
  const [farmId, setFarmId] = useState(initialFarmId);
  const [animalId, setAnimalId] = useState(initialAnimalId);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [firstNoticedDate, setFirstNoticedDate] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState('moderate');
  const [durationDays, setDurationDays] = useState(1);
  const [observations, setObservations] = useState('');

  // Live preliminary AI preview state
  const [aiPreview, setAiPreview] = useState(null);
  const [calculatingAI, setCalculatingAI] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFarmsAndAnimals();
  }, []);

  useEffect(() => {
    if (farmId) {
      loadAnimalsForFarm(farmId);
    }
  }, [farmId]);

  // Trigger live AI preview when symptoms or severity change
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      runLiveAIPreview();
    } else {
      setAiPreview(null);
    }
  }, [selectedSymptoms, severity, durationDays]);

  const loadFarmsAndAnimals = async () => {
    try {
      const resFarms = await farmsAPI.getAll();
      setFarms(resFarms.data);
      if (resFarms.data.length > 0 && !farmId) {
        setFarmId(resFarms.data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load farms:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadAnimalsForFarm = async (fId) => {
    try {
      const resAnimals = await animalsAPI.getAll({ farm_id: fId });
      setAnimals(resAnimals.data);
    } catch (err) {
      console.error("Failed to load animals for farm:", err);
    }
  };

  const toggleSymptom = (symId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symId) ? prev.filter((s) => s !== symId) : [...prev, symId]
    );
  };

  const runLiveAIPreview = async () => {
    setCalculatingAI(true);
    try {
      const res = await aiAPI.assessHealth({
        symptoms: selectedSymptoms,
        severity: severity,
        duration_days: parseInt(durationDays) || 1,
        species: 'cattle'
      });
      setAiPreview(res.data);
    } catch (err) {
      console.error("AI preview calculation error:", err);
    } finally {
      setCalculatingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedSymptoms.length === 0) {
      setError('Please select at least one observed symptom.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        farm_id: parseInt(farmId),
        animal_id: animalId ? parseInt(animalId) : null,
        symptoms: selectedSymptoms,
        first_noticed_date: firstNoticedDate,
        severity: severity,
        duration_days: parseInt(durationDays) || 1,
        additional_observations: observations,
      };

      const res = await healthReportsAPI.create(payload);
      navigate(`/health-reports/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit health report. Please verify details.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/health-reports"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Reports</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Report Livestock Symptoms</h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Provide structured observations to receive immediate preliminary AI risk assessments and alert local veterinarians.
        </p>
      </div>

      <DisclaimerBanner />

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Location & Animal Identification */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 text-xs flex items-center justify-center font-bold">1</span>
            <span>Farm & Animal Identification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Select Farm Parcel *
              </label>
              <select
                required
                value={farmId}
                onChange={(e) => {
                  setFarmId(e.target.value);
                  setAnimalId('');
                }}
                className="w-full px-3 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.municipality}, {f.province})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Affected Cattle (Optional)
              </label>
              <select
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                className="w-full px-3 py-2.5 bg-cream border border-gray-200 rounded-xl text-sm text-charcoal focus:bg-white"
              >
                <option value="">General Herd Observation / Unidentified Tag</option>
                {animals.map((a) => (
                  <option key={a.id} value={a.id}>
                    Tag {a.tag_number} ({a.breed} - {a.sex})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Observed Symptoms Checklist */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Observed Symptoms (Select all that apply) *</span>
            </h2>
            <span className="text-xs font-semibold text-forest-700">
              {selectedSymptoms.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SYMPTOM_OPTIONS.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <div
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-forest-50/80 border-forest-500 shadow-sm ring-1 ring-forest-500'
                      : 'bg-white border-gray-150 hover:bg-cream-surface'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by div click
                    className="mt-0.5 rounded text-forest-700 focus:ring-forest-600 cursor-pointer"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-charcoal leading-snug">{sym.label}</h4>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">{sym.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Severity, Duration & Date */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-forest-100 text-forest-800 text-xs flex items-center justify-center font-bold">3</span>
            <span>Severity & Timeline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                First Noticed Date *
              </label>
              <input
                type="date"
                required
                value={firstNoticedDate}
                onChange={(e) => setFirstNoticedDate(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                Observed Severity *
              </label>
              <div className="grid grid-cols-3 gap-1">
                {['mild', 'moderate', 'severe'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                      severity === lvl
                        ? lvl === 'severe'
                          ? 'bg-red-700 text-white'
                          : lvl === 'moderate'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-cream text-charcoal border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1 text-xs">
              Additional Observations (Optional)
            </label>
            <textarea
              rows="3"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Describe feed intake, posture, response to shade, communal herd contact..."
              className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Live Preliminary AI Risk Preview */}
        {aiPreview && (
          <div className="p-6 rounded-2xl bg-forest-900 text-white shadow-lg space-y-4 transition-all">
            <div className="flex items-center justify-between border-b border-forest-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-forest-300" />
                <span className="font-bold text-sm tracking-wide">Live Preliminary AI Assessment Preview</span>
              </div>
              <StatusBadge status={aiPreview.risk_category} size="lg" />
            </div>

            <div className="text-xs space-y-2 text-forest-100">
              <p><strong>Clinical Pattern: </strong>{aiPreview.explanation}</p>
              
              {aiPreview.possible_concerns.length > 0 && (
                <div>
                  <strong className="text-forest-200">Potential Syndromic Concerns:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-white">
                    {aiPreview.possible_concerns.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiPreview.veterinary_referral_advisable && (
                <div className="p-3 bg-red-900/60 border border-red-500/40 rounded-xl text-red-100 flex items-start space-x-2 mt-2">
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">
                    <strong>Veterinary Advisory: </strong>
                    Based on these symptoms, immediate isolation and notification of your local State Veterinarian is highly recommended.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{submitting ? 'Generating AI Assessment & Submitting...' : 'Submit Health Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
