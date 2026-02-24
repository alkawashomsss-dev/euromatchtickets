import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Calendar, MapPin, Ticket, TrendingUp, Shield, Star, 
  ChevronRight, Users, Music, Trophy, ArrowRight, Sparkles,
  CheckCircle, Lock, CreditCard, Headphones, Award, Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

// SEO: Buy concert tickets, Champions League tickets, Taylor Swift tickets, Drake concert,
// European football tickets, music festival tickets, secure ticket resale marketplace

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const EventCard = ({ event }) => {
  const dateInfo = formatDate(event.event_date);
  const isMatch = event.event_type === "match";

  return (
    <Link 
      to={`/event/${event.event_id}`}
      data-testid={`event-card-${event.event_id}`}
      className="event-card group block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.event_image || (isMatch 
            ? "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600"
            : "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600"
          )}
          alt={event.title}
          loading="lazy"
          decoding="async"
          width="400"
          height="192"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="img-overlay" />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={isMatch ? "tag-match" : "tag-concert"}>
            {isMatch ? <Trophy className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
            {isMatch ? "Match" : "Concert"}
          </Badge>
        </div>

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-zinc-400 text-sm mb-3">{event.subtitle}</p>
        )}

        {/* Teams for matches */}
        {isMatch && event.home_team && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full p-1 flex items-center justify-center">
                <img src={event.home_logo} alt="" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
              </div>
              <span className="font-medium text-sm">{event.home_team}</span>
            </div>
            <span className="text-zinc-600 text-sm">vs</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{event.away_team}</span>
              <div className="w-8 h-8 bg-white/5 rounded-full p-1 flex items-center justify-center">
                <img src={event.away_logo} alt="" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{dateInfo.month} {dateInfo.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{event.city}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {event.lowest_price ? (
            <div>
              <span className="text-zinc-500 text-xs">From</span>
              <span className="text-2xl font-bold ml-2">€{event.lowest_price.toFixed(0)}</span>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm">No tickets available</span>
          )}
          
          {event.available_tickets > 0 && (
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              {event.available_tickets} tickets
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const { user, login } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`${API}/seed`);
        
        const [featuredRes, concertsRes, matchesRes] = await Promise.all([
          axios.get(`${API}/events?featured=true`),
          axios.get(`${API}/events?event_type=concert`),
          axios.get(`${API}/events?event_type=match`)
        ]);
        
        setFeaturedEvents(featuredRes.data.slice(0, 6));
        setConcerts(concertsRes.data.slice(0, 4));
        setMatches(matchesRes.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] font-body">
      <SEOHead 
        title="Buy Football & Concert Tickets in Europe"
        description="Europe's #1 ticket marketplace. Buy verified tickets for Champions League, Premier League, La Liga, Taylor Swift, Coldplay and more. 100% secure with instant QR delivery."
        image="https://euromatchtickets.com/og-image.jpg"
      />
      
      {/* Hero Section - Crystal Edition */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Stadium Background with Vignette */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1735587804724-5d9511bce0cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxjcm93ZGVkJTIwZm9vdGJhbGwlMjBzdGFkaXVtJTIwbmlnaHQlMjBsaWdodHMlMjBsdXh1cnl8ZW58MHx8fHwxNzcxOTI5Mzk4fDA&ixlib=rb-4.1.0&q=85&w=1920)',
              opacity: 0.5
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 to-transparent" />
          {/* Stadium Glow Effect */}
          <div className="absolute inset-0 stadium-glow" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full py-32">
          <div className="max-w-3xl">
            {/* Premium Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="glass-card px-5 py-2.5 rounded-full inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 font-accent text-sm tracking-wide">EUROPE'S #1 TICKET MARKETPLACE</span>
              </div>
            </div>
            
            {/* Hero Title - Crystal Typography */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl mb-6 leading-none tracking-tight">
              LIVE EVENTS.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CRYSTAL MOMENTS.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed">
              Premium verified tickets for concerts and football matches. 
              Experience the stadium atmosphere with 100% secure transactions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button 
                  data-testid="explore-events-btn"
                  className="btn-crystal text-lg h-14 px-10 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Explore Events
                </Button>
              </Link>
              {!user && (
                <Button 
                  data-testid="start-selling-btn"
                  onClick={login}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-lg h-14 px-10 rounded-full backdrop-blur-sm transition-all"
                >
                  Start Selling
                </Button>
              )}
            </div>

            {/* Stats - Glass Style */}
            <div className="flex items-center gap-6 mt-16">
              <div className="glass-card px-6 py-4 rounded-2xl text-center">
                <div className="text-2xl font-bold font-accent text-cyan-400">50K+</div>
                <div className="text-zinc-500 text-xs uppercase tracking-wider">Happy Fans</div>
              </div>
              <div className="glass-card px-6 py-4 rounded-2xl text-center">
                <div className="text-2xl font-bold font-accent text-purple-400">1000+</div>
                <div className="text-zinc-500 text-xs uppercase tracking-wider">Events</div>
              </div>
              <div className="glass-card px-6 py-4 rounded-2xl text-center">
                <div className="text-2xl font-bold font-accent flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4" />
                  4.9
                </div>
                <div className="text-zinc-500 text-xs uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Crystal Floating Elements */}
        <div className="absolute right-10 top-1/3 hidden lg:block animate-float">
          <div className="w-24 h-24 rounded-2xl glass-card crystal-glow" />
        </div>
        <div className="absolute right-40 bottom-1/4 hidden lg:block animate-float" style={{animationDelay: '2s'}}>
          <div className="w-16 h-16 rounded-xl glass-card" style={{boxShadow: '0 0 30px rgba(192, 132, 252, 0.2)'}} />
        </div>
      </section>

      {/* World Cup Raffle Banner - Gold VIP Style */}
      <section className="py-6 stadium-glow-gold">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <Link 
            to="/world-cup-raffle"
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 glass-card rounded-2xl border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
            data-testid="raffle-banner"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-amber-600/30 rounded-full flex items-center justify-center animate-glow-pulse" style={{boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'}}>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-400 text-sm font-accent tracking-wider mb-1">VIP RAFFLE - WIN A TRIP!</p>
                <h3 className="text-xl md:text-2xl font-display">WORLD CUP 2026</h3>
                <p className="text-zinc-400 text-sm">7 nights + flights + tickets for 2 people!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-accent text-yellow-400 neon-text-gold">€100</p>
                <p className="text-xs text-zinc-500 uppercase">Entry</p>
              </div>
              <div className="btn-gold px-6 py-3 rounded-full group-hover:scale-105 transition-transform">
                Enter Now →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 relative">
        <div className="absolute inset-0 stadium-glow opacity-30" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Events</h2>
              <p className="text-zinc-400">Don't miss these hot tickets</p>
            </div>
            <Link 
              to="/events" 
              className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="event-card h-96 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Hot Landing Pages - 2026 Events */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🔥 Hot Right Now</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/world-cup-2026"
                className="group relative h-40 rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-yellow-400 text-xs font-bold mb-1">⚽ FIFA 2026</span>
                  <h3 className="text-lg font-bold">World Cup Tickets</h3>
                  <p className="text-xs text-zinc-400">From €150</p>
                </div>
              </Link>
              
              <Link 
                to="/champions-league-tickets"
                className="group relative h-40 rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-blue-400 text-xs font-bold mb-1">⭐ UEFA</span>
                  <h3 className="text-lg font-bold">Champions League</h3>
                  <p className="text-xs text-zinc-400">From €85</p>
                </div>
              </Link>
              
              <Link 
                to="/the-weeknd-tour-2026"
                className="group relative h-40 rounded-2xl overflow-hidden border border-red-500/20 hover:border-red-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-red-400 text-xs font-bold mb-1">🎤 WORLD TOUR</span>
                  <h3 className="text-lg font-bold">The Weeknd 2026</h3>
                  <p className="text-xs text-zinc-400">From €95</p>
                </div>
              </Link>
              
              <Link 
                to="/bruno-mars-tour-2026"
                className="group relative h-40 rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-amber-400 text-xs font-bold mb-1">🔥 6 NIGHTS WEMBLEY</span>
                  <h3 className="text-lg font-bold">Bruno Mars</h3>
                  <p className="text-xs text-zinc-400">From €125</p>
                </div>
              </Link>
            </div>
            
            {/* Second Row - More Artists */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Link 
                to="/guns-n-roses-tour-2026"
                className="group relative h-40 rounded-2xl overflow-hidden border border-yellow-500/20 hover:border-yellow-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-yellow-400 text-xs font-bold mb-1">🎸 STADIUM ROCK</span>
                  <h3 className="text-lg font-bold">Guns N' Roses</h3>
                  <p className="text-xs text-zinc-400">From €95</p>
                </div>
              </Link>
              
              <Link 
                to="/bad-bunny-london-2026"
                className="group relative h-40 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-purple-400 text-xs font-bold mb-1">🌴 REGGAETON</span>
                  <h3 className="text-lg font-bold">Bad Bunny London</h3>
                  <p className="text-xs text-zinc-400">From €145</p>
                </div>
              </Link>
              
              <Link 
                to="/events?type=match"
                className="group relative h-40 rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-emerald-400 text-xs font-bold mb-1">⚽ FOOTBALL</span>
                  <h3 className="text-lg font-bold">All Matches</h3>
                  <p className="text-xs text-zinc-400">Premier League, La Liga & more</p>
                </div>
              </Link>
              
              <Link 
                to="/events?type=concert"
                className="group relative h-40 rounded-2xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-zinc-900" />
                <div className="relative h-full flex flex-col justify-end p-4">
                  <span className="text-pink-400 text-xs font-bold mb-1">🎤 CONCERTS</span>
                  <h3 className="text-lg font-bold">All Concerts</h3>
                  <p className="text-xs text-zinc-400">Taylor Swift, Drake & more</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Concerts */}
            <Link 
              to="/events?type=concert"
              data-testid="category-concerts"
              className="group relative h-80 rounded-3xl overflow-hidden"
            >
              <img 
                src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
                alt="Concerts"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
              <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <Music className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-3xl font-bold mb-2">Concerts</h3>
                <p className="text-zinc-400 mb-4">Taylor Swift, Coldplay, Drake & more</p>
                <div className="flex items-center text-purple-400 group-hover:translate-x-2 transition-transform">
                  Browse Concerts <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </Link>

            {/* Football */}
            <Link 
              to="/events?type=match"
              data-testid="category-matches"
              className="group relative h-80 rounded-3xl overflow-hidden"
            >
              <img 
                src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
                alt="Football"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
              <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <Trophy className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-3xl font-bold mb-2">Football</h3>
                <p className="text-zinc-400 mb-4">Champions League, Premier League, La Liga</p>
                <div className="flex items-center text-emerald-400 group-hover:translate-x-2 transition-transform">
                  Browse Matches <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Get your tickets in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Your Event",
                description: "Browse concerts, matches, and more across Europe",
                icon: <Ticket className="w-8 h-8" />,
                color: "from-purple-500/20 to-pink-500/20"
              },
              {
                step: "02",
                title: "Choose Your Seats",
                description: "Select from VIP to standing with our interactive venue maps",
                icon: <MapPin className="w-8 h-8" />,
                color: "from-blue-500/20 to-cyan-500/20"
              },
              {
                step: "03",
                title: "Get Your QR Code",
                description: "Receive your verified digital ticket instantly",
                icon: <Shield className="w-8 h-8" />,
                color: "from-emerald-500/20 to-teal-500/20"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative p-8 rounded-3xl border border-white/5 bg-zinc-900/30 hover:border-white/10 transition-all group"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <span className="text-7xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
                    {item.step}
                  </span>
                  <div className="mt-4 mb-6 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
              <Shield className="w-4 h-4 mr-2" />
              TRUSTED PLATFORM
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Fans Trust Us</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Over 50,000 satisfied customers across Europe
            </p>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: "50K+", label: "Happy Customers", icon: Users, color: "text-purple-400" },
              { number: "€2M+", label: "Tickets Sold", icon: Ticket, color: "text-emerald-400" },
              { number: "4.9★", label: "Trust Rating", icon: Star, color: "text-yellow-400" },
              { number: "24/7", label: "AI Support", icon: Headphones, color: "text-blue-400" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <p className="text-3xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Trust Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Buyer Protection</h3>
              <p className="text-zinc-400 text-sm">
                Full refund if event is cancelled. Every ticket verified before sale.
              </p>
            </div>
            
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-zinc-400 text-sm">
                Bank-level encryption via Stripe. Your payment details are always safe.
              </p>
            </div>
            
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Tickets</h3>
              <p className="text-zinc-400 text-sm">
                Every seller verified. Every ticket authenticated before delivery.
              </p>
            </div>
          </div>

          {/* Security Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-500">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Lock className="w-5 h-5" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Award className="w-5 h-5" />
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Globe className="w-5 h-5" />
              <span className="text-sm">Available in 20+ Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unforgettable Experience?
            </span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of fans who trust EuroMatchTickets for their live event tickets
          </p>
          <Link to="/events">
            <Button data-testid="cta-btn" className="btn-accent text-lg h-14 px-12">
              Explore All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-zinc-900/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EuroMatchTickets</span>
              </div>
              <p className="text-zinc-500 text-sm">
                Europe's trusted ticket marketplace for concerts and football matches.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Events</h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <Link to="/events" className="hover:text-white transition-colors">All Events</Link>
                <Link to="/events?type=concert" className="hover:text-white transition-colors">Concerts</Link>
                <Link to="/events?type=match" className="hover:text-white transition-colors">Football</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">
              © 2025 EuroMatchTickets. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span>Secure payments with Stripe</span>
              <span>100% Buyer Protection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
