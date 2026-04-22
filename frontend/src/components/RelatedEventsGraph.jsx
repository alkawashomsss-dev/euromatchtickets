import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { API } from "../App";

/**
 * RelatedEventsGraph — internal SEO linking block.
 *
 * Pulls 3 buckets of related events from /api/events:
 *   1. Same event_type (e.g. other F1 races)
 *   2. Same city (e.g. other Monaco events)
 *   3. Intent pages (hand-curated guides)
 *
 * Renders a compact 3-column grid of internal links. Every link uses real
 * slugs from the DB, so Google builds the site-graph naturally.
 *
 * Props:
 *   currentEvent — the event object being viewed (provides event_type/city/slug)
 *   intentLinks  — optional [{to, label}] intent-page overrides
 */
export default function RelatedEventsGraph({ currentEvent, intentLinks = [] }) {
  const [sameType, setSameType] = useState([]);
  const [sameCity, setSameCity] = useState([]);

  useEffect(() => {
    if (!currentEvent) return;
    const fetchRelated = async () => {
      try {
        const [typeRes, cityRes] = await Promise.all([
          currentEvent.event_type
            ? axios.get(`${API}/events?event_type=${encodeURIComponent(currentEvent.event_type)}&limit=12`)
            : Promise.resolve({ data: [] }),
          currentEvent.city
            ? axios.get(`${API}/events?city=${encodeURIComponent(currentEvent.city)}&limit=12`)
            : Promise.resolve({ data: [] }),
        ]);
        const cSlug = currentEvent.slug || currentEvent.event_id;
        const dedupe = (list) => list.filter((e) => (e.slug || e.event_id) !== cSlug).slice(0, 4);
        setSameType(dedupe(typeRes.data || []));
        setSameCity(dedupe(cityRes.data || []));
      } catch {
        /* silent */
      }
    };
    fetchRelated();
  }, [currentEvent?.slug, currentEvent?.event_type, currentEvent?.city]);

  // If there's literally nothing to show, render nothing (don't build a dead block).
  const hasAny = sameType.length + sameCity.length + intentLinks.length > 0;
  if (!hasAny) return null;

  const typeLabel = {
    f1: "Other F1 races",
    motogp: "Other MotoGP races",
    football: "Other football matches",
    worldcup: "Other World Cup fixtures",
    concert: "Other concerts",
    tennis: "Other tennis tournaments",
    festival: "Other festivals",
    match: "Other matches",
  }[currentEvent?.event_type] || "Related events";

  return (
    <section className="bg-[#15151e] border-t border-white/5 py-10" data-testid="related-events-graph">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-6">Related events & guides</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Same type */}
          {sameType.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-3">
                {typeLabel}
              </p>
              <ul className="space-y-2">
                {sameType.map((e) => (
                  <li key={e.slug || e.event_id}>
                    <Link
                      to={`/event/${e.slug || e.event_id}`}
                      className="flex items-center justify-between gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 p-2 -mx-2 transition"
                    >
                      <span className="flex-1 truncate">{e.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Same city */}
          {sameCity.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-3">
                More in {currentEvent?.city}
              </p>
              <ul className="space-y-2">
                {sameCity.map((e) => (
                  <li key={e.slug || e.event_id}>
                    <Link
                      to={`/event/${e.slug || e.event_id}`}
                      className="flex items-center justify-between gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 p-2 -mx-2 transition"
                    >
                      <span className="flex-1 truncate">{e.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Intent pages */}
          {intentLinks.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-3">
                Buying guides
              </p>
              <ul className="space-y-2">
                {intentLinks.map((l, i) => (
                  <li key={i}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between gap-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 p-2 -mx-2 transition"
                    >
                      <span className="flex-1">{l.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
