import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Calendar, MapPin, Ticket, TrendingUp, Shield, Star, 
  ChevronRight, Users, Music, Trophy, ArrowRight, Sparkles,
  CheckCircle, Lock, CreditCard, Headphones, Award, Globe,
  Clock, AlertCircle, Timer, Flag, Bike, Zap
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import OptimizedImage from "../components/OptimizedImage";
import FeaturedEventsCarousel from "../components/FeaturedEventsCarousel";
import { getEventImagePath, getCategoryHero } from "../utils/eventImages";
import { TrustSection, TrustBar } from "../components/TrustElements";
import { ReviewsGrid, ReviewsStats } from "../components/ReviewsSystem";
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
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Countdown Timer ─── */
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff > 0) setTimeLeft({ days: Math.floor(diff / 864e5), hours: Math.floor((diff / 36e5) % 24) });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [targetDate]);
  if (timeLeft.days > 30) return null;
  return (
    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <Timer className="w-3 h-3" />
      <span className="font-medium">{timeLeft.days}d {timeLeft.hours}h</span>
    </div>
  );
};

/* ─── Event Card ─── */
const EventCard = ({ event, index }) => {
  const dateInfo = formatDate(event.event_date);
  const isMatch = event.event_type === "match";
  const ticketsLeft = event.available_tickets || 0;
  const isLimited = ticketsLeft > 0 && ticketsLeft <= 10;
  const isFast = ticketsLeft > 10 && ticketsLeft <= 25;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link 
        to={`/event/${event.slug || event.event_id}`}
        data-testid={`event-card-${event.slug || event.event_id}`}
        className="event-card group block glass-card-hover"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <img 
            src={event.image_url || `${getEventImagePath(event)}-md.webp`}
            alt={event.image_alt || `${event.title} tickets - EuroMatchTickets`}
            loading="lazy" decoding="async" width="400" height="192"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge className={isMatch ? "tag-match text-xs" : "tag-concert text-xs"}>
              {isMatch ? <Trophy className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
              {isMatch ? "Match" : "Concert"}
            </Badge>
            {isLimited && (
              <Badge className="bg-red-500 text-white border-0 text-[10px] animate-pulse">
                <AlertCircle className="w-3 h-3 mr-0.5" /> Only {ticketsLeft} left
              </Badge>
            )}
            {isFast && (
              <Badge className="bg-amber-500 text-white border-0 text-[10px]">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Selling Fast
              </Badge>
            )}
          </div>
          {event.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                <Sparkles className="w-3 h-3 mr-0.5" /> Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1 flex-1">
              {event.title}
            </h3>
            <CountdownTimer targetDate={event.event_date} />
          </div>
          {event.subtitle && <p className="text-slate-500 text-sm mb-3">{event.subtitle}</p>}

          {isMatch && event.home_team && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 bg-slate-100 rounded-full p-1 flex items-center justify-center">
                  <img src={event.home_logo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
                <span className="font-medium text-sm text-slate-800">{event.home_team}</span>
              </div>
              <span className="text-slate-400 text-xs font-bold">VS</span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm text-slate-800">{event.away_team}</span>
                <div className="w-7 h-7 bg-slate-100 rounded-full p-1 flex items-center justify-center">
                  <img src={event.away_logo} alt="" className="w-5 h-5 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{dateInfo.month} {dateInfo.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {event.lowest_price ? (
              <div>
                <span className="text-slate-400 text-xs">From</span>
                <span className="text-2xl font-bold text-slate-900 ml-2">&euro;{event.lowest_price.toFixed(0)}</span>
              </div>
            ) : (
              <span className="text-slate-400 text-sm">Price TBA</span>
            )}
            {ticketsLeft > 0 && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                isLimited ? 'bg-red-50 text-red-600 border border-red-200'
                : isFast ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <Ticket className="w-3 h-3" />
                <span>{ticketsLeft} available</span>
              </div>
            )}
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
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, concertsRes, matchesRes] = await Promise.all([
          axios.get(`${API}/events?featured=true&limit=6`),
          axios.get(`${API}/events?event_type=concert&limit=4`),
          axios.get(`${API}/events?event_type=match&limit=4`)
        ]);
        setFeaturedEvents(featuredRes.data.slice(0, 6));
        setConcerts(concertsRes.data.slice(0, 4));
        setMatches(matchesRes.data.slice(0, 4));
      } catch (error) { console.error("Error fetching events:", error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Buy F1, Football & Concert Tickets 2026 | EuroMatchTickets"
        description="Europe's #1 official alternative ticket marketplace. Cheapest verified tickets for World Cup 2026, Taylor Swift, Super Bowl, Champions League, F1, MotoGP."
        image="https://euromatchtickets.com/og-image.jpg"
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
          {/* Overlay mesh */}
          <div className="absolute inset-0 hero-mesh" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full py-20 md:py-32">
          <div className="max-w-4xl">
            {/* Live tag */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium tracking-wide">TICKETS ON SALE NOW</span>
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-6 leading-[0.95] tracking-tight"
            >
              <span className="text-white font-extrabold">FIFA WORLD CUP</span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent font-extrabold">
                2026 TICKETS
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-8">
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Be part of history. Verified tickets for the biggest football event ever. 
                <span className="text-amber-600 font-semibold"> 100% secure</span> with instant QR delivery.
              </p>
            </motion.div>

            {/* CTA Row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-12">
              <div className="glass-dark px-6 py-4 rounded-2xl">
                <span className="text-slate-400 text-xs uppercase tracking-widest">Tickets from</span>
                <div className="text-3xl md:text-4xl font-extrabold text-amber-600 mt-0.5">&euro;150</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/world-cup-2026">
                  <Button data-testid="buy-worldcup-btn" className="bg-amber-400 hover:bg-amber-300 text-slate-900 text-lg h-14 px-8 rounded-full font-bold shadow-[0_4px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-[0.97]">
                    Buy World Cup Tickets
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button data-testid="explore-events-btn" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-lg h-14 px-8 rounded-full backdrop-blur-sm transition-all">
                    <Ticket className="w-5 h-5 mr-2" /> All Events
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Trust Strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-wrap items-center gap-6">
              {[
                { icon: CheckCircle, text: "Verified Tickets", color: "text-emerald-600" },
                { icon: Lock, text: "Secure Payment", color: "text-blue-600" },
                { icon: Zap, text: "Instant Delivery", color: "text-amber-600" },
                { icon: Headphones, text: "24/7 Support", color: "text-white/70" },
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-white/80">
                  <t.icon className={`w-4 h-4 ${t.color}`} />{t.text}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ TRUST TICKER ═══════ */}
      <section className="py-5 bg-white border-y border-slate-100 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-12 px-6">
              {[
                { icon: Shield, text: "100% Buyer Protection", color: "text-emerald-600" },
                { icon: Ticket, text: "Instant QR Delivery", color: "text-slate-700" },
                { icon: Star, text: "4.9/5 from 12,847 reviews", color: "text-amber-600" },
                { icon: Lock, text: "SSL Encrypted Payments", color: "text-blue-600" },
                { icon: Globe, text: "Serving 25+ Countries", color: "text-slate-700" },
                { icon: CheckCircle, text: "Verified Sellers Only", color: "text-emerald-600" },
              ].map((item, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ HOTTEST EVENTS CAROUSEL ═══════ */}
      <div className="bg-[#0a0e1a]">
        <FeaturedEventsCarousel />
      </div>

      {/* ═══════ FEATURED EVENTS ═══════ */}
      <section className="py-24 relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 block">Don't Miss Out</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">Featured Events</h2>
              </div>
              <Link to="/events" className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-96 rounded-3xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, i) => <EventCard key={event.event_id} event={event} index={i} />)}
            </div>
          )}
          
          <div className="md:hidden text-center mt-8">
            <Link to="/events" className="btn-secondary inline-flex items-center gap-2">View All Events <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES BENTO ═══════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 block">Browse By Category</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-14">Find Your Perfect Event</h2>
          </FadeInSection>

          {/* Top Row - Hot Events */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {[
              { to: "/taylor-swift-wembley-2026-tickets", label: "ERAS TOUR", title: "Taylor Swift", price: "From €89", color: "from-pink-600 to-purple-800", accent: "text-pink-300" },
              { to: "/super-bowl-2026-tickets", label: "NFL FINAL", title: "Super Bowl 2026", price: "From €899", color: "from-red-700 to-red-900", accent: "text-red-300" },
              { to: "/world-cup-2026", label: "FIFA 2026", title: "World Cup", price: "From €149", color: "from-amber-700 to-amber-900", accent: "text-amber-300" },
              { to: "/champions-league-tickets", label: "UEFA", title: "Champions League", price: "From €85", color: "from-blue-800 to-blue-950", accent: "text-blue-300" },
              { to: "/world-athletics-2026-tickets", label: "TRACK & FIELD", title: "Athletics 2026", price: "From €79", color: "from-sky-700 to-indigo-900", accent: "text-sky-300" },
              { to: "/el-clasico-tickets", label: "EL CLASICO", title: "Real vs Barca", price: "From €199", color: "from-violet-800 to-violet-950", accent: "text-violet-300" },
            ].map((cat, i) => (
              <FadeInSection key={cat.to} delay={i * 0.08}>
                <Link to={cat.to} className="group relative h-44 rounded-2xl overflow-hidden block">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10" />
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <span className={`text-xs font-bold ${cat.accent} mb-1 uppercase tracking-wider`}>{cat.label}</span>
                    <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-white/60">{cat.price}</p>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>

          {/* Racing Row */}
          <FadeInSection delay={0.15}>
            <div className="mb-8 mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" /> Racing Tickets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { to: "/f1-tickets", title: "F1 Tickets", sub: "23 Grand Prix", price: "From \u20ac89", color: "from-red-600 to-red-800" },
                  { to: "/f1-2026-schedule", title: "F1 Schedule", sub: "Full Calendar", price: "Mar - Dec 2026", color: "from-red-500 to-red-700" },
                  { to: "/motogp-tickets", title: "MotoGP", sub: "21 Championship Races", price: "From \u20ac69", color: "from-orange-600 to-orange-800" },
                  { to: "/motogp-2026-schedule", title: "MotoGP Schedule", sub: "Full Calendar", price: "Mar - Nov 2026", color: "from-orange-500 to-orange-700" },
                  { to: "/isle-of-man-tt-tickets", title: "Isle of Man TT", sub: "Legendary Race", price: "From \u20ac149", color: "from-amber-600 to-amber-800" },
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="group relative h-40 rounded-2xl overflow-hidden block hover:scale-[1.03] transition-transform duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                    <div className="relative h-full flex flex-col justify-end p-4">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-white/60">{item.sub}</p>
                      <span className="text-emerald-300 text-xs font-bold mt-1">{item.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Big Category Cards */}
          <FadeInSection delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link to="/events?type=concert" data-testid="category-concerts" className="group relative h-80 rounded-3xl overflow-hidden block">
                <OptimizedImage basePath={getCategoryHero("concert")} alt="Concerts" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-violet-600/10 group-hover:bg-violet-600/20 transition-colors" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <Music className="w-10 h-10 text-violet-300 mb-3" />
                  <h3 className="text-3xl font-bold text-white mb-2">Concerts</h3>
                  <p className="text-slate-300 mb-4">Taylor Swift, Bruno Mars, The Weeknd & more</p>
                  <span className="flex items-center text-violet-300 group-hover:translate-x-2 transition-transform font-medium">
                    Browse Concerts <ChevronRight className="w-5 h-5 ml-1" />
                  </span>
                </div>
              </Link>
              <Link to="/events?type=match" data-testid="category-matches" className="group relative h-80 rounded-3xl overflow-hidden block">
                <OptimizedImage basePath={getCategoryHero("football")} alt="Football" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-emerald-600/20 transition-colors" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <Trophy className="w-10 h-10 text-emerald-300 mb-3" />
                  <h3 className="text-3xl font-bold text-white mb-2">Football</h3>
                  <p className="text-slate-300 mb-4">Champions League, World Cup, Super Bowl & more</p>
                  <span className="flex items-center text-emerald-300 group-hover:translate-x-2 transition-transform font-medium">
                    Browse Matches <ChevronRight className="w-5 h-5 ml-1" />
                  </span>
                </div>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 block">Simple & Fast</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Get your tickets in 3 easy steps</p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Find Your Event", desc: "Browse concerts, matches, F1 races and more across Europe", icon: <Ticket className="w-8 h-8" />, color: "bg-slate-900" },
              { step: "02", title: "Choose Your Seats", desc: "Select from VIP to standing with interactive venue maps", icon: <MapPin className="w-8 h-8" />, color: "bg-amber-400" },
              { step: "03", title: "Get Your QR Code", desc: "Receive your verified digital ticket instantly", icon: <Shield className="w-8 h-8" />, color: "bg-emerald-500" },
            ].map((item, index) => (
              <FadeInSection key={index} delay={index * 0.12}>
                <div className="relative p-8 md:p-10 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 transition-all group hover:shadow-xl">
                  <span className="text-7xl font-extrabold text-slate-100 group-hover:text-slate-200/80 transition-colors absolute top-4 right-6 select-none">{item.step}</span>
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRUST & SECURITY ═══════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <FadeInSection className="text-center mb-14">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4 text-xs">
              <Shield className="w-3.5 h-3.5 mr-1.5" /> TRUSTED PLATFORM
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Why Fans Trust Us</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Your purchase is protected with our comprehensive guarantee</p>
          </FadeInSection>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { label: "Live Events", icon: Ticket, color: "text-slate-900", bg: "bg-slate-100" },
              { label: "Buyer Protected", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Europe-Wide", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "24/7 Support", icon: Headphones, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, idx) => (
              <FadeInSection key={idx} delay={idx * 0.08}>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Trust Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "100% Buyer Protection", desc: "Full refund if tickets are invalid or not delivered. Every ticket verified.", to: "/buyer-protection", color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200" },
              { icon: Lock, title: "Secure Payments", desc: "Bank-level 256-bit SSL encryption via Stripe. Your details are always safe.", to: "/payment-info", color: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-200" },
              { icon: CheckCircle, title: "Verified Sellers", desc: "Every seller undergoes ID verification. Every ticket authenticated.", to: null, color: "text-slate-900", bg: "bg-slate-100", border: "hover:border-slate-300" },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                {item.to ? (
                  <Link to={item.to} className={`bg-white border border-slate-100 rounded-2xl p-7 ${item.border} transition-all group block hover:shadow-lg`}>
                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-5`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-700">{item.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                    <span className={`${item.color} text-sm flex items-center gap-1 font-medium`}>Learn more <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                ) : (
                  <div className={`bg-white border border-slate-100 rounded-2xl p-7 ${item.border} transition-all hover:shadow-lg`}>
                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-5`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                    <span className="text-emerald-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Identity verified</span>
                  </div>
                )}
              </FadeInSection>
            ))}
          </div>

          {/* Security Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-8 border-t border-slate-100">
            {[
              { icon: CreditCard, text: "Powered by Stripe" },
              { icon: Lock, text: "SSL Encrypted" },
              { icon: Award, text: "GDPR Compliant" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-slate-400 text-sm"><item.icon className="w-4 h-4" />{item.text}</span>
            ))}
            <Link to="/buyer-protection" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium">
              <Shield className="w-4 h-4" /> Buyer Protection &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <FadeInSection className="max-w-[1440px] mx-auto px-4 md:px-8 relative text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Ready for Your Next
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              Unforgettable Experience?
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of fans who trust EuroMatchTickets for their live event tickets
          </p>
          <Link to="/events">
            <Button data-testid="cta-btn" className="btn-accent text-lg h-14 px-12">
              Explore All Events <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </FadeInSection>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <FadeInSection className="text-center mb-12">
            <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-200 text-xs">
              <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" /> 4.9/5 from 2,940+ reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">What Fans Say</h2>
            <p className="text-slate-500">Real reviews from verified ticket buyers worldwide</p>
          </FadeInSection>
          
          <ReviewsStats />
          <div className="mt-10"><ReviewsGrid limit={6} /></div>
          
          <div className="text-center mt-8">
            <Link to="/reviews">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full px-8">
                View All Reviews <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
