import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Users, Clock, Flag, Award, ChevronRight, Check, TrendingDown } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const Countdown = ({ target }) => {
  const [diff, setDiff] = useState(new Date(target) - new Date());
  useEffect(() => { const t = setInterval(() => setDiff(new Date(target) - new Date()), 1000); return () => clearInterval(t); }, [target]);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return (
    <div className="flex gap-2 justify-center">
      {[{ v: d, l: "Days" }, { v: h, l: "Hrs" }, { v: m, l: "Min" }, { v: s, l: "Sec" }].map((u, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-none px-3 py-2 min-w-[56px] text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{String(u.v).padStart(2, '0')}</div>
          <div className="text-[9px] text-blue-300 uppercase tracking-wider font-bold">{u.l}</div>
        </div>
      ))}
    </div>
  );
};

const BayernRealMadridPage = () => {
  const [eventLink, setEventLink] = useState('/checkout?event=bayern-vs-real-madrid');

  useEffect(() => {
    axios.get(`${API}/events?search=Bayern+Munich+Real+Madrid&limit=1`).then(r => {
      if (r.data.length > 0) setEventLink(`/event/${r.data[0].slug || r.data[0].event_id}`);
    }).catch(() => {});
  }, []);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ available: 0, lowest: 199 });

  useEffect(() => {
    axios.get(`${API}/events?search=Bayern`).then(r => {
      if (r.data.length > 0) {
        setEvents(r.data);
        const total = r.data.reduce((s, e) => s + (e.available_tickets || 0), 0);
        const prices = r.data.map(e => e.lowest_price || 199).filter(Boolean);
        setStats({ available: total || 450, lowest: prices.length ? Math.min(...prices) : 199 });
      }
    }).catch(() => {});
    // Also search Real Madrid
    axios.get(`${API}/events?search=Real+Madrid`).then(r => {
      if (r.data.length > 0) setEvents(prev => [...prev, ...r.data]);
    }).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "Bayern Munich vs Real Madrid - Champions League 2026",
    "description": "Buy Bayern Munich vs Real Madrid tickets. Champions League knockout stage. Allianz Arena, Munich. Best prices with QR ticket delivery and Buyer protection.",
    "startDate": "2026-04-08", "endDate": "2026-04-08",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": HERO_IMG,
    "location": { "@type": "Place", "name": "Allianz Arena", "address": { "@type": "PostalAddress", "addressLocality": "Munich", "addressCountry": "DE" } },
    "performer": [
      { "@type": "SportsTeam", "name": "FC Bayern Munich" },
      { "@type": "SportsTeam", "name": "Real Madrid CF" }
    ],
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const tickets = [
    { section: "Category 4 (Upper Tier)", price: 199, features: ["Upper level seating", "Full pitch view", "Instant QR delivery", "Buyer protection"] },
    { section: "Category 3 (Side Upper)", price: 349, tag: "POPULAR", features: ["Side view upper tier", "Central position", "Instant QR delivery", "Buyer protection"] },
    { section: "Category 2 (Lower Tier)", price: 549, tag: "BEST VIEW", features: ["Lower tier seating", "Close to the pitch", "Premium atmosphere", "Buyer protection"] },
    { section: "Category 1 (VIP)", price: 899, tag: "VIP", features: ["Best seats in house", "Hospitality lounge access", "Complimentary food & drinks", "Buyer protection"] },
    { section: "Hospitality Package", price: 1999, tag: "EXCLUSIVE", features: ["Premium hospitality suite", "5-star dining experience", "Private balcony view", "Player tunnel access area"] }
  ];

  const faqs = [
    { question: "When is Bayern Munich vs Real Madrid?", answer: "The Champions League match between Bayern Munich and Real Madrid is scheduled for April 2026 at the Allianz Arena in Munich, Germany. Exact dates depend on the UCL draw." },
    { question: "How much are Bayern vs Real Madrid tickets?", answer: "Tickets start from just €199 for upper tier seats. Category 2 (lower tier) tickets start at €549, and VIP hospitality packages from €1,999. All prices include fees." },
    { question: "How do I get to the Allianz Arena?", answer: "The Allianz Arena is easily accessible by Munich U-Bahn (Line U6 to Fröttmaning station). From Munich city center, it takes about 20 minutes. Parking is also available." },
    { question: "Are the tickets genuine and guaranteed?", answer: "Every ticket sold on EuroMatchTickets is verified and backed by our Buyer protection. If there's any issue, you receive a full refund." },
    { question: "Can I buy Bayern vs Real Madrid tickets as a neutral fan?", answer: "Yes! Our tickets are available to all fans regardless of club membership. We sell neutral, home, and away section tickets." },
    { question: "What is the atmosphere like at the Allianz Arena?", answer: "The Allianz Arena is one of Europe's most iconic stadiums, holding 75,000 fans. The atmosphere for Champions League nights is electric, especially against top opponents like Real Madrid." }
  ];

  const h2content = [
    { title: "Bayern Munich vs Real Madrid - A Champions League Classic", text: "When two of European football's greatest clubs meet, the world watches. Bayern Munich vs Real Madrid is one of the most historic rivalries in Champions League history, with legendary encounters that have defined the tournament. From the dramatic semi-finals to unforgettable comebacks, every meeting between these two giants delivers pure football magic." },
    { title: "Allianz Arena - The Fortress of Football", text: "The Allianz Arena in Munich is one of the most impressive stadiums in the world. With a capacity of 75,000 for Champions League matches, the stadium's iconic illuminated exterior and incredible atmosphere make it a bucket-list destination for every football fan. The Südkurve (South Stand) is famous for its passionate Bayern supporters." },
    { title: "Why Buy Bayern vs Real Madrid Tickets from EuroMatchTickets?", text: "We offer the verified-seller listings for Bayern Munich vs Real Madrid with QR ticket delivery. Every purchase is protected by our Buyer protection, meaning your tickets are 100% authentic or you get a full refund. We've helped over 50,000 fans attend their dream matches across Europe." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="bayern-real-madrid-page">
      <SEOHead
        title="Bayern vs Real Madrid 2026 Tickets (UCL Allianz Arena) — Prices & Availability | EuroMatchTickets"
        description="Compare Bayern Munich vs Real Madrid Champions League listings at the Allianz Arena. Updated prices from €199, verified-seller availability, instant QR delivery and full refund if the match is cancelled."
        canonicalUrl="https://euromatchtickets.com/bayern-vs-real-madrid-tickets"
        image="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Football Tickets", url: "https://euromatchtickets.com/football-tickets" },
        { name: "Bayern vs Real Madrid Tickets", url: "https://euromatchtickets.com/bayern-vs-real-madrid-tickets" }
      ]} />

      {/* HERO */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Bayern Munich vs Real Madrid Champions League tickets" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 bg-[#e10600]/100/20 border border-red-400/30 rounded-full px-4 py-2 mb-5 text-sm text-red-300 backdrop-blur-sm">
            <Award className="w-4 h-4" /> UEFA Champions League 2025/26
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 leading-tight">
            Bayern Munich vs Real Madrid
            <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">Champions League Tickets 2026</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="text-slate-400 text-base sm:text-lg mb-6">
            Allianz Arena, Munich &bull; 75,000 Capacity &bull; Europe's Greatest Rivalry
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mb-6">
            <Countdown target="2026-04-08T20:00:00" />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-none px-5 py-3 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">From</p>
              <p className="text-3xl font-extrabold text-amber-400">&euro;{stats.lowest}</p>
            </div>
            <div className="bg-emerald-500/100/10 border border-emerald-400/30 rounded-none px-4 py-3 backdrop-blur-sm">
              <p className="text-emerald-300 font-bold text-sm flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Save &euro;{Math.round(stats.lowest * 0.35)}</p>
              <p className="text-[11px] text-white/50">(market pricing may vary)</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg">
                <Ticket className="w-5 h-5 mr-2" /> Check Availability
              </Button>
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Buyer protection</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> QR ticket delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" />  (customer reviews)</span>
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-red-600" /> Select Your Tickets</h2>
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-[#1e1e1e] rounded-none border border-white/10 p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.section}</h3>
                  {t.tag && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{t.tag}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.features.map((f, j) => <span key={j} className="text-[11px] text-slate-500 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" />{f}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-white">&euro;{t.price}</p>
                  <p className="text-[10px] text-slate-400">per ticket</p>
                </div>
                <Link to={`/checkout?event=bayern-munich-vs-real-madrid-ucl-2026&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">Buy</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-4xl mx-auto px-4 mb-16 space-y-8">
        {h2content.map((c, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold text-white mb-3">{c.title}</h2>
            <p className="text-slate-400 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </section>

      {/* Live Events */}
      {events.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-lg font-bold text-white mb-4">Related Bayern Munich & Real Madrid Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map(e => (
              <Link key={e.event_id} to={`/event/${e.slug || e.event_id}`} className="bg-[#1e1e1e] rounded-none border border-white/10 p-4 hover:shadow-md transition-all">
                <h3 className="font-bold text-sm text-white mb-1">{e.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}, {e.city}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                {e.lowest_price && <p className="text-emerald-600 font-bold text-sm mt-2">From &euro;{Math.round(e.lowest_price)}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ &ndash; Bayern Munich vs Real Madrid Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-none border border-white/10 bg-[#1e1e1e] hover:border-white/15 transition" data-testid={`faq-${i}`}>
              <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">
                {f.question}
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-slate-500 text-sm leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <TrustSection />
      <RelatedEvents category="football" />
    </div>
  );
};

export default BayernRealMadridPage;
