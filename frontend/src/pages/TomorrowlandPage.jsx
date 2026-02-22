import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, PartyPopper, Star, Shield, ChevronRight, Clock, Users, TrendingUp, Zap, Music } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const TomorrowlandPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivalEvents = async () => {
      try {
        const response = await axios.get(`${API}/events?search=Tomorrowland`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFestivalEvents();
  }, []);

  const tomorrowlandSchema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Tomorrowland 2025",
    "description": "Buy Tomorrowland 2025 tickets. The world's biggest electronic dance music festival in Boom, Belgium. Full Madness Pass, day tickets, and DreamVille camping packages available.",
    "startDate": "2025-07-18",
    "endDate": "2025-07-27",
    "location": {
      "@type": "Place",
      "name": "De Schorre",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Boom",
        "addressCountry": "Belgium"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://euromatchtickets.com/tomorrowland-2025",
      "priceCurrency": "EUR",
      "lowPrice": "275",
      "highPrice": "1500",
      "availability": "https://schema.org/LimitedAvailability"
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Tomorrowland 2025 Tickets - Buy Festival Passes Belgium"
        description="Buy Tomorrowland 2025 tickets from €275. Full Madness Pass, Weekend tickets, and DreamVille camping. World's best EDM festival in Boom, Belgium. 100% verified tickets with guarantee."
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tomorrowlandSchema) }} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-zinc-950" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 font-medium">Sold Out in 2024! Get 2025 Tickets Now!</span>
          </div>

          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-6">
            <PartyPopper className="w-4 h-4 mr-2" />
            World's #1 Electronic Music Festival
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tomorrowland 2025
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Live Today, Love Tomorrow, Unite Forever
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Join 400,000+ festival-goers at the magical land of Tomorrowland! 
            Experience the world's best DJs, incredible stages, and unforgettable moments.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-pink-400" />
              <span>July 18-20 & 25-27, 2025</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-pink-400" />
              <span>Boom, Belgium</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Music className="w-5 h-5 text-pink-400" />
              <span>800+ Artists</span>
            </div>
          </div>

          {/* Price Starting */}
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-zinc-400 text-sm">Full Madness Pass from</div>
            <div className="text-5xl font-bold text-white">€375</div>
            <div className="text-emerald-400 text-sm mt-1">3-Day Access Included</div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span>Official Resale Platform</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Star className="w-5 h-5" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Ticket className="w-5 h-5" />
              <span>Personalized Bracelet</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span>5,200+ Tickets Sold</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Tomorrowland 2025 Ticket Packages
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Day Pass */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-all">
              <Badge className="bg-zinc-800 text-zinc-300 mb-4">Day Pass</Badge>
              <h3 className="text-2xl font-bold mb-2">Single Day</h3>
              <div className="text-4xl font-bold text-pink-400 mb-4">€275</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Access to all stages
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Festival bracelet
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Shuttle service
                </li>
              </ul>
              <Link to="/events?type=festival">
                <Button className="w-full bg-pink-500 hover:bg-pink-600">
                  Buy Day Pass
                </Button>
              </Link>
            </div>

            {/* Full Madness */}
            <div className="bg-gradient-to-b from-pink-500/20 to-zinc-900/50 border-2 border-pink-500/50 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <Badge className="bg-pink-500/20 text-pink-400 mb-4">Full Madness</Badge>
              <h3 className="text-2xl font-bold mb-2">3-Day Pass</h3>
              <div className="text-4xl font-bold text-pink-400 mb-4">€375</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Full weekend access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> All stages & areas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Treasure Case included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Exclusive merchandise
                </li>
              </ul>
              <Link to="/events?type=festival">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 font-bold">
                  Buy Full Madness
                </Button>
              </Link>
            </div>

            {/* DreamVille */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-pink-500/30 transition-all">
              <Badge className="bg-purple-500/20 text-purple-400 mb-4">DreamVille</Badge>
              <h3 className="text-2xl font-bold mb-2">Camping Package</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">€550</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 3-Day festival pass
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 4-Night camping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Pre-party access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Exclusive areas
                </li>
              </ul>
              <Link to="/events?type=festival">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Buy DreamVille
                </Button>
              </Link>
            </div>
          </div>

          {/* Available Tickets */}
          {!loading && events.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Available Resale Tickets</h3>
              {events.map(event => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group flex items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-pink-500/30 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img src={event.event_image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-pink-400">{event.title}</h4>
                      <p className="text-sm text-zinc-500">{formatDate(event.event_date)} • {event.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-500">{event.available_tickets} available</div>
                    <div className="text-xl font-bold text-pink-400">€{event.lowest_price}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Buy Tomorrowland 2025 Tickets</h2>
          
          <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
            <p>
              <strong>Tomorrowland</strong> is the world's most iconic electronic dance music festival, 
              held annually in <strong>Boom, Belgium</strong>. With spectacular stages, world-class DJs, 
              and an unmatched atmosphere, it's a bucket-list experience for music lovers.
            </p>
            
            <h3 className="text-white">Tomorrowland 2025 Lineup</h3>
            <p>
              Expect performances from top artists like <strong>Martin Garrix, Tiësto, David Guetta, 
              Armin van Buuren, Charlotte de Witte</strong>, and hundreds more across 16+ stages.
            </p>
            
            <h3 className="text-white">Why Buy from EuroMatchTickets?</h3>
            <ul>
              <li>100% verified resale tickets</li>
              <li>Full refund if your tickets don't arrive</li>
              <li>Secure payment via Stripe</li>
              <li>Customer support in English & German</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TomorrowlandPage;
