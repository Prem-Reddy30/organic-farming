import React, { useState } from 'react';
import { X, User, ShieldCheck, Sprout, MapPin, Globe } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveUser: (user: UserProfile) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  language
}) => {
  const [name, setName] = useState(currentUser?.name || 'Ramesh Reddy');
  const [role, setRole] = useState<'farmer' | 'student' | 'expert' | 'admin'>(currentUser?.role || 'farmer');
  const [userLang, setUserLang] = useState<Language>(currentUser?.preferredLanguage || language);
  const [state, setState] = useState(currentUser?.state || 'Telangana');
  const [primaryCrop, setPrimaryCrop] = useState(currentUser?.primaryCrop || 'Paddy / Rice');
  const [farmSize, setFarmSize] = useState<number>(currentUser?.farmSizeAcres || 3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      name,
      role,
      preferredLanguage: userLang,
      state,
      primaryCrop,
      farmSizeAcres: farmSize
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-agri-100 text-agri-800 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-forest">
              {language === 'te' ? 'రైతు ప్రొఫైల్ / లాగిన్' : language === 'hi' ? 'किसान प्रोफाइल / लॉगिन' : 'Farmer Profile & Login'}
            </h2>
            <p className="text-xs text-slate-500">
              Personalize recommendations for your region and crops
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1">Full Name / Farmer Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="farmer">Farmer (రైతు / किसान)</option>
                <option value="student">Student / Researcher</option>
                <option value="expert">Agronomist / Expert</option>
                <option value="admin">Admin / Extension</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Preferred Language</label>
              <select
                value={userLang}
                onChange={(e) => setUserLang(e.target.value as Language)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Indian State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
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
                value={primaryCrop}
                onChange={(e) => setPrimaryCrop(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
              >
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato / Vegetables</option>
                <option value="Wheat">Wheat</option>
                <option value="Chickpea">Chickpea / Pulses</option>
                <option value="Chilli">Chilli</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Farm Land Size (Acres)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={farmSize}
              onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-agri-700 hover:bg-forest text-white text-xs font-bold transition-all shadow-md mt-2"
          >
            Save Profile & Continue
          </button>
        </form>
      </div>
    </div>
  );
};
