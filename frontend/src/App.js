import { useEffect, useState, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "./i18n/LanguageProvider";

// Pages
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AuthCallback from "./pages/AuthCallback";
import PriceAlertsPage from "./pages/PriceAlertsPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import PaymentInfoPage from "./pages/PaymentInfoPage";
import BuyerProtectionPage from "./pages/BuyerProtectionPage";
import ImpressumPage from "./pages/ImpressumPage";
import BlogPage from "./pages/BlogPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import ReviewsPage from "./pages/ReviewsPage";
import FAQPage from "./pages/FAQPage";
import WorldCupPage from "./pages/WorldCupPage";
import WorldCupRafflePage from "./pages/WorldCupRafflePage";
import TheWeekndPage from "./pages/TheWeekndPage";
import ChampionsLeaguePage from "./pages/ChampionsLeaguePage";
import BrunoMarsPage from "./pages/BrunoMarsPage";
import GunsNRosesPage from "./pages/GunsNRosesPage";
import BadBunnyPage from "./pages/BadBunnyPage";
import F1TicketsPage from "./pages/F1TicketsPage";
import MonacoGPPage from "./pages/MonacoGPPage";
import SilverstoneGPPage from "./pages/SilverstoneGPPage";
import MonzaGPPage from "./pages/MonzaGPPage";
import SingaporeGPPage from "./pages/SingaporeGPPage";
import LasVegasGPPage from "./pages/LasVegasGPPage";
import AbuDhabiGPPage from "./pages/AbuDhabiGPPage";
import SpaGPPage from "./pages/SpaGPPage";
import ZandvoortGPPage from "./pages/ZandvoortGPPage";
import MiamiGPPage from "./pages/MiamiGPPage";
import JapanGPPage from "./pages/JapanGPPage";
import AustraliaGPPage from "./pages/AustraliaGPPage";
import BahrainGPPage from "./pages/BahrainGPPage";
import SaudiGPPage from "./pages/SaudiGPPage";
import SpainGPPage from "./pages/SpainGPPage";
import HungaryGPPage from "./pages/HungaryGPPage";
import AustriaGPPage from "./pages/AustriaGPPage";
import HowToBuyF1TicketsPage from "./pages/HowToBuyF1TicketsPage";
import BestF1RacesEuropePage from "./pages/BestF1RacesEuropePage";
import F1TicketPricesGuidePage from "./pages/F1TicketPricesGuidePage";
import AIChatWidget from "./components/AIChatWidget";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { ExitIntentPopup, PushNotificationBanner, SocialProofNotification, FloatingCTA } from "./components/MarketingTools";
import { MarketingBotButton } from "./components/AIMarketingBot";
import ScrollToTop from "./components/common/ScrollToTop";
import { TrustBar } from "./components/TrustElements";

// MotoGP Pages
import MotoGPTicketsPage from "./pages/MotoGPTicketsPage";
import MotoGPSchedulePage from "./pages/MotoGPSchedulePage";
import MotoGPMugelloPage from "./pages/MotoGPMugelloPage";
import IsleOfManTTPage from "./pages/IsleOfManTTPage";

// F1 Schedule Page
import F1SchedulePage from "./pages/F1SchedulePage";

// SEO Dashboard
import SEODashboardPage from "./pages/SEODashboardPage";
import SEOBotDashboard from "./pages/SEOBotDashboard";
import FreeMarketingPage from "./pages/FreeMarketingPage";

// Programmatic SEO Pages
import CityTicketsPage from "./pages/CityTicketsPage";
import ComparisonPage from "./pages/ComparisonPage";
import PriceGuidePage from "./pages/PriceGuidePage";
import EventsThisWeekendPage from "./pages/EventsThisWeekendPage";
import MonthlyEventsPage from "./pages/MonthlyEventsPage";

// Marketing Dashboard
import MarketingDashboard from "./pages/MarketingDashboard";

// Premium Concert Pages
import Maroon5Page from "./pages/Maroon5Page";
import JohnLegendPage from "./pages/JohnLegendPage";
import HarryStylesPage from "./pages/HarryStylesPage";
import MetallicaPage from "./pages/MetallicaPage";
import ACLFestivalPage from "./pages/ACLFestivalPage";

// Protection & Guarantee Pages
import FanProtectPage from "./pages/FanProtectPage";

// Landing Pages for Google Ads
import WorldCupLandingPage from "./pages/WorldCupLandingPage";
import F1LandingPage from "./pages/F1LandingPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";

// High-Converting Landing Pages
import MonacoGPTicketsPage from "./pages/MonacoGPTicketsPage";
import ElClasicoTicketsPage from "./pages/ElClasicoTicketsPage";
import ChampionsLeagueTicketsPage from "./pages/ChampionsLeagueTicketsPage";

// Dynamic SEO Pages (catch-all)
import DynamicSEOPage from "./pages/DynamicSEOPage";

// Sell Tickets
import SellTicketsPage from "./pages/SellTicketsPage";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

// Configure axios to include auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('session_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
        headers
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('session_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/auth/callback';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('session_token');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem('session_token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id (OAuth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <TrustBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/payment-info" element={<PaymentInfoPage />} />
        <Route path="/buyer-protection" element={<BuyerProtectionPage />} />
        <Route path="/fan-protect" element={<FanProtectPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:articleId" element={<BlogArticlePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        
        {/* Landing Pages for Google Ads */}
        <Route path="/world-cup-2026-tickets" element={<WorldCupLandingPage />} />
        <Route path="/f1-tickets-2026" element={<F1LandingPage />} />
        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
        
        <Route path="/world-cup-2026" element={<WorldCupPage />} />
        <Route path="/world-cup-raffle" element={<WorldCupRafflePage />} />
        <Route path="/the-weeknd-tour-2026" element={<TheWeekndPage />} />
        <Route path="/champions-league-tickets" element={<ChampionsLeaguePage />} />
        <Route path="/bruno-mars-tour-2026" element={<BrunoMarsPage />} />
        <Route path="/guns-n-roses-tour-2026" element={<GunsNRosesPage />} />
        <Route path="/bad-bunny-london-2026" element={<BadBunnyPage />} />
        <Route path="/f1-tickets" element={<F1TicketsPage />} />
        <Route path="/f1-monaco-grand-prix-tickets" element={<MonacoGPPage />} />
        <Route path="/f1-british-grand-prix-silverstone-tickets" element={<SilverstoneGPPage />} />
        <Route path="/f1-italian-grand-prix-monza-tickets" element={<MonzaGPPage />} />
        <Route path="/f1-singapore-grand-prix-tickets" element={<SingaporeGPPage />} />
        <Route path="/f1-las-vegas-grand-prix-tickets" element={<LasVegasGPPage />} />
        <Route path="/f1-abu-dhabi-grand-prix-tickets" element={<AbuDhabiGPPage />} />
        <Route path="/f1-belgian-grand-prix-spa-tickets" element={<SpaGPPage />} />
        <Route path="/f1-dutch-grand-prix-zandvoort-tickets" element={<ZandvoortGPPage />} />
        <Route path="/f1-miami-grand-prix-tickets" element={<MiamiGPPage />} />
        <Route path="/f1-japanese-grand-prix-suzuka-tickets" element={<JapanGPPage />} />
        <Route path="/f1-australian-grand-prix-melbourne-tickets" element={<AustraliaGPPage />} />
        <Route path="/f1-bahrain-grand-prix-tickets" element={<BahrainGPPage />} />
        <Route path="/f1-saudi-arabian-grand-prix-jeddah-tickets" element={<SaudiGPPage />} />
        <Route path="/f1-spanish-grand-prix-barcelona-tickets" element={<SpainGPPage />} />
        <Route path="/f1-hungarian-grand-prix-budapest-tickets" element={<HungaryGPPage />} />
        <Route path="/f1-austrian-grand-prix-red-bull-ring-tickets" element={<AustriaGPPage />} />
        <Route path="/how-to-buy-f1-tickets" element={<HowToBuyF1TicketsPage />} />
        <Route path="/best-f1-races-europe" element={<BestF1RacesEuropePage />} />
        <Route path="/f1-ticket-prices-guide" element={<F1TicketPricesGuidePage />} />
        <Route path="/f1-2026-schedule" element={<F1SchedulePage />} />
        
        {/* MotoGP Routes */}
        <Route path="/motogp-tickets" element={<MotoGPTicketsPage />} />
        <Route path="/motogp-2026-schedule" element={<MotoGPSchedulePage />} />
        <Route path="/motogp-mugello-tickets" element={<MotoGPMugelloPage />} />
        
        {/* Isle of Man TT */}
        <Route path="/isle-of-man-tt-tickets" element={<IsleOfManTTPage />} />
        
        <Route path="/order/success" element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/my-tickets" element={
          <ProtectedRoute>
            <MyTicketsPage />
          </ProtectedRoute>
        } />
        <Route path="/seller" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/owner" element={
          <ProtectedRoute requiredRole="admin">
            <OwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <PriceAlertsPage />
          </ProtectedRoute>
        } />
        
        {/* SEO Dashboard */}
        <Route path="/seo-dashboard" element={<SEODashboardPage />} />
        <Route path="/seo-bot" element={<SEOBotDashboard />} />
        <Route path="/free-marketing" element={<FreeMarketingPage />} />
        
        {/* Marketing Dashboard */}
        <Route path="/marketing" element={<MarketingDashboard />} />
        
        {/* Premium Concert Pages */}
        <Route path="/maroon-5-tickets" element={<Maroon5Page />} />
        <Route path="/john-legend-abu-dhabi-tickets" element={<JohnLegendPage />} />
        <Route path="/harry-styles-tickets" element={<HarryStylesPage />} />
        <Route path="/metallica-sphere-las-vegas-tickets" element={<MetallicaPage />} />
        <Route path="/acl-festival-2026-tickets" element={<ACLFestivalPage />} />
        
        {/* High-Converting Landing Pages - F1 & Football */}
        <Route path="/monaco-grand-prix-tickets" element={<MonacoGPTicketsPage />} />
        <Route path="/el-clasico-tickets" element={<ElClasicoTicketsPage />} />
        <Route path="/champions-league-tickets" element={<ChampionsLeagueTicketsPage />} />
        
        {/* Sell Tickets */}
        <Route path="/sell-tickets" element={<SellTicketsPage />} />
        
        {/* Dynamic SEO Pages - handles city pages, event pages, and all generated content */}
        <Route path="/:slug" element={<DynamicSEOPage />} />
        
        {/* Comparison Pages */}
        <Route path="/euromatchtickets-vs-stubhub" element={<ComparisonPage competitor="StubHub" />} />
        <Route path="/euromatchtickets-vs-viagogo" element={<ComparisonPage competitor="Viagogo" />} />
        <Route path="/euromatchtickets-vs-ticketmaster" element={<ComparisonPage competitor="Ticketmaster" />} />
        <Route path="/euromatchtickets-vs-seatgeek" element={<ComparisonPage competitor="SeatGeek" />} />
        
        {/* Price Guide Pages */}
        <Route path="/f1-ticket-prices-2026" element={<PriceGuidePage eventType="f1" />} />
        <Route path="/motogp-ticket-prices-2026" element={<PriceGuidePage eventType="motogp" />} />
        <Route path="/concert-ticket-prices-2026" element={<PriceGuidePage eventType="concert" />} />
        <Route path="/football-ticket-prices-2026" element={<PriceGuidePage eventType="football" />} />
        
        {/* Dynamic Time-Based Pages */}
        <Route path="/events-this-weekend" element={<EventsThisWeekendPage />} />
        <Route path="/events-january-2026" element={<MonthlyEventsPage month="January" />} />
        <Route path="/events-february-2026" element={<MonthlyEventsPage month="February" />} />
        <Route path="/events-march-2026" element={<MonthlyEventsPage month="March" />} />
        <Route path="/events-april-2026" element={<MonthlyEventsPage month="April" />} />
        <Route path="/events-may-2026" element={<MonthlyEventsPage month="May" />} />
        <Route path="/events-june-2026" element={<MonthlyEventsPage month="June" />} />
        <Route path="/events-july-2026" element={<MonthlyEventsPage month="July" />} />
        <Route path="/events-august-2026" element={<MonthlyEventsPage month="August" />} />
        <Route path="/events-september-2026" element={<MonthlyEventsPage month="September" />} />
        <Route path="/events-october-2026" element={<MonthlyEventsPage month="October" />} />
        <Route path="/events-november-2026" element={<MonthlyEventsPage month="November" />} />
        <Route path="/events-december-2026" element={<MonthlyEventsPage month="December" />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [exitShown, setExitShown] = useState(false);

  useEffect(() => {
    // Show push notification banner after 30 seconds
    const pushTimer = setTimeout(() => {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        setShowPushBanner(true);
      }
    }, 30000);

    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY < 10 && !exitShown && !localStorage.getItem('exitPopupShown')) {
        setShowExitPopup(true);
        setExitShown(true);
        localStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(pushTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [exitShown]);

  return (
    <BrowserRouter>
      <HelmetProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster 
              position="top-right" 
              theme="dark"
              toastOptions={{
                style: {
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fafafa'
                }
              }}
            />
            <AppRouter />
            <AIChatWidget />
            <CookieConsentBanner />
            
            {/* Marketing Tools */}
            <SocialProofNotification />
            {showExitPopup && (
              <ExitIntentPopup onClose={() => setShowExitPopup(false)} />
            )}
            {showPushBanner && (
              <PushNotificationBanner onClose={() => setShowPushBanner(false)} />
            )}
            <FloatingCTA onClick={() => window.location.href = '/events'} />
            <MarketingBotButton />
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
