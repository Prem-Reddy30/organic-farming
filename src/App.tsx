import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { ChatView } from './components/ChatView';
import { CropGuideView } from './components/CropGuideView';
import { FertilizerGuideView } from './components/FertilizerGuideView';
import { PestManagementView } from './components/PestManagementView';
import { KnowledgeSourcesView } from './components/KnowledgeSourcesView';
import { AdminDashboard } from './components/AdminDashboard';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { Language, UserProfile } from './types';
import { Sprout } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Check persisted user in localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kisan_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user?.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
  }, [user]);

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setLanguage(newUser.preferredLanguage || language);
    try {
      localStorage.setItem('kisan_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('kisan_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveUser = (updated: UserProfile) => {
    setUser(updated);
    setLanguage(updated.preferredLanguage);
    try {
      localStorage.setItem('kisan_user', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigate = (tab: string, initialQuery?: string) => {
    if (initialQuery) {
      setChatInitialQuery(initialQuery);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is NOT logged in, show Login Page gate
  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  // Once user is logged in, show full application
  return (
    <div className="min-h-screen bg-[#fcfdfa] text-slate-900 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setChatInitialQuery(undefined);
          setCurrentTab(tab);
        }}
        language={language}
        setLanguage={setLanguage}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'home' && (
          <Home onNavigate={handleNavigate} language={language} />
        )}

        {currentTab === 'chat' && (
          <ChatView initialQuery={chatInitialQuery} language={language} />
        )}

        {currentTab === 'crops' && (
          <CropGuideView language={language} />
        )}

        {currentTab === 'fertilizers' && (
          <FertilizerGuideView language={language} />
        )}

        {currentTab === 'pests' && (
          <PestManagementView language={language} />
        )}

        {currentTab === 'sources' && (
          <KnowledgeSourcesView language={language} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard language={language} />
        )}

        {currentTab === 'eval' && (
          <EvaluationDashboard language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-agri-700 text-white flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-forest text-sm">
              KisanJaivik <span className="text-agri-600">AI</span>
            </span>
            <span className="text-slate-400">| Grounded Organic Agriculture RAG Pipeline</span>
          </div>

          <div className="text-center sm:text-right space-y-0.5">
            <p>
              Knowledge groundings from ICAR, NCOF Ghaziabad, CRIDA, CICR, IIHR, and State Agricultural Universities.
            </p>
            <div className="flex items-center justify-center sm:justify-end gap-3 pt-1 text-[11px] text-slate-400">
              <span>For acute crop diseases, consult your local Krishi Vigyan Kendra (KVK).</span>
              <span>•</span>
              <button
                onClick={() => setCurrentTab('admin')}
                className="hover:text-forest underline transition-colors"
              >
                Staff Ingestion Hub
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth / Profile Edit Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveUser}
        language={language}
      />
    </div>
  );
}

export default App;
