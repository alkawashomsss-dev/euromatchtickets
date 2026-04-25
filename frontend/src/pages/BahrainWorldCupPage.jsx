import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Globe, Flag, Award, ChevronRight, Check, TrendingDown, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80";

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
          <div className="text-[9px] text-emerald-300 uppercase tracking-wider font-bold">{u.l}</div>
        </div>
      ))}
    </div>
  );
};

const BahrainWorldCupPage = () => {
  const [eventLink, setEventLink] = useState('/checkout?event=world-cup-2026');

  useEffect(() => {
    axios.get(`${API}/events?search=World+Cup+2026&limit=1`).then(r => {
      if (r.data.length > 0) setEventLink(`/event/${r.data[0].slug || r.data[0].event_id}`);
    }).catch(() => {});
  }, []);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ available: 0, lowest: 149 });

  useEffect(() => {
    axios.get(`${API}/events?search=Bahrain`).then(r => {
      if (r.data.length > 0) {
        setEvents(r.data);
        const total = r.data.reduce((s, e) => s + (e.available_tickets || 0), 0);
        const prices = r.data.map(e => e.lowest_price || 149).filter(Boolean);
        setStats({ available: total || 800, lowest: prices.length ? Math.min(...prices) : 149 });
      }
    }).catch(() => {});
    axios.get(`${API}/events?search=World+Cup`).then(r => {
      if (r.data.length > 0) setEvents(prev => [...prev, ...r.data]);
    }).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "FIFA World Cup 2026 - Bahrain Qualifier & Matches",
    "description": "Buy Bahrain World Cup 2026 tickets. FIFA World Cup qualifier matches and fan zone events. Verified prices with QR ticket delivery.",
    "startDate": "2026-06-11", "endDate": "2026-07-19",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": HERO_IMG,
    "location": { "@type": "Place", "name": "Various Venues", "address": { "@type": "PostalAddress", "addressLocality": "Multiple Cities", "addressCountry": "US" } },
    "performer": { "@type": "SportsTeam", "name": "Bahrain National Football Team" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  const tickets = [
    { section: "Category 3 (Upper Tier)", price: 89, features: ["Upper tier seating", "Full pitch view", "Instant QR delivery", "Buyer protection"] },
    { section: "Category 2 (Mid Tier)", price: 199, tag: "POPULAR", features: ["Mid-level seating", "Great sightlines", "Instant QR delivery", "Buyer protection"] },
    { section: "Category 1 (Lower Tier)", price: 399, tag: "BEST VIEW", features: ["Lower tier close to pitch", "Premium atmosphere", "Priority entry", "Buyer protection"] },
    { section: "VIP Hospitality", price: 999, tag: "VIP", features: ["Hospitality lounge", "Gourmet catering", "Best seats", "Exclusive access"] },
    { section: "Fan Village Pass + Match", price: 149, features: ["Fan zone access", "Big screen viewing", "Live entertainment", "Food & drinks area"] }
  ];

  const faqs = [
    { question: "Is Bahrain in the World Cup 2026?", answer: "Bahrain is competing in the AFC qualifiers for the FIFA World Cup 2026. The tournament is hosted across the USA, Canada, and Mexico from June 11 to July 19, 2026. We offer tickets for all World Cup 2026 matches." },
    { question: "How much are Bahrain World Cup 2026 tickets?", answer: "World Cup 2026 tickets start from just €89 for Category 3 seats. Category 1 (closest to pitch) starts at €399. VIP hospitality packages are available from €999." },
    { question: "Where can I buy Bahrain World Cup tickets?", answer: "You can buy Bahrain World Cup 2026 tickets right here on EuroMatchTickets. We offer verified tickets with QR ticket delivery and our Buyer protection buyer guarantee." },
    { question: "When do World Cup 2026 tickets go on sale?", answer: "Tickets are already available for pre-order on EuroMatchTickets! We offer early access to World Cup 2026 tickets before official sales open. All tickets are backed by our guarantee." },
    { question: "Can I buy World Cup tickets from Bahrain?", answer: "Yes! EuroMatchTickets serves fans worldwide, including Bahrain. All tickets are delivered digitally as QR codes, so you can buy from anywhere and receive them instantly." },
    { question: "What stadiums will host World Cup 2026?", answer: "The FIFA World Cup 2026 will be hosted across 16 stadiums in the USA, Canada, and Mexico, including MetLife Stadium (New York), SoFi Stadium (Los Angeles), AT&T Stadium (Dallas), and more." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="bahrain-worldcup-page">
      <SEOHead
        title="Bahrain World Cup Tickets 2026 | Buy FIFA WC Passes"
        description="Buy Bahrain World Cup 2026 tickets from €89. FIFA World Cup matches, fan zone passes. Verified tickets, QR ticket delivery, Buyer protection."
        canonicalUrl="https://euromatchtickets.com/bahrain-world-cup-tickets-2026"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "World Cup 2026", url: "https://euromatchtickets.com/world-cup-2026" },
        { name: "Bahrain World Cup Tickets", url: "https://euromatchtickets.com/bahrain-world-cup-tickets-2026" }
      ]} />

      {/* HERO */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Bahrain World Cup 2026 tickets" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 bg-emerald-500/100/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-5 text-sm text-emerald-300 backdrop-blur-sm">
            <Globe className="w-4 h-4" /> FIFA World Cup 2026 &trade;
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 leading-tight">
            Bahrain World Cup 2026
            <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Tickets &amp; Fan Zone Passes</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="text-slate-400 text-base sm:text-lg mb-6">
            USA &bull; Canada &bull; Mexico &bull; June 11 &ndash; July 19, 2026
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mb-6">
            <Countdown target="2026-06-11T18:00:00" />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-none px-5 py-3 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">From</p>
              <p className="text-3xl font-extrabold text-amber-400">&euro;89</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg">
                <Ticket className="w-5 h-5 mr-2" /> Buy World Cup Tickets
              </Button>
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Buyer protection</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> QR ticket delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" />  Reviews</span>
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-emerald-600" /> World Cup 2026 Ticket Options</h2>
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-[#1e1e1e] rounded-none border border-white/10 p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.section}</h3>
                  {t.tag && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{t.tag}</span>}
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
                <Link to={`/checkout?event=world-cup-2026-bahrain&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6">Buy</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 mb-16 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Bahrain World Cup 2026 - Everything You Need to Know</h2>
          <p className="text-slate-400 leading-relaxed">The FIFA World Cup 2026 is the biggest sporting event on the planet, and fans from Bahrain are among the most passionate in the Middle East. Whether Bahrain qualifies for the tournament or you're a Bahraini fan supporting your favorite team, EuroMatchTickets has you covered with verified tickets at the cheapest prices.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Buy Bahrain World Cup Tickets Online</h2>
          <p className="text-slate-400 leading-relaxed">Purchasing World Cup 2026 tickets from Bahrain has never been easier. Our platform offers QR ticket delivery, so you receive your tickets within minutes of purchase. No waiting, no uncertainty. Every ticket is verified and backed by our Buyer protection &mdash; if your tickets aren't valid, you get a full refund.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">World Cup 2026 Venues and Schedule</h2>
          <p className="text-slate-400 leading-relaxed">The World Cup 2026 will take place across 16 iconic stadiums in the USA, Canada, and Mexico. Key venues include MetLife Stadium (New Jersey), SoFi Stadium (Los Angeles), AT&amp;T Stadium (Dallas), Azteca Stadium (Mexico City), and BMO Field (Toronto). Group stage matches run from June 11-28, knockout rounds begin June 29, and the final is July 19, 2026.</p>
        </div>
      </section>

      {/* Related Events */}
      {events.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-lg font-bold text-white mb-4">Related Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.slice(0, 6).map(e => (
              <Link key={e.event_id} to={`/event/${e.slug || e.event_id}`} className="bg-[#1e1e1e] rounded-none border border-white/10 p-4 hover:shadow-md transition-all">
                <h3 className="font-bold text-sm text-white mb-1">{e.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}, {e.city}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ &ndash; Bahrain World Cup 2026 Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-none border border-white/10 bg-[#1e1e1e] hover:border-white/15 transition">
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

export default BahrainWorldCupPage;
