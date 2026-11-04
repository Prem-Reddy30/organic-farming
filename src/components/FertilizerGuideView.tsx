import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Clock,
  Coins,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Droplet,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { FertilizerItem, Language } from '../types';
import { fetchFertilizers } from '../services/api';

interface FertilizerGuideViewProps {
  language: Language;
}

export const FertilizerGuideView: React.FC<FertilizerGuideViewProps> = ({ language }) => {
  const [fertilizers, setFertilizers] = useState<FertilizerItem[]>([]);
  const [selectedFert, setSelectedFert] = useState<FertilizerItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFertilizers()
      .then((data) => {
        setFertilizers(data);
        if (data.length > 0) {
          setSelectedFert(data[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Standardized Farm Input Protocols</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'te' ? 'సేంద్రీయ ఎరువుల మార్గదర్శి' : language === 'hi' ? 'जैविक खाद निर्माण निर्देशिका' : 'Organic Fertilizer & Bio-Inputs Guide'}
          </h1>
          <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
            {language === 'te'
              ? 'జీవామృతం, పంచగవ్య, వర్మీకంపోస్ట్ మరియు వేప ఉత్పత్తుల ఖచ్చితమైన తయారీ విధానం, మోతాదులు మరియు జాగ్రత్తలు.'
              : language === 'hi'
              ? 'NCOF व TNAU द्वारा प्रमाणित जीवामृत, पंचगव्य, केंचुआ खाद और नीम अस्त्र के सटीक घटक व सावधानियां।'
              : 'Scientifically validated preparation recipes, acre-wise dosages, microbial active periods, and application precautions.'}
          </p>
        </div>
      </div>

      {/* Main Layout: Left Selector Sidebar + Right Detailed Recipe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Verified Bio-Formulations
          </h2>

          <div className="space-y-2">
            {fertilizers.map((fert) => {
              const isSelected = selectedFert?.id === fert.id;
              return (
                <div
                  key={fert.id}
                  onClick={() => setSelectedFert(fert)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-agri-700 text-white border-agri-700 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200/90 hover:border-agri-400 hover:bg-agri-50/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm">
                      {fert.name}
                    </div>
                    <div className={`text-[11px] ${isSelected ? 'text-agri-100' : 'text-slate-400'}`}>
                      {fert.category}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          {selectedFert ? (
            <>
              {/* Heading & Meta Badges */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-agri-100 text-agri-800">
                    {selectedFert.type}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cream-100 text-earth-dark">
                    Ideal: {selectedFert.ideal_for}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-forest tracking-tight">
                  {selectedFert.name}
                </h2>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-agri-600" />
                      Preparation Time
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedFert.prep_time}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-agri-600" />
                      Cost per Acre
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedFert.cost_per_acre}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Info className="w-3 h-3 text-agri-600" />
                      Active Potency
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedFert.active_shelf_life}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                  <span className="font-bold">Biological & Nutrient Action: </span>
                  {selectedFert.npk_and_bio}
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-agri-600" />
                  Exact Required Ingredients (Per 1 Acre Dosage)
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFert.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by Step Preparation */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-forest" />
                  Step-by-Step Preparation Protocol
                </h3>
                <div className="space-y-2">
                  {selectedFert.preparation_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-agri-100 text-agri-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Method */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                <span className="font-bold text-earth-dark flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-agri-700" />
                  Application Method & Recommended Frequency:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedFert.application_method}</p>
              </div>

              {/* Precautions */}
              <div className="space-y-2">
                <h3 className="font-bold text-red-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Crucial Safety Precautions:
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {selectedFert.precautions.map((p, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source Citation */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  <strong>Published Source:</strong> {selectedFert.source}
                </span>
                <span className="font-bold text-agri-700">Verified NPOP / ICAR Compliant</span>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select an organic input from the left panel to inspect detailed preparation protocol.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
