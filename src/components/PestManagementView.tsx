import React, { useState, useEffect } from 'react';
import {
  Bug,
  Search,
  Upload,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Info,
  RefreshCw,
  Camera,
  Layers,
  Leaf
} from 'lucide-react';
import { PestRecord, Language } from '../types';
import { fetchPests, diagnoseCropIssue } from '../services/api';

interface PestManagementViewProps {
  language: Language;
}

export const PestManagementView: React.FC<PestManagementViewProps> = ({ language }) => {
  const [pests, setPests] = useState<PestRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  // Interactive Diagnostic state
  const [diagnoseCrop, setDiagnoseCrop] = useState('Cotton');
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null);

  useEffect(() => {
    fetchPests().then(setPests).catch(console.error);
  }, []);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsDiagnosing(true);
    setDiagnosticResult(null);

    try {
      const res = await diagnoseCropIssue(diagnoseCrop, symptomInput, selectedImage || undefined);
      setDiagnosticResult(res);
    } catch (e: any) {
      alert('Diagnostic request failed: ' + e.message);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleSymptom = (crop: string, text: string) => {
    setDiagnoseCrop(crop);
    setSymptomInput(text);
  };

  const filteredPests = pests.filter((p) => {
    const matchCrop = selectedCropFilter === 'All' || p.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchSearch =
      !searchQuery ||
      p.pest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCrop && matchSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
            <Bug className="w-3.5 h-3.5" />
            <span>Ecological & Biological Plant Protection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'te' ? 'సహజ తెగుళ్ల నివారణ & వ్యాధి నిర్ధారణ' : language === 'hi' ? 'जैविक कीट व रोग प्रबंधन' : 'Organic Pest & Disease Management'}
          </h1>
          <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
            {language === 'te'
              ? 'రసాయన మందులు లేకుండా జీవ నియంత్రణ, పసుపు జిగురు అట్టలు, లింగాకర్షక బుట్టలు మరియు వేప కషాయాలతో పురుగుల నివారణ.'
              : language === 'hi'
              ? 'परजीवी कीट (ट्राइकोग्रामा), फेरोमोन ट्रैप, नीम अर्क और खट्टी छाछ द्वारा फसलों का सुरक्षित प्राकृतिक संरक्षण।'
              : 'Grounded biological and preventive strategies from ICAR-CICR and IIHR without hazardous synthetic pesticides.'}
          </p>
        </div>
      </div>

      {/* Interactive Symptom & Image Diagnostic Tool */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 mb-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>AI Crop Doctor Assistant</span>
            </div>
            <h2 className="text-lg font-bold text-forest">
              Diagnose Crop Symptoms & Biological Prescription
            </h2>
            <p className="text-xs text-slate-500">
              Describe observed leaf/stem damage or upload a photo to retrieve verified organic treatments.
            </p>
          </div>

          {/* Quick preset symptom buttons */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold self-center">Try sample:</span>
            <button
              type="button"
              onClick={() => loadSampleSymptom('Cotton', 'Rosette flowers, cotton bolls have boreholes with frass, flowers twisted')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium"
            >
              Pink Bollworm
            </button>
            <button
              type="button"
              onClick={() => loadSampleSymptom('Tomato', 'Target-board concentric brown rings on lower leaves, stem lesions')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium"
            >
              Tomato Early Blight
            </button>
            <button
              type="button"
              onClick={() => loadSampleSymptom('Paddy', 'Dead hearts in tillering stage, white earheads with empty grains')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium"
            >
              Rice Stem Borer
            </button>
          </div>
        </div>

        <form onSubmit={handleDiagnose} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Affected Crop</label>
              <select
                value={diagnoseCrop}
                onChange={(e) => setDiagnoseCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="Cotton">Cotton (పత్తి / कपास)</option>
                <option value="Tomato">Tomato (టమాటా / टमाटर)</option>
                <option value="Paddy">Paddy / Rice (వరి / धान)</option>
                <option value="Chilli">Chilli (మిరప / मिर्च)</option>
                <option value="Wheat">Wheat (గోధుమ / गेहूँ)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Observed Symptoms on Leaves, Stem, or Flowers
              </label>
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="e.g. Concentric rings on lower leaves, sudden yellowing, small bore holes on bolls..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              />
            </div>
          </div>

          {/* Photo Uploader */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Upload Crop Photo (Optional)</div>
                <div className="text-[11px] text-slate-500">Supports JPG, PNG image inspection</div>
              </div>
            </div>

            <div className="sm:ml-auto flex items-center gap-3">
              <input
                type="file"
                id="cropPhoto"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="cropPhoto"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Choose File
              </label>

              {selectedImage && (
                <div className="flex items-center gap-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded Leaf Preview"
                    className="w-8 h-8 rounded-lg object-cover border border-agri-400"
                  />
                  <span className="text-[11px] text-agri-700 font-bold">Image Attached</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!symptomInput.trim() || isDiagnosing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDiagnosing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning Knowledge Base & Formulating Diagnosis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Grounded Biological Diagnosis</span>
              </>
            )}
          </button>
        </form>

        {/* Diagnostic Results Presentation */}
        {diagnosticResult && (
          <div className="mt-6 p-6 rounded-2xl bg-agri-50/70 border border-agri-200 space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-agri-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-agri-900">Diagnosis for: {diagnosticResult.crop}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-200 text-agri-900">
                  {diagnosticResult.confidence_level}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Grounded in Agricultural Research</span>
            </div>

            <div className="prose prose-xs sm:prose-sm max-w-none text-slate-800 whitespace-pre-wrap font-sans">
              {diagnosticResult.diagnosis_guidance}
            </div>

            {/* Expert Uncertainty Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                  Crucial KVK Scientific Disclaimer:
                </span>
                <p className="leading-relaxed">{diagnosticResult.expert_disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Curated Pest Database Search */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-forest">
              Verified Biological Pest Control Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Common Indian agricultural pests, biological controls, and trap thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pest name or symptom..."
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-agri-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPests.map((pest) => (
            <div
              key={pest.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-100 text-agri-800">
                  {pest.crop}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">ICAR Protocol</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{pest.pest_name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Symptoms:</strong> {pest.symptoms}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-forest">Preventive & Cultural Controls:</span>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {pest.preventive_controls.map((pc, idx) => (
                      <li key={idx}>{pc}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-agri-700">Biological & Parasitoid Controls:</span>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {pest.biological_controls.map((bc, idx) => (
                      <li key={idx}>{bc}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-earth-dark">Botanical Sprays:</span>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {pest.botanical_sprays.map((bs, idx) => (
                      <li key={idx}>{bs}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                <strong>Advisory:</strong> {pest.expert_advisory}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
