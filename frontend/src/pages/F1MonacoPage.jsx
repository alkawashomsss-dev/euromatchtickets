import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Flag, Star, Shield, ChevronRight, Clock, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const F1MonacoPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchF1Events = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=f1`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching F1 events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchF1Events();
  }, []);

  const monacoSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Monaco Grand Prix 2025",
    "description": "Buy Monaco Grand Prix 2025 tickets. The most prestigious Formula 1 race through Monte Carlo streets. VIP hospitality, grandstand, and general admission available.",
    "startDate": "2025-05-25",
    "endDate": "2025-05-25",
    "location": {
      "@type": "Place",
      "name": "Circuit de Monaco",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Monte Carlo",
        "addressCountry": "Monaco"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://euromatchtickets.com/f1-monaco-grand-prix",
      "priceCurrency": "EUR",
      "lowPrice": "180",
      "highPrice": "5000",
      "availability": "https://schema.org/LimitedAvailability"
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Monaco Grand Prix 2025 Tickets - Buy F1 Monte Carlo Tickets"
        description="Buy Monaco Grand Prix 2025 tickets from €180. Best seats at Circuit de Monaco. VIP hospitality packages, grandstand seats, and general admission. 100% verified tickets with money-back guarantee."
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(monacoSchema) }} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6 animate-pulse">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">High Demand - Only 46 tickets left!</span>
          </div>

          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-6">
            <Flag className="w-4 h-4 mr-2" />
            Formula 1 World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Monaco Grand Prix 2025
            <span className="block text-2xl md:text-3xl mt-2 text-red-400">
              Monte Carlo Street Circuit
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the most glamorous race in Formula 1! Watch the world's best drivers 
            navigate the legendary streets of Monte Carlo. Premium tickets available now.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-red-400" />
              <span>May 22-25, 2025</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-red-400" />
              <span>Monte Carlo, Monaco</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Users className="w-5 h-5 text-red-400" />
              <span>37,000 Spectators</span>
            </div>
          </div>

          {/* Price Starting */}
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-zinc-400 text-sm">Tickets from</div>
            <div className="text-5xl font-bold text-white">€180</div>
            <div className="text-emerald-400 text-sm mt-1">Verified & Guaranteed</div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
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
              <span>Instant E-Ticket Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span>2,340+ Tickets Sold</span>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tickets */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Available F1 Tickets
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map(event => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group flex flex-col md:flex-row md:items-center gap-4 bg-zinc-900/50 border border-white/5 hover:border-red-500/30 rounded-2xl p-6 transition-all"
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
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <Flag className="w-3 h-3 mr-1" />
                        Formula 1
                      </Badge>
                      {event.featured && (
                        <Badge className="bg-amber-500/20 text-amber-400">Hot</Badge>
                      )}
                      {event.available_tickets < 50 && (
                        <Badge className="bg-orange-500/20 text-orange-400 animate-pulse">
                          Only {event.available_tickets} left!
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
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
                    <div className="text-3xl font-bold text-red-400">
                      €{event.lowest_price || 180}
                    </div>
                    <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white">
                      Buy Now
                    </Button>
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
          <h2 className="text-2xl font-bold mb-6">Buy Monaco Grand Prix 2025 Tickets</h2>
          
          <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
            <p>
              The <strong>Monaco Grand Prix</strong> is the crown jewel of the Formula 1 calendar. 
              Held annually on the streets of <strong>Monte Carlo</strong>, this race offers an 
              unparalleled combination of speed, glamour, and excitement.
            </p>
            
            <h3 className="text-white">Monaco GP 2025 Ticket Categories</h3>
            <ul>
              <li><strong>General Admission:</strong> Standing areas with good views - €180-€350</li>
              <li><strong>Grandstand Seats:</strong> Reserved seating at key corners - €450-€1,200</li>
              <li><strong>VIP Hospitality:</strong> Premium experience with catering - €2,000-€5,000</li>
              <li><strong>Paddock Club:</strong> Ultimate F1 experience - €5,000+</li>
            </ul>
            
            <h3 className="text-white">Best Viewing Spots</h3>
            <p>
              Popular grandstands include <strong>Tabac</strong> (Turn 15), <strong>La Rascasse</strong>, 
              and the iconic <strong>Casino Square</strong>. Book early as Monaco sells out months in advance!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Don't Miss the Monaco GP 2025!</h2>
            <p className="text-zinc-400 mb-6">
              Tickets are selling fast. Secure your spot at the most glamorous race in motorsport.
            </p>
            <Link to="/events?type=f1">
              <Button className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-6 text-lg">
                <Flag className="w-5 h-5 mr-2" />
                View All F1 Tickets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default F1MonacoPage;
