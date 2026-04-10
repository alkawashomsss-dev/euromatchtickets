import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Trophy, Star, Shield, Users, TrendingUp, Zap, Flag, Ticket, Crown, Wine, Utensils, Eye, Check, Clock, AlertTriangle, Play, ChevronRight, Lock, Heart, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const SpaGPPage = () => {
  const [liveViewers, setLiveViewers] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    setLiveViewers(Math.floor(Math.random() * 30) + 18);
    const vi = setInterval(() => setLiveViewers(v => v + (Math.random() > 0.5 ? 1 : -1)), 8000);

    const raceDate = new Date("2026-08-30T14:00:00Z");
    const tick = () => {
      const diff = raceDate - new Date();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          mins: Math.floor((diff % 3600000) / 60000),
          secs: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    tick();
    const ci = setInterval(tick, 1000);
    return () => { clearInterval(vi); clearInterval(ci); };
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Belgian Grand Prix 2026 Spa-Francorchamps",
    "description": "Buy Belgian Grand Prix 2026 tickets at Spa-Francorchamps. Eau Rouge, Raidillon, Paddock Club VIP. Cheapest prices in Europe.",
    "startDate": "2026-08-30",
    "endDate": "2026-08-31",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png",
    "location": {
      "@type": "Place",
      "name": "Circuit de Spa-Francorchamps",
      "address": { "@type": "PostalAddress", "addressLocality": "Spa", "addressCountry": "BE" }
    },
    "performer": { "@type": "SportsTeam", "name": "Formula 1 - FIA" },
    "organizer": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" },
    "offers": {
      "@type": "AggregateOffer", "priceCurrency": "EUR",
      "offerCount": "687", "lowPrice": "109", "highPrice": "3489",
      "availability": "https://schema.org/InStock",
      "url": "https://euromatchtickets.com/f1-belgian-grand-prix-spa-tickets",
      "validFrom": "2025-01-01"
    }
  };

  const tickets = [
    { section: "General Admission", desc: "Roam the circuit freely, multiple screens", price: 109, originalPrice: 189, available: 345, badge: null, hot: false },
    { section: "Silver (La Source Turn 1)", desc: "Watch dramatic braking into T1 hairpin", price: 189, originalPrice: 269, available: 134, badge: null, hot: false },
    { section: "Gold 3 (Eau Rouge)", desc: "The most legendary corner in motorsport", price: 259, originalPrice: 399, available: 89, badge: "ICONIC", hot: true },
    { section: "Gold 4 (Raidillon)", desc: "Feel the G-force as cars fly uphill at 300km/h", price: 289, originalPrice: 429, available: 67, badge: "BEST VALUE", hot: true },
    { section: "Gold 1 (Bus Stop Chicane)", desc: "Overtaking hotspot, closest to podium", price: 249, originalPrice: 369, available: 112, badge: null, hot: false },
  ];

  const vipPackages = [
    { name: "VIP Hospitality Lounge", price: 1189, originalPrice: 1899, spots: 38, includes: ["Covered grandstand seat", "Champagne reception", "3-course lunch", "Open bar all day", "Big screen in lounge", "Circuit access"] },
    { name: "Paddock Club Experience", price: 3489, originalPrice: 5499, spots: 14, includes: ["Pit lane walk", "Paddock access", "Meet F1 drivers", "Michelin-star dining", "Premium open bar", "Exclusive terrace above pits", "Guided garage tour", "Commemorative gift"] },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="spa-gp-page">
      <SEOHead
        title="Spa F1 Tickets 2026 | Belgian GP from €109"
        description="Buy Belgian Grand Prix 2026 Spa-Francorchamps tickets from €109. Legendary Eau Rouge, Raidillon grandstands, Paddock Club VIP. Cheapest in Europe. Instant QR delivery."
        image="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="spa-hero">
        <div className="absolute inset-0">
          <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
            alt="Spa-Francorchamps F1 Circuit Aerial View" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
          {/* Live badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE: {liveViewers} people viewing
            </span>
            <span className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3 h-3" /> Selling Fast
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4 text-sm">
              <Trophy className="w-4 h-4 mr-2" /> The Legendary Spa-Francorchamps
            </Badge>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-3 leading-tight" data-testid="spa-h1">
              Belgian Grand Prix 2026
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-2">Spa-Francorchamps &bull; Belgium &bull; August 28-30</p>
            <p className="text-lg text-white/40 max-w-2xl mb-8">
              The longest and most dramatic circuit in F1. Conquer Eau Rouge, survive Raidillon,
              and witness 300km/h battles through the Belgian Ardennes.
            </p>
          </motion.div>

          {/* Price + Countdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap items-end gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1">Tickets from</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white">&euro;109</span>
                <span className="text-xl text-white/30 line-through">&euro;189</span>
              </div>
              <p className="text-emerald-400 text-sm font-bold mt-1">Save 42% vs competitors</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <p className="text-white/40 text-sm mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Race starts in</p>
              <div className="flex gap-3">
                {[["days", countdown.days], ["hrs", countdown.hours], ["min", countdown.mins], ["sec", countdown.secs]].map(([label, val]) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black text-white tabular-nums">{String(val).padStart(2, '0')}</div>
                    <div className="text-[10px] text-white/30 uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
            <a href="#tickets">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/30" data-testid="spa-buy-cta">
                <Ticket className="w-5 h-5 mr-2" /> Buy Spa F1 Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-bold px-8 py-6 text-lg rounded-xl" data-testid="spa-vip-cta">
                <Crown className="w-5 h-5 mr-2" /> Upgrade to Paddock Club
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-4 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm">
          {[
            [Shield, "100% Money-Back Guarantee"],
            [Star, "4.9/5 from 12,847 Reviews"],
            [Zap, "Instant QR Delivery"],
            [Lock, "Secure Checkout"],
            [Users, "2.4M+ Tickets Sold"],
          ].map(([Icon, text], i) => (
            <div key={i} className="flex items-center gap-2 text-slate-600"><Icon className="w-4 h-4 text-emerald-600" />{text}</div>
          ))}
        </div>
      </section>

      {/* ═══ VIDEO SECTION ═══ */}
      <section className="py-16 bg-[#0a0a0f]" data-testid="spa-video-section">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-3"><Play className="w-3 h-3 mr-1" /> Watch</Badge>
            <h2 className="text-3xl font-black text-white">Experience Spa-Francorchamps</h2>
            <p className="text-white/40 mt-2">The most challenging 7km of tarmac in the world</p>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {!showVideo ? (
              <div className="relative w-full h-full cursor-pointer group" onClick={() => setShowVideo(true)}>
                <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png"
                  alt="Spa F1 Circuit" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 transition-transform group-hover:scale-110">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-lg">
                  Spa F1 Circuit Tour &bull; 2:30
                </div>
              </div>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/KVE_WIpZs7Q?autoplay=1&rel=0"
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Spa-Francorchamps F1 Circuit Tour"
              />
            )}
          </div>
        </div>
      </section>

      {/* ═══ TICKETS ═══ */}
      <section className="py-16" id="tickets" data-testid="spa-tickets-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Spa F1 2026 Tickets</h2>
              <p className="text-slate-500 mt-1">687 tickets remaining &bull; Prices updating live</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> 42% cheaper than competitors
            </div>
          </div>

          <div className="grid gap-3">
            {tickets.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`flex flex-col md:flex-row md:items-center justify-between bg-white border rounded-2xl p-5 transition-all hover:shadow-lg group ${t.hot ? 'border-amber-300 shadow-sm' : 'border-slate-100'}`}
                data-testid={`spa-ticket-${i}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${t.hot ? 'bg-amber-500/20' : 'bg-slate-100'}`}>
                    <Flag className={`w-6 h-6 ${t.hot ? 'text-amber-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{t.section}</h3>
                      {t.badge && <Badge className="bg-amber-100 text-amber-700 text-[10px]">{t.badge}</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {t.available < 100 && (
                    <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {t.available} left
                    </span>
                  )}
                  <div className="text-right">
                    <div className="text-xs text-slate-400 line-through">&euro;{t.originalPrice}</div>
                    <div className="text-2xl font-black text-slate-900">&euro;{t.price}</div>
                  </div>
                  <Link to="/events?type=f1">
                    <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 group-hover:shadow-lg group-hover:shadow-amber-500/20 transition-all">
                      Buy Now <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIP EXPERIENCE AT SPA ═══ */}
      <section className="py-20 bg-[#0c0a14]" id="vip" data-testid="spa-vip-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              <Crown className="w-4 h-4 mr-2" /> Premium Experience
            </Badge>
            <h2 className="text-4xl font-black text-white mb-3">VIP Experience at Spa</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Walk the pit lane. Meet the drivers. Dine like royalty above the world's greatest circuit.
            </p>
          </div>

          {/* VIP Gallery */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl overflow-hidden aspect-[16/10]">
              <img src="https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/4ccc649fab606fb509de0ae1038444e173f0f74ad318c6dbc506c19a65640cae.png"
                alt="Spa F1 Paddock Club VIP" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png", label: "Paddock Club Lounge" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/d84430a95323b820d9a6d93e1758ca35eab8a9f595c089743ffc70391dc84381.png", label: "Pit Lane Walk" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Michelin Dining" },
                { img: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/ab1e7b7e008b41b5dbc14a24bb83e208c440cb11a06103486f0c7e2e7936e0d3.png", label: "Trackside Terrace" },
              ].map((item, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-2 left-2 text-white text-xs font-bold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Perks Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {[
              { icon: Eye, title: "Paddock Club Views", desc: "Glass-front lounge directly above the pit lane at Spa", color: "text-red-500" },
              { icon: Utensils, title: "Michelin-Star Dining", desc: "Multi-course Belgian gourmet by world-class chefs", color: "text-amber-500" },
              { icon: Wine, title: "Premium Open Bar", desc: "Champagne, Belgian beers & finest spirits all day", color: "text-purple-500" },
              { icon: Flag, title: "Pit Lane Walk", desc: "Walk among the F1 cars before the race at Spa", color: "text-blue-500" },
              { icon: Users, title: "Driver Meet & Greet", desc: "Chance to meet F1 drivers in the Paddock Club", color: "text-emerald-500" },
              { icon: Heart, title: "Eau Rouge VIP Terrace", desc: "Exclusive viewing terrace overlooking the legendary corner", color: "text-pink-500" },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/5 rounded-xl p-4">
                <p.icon className={`w-5 h-5 ${p.color} mb-2`} />
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                <p className="text-white/30 text-[11px] mt-0.5 leading-snug">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* VIP Package Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {vipPackages.map((pkg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`rounded-2xl p-6 border ${i === 1 ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30' : 'bg-white/[0.03] border-white/10'}`}
                data-testid={`spa-vip-pkg-${i}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className={`w-5 h-5 ${i === 1 ? 'text-amber-400' : 'text-white/40'}`} />
                      <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                    </div>
                    {pkg.spots < 20 && (
                      <p className="text-red-400 text-xs font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Only {pkg.spots} spots remaining
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/30 line-through">&euro;{pkg.originalPrice.toLocaleString()}</div>
                    <div className="text-3xl font-black text-white">&euro;{pkg.price.toLocaleString()}</div>
                    <div className="text-emerald-400 text-xs font-bold">Save &euro;{(pkg.originalPrice - pkg.price).toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-5">
                  {pkg.includes.map((item, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Check className="w-3 h-3 text-amber-500 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>

                <Link to="/events?type=f1">
                  <Button className={`w-full font-black py-5 rounded-xl text-base ${i === 1 ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' : 'bg-white/10 hover:bg-white/15 text-white'}`}
                    data-testid={`spa-vip-buy-${i}`}>
                    {i === 1 ? (
                      <><Crown className="w-5 h-5 mr-2" /> Upgrade to Paddock Club</>
                    ) : (
                      <><Ticket className="w-5 h-5 mr-2" /> Book VIP Hospitality</>
                    )}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY SPA ═══ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Why Spa F1 is the Race of the Year</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Eau Rouge & Raidillon", desc: "The most legendary corner combination in motorsport. Cars hit 310km/h as they crest the blind rise. Heart-stopping every single lap.", icon: "🏁" },
              { title: "7.004km of Drama", desc: "The longest circuit on the F1 calendar. 19 corners through the Ardennes forest. Unpredictable weather creates chaos and epic racing.", icon: "🌧️" },
              { title: "History & Atmosphere", desc: "Racing since 1921. 100,000+ passionate fans from across Europe create an electric atmosphere that you feel in your bones.", icon: "🔥" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">What Fans Say About Spa F1</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Marco V.", loc: "Milan, Italy", text: "Eau Rouge in person is INSANE. The speed, the sound, the atmosphere. Best F1 race I've ever attended. EuroMatchTickets made it easy.", stars: 5 },
              { name: "Sophie L.", loc: "London, UK", text: "Paddock Club at Spa was worth every penny. Met Leclerc, amazing food, and the view from above the pits is unreal. Booking again for 2027!", stars: 5 },
              { name: "Thomas K.", loc: "Munich, Germany", text: "Cheapest Spa tickets I found anywhere. QR code arrived instantly. Gold 4 Raidillon seats were PERFECT. Could feel the cars fly past. 10/10.", stars: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-5">
                <div className="flex gap-0.5 mb-2">{[...Array(r.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400" fill="currentColor" />)}</div>
                <p className="text-slate-600 text-sm mb-3">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">{r.name[0]}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                    <p className="text-slate-400 text-xs">{r.loc}</p>
                  </div>
                  <Badge className="ml-auto bg-emerald-50 text-emerald-600 text-[10px]"><Check className="w-2.5 h-2.5 mr-0.5" /> Verified</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEO KEYWORDS ═══ */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4">People Also Search:</h3>
          <div className="flex flex-wrap gap-2">
            {["Spa F1 tickets 2026", "Belgian GP tickets", "Spa-Francorchamps tickets", "Eau Rouge grandstand",
              "F1 Belgium 2026", "Spa F1 Paddock Club", "Raidillon tickets", "Belgian Grand Prix VIP",
              "cheapest Spa F1 tickets", "Spa F1 general admission", "Belgium F1 camping",
              "Spa F1 weekend pass", "Formula 1 Spa 2026", "buy Spa F1 tickets online"].map((term, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-sm border border-slate-100 hover:border-amber-300 hover:text-amber-700 transition-colors cursor-default">{term}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-red-600 to-red-800" data-testid="spa-final-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Crown className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-4xl font-black text-white mb-3">Don't Just Watch. Experience Spa.</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            From &euro;109 general admission to &euro;3,489 Paddock Club. Every ticket includes FanProtect guarantee and instant QR delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tickets">
              <Button size="lg" className="bg-white text-black font-black px-10 py-6 text-lg rounded-xl hover:bg-amber-50 shadow-2xl" data-testid="spa-final-buy">
                <Ticket className="w-5 h-5 mr-2" /> Buy Spa F1 Tickets
              </Button>
            </a>
            <a href="#vip">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-xl" data-testid="spa-final-vip">
                <Crown className="w-5 h-5 mr-2" /> Upgrade to Paddock Club
              </Button>
            </a>
          </div>
          <p className="text-white/40 text-sm mt-6 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> 100% money-back guarantee if the event is cancelled
          </p>
        </div>
      </section>
    </div>
  );
};

export default SpaGPPage;
