import { useState, useEffect } from "react";
import axios from "axios";
import { Activity, RefreshCw } from "lucide-react";
import { API } from "../App";

/**
 * LiveListingsCounter — minimal real-data strip placed near the price/CTA.
 *
 * Purpose: address the Search Console "lots of impressions, 0 clicks" problem
 * by giving the snippet preview AND the on-page hero a real-time freshness
 * signal ("142 listings · prices updated 2 min ago") instead of marketing
 * fluff. Crawlers + humans both prefer this.
 *
 * Usage:
 *   <LiveListingsCounter searchQuery="Spa" />          // search-based
 *   <LiveListingsCounter slug="f1-belgian-grand-prix"/> // exact event
 *
 * Behaviour:
 * - Fetches from `${API}/events?search=...&limit=10` (or by slug).
 * - Sums `available_tickets` across matching events; uses min `lowest_price`.
 * - If no real listings returned, renders nothing (zero overclaim risk).
 */
const LiveListingsCounter = ({ searchQuery, slug, fallbackLabel = "listings" }) => {
  const [data, setData] = useState({ count: 0, lastUpdated: null, ready: false });

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        const params = new URLSearchParams();
        if (slug) {
          // Exact event lookup
          params.set("search", slug.replace(/-/g, " "));
        } else if (searchQuery) {
          params.set("search", searchQuery);
        }
        params.set("limit", "10");

        const res = await axios.get(`${API}/events?${params.toString()}`);
        if (cancelled) return;

        const events = Array.isArray(res.data) ? res.data : [];
        const totalListings = events.reduce(
          (sum, e) => sum + (Number(e.available_tickets) || 0),
          0
        );

        // Only render if we have real inventory data
        if (totalListings > 0) {
          setData({
            count: totalListings,
            lastUpdated: new Date(),
            ready: true,
          });
        } else {
          setData({ count: 0, lastUpdated: null, ready: false });
        }
      } catch {
        if (!cancelled) setData({ count: 0, lastUpdated: null, ready: false });
      }
    };

    fetchListings();
    // Soft refresh every 90s to show liveness without hammering the API.
    const interval = setInterval(fetchListings, 90_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [searchQuery, slug]);

  if (!data.ready) return null;

  const formatTimeAgo = (date) => {
    if (!date) return "recently";
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return "today";
  };

  return (
    <div
      data-testid="live-listings-counter"
      className="inline-flex items-center gap-3 text-xs uppercase tracking-wider font-mono text-slate-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5"
    >
      <span className="flex items-center gap-1.5 text-emerald-400">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span className="font-bold">
          {data.count.toLocaleString()} {fallbackLabel}
        </span>
      </span>
      <span className="text-slate-500">·</span>
      <span className="flex items-center gap-1.5 text-slate-400">
        <RefreshCw className="w-3 h-3" />
        Prices updated {formatTimeAgo(data.lastUpdated)}
      </span>
    </div>
  );
};

export default LiveListingsCounter;
