import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Music, Users, Sun, Globe, Crown, Sparkles, PartyPopper } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';

const TRANSLATIONS = {
  en: { title: "ACL Festival 2026 Tickets", subtitle: "Austin City Limits - The Ultimate Festival", buyNow: "Buy Pass", from: "From", ultimate: "Ultimate Experience" },
  es: { title: "Entradas ACL Festival 2026", subtitle: "Austin City Limits - El Festival Definitivo", buyNow: "Comprar Pase", from: "Desde", ultimate: "Experiencia Definitiva" },
  de: { title: "ACL Festival 2026 Tickets", subtitle: "Austin City Limits - Das Ultimative Festival", buyNow: "Pass Kaufen", from: "Ab", ultimate: "Ultimative Erfahrung" },
};

const ACLFestivalPage = () => {
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
      const res = await axios.get(`${API}/events?search=ACL%20Festival`);
      setEvents(res.data || []);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Festival",
    "name": "ACL Festival 2026 - Austin City Limits",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": {"@type": "Place", "name": "Zilker Park", "address": {"@type": "PostalAddress", "addressLocality": "Austin", "addressRegion": "Texas", "addressCountry": "US"}},
    "startDate": "2026-10-02",
    "endDate": "2026-10-10",
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {"@type": "AggregateOffer", "lowPrice": 332, "highPrice": 25650, "priceCurrency": "USD", "offerCount": "100", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/acl-festival-2026-tickets", "validFrom": "2025-01-01"}
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <title>ACL Festival 2026 Tickets | Austin City Limits | Ultimate Pass $25,650 | EuroMatchTickets</title>
      <meta name="description" content="Buy ACL Festival 2026 tickets. Austin City Limits October 2026. Ultimate Experience pass $25,650, Platinum $4,892. Best prices, instant delivery." />
      <meta name="keywords" content="ACL Festival tickets, Austin City Limits 2026, ACL 2026, ACL VIP tickets, ACL Platinum, buy ACL tickets, ACL festival pass" />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-white/90 rounded-none p-1 border border-white/10">
        {Object.keys(TRANSLATIONS).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-white'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 mb-4">
            <Sun className="w-4 h-4 mr-2" />🌵 AUSTIN, TEXAS
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            ACL FESTIVAL
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Austin City Limits 2026</h2>
          <p className="text-xl text-slate-500 mb-2">October 2-3 & 9-10, 2026 • Zilker Park</p>
          <p className="text-xl text-emerald-600 font-semibold mb-4">{t.subtitle}</p>

          {/* Ultimate Package Highlight */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 px-6 py-3 rounded-full mb-6">
            <Crown className="w-6 h-6 text-violet-600" />
            <span className="text-violet-600 font-bold">{t.ultimate}: $25,650</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full"><Shield className="w-5 h-5" />100% Guarantee</div>
            <div className="flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full"><Zap className="w-5 h-5" />Instant QR</div>
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full"><Star className="w-5 h-5" />5% Cheaper</div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-600">$332</span>
            <span className="text-lg text-slate-500 ml-3">to</span>
            <span className="text-violet-600 ml-2">$25,650</span>
            <span className="text-sm text-violet-600 ml-2">Ultimate</span>
          </div>

          <Link to={events[0] ? `/event/${events[0].slug || events[0].event_id}` : '/events?search=ACL%20Festival'}>
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-xl px-12 py-6">
              {t.buyNow} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pass Types */}
      <section className="py-12 bg-gradient-to-r from-green-900/20 via-slate-900 to-teal-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Festival Passes</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5 text-center">
              <div className="text-slate-500 font-bold mb-2 text-sm">Day Pass</div>
              <div className="text-2xl font-bold text-white mb-1">$332</div>
              <p className="text-xs text-slate-400">Single day access</p>
            </div>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5 text-center">
              <div className="text-green-600 font-bold mb-2 text-sm">Weekend</div>
              <div className="text-2xl font-bold text-green-600 mb-1">$712</div>
              <p className="text-xs text-slate-400">3-day weekend</p>
            </div>
            <div className="bg-[#1e1e1e] border border-amber-200 rounded-none p-5 text-center">
              <div className="text-amber-600 font-bold mb-2 text-sm">VIP Weekend</div>
              <div className="text-2xl font-bold text-amber-600 mb-1">$2,375</div>
              <p className="text-xs text-slate-400">Premium access</p>
            </div>
            <div className="bg-[#1e1e1e] border border-violet-200 rounded-none p-5 text-center">
              <Badge className="bg-purple-600 text-white text-xs mb-2">PLATINUM</Badge>
              <div className="text-2xl font-bold text-violet-600 mb-1">$4,892</div>
              <p className="text-xs text-slate-400">All weekends + perks</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/30 to-slate-900/50 border border-pink-500/50 rounded-none p-5 text-center">
              <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs mb-2">ULTIMATE</Badge>
              <div className="text-2xl font-bold text-pink-600 mb-1">$25,650</div>
              <p className="text-xs text-slate-400">VIP everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" />100% Money-Back</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-600" />4.9/5 Trustpilot</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-600" />2M+ Sold</div>
          </div>
        </div>
      </section>

      {/* Event Dates */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Festival Dates 2026</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.event_id} to={`/event/${event.slug || event.event_id}`} className="block bg-[#1e1e1e] border border-white/10 hover:border-green-500/50 rounded-none p-6 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-none bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center">
                        <PartyPopper className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">{event.title}</h3>
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
                      <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
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
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">ACL Festival 2026 - Austin City Limits</h2>
          <div className="prose prose-invert">
            <p className="text-slate-400 mb-4">
              Austin City Limits Music Festival returns to Zilker Park for its 25th anniversary in October 2026. 
              Experience eight stages, 130+ acts, and the legendary Austin food scene over two weekends.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3">Ultimate Experience Pass - $25,650</h3>
            <p className="text-slate-400 mb-4">The most exclusive ACL experience ever offered includes:</p>
            <ul className="text-slate-400 space-y-2">
              <li>• All-access pass for both weekends</li>
              <li>• Private viewing platforms at every stage</li>
              <li>• Artist meet & greets</li>
              <li>• Gourmet dining experiences</li>
              <li>• Luxury hotel accommodation</li>
              <li>• Private transportation</li>
              <li>• Exclusive after-parties</li>
              <li>• Lifetime ACL membership</li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3">Expected Headliners 2026</h3>
            <p className="text-slate-400">
              Past headliners include Radiohead, Pearl Jam, Red Hot Chili Peppers, The Cure, Foo Fighters, 
              Billie Eilish, and more. 2026 lineup announcement coming soon!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ACLFestivalPage;
