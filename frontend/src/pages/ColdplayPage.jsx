import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, Shield, Zap, Ticket, ChevronRight, Check, Music, Heart, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData, FAQStructuredData } from "../components/StructuredData";

const ColdplayPage = () => {
  const shows = [
    { date: "Jun 12, 2026", venue: "Wembley Stadium", city: "London", time: "19:00", status: "Selling Fast", badge: "bg-amber-500" },
    { date: "Jun 13, 2026", venue: "Wembley Stadium", city: "London", time: "19:00", status: "Few Left", badge: "bg-red-500" },
    { date: "Jun 20, 2026", venue: "Stade de France", city: "Paris", time: "20:00", status: "Available", badge: "bg-emerald-500" },
    { date: "Jun 27, 2026", venue: "Olympiastadion", city: "Berlin", time: "19:30", status: "Available", badge: "bg-emerald-500" },
    { date: "Jul 04, 2026", venue: "Camp Nou", city: "Barcelona", time: "20:30", status: "New!", badge: "bg-blue-500" },
    { date: "Jul 11, 2026", venue: "San Siro", city: "Milan", time: "20:00", status: "Selling Fast", badge: "bg-amber-500" },
  ];

  const packages = [
    { name: "General Admission", price: 69, desc: "Standing / Upper Tier", features: ["Stadium entry", "Instant QR delivery", "FanProtect guarantee"] },
    { name: "Category A", price: 149, desc: "Mid Tier - Great View", tag: "BEST VALUE", features: ["Central stage view", "Comfortable seating", "LED wristband included"] },
    { name: "Floor Standing", price: 249, desc: "Closest to Stage", tag: "HOT", features: ["Floor level access", "Near the stage", "LED wristband included"] },
    { name: "Infinity Station", price: 495, desc: "VIP Experience", tag: "VIP", features: ["Premium lounge", "Exclusive merch", "Early venue access"] },
  ];

  const faqs = [
    { question: "When is Coldplay touring Europe in 2026?", answer: "Coldplay's Music of the Spheres World Tour returns to Europe in June-July 2026 with confirmed dates in London (Wembley), Paris, Berlin, Barcelona, and Milan. More dates may be added." },
    { question: "How much are Coldplay tickets?", answer: "Coldplay tickets on EuroMatchTickets start from €69 for general admission. Category A from €149, floor standing from €249, and VIP Infinity Station from €495." },
    { question: "Are Coldplay tickets still available?", answer: "Yes! While official tickets sold out quickly, we have verified resale tickets for all European dates. New tickets are added daily from our network of verified sellers." },
    { question: "What makes Coldplay concerts special?", answer: "Coldplay concerts feature LED wristbands for every fan, creating stunning synchronized light shows. The 'Music of the Spheres' production includes giant inflatable planets, confetti cannons, and Chris Martin's incredible audience interaction." },
  ];

  const reviewSchema = {
    "@context": "https://schema.org", "@type": "Product",
    "name": "Coldplay European Tour 2026 Tickets",
    "brand": { "@type": "Brand", "name": "EuroMatchTickets" },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "3456", "bestRating": "5", "worstRating": "1" },
    "review": [
      { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Laura B." }, "reviewBody": "Best concert I've ever been to! The LED wristbands were magical. Got my tickets cheaper than anywhere else!", "datePublished": "2026-01-25" }
    ],
    "offers": { "@type": "AggregateOffer", "priceCurrency": "EUR", "lowPrice": "69", "highPrice": "495", "offerCount": "2400" }
  };

  return (
    <div className="min-h-screen bg-[#050520]" data-testid="coldplay-page">
      <SEOHead title="Coldplay Tickets Europe 2026 | Tour from €69" description="Buy Coldplay European tour 2026 tickets from €69. London, Paris, Berlin, Barcelona, Milan. Music of the Spheres. Verified sellers, instant QR delivery!" canonicalUrl="https://euromatchtickets.com/coldplay-tour-2026" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: "https://euromatchtickets.com" }, { name: "Concerts", url: "https://euromatchtickets.com/events?type=concert" }, { name: "Coldplay Tour 2026", url: "https://euromatchtickets.com/coldplay-tour-2026" }]} />

      {/* Hero - Cosmic / Spheres theme */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a40] via-[#050520] to-[#050520]" />
        <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-purple-500/10 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[30%] w-56 h-56 rounded-full bg-yellow-500/5 blur-[90px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs font-bold mb-6 backdrop-blur-md">
            <Globe className="w-4 h-4" /> MUSIC OF THE SPHERES WORLD TOUR
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-3 leading-[0.85]">
            <span className="bg-gradient-to-r from-cyan-300 via-yellow-300 to-pink-400 bg-clip-text text-transparent">COLDPLAY</span>
            <span className="block text-white/60 text-2xl sm:text-3xl mt-3 font-light tracking-wide">European Tour 2026</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">6 Cities. 10 Nights. LED Wristbands. Giant Planets. Confetti. An unforgettable cosmic experience.</p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">From</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-yellow-300 bg-clip-text text-transparent">&euro;69</p>
            </div>
            <Link to="#tickets">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg" data-testid="coldplay-hero-cta">
                <Ticket className="w-5 h-5 mr-2" /> Get Coldplay Tickets
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/40">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> FanProtect Guarantee</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Instant QR Delivery</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400" /> 4.9/5 (3,456 Reviews)</span>
          </div>
        </div>
      </section>

      {/* Tour Dates */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-cyan-400" /> Coldplay European Tour Dates 2026</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shows.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{s.date}</span>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${s.badge}`}>{s.status}</span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{s.venue}, {s.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Ticket className="w-5 h-5 text-cyan-400" /> Ticket Options</h2>
        <div className="space-y-3">
          {packages.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`coldplay-ticket-${i}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{t.name}</h3>
                  {t.tag && <span className="text-[10px] font-bold bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full">{t.tag}</span>}
                </div>
                <p className="text-slate-500 text-sm">{t.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">{t.features.map((f, j) => <span key={j} className="text-[11px] text-slate-400 flex items-center gap-1"><Check className="w-3 h-3 text-cyan-500" />{f}</span>)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><p className="text-2xl font-extrabold text-white">&euro;{t.price}</p><p className="text-[10px] text-slate-500">per ticket</p></div>
                <Link to={`/checkout?event=coldplay&category=${encodeURIComponent(t.name)}&price=${t.price}`}><Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6">Buy</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-white mb-4">FAQ - Coldplay Tour Tickets</h2>
        <FAQStructuredData faqs={faqs} />
        <div className="space-y-2">{faqs.map((f, i) => (
          <details key={i} className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <summary className="p-4 font-bold text-sm text-white cursor-pointer list-none flex items-center justify-between">{f.question}<ChevronRight className="w-4 h-4 text-slate-500 group-open:rotate-90 transition-transform" /></summary>
            <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
          </details>
        ))}</div>
      </section>

      {/* Link Wheel */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-bold text-white mb-4">More Concerts & Events</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ to: "/taylor-swift-london-tickets", label: "Taylor Swift", price: "89" }, { to: "/the-weeknd-tour-2026", label: "The Weeknd", price: "65" }, { to: "/bruno-mars-tour-2026", label: "Bruno Mars", price: "69" }, { to: "/metallica-sphere-las-vegas-tickets", label: "Metallica", price: "195" }, { to: "/champions-league-tickets", label: "Champions League", price: "49" }, { to: "/f1-tickets", label: "F1 Tickets", price: "59" }, { to: "/world-cup-2026", label: "World Cup 2026", price: "65" }, { to: "/harry-styles-tickets", label: "Harry Styles", price: "65" }].map((l, i) => (
            <Link key={i} to={l.to} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all"><p className="font-bold text-white text-sm">{l.label}</p><p className="text-cyan-400 text-xs font-bold mt-1">From &euro;{l.price}</p></Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
        <h2 className="text-xl font-bold text-white">Buy Coldplay European Tour 2026 Tickets - All Dates Available</h2>
        <p className="text-slate-400 leading-relaxed">Coldplay's <strong>Music of the Spheres World Tour</strong> returns to Europe in 2026 with spectacular shows in London, Paris, Berlin, Barcelona and Milan. EuroMatchTickets has verified tickets from <strong>&euro;69</strong> with instant QR delivery. The show features LED wristbands for every fan, giant inflatable planets, lasers, and Chris Martin's legendary stage presence. Don't miss the biggest concert tour of 2026!</p>
      </section>
    </div>
  );
};

export default ColdplayPage;
