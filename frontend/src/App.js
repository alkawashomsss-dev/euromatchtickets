import { useEffect, useState, createContext, useContext, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "./i18n/LanguageProvider";

// Core components (always loaded)
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ChatWidget from "./components/ChatWidget";
import ScrollToTop from "./components/common/ScrollToTop";
import { TrustBar } from "./components/TrustElements";
import { OrganizationStructuredData, WebsiteStructuredData, LocalBusinessStructuredData } from "./components/StructuredData";

// Auth must be eager (handles OAuth callback)
import AuthCallback from "./pages/AuthCallback";

// Lazy load ALL pages for rocket speed
const HomePage = lazy(() => import("./pages/HomePage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailsPage = lazy(() => import("./pages/EventDetailsPage"));
const MyTicketsPage = lazy(() => import("./pages/MyTicketsPage"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const PriceAlertsPage = lazy(() => import("./pages/PriceAlertsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const PaymentInfoPage = lazy(() => import("./pages/PaymentInfoPage"));
const BuyerProtectionPage = lazy(() => import("./pages/BuyerProtectionPage"));
const ImpressumPage = lazy(() => import("./pages/ImpressumPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogArticlePage = lazy(() => import("./pages/BlogArticlePage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const WorldCupPage = lazy(() => import("./pages/WorldCupPage"));
const WorldCup2026Page = lazy(() => import("./pages/WorldCup2026Page"));
const WorldCupRafflePage = lazy(() => import("./pages/WorldCupRafflePage"));
const TheWeekndPage = lazy(() => import("./pages/TheWeekndPage"));
const ChampionsLeaguePage = lazy(() => import("./pages/ChampionsLeaguePage"));
const BrunoMarsPage = lazy(() => import("./pages/BrunoMarsPage"));
const GunsNRosesPage = lazy(() => import("./pages/GunsNRosesPage"));
const BadBunnyPage = lazy(() => import("./pages/BadBunnyPage"));
const F1TicketsPage = lazy(() => import("./pages/F1TicketsPage"));
const MonacoGPPage = lazy(() => import("./pages/MonacoGPPage"));
const SilverstoneGPPage = lazy(() => import("./pages/SilverstoneGPPage"));
const MonzaGPPage = lazy(() => import("./pages/MonzaGPPage"));
const SingaporeGPPage = lazy(() => import("./pages/SingaporeGPPage"));
const LasVegasGPPage = lazy(() => import("./pages/LasVegasGPPage"));
const AbuDhabiGPPage = lazy(() => import("./pages/AbuDhabiGPPage"));
const SpaGPPage = lazy(() => import("./pages/SpaGPPage"));
const ZandvoortGPPage = lazy(() => import("./pages/ZandvoortGPPage"));
const MiamiGPPage = lazy(() => import("./pages/MiamiGPPage"));
const JapanGPPage = lazy(() => import("./pages/JapanGPPage"));
const AustraliaGPPage = lazy(() => import("./pages/AustraliaGPPage"));
const BahrainGPPage = lazy(() => import("./pages/BahrainGPPage"));
const SaudiGPPage = lazy(() => import("./pages/SaudiGPPage"));
const SpainGPPage = lazy(() => import("./pages/SpainGPPage"));
const HungaryGPPage = lazy(() => import("./pages/HungaryGPPage"));
const AustriaGPPage = lazy(() => import("./pages/AustriaGPPage"));
const HowToBuyF1TicketsPage = lazy(() => import("./pages/HowToBuyF1TicketsPage"));
const BestF1RacesEuropePage = lazy(() => import("./pages/BestF1RacesEuropePage"));
const F1TicketPricesGuidePage = lazy(() => import("./pages/F1TicketPricesGuidePage"));
const MotoGPTicketsPage = lazy(() => import("./pages/MotoGPTicketsPage"));
const MotoGPSchedulePage = lazy(() => import("./pages/MotoGPSchedulePage"));
const MotoGPMugelloPage = lazy(() => import("./pages/MotoGPMugelloPage"));
const IsleOfManTTPage = lazy(() => import("./pages/IsleOfManTTPage"));
const F1SchedulePage = lazy(() => import("./pages/F1SchedulePage"));
const SEODashboardPage = lazy(() => import("./pages/SEODashboardPage"));
const SEOBotDashboard = lazy(() => import("./pages/SEOBotDashboard"));
const FreeMarketingPage = lazy(() => import("./pages/FreeMarketingPage"));
const CityTicketsPage = lazy(() => import("./pages/CityTicketsPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const PriceGuidePage = lazy(() => import("./pages/PriceGuidePage"));
const EventsThisWeekendPage = lazy(() => import("./pages/EventsThisWeekendPage"));
const MonthlyEventsPage = lazy(() => import("./pages/MonthlyEventsPage"));
const MarketingDashboard = lazy(() => import("./pages/MarketingDashboard"));
const Maroon5Page = lazy(() => import("./pages/Maroon5Page"));
const JohnLegendPage = lazy(() => import("./pages/JohnLegendPage"));
const HarryStylesPage = lazy(() => import("./pages/HarryStylesPage"));
const MetallicaPage = lazy(() => import("./pages/MetallicaPage"));
const ACLFestivalPage = lazy(() => import("./pages/ACLFestivalPage"));
const FanProtectPage = lazy(() => import("./pages/FanProtectPage"));
const WorldCupLandingPage = lazy(() => import("./pages/WorldCupLandingPage"));
const F1LandingPage = lazy(() => import("./pages/F1LandingPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const MonacoGPTicketsPage = lazy(() => import("./pages/MonacoGPTicketsPage"));
const ElClasicoTicketsPage = lazy(() => import("./pages/ElClasicoTicketsPage"));
const ChampionsLeagueTicketsPage = lazy(() => import("./pages/ChampionsLeagueTicketsPage"));
const DynamicSEOPage = lazy(() => import("./pages/DynamicSEOPage"));
const SellTicketsPage = lazy(() => import("./pages/SellTicketsPage"));
const TicketPreviewPage = lazy(() => import("./pages/TicketPreviewPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const SuperBowlPage = lazy(() => import("./pages/SuperBowlPage"));
const WorldAthleticsPage = lazy(() => import("./pages/WorldAthleticsPage"));
const BayernRealMadridPage = lazy(() => import("./pages/BayernRealMadridPage"));
const BahrainWorldCupPage = lazy(() => import("./pages/BahrainWorldCupPage"));
const TaylorSwiftLondonPage = lazy(() => import("./pages/TaylorSwiftLondonPage"));
const TaylorSwiftPage = lazy(() => import("./pages/TaylorSwiftPage"));
const SpanishLandingPage = lazy(() => import("./pages/SpanishLandingPage"));
const GermanLandingPage = lazy(() => import("./pages/GermanLandingPage"));
const RealMadridHubPage = lazy(() => import("./pages/RealMadridHubPage"));
const BarcelonaHubPage = lazy(() => import("./pages/BarcelonaHubPage"));
const ManCityHubPage = lazy(() => import("./pages/ManCityHubPage"));
const FrenchLandingPage = lazy(() => import("./pages/FrenchLandingPage"));
const ItalianLandingPage = lazy(() => import("./pages/ItalianLandingPage"));
const LiverpoolHubPage = lazy(() => import("./pages/LiverpoolHubPage"));
const ArsenalHubPage = lazy(() => import("./pages/ArsenalHubPage"));
const BayernMunichHubPage = lazy(() => import("./pages/BayernMunichHubPage"));
const PSGHubPage = lazy(() => import("./pages/PSGHubPage"));
const JuventusHubPage = lazy(() => import("./pages/JuventusHubPage"));
const ColdplayPage = lazy(() => import("./pages/ColdplayPage"));
const MonzaBestSeatsPage = lazy(() => import("./pages/MonzaBestSeatsPage"));
const MonzaTicketPricesPage = lazy(() => import("./pages/MonzaTicketPricesPage"));
const HowToGetToMonzaPage = lazy(() => import("./pages/HowToGetToMonzaPage"));
const MonzaTravelTipsPage = lazy(() => import("./pages/MonzaTravelTipsPage"));
const UltimateF1GuidePage = lazy(() => import("./pages/UltimateF1GuidePage"));
const MonacoExperiencePage = lazy(() => import("./pages/MonacoExperiencePage"));
const BahrainNightRaceGuidePage = lazy(() => import("./pages/BahrainNightRaceGuidePage"));

// Marketing tools (lazy)
const AIChatWidget = lazy(() => import("./components/AIChatWidget"));
const ExitIntentPopup = lazy(() => import("./components/MarketingTools").then(m => ({ default: m.ExitIntentPopup })));
const PushNotificationBanner = lazy(() => import("./components/MarketingTools").then(m => ({ default: m.PushNotificationBanner })));
const SocialProofNotification = lazy(() => import("./components/MarketingTools").then(m => ({ default: m.SocialProofNotification })));
const FloatingCTA = lazy(() => import("./components/MarketingTools").then(m => ({ default: m.FloatingCTA })));
const MarketingBotButton = lazy(() => import("./components/AIMarketingBot").then(m => ({ default: m.MarketingBotButton })));

// Page loader component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

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
    // AuthCallback will exchange the code and establish the session first.
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') || window.location.hash?.includes('session_id=')) {
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
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/' && currentPath !== '/auth/callback') {
      sessionStorage.setItem('auth_redirect_url', currentPath);
    }
    const redirectUrl = window.location.origin + '/auth/callback';
    const googleClientId = '189939537642-prda40f304g7mi4ltki8t5ak9duaepmj.apps.googleusercontent.com';
    const scope = 'openid email profile';
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
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
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
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
  const isHome = location.pathname === '/';

  // Check URL fragment for session_id (OAuth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <>
      <ScrollToTop />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <LocalBusinessStructuredData />
      <Header />
      {!isHome && <TrustBar />}
      <Suspense fallback={<PageLoader />}>
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
        
        <Route path="/world-cup-2026" element={<WorldCup2026Page />} />
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
        
        {/* Ticket Preview */}
        <Route path="/ticket-preview" element={<TicketPreviewPage />} />
        
        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Major Events */}
        <Route path="/super-bowl-2026-tickets" element={<SuperBowlPage />} />
        <Route path="/super-bowl-2027-tickets" element={<SuperBowlPage />} />
        <Route path="/world-athletics-2026-tickets" element={<WorldAthleticsPage />} />
        <Route path="/taylor-swift-wembley-2026-tickets" element={<TaylorSwiftLondonPage />} />
        <Route path="/bayern-vs-real-madrid-tickets" element={<BayernRealMadridPage />} />
        <Route path="/bayern-real-madrid-champions-league-tickets" element={<BayernRealMadridPage />} />
        <Route path="/bahrain-world-cup-tickets-2026" element={<BahrainWorldCupPage />} />
        <Route path="/buy-bahrain-world-cup-tickets" element={<BahrainWorldCupPage />} />
        <Route path="/taylor-swift-london-tickets" element={<TaylorSwiftLondonPage />} />
        <Route path="/taylor-swift-tickets-london" element={<TaylorSwiftLondonPage />} />
        <Route path="/taylor-swift-tickets" element={<TaylorSwiftLondonPage />} />
        
        {/* Team Hub Pages */}
        <Route path="/real-madrid-tickets" element={<RealMadridHubPage />} />
        <Route path="/barcelona-tickets" element={<BarcelonaHubPage />} />
        <Route path="/manchester-city-tickets" element={<ManCityHubPage />} />
        <Route path="/liverpool-tickets" element={<LiverpoolHubPage />} />
        <Route path="/arsenal-tickets" element={<ArsenalHubPage />} />
        <Route path="/bayern-munich-tickets" element={<BayernMunichHubPage />} />
        <Route path="/psg-tickets" element={<PSGHubPage />} />
        <Route path="/juventus-tickets" element={<JuventusHubPage />} />
        <Route path="/coldplay-tour-2026" element={<ColdplayPage />} />

        {/* Content Cluster Pages - Monza */}
        <Route path="/monza-best-seats-guide" element={<MonzaBestSeatsPage />} />
        <Route path="/monza-ticket-prices" element={<MonzaTicketPricesPage />} />
        <Route path="/how-to-get-to-monza" element={<HowToGetToMonzaPage />} />
        <Route path="/monza-f1-travel-tips" element={<MonzaTravelTipsPage />} />

        {/* Content Cluster Pages - Monaco & Bahrain */}
        <Route path="/monaco-gp-vip-experience" element={<MonacoExperiencePage />} />
        <Route path="/bahrain-f1-night-race-guide" element={<BahrainNightRaceGuidePage />} />

        {/* Ultimate Guides */}
        <Route path="/ultimate-f1-tickets-guide-2026" element={<UltimateF1GuidePage />} />

        {/* French SEO Pages */}
        <Route path="/fr/acheter-billets" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-champions-league" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-f1" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-concerts" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-real-madrid" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-barcelone" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-psg" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-coupe-du-monde-2026" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-taylor-swift" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-ligue-1" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-coldplay" element={<FrenchLandingPage />} />
        <Route path="/fr/grand-prix-monaco-f1" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-marseille" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-lyon" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-bruno-mars" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-ed-sheeran" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-finale-champions-league" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-el-clasico" element={<FrenchLandingPage />} />
        <Route path="/fr/billets-grand-prix-france" element={<FrenchLandingPage />} />

        {/* Italian SEO Pages */}
        <Route path="/it/biglietti" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-champions-league" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-f1" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-concerti" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-juventus" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-milan" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-inter" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-roma" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-napoli" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-serie-a" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-coppa-del-mondo-2026" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-taylor-swift" element={<ItalianLandingPage />} />
        <Route path="/it/gran-premio-italia-f1" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-coldplay" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-finale-champions-league" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-derby-italia" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-bruno-mars" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-ed-sheeran" element={<ItalianLandingPage />} />
        <Route path="/it/biglietti-el-clasico" element={<ItalianLandingPage />} />
        
        {/* Spanish SEO Pages */}
        <Route path="/es/comprar-entradas" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-champions-league" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-f1" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-conciertos" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-copa-del-mundo-2026" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-real-madrid" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-barcelona" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-el-clasico" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-atletico-madrid" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-taylor-swift" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-coldplay" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-bruno-mars" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-la-liga" element={<SpanishLandingPage />} />
        <Route path="/es/gran-premio-espana-f1" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-final-champions" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-ed-sheeran" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-sevilla" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-valencia" element={<SpanishLandingPage />} />
        <Route path="/es/gran-premio-monaco-f1" element={<SpanishLandingPage />} />
        <Route path="/es/entradas-betis" element={<SpanishLandingPage />} />
        
        {/* German SEO Pages */}
        <Route path="/de/tickets-kaufen" element={<GermanLandingPage />} />
        <Route path="/de/champions-league-tickets" element={<GermanLandingPage />} />
        <Route path="/de/formel-1-tickets" element={<GermanLandingPage />} />
        <Route path="/de/bundesliga-tickets" element={<GermanLandingPage />} />
        <Route path="/de/konzert-tickets" element={<GermanLandingPage />} />
        <Route path="/de/wm-2026-tickets" element={<GermanLandingPage />} />
        
        {/* Language root redirects - prevent bare /de, /es, /fr, /it from rendering as events */}
        <Route path="/de" element={<Navigate to="/de/tickets-kaufen" replace />} />
        <Route path="/es" element={<Navigate to="/es/comprar-entradas" replace />} />
        <Route path="/fr" element={<Navigate to="/fr/acheter-billets" replace />} />
        <Route path="/it" element={<Navigate to="/it/biglietti" replace />} />

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
      </Suspense>
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
              theme="light"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a'
                }
              }}
            />
            <AppRouter />
            <Suspense fallback={null}>
              <AIChatWidget />
              <SocialProofNotification />
              {showExitPopup && <ExitIntentPopup onClose={() => setShowExitPopup(false)} />}
              {showPushBanner && <PushNotificationBanner onClose={() => setShowPushBanner(false)} />}
            </Suspense>
            <CookieConsentBanner />
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
