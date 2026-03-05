import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Ticket, Shield, Star, 
  ChevronRight, Trophy, Flag, Zap, Users, CheckCircle,
  Flame, Award, Globe, CreditCard, Loader2
} from 'lucide-react';
import axios from 'axios';
import { API } from '../App';

// Country flag mapping
const countryFlags = {
  "Bahrain": "🇧🇭",
  "Saudi Arabia": "🇸🇦",
  "Australia": "🇦🇺",
  "Japan": "🇯🇵",
  "China": "🇨🇳",
  "USA": "🇺🇸",
  "Italy": "🇮🇹",
  "Monaco": "🇲🇨",
  "Spain": "🇪🇸",
  "Canada": "🇨🇦",
  "Austria": "🇦🇹",
  "UK": "🇬🇧",
  "Hungary": "🇭🇺",
  "Belgium": "🇧🇪",
  "Netherlands": "🇳🇱",
  "Singapore": "🇸🇬",
  "Mexico": "🇲🇽",
  "Brazil": "🇧🇷",
  "Qatar": "🇶🇦",
  "UAE": "🇦🇪",
};

// Ticket categories
const ticketCategories = [
  {
    name: "General Admission",
    description: "Access to general viewing areas around the circuit",
    priceRange: "€99 - €249",
    icon: <Users className="w-5 h-5" />,
    color: "zinc"
  },
  {
    name: "Grandstand",
    description: "Reserved seating with excellent track views",
    priceRange: "€189 - €599",
    icon: <Ticket className="w-5 h-5" />,
    color: "blue"
  },
  {
    name: "VIP Hospitality",
    description: "Premium experience with food, drinks & paddock access",
    priceRange: "€999 - €2,999",
    icon: <Trophy className="w-5 h-5" />,
    color: "purple"
  },
  {
    name: "Paddock Club",
    description: "Ultimate F1 experience with pit lane walks & driver appearances",
    priceRange: "€2,999 - €7,999",
    icon: <Award className="w-5 h-5" />,
    color: "amber"
  }
];

// Night races
const nightRaces = ["Bahrain", "Saudi Arabia", "Singapore", "Qatar", "UAE", "Las Vegas"];

// Legendary circuits
const legendaryCircuits = ["Monaco", "Silverstone", "Monza", "Spa"];

const F1TicketsPage = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchF1Events = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=f1`);
        // Sort by date and filter for 2026 races
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

  const filteredRaces = races.filter(race => {
    const isNightRace = nightRaces.some(n => race.city?.includes(n) || race.country?.includes(n) || race.title?.includes(n));
    const isLegendary = legendaryCircuits.some(c => race.venue?.includes(c) || race.title?.includes(c));
    const isEurope = ['Italy', 'Spain', 'Monaco', 'Belgium', 'Netherlands', 'Austria', 'Hungary', 'UK'].includes(race.country);
    
    if (filter === 'featured') return race.featured;
    if (filter === 'night') return isNightRace;
    if (filter === 'legendary') return isLegendary;
    if (filter === 'europe') return isEurope;
    return true;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const isNightRace = (race) => nightRaces.some(n => race.city?.includes(n) || race.country?.includes(n) || race.title?.includes(n));
  const isLegendary = (race) => legendaryCircuits.some(c => race.venue?.includes(c) || race.title?.includes(c));

  // Total tickets count
  const totalTickets = races.reduce((sum, race) => sum + (race.available_tickets || 0), 0);

  // Schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Formula 1 2026 Tickets",
    "description": "Buy F1 2026 tickets for all Grand Prix races. Best prices for Monaco GP, Silverstone, Monza, Singapore and more.",
    "numberOfItems": races.length,
    "itemListElement": races.map((race, index) => ({
      "@type": "Event",
      "position": index + 1,
      "name": race.title,
      "startDate": race.event_date,
      "location": {
        "@type": "Place",
        "name": race.venue,
        "address": `${race.city}, ${race.country}`
      },
      "offers": {
        "@type": "Offer",
        "lowPrice": race.lowest_price || 169,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>F1 Tickets 2026 - Buy Formula 1 Grand Prix Tickets | Monaco, Silverstone, Monza | EuroMatchTickets</title>
        <meta name="description" content="Buy F1 2026 tickets at best prices! Get Formula 1 Grand Prix tickets for Monaco GP, British GP Silverstone, Italian GP Monza, Singapore GP & all races. VIP Hospitality, Grandstand & General Admission. 100% Buyer Protection. No Service Fees!" />
        <meta name="keywords" content="F1 tickets, Formula 1 tickets 2026, F1 2026, Monaco Grand Prix tickets, Silverstone F1 tickets, Monza F1 tickets, Singapore GP tickets, buy F1 tickets, Formula 1 VIP tickets, F1 hospitality, Grand Prix tickets, F1 races 2026, Abu Dhabi GP tickets, Las Vegas F1 tickets, Miami GP tickets, Dutch GP tickets Zandvoort, Spa F1 tickets, Barcelona F1 tickets, Red Bull Ring tickets, Japanese GP Suzuka tickets, Australian GP Melbourne tickets" />
        <link rel="canonical" href="https://euromatchtickets.com/f1-tickets" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920')] opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            {/* F1 Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              Formula 1® World Championship 2026
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-white">F1 TICKETS</span>
              <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">2026 SEASON</span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
              Get your tickets for all {races.length} Formula 1 Grand Prix races. From Monaco to Silverstone, 
              Singapore to Abu Dhabi. <strong className="text-white">Best prices guaranteed - No service fees!</strong>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-xl">
                <Flag className="w-5 h-5 text-red-400" />
                <span className="text-white font-bold">{races.length} Races</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-xl">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-white font-bold">{new Set(races.map(r => r.country)).size} Countries</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-xl">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-bold">{totalTickets.toLocaleString()}+ Tickets</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">0% Service Fee</span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-white mb-4">💰 Compare Our F1 Ticket Prices:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <div className="text-zinc-500 text-sm">F1.com Official</div>
                  <div className="text-red-400 line-through font-bold">€399</div>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <div className="text-zinc-500 text-sm">StubHub</div>
                  <div className="text-red-400 line-through font-bold">€379</div>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <div className="text-zinc-500 text-sm">Viagogo</div>
                  <div className="text-red-400 line-through font-bold">€365</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <div className="text-emerald-400 text-sm font-medium">EuroMatchTickets</div>
                  <div className="text-emerald-400 font-black text-xl">€189</div>
                </div>
              </div>
              <p className="text-zinc-500 text-xs mt-3">*Average prices for Grandstand tickets. Prices vary by race.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Categories */}
      <section className="py-16 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Choose Your F1 Experience
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ticketCategories.map((cat, index) => (
              <div key={index} className="bg-zinc-900/50 border border-zinc-700 rounded-2xl p-6 hover:border-zinc-500 transition-colors">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-300 mb-4">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{cat.description}</p>
                <div className="text-lg font-bold text-emerald-400">{cat.priceRange}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Race Calendar */}
      <section className="py-16" id="races">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                F1 2026 Race Calendar
              </h2>
              <p className="text-zinc-400 mt-1">Select a race to view available tickets</p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Races' },
                { id: 'featured', label: '🔥 Popular' },
                { id: 'europe', label: '🇪🇺 Europe' },
                { id: 'night', label: '🌙 Night Races' },
                { id: 'legendary', label: '🏆 Legendary' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === f.id 
                      ? 'bg-red-500 text-white' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                  data-testid={`filter-${f.id}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          ) : (
            /* Race Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaces.map((race) => (
                <div 
                  key={race.event_id}
                  className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/10"
                  data-testid={`race-card-${race.event_id}`}
                >
                  {/* Race Header */}
                  <div className="relative h-32 bg-gradient-to-br from-red-600/20 to-zinc-900 flex items-center justify-center">
                    <span className="text-6xl">{countryFlags[race.country] || '🏁'}</span>
                    {isLegendary(race) && (
                      <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Legendary
                      </div>
                    )}
                    {isNightRace(race) && (
                      <div className="absolute top-3 left-3 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-bold">
                        🌙 Night Race
                      </div>
                    )}
                    {race.featured && !isLegendary(race) && (
                      <div className="absolute top-3 right-3 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Hot
                      </div>
                    )}
                  </div>

                  {/* Race Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                      {race.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-3">{race.venue}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(race.event_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {race.country}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-zinc-500">From</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          €{race.lowest_price ? Math.round(race.lowest_price) : '169'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">{race.available_tickets || 0} tickets</div>
                        <Link 
                          to={`/event/${race.event_id}`}
                          className="inline-flex items-center gap-1 mt-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          data-testid={`buy-tickets-${race.event_id}`}
                        >
                          Buy Tickets <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredRaces.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">No races found matching your filter.</p>
              <button 
                onClick={() => setFilter('all')}
                className="mt-4 text-red-400 hover:text-red-300 font-medium"
              >
                Show all races
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="py-16 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why Buy F1 Tickets From EuroMatchTickets?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Buyer Protection",
                description: "Full refund if tickets are invalid or event is cancelled"
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "No Hidden Fees",
                description: "The price you see is the price you pay - 0% service fee"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Delivery",
                description: "Receive your tickets immediately via email with QR code"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Best Prices",
                description: "Up to 25% cheaper than official F1 and competitors"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center text-red-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches - SEO */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">Popular F1 Ticket Searches:</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Monaco Grand Prix tickets",
              "Silverstone F1 tickets",
              "Monza F1 tickets",
              "Singapore GP tickets",
              "Abu Dhabi F1 tickets",
              "Las Vegas Grand Prix",
              "Miami F1 2026",
              "Dutch GP Zandvoort",
              "Spa Francorchamps tickets",
              "Japanese GP Suzuka",
              "Australian GP Melbourne",
              "F1 VIP hospitality",
              "F1 Paddock Club tickets",
              "Formula 1 grandstand seats",
              "F1 weekend pass",
              "F1 3-day tickets"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded-full text-sm hover:bg-zinc-700 transition-colors cursor-pointer">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO */}
      <section className="py-16 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Frequently Asked Questions - F1 Tickets
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I receive my F1 tickets?",
                a: "After purchase, you'll receive your tickets instantly via email as a downloadable PDF with QR code. Simply show the QR code on your phone at the circuit entrance."
              },
              {
                q: "Are EuroMatchTickets F1 tickets genuine?",
                a: "Yes, all our F1 tickets are 100% genuine and verified. We work with authorized sellers and offer a full money-back guarantee if any ticket is found to be invalid."
              },
              {
                q: "Can I get a refund if the race is cancelled?",
                a: "Absolutely. If a Grand Prix is cancelled and not rescheduled, you will receive a full refund within 5-10 business days."
              },
              {
                q: "What's included in VIP Hospitality tickets?",
                a: "VIP Hospitality includes premium grandstand seating, gourmet food & drinks, pit lane walks, driver appearances, and exclusive paddock access depending on the package."
              },
              {
                q: "Why are your prices lower than F1.com?",
                a: "We charge 0% service fees and work directly with ticket holders. This allows us to offer prices up to 25% lower than official channels and competitors like StubHub or Viagogo."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900/30 to-orange-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for the Ultimate F1 Experience?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Don't miss the 2026 Formula 1 season. Book your tickets now and save up to 25%!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#races" 
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold transition-colors"
              data-testid="browse-races-btn"
            >
              <Ticket className="w-5 h-5" />
              Browse All F1 Races
            </a>
            <Link 
              to="/events" 
              className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              View Football Tickets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default F1TicketsPage;
