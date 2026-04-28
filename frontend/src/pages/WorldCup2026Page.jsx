import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Trophy, Users, Globe, Crown, Flame, Flag, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import SEOHead from "../components/SEOHead";

const TRANSLATIONS = {
  en: { title: "FIFA World Cup 2026 Tickets", subtitle: "USA • Canada • Mexico", buyNow: "Secure Your Seat Now", from: "From", final: "World Cup Final", guarantee: "Buyer protection" },
  de: { title: "FIFA WM 2026 Tickets", subtitle: "USA • Kanada • Mexiko", buyNow: "Jetzt Kaufen", from: "Ab", final: "WM-Finale", guarantee: "100% Garantie" },
  es: { title: "Entradas Copa Mundial FIFA 2026", subtitle: "USA • Canadá • México", buyNow: "Comprar", from: "Desde", final: "Final del Mundial", guarantee: "100% Garantía" },
  fr: { title: "Billets Coupe du Monde FIFA 2026", subtitle: "USA • Canada • Mexique", buyNow: "Acheter", from: "À partir de", final: "Finale de la Coupe", guarantee: "Garantie 100%" },
  ar: { title: "تذاكر كأس العالم 2026", subtitle: "أمريكا • كندا • المكسيك", buyNow: "اشترِ الآن", from: "من", final: "نهائي كأس العالم", guarantee: "ضمان 100%" },
  pt: { title: "Ingressos Copa do Mundo FIFA 2026", subtitle: "EUA • Canadá • México", buyNow: "Comprar", from: "A partir de", final: "Final da Copa", guarantee: "100% Garantia" }
};

const WorldCup2026Page = () => {
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
      const res = await axios.get(`${API}/events?search=World%20Cup%202026`);
      const wcEvents = res.data?.filter(e => e.title?.includes('World Cup') || e.event_type === 'worldcup') || [];
      setEvents(wcEvents);
    } catch (error) { console.error('Error:', error); }
    setLoading(false);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  
  const finalEvent = events.find(e => e.title?.includes('Final'));
  const semiEvents = events.filter(e => e.title?.includes('Semi'));
  const groupEvents = events.filter(e => e.title?.includes('vs') || e.title?.includes('Quarter'));

  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "FIFA World Cup 2026",
    "description": "FIFA World Cup 2026 tickets. Final, Semi-Finals, Quarter-Finals, Group Stage. USA, Canada, Mexico.",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": [
      {"@type": "Place", "name": "MetLife Stadium", "address": {"@type": "PostalAddress", "addressLocality": "New York", "addressCountry": "US"}},
      {"@type": "Place", "name": "AT&T Stadium", "address": {"@type": "PostalAddress", "addressLocality": "Dallas", "addressCountry": "US"}},
      {"@type": "Place", "name": "Azteca Stadium", "address": {"@type": "PostalAddress", "addressLocality": "Mexico City", "addressCountry": "MX"}}
    ],
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "performer": {"@type": "SportsTeam", "name": "FIFA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead
        title="FIFA World Cup 2026 Tickets | USA Mexico Canada"
        description="Buy FIFA World Cup 2026 tickets from €99. Group stages, knockout rounds, and final. Verified verified tickets in Europe."
        image="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=630&fit=crop"
        canonicalUrl="https://euromatchtickets.com/world-cup-2026"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "World Cup 2026", url: "https://euromatchtickets.com/world-cup-2026" }]} />
      
      <title>FIFA World Cup 2026 Tickets | Final $1,425 | Semi-Finals | Group Stage | EuroMatchTickets</title>
      <meta name="description" content="Buy FIFA World Cup 2026 tickets. Final in New York from $1,425. Semi-Finals, Quarter-Finals, Group Stage matches. Argentina vs France rematch. Best prices, instant delivery." />
      <meta name="keywords" content="World Cup 2026 tickets, FIFA World Cup tickets, World Cup Final tickets, World Cup USA tickets, buy World Cup tickets, World Cup 2026 schedule, Argentina World Cup, Brazil World Cup, Germany World Cup" />

      {/* Hreflang */}
      <link rel="alternate" hrefLang="en" href="https://euromatchtickets.com/world-cup-2026-tickets" />
      <link rel="alternate" hrefLang="de" href="https://euromatchtickets.com/world-cup-2026-tickets?lang=de" />
      <link rel="alternate" hrefLang="es" href="https://euromatchtickets.com/world-cup-2026-tickets?lang=es" />
      <link rel="alternate" hrefLang="fr" href="https://euromatchtickets.com/world-cup-2026-tickets?lang=fr" />
      <link rel="alternate" hrefLang="ar" href="https://euromatchtickets.com/world-cup-2026-tickets?lang=ar" />
      <link rel="alternate" hrefLang="pt" href="https://euromatchtickets.com/world-cup-2026-tickets?lang=pt" />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-white/90 rounded-none p-1 border border-white/10">
        {Object.keys(TRANSLATIONS).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-white'}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-0 mb-4">
            <Trophy className="w-4 h-4 mr-2" />🏆 {t.subtitle}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            FIFA WORLD CUP
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">2026</h2>
          <p className="text-xl text-emerald-600 font-semibold mb-4">Secure your seat now - Up to 40% cheaper than Viagogo & StubHub</p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#e10600]/100/20 border border-red-500/30 rounded-full px-3 py-1.5 text-red-300 text-sm font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Only 2,340 tickets left for Final
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/100/20 border border-amber-500/30 rounded-full px-3 py-1.5 text-amber-300 text-sm font-medium">
              <Users className="w-3.5 h-3.5" /> 1,Listings updated recently
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/100/20 border border-emerald-500/30 rounded-full px-3 py-1.5 text-emerald-300 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Prices up 25% this month
            </span>
          </div>

          {/* Final Highlight */}
          {finalEvent && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 px-6 py-3 rounded-full mb-6">
              <Crown className="w-6 h-6 text-amber-600" />
              <span className="text-amber-600 font-bold">{t.final}: ${finalEvent.lowest_price?.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full"><Shield className="w-5 h-5" />{t.guarantee}</div>
            <div className="flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full"><Zap className="w-5 h-5" />Instant QR</div>
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full"><Flame className="w-5 h-5" />High Demand</div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-600">${events[0]?.lowest_price?.toLocaleString() || '285'}</span>
            <span className="text-lg text-slate-500 ml-3">to</span>
            <span className="text-amber-600 ml-2">$35,000</span>
            <span className="text-sm text-amber-600 ml-2">Hospitality</span>
          </div>

          <Link to={finalEvent ? `/event/${finalEvent.slug || finalEvent.event_id}` : '/events?search=World%20Cup'}>
            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-xl px-12 py-6" data-testid="wc-hero-cta">
              Secure Your Seat Now <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" />Live marketplace</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-600" />Highly rated from Customer reviews</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-600" />Trusted in 25+ Countries</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" />Refund policy applies</div>
          </div>
        </div>
      </section>

      {/* Final & Semi-Finals */}
      <section className="py-12 bg-gradient-to-r from-amber-900/20 via-slate-900 to-yellow-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-amber-600" />Knockout Stage - Premium Tickets
          </h2>
          
          <div className="space-y-4">
            {/* Final */}
            {finalEvent && (
              <Link to={`/event/${finalEvent.slug || finalEvent.event_id}`} className="block bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-500/50 rounded-none p-6 hover:border-amber-400 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-none bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-amber-500/100 text-white mb-1">FINAL</Badge>
                      <h3 className="text-xl font-bold group-hover:text-amber-600 transition-colors">{finalEvent.title}</h3>
                      <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(finalEvent.event_date)}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{finalEvent.venue}, {finalEvent.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-500">{t.from}</div>
                      <div className="text-2xl font-bold text-amber-600">${finalEvent.lowest_price?.toLocaleString()}</div>
                    </div>
                    <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                      <Ticket className="w-4 h-4 mr-2" />{t.buyNow}
                    </Button>
                  </div>
                </div>
              </Link>
            )}

            {/* Semi-Finals */}
            {semiEvents.map((event) => (
              <Link key={event.event_id} to={`/event/${event.slug || event.event_id}`} className="block bg-[#1e1e1e] border border-violet-200 rounded-none p-6 hover:border-purple-500 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-none bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Flag className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-purple-500/100 text-white mb-1">SEMI-FINAL</Badge>
                      <h3 className="text-xl font-bold group-hover:text-violet-600 transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(event.event_date)}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-500">{t.from}</div>
                      <div className="text-2xl font-bold text-emerald-600">${event.lowest_price?.toLocaleString()}</div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Ticket className="w-4 h-4 mr-2" />{t.buyNow}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Group Stage & Quarter-Finals */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Group Stage & Quarter-Finals</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : groupEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Loading World Cup matches...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {groupEvents.map((event) => (
                <Link key={event.event_id} to={`/event/${event.slug || event.event_id}`} className="block bg-[#1e1e1e] border border-white/10 hover:border-emerald-500/50 rounded-none p-5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                      <div className="text-sm text-slate-500">{formatDate(event.event_date)} • {event.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">${event.lowest_price?.toLocaleString()}</div>
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
          <h2 className="text-2xl font-bold mb-6">FIFA World Cup 2026 - Complete Ticket Guide</h2>
          <div className="prose prose-invert">
            <p className="text-slate-400 mb-4">
              The 2026 FIFA World Cup will be the first to feature 48 teams, hosted across the United States, Canada, and Mexico. 
              This historic tournament runs from June 11 to July 19, 2026, with the Final at MetLife Stadium, New York.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3">Ticket Categories & Prices</h3>
            <ul className="text-slate-400 space-y-2">
              <li>• <strong>Category 3:</strong> $285+ - Standard seating</li>
              <li>• <strong>Category 2:</strong> $650+ - Premium view</li>
              <li>• <strong>Category 1:</strong> $1,400+ - Best seats</li>
              <li>• <strong>VIP:</strong> $3,300+ - VIP lounge access</li>
              <li>• <strong>Hospitality:</strong> $8,000-$35,000 - Ultimate experience</li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3">Key Matches</h3>
            <ul className="text-slate-400 space-y-2">
              <li>• <strong>Argentina vs France:</strong> Rematch of 2022 Final</li>
              <li>• <strong>Germany vs Brazil:</strong> Classic rivalry</li>
              <li>• <strong>England vs Spain:</strong> European clash</li>
            </ul>
          </div>
        </div>
      </section>
      {/* Internal Links - SEO Boost */}
      <section className="py-16 bg-[#1e1e1e]" data-testid="wc-internal-links">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">More Events on EuroMatchTickets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#15151e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-600" /> Football</h3>
              <ul className="space-y-2">
                <li><Link to="/champions-league-tickets" className="text-blue-600 hover:underline text-sm">Buy Champions League tickets</Link></li>
                <li><Link to="/cheap-champions-league-tickets" className="text-blue-600 hover:underline text-sm">Cheap Champions League tickets</Link></li>
                <li><Link to="/buy-premier-league-tickets" className="text-blue-600 hover:underline text-sm">Buy Premier League tickets</Link></li>
                <li><Link to="/el-clasico-tickets" className="text-blue-600 hover:underline text-sm">El Clasico tickets</Link></li>
                <li><Link to="/cheap-world-cup-2026-tickets" className="text-blue-600 hover:underline text-sm">Cheap World Cup 2026 tickets</Link></li>
                <li><Link to="/buy-world-cup-final-2026-tickets" className="text-blue-600 hover:underline text-sm">World Cup Final 2026 tickets</Link></li>
              </ul>
            </div>
            <div className="bg-[#15151e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-red-500" /> Formula 1</h3>
              <ul className="space-y-2">
                <li><Link to="/f1-tickets" className="text-blue-600 hover:underline text-sm">F1 tickets 2026</Link></li>
                <li><Link to="/cheap-f1-tickets-2026" className="text-blue-600 hover:underline text-sm">Cheap F1 tickets 2026</Link></li>
                <li><Link to="/monaco-grand-prix-tickets" className="text-blue-600 hover:underline text-sm">Monaco Grand Prix tickets</Link></li>
                <li><Link to="/f1-vip-tickets-2026" className="text-blue-600 hover:underline text-sm">F1 VIP tickets 2026</Link></li>
              </ul>
            </div>
            <div className="bg-[#15151e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-purple-500" /> Concerts</h3>
              <ul className="space-y-2">
                <li><Link to="/taylor-swift-wembley-2026-tickets" className="text-blue-600 hover:underline text-sm">Taylor Swift Wembley tickets</Link></li>
                <li><Link to="/coldplay-tour-2026" className="text-blue-600 hover:underline text-sm">Coldplay tour 2026 tickets</Link></li>
                <li><Link to="/bruno-mars-tour-2026" className="text-blue-600 hover:underline text-sm">Bruno Mars tour 2026</Link></li>
                <li><Link to="/cheap-concert-tickets-europe" className="text-blue-600 hover:underline text-sm">Cheap concert tickets Europe</Link></li>
              </ul>
            </div>
            <div className="bg-[#15151e] rounded-none p-5 border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" /> By City</h3>
              <ul className="space-y-2">
                <li><Link to="/london-event-tickets" className="text-blue-600 hover:underline text-sm">London event tickets</Link></li>
                <li><Link to="/paris-event-tickets" className="text-blue-600 hover:underline text-sm">Paris event tickets</Link></li>
                <li><Link to="/madrid-event-tickets" className="text-blue-600 hover:underline text-sm">Madrid event tickets</Link></li>
                <li><Link to="/barcelona-event-tickets" className="text-blue-600 hover:underline text-sm">Barcelona event tickets</Link></li>
                <li><Link to="/milan-event-tickets" className="text-blue-600 hover:underline text-sm">Milan event tickets</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorldCup2026Page;
