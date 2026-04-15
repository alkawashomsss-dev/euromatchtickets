import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, ChevronLeft, ChevronRight, Flame, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Justin Bieber",
    subtitle: "Johan Cruijff ArenA, Amsterdam",
    date: "2026-07-18T20:00:00+02:00",
    price: "89",
    link: "/justin-bieber-amsterdam-2026-tickets",
    gradient: "from-purple-600 via-violet-600 to-indigo-700",
    accent: "text-purple-400",
    badge: "73% Sold",
    image: "https://images.unsplash.com/photo-1770067665792-9975acdec4fb?w=1200",
  },
  {
    title: "Taylor Swift",
    subtitle: "The Eras Tour 2026 – Wembley",
    date: "2026-06-19T18:00:00+01:00",
    price: "89",
    link: "/taylor-swift-wembley-2026-tickets",
    gradient: "from-pink-600 via-purple-600 to-violet-700",
    accent: "text-pink-400",
    badge: "6 Nights",
    image: "https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/6abbdd7a05846d21824781f9c8f6e515efcd3ce88e98a77c9e1039bf33a5cbc9.png",
  },
  {
    title: "FIFA World Cup",
    subtitle: "USA • Canada • Mexico",
    date: "2026-06-11T20:00:00-04:00",
    price: "149",
    link: "/world-cup-2026",
    gradient: "from-amber-600 via-yellow-600 to-amber-700",
    accent: "text-amber-400",
    badge: "48 Teams",
    image: "https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/2f1bd8a0ce8c928102711721120988ddfef9664d60a034592fbff3227a090028.png",
  },
];

const useCountdown = (target) => {
  const [diff, setDiff] = useState(new Date(target) - new Date());
  useEffect(() => { const t = setInterval(() => setDiff(new Date(target) - new Date()), 1000); return () => clearInterval(t); }, [target]);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return { d, h, m, s, isPast: diff <= 0 };
};

const FeaturedEventsCarousel = () => {
  const [idx, setIdx] = useState(0);
  const ev = events[idx];
  const cd = useCountdown(ev.date);

  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % events.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-10 sm:py-14" data-testid="featured-carousel">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#e10600] text-[10px] font-black uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4" /> HOTTEST EVENTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">DON'T MISS OUT</h2>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setIdx(p => (p - 1 + events.length) % events.length)} className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors duration-150" aria-label="Previous">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setIdx(p => (p + 1) % events.length)} className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors duration-150" aria-label="Next">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <Link to={ev.link} className="group block relative overflow-hidden h-[320px] sm:h-[380px]">
          <img src={ev.image} alt={ev.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <div className={`absolute inset-0 bg-gradient-to-r ${ev.gradient} opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
            <span className="bg-[#e10600] text-white text-[10px] font-black uppercase px-3 py-1 w-fit mb-3 tracking-wider">{ev.badge}</span>
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-1 uppercase tracking-tighter" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{ev.title}</h3>
            <p className="text-white/60 text-sm sm:text-base mb-5">{ev.subtitle}</p>

            <div className="flex flex-wrap items-end gap-6">
              {/* Countdown */}
              <div className="flex gap-1.5">
                {[{ v: cd.d, l: "D" }, { v: cd.h, l: "H" }, { v: cd.m, l: "M" }, { v: cd.s, l: "S" }].map((u, i) => (
                  <div key={i} className="bg-black/60 border border-white/10 px-2.5 py-1.5 text-center min-w-[44px]">
                    <span className="text-lg font-black text-white">{String(u.v).padStart(2, '0')}</span>
                    <span className="text-[9px] text-white/40 ml-0.5 font-bold">{u.l}</span>
                  </div>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">From</div>
                  <div className="text-3xl font-black text-white">&euro;{ev.price}</div>
                </div>
                <div className="w-12 h-12 bg-[#e10600] flex items-center justify-center group-hover:bg-red-700 transition-colors duration-150">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {events.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-1 transition-all duration-150 ${i === idx ? 'bg-[#e10600] w-8' : 'bg-white/15 hover:bg-white/30 w-6'}`} aria-label={`Go to slide ${i+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsCarousel;
