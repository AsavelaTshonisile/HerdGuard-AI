import React, { useState, useEffect } from 'react';
import { knowledgeAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { BookOpen, Search, Filter, ExternalLink, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Biosecurity & Notifiable Diseases',
  'Vaccination & Vector Management',
  'Vaccination',
  'Disease Identification',
  'Platform Guidance'
];

export default function KnowledgeBasePage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    loadResources();
  }, [search, selectedCategory]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;

      const res = await knowledgeAPI.getAll(params);
      setResources(res.data);
    } catch (err) {
      console.error("Failed to load knowledge resources:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Agricultural Knowledge & Guidelines</h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Official biosecurity and livestock health documents from DALRRD, SAVA, and ARC Onderstepoort
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by topic, disease name, or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-cream border border-gray-200 rounded-xl text-xs text-charcoal focus:bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching verified agricultural guidelines..." />
      ) : resources.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found" description="Try clearing your search term or selecting another category." />
      ) : (
        <div className="space-y-4">
          {resources.map((doc) => (
            <div key={doc.id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 text-[10px] font-bold uppercase tracking-wider">
                    {doc.category}
                  </span>
                  <h3 className="font-bold text-lg text-charcoal mt-2">{doc.title}</h3>
                  <div className="text-xs font-semibold text-forest-700 mt-0.5">
                    Source: {doc.source_organization}
                  </div>
                </div>

                {doc.source_url && (
                  <a
                    href={doc.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-forest-700 hover:text-forest-900 hover:bg-forest-50 rounded-xl transition flex items-center space-x-1 text-xs font-semibold"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-3 bg-cream rounded-xl text-xs font-medium text-forest-900 border border-gray-100">
                <strong>Summary: </strong>{doc.summary}
              </div>

              <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line">
                {doc.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
