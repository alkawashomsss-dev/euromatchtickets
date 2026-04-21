import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Bell,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { getRelatedLinks } from "../lib/linkEngine";

const API = process.env.REACT_APP_BACKEND_URL;
const SITE = "https://euromatchtickets.com";
const CANONICAL = `${SITE}/most-wanted-concerts-2026`;

/**
 * Most Wanted Concerts 2026
 * =========================
 * Auto-ranked index page built from `event_demand` + confirmed `events`.
 * Indexable (this IS a legitimate Google Discover / traffic magnet page).
 */
export default function MostWantedConcerts2026Page() {
  const [data, setData] = useState({ coming_soon: [], confirmed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/api/demand/most-wanted?limit=30`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        setData({
          coming_soon: d.coming_soon || [],
          confirmed: d.confirmed || [],
        });
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const combined = [
    ...(data.confirmed || []).map((e) => ({
      type: "confirmed",
      title: e.title,
      subtitle: e.city && e.venue ? `${e.venue} · ${e.city}` : e.city || e.venue || "",
      href: e.href,
      price_from: e.price_from,
      image: e.image_url,
      date: e.event_date,
      rank_key: e.price_from || 999,
    })),
    ...(data.coming_soon || []).map((d) => ({
      type: "coming_soon",
      title: d.artist || (d.event_slug || "").replace(/-/g, " "),
      subtitle: d.city ? `Rumoured — ${d.city}` : "Rumoured tour",
      href: `/${d.event_slug}`,
      lead_count: d.lead_count,
      rank_key: -(d.lead_count || 0),
    })),
  ].sort((a, b) => (a.rank_key || 0) - (b.rank_key || 0));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Most Wanted Concerts 2026",
    description:
      "The 30 most-wanted concerts of 2026 ranked by live fan demand and confirmed ticket sales.",
    numberOfItems: Math.min(combined.length, 30),
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: combined.slice(0, 30).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}${item.href}`,
      name: item.title,
    })),
  };

  const related = getRelatedLinks({
    category: "city_demand",
    excludeHrefs: ["/most-wanted-concerts-2026"],
    limit: 8,
  });

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <title>Most Wanted Concerts 2026 — Live Fan Demand Ranking | EuroMatchTickets</title>
      <meta
        name="description"
        content="The top 30 most-wanted concerts of 2026, ranked live by fan demand and confirmed tickets. Updated daily — see which tours are selling out first."
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:title" content="Most Wanted Concerts 2026 — Live Demand Ranking" />
      <meta
        property="og:description"
        content="Top 30 most-wanted concerts of 2026 ranked by live fan demand. Updated daily."
      />
      <meta property="og:type" content="website" />
      <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>

      {/* HERO */}
      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0828] via-[#0b0b0b] to-[#0b0b0b]" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-14 md:pt-24 md:pb-20">
          <Badge
            data-testid="most-wanted-badge"
            className="mb-5 bg-[#9c27b0]/20 border border-[#9c27b0]/40 text-[#d580e8] hover:bg-[#9c27b0]/20"
          >
            <Flame className="w-3.5 h-3.5 mr-1.5" />
            Updated Daily · Live Fan Demand
          </Badge>
          <h1
            data-testid="most-wanted-title"
            className="text-4xl md:text-6xl font-black tracking-tight leading-[1.04] mb-5"
          >
            The 30 Most-Wanted
            <br />
            <span className="text-[#9c27b0]">Concerts of 2026</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A live index of every major tour fans are chasing — ranked by
            confirmed ticket demand and real signup intent. Updated every night
            from our <strong className="text-white">notify-list</strong>{" "}
            database and confirmed ticket feeds. No hype, no bots.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Ranked by real signups
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Refreshed every 24h
            </span>
            <span className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#9c27b0]" />
              {data.confirmed.length} on sale now
            </span>
          </div>
        </div>
      </section>

      {/* THE RANKED LIST */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        {loading ? (
          <div
            className="text-slate-500 text-sm"
            data-testid="most-wanted-loading"
          >
            Loading live demand data…
          </div>
        ) : combined.length === 0 ? (
          <div
            className="text-slate-400 text-sm p-6 border border-white/10 bg-white/[0.02] rounded"
            data-testid="most-wanted-empty"
          >
            No ranked data yet — be the first: join any notify list and you'll
            influence this ranking.
          </div>
        ) : (
          <ol
            className="space-y-2"
            data-testid="most-wanted-list"
          >
            {combined.slice(0, 30).map((item, i) => (
              <li
                key={item.href}
                className="group flex items-center gap-4 p-3 md:p-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded transition-colors"
                data-testid={`most-wanted-item-${i}`}
              >
                <div className="flex-shrink-0 w-10 text-right">
                  <div
                    className={`text-2xl md:text-3xl font-black ${
                      i < 3
                        ? "text-[#9c27b0]"
                        : i < 10
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                </div>

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-16 h-16 object-cover rounded flex-shrink-0 hidden sm:block"
                  />
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 hidden sm:flex items-center justify-center border border-white/10 bg-gradient-to-br from-[#1a0828] to-[#0b0b0b] rounded">
                    <Flame className="w-5 h-5 text-[#9c27b0]" />
                  </div>
                )}

                <Link
                  to={item.href}
                  className="flex-1 min-w-0 group-hover:text-[#9c27b0] transition-colors"
                >
                  <h3 className="font-bold text-white group-hover:text-[#9c27b0] transition-colors line-clamp-1 capitalize">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500 flex flex-wrap gap-3 mt-1">
                    {item.subtitle ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.subtitle}
                      </span>
                    ) : null}
                    {item.date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    ) : null}
                  </div>
                </Link>

                <div className="flex-shrink-0 text-right">
                  {item.type === "confirmed" ? (
                    item.price_from ? (
                      <div>
                        <div className="text-[#9c27b0] font-bold text-sm md:text-base">
                          €{item.price_from}
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-emerald-400">
                          On sale
                        </div>
                      </div>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        On sale
                      </Badge>
                    )
                  ) : (
                    <div>
                      <div className="text-amber-400 font-bold text-sm">
                        <Users className="w-3 h-3 inline mr-1" />
                        {item.lead_count}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-amber-400">
                        Notify
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to={item.href}
                  className="flex-shrink-0 hidden md:block"
                  aria-label={`Open ${item.title}`}
                >
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#9c27b0]" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-12 border-t border-white/5">
        <div className="p-6 md:p-8 border border-[#9c27b0]/30 bg-gradient-to-br from-[#1a0828] to-[#0b0b0b] rounded">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#9c27b0]" />
            Influence this list
          </h2>
          <p className="text-slate-300 text-sm mb-4 max-w-2xl">
            Every signup on a notify list moves that artist up the ranking.
            Want Justin Bieber in Amsterdam or Rihanna in London? Tell us —
            we'll tell the promoters.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/justin-bieber-amsterdam-2026-tickets">
              <Button className="bg-[#9c27b0] hover:bg-[#7b1fa2] h-10 px-5 font-semibold">
                Justin Bieber Amsterdam →
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="outline"
                className="border-white/15 hover:bg-white/5 h-10 px-5 text-slate-200"
              >
                Browse all events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED LINKS */}
      {related.length > 0 ? (
        <section className="max-w-5xl mx-auto px-5 pb-20">
          <h2 className="text-xl font-bold mb-4">Also trending</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {related.map((l, i) => (
              <Link
                key={i}
                to={l.href}
                data-testid={`most-wanted-related-${i}`}
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
