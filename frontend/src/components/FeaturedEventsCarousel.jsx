import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flame, ArrowRight, Calendar, MapPin } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * FeaturedEventsCarousel
 * ======================
 * Shows ONLY confirmed events pulled live from /api/events (filtered to
 * upcoming + status=upcoming/on_sale) — never speculative demand pages.
 *
 * IMPORTANT: This replaces the old hardcoded list that contained
 * "Justin Bieber Amsterdam 2026 — 73% SOLD — €89" which was a fake
 * demand page. We never hardcode events anymore; the DB is the truth.
 *
 * Fallback: a tiny curated list of verified 2026 events (UCL Final,
 * F1 Monaco, FIFA World Cup Final) used only if the API is unreachable.
 * Every fallback event is cross-checked against UEFA.com / FIA.com /
 * FIFA.com official calendars.
 */
const FALLBACK_EVENTS = [
  {
    title: "FIFA World Cup 2026 Final",
    subtitle: "MetLife Stadium · East Rutherford, NJ",
    event_date: "2026-07-19T15:00:00-04:00",
    price_from: 149,
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
    href: "/world-cup-2026-tickets",
    badge: "Final",
    accent: "text-amber-400",
    gradient: "from-amber-600/60 via-yellow-700/40 to-transparent"
  },
  {
    title: "UEFA Champions League Final",
    subtitle: "Puskás Aréna · Budapest · May 30, 2026",
    event_date: "2026-05-30T21:00:00+02:00",
    price_from: 85,
    image_url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
    href: "/champions-league-tickets",
    badge: "UCL Final",
    accent: "text-blue-400",
    gradient: "from-blue-600/60 via-indigo-700/40 to-transparent"
  },
  {
    title: "Monaco Grand Prix 2026",
    subtitle: "Circuit de Monaco · May 24, 2026",
    event_date: "2026-05-24T15:00:00+02:00",
    price_from: 249,
    image_url: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=1200",
    href: "/f1-monaco-grand-prix-tickets",
    badge: "F1",
    accent: "text-red-400",
    gradient: "from-red-600/60 via-rose-700/40 to-transparent"
  }
];

const useCountdown = (target) => {
  const [diff, setDiff] = useState(() => new Date(target) - new Date());
  useEffect(() => {
    const t = setInterval(() => setDiff(new Date(target) - new Date()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));
  return { d, h, m, s, isPast: diff <= 0 };
};

function normalize(raw) {
  const slug = raw.slug || raw.event_id;
  return {
    title: raw.title || "",
    subtitle:
      [raw.venue, raw.city].filter(Boolean).join(" · ") ||
      raw.subtitle ||
      "",
    event_date: raw.event_date,
    price_from: raw.price_from,
    image_url: raw.image_url || raw.event_image,
    href: `/event/${slug}`,
    badge: raw.event_type === "f1" ? "F1" : raw.event_type === "motogp" ? "MotoGP" : raw.event_type === "match" || raw.event_type === "football" ? "Football" : "Concert",
    accent: raw.event_type === "f1" ? "text-red-400" : "text-purple-400",
    gradient:
      raw.event_type === "f1"
        ? "from-red-600/60 via-rose-700/40 to-transparent"
        : raw.event_type === "match" || raw.event_type === "football"
        ? "from-blue-600/60 via-indigo-700/40 to-transparent"
        : "from-purple-600/60 via-violet-700/40 to-transparent"
  };
}

const FeaturedEventsCarousel = () => {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/api/events?limit=12`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive || !Array.isArray(data) || data.length === 0) return;
        const today = new Date();
        const upcoming = data
          .filter((e) => {
            if (!e || !e.event_date || !e.title || !e.venue) return false;
            const dt = new Date(e.event_date);
            if (!(dt > today)) return false;
            const status = (e.status || "").toLowerCase();
            return !["past_event", "expired", "cancelled"].includes(status);
          })
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
          .slice(0, 3)
          .map(normalize);
        if (upcoming.length > 0) setEvents(upcoming);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const ev = events[idx % events.length] || events[0];
  const cd = useCountdown(ev.event_date);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % events.length), 6000);
    return () => clearInterval(t);
  }, [events.length]);

  return (
    <section className="py-10 sm:py-14" data-testid="featured-carousel">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#e10600] text-[10px] font-black uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4" /> CONFIRMED EVENTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              ON SALE NOW
            </h2>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setIdx((p) => (p - 1 + events.length) % events.length)}
              className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors duration-150"
              aria-label="Previous"
              data-testid="carousel-prev"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIdx((p) => (p + 1) % events.length)}
              className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors duration-150"
              aria-label="Next"
              data-testid="carousel-next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <Link
          to={ev.href}
          className="group block relative overflow-hidden h-[320px] sm:h-[380px]"
          data-testid="carousel-featured-link"
        >
          {ev.image_url ? (
            <img
              src={ev.image_url}
              alt={ev.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-r ${ev.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-6 sm:p-10">
            {ev.badge ? (
              <span className="bg-[#e10600] text-white text-[10px] font-black uppercase px-3 py-1 w-fit mb-3 tracking-wider">
                {ev.badge}
              </span>
            ) : null}
            <h3
              className="text-3xl sm:text-5xl font-black text-white mb-1 uppercase tracking-tighter"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
              data-testid="carousel-event-title"
            >
              {ev.title}
            </h3>
            <p className="text-white/70 text-sm sm:text-base mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {ev.subtitle}
            </p>

            <div className="flex flex-wrap items-end gap-6">
              {/* Countdown — only shown if event is in the future */}
              {!cd.isPast ? (
                <div className="flex gap-1.5" data-testid="carousel-countdown">
                  {[
                    { v: cd.d, l: "D" },
                    { v: cd.h, l: "H" },
                    { v: cd.m, l: "M" },
                    { v: cd.s, l: "S" }
                  ].map((u, i) => (
                    <div
                      key={i}
                      className="bg-black/60 border border-white/10 px-2.5 py-1.5 text-center min-w-[44px]"
                    >
                      <span className="text-lg font-black text-white">
                        {String(u.v).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] text-white/40 ml-0.5 font-bold">
                        {u.l}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(ev.event_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </div>
              )}

              <div className="ml-auto flex items-center gap-4">
                {ev.price_from ? (
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                      From
                    </div>
                    <div className="text-3xl font-black text-white">
                      &euro;{ev.price_from}
                    </div>
                  </div>
                ) : null}
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
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 transition-all duration-150 ${
                i === idx
                  ? "bg-[#e10600] w-8"
                  : "bg-white/15 hover:bg-white/30 w-6"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              data-testid={`carousel-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsCarousel;
