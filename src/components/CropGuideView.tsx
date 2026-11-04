import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Filter,
  CheckCircle2,
  Calendar,
  MapPin,
  Layers,
  Droplets,
  Sprout,
  ShieldCheck,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CropInfo, CropGuideResponse, Language } from '../types';
import { fetchCrops, fetchCropGuide } from '../services/api';

interface CropGuideViewProps {
  language: Language;
}

export const CropGuideView: React.FC<CropGuideViewProps> = ({ language }) => {
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('paddy');
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [selectedSoil, setSelectedSoil] = useState<string>('Clayey Loam');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif');
  const [activeStageKey, setActiveStageKey] = useState<string>('all');

  const [guideData, setGuideData] = useState<CropGuideResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCrops().then((list) => {
      if (list.length > 0) {
        setCrops(list);
        setSelectedCrop(list[0].id);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      loadGuide();
    }
  }, [selectedCrop, selectedState, selectedSoil, selectedSeason]);

  const loadGuide = async () => {
    setLoading(true);
    try {
      const data = await fetchCropGuide(selectedCrop, selectedState, undefined, selectedSoil, selectedSeason);
      setGuideData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentCropObj = crops.find((c) => c.id === selectedCrop) || crops[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
              <Sprout className="w-3.5 h-3.5" />
              <span>9-Stage Verified Agronomic Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'te' ? 'పంటల సాగు మార్గదర్శి' : language === 'hi' ? 'फसल-वार जैविक मार्गदर्शिका' : 'Crop-Specific Organic Farming Guide'}
            </h1>
            <p className="text-xs sm:text-sm text-agri-100 max-w-2xl">
              {language === 'te'
                ? 'భూమి తయారీ నుండి పంట నిల్వ వరకు విశ్వవిద్యాలయ పరిశోధనల ఆధారంగా సమగ్ర ప్రణాళిక.'
                : language === 'hi'
                ? 'भूमि की तैयारी से लेकर कटाई तक विश्वविद्यालय शोध पर आधारित 9 चरणों की कार्ययोजना।'
                : 'Select crop, state, soil, and season to generate a complete end-to-end organic package of practices.'}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-forest hover:bg-agri-50 text-xs font-bold transition-all shadow-md shrink-0"
          >
            <Printer className="w-4 h-4 text-agri-700" />
            <span>{language === 'te' ? 'ప్రింట్ / డౌన్‌లోడ్' : language === 'hi' ? 'प्रिंट / डाउनलोड' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Customize Your Agro-Climatic Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State / Region</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          {/* Soil Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil Type</label>
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="Clayey Loam">Clayey Loam (నల్లరేగడి నేలలు)</option>
              <option value="Deep Black Soil">Deep Black Cotton Soil</option>
              <option value="Red Sandy Loam">Red Sandy Loam (ఎర్ర నేలలు)</option>
              <option value="Alluvial Soil">Alluvial Fertile Soil</option>
            </select>
          </div>

          {/* Season Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Cropping Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            >
              <option value="Kharif">Kharif (Monsoon: June - Oct)</option>
              <option value="Rabi">Rabi (Winter: Nov - March)</option>
              <option value="Zaid">Zaid (Summer: March - June)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Crop Metadata Quick Highlights */}
      {currentCropObj && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Scientific Name</span>
            <p className="text-xs font-bold text-slate-800 italic mt-0.5">{currentCropObj.scientific_name}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Duration</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{currentCropObj.duration_days}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Water Management</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{currentCropObj.water_requirement}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Major Producing States</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">{currentCropObj.major_states.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Stage Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {[
          { key: 'all', label: 'All 9 Stages' },
          { key: '1_land_preparation', label: '1. Land Prep' },
          { key: '2_seed_selection_and_treatment', label: '2. Seed Treatment' },
          { key: '3_sowing_and_spacing', label: '3. Sowing & Spacing' },
          { key: '4_organic_nutrient_management', label: '4. Nutrient Management' },
          { key: '5_irrigation_and_water_conservation', label: '5. Irrigation' },
          { key: '6_weed_management', label: '6. Weed & Mulch' },
          { key: '7_pest_and_disease_prevention', label: '7. Pest & Disease' },
          { key: '8_harvesting', label: '8. Harvesting' },
          { key: '9_post_harvest_handling', label: '9. Post-Harvest' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStageKey(tab.key)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeStageKey === tab.key
                ? 'bg-agri-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guide Cards Display */}
      {guideData && (
        <div className="space-y-4">
          {Object.entries(guideData.stages)
            .filter(([k]) => activeStageKey === 'all' || activeStageKey === k)
            .map(([stageKey, stageInfo], idx) => (
              <div
                key={stageKey}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-agri-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-agri-100 text-agri-800 font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {stageInfo.title}
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-agri-700 bg-agri-50 px-2 py-0.5 rounded-full border border-agri-100">
                    Grounded Protocol
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans pl-11">
                  {stageInfo.details}
                </p>
              </div>
            ))}

          {/* Citations Footer */}
          {guideData.sources && guideData.sources.length > 0 && (
            <div className="p-4 rounded-2xl bg-agri-50 border border-agri-100 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-forest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-agri-700" />
                Verified Sources Citing this Guide:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {guideData.sources.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-agri-900">{s.title}</span> — {s.author}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
