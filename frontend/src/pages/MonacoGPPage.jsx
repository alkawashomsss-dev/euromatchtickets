import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Trophy, Star, Shield, Zap, Flag, Ticket, ChevronRight, Check, Crown, Gem, Wine, Anchor } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData } from "../components/StructuredData";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";
import { EventFAQ, FAQSchemaScript } from "../components/EventFAQ";

const MONACO_FAQS = [
  { q: "How much are Monaco Grand Prix tickets?", a: "Monaco GP tickets: General Admission from €249. K Grandstand from €395. Tribune T from €549. Tabac Grandstand from €695. VIP Hospitality from €1,995. Yacht packages from €3,500. All include Buyer protection cancellation refund policy." },
  { q: "When is the Monaco Grand Prix 2026?", a: "May 21-24, 2026. Thursday practice, Friday rest day (unique to Monaco), Saturday qualifying, Sunday race at 15:00 CET." },
  { q: "What is the best grandstand at Monaco?", a: "Tabac Grandstand for the iconic harbour view and swimming pool chicane. Tribune K for the casino section. Rascasse for atmosphere. Sainte Devote (Turn 1) for overtaking." },
  { q: "Can you watch Monaco GP from a yacht?", a: "Yes! Yacht packages from €3,500 per person include harbour viewing, champagne, gourmet dining, and a unique perspective of cars racing past the marina." },
  { q: "Are Monaco GP tickets refundable?", a: "Yes! Buyer protection cancellation refund policy. Full refund if cancelled. Instant QR delivery." }
];

const MonacoGPPage = () => {
  const [eventLink, setEventLink] = useState('/checkout?event=monaco-grand-prix');

  useEffect(() => {
    axios.get(`${API}/events?search=Monaco+Grand+Prix&limit=1`).then(r => {
      if (r.data.length > 0) setEventLink(`/event/${r.data[0].slug || r.data[0].event_id}`);
    }).catch(() => {});
  }, []);
  const tickets = [
    { section: "Sector Rocher", price: 195, originalPrice: 299, available: 145, features: ["Casino Square views", "Harbour backdrop", "Classic Monaco vantage point"] },
    { section: "Grandstand K (Casino)", price: 389, originalPrice: 599, available: 67, badge: "ICONIC", features: ["Legendary Casino hairpin", "Slowest corner in F1", "Best photo spot"] },
    { section: "Grandstand T (Tabac)", price: 329, originalPrice: 499, available: 89, badge: "POPULAR", features: ["Swimming pool chicane view", "Harbour views", "Great overtaking zone"] },
    { section: "Grandstand B (Piscine)", price: 359, originalPrice: 559, available: 52, features: ["Swimming Pool complex", "Technical section", "Close-up views"] },
    { section: "Champions Club", price: 1295, originalPrice: 1999, available: 23, badge: "VIP", features: ["5-star hospitality", "Champagne & gourmet dining", "Track-side terrace"] },
    { section: "Yacht Hospitality", price: 2995, originalPrice: 4999, available: 8, badge: "ULTRA VIP", features: ["Private yacht in harbour", "All-inclusive luxury", "Helicopter transfers available"] }
  ];

  const competitors = [
    { name: "F1.com Official", casino: "€899", vip: "€5,999", yacht: "€8,000+" },
    { name: "StubHub", casino: "€799", vip: "€4,500", yacht: "N/A" },
    { name: "Viagogo", casino: "€850", vip: "€5,200", yacht: "N/A" },
    { name: "EuroMatchTickets", casino: "€389", vip: "€1,295", yacht: "€2,995", highlight: true }
  ];

  const experiences = [
    { icon: Crown, title: "Casino Square", desc: "Watch F1 cars navigate the tightest hairpin in motorsport right below the legendary Monte Carlo Casino. The sound reverberates off the historic buildings - pure goosebumps." },
    { icon: Anchor, title: "Harbour View", desc: "See multi-million dollar yachts lined up in Port Hercule while F1 cars blast past at 260km/h on the waterfront. It's the most photographed scene in motorsport." },
    { icon: Wine, title: "The Tunnel", desc: "F1 cars enter the tunnel at 260km/h, plunging from bright sunlight into darkness and back again in seconds. The sound inside is thunderous - a Monaco-only experience." },
    { icon: Gem, title: "Riviera Lifestyle", desc: "Combine your GP weekend with Monte Carlo's casinos, Michelin-star restaurants, yacht parties, and the stunning French Riviera coastline. It's F1's most glamorous weekend." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a]" data-testid="monaco-gp-page">
      <FAQSchemaScript faqs={MONACO_FAQS} />
      <SEOHead
        title="Monaco Grand Prix 2026 Tickets — Prices, Dates & Availability | EuroMatchTickets"
        description="Monaco F1 2026 — official race weekend dates, grandstand & yacht hospitality prices, verified-seller availability. Instant QR, full refund if the race is cancelled."
        canonicalUrl="https://euromatchtickets.com/f1-monaco-grand-prix-tickets"
      />
<BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" },
        { name: "Monaco Grand Prix Tickets", url: "https://euromatchtickets.com/f1-monaco-grand-prix-tickets" }
      ]} />

      {/* HERO - Monte Carlo Luxury */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1030] via-[#0a0a1a] to-[#0a0a1a]" />
        <div className="absolute top-0 left-0 right-0 h-[60%] opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, #c8a94e55, transparent 70%)' }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-bold mb-6 backdrop-blur-md">
            <Crown className="w-4 h-4" /> THE CROWN JEWEL OF F1
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-3 leading-[0.85]">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">MONACO</span>
            <span className="block text-white text-3xl sm:text-4xl lg:text-5xl mt-2 font-light tracking-wide">Grand Prix 2026</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Monte Carlo. Casino Square. Harbour yachts. The most <strong className="text-amber-300">prestigious</strong> race on Earth.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-xs text-amber-300/60 bg-amber-400/5 border border-amber-400/20 rounded-full px-4 py-2">
              <Calendar className="w-3.5 h-3.5" /> May 22-24, 2026
            </span>
            <span className="flex items-center gap-2 text-xs text-amber-300/60 bg-amber-400/5 border border-amber-400/20 rounded-full px-4 py-2">
              <MapPin className="w-3.5 h-3.5" /> Monte Carlo, Monaco
            </span>
            <span className="flex items-center gap-2 text-xs text-amber-300/60 bg-amber-400/5 border border-amber-400/20 rounded-full px-4 py-2">
              <Crown className="w-3.5 h-3.5" /> Street Circuit
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-md border border-amber-400/20 rounded-none px-6 py-4 text-center">
              <p className="text-[10px] text-amber-300/50 uppercase tracking-widest">From</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">&euro;195</p>
              <p className="text-[10px] text-emerald-400 font-bold">55% OFF (market pricing may vary)</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-amber-500/20" data-testid="monaco-hero-cta">
                <Ticket className="w-5 h-5 mr-2" /> Book Monaco GP Now
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Buyer protection</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> QR ticket delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" />  ( Reviews)</span>
          </div>
        </div>
      </section>

      {/* MONACO EXPERIENCES */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">The Monaco GP Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, i) => (
            <div key={i} className="bg-white/5 border border-amber-400/10 rounded-none p-6 hover:border-amber-400/30 transition-all">
              <exp.icon className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-white mb-2">{exp.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Why We're 55% Cheaper</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-slate-400 py-3 px-4">Platform</th>
                <th className="text-center text-slate-400 py-3 px-4">Casino Grandstand</th>
                <th className="text-center text-slate-400 py-3 px-4">VIP Hospitality</th>
                <th className="text-center text-slate-400 py-3 px-4">Yacht Package</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={i} className={`border-b border-white/5 ${c.highlight ? 'bg-amber-400/10' : ''}`}>
                  <td className={`py-4 px-4 font-bold ${c.highlight ? 'text-amber-300' : 'text-white/60'}`}>
                    {c.highlight && <Crown className="w-4 h-4 inline mr-1 text-amber-400" />}
                    {c.name}
                  </td>
                  <td className={`text-center py-4 px-4 ${c.highlight ? 'text-amber-300 font-bold text-lg' : 'text-slate-500 line-through'}`}>{c.casino}</td>
                  <td className={`text-center py-4 px-4 ${c.highlight ? 'text-amber-300 font-bold text-lg' : 'text-slate-500 line-through'}`}>{c.vip}</td>
                  <td className={`text-center py-4 px-4 ${c.highlight ? 'text-amber-300 font-bold text-lg' : 'text-slate-500'}`}>{c.yacht}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">Prices compared as of February 2026. EuroMatchTickets offers the lowest prices with Buyer protection.</p>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" /> Monaco GP 2026 Ticket Options
        </h2>
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-none p-5 hover:border-amber-400/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`monaco-ticket-${i}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.section}</h3>
                  {t.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.badge === 'ULTRA VIP' ? 'bg-amber-400/30 text-amber-200' :
                    t.badge === 'VIP' ? 'bg-purple-500/100/30 text-purple-300' :
                    t.badge === 'ICONIC' ? 'bg-[#e10600]/100/30 text-red-300' :
                    'bg-emerald-500/100/30 text-emerald-300'
                  }`}>{t.badge}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.features.map((f, j) => <span key={j} className="text-[11px] text-slate-400 flex items-center gap-1"><Check className="w-3 h-3 text-amber-400" />{f}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-amber-400/50 text-xs">{t.available} left</span>
                <div className="text-right">
                  <p className="text-xs text-slate-500 line-through">&euro;{t.originalPrice}</p>
                  <p className="text-2xl font-extrabold text-white">&euro;{t.price}</p>
                </div>
                <Link to={`/checkout?event=f1-monaco-grand-prix-2026&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                  <Button className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold px-6">Book</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Buy Monaco Grand Prix 2026 Tickets - Best Prices Online</h2>
          <p className="text-slate-400 leading-relaxed">The <strong>Monaco Grand Prix</strong> is the most prestigious race in Formula 1 history. Held annually on the streets of Monte Carlo since 1929, it's the crown jewel of the "Triple Crown" of motorsport. EuroMatchTickets offers <strong>Monaco GP tickets from just &euro;195</strong> - that's up to Competitive market pricing than official F1 channels. Our Casino Square grandstand tickets at &euro;389 save you over &euro;500 compared to F1.com. Every ticket includes QR ticket delivery and our Buyer protection.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Monaco Circuit Guide - Where to Sit</h2>
          <p className="text-slate-400 leading-relaxed">The <strong>Circuit de Monaco</strong> is unique - it's the only F1 street circuit where you can see luxury yachts, a royal palace, and a world-famous casino from your seat. <strong>Grandstand K</strong> at the Casino hairpin is the most iconic viewing spot in all of motorsport. <strong>Grandstand T</strong> at Tabac gives you harbour views and sees cars enter the famous Swimming Pool section. For pure luxury, our <strong>Yacht Hospitality</strong> puts you on a private yacht in Port Hercule harbour, watching F1 cars race past your champagne glass.</p>
        </div>
      </section>

      {/* FAQ */}
      <EventFAQ faqs={MONACO_FAQS} title="Monaco Grand Prix 2026 — FAQ" />

      {/* MONACO GUIDES - Content Cluster */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">Monaco GP Deep Dive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/monaco-gp-vip-experience" className="bg-amber-400/5 border border-amber-400/20 rounded-none p-4 hover:border-amber-400/40 transition-all">
            <p className="font-bold text-white text-sm">VIP & Yacht Experience Guide</p>
            <p className="text-xs text-amber-300/60 mt-1">Champions Club, yacht hospitality</p>
          </Link>
          <Link to="/ultimate-f1-tickets-guide-2026" className="bg-amber-400/5 border border-amber-400/20 rounded-none p-4 hover:border-amber-400/40 transition-all">
            <p className="font-bold text-white text-sm">Ultimate F1 Guide 2026</p>
            <p className="text-xs text-amber-300/60 mt-1">Every race compared</p>
          </Link>
        </div>
      </section>

      {/* LINK WHEEL */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">More Premium Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { to: "/f1-bahrain-grand-prix-tickets", label: "Bahrain GP", price: "59", tag: "NIGHT RACE" },
            { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP", price: "69", tag: "FASTEST" },
            { to: "/f1-singapore-grand-prix-tickets", label: "Singapore GP", price: "129", tag: "STREET RACE" },
            { to: "/f1-las-vegas-grand-prix-tickets", label: "Las Vegas GP", price: "195", tag: "THE STRIP" },
            { to: "/el-clasico-tickets", label: "El Clasico", price: "195", tag: "FOOTBALL" },
            { to: "/taylor-swift-london-tickets", label: "Taylor Swift", price: "89", tag: "CONCERT" },
            { to: "/champions-league-tickets", label: "Champions League", price: "49", tag: "UCL" },
            { to: "/super-bowl-2026-tickets", label: "Super Bowl", price: "495", tag: "NFL" }
          ].map((l, i) => (
            <Link key={i} to={l.to} className="bg-white/5 border border-white/10 rounded-none p-4 hover:border-amber-400/30 transition-all">
              <p className="font-bold text-white text-sm">{l.label}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-amber-400 text-xs font-bold">From &euro;{l.price}</span>
                <span className="text-[9px] text-white/30 font-bold">{l.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RELATED SEARCHES */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h3 className="text-sm font-bold text-white/30 mb-3">Related Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {["Monaco GP tickets", "Monte Carlo F1", "Monaco Grand Prix 2026", "F1 Monaco hospitality", "Monaco GP yacht", "Casino Square F1", "Monaco paddock club", "buy Monaco GP tickets", "Monaco GP cheap tickets", "F1 Monaco 2026", "Monaco Grand Prix VIP"].map((term, i) => (
            <span key={i} className="px-3 py-1 bg-white/5 text-white/25 rounded-full text-xs border border-white/5">{term}</span>
          ))}
        </div>
      </section>
      {/* Newsletter */}
      <EventFAQ faqs={MONACO_FAQS} title="Monaco Grand Prix 2026 — FAQ" />
      <RelatedEventsLinks category="monaco-gp" title="More F1 Races You'll Love" />
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup source="monaco-gp" />
        </div>
      </section>
    </div>
  );
};

export default MonacoGPPage;
