import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Settings, X, Check } from 'lucide-react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        // Initialize analytics if consented
        if (savedPreferences.analytics) {
          initializeAnalytics();
        }
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const initializeAnalytics = () => {
    // Google Analytics initialization would go here
    // Only runs if user has consented
    console.log('Analytics initialized with consent');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    initializeAnalytics();
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie_consent', JSON.stringify(necessaryOnly));
    setPreferences(necessaryOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie_consent', JSON.stringify(savedPreferences));
    setShowBanner(false);
    setShowSettings(false);
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
      
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
          {!showSettings ? (
            // Main consent view
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    🍪 Cookie-Einstellungen / Cookie Settings
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                    Einige Cookies sind notwendig für den Betrieb der Website, während andere uns helfen, 
                    die Website zu verbessern und personalisierte Inhalte anzuzeigen.
                  </p>
                  <p className="text-zinc-500 text-xs mb-4">
                    We use cookies to provide you with the best experience on our website. Some cookies are 
                    necessary for the website to function, while others help us improve and personalize your experience.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Alle akzeptieren / Accept All
                    </button>
                    <button
                      onClick={handleAcceptNecessary}
                      className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      Nur notwendige / Necessary Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center gap-2 border border-zinc-600 hover:border-zinc-500 text-zinc-300 px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Einstellungen / Settings
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-zinc-500">
                    <Link to="/privacy-policy" className="text-purple-400 hover:underline">Datenschutzerklärung / Privacy Policy</Link>
                    {' • '}
                    <Link to="/impressum" className="text-purple-400 hover:underline">Impressum</Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Detailed settings view
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Cookie-Einstellungen
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Notwendige Cookies</h4>
                        <p className="text-xs text-zinc-500">Necessary Cookies</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
                      Immer aktiv / Always Active
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich (z.B. Anmeldung, Warenkorb, Sicherheit).
                    Sie können nicht deaktiviert werden.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400">📊</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Analyse-Cookies</h4>
                        <p className="text-xs text-zinc-500">Analytics Cookies (Google Analytics)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`w-14 h-7 rounded-full transition-colors ${preferences.analytics ? 'bg-purple-500' : 'bg-zinc-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.analytics ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Helfen uns zu verstehen, wie Besucher unsere Website nutzen. Wir verwenden Google Analytics 
                    mit anonymisierter IP-Adresse (Anonymize IP).
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-pink-400">📢</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Marketing-Cookies</h4>
                        <p className="text-xs text-zinc-500">Marketing Cookies (Facebook Pixel)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`w-14 h-7 rounded-full transition-colors ${preferences.marketing ? 'bg-purple-500' : 'bg-zinc-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.marketing ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Werden verwendet, um Werbung relevanter für Sie zu gestalten. Dazu gehört Facebook Pixel für 
                    personalisierte Werbung.
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-orange-400">⚙️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Präferenz-Cookies</h4>
                        <p className="text-xs text-zinc-500">Preference Cookies</p>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePreference('preferences')}
                      className={`w-14 h-7 rounded-full transition-colors ${preferences.preferences ? 'bg-purple-500' : 'bg-zinc-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${preferences.preferences ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Ermöglichen es der Website, sich an Ihre Einstellungen zu erinnern (z.B. Sprache, Region).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Einstellungen speichern / Save Settings
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Alle akzeptieren / Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CookieConsentBanner;
