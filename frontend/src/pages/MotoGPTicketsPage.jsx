import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Flag, ChevronRight, Shield, Zap, Star, Bike, Loader2, Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import WaitlistCTA from "../components/WaitlistCTA";
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

  // Real minimum price from confirmed events only
  const minPrice = useMemo(() => {
    const prices = (events || [])
      .filter(e => e.status !== 'coming_soon' && e.lowest_price)
      .map(e => e.lowest_price);
    return prices.length ? Math.min(...prices) : null;
  }, [events]);

  const confirmedCount = useMemo(
    () => (events || []).filter(e => e.status !== 'coming_soon' && e.lowest_price && e.available_tickets > 0).length,
    [events]
  );

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
          "image": "https://euromatchtickets.com/logo-192.png",
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
            "@type": "AggregateOffer",
            "lowPrice": "45",
            "highPrice": "1500",
            "priceCurrency": "EUR",
            "offerCount": "500",
            "availability": "https://schema.org/InStock",
            "url": "https://euromatchtickets.com/motogp-tickets",
            "validFrom": "2025-01-01",
            "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
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
            "@type": "AggregateOffer",
            "lowPrice": "45",
            "highPrice": "1500",
            "priceCurrency": "EUR",
            "offerCount": "500",
            "availability": "https://schema.org/InStock",
            "url": "https://euromatchtickets.com/motogp-tickets",
            "validFrom": "2025-01-01",
            "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
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
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="MotoGP Tickets 2026 | Buy Moto GP Race Passes"
        description="Buy MotoGP tickets 2026 from €69. Moto GP calendar 2026: Mugello, Silverstone, Assen. VIP Village. MotoGP tickets price from €69. Instant QR delivery."
        image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "MotoGP Tickets 2026", url: "https://euromatchtickets.com/motogp-tickets" }]} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-slate-900 to-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 mb-6">
            <Bike className="w-4 h-4 mr-2" />MotoGP™ World Championship
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            MotoGP Tickets 2026
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">{confirmedCount || events.length} Races · World's Best Motorcycle Racing</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Experience the thrill of MotoGP. Watch Marquez, Bagnaia, and Martin battle at 350 km/h.
            {minPrice && <strong className="text-emerald-600"> Tickets from €{Math.round(minPrice)} — verified sellers only.</strong>}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Flag className="w-5 h-5 text-orange-600" /><span>{events.length} Races</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Calendar className="w-5 h-5 text-orange-600" /><span>March - November 2026</span>
            </div>
            {minPrice && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-200">
                <Ticket className="w-5 h-5 text-emerald-600" /><span className="text-emerald-600">From €{Math.round(minPrice)}</span>
              </div>
            )}
          </div>

          {minPrice ? (
            <div className="inline-block bg-white/90 border border-emerald-200 rounded-none p-6">
              <div className="text-slate-500 text-sm">General Admission from</div>
              <div className="text-5xl font-bold text-emerald-600">€{Math.round(minPrice)}</div>
              <div className="text-emerald-600 text-sm mt-1">Verified sellers · Instant QR delivery</div>
            </div>
          ) : (
            <div className="inline-block bg-white/90 border border-amber-300 rounded-none p-6 max-w-md">
              <div className="text-slate-600 text-sm font-bold uppercase tracking-wide mb-1">Coming soon</div>
              <p className="text-slate-500 text-sm mb-3">The 2026 calendar is confirmed but inventory is still being verified. Join the waitlist and we'll email you the moment tickets drop.</p>
              <WaitlistCTA slug="motogp-tickets-2026" eventTitle="MotoGP 2026 Season" compact />
            </div>
          )}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-[#15151e]">
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
            <div className="max-w-xl mx-auto py-10 bg-[#15151e] border border-amber-500/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">2026 MotoGP tickets — not released yet</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">The 2026 calendar isn't officially on sale yet. Join the waitlist and we'll email you within 24h of the first drop — zero spam, zero fake scarcity.</p>
              <WaitlistCTA slug="motogp-tickets-2026" eventTitle="MotoGP 2026 Season" />
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-2">While you wait, explore confirmed events:</p>
                <div className="flex flex-wrap gap-2">
                  <Link to="/f1-tickets" className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/10">F1 2026</Link>
                  <Link to="/world-cup-2026-tickets" className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/10">FIFA World Cup 2026</Link>
                  <Link to="/events" className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-white/10">All events</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link 
                  key={event.event_id}
                  to={`/event/${event.slug || event.event_id}`}
                  className="group bg-[#1e1e1e] rounded-none overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-orange-500/100 text-white">
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
                      {event.status !== 'coming_soon' && event.lowest_price ? (
                        <>
                          <div>
                            <span className="text-slate-400 text-sm">From</span>
                            <span className="text-2xl font-bold text-emerald-600 ml-2">€{Math.round(event.lowest_price)}</span>
                          </div>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Buy Tickets <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </>
                      ) : (
                        <div className="w-full">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-1 uppercase tracking-wider">
                            <Bell className="w-3 h-3" /> Coming soon · Join waitlist
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">MotoGP Tickets FAQ</h2>
          
          <div className="space-y-4">
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">What's included in MotoGP weekend tickets?</h3>
              <p className="text-slate-500">All MotoGP weekend tickets include access to Friday practice, Saturday qualifying, and Sunday races for all classes (MotoGP, Moto2, Moto3).</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">Are MotoGP tickets cheaper than official prices?</h3>
              <p className="text-slate-500">Yes! Our tickets are typically 20-30% cheaper than official MotoGP.com prices. We source tickets directly from season pass holders and corporate allocations.</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">Which MotoGP races are best for first-timers?</h3>
              <p className="text-slate-500">Mugello (Italy), Assen (Netherlands), and Silverstone (UK) are considered the best for atmosphere. Barcelona and Valencia offer great value and accessibility.</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
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
              onClick={() => navigate('/checkout?event=motogp-2026')} 
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
              className="border-white/10 hover:border-red-500 hover:text-red-600"
            >
              <Flag className="w-5 h-5 mr-2" />
              Browse F1 Tickets
            </Button>
          </div>
        </div>
      </section>
      {/* Cross-promotion */}
      <section className="py-8 max-w-5xl mx-auto px-4">
        <div className="p-5 bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-none border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold">Looking for other major events?</p>
            <p className="text-slate-500 text-sm">Check out the Super Bowl, World Cup, and World Athletics Championship!</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/super-bowl-2026-tickets" className="bg-red-600 hover:bg-[#e10600]/100 text-white text-sm font-bold px-5 py-2.5 rounded-none transition">Super Bowl 2026</Link>
            <Link to="/world-cup-2026" className="bg-amber-600 hover:bg-amber-500/100 text-white text-sm font-bold px-5 py-2.5 rounded-none transition">World Cup 2026</Link>
            <Link to="/world-athletics-2026-tickets" className="bg-blue-600 hover:bg-blue-500/100 text-white text-sm font-bold px-5 py-2.5 rounded-none transition">Athletics 2026</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotoGPTicketsPage;
