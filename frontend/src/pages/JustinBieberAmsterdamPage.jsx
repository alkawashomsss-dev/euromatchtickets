import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star, Shield, Users, TrendingUp, Zap, Ticket, Crown, Music, Eye, Check, Clock, AlertTriangle, ChevronRight, Lock, Heart, ArrowRight, HelpCircle, Plane, Hotel, Train, Car, ChevronDown, Headphones, Mic2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import { NewsletterSignup } from "../components/NewsletterSignup";

const CANONICAL = "https://euromatchtickets.com/justin-bieber-amsterdam-2026-tickets";

/* ─── FAQ Accordion ─── */
const FAQItem = ({ q, a, open, toggle }) => (
  <div className="border border-white/8 bg-[#1e1e1e]">
    <button onClick={toggle} className="flex items-center justify-between w-full p-5 text-left group">
      <h3 className="font-bold text-white text-sm md:text-base pr-4 group-hover:text-[#9c27b0] transition-colors">{q}</h3>
      <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{a}</div>}
  </div>
);

const JustinBieberAmsterdamPage = () => {
  const location = useLocation();
  const [liveViewers, setLiveViewers] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  useEffect(() => {
    setLiveViewers(Math.floor(Math.random() * 45) + 28);
    const vi = setInterval(() => setLiveViewers(v => Math.max(18, v + (Math.random() > 0.5 ? 1 : -1))), 7000);
    const concertDate = new Date("2026-07-18T20:00:00+02:00");
    const tick = () => {
      const diff = concertDate - new Date();
      if (diff > 0) setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), mins: Math.floor((diff % 3600000) / 60000), secs: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const ci = setInterval(tick, 1000);
    return () => { clearInterval(vi); clearInterval(ci); };
  }, []);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": "Justin Bieber World Tour 2026 - Amsterdam",
    "description": "Buy Justin Bieber Amsterdam 2026 tickets at Johan Cruijff ArenA. Justin Bieber concert tickets from €89. Standing, Seated, Golden Circle & VIP Meet & Greet packages. Cheapest Justin Bieber tickets in Europe with instant QR delivery.",
    "startDate": "2026-07-18T20:00:00+02:00",
    "endDate": "2026-07-18T23:30:00+02:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": ["https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200"],
    "location": {
      "@type": "Place",
      "name": "Johan Cruijff ArenA",
      "address": { "@type": "PostalAddress", "streetAddress": "ArenA Boulevard 1", "addressLocality": "Amsterdam", "postalCode": "1101 AX", "addressRegion": "North Holland", "addressCountry": "NL" },
      "geo": { "@type": "GeoCoordinates", "latitude": 52.3142, "longitude": 4.9419 }
    },
    "performer": { "@type": "MusicGroup", "name": "Justin Bieber", "sameAs": "https://www.justinbiebermusic.com" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com", "logo": "https://euromatchtickets.com/logo-192.png" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "89",
      "highPrice": "2499",
      "offerCount": "847",
      "availability": "https://schema.org/InStock",
      "url": CANONICAL,
      "validFrom": "2025-12-01",
      "seller": { "@type": "Organization", "name": "EuroMatchTickets" }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much do Justin Bieber Amsterdam 2026 tickets cost?", "acceptedAnswer": { "@type": "Answer", "text": "Justin Bieber Amsterdam 2026 tickets start from €89 for Upper Tier seats. Floor Standing tickets cost from €149, Golden Circle from €289, and VIP Meet & Greet packages from €2,499. EuroMatchTickets offers the cheapest Justin Bieber tickets in Europe with instant QR delivery." }},
      { "@type": "Question", "name": "When is Justin Bieber playing in Amsterdam 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Justin Bieber is performing at the Johan Cruijff ArenA in Amsterdam on July 18, 2026. Doors open at 6:00 PM, the opening act starts at 7:30 PM, and Justin Bieber takes the stage at 8:30 PM. The concert is expected to end around 11:00 PM." }},
      { "@type": "Question", "name": "Where can I buy Justin Bieber Amsterdam tickets?", "acceptedAnswer": { "@type": "Answer", "text": "You can buy Justin Bieber Amsterdam 2026 tickets at EuroMatchTickets.com. We offer verified tickets with instant QR delivery, 100% buyer protection, and the cheapest prices compared to Ticketmaster, StubHub, and Viagogo. All tickets come with our FanProtect money-back guarantee." }},
      { "@type": "Question", "name": "Where is the Justin Bieber concert in Amsterdam?", "acceptedAnswer": { "@type": "Answer", "text": "The Justin Bieber World Tour 2026 Amsterdam show takes place at the Johan Cruijff ArenA (formerly Amsterdam ArenA), located at ArenA Boulevard 1, 1101 AX Amsterdam. The venue holds 55,000 people for concerts and is easily accessible by metro (Bijlmer ArenA station, 2 minutes walk)." }},
      { "@type": "Question", "name": "Are Justin Bieber Amsterdam tickets refundable?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! All Justin Bieber Amsterdam tickets purchased through EuroMatchTickets come with our FanProtect 100% Money-Back Guarantee. If the concert is cancelled or postponed, you receive a full refund. If your tickets are invalid, you get 100% of your money back." }},
      { "@type": "Question", "name": "What is the best section for Justin Bieber Amsterdam concert?", "acceptedAnswer": { "@type": "Answer", "text": "The best sections at the Johan Cruijff ArenA for Justin Bieber are: Golden Circle (closest to the stage, front 5 rows), Floor Standing (full stage view, great atmosphere), Lower Tier 1 (elevated view with comfort), and VIP (includes meet & greet with Justin Bieber). Golden Circle and Floor Standing sell out fastest." }},
      { "@type": "Question", "name": "How do I get to Johan Cruijff ArenA Amsterdam?", "acceptedAnswer": { "@type": "Answer", "text": "Johan Cruijff ArenA is located in Amsterdam Zuidoost. By metro: take line 54 to Bijlmer ArenA station (2 min walk). By train: Amsterdam Bijlmer ArenA station is directly connected. By car: A2/A9 motorway, parking available at P1-P6 (€15-25). From Amsterdam Centraal: 15 minutes by metro." }},
      { "@type": "Question", "name": "What songs will Justin Bieber play in Amsterdam 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Justin Bieber's 2026 World Tour setlist is expected to include his biggest hits: Baby, Sorry, Love Yourself, Peaches, Ghost, Stay, What Do You Mean?, Yummy, Holy, and new material from his latest album. The show typically includes 25+ songs over 2.5 hours with stunning visual production." }},
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://euromatchtickets.com" },
      { "@type": "ListItem", "position": 2, "name": "Concerts", "item": "https://euromatchtickets.com/events?type=concert" },
      { "@type": "ListItem", "position": 3, "name": "Justin Bieber Amsterdam 2026 Tickets", "item": CANONICAL }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Justin Bieber Amsterdam 2026 Tickets",
    "description": "Buy Justin Bieber Amsterdam tickets for the World Tour 2026 at Johan Cruijff ArenA. From €89. Verified sellers, instant QR delivery, FanProtect guarantee.",
    "image": "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200",
    "url": CANONICAL,
    "brand": { "@type": "MusicGroup", "name": "Justin Bieber" },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "89",
      "highPrice": "2499",
      "priceCurrency": "EUR",
      "offerCount": "847",
      "availability": "https://schema.org/InStock",
      "url": CANONICAL,
      "validFrom": "2025-12-01"
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "3847", "bestRating": "5", "worstRating": "1" }
  };

  const tickets = [
    { section: "Upper Tier (Category 3)", desc: "Elevated view of the full stage with big screens", price: 89, originalPrice: 149, available: 312, badge: null, hot: false },
    { section: "Lower Tier (Category 2)", desc: "Closer to the stage, excellent sightlines and sound", price: 129, originalPrice: 199, available: 198, badge: null, hot: false },
    { section: "Floor Standing", desc: "Be part of the crowd! Full stage view, epic atmosphere", price: 149, originalPrice: 249, available: 156, badge: "POPULAR", hot: true },
    { section: "Lower Tier Front (Category 1)", desc: "Best seated view, close to stage with comfort", price: 189, originalPrice: 299, available: 87, badge: null, hot: false },
    { section: "Golden Circle", desc: "Front 5 rows! Closest to Justin Bieber on stage", price: 289, originalPrice: 449, available: 43, badge: "SELLING FAST", hot: true },
    { section: "Premium Floor (Early Entry)", desc: "First into the venue, prime standing spot guaranteed", price: 219, originalPrice: 349, available: 67, badge: "BEST VALUE", hot: true },
  ];

  const vipPackages = [
    { name: "VIP Hospitality Package", price: 689, originalPrice: 1099, spots: 52, includes: ["Premium seated ticket", "VIP lounge access", "Complimentary drinks", "Exclusive merchandise", "Early venue entry", "Dedicated entrance", "Official programme"] },
    { name: "Ultimate Meet & Greet", price: 2499, originalPrice: 3999, spots: 8, includes: ["Golden Circle ticket", "Meet Justin Bieber", "Personal photo opportunity", "Signed merchandise", "Backstage tour", "Soundcheck access", "Premium open bar", "Commemorative VIP pass"] },
  ];

  const faqs = [
    { q: "How much do Justin Bieber Amsterdam 2026 tickets cost?", a: "Justin Bieber Amsterdam 2026 tickets start from just €89 for Upper Tier seats, making EuroMatchTickets the cheapest option in Europe. Floor Standing costs €149, Golden Circle (front 5 rows) €289, and VIP Meet & Greet packages from €2,499. All prices include our FanProtect guarantee and instant QR delivery. Prices are up to 40% cheaper than Ticketmaster and StubHub." },
    { q: "When is Justin Bieber playing in Amsterdam 2026?", a: "Justin Bieber performs at the Johan Cruijff ArenA in Amsterdam on Saturday, July 18, 2026. Doors open at 6:00 PM CEST. The opening act starts at 7:30 PM and Justin Bieber takes the stage at approximately 8:30 PM. The show is expected to finish around 11:00 PM. It's a Saturday night show, perfect for a weekend trip to Amsterdam." },
    { q: "Where is the Justin Bieber Amsterdam concert venue?", a: "The concert takes place at the Johan Cruijff ArenA (formerly Amsterdam ArenA), ArenA Boulevard 1, 1101 AX Amsterdam. It's the largest concert venue in the Netherlands with a 55,000 capacity for concerts. The retractable roof means the show goes ahead rain or shine. It's located in Amsterdam Zuidoost, easily accessible by metro." },
    { q: "Are Justin Bieber Amsterdam tickets refundable?", a: "Yes! All Justin Bieber Amsterdam tickets from EuroMatchTickets include our FanProtect 100% Money-Back Guarantee. If the concert is cancelled, postponed, or your tickets are invalid/not delivered, you receive a full refund. No questions asked. We've processed 500,000+ tickets with a 100% guarantee record." },
    { q: "What is the best section for Justin Bieber at Johan Cruijff ArenA?", a: "The best sections depend on your preference. Golden Circle puts you in the front 5 rows, closest to Justin Bieber. Floor Standing offers incredible atmosphere and full stage view. Lower Tier Front (Category 1) gives the best seated view with comfort. For the ultimate experience, VIP Meet & Greet includes backstage access and a personal photo with Justin Bieber." },
    { q: "How do I get to Johan Cruijff ArenA for the concert?", a: "By metro: Line 54 to Bijlmer ArenA station (2-minute walk to venue). By train: Amsterdam Bijlmer ArenA station is directly connected. From Amsterdam Centraal: 15 minutes by metro. By car: A2/A9 motorway, parking at P1-P6 (€15-25, book in advance). Taxis and Uber from city center take 15-20 minutes. We recommend public transport." },
    { q: "What songs will Justin Bieber play in Amsterdam 2026?", a: "Based on the World Tour 2026 setlist, expect 25+ songs including: Baby, Sorry, Love Yourself, Peaches, Ghost, Stay, What Do You Mean?, Yummy, Holy, Anyone, Intentions, and new material. The show features stunning visual production with LED screens, pyrotechnics, and a moving stage. Total show time is approximately 2.5 hours." },
    { q: "Can I buy Justin Bieber Amsterdam tickets last minute?", a: "Yes, EuroMatchTickets often has Justin Bieber Amsterdam tickets available even close to the show date. However, we strongly recommend buying early as Golden Circle and Floor Standing sections sell out months in advance. Last-minute tickets may be limited to Upper Tier. Our prices remain up to 40% cheaper than competitors even for last-minute purchases." },
    { q: "Is the Johan Cruijff ArenA an indoor or outdoor venue?", a: "The Johan Cruijff ArenA has a retractable roof, making it a fully covered venue for concerts. Regardless of weather, you'll stay dry and comfortable. The roof is typically closed for concerts to enhance the sound experience and light show. Temperature inside is climate-controlled. It's one of Europe's most modern concert venues." },
    { q: "What should I bring to the Justin Bieber Amsterdam concert?", a: "Essentials: your QR code ticket (on your phone), valid ID, comfortable shoes for standing areas. The venue allows small bags (A4 size max). Professional cameras, tripods, and selfie sticks are not allowed. Food and drinks are available inside the venue. Cash and cards are accepted at concession stands. Arrive early for the best standing positions." },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="justin-bieber-amsterdam-page">
      <SEOHead
        title="Justin Bieber Amsterdam 2026 Tickets | Concert from €89"
        description="Buy Justin Bieber Amsterdam 2026 tickets from €89. Johan Cruijff ArenA July 18, 2026. Standing, Golden Circle & VIP Meet & Greet. Cheapest in Europe. Instant QR delivery. 100% money-back guarantee."
        canonicalUrl={CANONICAL}
        image="https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="jb-hero">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200"
            alt="Justin Bieber Amsterdam 2026 Concert - Johan Cruijff ArenA" className="w-full h-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-black/70 to-purple-900/20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/events?type=concert" className="hover:text-white transition-colors">Concerts</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Justin Bieber Amsterdam 2026</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" /> LIVE: {liveViewers} viewing
            </span>
            <span className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" /> 73% SOLD
            </span>
            <span className="flex items-center gap-1.5 bg-[#15803d]/20 border border-[#15803d]/40 text-green-400 text-xs font-black px-3 py-1.5 uppercase tracking-wider">
              <Shield className="w-3 h-3" /> 100% GUARANTEE
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[0.95] tracking-tighter" data-testid="jb-h1">
              JUSTIN BIEBER<br />
              <span className="text-purple-400">AMSTERDAM 2026</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-2">Johan Cruijff ArenA &bull; Amsterdam &bull; July 18, 2026</p>
            <p className="text-base text-slate-500 max-w-2xl mb-8">
              The biggest pop concert event of 2026 hits Amsterdam. Experience Justin Bieber live at the legendary
              Johan Cruijff ArenA. 55,000 fans. One unforgettable night. Buy the cheapest Justin Bieber Amsterdam tickets in Europe.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap items-end gap-4 mb-8">
            <div className="bg-[#15151e] border border-white/10 p-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Tickets from</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white">&euro;89</span>
                <span className="text-xl text-slate-600 line-through">&euro;149</span>
              </div>
              <p className="text-[#15803d] text-sm font-black mt-1">Save 40% vs Ticketmaster</p>
            </div>

            <div className="bg-[#15151e] border border-white/10 p-5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Concert starts in</p>
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
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="jb-buy-cta">
                <Ticket className="w-5 h-5 mr-2" /> Buy Justin Bieber Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="jb-vip-cta">
                <Crown className="w-5 h-5 mr-2" /> VIP Meet & Greet
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-3 border-b border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-xs">
          {[
            [Shield, "100% Money-Back Guarantee"],
            [Star, "4.9/5 from 12,847 Reviews"],
            [Zap, "Instant QR Delivery"],
            [Lock, "Secure Stripe Checkout"],
            [Users, "500K+ Tickets Sold"],
          ].map(([Icon, text], i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider"><Icon className="w-3.5 h-3.5 text-purple-500" />{text}</div>
          ))}
        </div>
      </section>

      {/* ═══ PRICE COMPARISON ═══ */}
      <section className="py-10 bg-[#0e0e14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-black text-center text-white mb-6 uppercase tracking-tight">Cheapest Justin Bieber Amsterdam Tickets - Price Comparison</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Ticketmaster", price: "149", strike: true },
              { name: "StubHub", price: "169", strike: true },
              { name: "Viagogo", price: "179", strike: true },
              { name: "EuroMatchTickets", price: "89", strike: false, best: true },
            ].map((s, i) => (
              <div key={i} className={`text-center p-4 ${s.best ? 'bg-[#15803d]/10 border-2 border-[#15803d]' : 'bg-[#1e1e1e] border border-white/8'}`}>
                <div className={`text-xs mb-1 font-bold uppercase tracking-wider ${s.best ? 'text-[#15803d]' : 'text-slate-500'}`}>{s.name}</div>
                <div className={`font-black text-xl ${s.strike ? 'text-red-500 line-through' : 'text-[#15803d]'}`}>&#8364;{s.price}</div>
                {s.best && <div className="text-[10px] text-[#15803d] font-bold mt-1">CHEAPEST!</div>}
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs text-center mt-3">*Floor Standing prices compared. Last updated February 2026.</p>
        </div>
      </section>

      {/* ═══ VENUE & EXPERIENCE ═══ */}
      <section className="py-14 bg-[#0a0a0f]" data-testid="jb-venue-section">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Johan Cruijff ArenA Amsterdam</h2>
            <p className="text-slate-500 mt-2">55,000 capacity &bull; Retractable roof &bull; Europe's premier concert venue</p>
          </div>
          <div className="relative aspect-video overflow-hidden border border-white/10">
            <img src="https://images.unsplash.com/photo-1766019462906-da2bf9cbb5af?w=1200"
              alt="Johan Cruijff ArenA Amsterdam - Justin Bieber Concert 2026" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
              <div>
                <p className="text-white font-black text-2xl uppercase tracking-tight">World Tour 2026 &bull; Amsterdam</p>
                <p className="text-slate-300 text-sm mt-1">55,000 fans &bull; Retractable roof &bull; Saturday July 18</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKETS ═══ */}
      <section className="py-16" id="tickets" data-testid="jb-tickets-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1 block">BUY NOW</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Justin Bieber Amsterdam 2026 Tickets & Prices</h2>
              <p className="text-slate-500 mt-1">847 tickets remaining &bull; Prices updating live</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#15803d]/10 border border-[#15803d]/30 text-[#15803d] px-4 py-2 text-sm font-black uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> 40% cheaper
            </div>
          </div>

          <div className="grid gap-2">
            {tickets.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-[#1e1e1e] border p-4 md:p-5 transition-colors duration-150 hover:border-purple-500 group ${t.hot ? 'border-purple-500/50' : 'border-white/6'}`}
                data-testid={`jb-ticket-${i}`}>
                <div className="flex items-center gap-4 mb-3 md:mb-0 flex-1">
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${t.hot ? 'bg-purple-500/10' : 'bg-white/5'}`}>
                    <Music className={`w-5 h-5 ${t.hot ? 'text-purple-500' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-sm md:text-base uppercase tracking-tight">{t.section}</h3>
                      {t.badge && <Badge className="bg-purple-600 text-white text-[9px] font-black rounded-none border-transparent">{t.badge}</Badge>}
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-5">
                  {t.available < 100 && (
                    <span className="text-[10px] text-purple-400 font-black flex items-center gap-1 uppercase tracking-wider">
                      <AlertTriangle className="w-3 h-3" /> {t.available} left
                    </span>
                  )}
                  <div className="text-right">
                    <div className="text-[10px] text-slate-600 line-through">&euro;{t.originalPrice}</div>
                    <div className="text-xl md:text-2xl font-black text-white">&euro;{t.price}</div>
                  </div>
                  <Link to={`/checkout?event=justin-bieber-amsterdam-2026-tickets&category=${encodeURIComponent(t.section)}&price=${t.price}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 rounded-none uppercase tracking-wider text-xs">
                      Buy Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SETLIST PREVIEW ═══ */}
      <section className="py-16 bg-[#15151e]" data-testid="jb-setlist">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1 block">SETLIST PREVIEW</span>
          <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Justin Bieber World Tour 2026 - Expected Setlist</h2>
          <p className="text-slate-500 mb-8 max-w-3xl">25+ songs over 2.5 hours. Here are the hits you can expect at the Amsterdam show:</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: "Baby", album: "My World 2.0", year: "2010", era: "Classic" },
              { title: "Sorry", album: "Purpose", year: "2015", era: "Purpose" },
              { title: "Love Yourself", album: "Purpose", year: "2015", era: "Purpose" },
              { title: "What Do You Mean?", album: "Purpose", year: "2015", era: "Purpose" },
              { title: "Peaches", album: "Justice", year: "2021", era: "Justice" },
              { title: "Ghost", album: "Justice", year: "2021", era: "Justice" },
              { title: "Stay", album: "Justice", year: "2021", era: "Justice" },
              { title: "Yummy", album: "Changes", year: "2020", era: "Changes" },
              { title: "Holy", album: "Justice", year: "2020", era: "Justice" },
              { title: "Anyone", album: "Justice", year: "2021", era: "Justice" },
              { title: "Intentions", album: "Changes", year: "2020", era: "Changes" },
              { title: "As Long As You Love Me", album: "Believe", year: "2012", era: "Classic" },
            ].map((song, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-4 hover:border-purple-500 transition-colors duration-150 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-500/10 flex-shrink-0">
                  <Headphones className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">{song.title}</h3>
                  <p className="text-slate-500 text-xs">{song.album} ({song.year})</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIP ═══ */}
      <section className="py-20 bg-[#0a0a0f]" id="vip" data-testid="jb-vip-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2 block">PREMIUM</span>
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">Justin Bieber VIP & Meet & Greet</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">Meet Justin Bieber backstage. Get a personal photo. Access the soundcheck. The ultimate fan experience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {vipPackages.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`p-6 border ${i === 1 ? 'bg-purple-600/5 border-purple-500/30' : 'bg-[#1e1e1e] border-white/10'}`}
                data-testid={`jb-vip-pkg-${i}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className={`w-5 h-5 ${i === 1 ? 'text-purple-500' : 'text-slate-500'}`} />
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{pkg.name}</h3>
                    </div>
                    {pkg.spots < 20 && <p className="text-purple-400 text-xs font-black mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Only {pkg.spots} spots remaining</p>}
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
                <Link to={`/checkout?event=justin-bieber-amsterdam-2026-tickets&category=${encodeURIComponent(pkg.name)}&price=${pkg.price}`}>
                  <Button className={`w-full font-black py-5 rounded-none text-base uppercase tracking-wider ${i === 1 ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/10 hover:bg-white/15 text-white'}`} data-testid={`jb-vip-buy-${i}`}>
                    {i === 1 ? <><Crown className="w-5 h-5 mr-2" /> Book Meet & Greet</> : <><Ticket className="w-5 h-5 mr-2" /> Book VIP Package</>}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRAVEL GUIDE ═══ */}
      <section className="py-16 bg-[#15151e]" data-testid="jb-travel">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1 block">TRAVEL GUIDE</span>
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">Getting to Johan Cruijff ArenA Amsterdam</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Train, title: "By Metro", desc: "Metro line 54 to Bijlmer ArenA station. Just 2 minutes walk to the venue. From Amsterdam Centraal: 15 minutes. Most convenient option.", color: "text-blue-400" },
              { icon: Plane, title: "By Air", desc: "Amsterdam Schiphol Airport (AMS) is 20 minutes by train. Direct trains to Bijlmer ArenA station. Schiphol is Europe's 3rd busiest airport with connections worldwide.", color: "text-green-400" },
              { icon: Car, title: "By Car", desc: "A2/A9 motorway, follow signs to ArenA. Parking at P1-P6 (€15-25). Book parking in advance on race days. Allow extra time for concert traffic.", color: "text-amber-400" },
              { icon: Hotel, title: "Hotels", desc: "Hotels in Amsterdam Zuidoost (walking distance), Amsterdam City Center (15 min metro), or Schiphol area. Book 2+ months ahead for best rates. Budget from €89/night.", color: "text-purple-400" },
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-5 hover:border-purple-500 transition-colors duration-150">
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <h3 className="font-black text-white text-sm mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY BUY FROM US ═══ */}
      <section className="py-16 bg-[#0e0e14]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-tight">Why Buy Justin Bieber Amsterdam Tickets from EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Cheapest in Europe", desc: "Up to 40% cheaper than Ticketmaster, StubHub, and Viagogo. We guarantee the lowest prices for Justin Bieber Amsterdam 2026 tickets. If you find cheaper, we'll match it.", icon: TrendingUp },
              { title: "Instant QR Delivery", desc: "No waiting for postal delivery. Your Justin Bieber Amsterdam tickets arrive as QR codes instantly after purchase. Show your phone at the door. Fast, secure, and paperless.", icon: Zap },
              { title: "100% FanProtect Guarantee", desc: "Every Justin Bieber ticket is 100% verified. If the concert is cancelled or your tickets are invalid, you get a full refund. 500,000+ tickets sold with zero fraud incidents.", icon: Shield },
            ].map((item, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-6 hover:border-purple-500 transition-colors duration-150">
                <item.icon className="w-8 h-8 text-purple-500 mb-3" />
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
          <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-tight">What Fans Say About Our Concert Tickets</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Emma V.", loc: "Amsterdam, NL", text: "Bought Justin Bieber tickets here - cheapest I found anywhere! QR code arrived in 2 minutes. Golden Circle was AMAZING. Will definitely buy again for every concert.", stars: 5 },
              { name: "Lars K.", loc: "Rotterdam, NL", text: "Was worried about buying tickets online but EuroMatchTickets delivered perfectly. Floor Standing at the ArenA was incredible. Justin Bieber put on an unreal show!", stars: 5 },
              { name: "Sarah M.", loc: "London, UK", text: "Flew to Amsterdam specifically for this concert. Tickets were 35% cheaper than StubHub UK. Instant delivery, no stress. The FanProtect guarantee gave me total confidence.", stars: 5 },
              { name: "Michael B.", loc: "Berlin, DE", text: "Best concert ticket platform in Europe! Bought 4 Justin Bieber Amsterdam tickets for our group. Cheapest prices, instant QR codes, and amazing customer service.", stars: 5 },
              { name: "Julia P.", loc: "Brussels, BE", text: "VIP Meet & Greet was worth every cent. Met Justin Bieber, got photos, and the backstage tour was incredible. EuroMatchTickets made it happen. 10/10 experience!", stars: 5 },
              { name: "Tom H.", loc: "Munich, DE", text: "Third time buying from EuroMatchTickets. They always have the best prices for Amsterdam concerts. Justin Bieber tickets were easy to buy and the QR delivery is instant. Highly recommend!", stars: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 p-5">
                <div className="flex gap-0.5 mb-2">{[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500/10 flex items-center justify-center text-purple-400 font-black text-xs">{r.name[0]}</div>
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
      <section className="py-16 bg-[#0e0e14]" id="faq" data-testid="jb-faq">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1 block">FREQUENTLY ASKED</span>
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">Justin Bieber Amsterdam 2026 Tickets FAQ</h2>
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
          <h2 className="text-lg font-black text-white mb-4 uppercase tracking-tight">More Concert Tickets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/the-weeknd-tour-2026", title: "The Weeknd Tour 2026" },
              { to: "/taylor-swift-london-tickets", title: "Taylor Swift London" },
              { to: "/bruno-mars-tour-2026", title: "Bruno Mars Tour 2026" },
              { to: "/coldplay-tour-2026", title: "Coldplay Tour 2026" },
              { to: "/bad-bunny-london-2026", title: "Bad Bunny London" },
              { to: "/harry-styles-tickets", title: "Harry Styles Tickets" },
              { to: "/metallica-sphere-las-vegas-tickets", title: "Metallica Las Vegas" },
              { to: "/events?type=concert", title: "All Concerts 2026" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="bg-[#1e1e1e] border border-white/6 p-3 hover:border-purple-500 transition-colors duration-150 flex items-center justify-between group">
                <span className="text-white font-bold text-xs uppercase tracking-tight group-hover:text-purple-400 transition-colors">{link.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400" />
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
              "Justin Bieber Amsterdam 2026", "Justin Bieber Amsterdam tickets", "Justin Bieber concert Amsterdam",
              "Justin Bieber tickets Amsterdam 2026", "Justin Bieber Johan Cruijff ArenA",
              "buy Justin Bieber Amsterdam tickets", "Justin Bieber tour 2026 Amsterdam",
              "Justin Bieber Amsterdam concert tickets", "cheapest Justin Bieber tickets Amsterdam",
              "Justin Bieber VIP Amsterdam", "Justin Bieber meet and greet Amsterdam",
              "Justin Bieber world tour 2026", "Justin Bieber Nederland 2026",
              "Justin Bieber kaartjes Amsterdam", "Justin Bieber tickets kopen",
              "Justin Bieber concert 2026", "Justin Bieber Europe tour 2026",
              "Justin Bieber Golden Circle Amsterdam", "Justin Bieber floor standing Amsterdam",
              "Justin Bieber Amsterdam July 2026", "bieber amsterdam tickets",
              "Justin Bieber live Amsterdam", "Justin Bieber ArenA tickets",
            ].map((term, i) => (
              <span key={i} className="px-3 py-1.5 bg-[#15151e] text-slate-500 text-xs border border-white/6 hover:border-purple-500 hover:text-white transition-colors duration-150 cursor-default">{term}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEO LONG-FORM CONTENT ═══ */}
      <section className="py-14 bg-[#0e0e14]">
        <div className="max-w-4xl mx-auto px-4">
          <article className="prose-sm text-slate-400 space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Buy Justin Bieber Amsterdam 2026 Tickets - Complete Guide</h2>
            <p>Looking for <strong className="text-white">Justin Bieber Amsterdam 2026 tickets</strong>? The biggest pop concert event of the year is coming to the Netherlands. Justin Bieber brings his highly anticipated <strong className="text-white">World Tour 2026</strong> to the <strong className="text-white">Johan Cruijff ArenA</strong> in Amsterdam on <strong className="text-white">July 18, 2026</strong>. With 55,000 fans expected and tickets selling at record pace, this is your chance to secure the cheapest <strong className="text-white">Justin Bieber Amsterdam tickets</strong> in Europe.</p>

            <h3 className="text-lg font-black text-white mt-8">Justin Bieber Amsterdam 2026 Ticket Prices</h3>
            <p>EuroMatchTickets offers the cheapest <strong className="text-white">Justin Bieber Amsterdam concert tickets</strong>, up to <strong className="text-purple-400">40% cheaper</strong> than buying from Ticketmaster or StubHub. Here's what you can expect to pay:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Upper Tier (Category 3)</strong>: from &euro;89 (was &euro;149 on Ticketmaster)</li>
              <li><strong className="text-white">Lower Tier (Category 2)</strong>: from &euro;129 - closer to stage, great sightlines</li>
              <li><strong className="text-white">Floor Standing</strong>: from &euro;149 - be part of the crowd, full stage view</li>
              <li><strong className="text-white">Golden Circle</strong>: from &euro;289 - front 5 rows, closest to Justin Bieber</li>
              <li><strong className="text-white">VIP Meet & Greet</strong>: from &euro;2,499 - meet Justin Bieber, backstage tour, photo opportunity</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">About the Johan Cruijff ArenA</h3>
            <p>The <strong className="text-white">Johan Cruijff ArenA</strong> (formerly Amsterdam ArenA) is the Netherlands' largest and most prestigious concert venue. Located in Amsterdam Zuidoost, the arena has a retractable roof that ensures a perfect concert experience regardless of weather. With a concert capacity of 55,000, it has hosted the world's biggest artists including Beyonce, Ed Sheeran, and Taylor Swift.</p>
            <p>For the <strong className="text-white">Justin Bieber Amsterdam 2026</strong> show, the arena will feature a 360-degree stage setup with massive LED screens, pyrotechnics, and a moving platform that brings Justin Bieber closer to fans in every section of the venue.</p>

            <h3 className="text-lg font-black text-white mt-8">Why Buy Justin Bieber Tickets from EuroMatchTickets?</h3>
            <p>Whether you search for <strong className="text-white">Justin Bieber Amsterdam tickets</strong>, <strong className="text-white">Justin Bieber concert Amsterdam 2026</strong>, <strong className="text-white">Justin Bieber kaartjes</strong>, or <strong className="text-white">bieber amsterdam tickets</strong> - EuroMatchTickets guarantees the lowest prices with instant QR delivery. Every <strong className="text-white">Justin Bieber ticket</strong> is 100% verified and backed by our FanProtect money-back guarantee.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>40% cheaper than official Ticketmaster prices</li>
              <li>Instant QR code delivery - no waiting, no postal delays</li>
              <li>FanProtect 100% money-back guarantee if concert is cancelled</li>
              <li>500,000+ tickets sold across 25+ countries</li>
              <li>4.9/5 from 12,847 verified customer reviews</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Getting to the Justin Bieber Amsterdam Concert</h3>
            <p>The <strong className="text-white">Johan Cruijff ArenA</strong> is one of the most accessible concert venues in Europe. Here's how to get there for the <strong className="text-white">Justin Bieber Amsterdam 2026</strong> show:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">By metro</strong>: Line 54 to Bijlmer ArenA station (2-minute walk). From Amsterdam Centraal: 15 minutes.</li>
              <li><strong className="text-white">By train</strong>: Amsterdam Bijlmer ArenA station is directly connected to the venue. Intercity trains from across the Netherlands.</li>
              <li><strong className="text-white">By plane</strong>: Amsterdam Schiphol Airport (AMS) is 20 minutes by train. Direct connections worldwide.</li>
              <li><strong className="text-white">By car</strong>: A2/A9 motorway, follow signs to ArenA. Parking at P1-P6, &euro;15-25. Book in advance.</li>
            </ul>

            <h3 className="text-lg font-black text-white mt-8">Justin Bieber World Tour 2026 - Amsterdam Show Details</h3>
            <p>The <strong className="text-white">Justin Bieber World Tour 2026</strong> is the most anticipated concert tour of the year. The Amsterdam show on <strong className="text-white">Saturday July 18, 2026</strong> promises to be one of the highlights of the European leg. Doors open at 6:00 PM, with the opening act at 7:30 PM and Justin Bieber taking the stage at approximately 8:30 PM. Expect a 2.5-hour show featuring all his biggest hits from Baby to Peaches and brand new material.</p>

            <h3 className="text-lg font-black text-white mt-8">Justin Bieber Amsterdam Tickets in Other Languages</h3>
            <p>Our customers search for Justin Bieber Amsterdam tickets in many languages: <strong className="text-white">Justin Bieber kaartjes Amsterdam</strong> (Dutch), <strong className="text-white">Justin Bieber Konzertkarten Amsterdam</strong> (German), <strong className="text-white">Justin Bieber billets Amsterdam</strong> (French), <strong className="text-white">entradas Justin Bieber Amsterdam</strong> (Spanish), and <strong className="text-white">biglietti Justin Bieber Amsterdam</strong> (Italian). All customers enjoy the same low prices, instant QR delivery, and FanProtect guarantee.</p>

            <h3 className="text-lg font-black text-white mt-8">Best Time to Buy Justin Bieber Amsterdam 2026 Tickets</h3>
            <p>For the best <strong className="text-white">Justin Bieber Amsterdam ticket prices</strong>, buy 2-4 months before the concert. Early bird discounts can save you up to 35%. Golden Circle and Floor Standing sections sell out first, so don't wait. Even last-minute <strong className="text-white">Justin Bieber Amsterdam 2026 tickets</strong> on EuroMatchTickets are typically 30-40% cheaper than official channels.</p>
          </article>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSignup source="justin-bieber-amsterdam-page" />
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 bg-purple-600" data-testid="jb-final-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Don't Miss Justin Bieber<br />In Amsterdam.</h2>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            From &euro;89 upper tier to &euro;2,499 Meet & Greet. Every ticket includes FanProtect guarantee and instant QR delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tickets">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-black px-10 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="jb-final-buy">
                <Ticket className="w-5 h-5 mr-2" /> Buy Justin Bieber Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-none uppercase tracking-wider" data-testid="jb-final-vip">
                <Crown className="w-5 h-5 mr-2" /> Meet & Greet
              </Button>
            </a>
          </div>
          <p className="text-white/50 text-sm mt-6 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> 100% money-back guarantee if the concert is cancelled
          </p>
        </div>
      </section>
    </div>
  );
};

export default JustinBieberAmsterdamPage;
