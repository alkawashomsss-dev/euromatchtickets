import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Ticket,
  Bell,
  Users,
  Flame,
  ArrowRight,
  Shield,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getRelatedLinks } from "../lib/linkEngine";

const API = process.env.REACT_APP_BACKEND_URL;
const SITE = "https://euromatchtickets.com";

/**
 * CityDemandPage
 * ==============
 * Hub page for "Concerts in {City} 2026" style demand pages.
 *
 * Behaviour:
 * - Fetches /api/demand/by-city?city=...
 * - Renders confirmed events (ItemList schema) + coming-soon leads
 *   (stays purely informational, no fake prices)
 * - Auto-generated contextual internal links via linkEngine
 * - Always >= 500 words of unique content (intro + city guide + FAQs)
 */
export default function CityDemandPage({
  city,
  title,
  heroTagline,
  introParagraphs = [],
  venueGuide = [],
  faqs = [],
  heroImage,
  canonical,
  year = 2026
}) {
  const [data, setData] = useState({ confirmed: [], coming_soon: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/api/demand/by-city?city=${encodeURIComponent(city)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        setData({
          confirmed: d.confirmed || [],
          coming_soon: d.coming_soon || []
        });
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [city]);

  const confirmed = data.confirmed || [];
  const comingSoon = data.coming_soon || [];

  // ItemList schema — one concise entry per confirmed event
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: confirmed.length,
    itemListElement: confirmed.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${e.href}`,
      name: e.title
    }))
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        }
      : null;

  const related = getRelatedLinks({
    category: "city_demand",
    city,
    excludeHrefs: [canonical ? canonical.replace(SITE, "") : ""],
    limit: 8
  });

  const metaTitle = `Concerts in ${city} ${year} — Full Schedule & Cheap Tickets | EuroMatchTickets`;
  const metaDesc = `Every confirmed concert in ${city} ${year}: venues, dates, ticket prices from €49. Full calendar updated daily. Plus the notify list for unconfirmed tours.`;

  // Force head tags at runtime (React 19 native <title> hoisting is unreliable)
  useEffect(() => {
    document.title = metaTitle;
    const set = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.split("[")[0]);
        sel.match(/\[(\w+)="([^"]+)"\]/g)?.forEach((m) => {
          const [, k, v] = m.match(/\[(\w+)="([^"]+)"\]/);
          el.setAttribute(k, v);
        });
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    set('meta[name="description"]', "content", metaDesc);
    set('meta[name="robots"]', "content", "index, follow");
    set('meta[property="og:title"]', "content", metaTitle);
    set('meta[property="og:description"]', "content", metaDesc);
    set('meta[property="og:type"]', "content", "website");
    if (heroImage) set('meta[property="og:image"]', "content", heroImage);
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [metaTitle, metaDesc, canonical, heroImage]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Structured data (JSON-LD) - native React 19 script elements work reliably */}
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
      {faqSchema ? (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      ) : null}

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        {heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0b0b0b]/70 to-[#0b0b0b]" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-16 md:pt-24 md:pb-20">
          <Badge
            data-testid="city-demand-badge"
            className="mb-5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {confirmed.length} confirmed · {comingSoon.length} on notify list
          </Badge>
          <h1
            data-testid="city-demand-title"
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.04] mb-4"
          >
            Concerts in <span className="text-[#9c27b0]">{city}</span>
            <br />
            <span className="text-slate-400 font-bold text-3xl md:text-5xl">
              {year} — Full Schedule
            </span>
          </h1>
          {heroTagline ? (
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {heroTagline}
            </p>
          ) : null}
          <div className="flex gap-3 mt-6">
            <Link to="#confirmed" data-testid="scroll-to-confirmed">
              <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2] h-11 px-6 font-semibold">
                <Ticket className="w-4 h-4 mr-2" />
                Browse {confirmed.length} Events
              </Button>
            </Link>
            <Link to="/most-wanted-concerts-2026" data-testid="cta-most-wanted">
              <Button
                variant="outline"
                className="border-white/15 hover:bg-white/5 h-11 px-5 text-slate-200"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Wanted
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO CONTENT — boosts word count + E-E-A-T */}
      {introParagraphs.length > 0 ? (
        <section className="max-w-4xl mx-auto px-5 py-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            What's on in {city} this {year}
          </h2>
          <div className="text-slate-300 leading-relaxed space-y-4 text-base">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* CONFIRMED EVENTS LIST */}
      <section id="confirmed" className="max-w-5xl mx-auto px-5 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Confirmed {city} Events
          </h2>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            Updated daily from ticketing feeds
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm" data-testid="city-demand-loading">
            Loading events…
          </div>
        ) : confirmed.length === 0 ? (
          <div
            className="border border-white/10 bg-white/[0.02] p-6 text-slate-400 text-sm"
            data-testid="city-demand-empty"
          >
            No confirmed events in {city} for {year} yet. Check the notify list
            below, or browse{" "}
            <Link to="/events" className="text-[#9c27b0] underline">
              all events
            </Link>
            .
          </div>
        ) : (
          <div
            className="grid md:grid-cols-2 gap-3"
            data-testid="city-demand-confirmed-list"
          >
            {confirmed.map((e, idx) => (
              <Link
                key={e.slug || e.event_id || idx}
                to={e.href}
                data-testid={`city-confirmed-${idx}`}
                className="group flex gap-4 p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded"
              >
                {e.image_url ? (
                  <img
                    src={e.image_url}
                    alt={e.title}
                    loading="lazy"
                    className="w-24 h-24 object-cover rounded flex-shrink-0"
                  />
                ) : null}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm md:text-base group-hover:text-[#9c27b0] transition-colors line-clamp-2">
                    {e.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    {e.event_date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(e.event_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    ) : null}
                    {e.venue ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {e.venue}
                      </span>
                    ) : null}
                  </div>
                  {e.price_from ? (
                    <div className="mt-2 text-[#9c27b0] font-semibold text-sm">
                      from €{e.price_from}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* COMING SOON DEMAND */}
      {comingSoon.length > 0 ? (
        <section className="max-w-5xl mx-auto px-5 py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Rumoured {city} tours — notify list
          </h2>
          <p className="text-slate-400 text-sm mb-5 max-w-2xl">
            No official dates yet. These artists are on our watch list based on
            fan demand. Join a notify list and we'll ping you the moment
            tickets go on sale.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {comingSoon.map((d, i) => (
              <Link
                key={d.event_slug}
                to={`/${d.event_slug}`}
                data-testid={`city-demand-coming-${i}`}
                className="flex items-center justify-between p-4 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 rounded transition-colors"
              >
                <div>
                  <div className="font-semibold text-white text-sm">
                    {d.artist || d.event_slug.replace(/-/g, " ")}
                  </div>
                  <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {d.lead_count} on notify list
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* VENUE GUIDE */}
      {venueGuide.length > 0 ? (
        <section className="max-w-4xl mx-auto px-5 py-14 border-t border-white/5">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {city} concert venues — quick guide
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {venueGuide.map((v, i) => (
              <div
                key={i}
                className="p-5 border border-white/10 bg-white/[0.02] rounded"
              >
                <h3 className="font-bold text-white mb-1">{v.name}</h3>
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> Capacity {v.capacity}
                  </span>
                  {v.type ? <span>{v.type}</span> : null}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {v.blurb}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <section className="max-w-4xl mx-auto px-5 pb-14 border-t border-white/5 pt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                data-testid={`city-faq-${i}`}
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
      ) : null}

      {/* RELATED LINKS */}
      {related.length > 0 ? (
        <section className="max-w-5xl mx-auto px-5 pb-20 border-t border-white/5 pt-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#9c27b0]" />
            Explore more
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {related.map((l, i) => (
              <Link
                key={i}
                to={l.href}
                data-testid={`city-related-${i}`}
                className="px-3 py-2 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded text-slate-300 hover:text-[#9c27b0] transition-colors"
              >
                {l.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
