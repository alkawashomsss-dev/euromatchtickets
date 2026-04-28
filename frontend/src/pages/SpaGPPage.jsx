import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, Crown, Wine, Utensils, Eye, Check, Clock, AlertTriangle, ChevronRight, Lock, Heart, ArrowRight, HelpCircle, Plane, Hotel, CloudRain, Train, Car, Info, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { RelatedEventsLinks } from "../components/RelatedEventsLinks";

const CANONICAL = "https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets";

/* ─── FAQ Accordion ─── */
const FAQItem = ({ q, a, open, toggle }) => (
  <div className="border border-white/8 bg-[#1e1e1e]">
    <button onClick={toggle} className="flex items-center justify-between w-full p-5 text-left group">
      <h3 className="font-bold text-white text-sm md:text-base pr-4 group-hover:text-[#e10600] transition-colors">{q}</h3>
      <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>}
  </div>
);

const SpaGPPage = () => {
  const location = useLocation();
  const [liveViewers, setLiveViewers] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  useEffect(() => {
    setLiveViewers(Math.floor(Math.random() * 30) + 18);
    const vi = setInterval(() => setLiveViewers(v => Math.max(12, v + (Math.random() > 0.5 ? 1 : -1))), 8000);
    const raceDate = new Date("2026-08-30T14:00:00Z");
    const tick = () => {
      const diff = raceDate - new Date();
      if (diff > 0) setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), mins: Math.floor((diff % 3600000) / 60000), secs: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const ci = setInterval(tick, 1000);
    return () => { clearInterval(vi); clearInterval(ci); };
  }, []);

  /* Schema: SportsEvent + FAQPage + BreadcrumbList + Offer */
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Belgian Grand Prix 2026 - Spa-Francorchamps F1",
    "description": "Buy Spa F1 tickets 2026 at Circuit de Spa-Francorchamps. Belgian Grand Prix tickets from €109. General Admission, Eau Rouge Grandstand, Raidillon, Paddock Club VIP. Verified Spa F1 tickets in Europe with QR ticket delivery.",
    "startDate": "2026-08-28T09:00:00+02:00",
    "endDate": "2026-08-30T18:00:00+02:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": ["https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"],
    "location": {
      "@type": "Place",
      "name": "Circuit de Spa-Francorchamps",
      "address": { "@type": "PostalAddress", "streetAddress": "Route du Circuit 55", "addressLocality": "Stavelot", "postalCode": "4970", "addressRegion": "Wallonia", "addressCountry": "BE" },
      "geo": { "@type": "GeoCoordinates", "latitude": 50.4372, "longitude": 5.9714 }
    },
    "performer": [
      { "@type": "SportsTeam", "name": "Formula 1 - FIA World Championship" },
      { "@type": "Person", "name": "Max Verstappen" },
      { "@type": "Person", "name": "Lewis Hamilton" },
      { "@type": "Person", "name": "Charles Leclerc" }
    ],
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com", "logo": "https://euromatchtickets.com/logo-192.png" },
    
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much do Spa F1 tickets cost in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Spa F1 tickets 2026 start from €109 for General Admission. Grandstand tickets at Eau Rouge start from €259, Raidillon from €289, and VIP Paddock Club tickets from €3,489. EuroMatchTickets offers the verified Spa F1 listings." }},
      { "@type": "Question", "name": "Where can I buy Belgian Grand Prix 2026 tickets?", "acceptedAnswer": { "@type": "Answer", "text": "You can buy Belgian Grand Prix 2026 tickets at EuroMatchTickets.com. We offer verified Spa-Francorchamps tickets with QR ticket delivery, 100% buyer protection, and the cheapest prices compared to F1.com, StubHub, and Viagogo." }},
      { "@type": "Question", "name": "When is the Belgian Grand Prix 2026 at Spa-Francorchamps?", "acceptedAnswer": { "@type": "Answer", "text": "The Belgian Grand Prix 2026 at Circuit de Spa-Francorchamps takes place on August 28-30, 2026. Friday is practice day, Saturday is qualifying, and Sunday August 30 is race day with lights out at 2:00 PM CET." }},
      { "@type": "Question", "name": "What is the best grandstand at Spa-Francorchamps for F1?", "acceptedAnswer": { "@type": "Answer", "text": "The best grandstands at Spa-Francorchamps are Gold 3 (Eau Rouge) for the most iconic view, Gold 4 (Raidillon) for seeing cars at 300km/h, and Silver (La Source Turn 1) for dramatic overtaking. The Paddock Club offers the ultimate VIP experience above the pit lane." }},
      { "@type": "Question", "name": "How do I get to Spa-Francorchamps circuit?", "acceptedAnswer": { "@type": "Answer", "text": "Spa-Francorchamps is located near Stavelot in the Belgian Ardennes. The nearest airports are Brussels (140km), Liège (80km), and Cologne (130km). Shuttle buses run from Spa town and Liège. By car, take the E42 motorway to exit 10 (Francorchamps). Free parking is available at the circuit." }},
      { "@type": "Question", "name": "Are Spa F1 tickets refundable?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! All Spa F1 tickets purchased through EuroMatchTickets come with our Buyer protection Cancellation refund policy. If the Belgian Grand Prix is cancelled or postponed, you receive a full refund. If your tickets are invalid, you get 100% of your money back." }},
      { "@type": "Question", "name": "Can I camp at Spa-Francorchamps during the F1 weekend?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, camping is available at Spa-Francorchamps during the Belgian Grand Prix weekend. There are several camping zones around the circuit including Camping Eau Rouge and the official campsite near the paddock area. Camping passes are sold separately." }},
      { "@type": "Question", "name": "What is Eau Rouge at Spa-Francorchamps?", "acceptedAnswer": { "@type": "Answer", "text": "Eau Rouge is the most famous corner in Formula 1, located at Circuit de Spa-Francorchamps. It's a fast, uphill left-right-left sequence where F1 cars reach speeds over 300km/h. Combined with the Raidillon hill, it's the most iconic and challenging section of any F1 circuit in the world." }}
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://euromatchtickets.com" },
      { "@type": "ListItem", "position": 2, "name": "F1 Tickets", "item": "https://euromatchtickets.com/f1-tickets" },
      { "@type": "ListItem", "position": 3, "name": "F1 Belgian Grand Prix Spa Tickets", "item": CANONICAL }
    ]
  };

  const tickets = [
    { section: "General Admission", desc: "Roam the circuit freely, access multiple big screens and fan zones", price: 109, originalPrice: 189, available: 345, badge: null, hot: false },
    { section: "Bronze (Bruxelles Corner)", desc: "Watch cars tackle the tricky Bruxelles hairpin complex", price: 149, originalPrice: 229, available: 213, badge: null, hot: false },
    { section: "Silver (La Source Turn 1)", desc: "First braking zone - dramatic overtaking into the T1 hairpin", price: 189, originalPrice: 269, available: 134, badge: null, hot: false },
    { section: "Gold 3 (Eau Rouge)", desc: "THE most legendary corner in motorsport - iconic view", price: 259, originalPrice: 399, available: 89, badge: "ICONIC", hot: true },
    { section: "Gold 4 (Raidillon)", desc: "See cars fly uphill at 300km/h - feel the G-force", price: 289, originalPrice: 429, available: 67, badge: "BEST VALUE", hot: true },
    { section: "Gold 1 (Bus Stop Chicane)", desc: "Overtaking hotspot, closest to the podium celebration", price: 249, originalPrice: 369, available: 112, badge: null, hot: false },
    { section: "Platinum (Pouhon)", desc: "High-speed double apex left - pure driver skill", price: 319, originalPrice: 479, available: 45, badge: "PREMIUM", hot: true }
  ];

  const vipPackages = [
    { name: "VIP Hospitality Lounge", price: 1189, originalPrice: 1899, spots: 38, includes: ["Covered grandstand seat", "Champagne reception", "3-course Belgian lunch", "Open bar all day", "Big screen in lounge", "Full circuit access", "Official programme"] },
    { name: "Paddock Club Experience", price: 3489, originalPrice: 5499, spots: 14, includes: ["Pit lane walk", "Paddock access pass", "Meet F1 drivers chance", "Michelin-star dining", "Premium open bar", "Exclusive terrace above pits", "Guided garage tour", "Commemorative gift box"] }
  ];

  const faqs = [
    { q: "How much do Spa F1 tickets cost in 2026?", a: "Spa F1 tickets for 2026 start from just €109 for General Admission, making EuroMatchTickets the cheapest option in Europe. Grandstand tickets range from €149 (Bronze) to €319 (Platinum Pouhon). The legendary Eau Rouge grandstand (Gold 3) costs €259, and VIP Paddock Club packages start from €3,489. All prices include our Buyer protection and QR ticket delivery." },
    { q: "Where is the best place to watch F1 at Spa-Francorchamps?", a: "The best viewing spots at Spa-Francorchamps depend on what you want to see. Gold 3 (Eau Rouge) offers the most iconic view in all of motorsport. Gold 4 (Raidillon) lets you feel the raw speed as cars blast uphill at 300km/h. Silver (La Source) is perfect for overtaking action. For the ultimate experience, the Paddock Club terrace above the pit lane offers 360-degree views with driver access." },
    { q: "When is the Belgian Grand Prix 2026?", a: "The Belgian Grand Prix 2026 at Spa-Francorchamps takes place August 28-30, 2026. Friday August 28 features two practice sessions (FP1 at 1:30 PM, FP2 at 5:00 PM). Saturday August 29 has FP3 at 12:30 PM and Qualifying at 4:00 PM. Sunday August 30 is Race Day with lights out at 2:00 PM CET." },
    { q: "How do I get to Spa-Francorchamps?", a: "Spa-Francorchamps is located near Stavelot in the Belgian Ardennes. By plane: Brussels Airport (140km, 1.5h drive), Liège Airport (80km, 1h), or Cologne Bonn (130km, 1.5h). By train: Verviers-Central station is nearest, then shuttle bus. By car: E42 motorway exit 10 (Francorchamps). Dedicated F1 shuttle buses operate from Spa town, Liège, and Brussels during the Grand Prix weekend." },
    { q: "Are Belgian Grand Prix tickets refundable?", a: "Yes! All Spa F1 tickets from EuroMatchTickets include our Buyer protection Cancellation refund policy. If the Belgian Grand Prix is cancelled, postponed, or if your tickets are invalid or not delivered, you receive a full refund. No questions asked. This is our promise to every customer." },
    { q: "Can I camp at Spa-Francorchamps during the F1?", a: "Yes, camping is hugely popular at the Belgian Grand Prix! Official camping zones include Camping Eau Rouge (closest to the action), Les Combes camping area, and several private campsites around the circuit. A 3-day camping pass typically costs €50-100. Many fans camp from Thursday through Monday for the full Spa experience." },
    { q: "What is Eau Rouge at Spa?", a: "Eau Rouge is the most famous and legendary corner complex in Formula 1 history. Located at Circuit de Spa-Francorchamps in Belgium, it's a terrifyingly fast left-right-left uphill sequence where F1 cars reach 310+ km/h. Combined with the Raidillon hill that follows, it's the ultimate test of driver courage and car setup. The Eau Rouge grandstand (Gold 3) is the most sought-after viewing point at the Belgian Grand Prix." },
    { q: "What should I bring to Spa F1?", a: "Essential items for the Belgian Grand Prix: waterproof jacket (Spa weather is famously unpredictable), sunscreen, comfortable walking shoes (the circuit is 7km long), ear protection, portable phone charger, picnic blanket for GA areas, cash for food/drink stalls, binoculars, and a clear bag (security requirement). The Ardennes forest location means temperatures can change rapidly." },
    { q: "Is Spa-Francorchamps the longest F1 circuit?", a: "Yes! At 7.004 km (4.352 miles), Circuit de Spa-Francorchamps is the longest circuit on the current F1 calendar. Its 19 corners wind through the stunning Belgian Ardennes forest, creating one of the most dramatic and challenging tracks in motorsport. A single lap takes approximately 1:44 at race pace." },
    { q: "How many people attend the Belgian Grand Prix?", a: "The Belgian Grand Prix at Spa-Francorchamps attracts approximately 100,000+ spectators on race day, with over 300,000 across the entire weekend. It's one of the best-attended F1 races in Europe, drawing passionate motorsport fans from Belgium, Netherlands, Germany, France, UK, and beyond." }
  ];

  const circuitCorners = [
    { name: "La Source (Turn 1)", speed: "65 km/h", type: "Hairpin", desc: "The first braking zone. Heavy overtaking spot into a tight right-hander." },
    { name: "Eau Rouge (Turn 2-3)", speed: "310 km/h", type: "Left-Right-Left", desc: "The most legendary corner in F1. Cars take it flat out through a compression." },
    { name: "Raidillon (Turn 4)", speed: "300 km/h", type: "Uphill Crest", desc: "Blind uphill right after Eau Rouge. Pure courage. The cars fly over the crest." },
    { name: "Les Combes (Turn 5-6)", speed: "280→105 km/h", type: "Chicane", desc: "Heavy braking from the Kemmel Straight. Major overtaking opportunity." },
    { name: "Bruxelles (Turn 9-10)", speed: "120 km/h", type: "Double Apex", desc: "Tight downhill hairpin complex. Technical and tricky in the wet." },
    { name: "Pouhon (Turn 11)", speed: "280 km/h", type: "Double Left", desc: "High-speed double-apex left-hander. Incredible G-forces on the drivers." },
    { name: "Blanchimont (Turn 17)", speed: "315 km/h", type: "Fast Left", desc: "Taken flat out in modern F1. Requires total commitment and trust in the car." },
    { name: "Bus Stop (Turn 18-19)", speed: "75 km/h", type: "Chicane", desc: "Final complex before the start/finish. DRS detection zone, prime overtaking." }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="spa-gp-page">
      <SEOHead
        title="F1 Spa Tickets 2026 (Belgian GP) — Prices, Dates & Availability | EuroMatchTickets"
        description="F1 Spa 2026 Belgian Grand Prix — official dates, Eau Rouge grandstand prices, Paddock Club availability, and verified seller inventory. Instant QR delivery, full refund if the race is cancelled."
        canonicalUrl={CANONICAL}
        image="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />


      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="spa-hero">
        <div className="absolute inset-0">
          <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
            alt="Spa-Francorchamps F1 Circuit Aerial View - Belgian Grand Prix 2026" className="w-full h-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-black/60 to-black/30" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/f1-tickets" className="hover:text-white transition-colors">F1 Tickets</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Belgian Grand Prix Spa</span>
          </nav>

          {/* Live badges */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-2 bg-[#e10600]/20 border border-[#e10600]/40 text-red-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#e10600] rounded-full animate-pulse" /> LIVE: {liveViewers} viewing
            </span>
            <span className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" /> AVAILABLE
            </span>
            <span className="flex items-center gap-1.5 bg-[#15803d]/20 border border-[#15803d]/40 text-green-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <Shield className="w-3 h-3" /> BUYER PROTECTION
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[0.95] tracking-tighter" data-testid="spa-h1">
              SPA F1 TICKETS 2026<br />
              <span className="text-[#e10600]">BELGIAN GRAND PRIX</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-2">Circuit de Spa-Francorchamps &bull; Belgium &bull; August 28-30, 2026</p>
            <p className="text-base text-slate-500 max-w-2xl mb-8">
              The longest and most dramatic circuit in Formula 1. Experience the legendary Eau Rouge, survive Raidillon,
              and witness 300km/h battles through the stunning Belgian Ardennes. Buy the verified Spa F1 listings.
            </p>
          </motion.div>

          {/* Price + Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap items-end gap-4 mb-8">
            <div className="bg-[#15151e] border border-white/10 p-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Tickets from</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white">&euro;109</span>
                <span className="text-xl text-slate-600 line-through">&euro;189</span>
              </div>
              <p className="text-[#15803d] text-sm font-black mt-1"></p>
            </div>

            <div className="bg-[#15151e] border border-white/10 p-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Race starts in</p>
              <div className="flex gap-3">
                {[["D", countdown.days], ["H", countdown.hours], ["M", countdown.mins], ["S", countdown.secs]].map(([label, val]) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-white tabular-nums">{String(val).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-600 uppercase font-bold">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
            <a href="#tickets">
              <Button size="lg" className="bg-[#e10600] hover:bg-red-700 text-white font-black px-8 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="spa-buy-cta">
                <Ticket className="w-5 h-5 mr-2" /> View Spa F1 Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="spa-vip-cta">
                <Crown className="w-5 h-5 mr-2" /> Paddock Club VIP
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-3 border-b border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-xs">
          {[
            [Shield, "Cancellation refund policy"],
            [Star, "Highly rated from 1 Reviews"],
            [Zap, "QR ticket delivery"],
            [Lock, "Secure Stripe Checkout"],
            [Users, "Live marketplace"]
          ].map(([Icon, text], i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider"><Icon className="w-3.5 h-3.5 text-[#e10600]" />{text}</div>
          ))}
        </div>
      </section>

      {/* ═══ PRICE COMPARISON ═══ */}
      <section className="py-10 bg-[#0e0e14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-black text-center text-white mb-6 uppercase tracking-tight">Verified Spa F1 Tickets - Price Comparison</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "F1.com Official", price: "399", strike: true },
              { name: "StubHub", price: "379", strike: true },
              { name: "Viagogo", price: "365", strike: true },
              { name: "EuroMatchTickets", price: "109", strike: false, best: true }
            ].map((s, i) => (
              <div key={i} className={`text-center p-4 ${s.best ? 'bg-[#15803d]/10 border-2 border-[#15803d]' : 'bg-[#1e1e1e] border border-white/8'}`}>
                <div className={`text-xs mb-1 font-bold uppercase tracking-wider ${s.best ? 'text-[#15803d]' : 'text-slate-500'}`}>{s.name}</div>
                <div className={`font-black text-xl ${s.strike ? 'text-red-500 line-through' : 'text-[#15803d]'}`}>&#8364;{s.price}</div>
                {s.best && <div className="text-[10px] text-[#15803d] font-bold mt-1">AVAILABLE!</div>}
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs text-center mt-3">*General Admission prices compared. Last updated April 2026.</p>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section className="py-14 bg-[#0a0a0f]" data-testid="spa-video-section">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Experience Spa-Francorchamps</h2>
            <p className="text-slate-500 mt-2">The most challenging 7km of tarmac in the world</p>
          </div>
          <div className="relative aspect-video overflow-hidden border border-white/10">
            <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
              alt="Spa-Francorchamps F1 Circuit Eau Rouge 2026" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
              <div>
                <p className="text-white font-black text-2xl uppercase tracking-tight">Eau Rouge &bull; Raidillon &bull; La Source</p>
                <p className="text-slate-300 text-sm mt-1">7.004 km &bull; 19 turns &bull; 330 km/h top speed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKETS ═══ */}
      <section className="py-16" id="tickets" data-testid="spa-tickets-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-1 block">VIEW AVAILABILITY</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Spa F1 2026 Tickets & Prices</h2>
              <p className="text-slate-500 mt-1">687 listings · prices updated recently &bull; Prices updating live</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#15803d]/10 border border-[#15803d]/30 text-[#15803d] px-4 py-2 text-sm font-black uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> Competitive market pricing
            </div>
          </div>

          <div className="grid gap-2">
            {tickets.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border p-4 md:p-5 transition-colors duration-150 hover:border-[#e10600] group ${t.hot ? 'border-[#e10600]/50' : 'border-white/6'}`}
                data-testid={`spa-ticket-${i}`}>
                <div className="flex items-center gap-4 mb-3 md:mb-0 flex-1">
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${t.hot ? 'bg-[#e10600]/10' : 'bg-white/5'}`}>
                    <Flag className={`w-5 h-5 ${t.hot ? 'text-[#e10600]' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-sm md:text-base uppercase tracking-tight">{t.section}</h3>
                      {t.badge && <Badge className="bg-[#e10600] text-white text-[9px] font-black rounded-none border-transparent">{t.badge}</Badge>}
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-5">
                  {t.available < 100 && (
                    <span className="text-[10px] text-[#e10600] font-black flex items-center gap-1 uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" /> {t.available} left
                    </span>
                  )}
                  <div className="text-right">
                    <div className="text-[10px] text-slate-600 line-through">&euro;{t.originalPrice}</div>
                    <div className="text-xl md:text-2xl font-black text-white">&euro;{t.price}</div>
                  </div>
                  <Link to={`/checkout?event=belgian-grand-prix-2026-tickets&category=${encodeURIComponent(t.name)}&price=${t.price}`}>
                    <Button className="bg-[#e10600] hover:bg-red-700 text-white font-black px-5 rounded-none uppercase tracking-wider text-xs">
                      View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CIRCUIT GUIDE ═══ */}
      <section className="py-16 bg-[#15151e]" data-testid="spa-circuit-guide">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-1 block">CIRCUIT GUIDE</span>
          <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Spa-Francorchamps Corner-by-Corner Guide</h2>
          <p className="text-slate-500 mb-8 max-w-3xl">7.004km of pure racing drama through the Belgian Ardennes. Here's every corner at Circuit de Spa-Francorchamps explained:</p>

          <div className="grid md:grid-cols-2 gap-3">
            {circuitCorners.map((corner, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-5 hover:border-[#e10600] transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-white text-sm uppercase tracking-tight">{corner.name}</h3>
                  <span className="text-[#e10600] font-black text-xs">{corner.speed}</span>
                </div>
                <Badge className="bg-white/5 text-slate-400 text-[10px] font-bold rounded-none border-white/10 mb-2">{corner.type}</Badge>
                <p className="text-slate-500 text-xs leading-relaxed">{corner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIP ═══ */}
      <section className="py-20 bg-[#0a0a0f]" id="vip" data-testid="spa-vip-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-2 block">PREMIUM</span>
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">Spa F1 VIP & Paddock Club</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">Walk the pit lane. Meet the drivers. Dine like royalty above the world's greatest circuit.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="overflow-hidden aspect-[16/10]">
              <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/4ccc649fab606fb509de0ae1038444e173f0f74ad318c6dbc506c19a65640cae.png"
                alt="Spa F1 Paddock Club VIP Experience" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png", label: "Paddock Club Lounge" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/d84430a95323b820d9a6d93e1758ca35eab8a9f595c089743ffc70391dc84381.png", label: "Pit Lane Walk" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Michelin Dining" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/ab1e7b7e008b41b5dbc14a24bb83e208c440cb11a06103486f0c7e2e7936e0d3.png", label: "Trackside Terrace" }
              ].map((item, i) => (
                <div key={i} className="relative overflow-hidden aspect-[4/3]">
                  <img src={item.img} alt={`Spa F1 ${item.label}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-2 text-white text-xs font-black uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Package Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {vipPackages.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`p-6 border ${i === 1 ? 'bg-[#e10600]/5 border-[#e10600]/30' : 'bg-[#1e1e1e] border-white/10'}`}
                data-testid={`spa-vip-pkg-${i}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className={`w-5 h-5 ${i === 1 ? 'text-[#e10600]' : 'text-slate-500'}`} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{pkg.name}</h3>
                    </div>
                    {pkg.spots < 20 && <p className="text-[#e10600] text-xs font-black mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Only {pkg.spots} spots remaining</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-600 line-through">&euro;{pkg.originalPrice.toLocaleString()}</div>
                    <div className="text-3xl font-black text-white">&euro;{pkg.price.toLocaleString()}</div>
                    <div className="text-[#15803d] text-xs font-black">Save &euro;{(pkg.originalPrice - pkg.price).toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-5">
                  {pkg.includes.map((item, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-slate-400 text-xs"><Check className="w-3 h-3 text-[#15803d] flex-shrink-0" /> {item}</div>
                  ))}
                </div>
                <Link to={`/checkout?event=belgian-grand-prix-2026-tickets&category=${encodeURIComponent(pkg.name)}&price=${pkg.price}`}>
                  <Button className={`w-full font-black py-5 rounded-none text-base uppercase tracking-wider ${i === 1 ? 'bg-[#e10600] hover:bg-red-700 text-white' : 'bg-white/10 hover:bg-white/15 text-white'}`} data-testid={`spa-vip-buy-${i}`}>
                    {i === 1 ? <><Crown className="w-5 h-5 mr-2" /> Book Paddock Club</> : <><Ticket className="w-5 h-5 mr-2" /> Book VIP Hospitality</>}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRAVEL GUIDE ═══ */}
      <section className="py-16 bg-[#15151e]" data-testid="spa-travel">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-1 block">TRAVEL GUIDE</span>
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">Getting to Spa-Francorchamps</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Plane, title: "By Air", desc: "Brussels Airport (140km, 1.5h), Liege Airport (80km, 1h), Cologne Bonn (130km, 1.5h). All airports have direct motorway access to the circuit.", color: "text-blue-400" },
              { icon: Train, title: "By Train", desc: "Thalys to Liege-Guillemins, then shuttle bus to circuit. Verviers-Central is the nearest station. Special F1 shuttle services run all weekend.", color: "text-green-400" },
              { icon: Car, title: "By Car", desc: "E42 motorway exit 10 (Francorchamps). Follow signs to Circuit de Spa-Francorchamps. Free parking available at the circuit, arrive early on race day.", color: "text-amber-400" },
              { icon: Hotel, title: "Hotels & Camping", desc: "Book hotels in Spa town, Stavelot, or Malmedy (10-20 min drive). Camping available at the circuit. We recommend booking 3+ months in advance.", color: "text-purple-400" }
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-5 hover:border-[#e10600] transition-colors duration-150">
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <h3 className="font-black text-white text-sm mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Weather */}
          <div className="mt-8 bg-[#1e1e1e] border border-white/6 p-6">
            <div className="flex items-center gap-3 mb-3">
              <CloudRain className="w-6 h-6 text-blue-400" />
              <h3 className="font-black text-white uppercase tracking-tight">Spa Weather Warning</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Spa-Francorchamps is famous for its unpredictable weather. The circuit sits at 400m altitude in the Ardennes forest, where it can rain on one part of the track while the sun shines on another. Always bring a waterproof jacket, even in August. Average temperature during the Belgian Grand Prix: 18-24°C. Pack layers!</p>
          </div>
        </div>
      </section>

      {/* ═══ WHY SPA ═══ */}
      <section className="py-16 bg-[#0e0e14]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-tight">Why the Belgian Grand Prix is the Best F1 Race</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Eau Rouge & Raidillon", desc: "The most legendary corner combination in motorsport. Cars hit 310km/h as they crest the blind rise at Raidillon. Heart-stopping every single lap. Spa F1 tickets at Eau Rouge are the most sought-after in all of Formula 1.", icon: Flag },
              { title: "7.004km of Drama", desc: "The longest circuit on the current F1 calendar. 19 corners through the Belgian Ardennes forest. Spa-Francorchamps' unpredictable weather creates chaos and epic racing. No two Belgian Grand Prix races are ever the same.", icon: Trophy },
              { title: "100 Years of History", desc: "Racing since 1921, Spa-Francorchamps has hosted over 60 Formula 1 Grand Prix races. 100,000+ passionate fans from across Europe create an electric atmosphere. Belgium F1 tickets are among the fastest-selling on the calendar.", icon: Star }
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-6 hover:border-[#e10600] transition-colors duration-150">
                <item.icon className="w-8 h-8 text-[#e10600] mb-3" />
                <h3 className="font-black text-white mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section className="py-12 bg-[#15151e] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-tight">What Fans Say About Spa F1 Tickets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Marco V.", loc: "Milan, Italy", text: "Eau Rouge in person is INSANE. The speed, the sound, the atmosphere. Best F1 race I've ever attended. EuroMatchTickets had the cheapest Spa F1 tickets I could find anywhere.", stars: 5 },
              { name: "Sophie L.", loc: "London, UK", text: "Paddock Club at Spa was worth every penny. Met Leclerc, amazing food, and the view from above the pits is unreal. Belgian Grand Prix VIP is a must-do experience!", stars: 5 },
              { name: "Thomas K.", loc: "Munich, Germany", text: "Verified Spa-Francorchamps tickets I found. QR code arrived instantly. Gold 4 Raidillon seats were PERFECT. Could feel the cars fly past at 300km/h. Already booked for 2027!", stars: 5 },
              { name: "Anna B.", loc: "Amsterdam, NL", text: "Third year buying Belgian GP tickets from EuroMatchTickets. Always the best prices and instant delivery. Spa is magic - the Ardennes forest, the rain, the atmosphere. Unbeatable.", stars: 5 },
              { name: "Pierre D.", loc: "Brussels, BE", text: "As a local, I've been to Spa-Francorchamps F1 many times. EuroMatchTickets offers genuine tickets at the best prices. Gold 3 Eau Rouge view is absolutely iconic. Highly recommend!", stars: 5 },
              { name: "Lisa M.", loc: "Berlin, DE", text: "Bought Belgium F1 tickets for my husband's birthday. He was over the moon! General Admission was great value - you can walk around the entire 7km circuit. Incredible experience.", stars: 5 }
            ].map((r, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-5">
                <div className="flex gap-0.5 mb-2">{[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#e10600]/10 flex items-center justify-center text-[#e10600] font-black text-xs">{r.name[0]}</div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.name}</p>
                    <p className="text-slate-500 text-xs">{r.loc}</p>
                  </div>
                  <Badge className="ml-auto bg-[#15803d]/10 text-[#15803d] text-[10px] font-bold border-transparent rounded-none"><Check className="w-2.5 h-2.5 mr-0.5" /> Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 bg-[#0e0e14]" id="faq" data-testid="spa-faq">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-1 block">FREQUENTLY ASKED</span>
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">Spa F1 Tickets FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} open={openFAQ === i} toggle={() => setOpenFAQ(openFAQ === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERNAL LINKS ═══ */}
      <section className="py-12 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-black text-white mb-4 uppercase tracking-tight">More F1 Tickets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/f1-tickets", title: "All F1 Tickets 2026" },
              { to: "/monaco-grand-prix-tickets", title: "Monaco GP Tickets" },
              { to: "/f1-bahrain-grand-prix-tickets", title: "Bahrain GP Tickets" },
              { to: "/f1-spanish-grand-prix-barcelona-tickets", title: "Spanish GP Tickets" },
              { to: "/motogp-tickets", title: "MotoGP Tickets" },
              { to: "/champions-league-tickets", title: "Champions League" },
              { to: "/taylor-swift-london-tickets", title: "Taylor Swift Tickets" },
              { to: "/world-cup-2026", title: "World Cup 2026" }
            ].map((link) => (
              <Link key={link.to} to={link.to} className="bg-[#1e1e1e] border border-white/6 p-3 hover:border-[#e10600] transition-colors duration-150 flex items-center justify-between group">
                <span className="text-white font-bold text-xs uppercase tracking-tight group-hover:text-[#e10600] transition-colors">{link.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#e10600]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEO KEYWORDS ═══ */}
      <section className="py-10 bg-[#0e0e14]">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-sm font-black text-white mb-4 uppercase tracking-tight">People Also Search For:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Spa F1 tickets", "Spa F1 tickets 2026", "Belgian Grand Prix tickets", "Spa-Francorchamps tickets",
              "F1 Spa tickets", "Belgium F1 tickets", "Spa GP tickets", "Belgian GP tickets",
              "F1 tickets Spa", "tickets Spa F1", "Spa Francorchamps F1 tickets", "Belgium Grand Prix tickets",
              "Eau Rouge grandstand tickets", "Raidillon tickets Spa", "Spa F1 Paddock Club",
              "Belgian Grand Prix VIP", "cheapest Spa F1 tickets", "Spa F1 general admission",
              "Belgium GP tickets 2026", "Formula 1 Spa 2026", "buy Spa F1 tickets online",
              "Spa F1 weekend pass", "Belgian Grand Prix 2026 tickets", "F1 Belgien tickets",
              "Formel 1 Spa tickets", "Formule 1 Spa tickets", "GP Spa tickets",
              "Spa F1 camping", "Spa-Francorchamps grand prix", "ticket F1 Spa"
            ].map((term, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#15151e] text-slate-500 text-xs border border-white/6 hover:border-[#e10600] hover:text-white transition-colors duration-150 cursor-default">{term}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RELATED GUIDES ═══ */}
      <section className="py-12 bg-[#0e0e14]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/blog/best-f1-circuits-2026" className="group bg-[#161620] border border-white/5 p-5 hover:border-[#e10600]/30 transition-all">
              <p className="text-[10px] text-[#e10600] uppercase tracking-widest font-bold mb-1">F1 Guide</p>
              <h3 className="font-bold text-sm text-white group-hover:text-[#e10600] transition-colors">10 Best F1 Circuits to Visit in 2026</h3>
              <p className="text-xs text-slate-500 mt-1">Spa ranked #1. See why.</p>
            </Link>
            <Link to="/blog/spa-francorchamps-travel-guide-2026" className="group bg-[#161620] border border-white/5 p-5 hover:border-[#e10600]/30 transition-all">
              <p className="text-[10px] text-[#e10600] uppercase tracking-widest font-bold mb-1">Travel Guide</p>
              <h3 className="font-bold text-sm text-white group-hover:text-[#e10600] transition-colors">Spa-Francorchamps Travel Guide 2026</h3>
              <p className="text-xs text-slate-500 mt-1">Hotels, transport & insider tips.</p>
            </Link>
            <Link to="/blog/how-to-buy-f1-tickets-2026" className="group bg-[#161620] border border-white/5 p-5 hover:border-[#e10600]/30 transition-all">
              <p className="text-[10px] text-[#e10600] uppercase tracking-widest font-bold mb-1">Buying Guide</p>
              <h3 className="font-bold text-sm text-white group-hover:text-[#e10600] transition-colors">How to Buy F1 Tickets 2026</h3>
              <p className="text-xs text-slate-500 mt-1">Step-by-step beginner's guide.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SEO LONG-FORM CONTENT ═══ */}
      <section className="py-14 bg-[#0e0e14]">
        <div className="max-w-4xl mx-auto px-4">
          <article className="prose-sm text-slate-400 space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">View Spa F1 Tickets 2026 - Complete Guide to the Belgian Grand Prix</h2>
            <p>Looking for <strong className="text-white">Spa F1 tickets</strong>? The Belgian Grand Prix at <strong className="text-white">Circuit de Spa-Francorchamps</strong> is the most anticipated race on the 2026 F1 calendar. With the legendary <em>Eau Rouge-Raidillon</em> corner complex, 7.004 kilometres of pure racing adrenaline, and a capacity of 100,000+ fans, <strong className="text-white">Spa-Francorchamps tickets</strong> sell out months in advance.</p>
            
            <h3 className="text-lg font-black text-white mt-8">Spa F1 Ticket Prices 2026</h3>
            <p>EuroMatchTickets offers the cheapest <strong className="text-white">F1 Spa tickets</strong> in Europe, up to <strong className="text-[#e10600]">Competitive market pricing</strong> than buying from F1.com directly. Here's what you can expect to pay for <strong className="text-white">Belgian Grand Prix tickets</strong>:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">General Admission</strong>: from &euro;109 (was &euro;189 on F1.com)</li>
              <li><strong className="text-white">Eau Rouge Grandstand</strong>: from &euro;229 - the most iconic F1 grandstand in the world</li>
              <li><strong className="text-white">Gold Grandstand (Start/Finish)</strong>: from &euro;349 - watch pit stops and race start</li>
              <li><strong className="text-white">Spa Paddock Club VIP</strong>: from &euro;1,499 - pit lane walk, driver meet, Michelin dining</li>
              <li><strong className="text-white">3-Day Weekend Pass</strong>: from &euro;269 - includes Friday practice, Saturday qualifying, Sunday race</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Why Buy Belgian GP Tickets from EuroMatchTickets?</h3>
            <p>Whether you search for <strong className="text-white">ticket F1 Spa</strong>, <strong className="text-white">Spa Grand Prix tickets</strong>, <strong className="text-white">Belgium F1 tickets</strong>, or <strong className="text-white">Belgian GP tickets</strong> - EuroMatchTickets guarantees the lowest prices with QR ticket delivery. Every <strong className="text-white">Spa-Francorchamps F1 ticket</strong> is verified and backed by our Buyer protection money-back guarantee.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Secondary-market pricing — independent of official channels</li>
              <li>Instant QR code delivery - no waiting, no postal delays</li>
              <li>Buyer protection cancellation refund policy if event is cancelled</li>
              <li>Verified seller inventory across 25+ countries</li>
              <li></li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Spa-Francorchamps Circuit Guide</h3>
            <p>The <strong className="text-white">Circuit de Spa-Francorchamps</strong> in the Ardennes forest of Belgium is widely considered the greatest racing circuit in the world. At 7.004 km, it's the longest track on the F1 calendar and features 19 challenging corners including the world-famous <em>Eau Rouge-Raidillon</em> uphill left-right-left sequence, taken at over 300 km/h by modern F1 cars.</p>
            <p>Key sectors for fans buying <strong className="text-white">Spa F1 tickets 2026</strong>: La Source hairpin (Turn 1, great for overtaking), Eau Rouge (the most photographed corner in motorsport), Les Combes chicane, Pouhon double-left (200+ km/h), and the Bus Stop chicane before the start/finish straight.</p>

            <h3 className="text-lg font-black text-white mt-8">Getting to Spa-Francorchamps</h3>
            <p>The circuit is located near the town of Stavelot in the Belgian Ardennes, approximately 50 km south of Li&egrave;ge. If you've bought your <strong className="text-white">Belgium Grand Prix tickets</strong>, here's how to get there:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">By car</strong>: 1h from Li&egrave;ge, 1.5h from Brussels, 2.5h from Cologne. Free parking at the circuit.</li>
              <li><strong className="text-white">By train</strong>: Take the Thalys or IC train to Li&egrave;ge-Guillemins, then shuttle buses to the circuit on race days.</li>
              <li><strong className="text-white">By plane</strong>: Nearest airports are Li&egrave;ge (LGG, 45 min), Brussels (BRU, 1.5h), or Cologne (CGN, 2h).</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Frequently Searched: Spa F1 Tickets in Other Languages</h3>
            <p>Our customers search for Spa F1 tickets in many languages: <strong className="text-white">Formel 1 Spa Tickets</strong> (German), <strong className="text-white">Formule 1 Spa Tickets</strong> (French/Dutch), <strong className="text-white">F1 Belgien Tickets</strong>, <strong className="text-white">F1 Belgi&euml; Tickets</strong>, <strong className="text-white">GP Spa Tickets</strong>, <strong className="text-white">F1 Kaarten Spa</strong>, <strong className="text-white">Grand Prix Belgie Tickets</strong>, and <strong className="text-white">GP Belgi&euml; Tickets</strong>. Regardless of language, all customers enjoy the same low prices, QR ticket delivery, and Buyer protection.</p>

            <h3 className="text-lg font-black text-white mt-8">Best Time to View Spa F1 Tickets</h3>
            <p>For the best <strong className="text-white">Spa F1 ticket prices</strong>, buy 3-6 months before race day. Early bird discounts can save you up to 30%. However, even last-minute <strong className="text-white">Belgian Grand Prix 2026 tickets</strong> on EuroMatchTickets are typically 25-Secondary-market pricing — independent of official channels. The race weekend is July 24-26, 2026.</p>
          </article>
        </div>
      </section>

      {/* ═══ 2026 SEASON PREVIEW ═══ */}
      <section className="py-14 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <article className="prose-sm text-slate-400 space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Spa F1 2026 - What to Expect at the Belgian Grand Prix</h2>
            <p>The <strong className="text-white">2026 Belgian Grand Prix at Spa-Francorchamps</strong> promises to be one of the most exciting F1 races of the season. With the new 2026 F1 regulations delivering closer racing, the unique layout of <strong className="text-white">Circuit de Spa-Francorchamps</strong> will produce even more thrilling overtaking. The famous <em>Kemmel Straight</em> after Eau Rouge, combined with the new DRS zones, means fans with <strong className="text-white">Spa F1 tickets</strong> will witness non-stop wheel-to-wheel action.</p>

            <h3 className="text-lg font-black text-white mt-8">Belgian Grand Prix 2026 Ticket Categories Explained</h3>
            <p>Choosing the right <strong className="text-white">Spa-Francorchamps ticket</strong> is crucial. Here's what each category offers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">General Admission (GA)</strong>: Freedom to roam the entire 7km circuit. Access all public viewing areas, fan zones, big screens, and food courts. Best for fans who want variety.</li>
              <li><strong className="text-white">Bronze (Bruxelles Corner)</strong>: A technical section where cars navigate a tricky hairpin complex. Great for seeing driver skill up close.</li>
              <li><strong className="text-white">Silver (La Source Turn 1)</strong>: The first braking zone after the start. Dramatic overtaking, safety car restarts, and lap-1 chaos happen right here.</li>
              <li><strong className="text-white">Gold 3 (Eau Rouge)</strong>: THE most iconic corner in F1 history. Watch cars blast through the compression at 310km/h. The view is unforgettable.</li>
              <li><strong className="text-white">Gold 4 (Raidillon)</strong>: Adjacent to Eau Rouge, this grandstand offers a unique elevated perspective as cars crest the blind hill.</li>
              <li><strong className="text-white">Platinum (Pouhon)</strong>: The high-speed double-apex left-hander where G-forces push drivers to their limits. A connoisseur's choice.</li>
              <li><strong className="text-white">Paddock Club VIP</strong>: The ultimate Spa F1 experience. Walk the pit lane, meet drivers, enjoy Michelin-star dining, and watch from the terrace above the pits.</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Spa-Francorchamps F1 History & Legacy</h3>
            <p><strong className="text-white">Circuit de Spa-Francorchamps</strong> has been the spiritual home of Formula 1 since 1950. Over 60 Grand Prix races have been held here, producing some of the sport's most memorable moments. From Michael Schumacher's first win in 1992 to the dramatic 2021 rain-affected race, <strong className="text-white">Spa F1 tickets</strong> guarantee a place in motorsport history.</p>
            <p>The circuit's unique microclimate in the <strong className="text-white">Belgian Ardennes</strong> forest means weather can change in seconds. It's not uncommon for rain to fall on one corner while sunshine bathes another. This unpredictability makes the <strong className="text-white">Belgian Grand Prix</strong> one of the most strategically complex races on the F1 calendar, and one of the most exciting to attend live.</p>

            <h3 className="text-lg font-black text-white mt-8">Spa F1 Tickets vs Competitors - Why EuroMatchTickets Wins</h3>
            <p>When you search for <strong className="text-white">Spa F1 tickets</strong>, <strong className="text-white">Belgian GP tickets</strong>, or <strong className="text-white">Spa-Francorchamps F1 tickets</strong>, you'll find many options. Here's why fans across Europe use EuroMatchTickets:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Price</strong>: General Admission from &euro;109 vs &euro;189+ on F1.com and &euro;365+ on Viagogo. That's 42% savings.</li>
              <li><strong className="text-white">Delivery</strong>: Instant QR code to your phone. No waiting for postal delivery, no risk of lost tickets.</li>
              <li><strong className="text-white">Guarantee</strong>: Buyer protection cancellation refund if the Belgian Grand Prix is cancelled or your tickets don't work.</li>
              <li><strong className="text-white">Selection</strong>: Every grandstand available - from GA to Paddock Club. 687 listings currently available.</li>
            </ul>
          </article>
        </div>
      </section>

      {/* ═══ RELATED F1 RACES ═══ */}
      <RelatedEventsLinks category="spa-f1" title="More F1 Races You'll Love" />

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup source="spa-gp-page" />
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 bg-[#e10600]" data-testid="spa-final-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Don't Just Watch.<br />Experience Spa.</h2>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            From &euro;109 general admission to &euro;3,489 Paddock Club. Every Spa F1 ticket includes Buyer protection and QR ticket delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tickets">
              <Button size="lg" className="bg-white text-[#e10600] hover:bg-white/90 font-black px-10 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="spa-final-buy">
                <Ticket className="w-5 h-5 mr-2" /> View Spa F1 Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="spa-final-vip">
                <Crown className="w-5 h-5 mr-2" /> Paddock Club
              </Button>
            </a>
          </div>
          <p className="text-white/50 text-sm mt-6 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> cancellation refund policy if the event is cancelled
          </p>
        </div>
      </section>
    </div>
  );
};

export default SpaGPPage;
