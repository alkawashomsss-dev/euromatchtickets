import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Landmark, Star, Shield, Users, TrendingUp, Zap, Sparkles, Castle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const DisneylandPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractionEvents = async () => {
      try {
        const response = await axios.get(`${API}/events?search=Disneyland`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractionEvents();
  }, []);

  const disneySchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Disneyland Paris",
    "description": "Buy Disneyland Paris tickets. Skip-the-line entry to both parks. Magic Kingdom and Walt Disney Studios. Best prices online with instant delivery.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Marne-la-Vallée",
      "addressCountry": "France"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://euromatchtickets.com/disneyland-paris",
      "priceCurrency": "EUR",
      "lowPrice": "85",
      "highPrice": "300",
      "availability": "https://schema.org/InStock"
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
        title="Disneyland Paris Tickets 2025 - Buy Skip-the-Line Passes"
        description="Buy Disneyland Paris tickets from €85. Skip-the-line entry, 1-day and 2-day hopper passes. Magic Kingdom & Walt Disney Studios. Best prices with instant e-ticket delivery."
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(disneySchema) }} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-zinc-950" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1843563/pexels-photo-1843563.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Skip the 2+ Hour Queues - Book Now!</span>
          </div>

          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-6">
            <Castle className="w-4 h-4 mr-2" />
            Europe's #1 Theme Park
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Disneyland Paris
            <span className="block text-2xl md:text-3xl mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Where Dreams Come True ✨
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the magic of Disney just 35 minutes from Paris! 
            Two amazing parks, iconic attractions, and unforgettable memories await.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Marne-la-Vallée, France</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Landmark className="w-5 h-5 text-blue-400" />
              <span>2 Theme Parks</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Users className="w-5 h-5 text-blue-400" />
              <span>59 Attractions</span>
            </div>
          </div>

          {/* Price Starting */}
          <div className="inline-block bg-zinc-900/80 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-zinc-400 text-sm">1-Day Ticket from</div>
            <div className="text-5xl font-bold text-white">€85</div>
            <div className="text-emerald-400 text-sm mt-1">Skip-the-Line Entry</div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span>Official Tickets</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Star className="w-5 h-5" />
              <span>Instant E-Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Ticket className="w-5 h-5" />
              <span>Mobile Tickets</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span>12,400+ Sold</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Disneyland Paris Ticket Options
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 1 Day 1 Park */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <Badge className="bg-zinc-800 text-zinc-300 mb-4">1 Day</Badge>
              <h3 className="text-2xl font-bold mb-2">1 Park Ticket</h3>
              <div className="text-4xl font-bold text-blue-400 mb-4">€85</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Disneyland Park OR Studios
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> All rides included
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Shows & parades
                </li>
              </ul>
              <Link to="/events?type=attraction">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Buy 1 Park Ticket
                </Button>
              </Link>
            </div>

            {/* 1 Day 2 Parks */}
            <div className="bg-gradient-to-b from-blue-500/20 to-zinc-900/50 border-2 border-blue-500/50 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                BEST VALUE
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 mb-4">1 Day Hopper</Badge>
              <h3 className="text-2xl font-bold mb-2">Both Parks</h3>
              <div className="text-4xl font-bold text-blue-400 mb-4">€105</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Both parks same day
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 59 attractions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Unlimited switching
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Fireworks show
                </li>
              </ul>
              <Link to="/events?type=attraction">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 font-bold">
                  Buy Hopper Ticket
                </Button>
              </Link>
            </div>

            {/* 2 Day */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <Badge className="bg-purple-500/20 text-purple-400 mb-4">2 Days</Badge>
              <h3 className="text-2xl font-bold mb-2">Multi-Day Pass</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">€169</div>
              <ul className="space-y-2 text-zinc-400 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 2 consecutive days
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Both parks access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Save €40+
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> More time to explore
                </li>
              </ul>
              <Link to="/events?type=attraction">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Buy 2-Day Pass
                </Button>
              </Link>
            </div>
          </div>

          {/* Available Tickets */}
          {!loading && events.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Available Dates</h3>
              {events.map(event => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group flex items-center justify-between bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img src={event.event_image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-blue-400">{event.title}</h4>
                      <p className="text-sm text-zinc-500">{event.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-400">{event.available_tickets}+ available</div>
                    <div className="text-xl font-bold text-blue-400">€{event.lowest_price}</div>
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
          <h2 className="text-2xl font-bold mb-6">Buy Disneyland Paris Tickets Online</h2>
          
          <div className="prose prose-invert prose-lg max-w-none text-zinc-400">
            <p>
              <strong>Disneyland Paris</strong> is Europe's most visited theme park, welcoming over 
              15 million guests annually. Located just 32km east of Paris, it's easily accessible 
              by RER train, TGV, or car.
            </p>
            
            <h3 className="text-white">Must-Do Attractions</h3>
            <ul>
              <li><strong>Big Thunder Mountain</strong> - Iconic runaway train ride</li>
              <li><strong>Space Mountain</strong> - Thrilling indoor roller coaster</li>
              <li><strong>Pirates of the Caribbean</strong> - Classic boat ride</li>
              <li><strong>Ratatouille</strong> - 4D adventure in Walt Disney Studios</li>
              <li><strong>Avengers Campus</strong> - New Marvel-themed land</li>
            </ul>
            
            <h3 className="text-white">Best Time to Visit</h3>
            <p>
              Weekdays outside school holidays offer shorter queues. The park is magical during 
              <strong> Halloween</strong> and <strong>Christmas</strong> seasons with special decorations and shows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisneylandPage;
