import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Music, Users, Flame, Globe, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';

const TRANSLATIONS = {
  en: { title: "Metallica Sphere Las Vegas 2026", subtitle: "M72 World Tour - The Sphere Experience", buyNow: "Secure Your Seat Now", from: "From", snakePit: "Snake Pit VIP" },
  de: { title: "Metallica Sphere Las Vegas 2026", subtitle: "M72 Welttournee - Das Sphere Erlebnis", buyNow: "Jetzt Kaufen", from: "Ab", snakePit: "Snake Pit VIP" },
  es: { title: "Metallica Sphere Las Vegas 2026", subtitle: "M72 Gira Mundial - La Experiencia Sphere", buyNow: "Comprar", from: "Desde", snakePit: "Snake Pit VIP" },
};

const MetallicaPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events?search=Metallica`);
      setEvents(res.data || []);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Metallica at The Sphere Las Vegas 2026",
    "startDate": "2026-09-01",
    "endDate": "2026-10-31",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "performer": {"@type": "MusicGroup", "name": "Metallica"},
    "location": {"@type": "Place", "name": "The Sphere", "address": {"@type": "PostalAddress", "addressLocality": "Las Vegas", "addressCountry": "US"}},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {"@type": "AggregateOffer", "lowPrice": 617, "highPrice": 2755, "priceCurrency": "USD", "offerCount": "100", "availability": "https://schema.org/LimitedAvailability", "url": "https://euromatchtickets.com/metallica-sphere-las-vegas-tickets", "validFrom": "2025-01-01"}
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <title>Metallica Sphere Las Vegas Tickets 2026 | Snake Pit VIP $2,755 | EuroMatchTickets</title>
      <meta name="description" content="Buy Metallica tickets for The Sphere Las Vegas 2026. M72 World Tour. Snake Pit VIP from $2,755. Best prices guaranteed, instant QR delivery." />
      <meta name="keywords" content="Metallica tickets, Metallica Sphere, Metallica Las Vegas, Metallica concert 2026, Metallica VIP, Snake Pit tickets, buy Metallica tickets" />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-white/90 rounded-lg p-1 border border-slate-200">
        {Object.keys(TRANSLATIONS).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 mb-4">
            <Flame className="w-4 h-4 mr-2" />🔥 THE SPHERE EXPERIENCE
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
            METALLICA
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">M72 World Tour - The Sphere Las Vegas</h2>
          <p className="text-xl text-emerald-600 font-semibold mb-4">{t.subtitle}</p>

          {/* Snake Pit Highlight */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 px-6 py-3 rounded-full mb-6">
            <Flame className="w-6 h-6 text-red-600" />
            <span className="text-red-600 font-bold">{t.snakePit}: $2,755</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full"><Shield className="w-5 h-5" />100% Guarantee</div>
            <div className="flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full"><Zap className="w-5 h-5" />Instant QR</div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full"><Star className="w-5 h-5" />5% Cheaper</div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-600">$617</span>
            <span className="text-lg text-slate-500 ml-3">to</span>
            <span className="text-red-600 ml-2">$2,755</span>
            <span className="text-sm text-red-600 ml-2">Snake Pit</span>
          </div>

          <Link to={events[0] ? `/event/${events[0].event_id}` : '/events?search=Metallica'}>
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-xl px-12 py-6">
              {t.buyNow} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Ticket Tiers */}
      <section className="py-12 bg-gradient-to-r from-red-900/20 via-slate-900 to-orange-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Ticket Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="text-slate-500 font-bold mb-2">General</div>
              <div className="text-3xl font-bold text-white mb-2">$617</div>
              <p className="text-sm text-slate-500">Standard seating</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="text-blue-600 font-bold mb-2">Premium</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$902</div>
              <p className="text-sm text-slate-500">Enhanced view</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-xl p-6 text-center">
              <div className="text-amber-600 font-bold mb-2">VIP</div>
              <div className="text-3xl font-bold text-amber-600 mb-2">$1,710</div>
              <p className="text-sm text-slate-500">VIP lounge access</p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-slate-900/50 border border-red-500/50 rounded-xl p-6 text-center">
              <Badge className="bg-red-600 text-white mb-2">SNAKE PIT</Badge>
              <div className="text-3xl font-bold text-red-600 mb-2">$2,755</div>
              <p className="text-sm text-slate-500">Floor access, meet band</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" />100% Money-Back</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-600" />4.9/5 Trustpilot</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" />Official Partner</div>
          </div>
        </div>
      </section>

      {/* Show Dates */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">The Sphere Shows - August 2026</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.event_id} to={`/event/${event.event_id}`} className="block bg-white border border-slate-200 hover:border-orange-500/50 rounded-xl p-6 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(event.event_date)}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{t.from}</div>
                        <div className="text-2xl font-bold text-emerald-600">${event.lowest_price}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                        <Ticket className="w-4 h-4 mr-2" />{t.buyNow}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Metallica at The Sphere Las Vegas 2026</h2>
          <div className="prose prose-invert">
            <p className="text-slate-600 mb-4">
              Experience Metallica like never before at The Sphere in Las Vegas. The world's most advanced entertainment venue 
              meets the world's biggest metal band for an unprecedented residency in August 2026.
            </p>
            <p className="text-slate-600 mb-4">
              The Sphere's 160,000 square feet of LED display wraps around the audience, creating a 360-degree visual experience 
              that will transform Metallica's legendary stage show into something truly unforgettable.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3">Snake Pit Experience - $2,755</h3>
            <ul className="text-slate-600 space-y-2">
              <li>• Floor standing area directly in front of stage</li>
              <li>• Exclusive Snake Pit entrance</li>
              <li>• Meet & greet opportunity with band</li>
              <li>• Limited edition merchandise</li>
              <li>• Premium bar access</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MetallicaPage;
