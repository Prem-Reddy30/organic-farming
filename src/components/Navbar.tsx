import React from 'react';
import {
  Sprout,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Bug,
  Database,
  Globe,
  User,
  LogOut
} from 'lucide-react';
import { Language, UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  user,
  onOpenAuth,
  onLogout
}) => {
  const getNavLabel = (key: string) => {
    if (language === 'te') {
      switch (key) {
        case 'home': return 'హోమ్';
        case 'chat': return 'AI సలహాదారు';
        case 'crops': return 'పంటల గైడ్';
        case 'fertilizers': return 'సేంద్రీయ ఎరువులు';
        case 'pests': return 'తెగుళ్ల నివారణ';
        case 'sources': return 'నాలెడ్జ్ సోర్సెస్';
        default: return key;
      }
    } else if (language === 'hi') {
      switch (key) {
        case 'home': return 'होम';
        case 'chat': return 'AI किसान चैट';
        case 'crops': return 'फसल मार्गदर्शिका';
        case 'fertilizers': return 'जैविक खाद';
        case 'pests': return 'कीट नियंत्रण';
        case 'sources': return 'सत्यापित स्रोत';
        default: return key;
      }
    }
    switch (key) {
      case 'home': return 'Home';
      case 'chat': return 'AI Chat';
      case 'crops': return 'Crop Guides';
      case 'fertilizers': return 'Fertilizers';
      case 'pests': return 'Pest Control';
      case 'sources': return 'Sources';
      default: return key;
    }
  };

  const navItems = [
    { id: 'home', icon: Sprout, label: getNavLabel('home') },
    { id: 'chat', icon: MessageSquare, label: getNavLabel('chat') },
    { id: 'crops', icon: BookOpen, label: getNavLabel('crops') },
    { id: 'fertilizers', icon: FlaskConical, label: getNavLabel('fertilizers') },
    { id: 'pests', icon: Bug, label: getNavLabel('pests') },
    { id: 'sources', icon: Database, label: getNavLabel('sources') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-agri-100/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2.5 sm:py-3 gap-3">
          {/* Logo & Branding */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-600 to-forest flex items-center justify-center text-white shadow-md shadow-agri-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-forest">
                  KisanJaivik <span className="text-agri-600">AI</span>
                </span>
                <span className="hidden xs:inline-block text-[10px] font-bold uppercase tracking-wider bg-agri-100 text-agri-800 px-2 py-0.5 rounded-full border border-agri-200">
                  RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {language === 'te' ? 'భారతీయ సేంద్రీయ వ్యవసాయ గైడ్' : language === 'hi' ? 'भारतीय जैविक कृषि सलाहकार' : 'Verified Indian Organic Farming Guide'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-agri-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-agri-800 hover:bg-agri-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-agri-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher & Profile Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Pill Switcher */}
            <div className="flex items-center bg-agri-50 p-1 rounded-xl border border-agri-200/80">
              <Globe className="w-3.5 h-3.5 text-agri-700 ml-1.5 mr-1 hidden sm:block" />
              {(['en', 'te', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang
                      ? 'bg-white text-forest shadow-xs'
                      : 'text-slate-600 hover:text-forest'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिन्दी'}
                </button>
              ))}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-agri-400 hover:bg-agri-50/50 px-3 py-2 rounded-xl transition-all shadow-2xs"
                title="Edit profile & preferences"
              >
                <User className="w-3.5 h-3.5 text-agri-600" />
                <span className="hidden sm:inline">
                  {user ? user.name.split(' ')[0] : (language === 'te' ? 'లాగిన్' : language === 'hi' ? 'लॉगिन' : 'Login')}
                </span>
              </button>

              {user && (
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
                  title={language === 'te' ? 'లాగౌట్' : language === 'hi' ? 'लॉगआउट' : 'Log Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Sub-Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto scrollbar-none py-2.5 px-4 border-t border-slate-100 gap-1.5 bg-slate-50/60">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isActive
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
