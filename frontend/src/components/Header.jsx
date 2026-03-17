import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useLanguage } from "../i18n/LanguageProvider";
import { Ticket, Menu, X, User, LogOut, Settings, ShoppingBag, LayoutDashboard, Bell, Trophy, Music, ChevronDown, Flag, Bike, DollarSign } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const ResellerDisclosure = () => (
  <div className="fixed top-0 left-0 right-0 z-[60] bg-slate-900 py-1.5 px-3">
    <div className="max-w-[1440px] mx-auto">
      <p className="text-[10px] sm:text-xs text-slate-300 text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
        <strong className="text-amber-400">Notice:</strong> EuroMatchTickets is an independent resale marketplace. Prices may be above or below face value.
        <a href="/terms" className="underline ml-1 text-white/70 hover:text-white">Learn more</a>
      </p>
    </div>
  </div>
);

const Header = () => {
  const { user, login, logout, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = [
    { name: "Football", icon: Trophy, href: "/events?type=match", color: "text-emerald-600" },
    { name: "Concerts", icon: Music, href: "/events?type=concert", color: "text-violet-600" },
    { name: "Formula 1", icon: Flag, href: "/f1-tickets", color: "text-red-600" },
    { name: "MotoGP", icon: Bike, href: "/motogp-tickets", color: "text-orange-600" },
    { name: "Isle of Man TT", icon: Bike, href: "/isle-of-man-tt-tickets", color: "text-amber-600" },
  ];

  return (
    <>
      <ResellerDisclosure />
      <header 
        className={`fixed top-[26px] sm:top-[30px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'glass shadow-lg' 
            : 'bg-white/40 backdrop-blur-sm border-b border-slate-200/50'
        }`}
        data-testid="header"
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" data-testid="logo">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-slate-900 tracking-tight">EuroMatch</span>
                <span className="text-lg font-bold text-amber-500 tracking-tight">Tickets</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/events" 
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-full transition-all text-sm font-medium"
                data-testid="nav-events"
              >
                All Events
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-full transition-all text-sm font-medium">
                  Categories
                  <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-slate-200 shadow-xl">
                  {categories.map((cat) => (
                    <DropdownMenuItem 
                      key={cat.name}
                      onClick={() => navigate(cat.href)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <cat.icon className={`w-4 h-4 mr-2 ${cat.color}`} />
                      <span className="text-slate-700">{cat.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link 
                to="/world-cup-2026" 
                className="px-4 py-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-all text-sm font-bold flex items-center gap-1.5"
                data-testid="nav-world-cup"
              >
                <Trophy className="w-4 h-4" />
                World Cup
              </Link>
              <Link 
                to="/blog" 
                className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-full transition-all text-sm font-medium"
              >
                Blog
              </Link>
              <Link 
                to="/sell-tickets" 
                className="px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all text-sm font-bold flex items-center gap-1.5"
                data-testid="nav-sell-tickets"
              >
                <DollarSign className="w-4 h-4" />
                Sell
              </Link>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              
              {loading ? (
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/alerts')}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    data-testid="alerts-btn"
                  >
                    <Bell className="w-5 h-5" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                        data-testid="user-menu-btn"
                      >
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[80px] truncate">
                          {user.name}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 bg-white border-slate-200 shadow-xl"
                    >
                      <div className="px-3 py-2">
                        <p className="font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem 
                        onClick={() => navigate('/my-tickets')}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-slate-700">{t('nav.myTickets')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/alerts')}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <Bell className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-slate-700">Price Alerts</span>
                      </DropdownMenuItem>
                      {(user.role === 'seller' || user.role === 'admin') && (
                        <DropdownMenuItem 
                          onClick={() => navigate('/seller')}
                          className="cursor-pointer hover:bg-slate-50"
                        >
                          <Settings className="w-4 h-4 mr-2 text-slate-500" />
                          <span className="text-slate-700">{t('nav.sellerDashboard')}</span>
                        </DropdownMenuItem>
                      )}
                      {user.role === 'admin' && (
                        <DropdownMenuItem 
                          onClick={() => navigate('/admin')}
                          className="cursor-pointer hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                          <span className="text-slate-700">{t('nav.admin')}</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-slate-100" />
                      <DropdownMenuItem 
                        onClick={logout}
                        className="cursor-pointer text-red-600 hover:bg-red-50"
                        data-testid="logout-btn"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={login}
                  className="btn-primary h-10 px-6 text-sm"
                  data-testid="login-btn"
                >
                  Sign In
                </Button>
              )}

              <button 
                className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <nav className="py-4 border-t border-slate-200/60 flex flex-col gap-1">
                  <Link to="/events" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl py-3 px-4 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    All Events
                  </Link>
                  <div className="py-2 px-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Categories</div>
                  {categories.map((cat) => (
                    <Link 
                      key={cat.name}
                      to={cat.href}
                      className={`flex items-center gap-2.5 py-3 px-4 pl-6 ${cat.color} hover:bg-slate-50 rounded-xl transition-colors font-medium`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.name}
                    </Link>
                  ))}
                  <Link to="/world-cup-2026" className="text-amber-600 hover:bg-amber-50 py-3 px-4 font-bold flex items-center gap-2 mt-2 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                    <Trophy className="w-4 h-4" />
                    World Cup 2026
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

export default Header;
