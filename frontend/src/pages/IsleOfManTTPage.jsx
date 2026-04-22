import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Bike, Trophy, Mountain, Clock, AlertTriangle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import axios from "axios";
import { API } from "../App";

const IsleOfManTTPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Isle of Man TT events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events?event_type=isle_of_man_tt`);
        setEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching Isle of Man TT events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Isle of Man TT 2026",
    "description": "Buy Isle of Man TT 2026 tickets. The world's most legendary motorcycle race since 1907. Grandstand, VIP hospitality, and race week passes available.",
    "startDate": "2026-05-30",
    "endDate": "2026-06-13",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": { 
      "@type": "Place", 
      "name": "Snaefell Mountain Course", 
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Douglas",
        "addressRegion": "Isle of Man",
        "addressCountry": "IM"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Isle of Man TT Races",
      "url": "https://www.iomtt.com"
    },
    "performer": {
      "@type": "Organization",
      "name": "Isle of Man TT Races"
    },
    "offers": { 
      "@type": "Offer", 
      "lowPrice": "45",
      "highPrice": "500",
      "url": "https://euromatchtickets.com/isle-of-man-tt-tickets",
      "priceCurrency": "EUR","availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
    },
    "image": "https://euromatchtickets.com/images/isle-of-man-tt.jpg"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "When is Isle of Man TT 2026?", "acceptedAnswer": { "@type": "Answer", "text": "The Isle of Man TT 2026 runs from May 30th to June 13th, 2026. Practice week starts May 30th, with racing from June 6th-13th." }},
      { "@type": "Question", "name": "How do I get Isle of Man TT tickets?", "acceptedAnswer": { "@type": "Answer", "text": "Most areas around the 37.73-mile course are free to watch. Grandstand tickets (start/finish) and VIP hospitality require purchase. We offer instant delivery." }},
      { "@type": "Question", "name": "Are Isle of Man TT tickets mobile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all grandstand and VIP tickets are delivered instantly via email as mobile QR codes. Print option also available." }},
      { "@type": "Question", "name": "What's included in TT VIP tickets?", "acceptedAnswer": { "@type": "Answer", "text": "VIP packages include premium grandstand seating, hospitality suite access, gourmet food, open bar, paddock tours, and rider meet & greets." }}
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
        title="Isle of Man TT Tickets 2025-2026 | Race Passes"
        description="Buy Isle of Man TT tickets 2025 & 2026 from €149. World's most thrilling motorcycle race. Grandstand passes, VIP. Instant QR delivery + Buyer protection."
        image="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProductSchema name="Isle of Man TT 2026" price={79} highPrice={999} url="https://euromatchtickets.com/isle-of-man-tt-tickets" category="motogp" venue="Snaefell Mountain Course" city="Douglas" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Motorsport", url: "https://euromatchtickets.com/events?type=motogp" }, { name: "Isle of Man TT 2026", url: "https://euromatchtickets.com/isle-of-man-tt-tickets" }]} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg')] opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e10600]/10 border border-red-200 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-600 font-medium">The World's Most Dangerous Race</span>
          </div>
          
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 mb-6 ml-2">
            <Trophy className="w-4 h-4 mr-2" />Since 1907 - 117 Years of Racing History
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Isle of Man TT 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-slate-500">37.73 Miles • 200 MPH • Pure Adrenaline</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-8">
            Experience the legendary Isle of Man TT! Riders reach 200mph on public roads around the famous Snaefell Mountain Course.
            <strong className="text-emerald-600"> Tickets from €149!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Mountain className="w-5 h-5 text-amber-600" /><span>37.73 Mile Course</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#15151e] rounded-full">
              <Clock className="w-5 h-5 text-amber-600" /><span>200+ MPH Speeds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-200">
              <Ticket className="w-5 h-5 text-emerald-600" /><span className="text-emerald-600">From €149</span>
            </div>
          </div>

          <div className="inline-block bg-white/90 border border-amber-200 rounded-none p-6">
            <div className="text-slate-500 text-sm">Race Week Tickets from</div>
            <div className="text-5xl font-bold text-amber-600">€149</div>
            <div className="text-amber-600 text-sm mt-1">VIP Packages Available</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-5 h-5" /><span>QR ticket delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-5 h-5" /><span>Marketplace</span></div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Isle of Man TT 2026 - Available Tickets</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-xl mb-4">No Isle of Man TT events available at the moment.</p>
              <Button 
                onClick={() => navigate('/checkout?event=isle-of-man-tt-2026')} 
                className="bg-amber-600 hover:bg-amber-700"
              >
                View All Events
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link 
                  key={event.event_id}
                  to={`/event/${event.slug || event.event_id}`}
                  className="group bg-[#1e1e1e] rounded-none overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-amber-500/100 text-white">
                        Featured Event
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span>{event.venue || "Snaefell Mountain Course"}, {event.city || "Douglas"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-sm">From</span>
                        <span className="text-2xl font-bold text-emerald-600 ml-2">€149</span>
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
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

      {/* About the TT */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">About the Isle of Man TT</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 text-lg mb-6">
              The Isle of Man TT (Tourist Trophy) is the world's oldest and most dangerous motorcycle race. 
              First held in 1907, riders compete on a 37.73-mile course of public roads around the island, 
              reaching speeds of over 200 mph through villages, over mountains, and past ancient stone walls.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1e1e1e] rounded-none p-6 text-center border border-white/10">
                <div className="text-4xl font-bold text-amber-600 mb-2">264</div>
                <div className="text-slate-500">Casualties Since 1907</div>
              </div>
              <div className="bg-[#1e1e1e] rounded-none p-6 text-center border border-white/10">
                <div className="text-4xl font-bold text-amber-600 mb-2">135.452</div>
                <div className="text-slate-500">Lap Record (MPH)</div>
              </div>
              <div className="bg-[#1e1e1e] rounded-none p-6 text-center border border-white/10">
                <div className="text-4xl font-bold text-amber-600 mb-2">117</div>
                <div className="text-slate-500">Years of History</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Isle of Man TT FAQ</h2>
          
          <div className="space-y-4">
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">When is Isle of Man TT 2026?</h3>
              <p className="text-slate-500">The Isle of Man TT 2026 runs from May 30th to June 13th, 2026. Practice week starts May 30th, with racing from June 6th-13th.</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">How do I get to the Isle of Man?</h3>
              <p className="text-slate-500">You can reach the Isle of Man by ferry from Liverpool, Heysham, Dublin, or Belfast. Flights are available from many UK airports. Book early during TT fortnight!</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">Do I need tickets to watch the TT?</h3>
              <p className="text-slate-500">Most spectator areas around the course are FREE! Grandstand tickets (at the start/finish) and VIP hospitality packages are available for purchase.</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-none p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-2">What's included in VIP tickets?</h3>
              <p className="text-slate-500">VIP packages include premium grandstand seating, hospitality suite access, gourmet food, open bar, paddock tours, and rider meet & greets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-900/20 to-red-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the World's Greatest Road Race</h2>
          <p className="text-slate-500 mb-8">Book your Isle of Man TT tickets now and be part of motorsport history!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/checkout?event=isle-of-man-tt-2026')} 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Ticket className="w-5 h-5 mr-2" />
              View All TT Events
            </Button>
            <Button 
              onClick={() => navigate('/motogp-tickets')} 
              size="lg" 
              variant="outline"
              className="border-white/10 hover:border-orange-500 hover:text-orange-600"
            >
              <Bike className="w-5 h-5 mr-2" />
              Browse MotoGP Tickets
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IsleOfManTTPage;
