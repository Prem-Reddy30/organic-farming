import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Upload,
  Globe,
  Trash2,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Key,
  Database,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { IngestedDocument, Language } from '../types';
import {
  uploadAgriculturalDocument,
  ingestWebUrl,
  deleteDocument,
  fetchAdminStatus,
  fetchSources
} from '../services/api';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [adminKey, setAdminKey] = useState<string>('organic-admin-kisan-2026');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'library' | 'jobs'>('upload');

  // Upload Form
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docAuthor, setDocAuthor] = useState('ICAR / Agricultural University');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docCrop, setDocCrop] = useState('General');
  const [docTopic, setDocTopic] = useState('General');
  const [docLanguage, setDocLanguage] = useState('English');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // URL Ingest Form
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlAuthor, setUrlAuthor] = useState('Ministry of Agriculture / Agricultural University');
  const [urlCrop, setUrlCrop] = useState('General');
  const [urlTopic, setUrlTopic] = useState('General');
  const [isUrlIngesting, setIsUrlIngesting] = useState(false);
  const [urlMsg, setUrlMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status & Docs
  const [adminStatus, setAdminStatus] = useState<any | null>(null);
  const [docList, setDocList] = useState<IngestedDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadStatusAndDocs();
    }
  }, [isAuthenticated]);

  const loadStatusAndDocs = async () => {
    setIsLoadingDocs(true);
    try {
      const status = await fetchAdminStatus(adminKey);
      setAdminStatus(status);
      const res = await fetchSources();
      setDocList(res.sources);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please choose a PDF, DOCX, or TXT file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadMsg(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (docTitle) formData.append('title', docTitle);
    formData.append('author', docAuthor);
    formData.append('publication_date', docDate);
    formData.append('crop_category', docCrop);
    formData.append('farming_topic', docTopic);
    formData.append('language', docLanguage);

    try {
      const res = await uploadAgriculturalDocument(formData, adminKey);
      setUploadMsg({
        type: 'success',
        text: `Document '${res.title}' indexed into ${res.chunks_indexed} vector chunks successfully!`
      });
      setUploadFile(null);
      setDocTitle('');
      loadStatusAndDocs();
    } catch (err: any) {
      setUploadMsg({ type: 'error', text: err.message || 'Ingestion failed.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUrlIngesting(true);
    setUrlMsg(null);

    try {
      const res = await ingestWebUrl(
        {
          url: urlInput.trim(),
          title: urlTitle.trim() || undefined,
          author: urlAuthor,
          crop_category: urlCrop,
          farming_topic: urlTopic,
          language: 'English'
        },
        adminKey
      );
      setUrlMsg({
        type: 'success',
        text: `URL content parsed and indexed into ${res.chunks_indexed} vector chunks!`
      });
      setUrlInput('');
      setUrlTitle('');
      loadStatusAndDocs();
    } catch (err: any) {
      setUrlMsg({ type: 'error', text: err.message || 'URL ingestion failed.' });
    } finally {
      setIsUrlIngesting(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm(`Are you sure you want to delete document '${docId}' and all its vector chunks?`)) return;

    try {
      await deleteDocument(docId, adminKey);
      loadStatusAndDocs();
    } catch (err: any) {
      alert('Deletion error: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-forest">Admin Authentication Required</h2>
        <p className="text-xs text-slate-500">
          Enter the administrator secret key to manage document ingestion and vector database records.
        </p>
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Admin Secret Key"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
        />
        <button
          onClick={() => {
            if (adminKey) setIsAuthenticated(true);
          }}
          className="w-full py-2.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md"
        >
          Access Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RAG Knowledge Base Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Knowledge Base Admin Hub
            </h1>
            <p className="text-xs sm:text-sm text-agri-100 max-w-2xl">
              Ingest verified agricultural research papers, government manuals, and official university guidelines
              into the persistent vector database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadStatusAndDocs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vector Store Health Stats */}
      {adminStatus && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Documents</span>
            <p className="text-xl font-extrabold text-forest mt-0.5">{adminStatus.vector_store_stats?.total_documents || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vector Chunks</span>
            <p className="text-xl font-extrabold text-agri-700 mt-0.5">{adminStatus.vector_store_stats?.total_chunks || 0}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vector Dimension</span>
            <p className="text-xl font-extrabold text-slate-700 mt-0.5">{adminStatus.vector_store_stats?.vector_dimension || 384} dims</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Embedding Engine</span>
            <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{adminStatus.vector_store_stats?.embedding_provider}</p>
          </div>
        </div>
      )}

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        {[
          { key: 'upload', label: '1. Ingest File (PDF, DOCX, TXT)', icon: Upload },
          { key: 'url', label: '2. Ingest Web URL', icon: Globe },
          { key: 'library', label: '3. Document Library & Deletion', icon: Database },
          { key: 'jobs', label: '4. Ingestion Job Audit', icon: Layers }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-1.5 pb-3 border-b-2 transition-all ${
                isActive
                  ? 'border-agri-700 text-forest'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: File Ingestion */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Upload Agricultural Document</h3>
            <p className="text-xs text-slate-500">
              Upload research PDFs, university publications, or organic farming guidelines. The system automatically
              extracts text, splits into recursive character chunks with overlap, and generates embeddings.
            </p>
          </div>

          {uploadMsg && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              uploadMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              {uploadMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{uploadMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Select File (PDF, DOCX, TXT)</label>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-agri-100 file:text-agri-800 hover:file:bg-agri-200 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Title (Optional)</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Leave blank to use filename"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author / Organization</label>
              <input
                type="text"
                value={docAuthor}
                onChange={(e) => setDocAuthor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Category</label>
              <select
                value={docCrop}
                onChange={(e) => setDocCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="General">General / All Crops</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato / Vegetables</option>
                <option value="Wheat">Wheat</option>
                <option value="Pulses">Pulses & Legumes</option>
                <option value="Soil & Nutrients">Soil & Nutrients</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farming Topic</label>
              <select
                value={docTopic}
                onChange={(e) => setDocTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="General">General Practices</option>
                <option value="Composting & Vermiculture">Composting & Vermiculture</option>
                <option value="Liquid Organic Manures">Liquid Organic Manures (Jeevamrutham/Panchagavya)</option>
                <option value="Pest & Disease Management">Pest & Disease Management</option>
                <option value="Soil Fertility & Microbiology">Soil Fertility & Microbiology</option>
                <option value="Package of Practices">Package of Practices</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!uploadFile || isUploading}
            className="px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Chunking & Vectorizing Document...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Ingest into Vector Store</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Tab 2: URL Ingestion */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Ingest Verified Agricultural URL</h3>
            <p className="text-xs text-slate-500">
              Provide an official ICAR, university, or government circular web page. The crawler fetches the HTML,
              cleans scripts and tags, normalizes text, and indexes into the RAG vector space.
            </p>
          </div>

          {urlMsg && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              urlMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}>
              {urlMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{urlMsg.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Web Page URL</label>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://icar.org.in/... or https://agritech.tnau.ac.in/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Title (Optional)</label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Auto-detected from page title if blank"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Authority</label>
                <input
                  type="text"
                  value={urlAuthor}
                  onChange={(e) => setUrlAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!urlInput.trim() || isUrlIngesting}
            className="px-6 py-2.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            {isUrlIngesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crawling, Cleaning & Embedding Web Page...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Crawl and Index URL</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Tab 3: Document Library */}
      {activeTab === 'library' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Indexed Document Repository</h3>
              <p className="text-xs text-slate-500">Review chunk allocations or delete outdated guidelines.</p>
            </div>
            <span className="text-xs font-bold text-agri-700">{docList.length} Ingested Documents</span>
          </div>

          <div className="divide-y divide-slate-100">
            {docList.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-agri-100 text-agri-800">
                      {doc.crop_category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                    <span>{doc.author}</span>
                    <span>•</span>
                    <span>{doc.chunk_count} Chunks</span>
                    <span>•</span>
                    <span>ID: {doc.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.source_url && (
                    <a
                      href={doc.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:text-forest"
                      title="Inspect original file or link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Delete document and chunks from vector store"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Ingestion Job Audit */}
      {activeTab === 'jobs' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Ingestion Audit Logs</h3>
          <p className="text-xs text-slate-500">History of document upload, parsing, and chunking jobs.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Job ID</th>
                  <th className="py-2 px-3">Document Title</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Chunks</th>
                  <th className="py-2 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {(adminStatus?.recent_jobs || []).map((j: any) => (
                  <tr key={j.job_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{j.job_id.slice(0, 8)}...</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{j.title}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        j.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{j.chunks_created}</td>
                    <td className="py-2.5 px-3 text-slate-400">{j.started_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
