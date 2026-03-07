import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Flag, ChevronRight, Shield, Zap, Star, Bike, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') || '';

const MotoGPTicketsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch MotoGP events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/api/events?event_type=motogp`);
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching MotoGP events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MotoGP 2026 Tickets",
    "description": "Buy MotoGP 2026 tickets for all Grand Prix races. Best prices for motorcycle racing events.",
    "numberOfItems": events.length
  };

  // Format date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="MotoGP Tickets 2026 - Buy Motorcycle Grand Prix Tickets | All Races"
        description="Buy MotoGP 2026 tickets from €69. All Grand Prix races. Mugello, Silverstone, Assen, Barcelona, Valencia. 100% Ticket Guarantee. Instant delivery. Best prices!"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-zinc-900 to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
            <Bike className="w-4 h-4 mr-2" />MotoGP™ World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            MotoGP Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">{events.length} Races • World's Best Motorcycle Racing</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the thrill of MotoGP! Watch Marquez, Bagnaia, and Martin battle at 350 km/h. 
            <strong className="text-emerald-400"> Tickets from €69 - Best prices guaranteed!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Flag className="w-5 h-5 text-orange-400" /><span>{events.length} Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Calendar className="w-5 h-5 text-orange-400" /><span>March - November 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <Ticket className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400">From €69</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">General Admission from</div>
            <div className="text-5xl font-bold text-emerald-400">€69</div>
            <div className="text-emerald-400 text-sm mt-1">Save 30% vs official MotoGP.com</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>30% Cheaper</span></div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">MotoGP 2026 Calendar - All Races</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-400 text-xl">No MotoGP events available at the moment.</p>
              <Button 
                onClick={() => navigate('/events')} 
                className="mt-4 bg-orange-600 hover:bg-orange-700"
              >
                View All Events
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link 
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                        Featured Race
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span>{event.venue || event.city}, {event.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 text-sm">From</span>
                        <span className="text-2xl font-bold text-emerald-400 ml-2">€69</span>
                      </div>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Buy Tickets <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">MotoGP Tickets FAQ</h2>
          
          <div className="space-y-4">
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">What's included in MotoGP weekend tickets?</h3>
              <p className="text-zinc-400">All MotoGP weekend tickets include access to Friday practice, Saturday qualifying, and Sunday races for all classes (MotoGP, Moto2, Moto3).</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">Are MotoGP tickets cheaper than official prices?</h3>
              <p className="text-zinc-400">Yes! Our tickets are typically 20-30% cheaper than official MotoGP.com prices. We source tickets directly from season pass holders and corporate allocations.</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">Which MotoGP races are best for first-timers?</h3>
              <p className="text-zinc-400">Mugello (Italy), Assen (Netherlands), and Silverstone (UK) are considered the best for atmosphere. Barcelona and Valencia offer great value and accessibility.</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">Do you offer MotoGP paddock access?</h3>
              <p className="text-zinc-400">Yes! We offer VIP Village and Paddock Access packages at select races. These include pit walks, rider meet-and-greets, and premium hospitality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience MotoGP?</h2>
          <p className="text-zinc-400 mb-8">Book your tickets now and save up to 30% off official prices!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/events?type=motogp')} 
              size="lg" 
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Ticket className="w-5 h-5 mr-2" />
              View All MotoGP Events
            </Button>
            <Button 
              onClick={() => navigate('/f1-tickets')} 
              size="lg" 
              variant="outline"
              className="border-zinc-700 hover:border-red-500 hover:text-red-400"
            >
              <Flag className="w-5 h-5 mr-2" />
              Browse F1 Tickets
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoGPTicketsPage;
