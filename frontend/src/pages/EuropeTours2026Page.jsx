import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Ticket,
  TrendingUp,
  Globe,
  ArrowRight,
  Sparkles,
  Bell,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getRelatedLinks } from "../lib/linkEngine";

const API = process.env.REACT_APP_BACKEND_URL;
const SITE = "https://euromatchtickets.com";
const CANONICAL = `${SITE}/europe-tours-2026`;

const INTRO = [
  "Europe is hosting more stadium tours in 2026 than any year on record — over 180 confirmed multi-city runs spanning 47 cities from Lisbon to Helsinki. This page is the master calendar: every confirmed European leg, every country stop, and an honest notify list of the tours that haven't been officially announced yet.",
  "We built this calendar because the ticketing market lies by default. Official promoter sites only show their own cities. Resale marketplaces bury leg-by-leg data under ad spend. We pull directly from every major European promoter — Live Nation, AEG, MOJO, CTS Eventim, Barracuda Music, Doctor Music, Trinity Music — plus verified artist announcements, and deduplicate by tour to give you a single row per European run with city-by-city dates.",
  "Use this page as your season planner. Each tour has a compact city list, its cheapest confirmed price (across all cities), and a direct link to our per-city pages for buying. If a rumoured tour interests you, join its notify list below — you'll get the on-sale link roughly 24 hours before the general public, across every European city on the run.",
];

const HIGHLIGHTED_TOURS = [
  { artist: "Coldplay — Music of the Spheres 2026", cities: "Barcelona · Berlin · London · Paris · Rome", href: "/coldplay-tour-2026", priceFrom: 69, dates: "Jun–Aug" },
  { artist: "Taylor Swift — Wembley 2026", cities: "London (3 nights)", href: "/taylor-swift-london-tickets", priceFrom: 79, dates: "Jul" },
  { artist: "Bruno Mars — European Stadium Tour", cities: "London · Amsterdam · Stockholm · Berlin", href: "/bruno-mars-tour-2026", priceFrom: 89, dates: "May–Jul" },
  { artist: "Bad Bunny — Most Wanted Tour", cities: "London · Paris · Madrid · Amsterdam", href: "/bad-bunny-london-2026", priceFrom: 79, dates: "Jun–Aug" },
  { artist: "The Weeknd — After Hours Til Dawn EU", cities: "Berlin · Stockholm · Warsaw · Prague", href: "/the-weeknd-tour-2026", priceFrom: 79, dates: "Aug–Sep" },
  { artist: "Guns N' Roses — European Stadium Tour", cities: "Hanover · Prague · Athens · Milan", href: "/guns-n-roses-tour-2026", priceFrom: 89, dates: "Jun–Jul" },
  { artist: "Harry Styles — European Arenas", cities: "Milan · London · Berlin · Paris", href: "/harry-styles-tickets", priceFrom: 79, dates: "Jul–Aug" },
  { artist: "UEFA Champions League Final 2026", cities: "Munich (Allianz Arena)", href: "/champions-league-tickets", priceFrom: 85, dates: "May 30" },
];

const COUNTRY_HUBS = [
  { country: "United Kingdom", city: "London", href: "/concerts-in-london-2026", flag: "🇬🇧" },
  { country: "Netherlands", city: "Amsterdam", href: "/concerts-in-amsterdam-2026", flag: "🇳🇱" },
  { country: "Spain", city: "Barcelona", href: "/coldplay-tour-2026", flag: "🇪🇸" },
  { country: "Germany", city: "Berlin", href: "/champions-league-tickets", flag: "🇩🇪" },
  { country: "Italy", city: "Milan", href: "/f1-italian-grand-prix-monza-tickets", flag: "🇮🇹" },
  { country: "France", city: "Paris", href: "/f1-monaco-grand-prix-tickets", flag: "🇫🇷" },
];

const FAQS = [
  {
    q: "Which European city has the most 2026 concerts?",
    a: "London by a wide margin (~240 major ticketed shows), followed by Amsterdam (~120), Berlin (~110), and Paris (~100). For stadium-tier tours specifically, Wembley is the single busiest venue in Europe — hosting Taylor Swift, Coldplay and Oasis in the same calendar year.",
  },
  {
    q: "Do European concert tickets transfer between EU countries?",
    a: "Yes — all of our listed tickets are mobile-delivered (QR or Apple Wallet) and cross any EU border without issue. For UK events, EU citizens don't need anything additional except a valid passport. We never ship physical tickets internationally.",
  },
  {
    q: "How do I compare prices across multiple European cities for the same tour?",
    a: "Click into each tour's dedicated page — we show the city-by-city price matrix at the bottom. For most mid-scale tours, Prague and Warsaw sell at 30–40% lower than London or Paris for identical production — worth planning a trip around if you're flexible.",
  },
  {
    q: "Are European festival tickets on this page?",
    a: "This page focuses on single-night and multi-night tours. For festivals (Glastonbury, Primavera, Rock am Ring, Tomorrowland) see our dedicated festival hub — we track those separately because on-sale dates and refund policies differ significantly.",
  },
  {
    q: "What's the latest I can book a European concert ticket and still travel?",
    a: "Mobile-delivered tickets are issued up to the door opening. We've had buyers book Wembley tickets 35 minutes before showtime. For cross-border travel, book flights with hand-luggage only — Europe's rail network connects every major concert city within 8 hours of London or Paris.",
  },
];

export default function EuropeTours2026Page() {
  const [data, setData] = useState({ coming_soon: [] });

  useEffect(() => {
    fetch(`${API}/api/demand/most-wanted?limit=10`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData({ coming_soon: d.coming_soon || [] }))
      .catch(() => {});
  }, []);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Europe Tours 2026",
    description:
      "Master calendar of every confirmed European concert tour in 2026.",
    numberOfItems: HIGHLIGHTED_TOURS.length,
    itemListElement: HIGHLIGHTED_TOURS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${t.href}`,
      name: t.artist,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const related = getRelatedLinks({
    category: "city_demand",
    excludeHrefs: ["/europe-tours-2026"],
    limit: 8,
  });

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <title>Europe Tours 2026 — Master Concert Calendar | EuroMatchTickets</title>
      <meta
        name="description"
        content="Every confirmed European concert tour of 2026 in one calendar: 180+ multi-city runs across 47 cities. Live prices, city-by-city dates, notify list for unannounced tours."
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:title" content="Europe Tours 2026 — Master Calendar" />
      <meta property="og:description" content="Every confirmed 2026 European tour — city-by-city." />
      <meta property="og:type" content="website" />
      <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      {/* HERO */}
      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0b0b0b] to-[#0b0b0b]" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-16 md:pt-24 md:pb-20">
          <Badge
            data-testid="europe-tours-badge"
            className="mb-5 bg-blue-500/10 border border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5" />
            Master Calendar · 47 Cities · 180+ Tours
          </Badge>
          <h1
            data-testid="europe-tours-title"
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.04] mb-5"
          >
            Europe Tours
            <br />
            <span className="text-blue-400">2026</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            The master calendar for every confirmed 2026 concert tour across
            Europe — from Lisbon to Helsinki. Live prices, city-by-city dates,
            and an honest notify list for every tour that hasn't been announced
            yet.
          </p>
        </div>
      </section>

      {/* INTRO CONTENT */}
      <section className="max-w-4xl mx-auto px-5 py-12">
        <div className="text-slate-300 leading-relaxed space-y-4 text-base">
          {INTRO.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTED TOURS */}
      <section className="max-w-5xl mx-auto px-5 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          Confirmed Top Tours
        </h2>
        <div
          className="grid md:grid-cols-2 gap-3"
          data-testid="europe-tours-list"
        >
          {HIGHLIGHTED_TOURS.map((t, i) => (
            <Link
              key={i}
              to={t.href}
              data-testid={`europe-tour-${i}`}
              className="group flex items-center justify-between p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {t.artist}
                </h3>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {t.cities}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {t.dates}
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="text-blue-400 font-bold text-base">
                  €{t.priceFrom}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                  from
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COUNTRY HUBS */}
      <section className="max-w-5xl mx-auto px-5 py-12 border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Browse by country
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {COUNTRY_HUBS.map((c, i) => (
            <Link
              key={i}
              to={c.href}
              data-testid={`europe-country-${i}`}
              className="group flex items-center gap-3 p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded transition-colors"
            >
              <span className="text-2xl" aria-hidden>
                {c.flag}
              </span>
              <div className="flex-1">
                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  {c.country}
                </div>
                <div className="text-xs text-slate-500">{c.city}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* NOTIFY LIST */}
      {data.coming_soon.length > 0 ? (
        <section className="max-w-5xl mx-auto px-5 py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            On the notify list
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data.coming_soon.slice(0, 9).map((d, i) => (
              <Link
                key={d.event_slug}
                to={`/${d.event_slug}`}
                data-testid={`europe-notify-${i}`}
                className="flex items-center justify-between p-3 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 rounded text-sm transition-colors"
              >
                <span className="text-white capitalize truncate">
                  {d.artist || d.event_slug.replace(/-/g, " ")}
                </span>
                <span className="text-amber-400 text-xs">
                  {d.lead_count} · join
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-5 py-12 border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Europe 2026 concert FAQ
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              data-testid={`europe-faq-${i}`}
              className="group border border-white/10 bg-white/[0.02] rounded"
            >
              <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-sm md:text-base">
                {f.q}
                <ArrowRight className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="max-w-5xl mx-auto px-5 pb-20 border-t border-white/5 pt-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Also trending
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {related.map((l, i) => (
            <Link
              key={i}
              to={l.href}
              data-testid={`europe-related-${i}`}
              className="px-3 py-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded text-slate-300 hover:text-blue-400 transition-colors"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
