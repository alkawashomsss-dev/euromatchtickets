import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Trophy, Star, Shield, ChevronRight, Sparkles, Zap, Crown, ArrowRight, Check, Users, Flame, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/a3a9316ec64f6c42707d0fe9d06b2409d1652145b679655bcb7aac9a3c772036.png";

const categories = [
  { name: "Category C", price: 79, tier: "Upper Tier – Full Stadium View", color: "from-sky-600 to-sky-800", text: "text-sky-300", tag: null, features: ["Verified authentic ticket", "Upper tier seating", "Instant QR delivery", "Full refund if cancelled"] },
  { name: "Category B", price: 149, tier: "Mid Tier – Great Atmosphere", color: "from-blue-600 to-blue-800", text: "text-blue-300", tag: "BEST VALUE", features: ["Mid-level premium seats", "Optimal viewing angles", "Instant QR delivery", "FanProtect guarantee"] },
  { name: "Category A", price: 279, tier: "Lower Tier – Track-Side", color: "from-indigo-600 to-indigo-800", text: "text-indigo-300", tag: null, features: ["Close to the track", "See athletes up close", "Priority entry", "FanProtect guarantee"] },
  { name: "VIP Silver", price: 599, tier: "Hospitality Lounge", color: "from-gray-400 to-gray-600", text: "text-gray-200", tag: null, vip: true, features: ["Premium hospitality lounge", "Complimentary refreshments", "Cushioned seating", "Dedicated entrance"] },
  { name: "VIP Gold", price: 999, tier: "All-Inclusive Premium", color: "from-amber-500 to-amber-700", text: "text-amber-200", tag: "POPULAR", vip: true, features: ["All-inclusive food & drinks", "Best seats in the house", "Athlete meet & greet chance", "Exclusive merchandise"] },
  { name: "VIP Platinum", price: 1899, tier: "Ultimate Athletics Experience", color: "from-violet-500 to-purple-700", text: "text-violet-200", tag: "EXCLUSIVE", vip: true, features: ["Front row track-side seats", "Private hospitality suite", "Backstage access", "Personal concierge service"] },
];

const WorldAthleticsPage = () => {
  const [events, setEvents] = useState([]);
  const [viewCount] = useState(Math.floor(Math.random() * 40) + 120);

  useEffect(() => {
    axios.get(`${API}/events?search=Athletics`).then(r => setEvents(r.data)).catch(() => {});
  }, []);

  const schema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "World Athletics Ultimate Championship 2026 Tickets",
    "description": "Buy World Athletics Championship 2026 tickets from €79. VIP track-side access from €599. Watch Olympic champions compete live. Instant QR delivery.",
    "image": HERO_IMG, "startDate": "2026-09-11", "endDate": "2026-09-17",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": { "@type": "Place", "name": "Budapest National Athletics Centre", "address": { "@type": "PostalAddress", "addressLocality": "Budapest", "addressCountry": "HU" } },
    "performer": {"@type": "Organization", "name": "World Athletics"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "lowPrice": "35", "highPrice": "500", "priceCurrency": "EUR", "offerCount": "500", "availability": "https://schema.org/InStock", "validFrom": "2025-01-01", "url": "https://euromatchtickets.com/world-athletics-2026-tickets", "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" } }
  };

  return (
    <div className="min-h-screen bg-[#070b14]" data-testid="athletics-page">
      <SEOHead
        title="World Athletics 2026 Tickets | Best Prices & VIP"
        description="Buy World Athletics Ultimate Championship 2026 tickets from €79. VIP track-side packages, hospitality access. Watch Olympic champions live. 100% verified."
        image="https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductSchema name="World Athletics Championships 2026" price={49} highPrice={999} url="https://euromatchtickets.com/world-athletics-2026-tickets" category="athletics" venue="Olympic Stadium" city="Budapest" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Athletics", url: "https://euromatchtickets.com/events?type=athletics" }, { name: "World Athletics 2026", url: "https://euromatchtickets.com/world-athletics-2026-tickets" }]} />

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="World Athletics 2026" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-transparent to-[#070b14]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/100/10 text-blue-400 text-xs font-bold mb-5 backdrop-blur-md">
            <Trophy className="w-4 h-4" /> Olympic-Level Competition
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-3 leading-[0.85]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            WORLD ATHLETICS
            <span className="block bg-gradient-to-r from-blue-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">CHAMPIONSHIP 2026</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-base sm:text-lg text-slate-400 mb-6">September 2026 &bull; Budapest, Hungary</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Watch <strong className="text-white">world champions and Olympic medalists</strong> compete in the ultimate track & field showdown. 
            Usain Bolt's successors. World records. Pure athletic glory.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-10">
            {[
              { icon: Calendar, label: "Sep 11–17", sub: "2026" },
              { icon: MapPin, label: "Budapest", sub: "Hungary" },
              { icon: Users, label: "200+ Nations", sub: "2000+ Athletes" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 px-4 py-2.5 rounded-none bg-white/5 backdrop-blur-md border border-white/10">
                <s.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white text-sm font-bold leading-tight">{s.label}</div>
                  <div className="text-slate-400 text-xs">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} href="#tickets" className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold rounded-full text-lg shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-all" data-testid="hero-cta">
            <Ticket className="w-5 h-5" /> Get Tickets from &euro;79
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-blue-500/10 border-t border-blue-500/20 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm">
            {[{ icon: Shield, t: "100% Verified" }, { icon: Star, t: "FanProtect Guarantee" }, { icon: Zap, t: "Instant QR Delivery" }].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-blue-200/80 font-medium"><b.icon className="w-4 h-4" /> {b.t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-16 bg-[#0a0f1a]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "🏅", title: "Watch World Champions", desc: "See Olympic gold medalists and world record holders compete at the highest level" },
              { icon: "⚡", title: "World Records Live", desc: "Be there when history is made — the World Athletics Championship is where legends are born" },
              { icon: "🌍", title: "200+ Nations Compete", desc: "Athletes from every corner of the globe in the most diverse sporting event on Earth" },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-none p-8 hover:border-blue-500/20 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="relative py-20 bg-[#070b14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/100/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Ticket Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Choose Your Athletics Experience</h2>
            <p className="text-slate-400">From general seating to VIP track-side — every event, every discipline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {categories.filter(c => !c.vip).map((cat, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${cat.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {cat.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500/100 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{cat.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col">
                  <div className={`text-xs font-bold uppercase tracking-wider ${cat.text} mb-2 text-center`}>{cat.name}</div>
                  <div className="text-4xl font-black text-white mb-1 text-center">&euro;{cat.price}</div>
                  <div className="text-slate-500 text-xs mb-5 text-center">{cat.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1">
                    {cat.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-blue-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/events?search=Athletics" className={`block w-full py-3 rounded-none bg-gradient-to-r ${cat.color} text-white text-sm font-bold text-center hover:opacity-90 transition`}>
                    Buy Tickets <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.filter(c => c.vip).map((cat, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${cat.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {cat.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-violet-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{cat.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full flex flex-col">
                  <div className={`text-xs font-bold uppercase tracking-wider ${cat.text} mb-2 flex items-center justify-center gap-1`}><Crown className="w-3.5 h-3.5" /> {cat.name}</div>
                  <div className="text-4xl font-black text-white mb-1 text-center">&euro;{cat.price.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs mb-5 text-center">{cat.tier}</div>
                  <div className="space-y-1.5 mb-5 flex-1">
                    {cat.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/events?search=Athletics" className={`block w-full py-3 rounded-none bg-gradient-to-r ${cat.color} text-white text-sm font-bold text-center hover:opacity-90 transition`}>
                    Get VIP Access <Crown className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-20 bg-[#0a0f1a]">
        <div className="max-w-4xl mx-auto px-4 space-y-6 text-slate-400">
          <h2 className="text-2xl font-bold text-white">Buy World Athletics Championship 2026 Tickets</h2>
          <p>The <strong className="text-white">World Athletics Ultimate Championship 2026</strong> brings together the fastest humans on Earth in <strong className="text-white">Budapest, Hungary</strong>. From the 100m sprint to the marathon, from the high jump to the javelin — every discipline, every world record attempt, all in one spectacular week.</p>
          <h3 className="text-xl font-bold text-white mt-8">Why You Shouldn't Miss This</h3>
          <p>This is <strong className="text-white">Olympic-level competition</strong> without the multi-sport chaos. Pure athletics. Pure speed. Pure power. Watch athletes who've dedicated their entire lives to being the best in the world compete for the ultimate title.</p>
          <h3 className="text-xl font-bold text-white mt-8">Key Events</h3>
          <ul className="space-y-1">
            <li><strong className="text-white">100m & 200m Sprint Finals:</strong> Who is the fastest human alive?</li>
            <li><strong className="text-white">Marathon:</strong> 42km of pure endurance through the streets of Budapest</li>
            <li><strong className="text-white">High Jump & Pole Vault:</strong> Gravity-defying performances</li>
            <li><strong className="text-white">Relay Finals:</strong> The most electric team events in athletics</li>
          </ul>
        </div>
      </section>

      {/* TRUST */}
      <TrustSection />

      {/* RELATED EVENTS */}
      <RelatedEvents events={events} accentColor="blue" />

      {/* CROSS LINKS */}
      <section className="py-16 bg-[#070b14]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Explore More Major Events</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Super Bowl 2026", link: "/super-bowl-2026-tickets", emoji: "🏈" },
              { name: "World Cup 2026", link: "/world-cup-2026", emoji: "⚽" },
              { name: "F1 Tickets", link: "/f1-tickets", emoji: "🏎️" },
              { name: "Champions League", link: "/champions-league-tickets", emoji: "🏆" },
              { name: "MotoGP", link: "/motogp-tickets", emoji: "🏍️" },
              { name: "Monaco GP", link: "/monaco-grand-prix-tickets", emoji: "🏎️" },
              { name: "El Clasico", link: "/el-clasico-tickets", emoji: "⚽" },
              { name: "Taylor Swift", link: "/checkout?event=taylor-swift-2026", emoji: "🎤" },
            ].map((e, i) => (
              <Link key={i} to={e.link} className="flex items-center gap-2 bg-white/[0.03] border border-white/5 hover:border-blue-500/30 rounded-none p-3 text-sm text-slate-400 hover:text-white transition">
                <span>{e.emoji}</span> {e.name} <ChevronRight className="w-3.5 h-3.5 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-[#070b14] to-blue-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Experience Athletic Greatness</h2>
          <p className="text-slate-400 mb-8">Watch world champions compete live. Tickets selling fast.</p>
          <a href="#tickets">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold px-10 py-6 text-lg rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all">
              <Ticket className="w-5 h-5 mr-2" /> Secure Your Tickets Now
            </Button>
          </a>
        </div>
      </section>

      <div className="py-6 border-t border-white/5">
        <p className="text-[10px] text-slate-400 text-center max-w-3xl mx-auto px-4">
          <strong>Disclaimer:</strong> EuroMatchTickets is an independent ticket marketplace. Not affiliated with World Athletics or any organizing body. Tickets are resale and may be above or below face value.
        </p>
      </div>

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "World Athletics 2026", url: "https://euromatchtickets.com/world-athletics-2026-tickets" }
      ]} />
      <FAQStructuredData faqs={[
        { question: "When is the World Athletics Championship 2026?", answer: "September 11-17, 2026 in Budapest, Hungary." },
        { question: "How much are World Athletics 2026 tickets?", answer: "Tickets start from €79 for Category C, with VIP track-side packages from €599." },
        { question: "What events are at the World Athletics Championship?", answer: "All track and field events: sprints (100m, 200m, 400m), distance races, hurdles, relays, jumps, throws, marathon, and combined events." }
      ]} />
    </div>
  );
};

export default WorldAthleticsPage;
