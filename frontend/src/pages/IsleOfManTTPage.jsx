import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Bike, Trophy, Mountain, Clock, AlertTriangle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
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
    "@type": "SportsEvent",
    "name": "Isle of Man TT 2026",
    "description": "Buy Isle of Man TT 2026 tickets. The world's most dangerous motorcycle race. Grandstand, VIP hospitality, and race week passes.",
    "startDate": "2026-05-30",
    "endDate": "2026-06-13",
    "location": { "@type": "Place", "name": "Snaefell Mountain Course", "address": "Isle of Man, British Isles" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "45", "highPrice": "599" }
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
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Isle of Man TT Tickets 2026 - Buy TT Race Tickets | Grandstand & VIP Passes"
        description="Buy Isle of Man TT 2026 tickets from €149. The world's most dangerous motorcycle race! Grandstand passes, VIP hospitality. May - June 2026. Instant delivery. 100% guarantee."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg')] opacity-10 bg-cover bg-center" />
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">The World's Most Dangerous Race</span>
          </div>
          
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6 ml-2">
            <Trophy className="w-4 h-4 mr-2" />Since 1907 - 117 Years of Racing History
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Isle of Man TT 2026 Tickets
            <span className="block text-2xl md:text-3xl mt-2 text-zinc-400">37.73 Miles • 200 MPH • Pure Adrenaline</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
            Experience the legendary Isle of Man TT! Riders reach 200mph on public roads around the famous Snaefell Mountain Course.
            <strong className="text-emerald-400"> Tickets from €149!</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Mountain className="w-5 h-5 text-amber-400" /><span>37.73 Mile Course</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
              <Clock className="w-5 h-5 text-amber-400" /><span>200+ MPH Speeds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <Ticket className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400">From €149</span>
            </div>
          </div>

          <div className="inline-block bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-6">
            <div className="text-zinc-400 text-sm">Race Week Tickets from</div>
            <div className="text-5xl font-bold text-amber-400">€149</div>
            <div className="text-amber-400 text-sm mt-1">VIP Packages Available</div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><Shield className="w-5 h-5" /><span>100% Ticket Guarantee</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Zap className="w-5 h-5" /><span>Instant QR Delivery</span></div>
            <div className="flex items-center gap-2 text-emerald-400"><Star className="w-5 h-5" /><span>Official Partner</span></div>
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
              <p className="text-zinc-400 text-xl mb-4">No Isle of Man TT events available at the moment.</p>
              <Button 
                onClick={() => navigate('/events')} 
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
                  to={`/event/${event.event_id}`}
                  className="group bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                        Featured Event
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-zinc-400 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{event.venue || "Snaefell Mountain Course"}, {event.city || "Douglas"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 text-sm">From</span>
                        <span className="text-2xl font-bold text-emerald-400 ml-2">€149</span>
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
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">About the Isle of Man TT</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-400 text-lg mb-6">
              The Isle of Man TT (Tourist Trophy) is the world's oldest and most dangerous motorcycle race. 
              First held in 1907, riders compete on a 37.73-mile course of public roads around the island, 
              reaching speeds of over 200 mph through villages, over mountains, and past ancient stone walls.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900/50 rounded-xl p-6 text-center border border-zinc-800">
                <div className="text-4xl font-bold text-amber-400 mb-2">264</div>
                <div className="text-zinc-400">Casualties Since 1907</div>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-6 text-center border border-zinc-800">
                <div className="text-4xl font-bold text-amber-400 mb-2">135.452</div>
                <div className="text-zinc-400">Lap Record (MPH)</div>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-6 text-center border border-zinc-800">
                <div className="text-4xl font-bold text-amber-400 mb-2">117</div>
                <div className="text-zinc-400">Years of History</div>
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
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">When is Isle of Man TT 2026?</h3>
              <p className="text-zinc-400">The Isle of Man TT 2026 runs from May 30th to June 13th, 2026. Practice week starts May 30th, with racing from June 6th-13th.</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">How do I get to the Isle of Man?</h3>
              <p className="text-zinc-400">You can reach the Isle of Man by ferry from Liverpool, Heysham, Dublin, or Belfast. Flights are available from many UK airports. Book early during TT fortnight!</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">Do I need tickets to watch the TT?</h3>
              <p className="text-zinc-400">Most spectator areas around the course are FREE! Grandstand tickets (at the start/finish) and VIP hospitality packages are available for purchase.</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
              <h3 className="font-bold text-lg mb-2">What's included in VIP tickets?</h3>
              <p className="text-zinc-400">VIP packages include premium grandstand seating, hospitality suite access, gourmet food, open bar, paddock tours, and rider meet & greets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-900/20 to-red-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the World's Greatest Road Race</h2>
          <p className="text-zinc-400 mb-8">Book your Isle of Man TT tickets now and be part of motorsport history!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate('/events?type=isle_of_man_tt')} 
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
              className="border-zinc-700 hover:border-orange-500 hover:text-orange-400"
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
