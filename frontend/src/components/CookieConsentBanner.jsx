import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings, X, Check } from 'lucide-react';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        if (savedPreferences.analytics) initializeAnalytics();
      } catch (e) { setShowBanner(true); }
    }
  }, []);

  const initializeAnalytics = () => { console.log('Analytics initialized with consent'); };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true, preferences: true, timestamp: new Date().toISOString() };
    localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    initializeAnalytics();
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = { necessary: true, analytics: false, marketing: false, preferences: false, timestamp: new Date().toISOString() };
    localStorage.setItem('cookie_consent', JSON.stringify(necessaryOnly));
    setPreferences(necessaryOnly);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const savedPreferences = { ...preferences, timestamp: new Date().toISOString() };
    localStorage.setItem('cookie_consent', JSON.stringify(savedPreferences));
    setShowBanner(false);
    setShowSettings(false);
    if (preferences.analytics) initializeAnalytics();
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[9998]" />
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4" data-testid="cookie-banner">
        <div className="max-w-4xl mx-auto bg-[#15151e] border border-white/10 overflow-hidden shadow-2xl">
          {!showSettings ? (
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#e10600]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                    Cookie Settings
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-2">
                    Wir verwenden Cookies, um Ihnen die bestmogliche Erfahrung auf unserer Website zu bieten.
                    Einige Cookies sind notwendig fur den Betrieb der Website, wahrend andere uns helfen,
                    die Website zu verbessern und personalisierte Inhalte anzuzeigen.
                  </p>
                  <p className="text-slate-500 text-xs mb-4">
                    We use cookies to provide you with the best experience on our website. Some cookies are
                    necessary for the website to function, while others help us improve and personalize your experience.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex items-center gap-2 bg-[#e10600] hover:bg-red-700 text-white px-6 py-3 font-black text-sm uppercase tracking-wider transition-colors duration-150"
                      data-testid="cookie-accept-all"
                    >
                      <Check className="w-4 h-4" />
                      Alle akzeptieren / Accept All
                    </button>
                    <button
                      onClick={handleAcceptNecessary}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-150"
                      data-testid="cookie-necessary-only"
                    >
                      Nur notwendige / Necessary Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-slate-400 hover:text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-150"
                      data-testid="cookie-settings"
                    >
                      <Settings className="w-4 h-4" />
                      Einstellungen / Settings
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-slate-600">
                    <Link to="/privacy-policy" className="text-[#e10600] hover:underline">Datenschutzerklaerung / Privacy Policy</Link>
                    {' \u2022 '}
                    <Link to="/impressum" className="text-[#e10600] hover:underline">Impressum</Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                  <Settings className="w-5 h-5 text-[#e10600]" />
                  Cookie-Einstellungen
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white transition-colors duration-150">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { key: 'necessary', title: 'Notwendige Cookies', sub: 'Necessary Cookies', desc: 'Diese Cookies sind fur die Grundfunktionen der Website erforderlich.', icon: Shield, color: '#15803d', always: true },
                  { key: 'analytics', title: 'Analyse-Cookies', sub: 'Analytics Cookies (Google Analytics)', desc: 'Helfen uns zu verstehen, wie Besucher unsere Website nutzen.', icon: null, color: '#3b82f6', always: false },
                  { key: 'marketing', title: 'Marketing-Cookies', sub: 'Marketing Cookies (Facebook Pixel)', desc: 'Werden verwendet, um Werbung relevanter fur Sie zu gestalten.', icon: null, color: '#e10600', always: false },
                  { key: 'preferences', title: 'Praeferenz-Cookies', sub: 'Preference Cookies', desc: 'Ermoglichen es der Website, sich an Ihre Einstellungen zu erinnern.', icon: null, color: '#f59e0b', always: false },
                ].map((item) => (
                  <div key={item.key} className="bg-white/5 border border-white/8 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                          {item.icon ? <item.icon className="w-5 h-5" style={{ color: item.color }} /> : <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.color }} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-[10px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                      {item.always ? (
                        <div className="text-[10px] font-black text-[#15803d] uppercase tracking-wider bg-[#15803d]/10 px-3 py-1">Immer aktiv</div>
                      ) : (
                        <button
                          onClick={() => togglePreference(item.key)}
                          className={`w-12 h-6 flex items-center transition-colors duration-150 ${preferences[item.key] ? 'bg-[#e10600]' : 'bg-white/15'}`}
                        >
                          <div className={`w-5 h-5 bg-white transition-transform duration-150 ${preferences[item.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-[#e10600] hover:bg-red-700 text-white px-6 py-3 font-black text-sm uppercase tracking-wider transition-colors duration-150"
                  data-testid="cookie-save-settings"
                >
                  Einstellungen speichern / Save Settings
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-150"
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
