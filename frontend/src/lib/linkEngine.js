/**
 * Internal Linking Engine
 * =======================
 * Central map of all canonical clusters so we can render contextual
 * "related" links on every page without orphaning any URL.
 *
 * Structure:
 *   LINK_CLUSTERS[category] = [{ title, href, city?, tag? }, ...]
 *
 * Helper:
 *   getRelatedLinks({ category, city, artist, excludeHrefs, limit })
 *   → returns up to `limit` links, preferring same city/artist, never
 *     duplicating `excludeHrefs`, always deterministic.
 */

export const LINK_CLUSTERS = {
  city_demand: [
    { title: "Concerts in Amsterdam 2026", href: "/concerts-in-amsterdam-2026", city: "Amsterdam", tag: "City Hub" },
    { title: "Concerts in London 2026", href: "/concerts-in-london-2026", city: "London", tag: "City Hub" },
    { title: "Europe Tours 2026", href: "/europe-tours-2026", tag: "Regional Hub" },
    { title: "Most Wanted Concerts 2026", href: "/most-wanted-concerts-2026", tag: "Demand Index" },
  ],
  confirmed_concerts: [
    { title: "Coldplay Music of the Spheres 2026", href: "/coldplay-tour-2026", artist: "Coldplay" },
    { title: "Taylor Swift Wembley London 2026", href: "/taylor-swift-london-tickets", artist: "Taylor Swift", city: "London" },
    { title: "Bruno Mars European Tour 2026", href: "/bruno-mars-tour-2026", artist: "Bruno Mars" },
    { title: "Bad Bunny London 2026", href: "/bad-bunny-london-2026", artist: "Bad Bunny", city: "London" },
    { title: "The Weeknd Tour 2026", href: "/the-weeknd-tour-2026", artist: "The Weeknd" },
    { title: "Guns N' Roses Tour 2026", href: "/guns-n-roses-tour-2026", artist: "Guns N' Roses" },
    { title: "Harry Styles Tickets 2026", href: "/harry-styles-tickets", artist: "Harry Styles" },
    { title: "Metallica Sphere Las Vegas 2026", href: "/metallica-sphere-las-vegas-tickets", artist: "Metallica", city: "Las Vegas" },
  ],
  f1_motorsport: [
    { title: "Formula 1 Tickets 2026", href: "/f1-tickets" },
    { title: "Monaco Grand Prix 2026", href: "/f1-monaco-grand-prix-tickets", city: "Monaco" },
    { title: "Belgian GP Spa 2026", href: "/f1-belgian-grand-prix-spa-tickets", city: "Spa" },
    { title: "British GP Silverstone 2026", href: "/f1-british-grand-prix-silverstone-tickets", city: "Silverstone" },
    { title: "Italian GP Monza 2026", href: "/f1-italian-grand-prix-monza-tickets", city: "Monza" },
    { title: "Dutch GP Zandvoort 2026", href: "/f1-dutch-grand-prix-zandvoort-tickets", city: "Zandvoort" },
    { title: "Singapore GP 2026", href: "/f1-singapore-grand-prix-tickets", city: "Singapore" },
    { title: "Las Vegas GP 2026", href: "/f1-las-vegas-grand-prix-tickets", city: "Las Vegas" },
  ],
  football: [
    { title: "Champions League Tickets", href: "/champions-league-tickets" },
    { title: "El Clasico Tickets 2026", href: "/el-clasico-tickets" },
    { title: "Bayern vs Real Madrid UCL 2026", href: "/bayern-munich-vs-real-madrid-tickets", city: "Munich" },
  ],
  world_events: [
    { title: "FIFA World Cup 2026", href: "/world-cup-2026-tickets" },
    { title: "MotoGP Tickets 2026", href: "/motogp-tickets" },
    { title: "World Athletics 2026", href: "/world-athletics-2026-tickets" },
  ],
};

const ALL_LINKS = Object.entries(LINK_CLUSTERS).flatMap(([cat, arr]) =>
  arr.map((l) => ({ ...l, _cat: cat }))
);

/**
 * Return up to `limit` contextually related links.
 * Prefers same-city or same-artist matches, then falls back to the same
 * category cluster, then filler from the global pool.
 */
export function getRelatedLinks({
  category,
  city,
  artist,
  excludeHrefs = [],
  limit = 8,
} = {}) {
  const out = [];
  const pushed = new Set(excludeHrefs);
  const add = (link) => {
    if (!link || pushed.has(link.href)) return;
    pushed.add(link.href);
    out.push(link);
  };

  if (city) {
    const c = city.toLowerCase();
    ALL_LINKS.filter((l) => (l.city || "").toLowerCase() === c).forEach(add);
  }
  if (artist) {
    const a = artist.toLowerCase();
    ALL_LINKS.filter((l) => (l.artist || "").toLowerCase() === a).forEach(add);
  }
  if (category && LINK_CLUSTERS[category]) {
    LINK_CLUSTERS[category].forEach(add);
  }
  // Fillers from other clusters
  if (out.length < limit) {
    ALL_LINKS.forEach(add);
  }
  return out.slice(0, limit);
}
