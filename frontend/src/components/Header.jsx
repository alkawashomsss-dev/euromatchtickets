import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { useLanguage } from "../i18n/LanguageProvider";
import { Ticket, Menu, X, User, LogOut, Settings, ShoppingBag, LayoutDashboard, Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:block">EuroMatchTickets</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/events" 
              className="text-zinc-400 hover:text-white transition-colors font-medium"
              data-testid="nav-events"
            >
              Events
            </Link>
            <Link 
              to="/events?type=concert" 
              className="text-zinc-400 hover:text-white transition-colors font-medium"
            >
              Concerts
            </Link>
            <Link 
              to="/events?type=match" 
              className="text-zinc-400 hover:text-white transition-colors font-medium"
            >
              Football
            </Link>
            <Link 
              to="/world-cup-2026" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-bold flex items-center gap-1"
              data-testid="nav-world-cup"
            >
              <Trophy className="w-4 h-4" />
              World Cup 2026
            </Link>
            <Link 
              to="/blog" 
              className="text-zinc-400 hover:text-white transition-colors font-medium"
            >
              Blog
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {loading ? (
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/alerts')}
                  className="text-zinc-400 hover:text-white"
                  data-testid="alerts-btn"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                      data-testid="user-menu-btn"
                    >
                      {user.picture ? (
                        <img 
                          src={user.picture} 
                          alt={user.name}
                          className="w-9 h-9 rounded-full border-2 border-purple-500/50"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                      <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-zinc-900 border-zinc-800"
                  >
                    <div className="px-3 py-2">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/my-tickets')}
                    className="cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t('nav.myTickets')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/alerts')}
                    className="cursor-pointer"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Price Alerts
                  </DropdownMenuItem>
                  {(user.role === 'seller' || user.role === 'admin') && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/seller')}
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('nav.sellerDashboard')}
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t('nav.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-400"
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
                className="btn-primary h-10 px-6 rounded-full"
                data-testid="login-btn"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/events" 
                className="text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Events
              </Link>
              <Link 
                to="/events?type=concert" 
                className="text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Concerts
              </Link>
              <Link 
                to="/events?type=match" 
                className="text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Football
              </Link>
              <Link 
                to="/world-cup-2026" 
                className="text-yellow-400 hover:text-yellow-300 transition-colors py-2 font-bold flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Trophy className="w-4 h-4" />
                World Cup 2026
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
