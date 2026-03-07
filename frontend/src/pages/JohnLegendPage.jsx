import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Music, Users, Clock, Globe, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';

const TRANSLATIONS = {
  en: { title: "John Legend Abu Dhabi Concert 2026", subtitle: "Official Tickets - 5% Cheaper", buyNow: "Buy Tickets", from: "From", guarantee: "100% Guarantee" },
  ar: { title: "حفلة جون ليجند أبوظبي 2026", subtitle: "تذاكر رسمية - أرخص بـ 5%", buyNow: "اشترِ الآن", from: "من", guarantee: "ضمان 100%" },
  de: { title: "John Legend Abu Dhabi Konzert 2026", subtitle: "Offizielle Tickets - 5% Günstiger", buyNow: "Jetzt Kaufen", from: "Ab", guarantee: "100% Garantie" },
  fr: { title: "Concert John Legend Abu Dhabi 2026", subtitle: "Billets Officiels - 5% Moins Cher", buyNow: "Acheter", from: "À partir de", guarantee: "Garantie 100%" },
};

const JohnLegendPage = () => {
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
      const res = await axios.get(`${API}/events?search=John%20Legend`);
      setEvents(res.data || []);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "John Legend Live in Abu Dhabi 2026",
    "performer": {"@type": "Person", "name": "John Legend"},
    "location": {"@type": "Place", "name": "Etihad Arena", "address": {"@type": "PostalAddress", "addressLocality": "Abu Dhabi", "addressCountry": "UAE"}},
    "offers": {"@type": "AggregateOffer", "lowPrice": 90, "priceCurrency": "EUR", "availability": "https://schema.org/InStock"}
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-zinc-900/90 rounded-lg p-1 border border-zinc-800">
        {Object.keys(TRANSLATIONS).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-zinc-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 mb-4">
            <Heart className="w-4 h-4 mr-2" />🇦🇪 Abu Dhabi Exclusive
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            JOHN LEGEND
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Live in Abu Dhabi & Dubai 2026</h2>
          <p className="text-xl text-emerald-400 font-semibold mb-6">{t.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full"><Shield className="w-5 h-5" />{t.guarantee}</div>
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full"><Zap className="w-5 h-5" />Instant QR</div>
            <div className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full"><Star className="w-5 h-5" />5% Cheaper</div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-400">€{events[0]?.lowest_price || 90}</span>
            <span className="text-lg text-zinc-400 line-through ml-3">€{Math.round((events[0]?.lowest_price || 90) / 0.95)}</span>
          </div>

          <Link to={events[0] ? `/event/${events[0].event_id}` : '/events?search=John%20Legend'}>
            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-xl px-12 py-6">
              {t.buyNow} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" />100% Money-Back</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />4.9/5 Rating</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" />Official Partner</div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Concert Dates</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.event_id} to={`/event/${event.event_id}`} className="block bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-6 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-amber-400 transition-colors">{event.title}</h3>
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
                      <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
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
          <h2 className="text-2xl font-bold mb-6">John Legend Abu Dhabi 2026 - Everything You Need to Know</h2>
          <div className="prose prose-invert">
            <p className="text-zinc-300 mb-4">
              Grammy-winning artist John Legend brings his legendary voice to Abu Dhabi's Etihad Arena in March 2026. 
              Experience an unforgettable evening of soul, R&B, and timeless hits including "All of Me," "Ordinary People," and "Glory."
            </p>
            <p className="text-zinc-300 mb-4">
              EuroMatchTickets offers the best prices for John Legend Abu Dhabi tickets - guaranteed 5% cheaper than other platforms. 
              With instant QR code delivery and 100% money-back guarantee, booking has never been easier.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3">Ticket Categories</h3>
            <ul className="text-zinc-300 space-y-2">
              <li>• <strong>General Admission:</strong> €90 - Standing area access</li>
              <li>• <strong>Seated:</strong> €143 - Reserved seating</li>
              <li>• <strong>VIP:</strong> €333 - Premium view + perks</li>
              <li>• <strong>Platinum:</strong> €618 - Ultimate experience</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JohnLegendPage;
