import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Trophy, Star, Shield, ChevronRight, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const WorldCupPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorldCupEvents = async () => {
      try {
        const response = await axios.get(`${API}/events?search=FIFA`);
        setEvents(response.data.filter(e => e.title.includes('FIFA') || e.title.includes('World Cup')));
      } catch (error) {
        console.error("Error fetching World Cup events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorldCupEvents();
  }, []);

  // World Cup Schema for SEO
  const worldCupSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "FIFA World Cup 2026",
    "description": "Buy FIFA World Cup 2026 tickets for all matches. Opening ceremony, group stage, knockout rounds, and final. Verified tickets with 100% buyer guarantee.",
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "location": {
      "@type": "Place",
      "name": "Multiple Venues - USA, Canada, Mexico",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": ["USA", "Canada", "Mexico"]
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "FIFA",
      "url": "https://www.fifa.com"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://euromatchtickets.com/world-cup-2026",
      "priceCurrency": "EUR",
      "lowPrice": "150",
      "highPrice": "15000",
      "availability": "https://schema.org/InStock"
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="FIFA World Cup 2026 Tickets - Buy Official Verified Tickets"
        description="Buy FIFA World Cup 2026 tickets for all matches. Opening ceremony Mexico, group stage, quarter finals, semi finals and World Cup Final in New York. Verified tickets with 100% buyer guarantee. Best prices online!"
      />
      
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(worldCupSchema) }} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-green-500/10 to-blue-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            Official Ticket Marketplace
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            FIFA World Cup 2026
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Buy Tickets - USA • Canada • Mexico
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Secure your verified FIFA World Cup 2026 tickets now! From the opening ceremony in Mexico 
            to the Final in New York. All categories available with 100% buyer protection.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>June 11 - July 19, 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-green-400" />
              <span>16 Host Cities</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Ticket className="w-5 h-5 text-blue-400" />
              <span>48 Teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span>100% Verified Tickets</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Star className="w-5 h-5" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Ticket className="w-5 h-5" />
              <span>Instant QR Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Available Matches */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Available World Cup 2026 Tickets
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No World Cup tickets available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map(event => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group flex flex-col md:flex-row md:items-center gap-4 bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={event.event_image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        World Cup 2026
                      </Badge>
                      {event.featured && (
                        <Badge className="bg-purple-500/20 text-purple-400">Featured</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.venue}, {event.city}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-zinc-500">From</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      €{event.lowest_price || 150}
                    </div>
                    <div className="text-sm text-emerald-400">
                      {event.ticket_count || 100}+ tickets
                    </div>
                  </div>

                  <ChevronRight className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Buy FIFA World Cup 2026 Tickets</h2>
          
          <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
            <p>
              The <strong>FIFA World Cup 2026</strong> will be the biggest football tournament ever, 
              hosted across <strong>USA, Canada, and Mexico</strong>. For the first time, 48 teams 
              will compete for the ultimate prize in football.
            </p>
            
            <h3 className="text-white">World Cup 2026 Host Cities</h3>
            <p>
              Matches will be played in 16 iconic stadiums including <strong>MetLife Stadium (New York)</strong>, 
              <strong>SoFi Stadium (Los Angeles)</strong>, <strong>AT&T Stadium (Dallas)</strong>, and 
              <strong>Estadio Azteca (Mexico City)</strong>.
            </p>
            
            <h3 className="text-white">World Cup 2026 Ticket Categories</h3>
            <ul>
              <li><strong>Category 1:</strong> Best views, premium locations - €500-€5,000</li>
              <li><strong>Category 2:</strong> Great sightlines, central sections - €300-€1,500</li>
              <li><strong>Category 3:</strong> Good views, affordable prices - €150-€800</li>
              <li><strong>VIP Hospitality:</strong> All-inclusive packages - €2,000-€15,000</li>
            </ul>
            
            <h3 className="text-white">Why Buy World Cup Tickets from EuroMatchTickets?</h3>
            <ul>
              <li>100% verified and guaranteed authentic tickets</li>
              <li>Instant QR code delivery - no waiting</li>
              <li>Full refund if event is cancelled</li>
              <li>24/7 customer support</li>
              <li>Secure payment with Stripe</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss the World Cup 2026!</h2>
          <p className="text-zinc-400 mb-8">
            Tickets are selling fast. Secure your seats now for the biggest football event in history.
          </p>
          <Link to="/events?search=FIFA">
            <Button className="bg-cyan-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 text-lg">
              <Trophy className="w-5 h-5 mr-2" />
              View All World Cup Tickets
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WorldCupPage;
