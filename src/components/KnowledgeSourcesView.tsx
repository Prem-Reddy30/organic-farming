import React, { useState, useEffect } from 'react';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Calendar,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { IngestedDocument, Language } from '../types';
import { fetchSources } from '../services/api';

interface KnowledgeSourcesViewProps {
  language: Language;
}

export const KnowledgeSourcesView: React.FC<KnowledgeSourcesViewProps> = ({ language }) => {
  const [sources, setSources] = useState<IngestedDocument[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSources()
      .then((res) => {
        setSources(res.sources);
        setTotalCount(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sources.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase()) ||
      s.crop_category.toLowerCase().includes(search.toLowerCase());
    const matchTopic = filterTopic === 'All' || s.farming_topic.toLowerCase().includes(filterTopic.toLowerCase());
    return matchSearch && matchTopic;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
            <Database className="w-3.5 h-3.5" />
            <span>Verified Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'te' ? 'ధృవీకరించబడిన నాలెడ్జ్ సోర్సెస్' : language === 'hi' ? 'सत्यापित कृषि शोध ज्ञानकोष' : 'Agricultural Knowledge Base Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
            {language === 'te'
              ? 'ఐసీఏఆర్ (ICAR), నేషనల్ సెంటర్ ఫర్ ఆర్గానిక్ ఫార్మింగ్ (NCOF) మరియు వ్యవసాయ విశ్వవిద్యాలయాల నుంచి పరిశోధనా పత్రాలు.'
              : language === 'hi'
              ? 'ICAR, कृषि विश्वविद्यालयों व सरकारी अनुसंधान संस्थानों के प्रामाणिक शोध पत्र जो सीधे वेक्टर डेटाबेस में अनुक्रमित हैं।'
              : 'Every answer in KisanJaivik AI is grounded in official government manuals, ICAR research publications, and agricultural university package of practices.'}
          </p>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-forest">
              {totalCount} Indexed Research Documents
            </h3>
            <p className="text-[11px] text-slate-500">
              Chunked with recursive character text splitting & vectorized in ChromaDB
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, crop..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            />
          </div>

          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-agri-400"
          >
            <option value="All">All Topics</option>
            <option value="Composting">Composting & Vermiculture</option>
            <option value="Liquid">Liquid Organic Manures</option>
            <option value="Foliar">Foliar Nutrition</option>
            <option value="Pest">Pest & Disease Management</option>
            <option value="Package of Practices">Package of Practices</option>
            <option value="Soil">Soil Fertility & Microbiology</option>
          </select>
        </div>
      </div>

      {/* Source Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-agri-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-agri-100 text-agri-800">
                  {doc.crop_category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-agri-600" />
                  {doc.publication_date}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  <strong>Author / Institute:</strong> {doc.author}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                  Topic: {doc.farming_topic}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                  {doc.chunk_count} Chunks in Vector Store
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold">
                  Language: {doc.language}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-agri-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-agri-600" />
                <span>Verified Authority Document</span>
              </div>

              {doc.source_url && (
                <a
                  href={doc.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-forest"
                >
                  <span>Read Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agri-600" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
