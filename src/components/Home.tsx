import React, { useState } from 'react';
import {
  MessageSquare,
  BookOpen,
  FlaskConical,
  Bug,
  HelpCircle,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Layers,
  Leaf,
  Droplets,
  Microscope,
  FileCheck2
} from 'lucide-react';
import { Language } from '../types';

interface HomeProps {
  onNavigate: (tab: string, initialQuery?: string) => void;
  language: Language;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, language }) => {
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('chat', quickSearch.trim());
    }
  };

  const recentQuestions = [
    {
      q: 'How to prepare vermicompost at home using cow dung and Eisenia fetida?',
      q_te: 'ఆవు పేడతో ఇంట్లోనే వానపాముల ఎరువు (వర్మీకంపోస్ట్) ఎలా తయారు చేయాలి?',
      q_hi: 'देशी गाय के गोबर से केंचुआ खाद (वर्मीकम्पोस्ट) कैसे तैयार करें?',
      tag: 'Vermicomposting',
      source: 'ICAR-CRIDA'
    },
    {
      q: 'Organic pest management for pink bollworm in cotton crop?',
      q_te: 'పత్తిలో గులాబీ రంగు పురుగు నివారణకు సేంద్రీయ పద్ధతులు ఏమిటి?',
      q_hi: 'कपास में गुलाबी सुंडी (Pink Bollworm) का जैविक नियंत्रण कैसे करें?',
      tag: 'Cotton IPM',
      source: 'ICAR-CICR'
    },
    {
      q: 'How to make 200 liters of Jeevamrutham for 1 acre field application?',
      q_te: '1 ఎకరా పొలం కోసం 200 లీటర్ల జీవామృతం తయారీ విధానం ఏమిటి?',
      q_hi: '1 एकड़ खेत के लिए 200 लीटर जीवामृत बनाने की विधि क्या है?',
      tag: 'Bio-enhancer',
      source: 'NCOF Ghaziabad'
    },
    {
      q: 'How to manage early blight and fungal disease in organic tomato?',
      q_te: 'సేంద్రీయ టమాటా సాగులో ఆకుమచ్చ మరియు బూజు తెగుళ్ల నివారణ ఎలా?',
      q_hi: 'टमाटर में अगेती झुलसा और फफूंद जनित रोगों का प्राकृतिक उपचार क्या है?',
      tag: 'Tomato Care',
      source: 'ICAR-IIHR'
    },
    {
      q: 'SRI method and green manuring with Dhaincha for organic paddy?',
      q_te: 'వరిలో శ్రీ పద్ధతి మరియు జనుము పచ్చిరొట్ట ఎరువు వాడకం వివరాలు?',
      q_hi: 'धान में श्री विधि और ढैंचा हरी खाद का उपयोग कैसे करें?',
      tag: 'Organic Paddy',
      source: 'ICAR-IIRR'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest-light to-agri-800 text-white p-6 sm:p-12 shadow-xl border border-agri-700/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-agri-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cream-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cream-100 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cream-200" />
            <span>
              {language === 'te'
                ? 'ధృవీకరించబడిన పరిశోధనా పత్రాలపై ఆధారపడిన AI'
                : language === 'hi'
                ? 'सत्यापित कृषि शोध पर आधारित RAG AI'
                : 'Retrieval-Augmented Generation Grounded in Verified ICAR & University Data'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
            {language === 'te' ? (
              <>భారతీయ రైతుల కోసం <br /><span className="text-agri-300">సేంద్రీయ వ్యవసాయ AI మార్గదర్శి</span></>
            ) : language === 'hi' ? (
              <>भारतीय किसानों के लिए <br /><span className="text-agri-300">प्रामाणिक जैविक कृषि सलाहकार</span></>
            ) : (
              <>Organic Farming Guide <br /><span className="text-agri-300">RAG-Powered AI Assistant</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-agri-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
            {language === 'te'
              ? 'ఐసీఏఆర్ (ICAR), వ్యవసాయ విశ్వవిద్యాలయాలు మరియు కేవీకే (KVK) పరిశోధనల ఆధారంగా జీవామృతం, పంచగవ్య, వర్మీకంపోస్ట్ మరియు సహజ పురుగు నివారణ పద్ధతులను తెలుసుకోండి.'
              : language === 'hi'
              ? 'ICAR, कृषि विश्वविद्यालयों व KVK के प्रामाणिक शोध पर आधारित जीवामृत, पंचगव्य, वर्मीकम्पोस्ट और जैविक कीट नियंत्रण के सटीक उपाय प्राप्त करें।'
              : 'Empowering Indian farmers, agronomists, and beginners with scientifically validated organic protocols, crop schedules, and biological pest controls without synthetic hallucinations.'}
          </p>

          {/* Quick RAG Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder={
                  language === 'te'
                    ? 'ఉదా: వర్మీకంపోస్ట్ తయారీ ఎలా? పత్తిలో గులాబీ పురుగు నివారణ...'
                    : language === 'hi'
                    ? 'उदा: जीवामृत कैसे बनाएं? टमाटर में फफूंद का जैविक उपचार...'
                    : 'Ask anything: e.g. How to prepare Jeevamrutham? Organic pest control for cotton...'
                }
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-agri-400"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{language === 'te' ? 'శోధించండి' : language === 'hi' ? 'पूछें' : 'Ask AI'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Fast Suggestion Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-agri-100/80">
            <span className="font-semibold text-white/90">{language === 'te' ? 'సూచనలు:' : language === 'hi' ? 'सुझाव:' : 'Quick tags:'}</span>
            {['Vermicompost', 'Jeevamrutham', 'Cotton IPM', 'Panchagavya', 'Tomato Blight', 'Dhaincha'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('chat', `How to prepare and use ${tag} in organic farming?`)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main 5 Dashboard Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-forest tracking-tight">
              {language === 'te' ? 'ప్రధాన విభాగాలు' : language === 'hi' ? 'मुख्य कृषि सेवाएँ' : 'Core Agriculture Hubs'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'te'
                ? 'సేంద్రీయ వ్యవసాయం కోసం ప్రత్యేక సాధనాలు'
                : language === 'hi'
                ? 'सत्यापित प्राकृतिक खेती के लिए उपयोगी उपकरण'
                : 'Scientifically curated modules for every stage of your farming cycle'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Ask AI Farming Assistant */}
          <div
            onClick={() => onNavigate('chat')}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-agri-500 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center group-hover:bg-agri-700 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-agri-700 transition-colors">
                  {language === 'te' ? 'AI వ్యవసాయ సలహాదారు' : language === 'hi' ? 'AI किसान सहायक' : 'Ask AI Farming Assistant'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {language === 'te'
                    ? 'తెలుగు, హిందీ మరియు ఇంగ్లీష్ భాషలలో అధికారిక నాలెడ్జ్ బేస్ ఆధారంగా ప్రశ్నలు అడగండి.'
                    : language === 'hi'
                    ? 'सत्यापित कृषि शोध पत्रों पर आधारित चैट। वॉइस सपोर्ट और स्रोत संदर्भ के साथ।'
                    : 'Interactive conversational RAG assistant with multilingual voice input and source citations.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-agri-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'te' ? 'చాట్ ప్రారంభించండి' : language === 'hi' ? 'बातचीत शुरू करें' : 'Start Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Explore Crop Guides */}
          <div
            onClick={() => onNavigate('crops')}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-agri-500 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                  {language === 'te' ? 'పంటల సాగు మార్గదర్శి' : language === 'hi' ? 'फसल-वार मार्गदर्शिका' : 'Explore Crop Guides'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {language === 'te'
                    ? 'వరి, పత్తి, టమాటా, గోధుమ తదితర పంటలకు 9 దశల సమగ్ర సేంద్రీయ ప్రణాళిక.'
                    : language === 'hi'
                    ? 'भूमि तैयारी से लेकर कटाई तक 9 चरणों की संपूर्ण वैज्ञानिक जैविक कार्ययोजना।'
                    : '9-stage organic package of practices tailored by Indian state, soil type, and season.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-emerald-700 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'te' ? 'పంటల గైడ్ చూడండి' : language === 'hi' ? 'फसलें चुनें' : 'Browse Crop Schedules'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Organic Fertilizers */}
          <div
            onClick={() => onNavigate('fertilizers')}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-agri-500 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-lime-50 text-lime-800 flex items-center justify-center group-hover:bg-lime-800 group-hover:text-white transition-colors">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-lime-800 transition-colors">
                  {language === 'te' ? 'సేంద్రీయ ఎరువుల తయారీ' : language === 'hi' ? 'जैविक खाद निर्माण' : 'Organic Fertilizers'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {language === 'te'
                    ? 'జీవామృతం, పంచగవ్య, వర్మీకంపోస్ట్, పచ్చిరొట్ట మరియు బయోఫెర్టిలైజర్స్ తయారీ మరియు వాడే మోతాదు.'
                    : language === 'hi'
                    ? 'जीवामृत, पंचगव्य, केंचुआ खाद और नीम अस्त्र बनाने की वैज्ञानिक विधि व सावधानियां।'
                    : 'Standardized NCOF & TNAU recipes, dosage per acre, application schedules, and precautions.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-lime-800 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'te' ? 'విధానాలు చూడండి' : language === 'hi' ? 'तरीका देखें' : 'View Input Recipes'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Pest & Disease Management */}
          <div
            onClick={() => onNavigate('pests')}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-agri-500 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-800 transition-colors">
                  {language === 'te' ? 'తెగుళ్ల నివారణ & వ్యాధి నిర్ధారణ' : language === 'hi' ? 'कीट व रोग प्रबंधन' : 'Pest Management'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {language === 'te'
                    ? 'పురుగులు, బూజు తెగుళ్ల లక్షణాలు నమోదు చేసి జీవ నియంత్రణ సలహా పొందండి.'
                    : language === 'hi'
                    ? 'लक्षण व फोटो अपलोड कर प्राकृतिक कीट रोकथाम व जैविक उपचार प्राप्त करें।'
                    : 'Preventive biological traps, predator wasps, botanical extracts, and KVK advisory alerts.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-bold text-amber-800 gap-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'te' ? 'నిర్ధారించండి' : language === 'hi' ? 'जांच करें' : 'Diagnose Symptoms'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Card 5: Recently Asked Questions */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-forest">
                {language === 'te' ? 'రైతులు ఎక్కువగా అడిగే ప్రశ్నలు' : language === 'hi' ? 'हाल ही में पूछे गए प्रश्न' : 'Recently Asked Questions'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'te'
                  ? 'ధృవీకరించబడిన సమాధానాలను తక్షణమే పొందడానికి ఏదైనా ప్రశ్నను క్లిక్ చేయండి'
                  : language === 'hi'
                  ? 'सत्यापित उत्तर देखने के लिए किसी भी प्रश्न पर क्लिक करें'
                  : 'Click any verified benchmark inquiry to instantly load the grounded RAG response'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('chat')}
            className="text-xs font-bold text-agri-700 hover:text-forest flex items-center gap-1"
          >
            <span>{language === 'te' ? 'మరిన్ని చూడండి' : language === 'hi' ? 'सभी देखें' : 'View All in Chat'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentQuestions.map((item, idx) => {
            const queryText = language === 'te' ? item.q_te : language === 'hi' ? item.q_hi : item.q;
            return (
              <div
                key={idx}
                onClick={() => onNavigate('chat', queryText)}
                className="p-4 rounded-xl border border-slate-100 hover:border-agri-300 bg-slate-50/50 hover:bg-agri-50/40 transition-all cursor-pointer flex items-start justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-100 text-agri-800">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-agri-600" />
                      {item.source}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-agri-800 transition-colors">
                    {queryText}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-agri-700 group-hover:translate-x-1 transition-all mt-1 shrink-0 ml-3" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Verified Knowledge Sources Banner */}
      <section className="bg-gradient-to-r from-agri-50 via-cream-50 to-agri-50 p-6 sm:p-8 rounded-3xl border border-agri-200/80">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Strict Truth Grounding Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-forest">
            Trusted Knowledge Sources Only — Zero Toxic Chemical Hallucinations
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Unlike generic AI chatbots that risk inventing unsafe pesticide dosages or outdated guidelines,
            our RAG pipeline retrieves and quotes verified publications from official agricultural authorities:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3">
            {[
              { name: 'ICAR', desc: 'Indian Council of Agricultural Research' },
              { name: 'NCOF', desc: 'National Centre for Organic Farming' },
              { name: 'KVK', desc: 'Krishi Vigyan Kendras' },
              { name: 'CRIDA', desc: 'Dryland Agriculture Research' },
              { name: 'CICR', desc: 'Central Institute for Cotton' },
              { name: 'TNAU & PJTSAU', desc: 'State Agricultural Universities' }
            ].map((inst, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-agri-100 shadow-2xs text-center">
                <div className="font-extrabold text-xs text-agri-800">{inst.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{inst.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
