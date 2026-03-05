import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Ticket, Shield, Star, 
  ChevronRight, Trophy, Flag, Zap, Users, 
  Flame, TrendingUp, Timer
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import axios from 'axios';
import { API } from '../App';

const F1TicketsPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchF1Events = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=f1`);
        const sortedRaces = response.data
          .filter(race => race.title.includes('2026'))
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        setRaces(sortedRaces);
      } catch (error) {
        console.error('Error fetching F1 events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchF1Events();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Formula 1 World Championship 2026",
    "description": "Buy F1 2026 tickets for all Grand Prix races. Monaco GP, Silverstone, Monza, Singapore and more. Best prices guaranteed.",
    "startDate": "2026-03-01",
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "89" }
  };

  // Country flags
  const countryFlags = {
    "Bahrain": "🇧🇭", "Saudi Arabia": "🇸🇦", "Australia": "🇦🇺", "Japan": "🇯🇵",
    "China": "🇨🇳", "USA": "🇺🇸", "Italy": "🇮🇹", "Monaco": "🇲🇨", "Spain": "🇪🇸",
    "Canada": "🇨🇦", "Austria": "🇦🇹", "UK": "🇬🇧", "Hungary": "🇭🇺", "Belgium": "🇧🇪",
    "Netherlands": "🇳🇱", "Singapore": "🇸🇬", "Mexico": "🇲🇽", "Brazil": "🇧🇷",
    "Qatar": "🇶🇦", "UAE": "🇦🇪"
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Featured races for display
  const featuredRaces = races.filter(r => r.featured).slice(0, 6);
  const displayRaces = featuredRaces.length > 0 ? featuredRaces : races.slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="F1 Tickets 2026 - Buy Formula 1 Grand Prix Tickets | Monaco, Silverstone, Monza"
        description="Buy F1 2026 tickets at best prices! Monaco GP, British GP Silverstone, Italian GP Monza, Singapore GP & all 23 races. VIP Hospitality, Grandstand. 100% Buyer Protection. No Service Fees!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg')] opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">2026 Season Tickets On Sale!</span>
          </div>
          
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6">
            <Flag className="w-4 h-4 mr-2" />Formula 1® World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            F1 Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              23 Grand Prix Races Worldwide
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the thrill of Formula 1. From Monaco to Silverstone, Singapore to Abu Dhabi. 
            <strong className="text-white"> Best prices guaranteed - No service fees!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Flag className="w-5 h-5 text-red-400" />
              <span>{races.length || 23} Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-red-400" />
              <span>Mar - Dec 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Users className="w-5 h-5 text-red-400" />
              <span>20 Countries</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€89</div>
            <div className="text-emerald-400 text-sm mt-1">Up to 25% cheaper than competitors</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span>100% Buyer Protection</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Star className="w-5 h-5" />
              <span>Verified Tickets</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span>0% Service Fee</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="w-5 h-5" />
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-12 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">💰 Compare Our F1 Ticket Prices</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-zinc-800/50 rounded-xl">
              <div className="text-zinc-500 text-sm">F1.com Official</div>
              <div className="text-red-400 line-through font-bold text-xl">€399</div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-xl">
              <div className="text-zinc-500 text-sm">StubHub</div>
              <div className="text-red-400 line-through font-bold text-xl">€379</div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-xl">
              <div className="text-zinc-500 text-sm">Viagogo</div>
              <div className="text-red-400 line-through font-bold text-xl">€365</div>
            </div>
            <div className="text-center p-4 bg-emerald-500/20 rounded-xl border-2 border-emerald-500/50">
              <div className="text-emerald-400 text-sm font-medium">EuroMatchTickets</div>
              <div className="text-emerald-400 font-black text-2xl">€189</div>
            </div>
          </div>
          <p className="text-zinc-500 text-xs text-center mt-4">*Average Grandstand prices. Prices vary by race.</p>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">🏎️ Featured F1 Races 2026</h2>
            <Link to="/events?type=f1" className="text-red-400 hover:text-red-300 flex items-center gap-1">
              View All Races <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {displayRaces.map((race, i) => (
                <Link 
                  key={race.event_id || i} 
                  to={`/event/${race.event_id}`}
                  className="group flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-red-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center text-3xl">
                      {countryFlags[race.country] || '🏁'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold group-hover:text-red-400">{race.title}</h3>
                        {race.featured && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            <Flame className="w-3 h-3 mr-1" />HOT
                          </Badge>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm">
                        {formatDate(race.event_date)} • {race.venue}, {race.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 text-sm">
                      {race.available_tickets || 0} tickets
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-zinc-500">From</div>
                      <div className="text-xl font-bold text-red-400">
                        €{race.lowest_price ? Math.round(race.lowest_price) : '89'}
                      </div>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600">
                      <Ticket className="w-4 h-4 mr-2" />Buy
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/events?type=f1">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 px-8">
                <Flag className="w-5 h-5 mr-2" />
                View All {races.length || 23} F1 Races
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ticket Categories */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Choose Your F1 Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "General Admission", price: "€89 - €199", desc: "Access to general viewing areas", icon: Users },
              { name: "Grandstand", price: "€189 - €599", desc: "Reserved seating with track views", icon: Ticket },
              { name: "VIP Hospitality", price: "€999 - €2,999", desc: "Premium experience with food & drinks", icon: Trophy },
              { name: "Paddock Club", price: "€2,999 - €7,999", desc: "Ultimate F1 experience", icon: Star }
            ].map((cat, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-700 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                <cat.icon className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{cat.desc}</p>
                <div className="text-lg font-bold text-emerald-400">{cat.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why Buy F1 Tickets From Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Best Prices Guaranteed", desc: "Up to 25% cheaper than official F1 and competitors" },
              { title: "100% Buyer Protection", desc: "Full refund if tickets are invalid or event cancelled" },
              { title: "Instant QR Delivery", desc: "Receive your tickets immediately via email" },
              { title: "0% Service Fees", desc: "The price you see is the price you pay" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-zinc-900/50 rounded-xl">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for the F1 2026 Season?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Don't miss Monaco, Silverstone, Monza and more. Book now and save up to 25%!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events?type=f1">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 px-8">
                <Ticket className="w-5 h-5 mr-2" />
                Browse All F1 Tickets
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default F1TicketsPage;
