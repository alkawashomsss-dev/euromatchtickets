import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Star, Shield, ChevronRight, Sparkles, Zap, Crown, ArrowRight, Check, Users, Clock, Flame, Eye, TrendingUp, Heart, Music } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png";

const shows = [
  { date: "Jun 19, 2026", day: "Friday", time: "18:00", status: "Few Left", badge: "bg-[#e10600]/100" },
  { date: "Jun 20, 2026", day: "Saturday", time: "18:00", status: "Selling Fast", badge: "bg-amber-500/100" },
  { date: "Jun 21, 2026", day: "Sunday", time: "18:00", status: "Available", badge: "bg-emerald-500/100" },
  { date: "Jun 26, 2026", day: "Friday", time: "18:00", status: "Available", badge: "bg-emerald-500/100" },
  { date: "Jun 27, 2026", day: "Saturday", time: "18:00", status: "Selling Fast", badge: "bg-amber-500/100" },
  { date: "Jun 28, 2026", day: "Sunday", time: "18:00", status: "New!", badge: "bg-blue-500/100" },
];

const packages = [
  { name: "General Admission", price: 89, tier: "Standing / Upper Tier", color: "from-pink-600 to-pink-800", text: "text-pink-300", features: ["Verified e-ticket", "Stadium atmosphere", "Instant QR delivery", "FanProtect guarantee"] },
  { name: "Category A", price: 179, tier: "Mid Tier – Great View", color: "from-purple-600 to-purple-800", text: "text-purple-300", tag: "BEST VALUE", features: ["Premium mid-tier seat", "Central stage view", "Instant QR delivery", "FanProtect guarantee"] },
  { name: "Floor Standing", price: 299, tier: "Closest to Stage", color: "from-violet-600 to-violet-800", text: "text-violet-300", tag: "HOT", features: ["Floor level access", "Near the stage", "Priority entry", "FanProtect guarantee"] },
  { name: "VIP Lounge", price: 599, tier: "Exclusive Hospitality", color: "from-rose-500 to-rose-700", text: "text-rose-200", tag: "VIP", vip: true, features: ["Private VIP lounge", "Premium food & drinks", "Best seats in house", "Exclusive merch gift"] },
  { name: "Diamond Package", price: 999, tier: "Front Row Experience", color: "from-amber-400 via-pink-500 to-purple-600", text: "text-amber-200", tag: "EXCLUSIVE", vip: true, features: ["Front row seats", "Backstage photo area", "Signed merchandise", "Luxury pre-show party"] },
];

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
          <div className="text-[9px] text-pink-300 uppercase tracking-wider font-bold">{u.l}</div>
        </div>
      ))}
    </div>
  );
};

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const TaylorSwiftPage = () => {
  const [liveStats, setLiveStats] = useState({ available: 0, lowest: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${API}/events?search=Taylor+Swift&event_type=concert`).then(r => {
      const tsEvents = (r.data || []).filter(e => (e.title || '').toLowerCase().includes('taylor swift'));
      setEvents(tsEvents);
      if (tsEvents.length > 0) {
        const total = tsEvents.reduce((s, e) => s + (e.available_tickets || 0), 0);
        const lowest = Math.min(...tsEvents.map(e => e.lowest_price || 999999));
        setLiveStats({ available: total, lowest: lowest < 999999 ? lowest : 89 });
      }
    }).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "MusicEvent",
    "name": "Taylor Swift | The Eras Tour 2026 – Wembley Stadium London",
    "description": "Buy Taylor Swift Eras Tour 2026 Wembley Stadium tickets from €89. Best seats, VIP packages, floor standing. 6 nights at Wembley. Cheapest verified tickets with instant QR delivery.",
    "image": HERO_IMG, "startDate": "2026-06-19", "endDate": "2026-06-28",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": { "@type": "Place", "name": "Wembley Stadium", "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" } },
    "performer": { "@type": "Person", "name": "Taylor Swift" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "lowPrice": "79", "highPrice": "1500", "priceCurrency": "EUR", "offerCount": "500", "availability": "https://schema.org/LimitedAvailability", "url": "https://euromatchtickets.com/taylor-swift-wembley-2026-tickets", "validFrom": "2025-01-01", "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0610]" data-testid="taylorswift-page">
      <SEOHead
        title="Taylor Swift Tickets 2026 | Wembley London from €89"
        description="Buy Taylor Swift tickets 2026 from €89. Eras Tour Wembley Stadium London, 6 nights. Verified tickets, instant QR delivery. Cheapest prices - selling fast!"
        canonicalUrl="https://euromatchtickets.com/taylor-swift-wembley-2026-tickets"
        image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductSchema name="Taylor Swift Eras Tour London 2026" price={89} highPrice={2999} url="https://euromatchtickets.com/taylor-swift-london-tickets" category="concert" venue="Wembley Stadium" city="London" />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Taylor Swift Eras Tour 2026 Wembley" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0610] via-[#0a0610]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0610]/60 via-transparent to-[#0a0610]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-14">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-400 text-xs font-bold mb-5 backdrop-blur-md animate-pulse">
            <Flame className="w-4 h-4" /> {liveStats.available > 0 ? `${liveStats.available} tickets available` : 'Selling Out Fast'}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-2 leading-[0.85]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            TAYLOR SWIFT
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl mt-2">The Eras Tour 2026</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-base sm:text-lg text-slate-400 mb-6">6 Nights at Wembley Stadium, London &bull; June 19–28, 2026</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The <strong className="text-white">most iconic concert tour of a generation</strong> returns to London. 
            90,000 fans. Friendship bracelets. A night you'll remember forever.
          </motion.p>

          <Countdown target="2026-06-19T18:00:00+01:00" />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-3 mt-8 mb-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"><Users className="w-3.5 h-3.5 text-pink-400" /> {liveStats.available > 0 ? `${liveStats.available} tickets left` : 'Limited Tickets'}</span>
            {liveStats.lowest > 0 && <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"><TrendingUp className="w-3.5 h-3.5 text-purple-400" /> From &euro;{Math.round(liveStats.lowest)}</span>}
            <span className="flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm text-pink-300"><Heart className="w-3.5 h-3.5" /> #1 Concert 2026</span>
          </motion.div>

          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} href="#tickets" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold rounded-full text-lg shadow-[0_0_50px_rgba(219,39,119,0.4)] hover:shadow-[0_0_70px_rgba(219,39,119,0.6)] transition-all" data-testid="hero-cta">
            <Ticket className="w-5 h-5" /> Get Tickets from &euro;{liveStats.lowest > 0 ? Math.round(liveStats.lowest) : 89}
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-pink-500/10 border-t border-pink-500/20 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm">
            {[{ icon: Shield, t: "100% Verified" }, { icon: Star, t: "Cheapest Prices" }, { icon: Zap, t: "Instant QR Delivery" }].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-pink-200/80 font-medium"><b.icon className="w-4 h-4" /> {b.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOW DATES */}
      <section className="py-16 bg-[#0d0818]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">6 Nights at Wembley Stadium</h2>
            <p className="text-slate-500">Choose your date — every night is a unique experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {shows.map((s, i) => (
              <a key={i} href="#tickets" className="group flex items-center gap-4 bg-white/[0.03] border border-white/5 hover:border-pink-500/30 rounded-none p-4 transition-all hover:bg-white/[0.05]">
                <div className="text-center min-w-[52px]">
                  <div className="text-2xl font-black text-white">{s.date.split(' ')[1].replace(',','')}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{s.date.split(' ')[0]}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{s.day} &bull; {s.time}</div>
                  <div className="text-xs text-slate-500">Wembley Stadium, London</div>
                </div>
                <span className={`${s.badge} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>{s.status}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="relative py-20 bg-[#0a0610]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Cheapest Verified Tickets
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Choose Your Experience</h2>
            <p className="text-slate-400">Official alternative marketplace — cheapest prices guaranteed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {packages.filter(p => !p.vip).map((p, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${p.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {p.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{p.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col text-center">
                  <div className={`text-xs font-bold uppercase tracking-wider ${p.text} mb-2`}>{p.name}</div>
                  <div className="text-4xl font-black text-white mb-1">&euro;{p.price}</div>
                  <div className="text-slate-500 text-xs mb-5">{p.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1 text-left">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-pink-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/checkout?event=taylor-swift-london-2026" className={`block w-full py-3 rounded-none bg-gradient-to-r ${p.color} text-white text-sm font-bold hover:opacity-90 transition`}>
                    Buy Now <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {packages.filter(p => p.vip).map((p, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${p.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {p.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{p.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col text-center">
                  <div className={`text-xs font-bold uppercase tracking-wider ${p.text} mb-2 flex items-center justify-center gap-1`}><Crown className="w-3.5 h-3.5" /> {p.name}</div>
                  <div className="text-4xl font-black text-white mb-1">&euro;{p.price}</div>
                  <div className="text-slate-500 text-xs mb-5">{p.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1 text-left">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/checkout?event=taylor-swift-london-2026" className={`block w-full py-3 rounded-none bg-gradient-to-r ${p.color} text-white text-sm font-bold hover:opacity-90 transition`}>
                    Get VIP Access <Crown className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-20 bg-[#0d0818]">
        <div className="max-w-4xl mx-auto px-4 space-y-6 text-slate-400">
          <h2 className="text-2xl font-bold text-white">Taylor Swift Wembley 2026 Tickets — Cheapest Prices & Best Seats</h2>
          <p><strong className="text-white">Taylor Swift's Eras Tour</strong> returns to <strong className="text-white">Wembley Stadium, London</strong> for an unprecedented 6 nights in June 2026. After breaking every record in music history, Taylor Swift brings her iconic setlist spanning all her eras — from Fearless to Midnights and beyond.</p>
          <h3 className="text-xl font-bold text-white mt-8">Why Buy Taylor Swift Tickets from EuroMatchTickets?</h3>
          <ul className="space-y-1">
            <li><strong className="text-white">Cheapest prices</strong> — our official alternative marketplace offers the best deals</li>
            <li><strong className="text-white">Instant QR delivery</strong> — no waiting, tickets straight to your phone</li>
            <li><strong className="text-white">100% verified</strong> — every ticket authenticated before sale</li>
            <li><strong className="text-white">FanProtect guarantee</strong> — full refund if event is cancelled</li>
          </ul>
          <h3 className="text-xl font-bold text-white mt-8">Taylor Swift Wembley 2026 Setlist</h3>
          <p>Expect <strong className="text-white">3+ hours of hits</strong> including Shake It Off, Anti-Hero, Cruel Summer, Love Story, Blank Space, Cardigan, All Too Well (10 Minute Version), and surprise songs unique to each night. Every show at Wembley features exclusive production elements you won't see anywhere else.</p>
          <h3 className="text-xl font-bold text-white mt-8">Getting to Wembley Stadium</h3>
          <p><strong className="text-white">Wembley Stadium</strong> (capacity 90,000) is easily accessible via the Jubilee and Metropolitan tube lines to Wembley Park station, just a 10-minute walk from the venue. The stadium is fully accessible with dedicated facilities for disabled fans.</p>
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />

      {/* RELATED EVENTS */}
      <RelatedEvents events={events} accentColor="pink" />

      {/* CROSS LINKS */}
      <section className="py-16 bg-[#0a0610]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">More Hot Events</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Super Bowl 2026", link: "/super-bowl-2026-tickets", emoji: "🏈" },
              { name: "World Cup 2026", link: "/world-cup-2026", emoji: "⚽" },
              { name: "F1 Tickets", link: "/f1-tickets", emoji: "🏎️" },
              { name: "Champions League", link: "/champions-league-tickets", emoji: "🏆" },
              { name: "Bruno Mars", link: "/bruno-mars-tickets", emoji: "🎤" },
              { name: "The Weeknd", link: "/the-weeknd-tickets", emoji: "🎵" },
              { name: "Athletics 2026", link: "/world-athletics-2026-tickets", emoji: "🏃" },
              { name: "All Events", link: "/checkout", emoji: "🎟️" },
            ].map((e, i) => (
              <Link key={i} to={e.link} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 hover:border-pink-500/30 rounded-none p-3 text-sm text-slate-400 hover:text-white transition">
                <span>{e.emoji}</span> {e.name} <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 via-[#0a0610] to-purple-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Music className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Don't Miss the Eras Tour</h2>
          <p className="text-slate-400 mb-8">6 nights at Wembley. Once in a lifetime. Tickets selling out fast.</p>
          <a href="#tickets">
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold px-10 py-6 text-lg rounded-full shadow-[0_0_40px_rgba(219,39,119,0.3)] transition-all">
              <Ticket className="w-5 h-5 mr-2" /> Get Taylor Swift Tickets
            </Button>
          </a>
        </div>
      </section>

      <div className="py-6 border-t border-white/5">
        <p className="text-[10px] text-slate-400 text-center max-w-3xl mx-auto px-4">
          <strong>Disclaimer:</strong> EuroMatchTickets is an independent ticket marketplace and official alternative to primary vendors. Not affiliated with Taylor Swift or her management. Tickets are resale.
        </p>
      </div>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" },
        { name: "Taylor Swift Wembley 2026", url: "https://euromatchtickets.com/taylor-swift-wembley-2026-tickets" }
      ]} />
      <FAQStructuredData faqs={[
        { question: "How much are Taylor Swift Wembley 2026 tickets?", answer: "Taylor Swift Eras Tour 2026 Wembley tickets start from €89 for general admission, with VIP packages from €599 and Diamond front-row packages from €999." },
        { question: "How many Taylor Swift shows at Wembley 2026?", answer: "Taylor Swift will perform 6 nights at Wembley Stadium: June 19, 20, 21, 26, 27, and 28, 2026." },
        { question: "Is EuroMatchTickets a legitimate Taylor Swift ticket seller?", answer: "Yes, EuroMatchTickets is a verified independent marketplace. All Taylor Swift tickets are 100% authenticated with our FanProtect guarantee — full refund if the event is cancelled." },
        { question: "How will I receive my Taylor Swift tickets?", answer: "All tickets are delivered instantly as QR codes to your email. No physical shipping needed — show the QR code on your phone at the gate." }
      ]} />
    </div>
  );
};

export default TaylorSwiftPage;
