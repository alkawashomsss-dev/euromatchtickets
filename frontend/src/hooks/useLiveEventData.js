import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../App";

/**
 * useLiveEventData — single source of truth for event pricing / status /
 * availability on SEO landing pages.
 *
 * Replaces every hardcoded array of "upcoming matches" / "from €X" / fake
 * AggregateOffer. Pass an array of known event slugs (or an event_type /
 * league filter) and the hook returns live data from `/api/events`.
 *
 * Rules enforced by this hook (honesty layer):
 *   - events with status === "coming_soon" are returned with price=null
 *   - events with no real lowest_price are treated as "no pricing"
 *   - if the backend returns nothing we return { events: [], minPrice: null }
 *
 * The consuming component should:
 *   - render <WaitlistCTA/> when minPrice is null
 *   - show "Prices vary by availability" instead of hardcoded "From €X"
 *   - drop any Product/Offer JSON-LD when minPrice is null
 */
export default function useLiveEventData({ slugs = [], eventType, league, limit = 20 } = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        let results = [];
        if (slugs && slugs.length > 0) {
          // Fetch specific slugs in parallel, swallow individual 404s
          const settled = await Promise.allSettled(
            slugs.map((s) => axios.get(`${API}/events/${encodeURIComponent(s)}`))
          );
          results = settled
            .filter((r) => r.status === "fulfilled" && r.value?.data)
            .map((r) => r.value.data);
        } else {
          const params = new URLSearchParams();
          if (eventType) params.set("event_type", eventType);
          if (league) params.set("league", league);
          params.set("limit", String(limit));
          const res = await axios.get(`${API}/events?${params.toString()}`);
          results = res.data || [];
        }
        if (cancelled) return;
        setEvents(
          results.map((e) => {
            const realPrice =
              e.status !== "coming_soon" && typeof e.lowest_price === "number" && e.lowest_price > 0
                ? Math.round(e.lowest_price)
                : null;
            return {
              ...e,
              displayPrice: realPrice,
              isComingSoon: e.status === "coming_soon" || realPrice === null,
            };
          })
        );
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(slugs), eventType, league, limit]);

  const prices = events
    .map((e) => e.displayPrice)
    .filter((p) => typeof p === "number" && p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const hasAnyVerifiedInventory = prices.length > 0;

  return { events, loading, error, minPrice, hasAnyVerifiedInventory };
}
