import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useLanguage } from "../i18n/LanguageProvider";
import { Menu, X, User, LogOut, Settings, ShoppingBag, LayoutDashboard, Bell, Trophy, Music, ChevronDown, Flag, Bike, DollarSign, Phone } from "lucide-react";
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

const Header = () => {
  const { user, login, logout, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = [
    { name: "Football", icon: Trophy, href: "/events?type=match" },
    { name: "Concerts", icon: Music, href: "/events?type=concert" },
    { name: "Formula 1", icon: Flag, href: "/f1-tickets" },
    { name: "MotoGP", icon: Bike, href: "/motogp-tickets" },
    { name: "Isle of Man TT", icon: Bike, href: "/isle-of-man-tt-tickets" },
  ];

  return (
    <>
      {/* TOP DISCLOSURE BAR */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a] py-1.5 px-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <p className="text-[10px] sm:text-xs text-slate-400 leading-tight">
            <span className="text-amber-400 font-bold">Notice:</span> Independent resale marketplace. Prices may differ from face value.
            <a href="/terms" className="underline ml-1 text-white/60 hover:text-white">Learn more</a>
          </p>
          <a href="mailto:support@euromatchtickets.com" className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors">
            <Phone className="w-3 h-3" /> Need help?
          </a>
        </div>
      </div>

      {/* RED HEADER BAR */}
      <header 
        className={`fixed top-[28px] sm:top-[30px] left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl' : ''}`}
        data-testid="header"
      >
        {/* PRIMARY RED BAR */}
        <div className="bg-[#e10600]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 group" data-testid="logo">
                <img 
                  src="https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/3a68688ecd89eb374164112bbca3b9cc526cf0e98afc1f70225c66468d4b831d.png" 
                  alt="EuroMatchTickets" 
                  className="w-9 h-9 object-contain"
                />
                <div className="hidden sm:flex items-baseline gap-0.5">
                  <span className="text-lg font-black text-white tracking-tight font-display uppercase">EuroMatch</span>
                  <span className="text-lg font-black text-white/90 tracking-tight font-display uppercase">Tickets</span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-0.5">
                <Link 
                  to="/events" 
                  className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/15 transition-colors text-sm font-bold uppercase tracking-wide"
                  data-testid="nav-events"
                >
                  All Events
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white hover:bg-white/15 transition-colors text-sm font-bold uppercase tracking-wide">
                    Categories
                    <ChevronDown className="w-3.5 h-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#15151e] border-white/10 shadow-2xl">
                    {categories.map((cat) => (
                      <DropdownMenuItem 
                        key={cat.name}
                        onClick={() => navigate(cat.href)}
                        className="cursor-pointer hover:bg-white/10 text-white/80 hover:text-white"
                      >
                        <cat.icon className="w-4 h-4 mr-2 text-[#e10600]" />
                        <span>{cat.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link 
                  to="/world-cup-2026" 
                  className="px-4 py-2 text-white hover:bg-white/15 transition-colors text-sm font-black uppercase tracking-wide flex items-center gap-1.5"
                  data-testid="nav-world-cup"
                >
                  <Trophy className="w-4 h-4" />
                  World Cup
                </Link>
                <Link 
                  to="/blog" 
                  className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/15 transition-colors text-sm font-bold uppercase tracking-wide"
                >
                  Blog
                </Link>
                <Link 
                  to="/sell-tickets" 
                  className="px-4 py-2 text-white hover:bg-white/15 transition-colors text-sm font-black uppercase tracking-wide flex items-center gap-1.5"
                  data-testid="nav-sell-tickets"
                >
                  <DollarSign className="w-4 h-4" />
                  Sell
                </Link>
              </nav>

              {/* Auth + Mobile */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                
                {loading ? (
                  <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate('/alerts')}
                      className="text-white/80 hover:text-white hover:bg-white/15"
                      data-testid="alerts-btn"
                    >
                      <Bell className="w-5 h-5" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center gap-2 p-1 pr-3 hover:bg-white/15 transition-colors"
                          data-testid="user-menu-btn"
                        >
                          {user.picture ? (
                            <img 
                              src={user.picture} 
                              alt={user.name}
                              className="w-8 h-8 rounded-none border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="hidden md:block text-sm font-bold text-white max-w-[80px] truncate">
                            {user.name}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-56 bg-[#15151e] border-white/10 shadow-2xl"
                      >
                        <div className="px-3 py-2">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-sm text-slate-400 truncate">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => navigate('/my-tickets')}
                          className="cursor-pointer hover:bg-white/10 text-white/80 hover:text-white"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{t('nav.myTickets')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => navigate('/alerts')}
                          className="cursor-pointer hover:bg-white/10 text-white/80 hover:text-white"
                        >
                          <Bell className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Price Alerts</span>
                        </DropdownMenuItem>
                        {(user.role === 'seller' || user.role === 'admin') && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/seller')}
                            className="cursor-pointer hover:bg-white/10 text-white/80 hover:text-white"
                          >
                            <Settings className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{t('nav.sellerDashboard')}</span>
                          </DropdownMenuItem>
                        )}
                        {user.role === 'admin' && (
                          <DropdownMenuItem 
                            onClick={() => navigate('/admin')}
                            className="cursor-pointer hover:bg-white/10 text-white/80 hover:text-white"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{t('nav.admin')}</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={logout}
                          className="cursor-pointer text-red-400 hover:bg-red-500/20 hover:text-red-300"
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
                    className="bg-white text-[#e10600] hover:bg-white/90 h-9 px-5 text-sm font-black uppercase tracking-wide rounded-none"
                    data-testid="login-btn"
                  >
                    <User className="w-4 h-4 mr-1.5" />
                    Sign In
                  </Button>
                )}

                <button 
                  className="md:hidden p-2 text-white hover:bg-white/15"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="mobile-menu-toggle"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DARK SUB-NAV BAR - Desktop */}
        <div className="hidden md:block bg-[#15151e] border-b border-white/5">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex items-center h-10 gap-0 overflow-x-auto">
              {[
                { label: "Tickets", to: "/events", active: true },
                { label: "Spa F1 Tickets", to: "/spa-f1-tickets" },
                { label: "F1 2026", to: "/f1-tickets-2026" },
                { label: "Champions League", to: "/champions-league-tickets" },
                { label: "World Cup 2026", to: "/world-cup-2026" },
                { label: "Taylor Swift", to: "/taylor-swift-london-tickets" },
                { label: "MotoGP", to: "/motogp-tickets" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    item.active 
                      ? 'text-white border-b-2 border-[#e10600]' 
                      : 'text-slate-400 hover:text-white border-b-2 border-transparent hover:border-white/30'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#15151e] overflow-hidden border-b border-white/10"
            >
              <nav className="py-3 px-4 flex flex-col gap-0.5">
                <Link to="/events" className="text-white/90 hover:text-white hover:bg-white/10 py-3 px-4 font-bold uppercase text-sm tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                  All Events
                </Link>
                <div className="py-2 px-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Categories</div>
                {categories.map((cat) => (
                  <Link 
                    key={cat.name}
                    to={cat.href}
                    className="flex items-center gap-2.5 py-3 px-4 pl-6 text-white/70 hover:text-white hover:bg-white/10 transition-colors font-bold text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <cat.icon className="w-4 h-4 text-[#e10600]" />
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <Link to="/world-cup-2026" className="flex items-center gap-2 text-amber-400 hover:bg-white/10 py-3 px-4 font-black uppercase text-sm tracking-wide" onClick={() => setMobileMenuOpen(false)}>
                    <Trophy className="w-4 h-4" />
                    World Cup 2026
                  </Link>
                  <Link to="/sell-tickets" className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 py-3 px-4 font-bold uppercase text-sm" onClick={() => setMobileMenuOpen(false)}>
                    <DollarSign className="w-4 h-4 text-[#e10600]" />
                    Sell Tickets
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
