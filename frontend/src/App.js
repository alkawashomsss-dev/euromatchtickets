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
import BlogPage from "./pages/BlogPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import ReviewsPage from "./pages/ReviewsPage";
import FAQPage from "./pages/FAQPage";
import WorldCupPage from "./pages/WorldCupPage";
import F1MonacoPage from "./pages/F1MonacoPage";
import TomorrowlandPage from "./pages/TomorrowlandPage";
import DisneylandPage from "./pages/DisneylandPage";
import TheWeekndPage from "./pages/TheWeekndPage";
import EurostarPage from "./pages/EurostarPage";
import ChampionsLeaguePage from "./pages/ChampionsLeaguePage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

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
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
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
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
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
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:articleId" element={<BlogArticlePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/world-cup-2026" element={<WorldCupPage />} />
        <Route path="/f1-monaco-grand-prix" element={<F1MonacoPage />} />
        <Route path="/tomorrowland-2025" element={<TomorrowlandPage />} />
        <Route path="/disneyland-paris" element={<DisneylandPage />} />
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
      </Routes>
      <Footer />
    </>
  );
}

function App() {
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
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
