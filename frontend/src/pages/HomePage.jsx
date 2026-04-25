import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Calendar, MapPin, Ticket, TrendingUp, Shield, Star, 
  ChevronRight, Users, Music, Trophy, ArrowRight, Sparkles,
  CheckCircle, Lock, CreditCard, Headphones, Award, Globe,
  Clock, AlertCircle, Timer, Flag, Bike, Zap, Bell
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import OptimizedImage from "../components/OptimizedImage";
import { NewsletterSignup } from "../components/NewsletterSignup";
import FeaturedEventsCarousel from "../components/FeaturedEventsCarousel";
import { getEventImagePath, getCategoryHero } from "../utils/eventImages";
import { TrustSection, TrustBar } from "../components/TrustElements";

import { BreadcrumbStructuredData, FAQStructuredData, commonTicketFAQs } from "../components/StructuredData";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

/* ─── Animated Section Wrapper ─── */
const FadeInSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: Math.min(delay, 0.15), ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Event Card - F1 Style ─── */
const eventTypeConfig = {
  match: { label: "MATCH", icon: "trophy", bg: "bg-[#15803d]" },
  football: { label: "FOOTBALL", icon: "trophy", bg: "bg-[#15803d]" },
  f1: { label: "F1", icon: "flag", bg: "bg-[#e10600]" },
  concert: { label: "CONCERT", icon: "music", bg: "bg-purple-600" },
  motogp: { label: "MOTOGP", icon: "flag", bg: "bg-orange-600" },
  festival: { label: "FESTIVAL", icon: "music", bg: "bg-pink-600" },
  tennis: { label: "TENNIS", icon: "trophy", bg: "bg-emerald-600" },
  isle_of_man_tt: { label: "ISLE OF MAN TT", icon: "flag", bg: "bg-amber-600" }
};

const EventCard = ({ event, index }) => {
  const dateInfo = formatDate(event.event_date);
  const cfg = eventTypeConfig[event.event_type] || { label: event.event_type?.toUpperCase() || "EVENT", icon: "trophy", bg: "bg-slate-600" };
  const ticketsLeft = event.available_tickets || 0;
  const isComingSoon = event.status === 'coming_soon' || !event.lowest_price || ticketsLeft === 0;
  const isLimited = !isComingSoon && ticketsLeft > 0 && ticketsLeft <= 10;
  const isFast = !isComingSoon && ticketsLeft > 10 && ticketsLeft <= 25;
  const IconComp = cfg.icon === "music" ? Music : cfg.icon === "flag" ? Flag : Trophy;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.15) }}
    >
      <Link 
        to={`/event/${event.slug || event.event_id}`}
        data-testid={`event-card-${event.slug || event.event_id}`}
        className="group block bg-[#1e1e1e] border border-white/6 overflow-hidden hover:border-[#e10600] transition-colors duration-150"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={getEventImagePath(event)}
            alt={event.image_alt || `${event.title} tickets`}
            loading="lazy" decoding="async" width="400" height="208"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Category Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white ${cfg.bg}`}>
              <IconComp className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>

          {/* Urgency badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
            {event.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#facc15] text-black">
                <Sparkles className="w-3 h-3" /> FEATURED
              </span>
            )}
            {isLimited && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-[#e10600] text-white animate-pulse">
                <AlertCircle className="w-3 h-3" /> {ticketsLeft} LEFT!
              </span>
            )}
            {isFast && !isLimited && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black bg-[#facc15] text-black">
                <TrendingUp className="w-3 h-3" /> AVAILABLE
              </span>
            )}
          </div>

          {/* Date + Time overlay bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs font-bold px-2.5 py-1.5 uppercase tracking-wide">
            <Calendar className="w-3 h-3" />
            {dateInfo.month} {dateInfo.date}{dateInfo.time ? ` • ${dateInfo.time}` : ''}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-black text-white group-hover:text-[#e10600] transition-colors line-clamp-1 mb-1 uppercase tracking-tight">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3 h-3" />{event.venue && event.venue !== 'TBA' && event.venue !== '' ? `${event.venue}, ` : ''}{event.city && event.city !== 'TBD' && event.city !== 'Europe' ? event.city : ''}
          </div>

          {(event.event_type === 'match' || event.event_type === 'football') && event.home_team && event.away_team && event.home_team.trim() && event.away_team.trim() && (
            <div className="flex items-center justify-center gap-3 py-2 mb-3 bg-white/5 border border-white/8">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-white/10 p-0.5 flex items-center justify-center">
                  <img src={event.home_logo} alt="" className="w-4 h-4 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
                <span className="font-black text-sm text-white">{event.home_team}</span>
              </div>
              <span className="text-[#e10600] text-xs font-black">VS</span>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white">{event.away_team}</span>
                <div className="w-6 h-6 bg-white/10 p-0.5 flex items-center justify-center">
                  <img src={event.away_logo} alt="" className="w-4 h-4 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/8">
            {isComingSoon ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-1 uppercase tracking-wider">
                <Bell className="w-3 h-3" /> Coming soon · Join waitlist
              </span>
            ) : event.lowest_price ? (
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-500 font-medium uppercase">From</span>
                <span className="text-xl font-black text-white">&euro;{event.lowest_price.toFixed(0)}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-sm uppercase font-bold">Price TBA</span>
            )}
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-[#e10600] transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ─── MAIN HOMEPAGE ─── */
const HomePage = () => {
  const { user, login } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, concertsRes, worldCupRes, footballRes] = await Promise.all([
          axios.get(`${API}/events?featured=true&limit=30`),
          axios.get(`${API}/events?event_type=concert&limit=8`),
          axios.get(`${API}/events?event_type=worldcup&limit=12`),
          axios.get(`${API}/events?event_type=football&limit=8`)
        ]);
        // Deduplicate by normalized title (e.g. "El Clasico" and "Real Madrid vs Barcelona" are same)
        const seen = new Set();
        const deduped = (featuredRes.data || []).filter(e => {
          const key = (e.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const teams = [e.home_team, e.away_team].filter(Boolean).sort().join('').toLowerCase().replace(/[^a-z0-9]/g, '');
          const dedupKey = teams || key;
          if (seen.has(dedupKey)) return false;
          seen.add(dedupKey);
          if (teams) seen.add(key); // Also mark the title variant
          return true;
        });
        setFeaturedEvents(deduped.slice(0, 6));
        setConcerts((concertsRes.data || []).slice(0, 8));
        // Merge World Cup + club football so the Matches section shows a real variety
        const allMatches = [
          ...(worldCupRes.data || []),
          ...(footballRes.data || [])
        ].sort((a, b) => {
          const da = new Date(a.event_date || 0).getTime();
          const db = new Date(b.event_date || 0).getTime();
          return da - db;
        });
        setMatches(allMatches.slice(0, 12));
      } catch (error) { console.error("Error fetching events:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead
        title="EuroMatchTickets — Football, F1, MotoGP & Concert Tickets Marketplace"
        description="EuroMatchTickets is a European secondary-market platform for football, Formula 1, MotoGP and major concert tickets. Verified-seller inventory, escrowed payments, full refund if an event is cancelled."
        image="https://euromatchtickets.com/logo-192.png"
      />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }]} />
      <FAQStructuredData faqs={commonTicketFAQs} />
      
      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
            <picture>
              <source type="image/webp" srcSet="/images/heroes/worldcup-trophy-sm.webp 400w, /images/heroes/worldcup-trophy-md.webp 800w, /images/heroes/worldcup-trophy-lg.webp 1200w" sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px" />
              <img src="/images/heroes/worldcup-trophy.jpg" alt="FIFA World Cup 2026" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" decoding="sync" />
            </picture>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-black/70 to-black/40" />
          <div className="absolute inset-0 hero-mesh" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full py-20 md:py-32">
          <div className="max-w-4xl">
            {/* Live tag */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-[#e10600] px-4 py-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-black tracking-widest uppercase">TICKETS ON SALE NOW</span>
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6 leading-[0.95] tracking-tighter"
            >
              <span className="text-white font-black block">FIFA WORLD CUP</span>
              <span className="text-[#e10600] font-black block">2026 TICKETS</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8">
              <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Be part of history. Verified tickets for the FIFA World Cup 2026. 
                <span className="text-[#e10600] font-bold"> Secure checkout</span> with QR ticket delivery.
              </p>
            </motion.div>

            {/* CTA Row */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <div className="bg-[#15151e] border border-white/10 px-5 py-3">
                <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">From</span>
                <div className="text-3xl md:text-4xl font-black text-[#e10600] mt-0.5">&euro;150</div>
                <span className="text-slate-500 text-[10px]">based on current listings</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/world-cup-2026">
                  <Button data-testid="buy-worldcup-btn" className="bg-[#e10600] hover:bg-red-700 text-white text-base h-13 px-8 rounded-none font-black uppercase tracking-wider transition-colors duration-150">
                    View World Cup Tickets
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button data-testid="explore-events-btn" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-base h-13 px-8 rounded-none font-bold uppercase tracking-wider transition-colors duration-150">
                    <Ticket className="w-5 h-5 mr-2" /> Explore Events
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Trust Strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex flex-wrap items-center gap-6">
              {[
                { icon: CheckCircle, text: "Verified Tickets" },
                { icon: Lock, text: "Secure Payment" },
                { icon: Zap, text: "QR delivery" },
                { icon: Headphones, text: "Customer support" }
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <t.icon className="w-4 h-4 text-[#e10600]" />{t.text}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ HOTTEST EVENTS CAROUSEL ═══════ */}
      <div className="bg-[#0e0e14]">
        <FeaturedEventsCarousel />
      </div>

      {/* ═══════ POPULAR EVENTS - SEO POWER SECTION ═══════ */}
      <section className="py-10 bg-[#15151e] border-y border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-8 bg-[#e10600]" />
              <div>
                <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest">POPULAR EVENTS</span>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Most Popular Tickets</h2>
              </div>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Spa F1 - Primary Push */}
            <FadeInSection delay={0.05}>
              <Link to="/spa-f1-tickets" className="group block relative h-56 overflow-hidden border-2 border-[#e10600]/30 hover:border-[#e10600] transition-colors duration-150">
                <img src="/images/heroes/f1-red.jpg"
                  alt="Spa F1 Tickets 2026 - Belgian Grand Prix" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-[#e10600] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">#1 TRENDING</span>
                  <span className="bg-[#facc15] text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">AVAILABLE</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#e10600] transition-colors">SPA F1 TICKETS 2026</h3>
                  <p className="text-slate-400 text-xs">Belgian Grand Prix &bull; Spa-Francorchamps &bull; Aug 28-30</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#15803d] font-black text-sm">From &euro;109</span>
                    <span className="text-[#e10600] font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">Buy Tickets <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            </FadeInSection>
            {/* Taylor Swift */}
            <FadeInSection delay={0.1}>
              <Link to="/taylor-swift-london-tickets" className="group block relative h-56 overflow-hidden border border-white/8 hover:border-[#e10600] transition-colors duration-150">
                <img src="/images/heroes/concert-purple.jpg" alt="Taylor Swift Eras Tour London Tickets 2026" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="bg-[#e10600] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider w-fit mb-auto">#2 TRENDING</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#e10600] transition-colors">TAYLOR SWIFT LONDON</h3>
                  <p className="text-slate-400 text-xs">Eras Tour &bull; Wembley Stadium &bull; Summer 2026</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#15803d] font-black text-sm">From &euro;89</span>
                    <span className="text-[#e10600] font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">Buy Tickets <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            </FadeInSection>
            {/* MotoGP */}
            <FadeInSection delay={0.15}>
              <Link to="/motogp-tickets" className="group block relative h-56 overflow-hidden border border-white/8 hover:border-[#e10600] transition-colors duration-150">
                <img src="/api/event-images/venues/motogp-action.jpg" alt="MotoGP Tickets 2026 - All Grand Prix" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-wider w-fit mb-auto">#3 TRENDING</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#e10600] transition-colors">MOTOGP TICKETS 2026</h3>
                  <p className="text-slate-400 text-xs">All MotoGP Races &bull; 21 Grand Prix &bull; Full Season</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#15803d] font-black text-sm">From &euro;69</span>
                    <span className="text-[#e10600] font-black text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">Buy Tickets <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED EVENTS ═══════ */}
      <section className="py-16 md:py-24 bg-[#0e0e14]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-2 block">DON'T MISS OUT</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">FEATURED EVENTS</h2>
              </div>
              <Link to="/events" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-wider group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredEvents.map((event, i) => <EventCard key={event.event_id} event={event} index={i} />)}
            </div>
          )}
          
          <div className="md:hidden text-center mt-6">
            <Link to="/events" className="btn-secondary inline-flex items-center gap-2 text-sm">VIEW ALL EVENTS <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES - F1 STYLE FULL-WIDTH IMAGE CARDS ═══════ */}
      <section className="py-16 md:py-24 bg-[#15151e] content-lazy">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection>
            <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-2 block">BROWSE BY CATEGORY</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-10">FIND YOUR EVENT</h2>
          </FadeInSection>

          {/* Big Category Cards - F1 Style with full-width images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FadeInSection delay={0.05}>
              <Link to="/events?type=match" data-testid="category-matches" className="group relative h-72 overflow-hidden block">
                <OptimizedImage basePath={getCategoryHero("football")} alt="Football Tickets" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-8 h-8 text-[#e10600]" />
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">FOOTBALL</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">Champions League, World Cup, Premier League & more</p>
                  <span className="flex items-center text-[#e10600] group-hover:translate-x-2 transition-transform font-black text-sm uppercase tracking-wider">
                    Browse Matches <ChevronRight className="w-5 h-5 ml-1" />
                  </span>
                </div>
              </Link>
            </FadeInSection>
            <FadeInSection delay={0.1}>
              <Link to="/events?type=concert" data-testid="category-concerts" className="group relative h-72 overflow-hidden block">
                <OptimizedImage basePath={getCategoryHero("concert")} alt="Concert Tickets" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Music className="w-8 h-8 text-[#e10600]" />
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">CONCERTS</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">Taylor Swift, Bruno Mars, The Weeknd & more</p>
                  <span className="flex items-center text-[#e10600] group-hover:translate-x-2 transition-transform font-black text-sm uppercase tracking-wider">
                    Browse Concerts <ChevronRight className="w-5 h-5 ml-1" />
                  </span>
                </div>
              </Link>
            </FadeInSection>
          </div>

          {/* Racing Row - Full Width Cards */}
          <FadeInSection delay={0.15}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-[#e10600]" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Racing Tickets</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { to: "/f1-tickets", title: "F1 Tickets", sub: "23 Grand Prix", price: "From \u20ac89", img: "/images/heroes/monaco.jpg" },
                  { to: "/f1-2026-schedule", title: "F1 Schedule", sub: "Full Calendar", price: "Mar - Dec 2026", img: "/images/heroes/silverstone.jpg" },
                  { to: "/motogp-tickets", title: "MotoGP", sub: "21 Races", price: "From \u20ac69", img: "/images/heroes/motogp.jpg" },
                  { to: "/motogp-2026-schedule", title: "MotoGP Schedule", sub: "Full Calendar", price: "Mar - Nov 2026", img: "/images/heroes/motogp-orange.jpg" },
                  { to: "/isle-of-man-tt-tickets", title: "Isle of Man TT", sub: "Legendary Race", price: "From \u20ac149", img: "/api/event-images/venues/isle-of-man.png" }
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="group relative h-36 overflow-hidden block hover:ring-2 hover:ring-[#e10600] transition-all duration-150">
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                    <div className="relative h-full flex flex-col justify-end p-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h3>
                      <p className="text-[10px] text-white/50 uppercase">{item.sub}</p>
                      <span className="text-[#facc15] text-xs font-black mt-1">{item.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Hot Events Grid */}
          <FadeInSection delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { to: "/concerts-in-london-2026", label: "LONDON 2026", title: "London Concerts", price: "From \u20ac45", img: "/images/heroes/concert-live.jpg" },
                { to: "/bayern-vs-real-madrid-tickets", label: "UCL CLASSIC", title: "Bayern vs Real", price: "From \u20ac199", img: "/api/event-images/venues/allianz-arena.jpg" },
                { to: "/bahrain-world-cup-tickets-2026", label: "FIFA 2026", title: "World Cup", price: "From \u20ac89", img: "/images/heroes/worldcup-trophy.jpg" },
                { to: "/champions-league-tickets", label: "UEFA", title: "Champions League", price: "From \u20ac85", img: "/api/event-images/venues/santiago-bernabeu.jpg" },
                { to: "/f1-bahrain-grand-prix-tickets", label: "NIGHT RACE", title: "Bahrain GP", price: "From \u20ac149", img: "/api/event-images/venues/yas-marina.png" },
                { to: "/f1-tickets-2026", label: "FULL SEASON", title: "F1 2026", price: "From \u20ac120", img: "/images/heroes/f1-race.jpg" }
              ].map((cat, i) => (
                <Link key={cat.to} to={cat.to} className="group relative h-40 overflow-hidden block hover:ring-2 hover:ring-[#e10600] transition-all duration-150">
                  <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                  <div className="relative h-full flex flex-col justify-end p-4">
                    <span className="text-[9px] font-black text-[#e10600] mb-0.5 uppercase tracking-widest">{cat.label}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{cat.title}</h3>
                    <p className="text-[10px] text-white/40">{cat.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-16 md:py-24 bg-[#0e0e14] content-lazy">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection className="text-center mb-12">
            <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-2 block">SIMPLE & FAST</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">HOW IT WORKS</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Get your tickets in 3 easy steps</p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "FIND YOUR EVENT", desc: "Browse concerts, matches, F1 races and more across Europe", icon: <Ticket className="w-7 h-7" />, bg: "bg-[#e10600]", img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/c81d55ecab50a35b17dca3dfb7f64b287f0b82b8d7d635c75c2e385822b29c1e.png" },
              { step: "02", title: "CHOOSE YOUR SEATS", desc: "Select from VIP to standing with interactive venue maps", icon: <MapPin className="w-7 h-7" />, bg: "bg-[#facc15] text-black", img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/3e42214e87107974158e3ba1ed1a8e361f44157d7d89c7128361b2f46bee913f.png" },
              { step: "03", title: "GET YOUR QR CODE", desc: "Receive your verified digital ticket instantly", icon: <Shield className="w-7 h-7" />, bg: "bg-[#15803d]", img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/cb060f002664f85a8dbf5d4fe28761ca72114222f8e0b9792664777f27ba4e65.png" }
            ].map((item, index) => (
              <FadeInSection key={index} delay={index * 0.1}>
                <div className="relative bg-[#1e1e1e] border border-white/6 hover:border-[#e10600] transition-colors duration-150 group overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="p-6 md:p-8 relative">
                    <span className="text-6xl font-black text-white/5 absolute top-0 right-4 select-none">{item.step}</span>
                    <div className={`w-14 h-14 ${item.bg} flex items-center justify-center text-white mb-5 -mt-12 relative z-10 shadow-xl`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-black text-white mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRUST & SECURITY ═══════ */}
      <section className="py-16 md:py-24 bg-[#15151e] content-lazy">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#15803d]/20 border border-[#15803d]/30 px-4 py-1.5 mb-4">
              <Shield className="w-3.5 h-3.5 text-[#15803d]" />
              <span className="text-[10px] font-black text-[#15803d] uppercase tracking-widest">TRUSTED PLATFORM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">WHY FANS TRUST US</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Your purchase is protected with our comprehensive guarantee</p>
          </FadeInSection>

          {/* Trustpilot-style Rating */}
          <FadeInSection className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 bg-[#1e1e1e] border border-white/8 px-6 py-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-7 h-7 bg-[#00b67a] flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <span className="text-white font-black text-lg">Excellent</span>
                <span className="text-slate-400 text-xs block">Customer ratings</span>
              </div>
            </div>
          </FadeInSection>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Live Events", icon: Ticket },
              { label: "Buyer Protected", icon: Shield },
              { label: "Europe-Wide", icon: Globe },
              { label: "Customer support", icon: Headphones }
            ].map((stat, idx) => (
              <FadeInSection key={idx} delay={idx * 0.06}>
                <div className="bg-[#1e1e1e] border border-white/6 p-5 text-center hover:border-[#e10600] transition-colors duration-150">
                  <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-[#e10600]" />
                  </div>
                  <p className="text-xs text-white font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Trust Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "BUYER PROTECTION", desc: "Full refund if tickets are invalid or not delivered. Every ticket verified.", to: "/buyer-protection" },
              { icon: Lock, title: "SECURE PAYMENTS", desc: "Bank-level 256-bit SSL encryption via Stripe. Your details are always safe.", to: "/payment-info" },
              { icon: CheckCircle, title: "VERIFIED SELLERS", desc: "Every seller undergoes ID verification. Every ticket authenticated.", to: null }
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.08}>
                {item.to ? (
                  <Link to={item.to} className="bg-[#1e1e1e] border border-white/6 p-6 hover:border-[#e10600] transition-colors duration-150 group block">
                    <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-[#e10600]" />
                    </div>
                    <h3 className="text-base font-black text-white mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                    <span className="text-[#e10600] text-xs flex items-center gap-1 font-black uppercase tracking-wider">Learn more <ArrowRight className="w-3 h-3" /></span>
                  </Link>
                ) : (
                  <div className="bg-[#1e1e1e] border border-white/6 p-6 hover:border-[#e10600] transition-colors duration-150">
                    <div className="w-12 h-12 bg-[#e10600]/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-[#e10600]" />
                    </div>
                    <h3 className="text-base font-black text-white mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                    <span className="text-[#15803d] text-xs flex items-center gap-1 font-bold"><CheckCircle className="w-3 h-3" /> Identity verified</span>
                  </div>
                )}
              </FadeInSection>
            ))}
          </div>

          {/* Security Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-6 border-t border-white/6">
            {[
              { icon: CreditCard, text: "Powered by Stripe" },
              { icon: Lock, text: "Encrypted" },
              { icon: Award, text: "GDPR Compliant" }
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-slate-600 text-xs uppercase tracking-wider"><item.icon className="w-3.5 h-3.5" />{item.text}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LATEST GUIDES ═══════ */}
      <section className="py-16 bg-[#0e0e14]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-1">Expert Guides</p>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Latest Guides & Tips</h2>
            </div>
            <Link to="/blog" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              All Guides <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeInSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { slug: "best-f1-circuits-2026", title: "10 Best F1 Circuits to Visit in 2026", cat: "F1", img: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg" },
              { slug: "spa-francorchamps-travel-guide-2026", title: "Spa-Francorchamps Travel Guide 2026", cat: "F1", img: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg" },
              { slug: "taylor-swift-eras-tour-london-guide-2026", title: "Taylor Swift London 2026 - Fan Guide", cat: "Concerts", img: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg" },
              { slug: "how-to-buy-f1-tickets-2026", title: "How to Buy F1 Tickets - Beginner Guide", cat: "F1", img: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg" }
            ].map(g => (
              <Link key={g.slug} to={`/blog/${g.slug}`} className="group bg-[#161620] border border-white/5 overflow-hidden hover:border-[#e10600]/30 transition-all" data-testid={`home-guide-${g.slug}`}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={g.img} alt={g.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-[9px] text-[#e10600] uppercase tracking-widest font-bold mb-1">{g.cat}</p>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#e10600] transition-colors line-clamp-2">{g.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#e10600]" />
        <FadeInSection className="max-w-[1440px] mx-auto px-4 md:px-8 relative text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            READY FOR YOUR NEXT<br />
            UNFORGETTABLE EXPERIENCE?
          </h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto">
            Join thousands of fans who trust EuroMatchTickets for their live event tickets
          </p>
          <Link to="/events">
            <Button data-testid="cta-btn" className="bg-white text-[#e10600] hover:bg-white/90 text-base h-13 px-10 rounded-none font-black uppercase tracking-wider">
              Explore All Events <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </FadeInSection>
      </section>

      {/* Reviews section removed pending real UGC integration (Trustpilot / DB-backed) */}

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <NewsletterSignup source="homepage" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
