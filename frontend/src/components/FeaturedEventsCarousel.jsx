import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ticket, ChevronLeft, ChevronRight, Flame, ArrowRight } from "lucide-react";

const events = [
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
    title: "Super Bowl LX",
    subtitle: "Levi's Stadium, Santa Clara",
    date: "2026-02-08T18:00:00-05:00",
    price: "899",
    link: "/super-bowl-2026-tickets",
    gradient: "from-red-700 via-red-600 to-amber-700",
    accent: "text-red-400",
    badge: "VIP Available",
    image: "https://static.prod-images.emergentagent.com/jobs/4a0723d8-569f-4f37-a12d-b96fbae88e33/images/45944c725832f3a437f2bc805d12a6b4a19fae5d783c15acc66d1ce2f243ec58.png",
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
    <section className="py-12 sm:py-16" data-testid="featured-carousel">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4" /> Hottest Events
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Don't Miss Out</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIdx(p => (p - 1 + events.length) % events.length)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition" aria-label="Previous">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setIdx(p => (p + 1) % events.length)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition" aria-label="Next">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <Link to={ev.link} className="group block relative rounded-3xl overflow-hidden h-[340px] sm:h-[380px] transition-transform hover:scale-[1.005]">
          <img src={ev.image} alt={ev.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div className={`absolute inset-0 bg-gradient-to-r ${ev.gradient} opacity-60`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full w-fit mb-3">{ev.badge}</span>
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-1" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{ev.title}</h3>
            <p className="text-white/70 text-sm sm:text-base mb-5">{ev.subtitle}</p>

            <div className="flex flex-wrap items-end gap-6">
              {/* Countdown */}
              <div className="flex gap-2">
                {[{ v: cd.d, l: "d" }, { v: cd.h, l: "h" }, { v: cd.m, l: "m" }, { v: cd.s, l: "s" }].map((u, i) => (
                  <div key={i} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1.5 text-center min-w-[44px]">
                    <span className="text-lg font-black text-white">{String(u.v).padStart(2, '0')}</span>
                    <span className="text-[9px] text-white/50 ml-0.5">{u.l}</span>
                  </div>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">From</div>
                  <div className={`text-3xl font-black text-white`}>&euro;{ev.price}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {events.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/40'}`} aria-label={`Go to slide ${i+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsCarousel;
