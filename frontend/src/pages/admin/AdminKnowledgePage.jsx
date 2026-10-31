import React, { useState, useEffect } from 'react';
import { knowledgeAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { BookOpen, Plus, Trash2, ExternalLink, CheckCircle2, X } from 'lucide-react';

export default function AdminKnowledgePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    source_organization: 'Department of Agriculture, Land Reform and Rural Development (DALRRD)',
    category: 'Biosecurity & Notifiable Diseases',
    summary: '',
    content: '',
    source_url: '',
    verification_status: 'Verified Official'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await knowledgeAPI.getAll();
      setResources(res.data);
    } catch (err) {
      console.error("Failed to load knowledge resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await knowledgeAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        source_organization: 'Department of Agriculture, Land Reform and Rural Development (DALRRD)',
        category: 'Biosecurity & Notifiable Diseases',
        summary: '',
        content: '',
        source_url: '',
        verification_status: 'Verified Official'
      });
      loadResources();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete knowledge article "${title}"?`)) {
      try {
        await knowledgeAPI.delete(id);
        loadResources();
      } catch (err) {
        alert("Failed to delete article: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Knowledge Base & RAG Resources</h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Curated agricultural documentation powering the HerdGuard AI Assistant and farmer guidance
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Article</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading agricultural documents..." />
      ) : resources.length === 0 ? (
        <EmptyState icon={BookOpen} title="No knowledge documents" description="Add verified agricultural extension guidelines." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div key={res.id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 text-[10px] font-bold uppercase tracking-wider">
                    {res.category}
                  </span>
                  <button
                    onClick={() => handleDelete(res.id, res.title)}
                    className="p-1 text-gray-400 hover:text-rose-600 rounded transition"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-charcoal mt-2.5 leading-snug">{res.title}</h3>
                <div className="text-[11px] font-semibold text-forest-700 mt-1">
                  Source: {res.source_organization}
                </div>

                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed line-clamp-3">
                  {res.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  {res.verification_status}
                </span>

                {res.source_url && (
                  <a
                    href={res.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-forest-700 hover:underline flex items-center space-x-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-charcoal">Add Knowledge Resource</h2>
            <p className="text-xs text-charcoal-muted mt-1">
              Add verified South African agricultural extension content into the RAG vector index.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Foot and Mouth Disease Recognition"
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Source Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.source_organization}
                    onChange={(e) => setFormData({ ...formData, source_organization: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="Biosecurity & Notifiable Diseases">Biosecurity & Notifiable Diseases</option>
                    <option value="Vaccination & Vector Management">Vaccination & Vector Management</option>
                    <option value="Disease Identification">Disease Identification</option>
                    <option value="Livestock Hygiene">Livestock Hygiene</option>
                    <option value="General Animal Care">General Animal Care</option>
                    <option value="Platform Guidance">Platform Guidance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Summary (Brief overview) *
                </label>
                <textarea
                  rows="2"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Key takeaways..."
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Full Content *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed guidelines, symptoms, biosecurity protocols..."
                  className="w-full px-3 py-2 bg-cream border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal uppercase tracking-wider block mb-1">
                  Source Reference URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  placeholder="https://www.dalrrd.gov.za/..."
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
                  {submitting ? 'Saving...' : 'Add Knowledge Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
