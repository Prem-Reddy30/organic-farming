import React, { useState } from 'react';
import {
  Sprout,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Bug
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  language,
  setLanguage
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regState, setRegState] = useState('Telangana');
  const [regRole, setRegRole] = useState<'farmer' | 'student' | 'expert' | 'admin'>('farmer');
  const [regCrop, setRegCrop] = useState('Paddy / Rice');
  const [regAcreage, setRegAcreage] = useState<number>(3);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both your phone/email and password.');
      return;
    }

    // Authenticate and save user
    const loggedUser: UserProfile = {
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Farmer ' + loginIdentifier.slice(-4),
      role: 'farmer',
      preferredLanguage: language,
      state: 'Telangana',
      primaryCrop: 'Paddy / Rice',
      farmSizeAcres: 4
    };

    onLoginSuccess(loggedUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regContact.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    const newUser: UserProfile = {
      name: regName.trim(),
      role: regRole,
      preferredLanguage: language,
      state: regState,
      primaryCrop: regCrop,
      farmSizeAcres: regAcreage
    };

    onLoginSuccess(newUser);
  };

  const handleQuickDemoLogin = (profile: UserProfile) => {
    onLoginSuccess(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2fbf4] via-[#fcfdfa] to-cream-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Language Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-forest flex items-center justify-center text-white shadow-md shadow-agri-600/20">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-forest">
              KisanJaivik <span className="text-agri-600">AI</span>
            </span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-agri-100 text-agri-800 px-2 py-0.5 rounded-full border border-agri-200">
              RAG Pipeline
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-agri-200/80 shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-agri-700 ml-1.5 mr-1 hidden sm:block" />
          {(['en', 'te', 'hi'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === lang
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-forest'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : 'हिन्दी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Auth Container */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
        {/* Left Side: Value Proposition for Farmers */}
        <div className="lg:col-span-5 space-y-6 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agri-100 text-agri-900 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-agri-700" />
            <span>Authorized Farmer & Agronomist Access</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight leading-tight">
              {language === 'te'
                ? 'భారతీయ సేంద్రీయ వ్యవసాయ AI గైడ్‌లోకి ప్రవేశించండి'
                : language === 'hi'
                ? 'भारतीय जैविक कृषि सलाहकार पोर्टल में लॉगिन करें'
                : 'Sign In to Access Grounded Organic Farming Guides'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'te'
                ? 'సేంద్రీయ పద్ధతులు, జీవామృతం తయారీ, పంటల సాగు షెడ్యూల్ మరియు రసాయన రహిత పురుగు నివారణ సలహాల కోసం లాగిన్ అవ్వండి.'
                : language === 'hi'
                ? 'प्रामाणिक शोध, जीवामृत, पंचगव्य, कीट रोकथाम और 9-चरणीय फसल कार्ययोजना का उपयोग करने के लिए लॉगिन करें।'
                : 'Unlock personalized agronomic recommendations grounded in verified research from ICAR, NCOF, and Agricultural Universities.'}
            </p>
          </div>

          {/* Key Capabilities Badges */}
          <div className="space-y-3 pt-2">
            {[
              {
                icon: BookOpen,
                title: language === 'te' ? 'పంటల సాగు ప్రణాళిక' : language === 'hi' ? 'फसल कार्ययोजना' : '9-Stage Crop Packages',
                desc: 'Paddy, Cotton, Tomato, Wheat, Pulses & Chilli'
              },
              {
                icon: FlaskConical,
                title: language === 'te' ? 'సహజ ఎరువుల సూత్రాలు' : language === 'hi' ? 'जैविक खाद निर्माण' : 'Standardized Natural Inputs',
                desc: 'Jeevamrutham, Panchagavya, Vermicompost & Neem'
              },
              {
                icon: Bug,
                title: language === 'te' ? 'AI పంటల డాక్టర్' : language === 'hi' ? 'AI फसल डॉक्टर' : 'Pest & Disease Diagnosis',
                desc: 'Biological controls & Krishi Vigyan Kendra advisories'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">{f.title}</span>
                    <span className="text-slate-500 text-[11px]">{f.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Demo Accounts */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              1-Click Instant Demo Login:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin({
                  name: 'Ramesh Reddy',
                  role: 'farmer',
                  preferredLanguage: language === 'en' ? 'te' : language,
                  state: 'Telangana',
                  primaryCrop: 'Paddy / Rice',
                  farmSizeAcres: 4
                })}
                className="px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-bold border border-agri-200 transition-colors"
              >
                🌾 Ramesh (Telangana Farmer)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin({
                  name: 'Priya Sharma',
                  role: 'farmer',
                  preferredLanguage: language,
                  state: 'Karnataka',
                  primaryCrop: 'Tomato',
                  farmSizeAcres: 2.5
                })}
                className="px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-bold border border-agri-200 transition-colors"
              >
                🍅 Priya (Vegetable Grower)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin({
                  name: 'Dr. Ashok Varma',
                  role: 'expert',
                  preferredLanguage: language,
                  state: 'Andhra Pradesh',
                  primaryCrop: 'Cotton',
                  farmSizeAcres: 10
                })}
                className="px-3 py-1.5 rounded-xl bg-agri-50 hover:bg-agri-100 text-agri-800 text-xs font-bold border border-agri-200 transition-colors"
              >
                🔬 Dr. Varma (KVK Agronomist)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="lg:col-span-7 lg:pl-6 space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-white text-forest shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'te' ? 'లాగిన్ (Login)' : language === 'hi' ? 'लॉगिन करें (Sign In)' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'register'
                  ? 'bg-white text-forest shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'te' ? 'కొత్త ఖాతా (Register)' : language === 'hi' ? 'नया खाता बनाएं (Register)' : 'New Farmer Registration'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form: LOGIN */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or farmer@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-agri-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-agri-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-agri-700 focus:ring-agri-400" />
                  <span>Remember my profile</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin({
                    name: 'Guest Farmer',
                    role: 'farmer',
                    preferredLanguage: language,
                    state: 'Telangana',
                    primaryCrop: 'Paddy / Rice',
                    farmSizeAcres: 3
                  })}
                  className="font-bold text-agri-700 hover:underline"
                >
                  Quick Guest Access →
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-extrabold tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{language === 'te' ? 'లాగిన్ అవ్వండి' : language === 'hi' ? 'लॉगिन करें' : 'Login & Open Organic Assistant'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Form: REGISTER */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                  />
                </div>

                <div>
                  <label className="block mb-1">Mobile or Email</label>
                  <input
                    type="text"
                    required
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">State / Region</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
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

                <div>
                  <label className="block mb-1">Primary Crop</label>
                  <select
                    value={regCrop}
                    onChange={(e) => setRegCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                  >
                    <option value="Paddy / Rice">Paddy / Rice (వరి / धान)</option>
                    <option value="Cotton">Cotton (పత్తి / कपास)</option>
                    <option value="Tomato">Tomato (టమాటా / टमाटर)</option>
                    <option value="Wheat">Wheat (గోధుమ / गेहूँ)</option>
                    <option value="Chickpea">Chickpea / Pulses (శనగలు)</option>
                    <option value="Chilli">Chilli (మిరప / मिर्च)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">User Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                  >
                    <option value="farmer">Farmer (రైతు / किसान)</option>
                    <option value="student">Student / Researcher</option>
                    <option value="expert">Agronomist / Scientist</option>
                    <option value="admin">Extension Officer</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={regAcreage}
                    onChange={(e) => setRegAcreage(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-extrabold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>{language === 'te' ? 'ఖాతా సృష్టించండి' : language === 'hi' ? 'पंजीकरण पूरा करें' : 'Complete Registration & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
