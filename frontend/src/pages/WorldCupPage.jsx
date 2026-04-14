import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Trophy, Star, Shield, ChevronRight, Sparkles, Zap, Crown, ArrowRight, Check, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import ProductSchema from "../components/ProductSchema";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/dace0d6f85813a94768e9f4cc5ec70716da9ba0825a43dfbd72cc0d3e280bfe9.png";

const ticketCategories = [
  { name: "Category 3", price: 149, tier: "Upper Tier", color: "from-slate-600 to-slate-800", text: "text-slate-300", border: "border-slate-700", tag: null },
  { name: "Category 2", price: 299, tier: "Mid Tier", color: "from-blue-600 to-blue-800", text: "text-blue-300", border: "border-blue-700", tag: null },
  { name: "Category 1", price: 449, tier: "Lower Tier – Best View", color: "from-emerald-600 to-emerald-800", text: "text-emerald-300", border: "border-emerald-600", tag: "BEST VALUE" },
  { name: "VIP Silver", price: 999, tier: "Club Lounge Access", color: "from-gray-400 to-gray-600", text: "text-gray-200", border: "border-gray-400", tag: null, vip: true },
  { name: "VIP Gold", price: 1499, tier: "Private Suite", color: "from-amber-500 to-amber-700", text: "text-amber-200", border: "border-amber-500", tag: "POPULAR", vip: true },
  { name: "VIP Platinum", price: 1899, tier: "All-Inclusive Experience", color: "from-violet-500 via-purple-600 to-indigo-700", text: "text-violet-200", border: "border-violet-400", tag: "EXCLUSIVE", vip: true },
];

const WorldCupPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/events?search=FIFA`)
      .then(r => setEvents(r.data.filter(e => e.title.includes('FIFA') || e.title.includes('World Cup'))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const worldCupSchema = {
    "@context": "https://schema.org", "@type": "SportsEvent",
    "name": "FIFA World Cup 2026 Tickets - Buy Now",
    "description": "Buy FIFA World Cup 2026 tickets from €149. VIP packages from €999. Official verified tickets with 100% buyer guarantee.",
    "image": HERO_IMG, "startDate": "2026-06-11", "endDate": "2026-07-19",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": { "@type": "Place", "name": "Multiple Venues - USA, Canada, Mexico", "address": { "@type": "PostalAddress", "addressCountry": "US" } },
    "performer": {"@type": "SportsTeam", "name": "FIFA"},
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "lowPrice": "65", "highPrice": "5000", "priceCurrency": "EUR", "offerCount": "104", "availability": "https://schema.org/InStock", "url": "https://euromatchtickets.com/world-cup-2026", "validFrom": "2025-01-01", "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" } }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0a0e1a]" data-testid="worldcup-page">
      <SEOHead 
        title="FIFA World Cup 2026 Tickets | Cheapest Prices"
        description="Buy FIFA World Cup 2026 tickets for all matches. Opening ceremony Mexico, group stage, quarter finals, semi finals and World Cup Final in New York."
        image="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=630&fit=crop"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(worldCupSchema) }} />
      <ProductSchema name="FIFA World Cup 2026 Tickets" price={99} highPrice={9999} url="https://euromatchtickets.com/world-cup-2026-tickets" category="worldcup" venue="Multiple Venues" city="USA/Mexico/Canada" />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="FIFA World Cup 2026" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/80 via-transparent to-[#0a0e1a]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/100/10 text-amber-400 text-sm font-bold mb-6 backdrop-blur-md">
            <Trophy className="w-4 h-4" /> Official Ticket Marketplace
          </motion.div>

          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight mb-4 leading-[0.9]" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
            FIFA WORLD CUP
            <span className="block bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">2026</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            USA &bull; Canada &bull; Mexico &mdash; Secure your verified tickets for the biggest football event in history.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-10">
            {[
              { icon: Calendar, label: "Jun 11 – Jul 19", sub: "2026" },
              { icon: MapPin, label: "16 Cities", sub: "3 Countries" },
              { icon: Users, label: "48 Teams", sub: "104 Matches" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 px-4 py-2.5 rounded-none bg-white/5 backdrop-blur-md border border-white/10">
                <s.icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-white text-sm font-bold leading-tight">{s.label}</div>
                  <div className="text-slate-400 text-xs">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} href="#tickets" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-full text-lg shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all" data-testid="hero-cta">
            <Ticket className="w-5 h-5" /> Get Tickets from &euro;149
          </motion.a>
        </div>

        {/* Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-t border-amber-500/20 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-6 sm:gap-10 text-sm">
            {[
              { icon: Shield, t: "100% Verified" },
              { icon: Star, t: "FanProtect Guarantee" },
              { icon: Zap, t: "Instant QR Delivery" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-amber-300/90 font-medium">
                <b.icon className="w-4 h-4" /> {b.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TICKETS ════════ */}
      <section id="tickets" className="relative py-20 bg-[#0a0e1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/100/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Ticket Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Choose Your Experience</h2>
            <p className="text-slate-400 max-w-lg mx-auto">From stadium atmosphere to VIP luxury — every seat tells a story</p>
          </div>

          {/* Standard Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {ticketCategories.filter(c => !c.vip).map((cat, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${cat.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {cat.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500/100 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">{cat.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full text-center">
                  <div className={`text-xs font-bold uppercase tracking-wider ${cat.text} mb-2`}>{cat.name}</div>
                  <div className="text-4xl font-black text-white mb-1">&euro;{cat.price}</div>
                  <div className="text-slate-500 text-xs mb-5">{cat.tier}</div>
                  <div className="space-y-1.5 mb-5">
                    {["Verified authentic ticket", "Instant QR delivery", "Full refund if cancelled"].map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/checkout?event=world-cup-2026" className={`block w-full py-3 rounded-none bg-gradient-to-r ${cat.color} text-white text-sm font-bold hover:opacity-90 transition`} data-testid={`buy-${cat.name.toLowerCase().replace(/\s/g,'-')}`}>
                    Buy Tickets <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* VIP Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ticketCategories.filter(c => c.vip).map((cat, i) => (
              <div key={i} className={`relative group rounded-none bg-gradient-to-br ${cat.color} p-[1px] hover:scale-[1.03] transition-transform duration-300`}>
                {cat.tag && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-bold px-3 py-1 rounded-full z-10">{cat.tag}</div>}
                <div className="rounded-none bg-[#111827] p-6 h-full text-center">
                  <div className={`text-xs font-bold uppercase tracking-wider ${cat.text} mb-2 flex items-center justify-center gap-1`}><Crown className="w-3.5 h-3.5" /> {cat.name}</div>
                  <div className="text-4xl font-black text-white mb-1">&euro;{cat.price.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs mb-5">{cat.tier}</div>
                  <div className="space-y-1.5 mb-5">
                    {["Premium hospitality lounge", "Open bar & gourmet dining", "Meet & greet opportunities", "Exclusive VIP parking"].map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-[11px] text-slate-400"><Check className="w-3 h-3 text-amber-400 flex-shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/checkout?event=world-cup-2026" className={`block w-full py-3 rounded-none bg-gradient-to-r ${cat.color} text-white text-sm font-bold hover:opacity-90 transition`} data-testid={`buy-${cat.name.toLowerCase().replace(/\s/g,'-')}`}>
                    Get VIP Access <Crown className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">All prices include booking fee. Prices may vary based on match and demand.</p>
        </div>
      </section>

      {/* ════════ MATCHES ════════ */}
      <section className="py-20 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Available World Cup Matches</h2>
            <p className="text-slate-500">Browse all scheduled matches and grab your tickets</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Matches will be listed soon. Check back!</p>
              <Link to="/events?type=worldcup" className="inline-flex items-center gap-2 mt-4 text-amber-400 hover:text-amber-300 font-bold text-sm">
                Browse All Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <Link key={event.event_id} to={`/event/${event.slug || event.event_id}`}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-[#161b28] border border-white/5 hover:border-amber-500/30 rounded-none p-5 transition-all hover:bg-[#1a2035]" data-testid="match-card"
                >
                  <div className="w-full sm:w-28 h-20 rounded-none overflow-hidden flex-shrink-0">
                    <img src={event.event_image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/100/10 px-2 py-0.5 rounded">World Cup 2026</span>
                    </div>
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-amber-400 transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(event.event_date)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.venue}, {event.city}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-500 uppercase">From</div>
                    <div className="text-2xl font-black text-amber-400">&euro;{event.lowest_price || 150}</div>
                    <div className="text-[10px] text-emerald-500 font-medium">{event.ticket_count || 100}+ available</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors hidden sm:block" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════ SEO CONTENT ════════ */}
      <section className="py-20 bg-[#0a0e1a]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Buy FIFA World Cup 2026 Tickets</h2>
          <div className="prose prose-lg max-w-none text-slate-400 space-y-4">
            <p>The <strong className="text-white">FIFA World Cup 2026</strong> will be the biggest football tournament ever, hosted across <strong className="text-white">USA, Canada, and Mexico</strong>. For the first time, 48 teams will compete for the ultimate prize.</p>
            <h3 className="text-white text-xl font-bold mt-8">Host Cities</h3>
            <p>Matches in 16 iconic stadiums including <strong className="text-white">MetLife Stadium (New York)</strong>, <strong className="text-white">SoFi Stadium (Los Angeles)</strong>, <strong className="text-white">AT&amp;T Stadium (Dallas)</strong>, and <strong className="text-white">Estadio Azteca (Mexico City)</strong>.</p>
            <h3 className="text-white text-xl font-bold mt-8">Ticket Categories</h3>
            <ul className="space-y-1">
              <li><strong className="text-white">Category 1:</strong> Best views, premium locations — €449+</li>
              <li><strong className="text-white">Category 2:</strong> Great sightlines, central sections — €299+</li>
              <li><strong className="text-white">Category 3:</strong> Good views, affordable prices — €149+</li>
              <li><strong className="text-white">VIP Hospitality:</strong> All-inclusive luxury packages — €999+</li>
            </ul>
            <h3 className="text-white text-xl font-bold mt-8">Why EuroMatchTickets?</h3>
            <ul className="space-y-1">
              <li>100% verified and guaranteed authentic tickets</li>
              <li>Instant QR code delivery — no waiting</li>
              <li>Full refund if event is cancelled</li>
              <li>24/7 customer support</li>
              <li>Secure payment powered by Stripe</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-[#0a0e1a] to-amber-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Don't Miss History</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Tickets are selling fast. Secure your seats for the biggest football event ever.</p>
          <Link to="/checkout?event=world-cup-2026">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold px-10 py-6 text-lg rounded-full shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all" data-testid="bottom-cta">
              <Ticket className="w-5 h-5 mr-2" /> View All World Cup Tickets
            </Button>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="py-6 border-t border-white/5">
        <p className="text-[10px] text-slate-400 text-center max-w-3xl mx-auto px-4">
          <strong>Disclaimer:</strong> EuroMatchTickets is an independent ticket marketplace. Not affiliated with FIFA or any organizing body. Tickets are resale and may be above or below face value. All trademarks belong to their respective owners.
        </p>
      </div>

      {/* TRUST */}
      <TrustSection />

      {/* RELATED EVENTS */}
      <RelatedEvents events={events} accentColor="amber" />

      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "World Cup 2026", url: "https://euromatchtickets.com/world-cup-2026" }
      ]} />
      <FAQStructuredData faqs={[
        { question: "When is the FIFA World Cup 2026?", answer: "The FIFA World Cup 2026 will be held from June 11 to July 19, 2026 across the United States, Mexico, and Canada. It will be the first World Cup with 48 teams." },
        { question: "How can I buy World Cup 2026 tickets?", answer: "You can buy verified World Cup 2026 tickets on EuroMatchTickets starting from €149. All tickets include our FanProtect guarantee with instant QR delivery." },
        { question: "Which cities are hosting the World Cup 2026?", answer: "The World Cup 2026 will be hosted in 16 cities: 11 in the USA, 3 in Mexico, and 2 in Canada." }
      ]} />
    </div>
  );
};

export default WorldCupPage;
