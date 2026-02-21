import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Calendar, MapPin, Ticket, TrendingUp, Shield, Star, 
  ChevronRight, Users, Trophy, ArrowRight 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

// SEO Keywords: Buy Champions League tickets, Premier League tickets online, La Liga tickets resale, 
// European football tickets, UEFA tickets marketplace, secure ticket resale, verified football tickets

const leagueConfig = {
  champions_league: {
    name: "UEFA Champions League",
    color: "from-blue-600 to-blue-800",
    badge: "badge-champions",
    textColor: "text-blue-400"
  },
  premier_league: {
    name: "Premier League",
    color: "from-purple-600 to-purple-800",
    badge: "badge-premier",
    textColor: "text-purple-400"
  },
  la_liga: {
    name: "La Liga",
    color: "from-red-600 to-red-800",
    badge: "badge-laliga",
    textColor: "text-red-400"
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const MatchCard = ({ match, featured = false }) => {
  const dateInfo = formatDate(match.match_date);
  const league = leagueConfig[match.league];

  return (
    <Link 
      to={`/match/${match.match_id}`}
      data-testid={`match-card-${match.match_id}`}
      className={`ticket-card card-dark group block ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
        {/* League Badge */}
        <div className="flex items-center justify-between mb-6">
          <Badge className={`${league.badge} text-xs font-bold uppercase tracking-wider`}>
            {league.name}
          </Badge>
          {match.available_tickets > 0 && (
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              {match.available_tickets} tickets
            </Badge>
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/5 rounded-full p-2 flex items-center justify-center">
              <img 
                src={match.home_logo} 
                alt={match.home_team}
                className="w-12 h-12 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h3 className={`font-bold uppercase ${featured ? 'text-xl' : 'text-lg'}`}>
              {match.home_team}
            </h3>
          </div>

          <div className="flex flex-col items-center px-4">
            <span className="text-3xl font-black text-slate-600">VS</span>
          </div>

          <div className="flex-1 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/5 rounded-full p-2 flex items-center justify-center">
              <img 
                src={match.away_logo} 
                alt={match.away_team}
                className="w-12 h-12 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <h3 className={`font-bold uppercase ${featured ? 'text-xl' : 'text-lg'}`}>
              {match.away_team}
            </h3>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{dateInfo.day}, {dateInfo.month} {dateInfo.date} - {dateInfo.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.stadium}</span>
          </div>
        </div>

        {/* Price */}
        {match.lowest_price && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-slate-500 text-sm">From</span>
            <span className="text-2xl font-black text-white">
              €{match.lowest_price.toFixed(0)}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 flex items-center justify-center text-sm text-slate-400 group-hover:text-white transition-colors">
          <span>View Tickets</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const { user, login } = useAuth();
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data first
        await axios.post(`${API}/seed`);
        
        // Fetch matches
        const [featuredRes, allRes] = await Promise.all([
          axios.get(`${API}/matches?featured=true`),
          axios.get(`${API}/matches`)
        ]);
        
        setFeaturedMatches(featuredRes.data.slice(0, 4));
        setAllMatches(allRes.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 floodlight" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <div className="max-w-3xl">
            <Badge className="badge-champions mb-6 animate-slide-up">
              #1 Trusted Ticket Marketplace
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-6 animate-slide-up stagger-1">
              Your Seat
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Awaits
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl animate-slide-up stagger-2">
              Buy and sell verified tickets for UEFA Champions League, Premier League, 
              and La Liga matches. 100% secure transactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
              <Link to="/matches">
                <Button 
                  data-testid="browse-matches-btn"
                  className="btn-primary text-lg h-14 px-10"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Browse Matches
                </Button>
              </Link>
              {!user && (
                <Button 
                  data-testid="start-selling-btn"
                  variant="outline" 
                  className="btn-outline text-lg h-14 px-10"
                  onClick={login}
                >
                  Start Selling
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-12 animate-slide-up stagger-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">Verified Tickets</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm">50K+ Happy Fans</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Matches */}
      <section className="py-20 md:py-32 pitch-pattern">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                Featured Matches
              </h2>
              <p className="text-slate-400">Don't miss these upcoming blockbusters</p>
            </div>
            <Link 
              to="/matches" 
              className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="card-dark h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMatches.map((match, index) => (
                <MatchCard 
                  key={match.match_id} 
                  match={match} 
                  featured={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leagues Section */}
      <section className="py-20 md:py-32 bg-slate-900/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Top European Leagues
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Access tickets for the most prestigious football competitions in the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(leagueConfig).map(([key, league]) => (
              <Link
                key={key}
                to={`/matches?league=${key}`}
                data-testid={`league-${key}`}
                className="group relative overflow-hidden rounded-2xl h-64"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${league.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                  <Trophy className="w-12 h-12 mb-4 text-white/80" />
                  <h3 className="text-2xl font-bold uppercase text-white mb-2">
                    {league.name}
                  </h3>
                  <span className="text-white/60 text-sm group-hover:text-white transition-colors flex items-center gap-1">
                    Browse Tickets <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Buy verified tickets in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Your Match",
                description: "Browse upcoming matches from Champions League, Premier League, and La Liga",
                icon: <Ticket className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Choose Your Seat",
                description: "Select from VIP boxes to general admission with our interactive stadium map",
                icon: <MapPin className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Get Your QR Code",
                description: "Receive your verified digital ticket instantly after secure payment",
                icon: <Shield className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative p-8 border border-white/5 rounded-2xl hover:border-white/20 transition-colors group"
              >
                <span className="absolute top-4 right-4 text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                  {item.step}
                </span>
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-green-400">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
            Ready to Experience
            <br />
            <span className="gold-shine">Live Football?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of fans who trust FanPass for their match day experience
          </p>
          <Link to="/matches">
            <Button data-testid="explore-tickets-btn" className="btn-primary text-lg h-14 px-12">
              Explore All Tickets
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-green-500" />
              <span className="text-xl font-bold uppercase tracking-tight">FanPass</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <Link to="/matches" className="hover:text-white transition-colors">Matches</Link>
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 FanPass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
