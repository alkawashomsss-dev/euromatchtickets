import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Trophy, Star, Shield, ChevronRight, Sparkles, Zap, Crown, ArrowRight, Check, Users, Clock, Flame, Eye, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/d1f3f993ef225f8bb18bf55d54c64c51b61a17902dc81f204df12ad8285ee2bd.png";

const packages = [
  { name: "Upper Level", price: 899, orig: 1200, tier: "Nosebleed Seats", color: "from-slate-600 to-slate-800", text: "text-slate-300", tag: null, features: ["Verified e-ticket", "Stadium atmosphere", "Instant QR delivery", "Full refund if cancelled"] },
  { name: "Mid Level", price: 1899, orig: 2400, tier: "Great Sightlines", color: "from-blue-600 to-blue-800", text: "text-blue-300", tag: null, features: ["Premium mid-tier seat", "Central section access", "Instant QR delivery", "Buyer protection"] },
  { name: "Lower Level", price: 3499, orig: 4500, tier: "Close to the Action", color: "from-emerald-600 to-emerald-800", text: "text-emerald-300", tag: "BEST VALUE", features: ["Lower bowl seating", "Near the field", "Priority entry", "Buyer protection"] },
  { name: "Club Level", price: 5999, orig: 7500, tier: "Premium Club Access", color: "from-amber-600 to-amber-800", text: "text-amber-200", tag: "POPULAR", vip: true, features: ["Climate-controlled lounge", "Premium food & drinks", "Padded luxury seats", "Exclusive club access"] },
  { name: "VIP Suite", price: 8999, orig: 12000, tier: "Private Luxury Suite", color: "from-violet-500 to-purple-700", text: "text-violet-200", tag: "VIP", vip: true, features: ["Private suite (12-16 guests)", "All-inclusive F&B", "Personal concierge", "Pre-game field access"] },
  { name: "Platinum Experience", price: 14999, orig: 20000, tier: "Ultimate Super Bowl", color: "from-yellow-500 via-amber-500 to-orange-600", text: "text-yellow-200", tag: "EXCLUSIVE", vip: true, features: ["Front row seats", "Backstage halftime access", "Celebrity after-party", "Luxury hotel included"] }
];

const Countdown = () => {
  const target = new Date("2027-02-07T18:00:00-05:00");
  const [diff, setDiff] = useState(target - new Date());
  useEffect(() => { const t = setInterval(() => setDiff(target - new Date()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return (
    <div className="flex gap-3 justify-center" data-testid="countdown">
      {[{ v: d, l: "Days" }, { v: h, l: "Hours" }, { v: m, l: "Min" }, { v: s, l: "Sec" }].map((u, i) => (
        <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-none px-4 py-3 min-w-[70px] text-center">
          <div className="text-2xl sm:text-3xl font-black text-white">{String(u.v).padStart(2, '0')}</div>
          <div className="text-[10px] text-red-300 uppercase tracking-wider font-bold">{u.l}</div>
        </motion.div>
      ))}
    </div>
  );
};

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

const SuperBowlPage = () => {
  const [events, setEvents] = useState([]);
  const [liveStats, setLiveStats] = useState({ available: 0, lowest: 0 });

  useEffect(() => {
    axios.get(`${API}/events?search=Super+Bowl`).then(r => {
      setEvents(r.data);
      if (r.data.length > 0) {
        const total = r.data.reduce((s, e) => s + (e.available_tickets || 0), 0);
        const lowest = Math.min(...r.data.map(e => e.lowest_price || 999999));
        setLiveStats({ available: total, lowest: lowest < 999999 ? lowest : 899 });
      }
    }).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "Super Bowl LXII 2027 Tickets – VIP & Best Seats",
    "description": "Buy Super Bowl 2026 tickets from €899. VIP suites from €8,999. The ultimate American football experience at Levi's Stadium, Santa Clara. Instant QR delivery with Buyer protection.",
    "image": HERO_IMG, "startDate": "2027-02-07", "endDate": "2027-02-07",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": { "@type": "Place", "name": "Levi's Stadium", "address": { "@type": "PostalAddress", "addressLocality": "Santa Clara", "addressRegion": "CA", "addressCountry": "US" } },
    "performer": {"@type": "SportsTeam", "name": "NFL"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    
  };

  return (
    <div className="min-h-screen bg-[#0a0a12]" data-testid="superbowl-page">
      <SEOHead
        title="Super Bowl 2026 Tickets | VIP & Best Seats"
        description="Buy Super Bowl LXII 2027 tickets from €899. VIP suites, hospitality packages & premium seats at Levi's Stadium, Santa Clara. verified with instant QR."
        image="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "American Football", url: "https://euromatchtickets.com/events" }, { name: "Super Bowl 2027", url: "https://euromatchtickets.com/super-bowl-2026-tickets" }]} />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Super Bowl 2026" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/70 via-transparent to-[#0a0a12]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/40 bg-[#e10600]/100/10 text-red-400 text-xs font-bold mb-4 backdrop-blur-md animate-pulse">
            <Flame className="w-4 h-4" /> {liveStats.available > 0 ? `${liveStats.available} tickets available` : 'Limited Availability'}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-2 leading-[0.85]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            SUPER BOWL
            <span className="block bg-gradient-to-r from-red-500 via-amber-400 to-red-500 bg-clip-text text-transparent">LXI 2027</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-base sm:text-lg text-slate-400 mb-6">February 7, 2027 &bull; Levi's Stadium, Santa Clara, California</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            The <strong className="text-white">biggest night in American sports</strong>. World-class halftime show. 
            70,000+ fans. A once-in-a-lifetime experience you'll never forget.
          </motion.p>

          <Countdown />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-3 mt-8 mb-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"><Users className="w-3.5 h-3.5 text-red-400" /> {liveStats.available > 0 ? `${liveStats.available} tickets left` : 'Available'}</span>
            {liveStats.lowest > 0 && <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm"><TrendingUp className="w-3.5 h-3.5 text-amber-400" /> From &euro;{Math.round(liveStats.lowest)}</span>}
            <span className="flex items-center gap-1.5 bg-[#e10600]/100/10 border border-red-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm text-red-300"><Flame className="w-3.5 h-3.5" /> High Demand</span>
          </motion.div>

          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} href="#tickets" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold rounded-full text-lg shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:shadow-[0_0_70px_rgba(220,38,38,0.6)] transition-all" data-testid="hero-cta">
            <Ticket className="w-5 h-5" /> Get Tickets from &euro;{liveStats.lowest > 0 ? Math.round(liveStats.lowest) : 899}
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border-t border-red-500/20 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm">
            {[{ icon: Shield, t: "Verified" }, { icon: Star, t: "Buyer protection" }, { icon: Zap, t: "QR ticket delivery" }].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-red-200/80 font-medium"><b.icon className="w-4 h-4" /> {b.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="py-16 bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🏟️", title: "70,000+ Fans", desc: "Experience the roar of the crowd at the most electrifying stadium in the world" },
              { icon: "🎤", title: "Epic Halftime Show", desc: "World-class artists perform the most-watched musical event on the planet" },
              { icon: "🏆", title: "Once in a Lifetime", desc: "Be part of history — the Super Bowl is the most coveted ticket in all of sports" }
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-none p-8 hover:border-red-500/20 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="relative py-20 bg-[#0a0a12]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e10600]/100/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Super Bowl Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Choose Your Super Bowl Experience</h2>
            <p className="text-slate-400">From stadium energy to VIP luxury — every moment is unforgettable</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {packages.filter(p => !p.vip).map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className={`relative group rounded-none bg-gradient-to-br ${p.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {p.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500/100 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{p.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col">
                  <div className={`text-xs font-bold uppercase tracking-wider ${p.text} mb-2 text-center`}>{p.name}</div>
                  <div className="text-center mb-1"><span className="text-slate-400 line-through text-sm">&euro;{p.orig.toLocaleString()}</span></div>
                  <div className="text-4xl font-black text-white mb-1 text-center">&euro;{p.price.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs mb-5 text-center">{p.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/events?search=Super+Bowl" className={`block w-full py-3 rounded-none bg-gradient-to-r ${p.color} text-white text-sm font-bold text-center hover:opacity-90 transition`}>
                    Buy Now <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {packages.filter(p => p.vip).map((p, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className={`relative group rounded-none bg-gradient-to-br ${p.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {p.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{p.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col">
                  <div className={`text-xs font-bold uppercase tracking-wider ${p.text} mb-2 flex items-center justify-center gap-1`}><Crown className="w-3.5 h-3.5" /> {p.name}</div>
                  <div className="text-center mb-1"><span className="text-slate-400 line-through text-sm">&euro;{p.orig.toLocaleString()}</span></div>
                  <div className="text-4xl font-black text-white mb-1 text-center">&euro;{p.price.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs mb-5 text-center">{p.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/events?search=Super+Bowl" className={`block w-full py-3 rounded-none bg-gradient-to-r ${p.color} text-white text-sm font-bold text-center hover:opacity-90 transition`}>
                    Get VIP Access <Crown className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">Prices include booking fee. Subject to availability and demand.</p>
        </div>
      </section>

      {/* PRICE COMPARISON */}
      <section className="py-16 bg-[#0d1017]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-white mb-8 text-center">Super Bowl 2026 Price Comparison</h2>
          <div className="bg-white/[0.03] border border-white/5 rounded-none overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10">
                <th className="text-left text-slate-400 font-medium p-4">Platform</th>
                <th className="text-center text-slate-400 font-medium p-4">Price From</th>
                <th className="text-center text-slate-400 font-medium p-4">Fees</th>
                <th className="text-center text-slate-400 font-medium p-4">Delivery</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-white/5 bg-[#e10600]/100/5">
                  <td className="p-4 font-bold text-white">EuroMatchTickets</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">&euro;899</td>
                  <td className="p-4 text-center text-emerald-400">10%</td>
                  <td className="p-4 text-center text-emerald-400">Instant QR</td>
                </tr>
                {[
                  { name: "StubHub", price: "$1,200+", fees: "25-30%", del: "2-5 days" },
                  { name: "Viagogo", price: "$1,400+", fees: "20-28%", del: "3-7 days" },
                  { name: "SeatGeek", price: "$1,100+", fees: "15-22%", del: "1-3 days" }
                ].map((c, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-4 text-slate-400">{c.name}</td>
                    <td className="p-4 text-center text-slate-500">{c.price}</td>
                    <td className="p-4 text-center text-red-400">{c.fees}</td>
                    <td className="p-4 text-center text-slate-500">{c.del}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-20 bg-[#0a0a12]">
        <div className="max-w-4xl mx-auto px-4 space-y-6 text-slate-400">
          <h2 className="text-2xl font-bold text-white">Buy Super Bowl 2026 Tickets — The Ultimate NFL Experience</h2>
          <p>The <strong className="text-white">Super Bowl LXI</strong> is coming to <strong className="text-white">Levi's Stadium in Santa Clara, California</strong> on February 7, 2027. This is the pinnacle of American football — two elite teams battling for the Lombardi Trophy in front of 70,000+ screaming fans, with the most spectacular halftime show on Earth.</p>
          <h3 className="text-xl font-bold text-white mt-8">Why Super Bowl 2026 Tickets Are Selling Out Fast</h3>
          <p>Super Bowl tickets are among the <strong className="text-white">most expensive and coveted tickets in all of sports</strong>. With limited availability and global demand, prices increase every week. Smart fans buy early to lock in the best seats at the lowest prices.</p>
          <h3 className="text-xl font-bold text-white mt-8">Super Bowl 2026 VIP Packages</h3>
          <p>Our <strong className="text-white">VIP hospitality packages</strong> include private suites, all-inclusive food and beverages, celebrity meet-and-greets, and pre-game field access. The <strong className="text-white">Platinum Experience</strong> even includes backstage halftime show access and luxury hotel accommodation.</p>
          <h3 className="text-xl font-bold text-white mt-8">Super Bowl 2026 Ticket Prices</h3>
          <ul className="space-y-1">
            <li><strong className="text-white">Upper Level:</strong> From &euro;899 — great atmosphere, affordable entry</li>
            <li><strong className="text-white">Mid Level:</strong> From &euro;1,899 — excellent sightlines, central positioning</li>
            <li><strong className="text-white">Lower Level:</strong> From &euro;3,499 — close to the field, premium experience</li>
            <li><strong className="text-white">Club Level:</strong> From &euro;5,999 — lounge access, premium dining</li>
            <li><strong className="text-white">VIP Suite:</strong> From &euro;8,999 — private luxury suite for 12-16 guests</li>
            <li><strong className="text-white">Platinum:</strong> From &euro;14,999 — the ultimate all-inclusive experience</li>
          </ul>
        </div>
      </section>

      {/* CROSS LINKS */}
      <section className="py-16 bg-[#0d1017]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Explore More Major Events</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "World Cup 2026", link: "/world-cup-2026", emoji: "⚽" },
              { name: "F1 Tickets", link: "/f1-tickets", emoji: "🏎️" },
              { name: "Champions League", link: "/champions-league-tickets", emoji: "🏆" },
              { name: "Athletics 2026", link: "/world-athletics-2026-tickets", emoji: "🏃" },
              { name: "MotoGP", link: "/motogp-tickets", emoji: "🏍️" },
              { name: "El Clasico", link: "/el-clasico-tickets", emoji: "⚽" },
              { name: "Monaco GP", link: "/monaco-grand-prix-tickets", emoji: "🏎️" },
              { name: "Taylor Swift", link: "/checkout?event=taylor-swift-2026", emoji: "🎤" }
            ].map((e, i) => (
              <Link key={i} to={e.link} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 hover:border-red-500/30 rounded-none p-3 text-sm text-slate-400 hover:text-white transition">
                <span>{e.emoji}</span> {e.name} <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />

      {/* RELATED EVENTS */}
      <RelatedEvents events={events} accentColor="red" />

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-[#0a0a12] to-red-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Don't Miss Super Bowl LXI</h2>
          <p className="text-slate-400 mb-8">{liveStats.available > 0 ? `${liveStats.available} tickets remaining` : 'Limited tickets available'}. Prices go up every day.</p>
          <a href="#tickets">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold px-10 py-6 text-lg rounded-full shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all">
              <Ticket className="w-5 h-5 mr-2" /> Secure Your Tickets Now
            </Button>
          </a>
        </div>
      </section>

      <div className="py-6 border-t border-white/5">
        <p className="text-[10px] text-slate-400 text-center max-w-3xl mx-auto px-4">
          <strong>Disclaimer:</strong> EuroMatchTickets is an independent ticket marketplace. Not affiliated with the NFL, Super Bowl, or any organizing body. Tickets are resale and may be above or below face value.
        </p>
      </div>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Super Bowl 2026", url: "https://euromatchtickets.com/super-bowl-2027-tickets" }
      ]} />
      <FAQStructuredData faqs={[
        { question: "When is the Super Bowl 2026?", answer: "Super Bowl LXI is on February 7, 2027 at Levi's Stadium in Santa Clara, California." },
        { question: "How much are Super Bowl 2026 tickets?", answer: "Super Bowl 2026 tickets start from €899 for upper level, with VIP packages starting at €5,999 and Platinum experiences from €14,999." },
        { question: "Can I get a refund on Super Bowl tickets?", answer: "Yes, all tickets purchased through EuroMatchTickets include our Buyer protection with full refund if the event is cancelled." },
        { question: "How will I receive my Super Bowl tickets?", answer: "All tickets are delivered instantly as QR codes to your email. No shipping, no waiting." }
      ]} />
    </div>
  );
};

export default SuperBowlPage;
