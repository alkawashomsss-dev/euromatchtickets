import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Bell, TrendingDown, Ticket, ArrowRight, ExternalLink, Crown, Shield, Zap, Star, Play, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";

const SOCIALS = [
  { name: "TikTok", handle: "@euromatchtickets", url: "https://tiktok.com/@euromatchtickets", color: "bg-black", followers: "12.4K", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" },
  { name: "Instagram", handle: "@euromatchtickets", url: "https://instagram.com/euromatchtickets", color: "bg-gradient-to-br from-purple-600 to-pink-500", followers: "8.2K", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" },
  { name: "YouTube", handle: "EuroMatchTickets", url: "https://youtube.com/@euromatchtickets", color: "bg-red-600", followers: "3.1K", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" },
  { name: "Twitter/X", handle: "@euromatchtickets", url: "https://x.com/euromatchtickets", color: "bg-black", followers: "5.6K", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" }
];

const UPCOMING = [
  { name: "Belgian Grand Prix 2026", date: "2026-08-30T14:00:00Z", category: "F1", price: 109, slug: "/f1-belgian-grand-prix-spa-tickets", hot: true },
  { name: "Champions League Final", date: "2026-05-30T20:00:00Z", category: "Football", price: 295, slug: "/champions-league-final-tickets", hot: true },
  { name: "Taylor Swift Wembley", date: "2026-06-15T19:00:00Z", category: "Concert", price: 89, slug: "/taylor-swift-london-tickets-2026", hot: false },
  { name: "Monaco Grand Prix", date: "2026-05-24T14:00:00Z", category: "F1", price: 195, slug: "/monaco-grand-prix-tickets", hot: false },
  { name: "El Clasico", date: "2026-04-12T20:00:00Z", category: "Football", price: 195, slug: "/el-clasico-tickets", hot: false }
];

const TIKTOK_VIDEOS = [
  { title: "Prices going crazy for Spa F1", views: "45.2K", thumb: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/03cb988b681379676e5183e69496cf05444643ba3dbafda8cf5cbb6915ca1eb6.png" },
  { title: "Inside VIP F1 experience", views: "32.8K", thumb: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/4ccc649fab606fb509de0ae1038444e173f0f74ad318c6dbc506c19a65640cae.png" },
  { title: "Why tickets sell out fast", views: "28.1K", thumb: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png" }
];

const CountdownUnit = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-black text-white tabular-nums bg-white/5 rounded-none px-3 py-2 border border-white/10">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-[10px] text-white/30 uppercase mt-1 tracking-widest">{label}</div>
  </div>
);

const SocialHubPage = () => {
  const [liveViewers, setLiveViewers] = useState(0);
  const [countdowns, setCountdowns] = useState({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setLiveViewers(Math.floor(Math.random() * 40) + 15);
    const vi = setInterval(() => setLiveViewers(v => Math.max(8, v + (Math.random() > 0.5 ? 1 : -1))), 6000);

    const tick = () => {
      const now = new Date();
      const cds = {};
      UPCOMING.forEach(ev => {
        const diff = new Date(ev.date) - now;
        if (diff > 0) {
          cds[ev.name] = {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            mins: Math.floor((diff % 3600000) / 60000),
            secs: Math.floor((diff % 60000) / 1000)
          };
        }
      });
      setCountdowns(cds);
    };
    tick();
    const ci = setInterval(tick, 1000);
    return () => { clearInterval(vi); clearInterval(ci); };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  // Next event
  const nextEvent = UPCOMING.reduce((closest, ev) => {
    const diff = new Date(ev.date) - new Date();
    const cDiff = new Date(closest.date) - new Date();
    return (diff > 0 && diff < cDiff) ? ev : closest;
  }, UPCOMING[0]);
  const nextCD = countdowns[nextEvent.name] || { days: 0, hours: 0, mins: 0, secs: 0 };

  return (
    <div className="min-h-screen bg-[#09090b]" data-testid="social-hub-page">
      <SEOHead
        title="EuroMatchTickets Social Hub | Follow for Price Drops"
        description="Follow EuroMatchTickets on TikTok, Instagram and YouTube for exclusive ticket deals, price drop alerts, and VIP experience previews. Join 30K+ followers."
      />

      {/* ═══ HERO ═══ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Live badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-6">
            <span className="flex items-center gap-2 bg-[#e10600]/100/20 border border-red-500/30 text-red-400 text-sm font-bold px-4 py-2 rounded-full" data-testid="live-viewers">
              <span className="w-2.5 h-2.5 bg-[#e10600]/100 rounded-full animate-pulse" />
              {liveViewers} people viewing right now
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4">
            Follow for <span className="text-amber-400">Price Drops</span>
          </motion.h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
            Be the first to know when prices drop. Exclusive deals, VIP previews, and last-minute tickets — only for followers.
          </p>

          {/* Social Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12" data-testid="social-links">
            {SOCIALS.map((s, i) => (
              <motion.a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="group block bg-white/[0.04] border border-white/10 hover:border-amber-500/40 rounded-none p-5 text-center transition-all hover:bg-white/[0.06]"
                data-testid={`social-${s.name.toLowerCase()}`}>
                <div className={`w-12 h-12 ${s.color} rounded-none flex items-center justify-center mx-auto mb-3`}>
                  <img src={s.icon} alt={s.name} className="w-6 h-6 invert" loading="lazy" />
                </div>
                <h3 className="text-white font-bold text-sm">{s.name}</h3>
                <p className="text-white/30 text-xs mb-2">{s.handle}</p>
                <p className="text-amber-400 font-bold text-sm">{s.followers} followers</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-amber-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Follow <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEXT EVENT COUNTDOWN ═══ */}
      <section className="py-16 bg-gradient-to-b from-white/[0.02] to-transparent" data-testid="countdown-section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-amber-500/100/20 text-amber-400 border-amber-500/30 mb-4">
            <Clock className="w-3 h-3 mr-1" /> Next Big Event
          </Badge>
          <h2 className="text-3xl font-black text-white mb-2">{nextEvent.name}</h2>
          <p className="text-white/30 mb-8">Tickets from &euro;{nextEvent.price} &bull; Selling fast</p>

          <div className="flex justify-center gap-4 md:gap-6 mb-8">
            <CountdownUnit value={nextCD.days} label="Days" />
            <div className="text-2xl text-white/20 self-start mt-3">:</div>
            <CountdownUnit value={nextCD.hours} label="Hours" />
            <div className="text-2xl text-white/20 self-start mt-3">:</div>
            <CountdownUnit value={nextCD.mins} label="Min" />
            <div className="text-2xl text-white/20 self-start mt-3">:</div>
            <CountdownUnit value={nextCD.secs} label="Sec" />
          </div>

          <Link to={nextEvent.slug}>
            <Button size="lg" className="bg-amber-500/100 hover:bg-amber-400 text-black font-black px-8 py-5 text-lg rounded-none shadow-lg shadow-amber-500/20">
              <Ticket className="w-5 h-5 mr-2" /> Get Tickets Now
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ ALL UPCOMING EVENTS ═══ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-500" /> Upcoming Events — Price Drop Alerts
          </h2>
          <div className="space-y-3">
            {UPCOMING.map((ev, i) => {
              const cd = countdowns[ev.name];
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.03] border border-white/10 hover:border-amber-500/30 rounded-none p-4 transition-all group"
                  data-testid={`event-${i}`}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className={`w-10 h-10 rounded-none flex items-center justify-center text-xs font-black ${
                      ev.category === 'F1' ? 'bg-[#e10600]/100/20 text-red-400' :
                      ev.category === 'Football' ? 'bg-blue-500/100/20 text-blue-400' :
                      'bg-purple-500/100/20 text-purple-400'
                    }`}>{ev.category === 'F1' ? 'F1' : ev.category === 'Football' ? 'FB' : 'MU'}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-sm">{ev.name}</h3>
                        {ev.hot && <Badge className="bg-[#e10600]/100/20 text-red-400 text-[9px]">HOT</Badge>}
                      </div>
                      {cd && <p className="text-white/20 text-xs">{cd.days}d {cd.hours}h {cd.mins}m remaining</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-white/20">From</p>
                      <p className="text-lg font-black text-white">&euro;{ev.price}</p>
                    </div>
                    <Link to={ev.slug}>
                      <Button size="sm" className="bg-amber-500/100/20 hover:bg-amber-500/100 text-amber-400 hover:text-black font-bold rounded-none transition-all">
                        Buy <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TIKTOK CONTENT PREVIEW ═══ */}
      <section className="py-16" data-testid="tiktok-section">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-white" /> Latest on TikTok
            </h2>
            <a href="https://tiktok.com/@euromatchtickets" target="_blank" rel="noopener noreferrer"
              className="text-amber-400 text-sm font-bold flex items-center gap-1 hover:underline">
              Follow <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TIKTOK_VIDEOS.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative aspect-[9/14] rounded-none overflow-hidden group cursor-pointer border border-white/10">
                <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-xs leading-tight">{v.title}</p>
                  <p className="text-white/40 text-[10px] mt-1 flex items-center gap-1"><Play className="w-2.5 h-2.5" /> {v.views} views</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICE DROP ALERT CTA ═══ */}
      <section className="py-16 bg-gradient-to-b from-amber-500/5 to-transparent" data-testid="price-drop-cta">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Bell className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Get Price Drop Alerts</h2>
          <p className="text-white/40 mb-6">Join our community. First to know when prices drop. Unsubscribe anytime.</p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto" data-testid="subscribe-form">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 bg-white/5 border border-white/10 rounded-none px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50" />
              <Button type="submit" className="bg-amber-500/100 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-none" data-testid="subscribe-btn">
                <Bell className="w-4 h-4 mr-1" /> Subscribe
              </Button>
            </form>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-emerald-500/100/20 border border-emerald-500/30 rounded-none p-4 max-w-md mx-auto" data-testid="subscribed-msg">
              <p className="text-emerald-400 font-bold">You're in! We'll notify you of price drops.</p>
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-[11px] text-white/20">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> No spam, ever</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Instant alerts</span>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Exclusive deals</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialHubPage;
