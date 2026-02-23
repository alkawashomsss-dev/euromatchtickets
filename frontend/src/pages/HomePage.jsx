import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Calendar, MapPin, Ticket, TrendingUp, Shield, Star, 
  ChevronRight, Users, Music, Trophy, ArrowRight, Sparkles
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
    <div className="min-h-screen bg-zinc-950">
      <SEOHead 
        title="Buy Football & Concert Tickets in Europe"
        description="Europe's #1 ticket marketplace. Buy verified tickets for Champions League, Premier League, La Liga, Taylor Swift, Coldplay and more. 100% secure with instant QR delivery."
        image="https://euromatchtickets.com/og-image.jpg"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
          <div className="absolute inset-0 gradient-glow" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-slide-up">
              <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-1.5">
                <Sparkles className="w-4 h-4 mr-2" />
                Europe's #1 Ticket Marketplace
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up stagger-1 leading-tight">
              Live Events.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Unforgettable Moments.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl animate-slide-up stagger-2">
              Buy and sell verified tickets for concerts, football matches, and more. 
              100% secure transactions with buyer protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
              <Link to="/events">
                <Button 
                  data-testid="explore-events-btn"
                  className="btn-accent text-lg h-14 px-10 rounded-full"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Explore Events
                </Button>
              </Link>
              {!user && (
                <Button 
                  data-testid="start-selling-btn"
                  onClick={login}
                  className="btn-secondary text-lg h-14 px-10"
                >
                  Start Selling
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-16 animate-slide-up stagger-4">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-zinc-500 text-sm">Happy Fans</div>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-zinc-500 text-sm">Events</div>
              </div>
              <div className="w-px h-12 bg-zinc-800" />
              <div className="text-center">
                <div className="text-3xl font-bold flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400" />
                  4.9
                </div>
                <div className="text-zinc-500 text-sm">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute right-10 top-1/3 hidden lg:block animate-float">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-white/10" />
        </div>
        <div className="absolute right-40 bottom-1/4 hidden lg:block animate-float" style={{animationDelay: '2s'}}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur border border-white/10" />
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 relative">
        <div className="absolute inset-0 gradient-glow opacity-30" />
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

          {/* More Categories */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Link to="/events?type=train" className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all text-center">
              <span className="text-2xl mb-2 block">🚄</span>
              <span className="font-medium">Trains</span>
              <span className="block text-xs text-zinc-500">17 routes</span>
            </Link>
            <Link to="/events?type=attraction" className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all text-center">
              <span className="text-2xl mb-2 block">🏛️</span>
              <span className="font-medium">Attractions</span>
              <span className="block text-xs text-zinc-500">12 places</span>
            </Link>
            <Link to="/events?type=festival" className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all text-center">
              <span className="text-2xl mb-2 block">🎪</span>
              <span className="font-medium">Festivals</span>
              <span className="block text-xs text-zinc-500">8 events</span>
            </Link>
            <Link to="/events?type=f1" className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-red-500/30 transition-all text-center">
              <span className="text-2xl mb-2 block">🏎️</span>
              <span className="font-medium">Formula 1</span>
              <span className="block text-xs text-zinc-500">7 races</span>
            </Link>
            <Link to="/events?type=tennis" className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-green-500/30 transition-all text-center">
              <span className="text-2xl mb-2 block">🎾</span>
              <span className="font-medium">Tennis</span>
              <span className="block text-xs text-zinc-500">7 events</span>
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

      {/* Trust Badges */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-zinc-400">
              <Shield className="w-6 h-6 text-emerald-500" />
              <span>100% Buyer Protection</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Users className="w-6 h-6 text-purple-500" />
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Ticket className="w-6 h-6 text-blue-500" />
              <span>Instant QR Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Star className="w-6 h-6 text-amber-500" />
              <span>Trusted by 50K+ Fans</span>
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
