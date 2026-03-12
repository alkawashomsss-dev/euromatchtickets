import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Music, Users, Clock, Globe, Sparkles, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';

const TRANSLATIONS = {
  en: { title: "Harry Styles Tickets 2026", subtitle: "Together Together Tour - Official Tickets", buyNow: "Buy Tickets", from: "From", vipTitle: "VIP Packages Available", berlinVip: "Berlin VIP Experience €15,300" },
  de: { title: "Harry Styles Tickets 2026", subtitle: "Together Together Tour - Offizielle Tickets", buyNow: "Jetzt Kaufen", from: "Ab", vipTitle: "VIP-Pakete Verfügbar", berlinVip: "Berlin VIP Experience €15.300" },
  fr: { title: "Billets Harry Styles 2026", subtitle: "Together Together Tour - Billets Officiels", buyNow: "Acheter", from: "À partir de", vipTitle: "Forfaits VIP Disponibles", berlinVip: "Berlin VIP Experience 15 300€" },
  es: { title: "Entradas Harry Styles 2026", subtitle: "Together Together Tour - Entradas Oficiales", buyNow: "Comprar", from: "Desde", vipTitle: "Paquetes VIP Disponibles", berlinVip: "Berlin VIP Experience €15.300" },
  ar: { title: "تذاكر هاري ستايلز 2026", subtitle: "جولة Together Together - تذاكر رسمية", buyNow: "اشترِ الآن", from: "من", vipTitle: "باقات VIP متاحة", berlinVip: "تجربة برلين VIP €15,300" },
};

const HarryStylesPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
    const browserLang = navigator.language?.split('-')[0] || 'en';
    if (TRANSLATIONS[browserLang]) setLang(browserLang);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events?search=Harry%20Styles`);
      setEvents(res.data || []);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Harry Styles Together Together Tour 2026",
    "startDate": "2026-06-01",
    "endDate": "2026-09-30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo.png",
    "location": { "@type": "Place", "name": "Multiple Venues", "address": { "@type": "PostalAddress", "addressLocality": "Europe", "addressCountry": "EU" } },
    "performer": {"@type": "Person", "name": "Harry Styles"},
    "description": "Harry Styles live in concert. Together Together Tour 2026. VIP tickets from €427 to €15,300.",
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {"@type": "AggregateOffer", "lowPrice": 427, "highPrice": 15300, "priceCurrency": "EUR", "availability": "https://schema.org/InStock"}
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      {/* SEO Meta */}
      <title>Harry Styles Tickets 2026 | Together Together Tour | VIP from €15,300 | EuroMatchTickets</title>
      <meta name="description" content="Buy Harry Styles concert tickets for Together Together Tour 2026. VIP packages up to €15,300. Berlin, London, Paris dates. 5% cheaper, instant delivery." />
      <meta name="keywords" content="Harry Styles tickets, Harry Styles concert 2026, Harry Styles tour, Harry Styles VIP, Harry Styles Berlin, buy Harry Styles tickets, cheap Harry Styles tickets" />

      {/* Hreflang */}
      <link rel="alternate" hrefLang="en" href="https://euromatchtickets.com/harry-styles-tickets" />
      <link rel="alternate" hrefLang="de" href="https://euromatchtickets.com/harry-styles-tickets?lang=de" />
      <link rel="alternate" hrefLang="fr" href="https://euromatchtickets.com/harry-styles-tickets?lang=fr" />
      <link rel="alternate" hrefLang="es" href="https://euromatchtickets.com/harry-styles-tickets?lang=es" />
      <link rel="alternate" hrefLang="ar" href="https://euromatchtickets.com/harry-styles-tickets?lang=ar" />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-zinc-900/90 rounded-lg p-1 border border-zinc-800">
        {Object.keys(TRANSLATIONS).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1920)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-zinc-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />🔥 Selling Fast!
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            HARRY STYLES
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Together Together Tour 2026</h2>
          <p className="text-xl text-emerald-400 font-semibold mb-4">{t.subtitle}</p>

          {/* VIP Highlight */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 px-6 py-3 rounded-full mb-6">
            <Crown className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-bold">{t.berlinVip}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full"><Shield className="w-5 h-5" />100% Guarantee</div>
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full"><Zap className="w-5 h-5" />Instant QR</div>
            <div className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full"><Star className="w-5 h-5" />5% Cheaper</div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-400">€{events[0]?.lowest_price || 427}</span>
            <span className="text-lg text-zinc-400 ml-3">to</span>
            <span className="text-amber-400 ml-2">€15,300</span>
            <span className="text-sm text-amber-400 ml-2">VIP</span>
          </div>

          <Link to={events[0] ? `/event/${events[0].event_id}` : '/events?search=Harry%20Styles'}>
            <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-xl px-12 py-6">
              {t.buyNow} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* VIP Packages */}
      <section className="py-12 bg-gradient-to-r from-amber-900/20 via-zinc-900 to-amber-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />{t.vipTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="text-amber-400 font-bold mb-2">VIP Gold</div>
              <div className="text-3xl font-bold text-white mb-2">€5,225</div>
              <p className="text-sm text-zinc-400">Premium seating, early entry, exclusive merch</p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-zinc-900/50 border border-amber-500/50 rounded-xl p-6 text-center">
              <div className="text-amber-400 font-bold mb-2">VIP Platinum</div>
              <div className="text-3xl font-bold text-amber-400 mb-2">€9,025</div>
              <p className="text-sm text-zinc-400">Front row, meet & greet opportunity, VIP lounge</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900/50 border border-purple-500/50 rounded-xl p-6 text-center">
              <Badge className="bg-purple-600 text-white mb-2">ULTIMATE</Badge>
              <div className="text-3xl font-bold text-purple-400 mb-2">€15,300</div>
              <p className="text-sm text-zinc-400">Berlin exclusive, backstage, dinner with team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" />100% Money-Back</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />4.9/5 Trustpilot</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" />2M+ Tickets Sold</div>
          </div>
        </div>
      </section>

      {/* Tour Dates */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Tour Dates 2026</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.event_id} to={`/event/${event.event_id}`} className="block bg-zinc-900/50 border border-zinc-800 hover:border-pink-500/50 rounded-xl p-6 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold group-hover:text-pink-400 transition-colors">{event.title}</h3>
                          {event.title.includes('VIP') && <Badge className="bg-amber-500 text-white">VIP</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-zinc-400 text-sm mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(event.event_date)}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-zinc-400">{t.from}</div>
                        <div className="text-2xl font-bold text-emerald-400">€{event.lowest_price}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
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
      <section className="py-16 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Harry Styles Together Together Tour 2026 - Complete Guide</h2>
          <div className="prose prose-invert">
            <p className="text-zinc-300 mb-4">
              Harry Styles returns to Europe with his highly anticipated "Together Together" Tour in 2026. 
              Following the massive success of "Love On Tour," this new tour promises an even more spectacular show 
              with new music, stunning visuals, and Harry's legendary stage presence.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3">Berlin VIP Experience - €15,300</h3>
            <p className="text-zinc-300 mb-4">
              The ultimate Harry Styles experience is available exclusively in Berlin. This diamond package includes:
            </p>
            <ul className="text-zinc-300 space-y-2">
              <li>• Front row seats at Mercedes-Benz Arena</li>
              <li>• Private backstage tour</li>
              <li>• Exclusive dinner with tour team</li>
              <li>• Signed merchandise & memorabilia</li>
              <li>• Professional photo opportunity</li>
              <li>• VIP concierge service</li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3">Ticket Prices</h3>
            <ul className="text-zinc-300 space-y-2">
              <li>• <strong>General:</strong> €427 - €500</li>
              <li>• <strong>Seated:</strong> €713 - €850</li>
              <li>• <strong>VIP:</strong> €1,140 - €1,400</li>
              <li>• <strong>Platinum:</strong> €2,375 - €2,800</li>
              <li>• <strong>Diamond (Berlin):</strong> €15,300</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HarryStylesPage;
