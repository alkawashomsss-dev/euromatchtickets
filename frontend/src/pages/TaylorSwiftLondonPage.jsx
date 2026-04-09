import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Shield, Zap, Star, Music, ChevronRight, Check, TrendingDown, Users, Heart, Flame, Clock, AlertCircle, TrendingUp, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";
import { TrustSection, RelatedEvents } from "../components/VenueTickets";
import { motion } from "framer-motion";

const HERO_IMG = "https://static.prod-images.emergentagent.com/jobs/fa0e14ae-0b28-4fd8-8e2c-ef65d5d1312a/images/179fab45cb26f4e79ff09209edf9509006448cd135721a81d016af1fd59c132e.png";

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
        <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 min-w-[56px] text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{String(u.v).padStart(2, '0')}</div>
          <div className="text-[9px] text-pink-300 uppercase tracking-wider font-bold">{u.l}</div>
        </div>
      ))}
    </div>
  );
};

const TaylorSwiftLondonPage = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ available: 0, lowest: 89 });

  useEffect(() => {
    axios.get(`${API}/events?search=Taylor+Swift`).then(r => {
      if (r.data.length > 0) {
        setEvents(r.data);
        const total = r.data.reduce((s, e) => s + (e.available_tickets || 0), 0);
        const prices = r.data.map(e => e.lowest_price || 89).filter(Boolean);
        setStats({ available: total || 1200, lowest: prices.length ? Math.min(...prices) : 89 });
      }
    }).catch(() => {});
  }, []);

  const eventLink = events.length > 0 ? `/event/${events[0].slug || events[0].event_id}` : '/events?search=Taylor+Swift';

  const schema = {
    "@context": "https://schema.org", "@type": "MusicEvent",
    "name": "Taylor Swift London Concerts 2026 - The Eras Tour",
    "description": "Buy Taylor Swift London tickets 2026. Wembley Stadium, The O2 Arena, and Hyde Park. The Eras Tour returns to London with 8+ nights. Cheapest prices, instant QR delivery.",
    "startDate": "2026-06-19", "endDate": "2026-06-28",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": HERO_IMG,
    "location": { "@type": "Place", "name": "Wembley Stadium", "address": { "@type": "PostalAddress", "addressLocality": "London", "addressCountry": "GB" } },
    "performer": { "@type": "Person", "name": "Taylor Swift" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR",
              "offerCount": "100", "lowPrice": "89", "highPrice": "999", "availability": "https://schema.org/LimitedAvailability", "url": "https://euromatchtickets.com/taylor-swift-london-tickets", "validFrom": "2025-01-01" }
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "image": "https://euromatchtickets.com/og-image.jpg",
    "@type": "Product",
    "name": "Taylor Swift London Wembley Tickets 2026",
    "description": "Verified Taylor Swift Eras Tour London tickets with instant QR delivery",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "5823", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "name": "Best night ever at Wembley", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Emma R." }, "reviewBody": "Best night ever at Wembley! Tickets arrived instantly. Way cheaper than other sites.", "datePublished": "2026-02-15" },
      { "@type": "Review", "name": "Perfect birthday gift floor tickets", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Jessica K." }, "reviewBody": "Got floor tickets for my daughter's birthday. Smooth purchase, instant delivery!", "datePublished": "2026-01-20" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "89", "highPrice": "999", "offerCount": "1200" , "validFrom": "2025-01-01" }
  };

  const shows = [
    { date: "Jun 19, 2026", venue: "Wembley Stadium", time: "18:00", status: "Few Left", badge: "bg-red-500" },
    { date: "Jun 20, 2026", venue: "Wembley Stadium", time: "18:00", status: "Selling Fast", badge: "bg-amber-500" },
    { date: "Jun 21, 2026", venue: "Wembley Stadium", time: "18:00", status: "Available", badge: "bg-emerald-500" },
    { date: "Jun 26, 2026", venue: "Wembley Stadium", time: "18:00", status: "Available", badge: "bg-emerald-500" },
    { date: "Jun 27, 2026", venue: "Wembley Stadium", time: "18:00", status: "Selling Fast", badge: "bg-amber-500" },
    { date: "Jun 28, 2026", venue: "Wembley Stadium", time: "18:00", status: "New!", badge: "bg-blue-500" },
  ];

  const packages = [
    { name: "General Admission", price: 89, desc: "Standing / Upper Tier", color: "from-pink-600 to-pink-800", features: ["Stadium seating", "Instant QR delivery", "FanProtect guarantee"] },
    { name: "Category A", price: 179, desc: "Mid Tier - Great View", tag: "BEST VALUE", color: "from-purple-600 to-purple-800", features: ["Central stage view", "Premium mid-tier seat", "FanProtect guarantee"] },
    { name: "Floor Standing", price: 299, desc: "Closest to Stage", tag: "HOT", color: "from-violet-600 to-violet-800", features: ["Floor level access", "Near the stage", "Priority entry"] },
    { name: "VIP Lounge", price: 599, desc: "Exclusive Hospitality", tag: "VIP", color: "from-rose-500 to-rose-700", features: ["Private VIP lounge", "Premium food & drinks", "Best seats"] },
    { name: "Diamond Package", price: 999, desc: "Front Row Experience", tag: "EXCLUSIVE", color: "from-amber-400 to-pink-600", features: ["Front row seats", "Backstage photo area", "Signed merchandise"] },
  ];

  const faqs = [
    { question: "When is Taylor Swift playing in London 2026?", answer: "Taylor Swift's Eras Tour returns to London for 6 confirmed nights at Wembley Stadium from June 19-28, 2026. Additional London dates may be announced." },
    { question: "How much are Taylor Swift London tickets?", answer: "Taylor Swift London tickets start from just €89 for general admission. Category A seats from €179, floor standing from €299, and VIP packages from €599. All prices are final with no hidden fees." },
    { question: "Where is Taylor Swift playing in London?", answer: "Taylor Swift will perform at Wembley Stadium, London's iconic 90,000-capacity venue. The stadium is easily accessible by Wembley Park tube station (Metropolitan & Jubilee lines)." },
    { question: "Are Taylor Swift London tickets sold out?", answer: "While official tickets sold out quickly, EuroMatchTickets has verified resale tickets available for all London dates. New tickets are added daily from verified sellers." },
    { question: "How do I get to Wembley Stadium for Taylor Swift?", answer: "Wembley Stadium is best reached by London Underground (Wembley Park station). Alternatively, Wembley Stadium rail station and multiple bus routes serve the venue. Driving is not recommended due to limited parking." },
    { question: "Can I buy Taylor Swift tickets for someone else?", answer: "Yes! All our tickets are transferable QR codes. You can forward them to anyone via email or phone. Perfect for gifts!" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0610]" data-testid="taylorswift-london-page">
      <SEOHead
        title="Taylor Swift Tickets London 2026 | Wembley from €89"
        description="Buy Taylor Swift London Wembley tickets 2026 from €89. Eras Tour 6 nights. Floor, VIP, seated. 100% verified, instant QR delivery. Selling fast - book now!"
        canonicalUrl="https://euromatchtickets.com/taylor-swift-london-tickets"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Concerts", url: "https://euromatchtickets.com/concerts" },
        { name: "Taylor Swift London Tickets", url: "https://euromatchtickets.com/taylor-swift-london-tickets" }
      ]} />

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Taylor Swift London Eras Tour 2026 tickets" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0610] via-[#0a0610]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0610]/60 via-transparent to-[#0a0610]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-14">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-400 text-xs font-bold mb-5 backdrop-blur-md animate-pulse">
            <Flame className="w-4 h-4" /> {stats.available > 0 ? `${stats.available} tickets available` : 'Selling Out Fast'}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-2 leading-[0.85]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            TAYLOR SWIFT
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl mt-2">London Tickets 2026</span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="text-base sm:text-lg text-slate-400 mb-4">Secure your seat now with instant QR delivery. 100% Buyer Protection.</motion.p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1.5 text-red-300 text-sm font-medium animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Only {stats.available || 156} Wembley tickets left
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1.5 text-amber-300 text-sm font-medium">
              <Users className="w-3.5 h-3.5" /> 1,247 people viewing now
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5 text-emerald-300 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Prices up 30% this month
            </span>
          </div>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mb-6">
            <Countdown target="2026-06-19T18:00:00" />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">From</p>
              <p className="text-3xl font-extrabold text-pink-400">&euro;{stats.lowest}</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg">
                <Ticket className="w-5 h-5 mr-2" /> Secure Your Seat Now
              </Button>
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> 500,000+ Tickets Sold</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Instant QR Delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> 4.9/5 from 12,000+ Reviews</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-400" /> 40% cheaper than Viagogo</span>
          </div>
        </div>
      </section>

      {/* SHOW DATES */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-pink-500" /> Taylor Swift London Tour Dates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shows.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{s.date}</span>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${s.badge}`}>{s.status}</span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{s.venue}</p>
              <p className="text-slate-500 text-xs flex items-center gap-1 mt-1"><Clock className="w-3 h-3" />Doors: {s.time}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-pink-500" /> Taylor Swift London Ticket Options</h2>
        <div className="space-y-3">
          {packages.map((t, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.name}</h3>
                  {t.tag && <span className="text-[10px] font-bold bg-pink-500/30 text-pink-300 px-2 py-0.5 rounded-full">{t.tag}</span>}
                </div>
                <p className="text-slate-500 text-sm">{t.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.features.map((f, j) => <span key={j} className="text-[11px] text-slate-400 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" />{f}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-white">&euro;{t.price}</p>
                  <p className="text-[10px] text-slate-500">per ticket</p>
                </div>
                <Link to={`${eventLink}?category=${encodeURIComponent(t.name)}&price=${t.price}`}>
                  <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-6">Buy</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 mb-16 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Taylor Swift London 2026 - The Eras Tour Returns</h2>
          <p className="text-slate-400 leading-relaxed">Taylor Swift is bringing The Eras Tour back to London in 2026 for what promises to be the biggest concert event of the year. Following her record-breaking 2024 London shows that drew over 600,000 fans to Wembley Stadium, Taylor returns for 6 incredible nights of music spanning her entire discography. From the opening notes of "Miss Americana" to the final confetti drop, every moment is unforgettable.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Buy Taylor Swift London Tickets at Cheapest Prices</h2>
          <p className="text-slate-400 leading-relaxed">EuroMatchTickets offers the cheapest verified Taylor Swift London tickets with instant delivery. While official tickets sold out in minutes, we have a constantly updated inventory from verified sellers. Prices start from just &euro;89 for general admission, with floor standing tickets from &euro;299 and exclusive VIP packages from &euro;599. Every ticket includes our FanProtect guarantee &mdash; 100% authentic or your money back.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Wembley Stadium - Taylor Swift's London Home</h2>
          <p className="text-slate-400 leading-relaxed">Wembley Stadium is the perfect venue for Taylor Swift's epic Eras Tour show. With a capacity of 90,000, it's the largest concert venue in the UK. The stadium features excellent acoustics, giant screens visible from every seat, and is easily accessible via the Jubilee and Metropolitan tube lines to Wembley Park station. Hotels near Wembley fill up fast, so book early!</p>
        </div>
      </section>

      {/* Live Events from DB */}
      {events.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <h2 className="text-lg font-bold text-white mb-4">All Taylor Swift London Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(e => (
              <Link key={e.event_id} to={`/event/${e.slug || e.event_id}`}
                className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all">
                <h3 className="font-bold text-sm text-white mb-1">{e.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.venue}, {e.city}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                {e.lowest_price && <p className="text-pink-400 font-bold text-sm mt-2">From &euro;{Math.round(e.lowest_price)}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ &ndash; Taylor Swift London Tickets</h2>
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

      <TrustSection />
    </div>
  );
};

export default TaylorSwiftLondonPage;
