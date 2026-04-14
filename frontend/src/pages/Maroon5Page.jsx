import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Shield, Zap, ArrowRight, Music, Users, Clock, Globe, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { API } from '../App';
import axios from 'axios';
import ProductSchema from "../components/ProductSchema";

// Multilingual SEO content
const TRANSLATIONS = {
  en: {
    title: "Maroon 5 Concert Tickets 2026",
    subtitle: "Official Tickets - 5% Cheaper Than Market Price",
    description: "Buy Maroon 5 concert tickets for the 2026 World Tour. Best prices guaranteed, instant QR delivery, 100% money-back guarantee.",
    buyNow: "Buy Tickets Now",
    from: "From",
    guarantee: "100% Guarantee",
    instant: "Instant Delivery",
    cheapest: "Cheapest Prices",
    tourDates: "Tour Dates",
    whyBuy: "Why Buy From Us?",
    soldOut: "Sold Out Elsewhere? We Have Tickets!"
  },
  de: {
    title: "Maroon 5 Konzerttickets 2026",
    subtitle: "Offizielle Tickets - 5% Günstiger als Marktpreis",
    description: "Kaufen Sie Maroon 5 Konzerttickets für die Welttournee 2026. Beste Preise garantiert, sofortige QR-Lieferung, 100% Geld-zurück-Garantie.",
    buyNow: "Jetzt Tickets Kaufen",
    from: "Ab",
    guarantee: "100% Garantie",
    instant: "Sofortige Lieferung",
    cheapest: "Günstigste Preise",
    tourDates: "Tourdaten",
    whyBuy: "Warum bei uns kaufen?",
    soldOut: "Woanders ausverkauft? Wir haben Tickets!"
  },
  fr: {
    title: "Billets Concert Maroon 5 2026",
    subtitle: "Billets Officiels - 5% Moins Cher que le Marché",
    description: "Achetez des billets pour le concert Maroon 5 de la tournée mondiale 2026. Meilleurs prix garantis, livraison QR instantanée, garantie de remboursement à 100%.",
    buyNow: "Acheter Maintenant",
    from: "À partir de",
    guarantee: "Garantie 100%",
    instant: "Livraison Instantanée",
    cheapest: "Prix les Plus Bas",
    tourDates: "Dates de Tournée",
    whyBuy: "Pourquoi Acheter Chez Nous?",
    soldOut: "Épuisé Ailleurs? Nous Avons des Billets!"
  },
  es: {
    title: "Entradas Concierto Maroon 5 2026",
    subtitle: "Entradas Oficiales - 5% Más Baratas que el Mercado",
    description: "Compra entradas para el concierto de Maroon 5 de la gira mundial 2026. Mejores precios garantizados, entrega QR instantánea, garantía de devolución del 100%.",
    buyNow: "Comprar Ahora",
    from: "Desde",
    guarantee: "100% Garantía",
    instant: "Entrega Instantánea",
    cheapest: "Precios Más Bajos",
    tourDates: "Fechas de Gira",
    whyBuy: "¿Por Qué Comprarnos?",
    soldOut: "¿Agotado en Otros Sitios? ¡Tenemos Entradas!"
  },
  ar: {
    title: "تذاكر حفل Maroon 5 2026",
    subtitle: "تذاكر رسمية - أرخص بـ 5% من سعر السوق",
    description: "اشترِ تذاكر حفل Maroon 5 لجولة 2026 العالمية. أفضل الأسعار مضمونة، توصيل QR فوري، ضمان استرداد 100%.",
    buyNow: "اشترِ الآن",
    from: "من",
    guarantee: "ضمان 100%",
    instant: "توصيل فوري",
    cheapest: "أرخص الأسعار",
    tourDates: "مواعيد الجولة",
    whyBuy: "لماذا تشتري منا؟",
    soldOut: "نفدت في مكان آخر؟ لدينا تذاكر!"
  }
};

const Maroon5Page = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
    // Detect browser language
    const browserLang = navigator.language?.split('-')[0] || 'en';
    if (TRANSLATIONS[browserLang]) setLang(browserLang);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events?search=Maroon%205`);
      setEvents(res.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  // Schema.org for SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Maroon 5 World Tour 2026",
    "startDate": "2026-06-01",
    "endDate": "2026-12-31",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://euromatchtickets.com/logo-192.png",
    "location": { "@type": "Place", "name": "Multiple Venues", "address": { "@type": "PostalAddress", "addressLocality": "Europe", "addressCountry": "EU" } },
    "performer": {"@type": "MusicGroup", "name": "Maroon 5"},
    "description": t.description,
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": events[0]?.lowest_price || 71,
      "highPrice": 500,
      "priceCurrency": "EUR",
      "offerCount": "100",
      "availability": "https://schema.org/InStock",
      "url": "https://euromatchtickets.com/maroon-5-tickets",
      "validFrom": "2025-01-01"
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      {/* SEO Meta Tags */}
      <title>{t.title} | EuroMatchTickets</title>
      <meta name="description" content={t.description} />
      <meta name="keywords" content="Maroon 5 tickets, Maroon 5 concert 2026, Maroon 5 tour, buy Maroon 5 tickets, cheap Maroon 5 tickets, Maroon 5 Europe tour, Adam Levine concert" />
      
      {/* Hreflang for multilingual SEO */}
      <link rel="alternate" hrefLang="en" href="https://euromatchtickets.com/maroon-5-tickets" />
      <link rel="alternate" hrefLang="de" href="https://euromatchtickets.com/maroon-5-tickets?lang=de" />
      <link rel="alternate" hrefLang="fr" href="https://euromatchtickets.com/maroon-5-tickets?lang=fr" />
      <link rel="alternate" hrefLang="es" href="https://euromatchtickets.com/maroon-5-tickets?lang=es" />
      <link rel="alternate" hrefLang="ar" href="https://euromatchtickets.com/maroon-5-tickets?lang=ar" />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductSchema name="Maroon 5 World Tour 2026" price={79} highPrice={1499} url="https://euromatchtickets.com/maroon-5-tour-2026" category="concert" venue="Olympiastadion" city="Munich" />

      {/* Language Selector */}
      <div className="fixed top-20 right-4 z-50 flex gap-1 bg-white/90 rounded-none p-1 border border-white/10">
        {Object.keys(TRANSLATIONS).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2 py-1 rounded text-xs font-bold ${lang === l ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/90 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 mb-4">
            <Music className="w-4 h-4 mr-2" />🔥 {t.soldOut}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            MAROON 5
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">World Tour 2026</h2>
          <p className="text-xl text-emerald-600 font-semibold mb-6">{t.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5" />{t.guarantee}
            </div>
            <div className="flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full">
              <Zap className="w-5 h-5" />{t.instant}
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-full">
              <Star className="w-5 h-5" />{t.cheapest}
            </div>
          </div>

          <div className="text-4xl font-bold text-white mb-6">
            {t.from} <span className="text-emerald-600">€{events[0]?.lowest_price || 71}</span>
            <span className="text-lg text-slate-500 line-through ml-3">€{Math.round((events[0]?.lowest_price || 71) / 0.95)}</span>
            <span className="text-sm text-emerald-600 ml-2">-5%</span>
          </div>

          <Link to={events[0] ? `/event/${events[0].slug || events[0].event_id}` : '/events?search=Maroon%205'}>
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-xl px-12 py-6">
              {t.buyNow} <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-600" />100% Money-Back</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-600" />4.9/5 Trustpilot</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-600" />2M+ Tickets Sold</div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-600" />Official Partner</div>
          </div>
        </div>
      </section>

      {/* Tour Dates */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.tourDates}</h2>
          
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.slug || event.event_id}`}
                  className="block bg-[#1e1e1e] border border-white/10 hover:border-red-500/50 rounded-none p-6 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-none bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-red-600 transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(event.event_date)}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.venue}, {event.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{t.from}</div>
                        <div className="text-2xl font-bold text-emerald-600">€{event.lowest_price}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
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

      {/* Why Buy From Us */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.whyBuy}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-8 h-8" />, title: "100% Guarantee", desc: "Full refund if cancelled" },
              { icon: <Zap className="w-8 h-8" />, title: "Instant QR", desc: "Tickets in seconds" },
              { icon: <Star className="w-8 h-8" />, title: "5% Cheaper", desc: "Best market prices" },
              { icon: <Clock className="w-8 h-8" />, title: "24/7 Support", desc: "Always here to help" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-[#1e1e1e] rounded-none border border-white/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center text-red-600">
                  {item.icon}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Maroon 5 Live!</h2>
          <p className="text-slate-500 mb-6">Limited tickets available. Book now before they sell out!</p>
          <Link to="/events?search=Maroon%205">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              View All Maroon 5 Tickets <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Maroon5Page;
