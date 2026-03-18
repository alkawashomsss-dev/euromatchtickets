import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Flag, ChevronRight, Shield, Zap, Star, Bike, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import axios from "axios";
import { API } from "../App";

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
        const response = await axios.get(`${API}/events?event_type=motogp`);
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
    "name": "MotoGP Tickets 2026 - Motorcycle Grand Prix Tickets",
    "description": "Buy official MotoGP 2026 tickets. Mugello, Silverstone, Assen, Barcelona, Valencia. VIP Village & Paddock passes available.",
    "numberOfItems": events.length || 20,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Event",
          "name": "MotoGP Italian Grand Prix Mugello 2026",
          "startDate": "2026-05-29",
          "endDate": "2026-05-31",
          "image": "https://euromatchtickets.com/logo.png",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "Autodromo del Mugello",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Scarperia",
              "addressCountry": "IT"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": "MotoGP",
            "url": "https://www.motogp.com"
          },
          "performer": {
            "@type": "Organization",
            "name": "MotoGP World Championship"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://euromatchtickets.com/motogp-tickets",
            "price": "99",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "validFrom": "2025-01-01"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Event",
          "name": "MotoGP Dutch TT Assen 2026",
          "startDate": "2026-06-26",
          "endDate": "2026-06-28",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "TT Circuit Assen",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Assen",
              "addressCountry": "NL"
            }
          },
          "organizer": {
            "@type": "Organization",
            "name": "MotoGP",
            "url": "https://www.motogp.com"
          },
          "performer": {
            "@type": "Organization",
            "name": "MotoGP World Championship"
          },
          "offers": {
            "@type": "Offer",
            "url": "https://euromatchtickets.com/motogp-tickets",
            "price": "89",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "validFrom": "2025-01-01"
          }
        }
      }
    ]
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where can I buy MotoGP tickets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can buy official MotoGP tickets at EuroMatchTickets.com. We offer verified tickets for all Grand Prix races with VIP Village and Paddock access options."
        }
      },
      {
        "@type": "Question",
        "name": "How much do MotoGP tickets cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MotoGP ticket prices start from €69 for general admission. VIP Village passes range from €500-2500 depending on the race and package."
        }
      }
    ]
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
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="MotoGP Tickets 2026 | Cheapest VIP Race Prices"
        description="Buy MotoGP 2026 tickets from €69. All 20 Grand Prix races. Mugello, Silverstone, Assen, Barcelona, Valencia. VIP Village & Paddock. 100% Verified. Instant."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-50 text-orange-600 border-orange-200 mb-6">
            <Bike className="w-4 h-4 mr-2" />MotoGP™ World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            MotoGP Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">{events.length} Races • World's Best Motorcycle Racing</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Experience the thrill of MotoGP! Watch Marquez, Bagnaia, and Martin battle at 350 km/h. 
            <strong className="text-emerald-600"> Tickets from €69 - Best prices guaranteed!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Flag className="w-5 h-5 text-orange-600" /><span>{events.length} Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
              <Calendar className="w-5 h-5 text-orange-600" /><span>March - November 2026</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200">
              <Ticket className="w-5 h-5 text-emerald-600" /><span className="text-emerald-600">From €69</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-emerald-200 rounded-2xl p-6">
            <div className="text-slate-500 text-sm">General Admission from</div>
            <div className="text-5xl font-bold text-emerald-600">€69</div>
            <div className="text-emerald-600 text-sm mt-1">Save 30% vs official MotoGP.com</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>30% Cheaper</span></div>
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
              <p className="text-slate-500 text-xl">No MotoGP events available at the moment.</p>
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
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                        Featured Race
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>{event.venue || event.city}, {event.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-sm">From</span>
                        <span className="text-2xl font-bold text-emerald-600 ml-2">€69</span>
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
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">MotoGP Tickets FAQ</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg mb-2">What's included in MotoGP weekend tickets?</h3>
              <p className="text-slate-500">All MotoGP weekend tickets include access to Friday practice, Saturday qualifying, and Sunday races for all classes (MotoGP, Moto2, Moto3).</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg mb-2">Are MotoGP tickets cheaper than official prices?</h3>
              <p className="text-slate-500">Yes! Our tickets are typically 20-30% cheaper than official MotoGP.com prices. We source tickets directly from season pass holders and corporate allocations.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg mb-2">Which MotoGP races are best for first-timers?</h3>
              <p className="text-slate-500">Mugello (Italy), Assen (Netherlands), and Silverstone (UK) are considered the best for atmosphere. Barcelona and Valencia offer great value and accessibility.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg mb-2">Do you offer MotoGP paddock access?</h3>
              <p className="text-slate-500">Yes! We offer VIP Village and Paddock Access packages at select races. These include pit walks, rider meet-and-greets, and premium hospitality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience MotoGP?</h2>
          <p className="text-slate-500 mb-8">Book your tickets now and save up to 30% off official prices!</p>
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
              className="border-slate-200 hover:border-red-500 hover:text-red-600"
            >
              <Flag className="w-5 h-5 mr-2" />
              Browse F1 Tickets
            </Button>
          </div>
        </div>
      </section>
      {/* Cross-promotion */}
      <section className="py-8 max-w-5xl mx-auto px-4">
        <div className="p-5 bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-slate-900 font-bold">Looking for other major events?</p>
            <p className="text-slate-500 text-sm">Check out the Super Bowl, World Cup, and World Athletics Championship!</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/super-bowl-2026-tickets" className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">Super Bowl 2026</Link>
            <Link to="/world-cup-2026" className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">World Cup 2026</Link>
            <Link to="/world-athletics-2026-tickets" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">Athletics 2026</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoGPTicketsPage;
