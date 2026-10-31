import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { healthReportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import { 
  ArrowLeft, 
  Tag, 
  MapPin, 
  Calendar, 
  Activity, 
  Bot, 
  CheckCircle2, 
  ShieldAlert, 
  AlertCircle,
  FileCheck2,
  Stethoscope,
  X
} from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Professional Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    observations: '',
    recommended_actions: '',
    follow_up_date: '',
    new_report_status: 'Action Recommended',
    official_case_reference: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await healthReportsAPI.getById(id);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to load health report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const payload = {
        ...reviewFormData,
        follow_up_date: reviewFormData.follow_up_date || null,
        official_case_reference: reviewFormData.official_case_reference || null
      };
      const res = await healthReportsAPI.review(id, payload);
      setReport(res.data);
      setShowReviewModal(false);
    } catch (err) {
      setReviewError(err.response?.data?.detail || "Failed to submit professional review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading health report and AI assessment..." />;
  }

  if (!report) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <h3 className="text-base font-bold text-charcoal">Report record not found</h3>
        <Link to="/health-reports" className="mt-4 inline-block text-xs font-semibold text-forest-700 hover:underline">
          Return to Reports List
        </Link>
      </div>
    );
  }

  const isProfessional = user?.role === 'professional' || user?.role === 'admin';
  const ai = report.ai_assessment;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/health-reports"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>
      </div>

      {/* Report Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-2xl font-extrabold text-charcoal">
              {report.reference_number}
            </span>
            <StatusBadge status={report.risk_category} size="lg" />
            <StatusBadge status={report.status} size="lg" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-charcoal-muted">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              <span>{report.farm_name}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-forest-600" />
              <span>{report.animal_tag ? `Tag: ${report.animal_tag}` : 'Herd Observation'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-forest-600" />
              <span>Noticed on {report.first_noticed_date} ({report.duration_days} day duration)</span>
            </span>
          </div>
        </div>

        {isProfessional && (
          <div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <Stethoscope className="w-4 h-4 text-forest-300" />
              <span>Add Professional Review</span>
            </button>
          </div>
        )}
      </div>

      <DisclaimerBanner />

      {/* Reported Symptoms Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-charcoal text-base">Farmer Reported Symptoms</h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {report.symptoms.map((sym, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-100 text-xs font-semibold text-forest-900 capitalize"
            >
              {sym.replace(/_/g, ' ')}
            </span>
          ))}
        </div>

        <div className="pt-2 text-xs text-charcoal space-y-1">
          <div>Severity: <strong className="capitalize">{report.severity}</strong></div>
          {report.additional_observations && (
            <div>
              <span className="font-semibold text-charcoal-muted">Observations: </span>
              {report.additional_observations}
            </div>
          )}
        </div>
      </div>

      {/* Preliminary AI Assessment Section */}
      {ai && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-forest-800/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <Bot className="w-6 h-6 text-forest-300" />
              <div>
                <h3 className="font-bold text-base tracking-wide">HerdGuard AI Preliminary Assessment</h3>
                <p className="text-[11px] text-forest-300">Rule-based syndromic intelligence engine</p>
              </div>
            </div>
            <StatusBadge status={ai.risk_category} size="lg" />
          </div>

          <p className="text-xs text-forest-100 leading-relaxed font-medium">
            {ai.explanation}
          </p>

          {ai.possible_concerns && ai.possible_concerns.length > 0 && (
            <div className="p-4 rounded-xl bg-forest-800/60 border border-forest-700/60 text-xs space-y-1.5">
              <h4 className="font-bold text-forest-200 uppercase tracking-wider text-[11px]">
                Potential Syndromic Patterns Identified:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-white">
                {ai.possible_concerns.map((concern, i) => (
                  <li key={i}>{concern}</li>
                ))}
              </ul>
            </div>
          )}

          {ai.recommended_steps && ai.recommended_steps.length > 0 && (
            <div className="p-4 rounded-xl bg-forest-800/60 border border-forest-700/60 text-xs space-y-1.5">
              <h4 className="font-bold text-forest-200 uppercase tracking-wider text-[11px]">
                Recommended Next Steps:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-white">
                {ai.recommended_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {ai.safety_disclaimer && (
            <div className="pt-2 text-[10px] text-forest-300/80 border-t border-forest-800 leading-relaxed">
              {ai.safety_disclaimer}
            </div>
          )}
        </div>
      )}

      {/* Professional Reviews Section */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-charcoal text-base flex items-center space-x-2">
          <FileCheck2 className="w-5 h-5 text-forest-700" />
          <span>Professional Veterinary Reviews</span>
        </h3>

        {(!report.reviews || report.reviews.length === 0) ? (
          <div className="py-6 text-center text-xs text-charcoal-muted bg-cream-surface/50 rounded-xl">
            Awaiting inspection or review by an authorized agricultural extension officer or veterinarian.
          </div>
        ) : (
          <div className="space-y-4">
            {report.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-forest-50/50 border border-forest-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-forest-900">{rev.reviewer_name}</span>
                  <span className="text-[10px] text-charcoal-muted">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                {rev.official_case_reference && (
                  <div className="text-[11px] font-mono text-charcoal-muted">
                    Official Case Ref: <strong>{rev.official_case_reference}</strong>
                  </div>
                )}

                <div>
                  <span className="font-bold text-charcoal block">Clinical Observations:</span>
                  <p className="text-charcoal mt-0.5 whitespace-pre-line">{rev.observations}</p>
                </div>

                <div>
                  <span className="font-bold text-charcoal block">Recommended Interventions:</span>
                  <p className="text-charcoal mt-0.5 whitespace-pre-line">{rev.recommended_actions}</p>
                </div>

                {rev.follow_up_date && (
                  <div className="text-[11px] text-charcoal-muted">
                    Scheduled Follow-Up: <strong>{rev.follow_up_date}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal for Officers / Vets */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">Add Professional Review</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Provide clinical observations, recommendations, and update status for report {report.reference_number}.
            </p>

            {reviewError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Professional Observations *
                </label>
                <textarea
                  rows="3"
                  required
                  value={reviewFormData.observations}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, observations: e.target.value })}
                  placeholder="Detail physical inspection findings, temperature, lesions, differentials..."
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Recommended Actions & Biosecurity Protocols *
                </label>
                <textarea
                  rows="3"
                  required
                  value={reviewFormData.recommended_actions}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, recommended_actions: e.target.value })}
                  placeholder="Isolation guidelines, disinfectant protocols, laboratory sampling..."
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    New Report Status *
                  </label>
                  <select
                    value={reviewFormData.new_report_status}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, new_report_status: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="Action Recommended">Action Recommended</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={reviewFormData.follow_up_date}
                    onChange={(e) => setReviewFormData({ ...reviewFormData, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Official Case Reference (Optional)
                </label>
                <input
                  type="text"
                  value={reviewFormData.official_case_reference}
                  onChange={(e) => setReviewFormData({ ...reviewFormData, official_case_reference: e.target.value })}
                  placeholder="e.g. EC-VET-2026-CH-042"
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-charcoal font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Saving Review...' : 'Submit Professional Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
