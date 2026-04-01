import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Shield, Zap, Flag, Ticket, ChevronRight, Check, Star, Clock, Thermometer, Moon, ArrowRight, AlertCircle, Users, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { InternalLinks } from "../components/InternalLinks";
import { TrustBar } from "../components/ConversionElements";

const Countdown = ({ target }) => {
  const [diff, setDiff] = useState(new Date(target) - new Date());
  useEffect(() => { const t = setInterval(() => setDiff(new Date(target) - new Date()), 1000); return () => clearInterval(t); }, [target]);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return (
    <div className="flex gap-3 justify-center">
      {[{ v: d, l: "DAYS" }, { v: h, l: "HRS" }, { v: m, l: "MIN" }, { v: s, l: "SEC" }].map((u, i) => (
        <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 min-w-[68px] text-center backdrop-blur-md">
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">{String(u.v).padStart(2, '0')}</div>
          <div className="text-[9px] text-amber-300/70 uppercase tracking-[0.2em] font-bold mt-1">{u.l}</div>
        </div>
      ))}
    </div>
  );
};

const BahrainGPPage = () => {
  const tickets = [
    { section: "General Admission", price: 59, originalPrice: 89, available: 389, badge: null, features: ["3-Day circuit access", "Big screen viewing zones", "Fan Zone entertainment"] },
    { section: "Main Grandstand", price: 119, originalPrice: 159, available: 112, badge: "BEST VALUE", features: ["Pit straight view", "Covered seating", "Giant TV screens"] },
    { section: "Turn 1 Grandstand", price: 159, originalPrice: 199, available: 78, badge: "HOT", features: ["Braking zone action", "Overtaking spot", "Shaded area"] },
    { section: "Batelco Grandstand", price: 139, originalPrice: 179, available: 98, badge: null, features: ["S-curves view", "Multiple angle views", "Close to track"] },
    { section: "VIP Hospitality", price: 495, originalPrice: 699, available: 34, badge: "VIP", features: ["Open bar & gourmet dining", "Pit lane walk", "Paddock access"] },
    { section: "Paddock Club", price: 1495, originalPrice: 1999, available: 12, badge: "EXCLUSIVE", features: ["Behind-the-scenes access", "Meet drivers", "Premium hospitality"] },
  ];

  const circuitSections = [
    { name: "Turn 1", desc: "The heaviest braking zone - cars drop from 320km/h to 80km/h", highlight: true },
    { name: "Turn 4", desc: "Tight hairpin, great for photos and close overtaking action" },
    { name: "Turn 10", desc: "Fast right-hander leading into the spectacular inner section" },
    { name: "Main Straight", desc: "Top speed zone - DRS enabled, watch cars hit 340km/h" },
  ];

  const faqs = [
    { question: "Is Bahrain GP a night race?", answer: "Yes! The Bahrain Grand Prix starts at twilight and finishes under floodlights. It's one of the most visually spectacular races on the F1 calendar, with temperatures dropping to a comfortable 20-25°C." },
    { question: "How much are Bahrain GP tickets?", answer: "Bahrain GP tickets on EuroMatchTickets start from just €59 for general admission - 30% cheaper than official channels. Main Grandstand from €119, VIP from €495. All include 3-day access." },
    { question: "How do I get to Bahrain International Circuit?", answer: "The circuit is 30km south of Manama. Free shuttle buses operate from major hotels. Taxis cost ~€15 from the city center. Parking is available at the circuit for €5/day." },
    { question: "What's the weather like for Bahrain GP?", answer: "March temperatures average 22-27°C during the day, cooling to 18-22°C at night. It's perfect racing weather with almost zero chance of rain. Bring sunscreen for daytime sessions." },
    { question: "Are Bahrain F1 tickets mobile?", answer: "Yes! All tickets are delivered instantly as secure QR codes to your email. Simply show your phone at the gate. You can also print a backup copy." },
    { question: "When does the Bahrain GP weekend start?", answer: "Friday: Free Practice 1 & 2. Saturday: Free Practice 3 & Qualifying. Sunday: The Grand Prix race. Your 3-day ticket covers all sessions." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Product",
    "name": "Bahrain Grand Prix 2026 Tickets",
    "description": "Verified Bahrain F1 tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "3241", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "name": "Magical Bahrain night race atmosphere", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Ahmed K." }, "reviewBody": "The night race atmosphere was magical! Tickets were €30 cheaper than the official site. QR code worked perfectly.", "datePublished": "2026-01-20" },
      { "@type": "Review", "name": "Turn 1 grandstand braking heat experience", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Sarah L." }, "reviewBody": "Turn 1 grandstand was incredible! Could feel the braking heat. Best F1 experience ever.", "datePublished": "2025-12-15" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "59", "highPrice": "1495", "offerCount": "723" }
  };

  return (
    <div className="min-h-screen bg-[#0b0d17]" data-testid="bahrain-gp-page">
      <SEOHead
        title="Bahrain GP Tickets 2026 | Night Race from €59"
        description="Buy Bahrain Grand Prix 2026 tickets from €59. F1 night race at Sakhir. Grandstand, VIP & Paddock Club. 30% cheaper! Instant QR delivery + FanProtect guarantee."
        canonicalUrl="https://euromatchtickets.com/f1-bahrain-grand-prix-tickets"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "F1 Tickets", url: "https://euromatchtickets.com/f1-tickets" },
        { name: "Bahrain Grand Prix Tickets", url: "https://euromatchtickets.com/f1-bahrain-grand-prix-tickets" }
      ]} />

      {/* HERO - Desert Night Race */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e00] via-[#0b0d17] to-[#0b0d17]" />
        <div className="absolute top-0 left-0 right-0 h-[60%] opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 0%, #f59e0b33, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f59e0b\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold mb-5 backdrop-blur-md">
            <Moon className="w-4 h-4" /> LIGHTS OUT IN
          </div>

          <div className="mb-8">
            <Countdown target="2026-03-08T18:00:00" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-2 leading-[0.85]" style={{ textShadow: '0 4px 40px rgba(245,158,11,0.3)' }}>
            BAHRAIN
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl mt-2">Grand Prix 2026</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-4 max-w-2xl mx-auto">
            Secure your seat now with instant QR delivery. 100% Buyer Protection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1.5 text-red-300 text-sm font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Only 234 tickets left
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1.5 text-amber-300 text-sm font-medium">
              <Users className="w-3.5 h-3.5" /> 189 people viewing now
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5 text-emerald-300 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Prices up 18% this week
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-xs text-amber-300/70 bg-amber-500/5 border border-amber-500/20 rounded-full px-4 py-2">
              <Calendar className="w-3.5 h-3.5" /> March 6-8, 2026
            </span>
            <span className="flex items-center gap-2 text-xs text-amber-300/70 bg-amber-500/5 border border-amber-500/20 rounded-full px-4 py-2">
              <MapPin className="w-3.5 h-3.5" /> Sakhir, Bahrain
            </span>
            <span className="flex items-center gap-2 text-xs text-amber-300/70 bg-amber-500/5 border border-amber-500/20 rounded-full px-4 py-2">
              <Moon className="w-3.5 h-3.5" /> Night Race
            </span>
            <span className="flex items-center gap-2 text-xs text-amber-300/70 bg-amber-500/5 border border-amber-500/20 rounded-full px-4 py-2">
              <Thermometer className="w-3.5 h-3.5" /> 22°C
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">From</p>
              <p className="text-4xl font-extrabold text-amber-400">&euro;59</p>
              <p className="text-[10px] text-emerald-400 font-bold">30% OFF official price</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-amber-500/20" data-testid="bahrain-hero-cta">
                <Ticket className="w-5 h-5 mr-2" /> Secure Your Seat Now
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> FanProtect Guarantee</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Instant QR Delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> 4.8/5 (3,241 Reviews)</span>
          </div>
        </div>
      </section>

      {/* CIRCUIT HIGHLIGHTS */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Flag className="w-5 h-5 text-amber-500" /> Bahrain International Circuit - Key Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circuitSections.map((s, i) => (
            <div key={i} className={`rounded-xl p-5 border transition-all ${s.highlight ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.highlight ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-white/60'}`}>{s.name}</span>
                {s.highlight && <span className="text-[10px] text-amber-400 font-bold">MUST-SEE</span>}
              </div>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-500" /> Bahrain GP 2026 Ticket Options
        </h2>
        <div className="space-y-3">
          {tickets.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`bahrain-ticket-${i}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.section}</h3>
                  {t.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badge === 'EXCLUSIVE' ? 'bg-amber-500/30 text-amber-300' : t.badge === 'VIP' ? 'bg-purple-500/30 text-purple-300' : t.badge === 'HOT' ? 'bg-red-500/30 text-red-300' : 'bg-emerald-500/30 text-emerald-300'}`}>{t.badge}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.features.map((f, j) => <span key={j} className="text-[11px] text-slate-400 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" />{f}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-amber-400/60 text-xs">{t.available} left</span>
                <div className="text-right">
                  <p className="text-xs text-slate-500 line-through">&euro;{t.originalPrice}</p>
                  <p className="text-2xl font-extrabold text-white">&euro;{t.price}</p>
                </div>
                <Link to={`/checkout?event=bahrain-gp&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold px-6">Buy</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NIGHT RACE EXPERIENCE */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400" /> The Night Race Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400">
            <div>
              <h3 className="font-bold text-amber-300 mb-2">Twilight Start</h3>
              <p>The race begins at sunset, with the sky turning from orange to deep blue as the floodlights take over. A breathtaking visual spectacle unique to Bahrain.</p>
            </div>
            <div>
              <h3 className="font-bold text-amber-300 mb-2">Desert Atmosphere</h3>
              <p>22°C evening temperatures make it perfect for spectators. The desert air creates stunning light effects as F1 cars blast through at 340km/h under the stars.</p>
            </div>
            <div>
              <h3 className="font-bold text-amber-300 mb-2">Season Opener</h3>
              <p>As the first race of 2026, Bahrain GP sets the stage for the entire season. Every team unveils their new cars here. The excitement is unmatched.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Buy Bahrain Grand Prix 2026 Tickets - Cheapest Prices</h2>
          <p className="text-slate-400 leading-relaxed">EuroMatchTickets offers the <strong>cheapest Bahrain Grand Prix tickets</strong> available online. Our prices start from just <strong>&euro;59</strong> for general admission - that's 30% below the official F1 price. The <strong>Bahrain International Circuit</strong> in Sakhir hosts F1's most spectacular night race, with cars racing under floodlights from twilight until the stars come out. Every ticket includes our FanProtect guarantee and instant QR delivery.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Bahrain GP Grandstand Guide</h2>
          <p className="text-slate-400 leading-relaxed">The best grandstands at the Bahrain International Circuit are <strong>Turn 1 Grandstand</strong> (heaviest braking zone on the circuit, where most overtakes happen), <strong>Main Grandstand</strong> (pit straight with start/finish views and podium ceremony), and <strong>Batelco Grandstand</strong> (S-curves section with multiple angle views). For the ultimate experience, our <strong>VIP Hospitality</strong> packages include open bar, gourmet dining, and pit lane walks.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ - Bahrain GP Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
              <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">
                {f.question}
                <ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BAHRAIN GUIDES - Content Cluster */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">Bahrain GP Deep Dive</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/bahrain-f1-night-race-guide" className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-all">
            <p className="font-bold text-white text-sm">Night Race Guide</p>
            <p className="text-xs text-amber-300/60 mt-1">What makes it special + tips</p>
          </Link>
          <Link to="/ultimate-f1-tickets-guide-2026" className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-all">
            <p className="font-bold text-white text-sm">Ultimate F1 Guide 2026</p>
            <p className="text-xs text-amber-300/60 mt-1">Every race compared</p>
          </Link>
        </div>
      </section>

      {/* INTERNAL LINKS - Link Wheel */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">More F1 Races You'll Love</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { to: "/f1-monaco-grand-prix-tickets", label: "Monaco GP", price: "195", color: "from-red-500/20 to-amber-500/20" },
            { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP", price: "69", color: "from-green-500/20 to-white/5" },
            { to: "/f1-british-grand-prix-silverstone-tickets", label: "Silverstone GP", price: "95", color: "from-blue-500/20 to-red-500/20" },
            { to: "/f1-singapore-grand-prix-tickets", label: "Singapore GP", price: "129", color: "from-purple-500/20 to-pink-500/20" },
            { to: "/f1-las-vegas-grand-prix-tickets", label: "Las Vegas GP", price: "195", color: "from-yellow-500/20 to-red-500/20" },
            { to: "/f1-abu-dhabi-grand-prix-tickets", label: "Abu Dhabi GP", price: "119", color: "from-cyan-500/20 to-blue-500/20" },
            { to: "/champions-league-tickets", label: "Champions League", price: "49", color: "from-blue-500/20 to-indigo-500/20" },
            { to: "/taylor-swift-london-tickets", label: "Taylor Swift", price: "89", color: "from-pink-500/20 to-purple-500/20" },
          ].map((l, i) => (
            <Link key={i} to={l.to} className={`bg-gradient-to-br ${l.color} border border-white/10 rounded-xl p-4 hover:border-white/30 transition-all`}>
              <p className="font-bold text-white text-sm">{l.label}</p>
              <p className="text-amber-400 text-xs font-bold mt-1">From &euro;{l.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Related Keywords for SEO */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h3 className="text-sm font-bold text-white/40 mb-3">Related Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {["Bahrain GP tickets", "Bahrain Grand Prix 2026", "F1 Bahrain night race", "Sakhir F1 tickets", "Bahrain F1 hospitality", "Grand Prix Bahrain", "F1 Bahrain 2026 tickets", "buy Bahrain GP tickets online", "Bahrain International Circuit tickets", "F1 season opener tickets", "Formel 1 Bahrain tickets"].map((term, i) => (
            <span key={i} className="px-3 py-1 bg-white/5 text-white/30 rounded-full text-xs border border-white/5">{term}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BahrainGPPage;
