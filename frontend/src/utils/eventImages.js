/**
 * AI-Generated Event Image System
 * Each category has multiple unique images - NO DUPLICATES
 * Color themes: F1=Red, Football=Green/Gold, Concert=Purple/Blue, MotoGP=Orange, WorldCup=Gold
 */

// Multiple images per category for variety
const CATEGORY_IMAGES = {
  f1: [
    "/images/heroes/f1-red",        // Ferrari red close-up 3D
    "/images/heroes/f1-race",       // Racing action shot
    "/images/heroes/f1-pitstop",    // Pit stop red neon
    "/images/heroes/monaco",        // Monaco GP
    "/images/heroes/silverstone",   // Silverstone aerial
    "/images/heroes/f1",            // Original F1 hero
  ],
  football: [
    "/images/heroes/football-stadium",  // Vivid green stadium 3D
    "/images/heroes/football-penalty",  // Penalty kick dramatic
    "/images/heroes/football-match",    // Match action
    "/images/heroes/football",          // Original football hero
  ],
  concert: [
    "/images/heroes/concert-purple",  // Purple laser stage 3D
    "/images/heroes/concert-drums",   // Blue drums solo
    "/images/heroes/concert-live",    // Live performance
    "/images/heroes/concert",         // Original concert hero
  ],
  motogp: [
    "/images/heroes/motogp-orange",  // Orange MotoGP 3D
    "/images/heroes/motogp",         // Original MotoGP
  ],
  worldcup: [
    "/images/heroes/worldcup-trophy",  // Golden trophy 3D
    "/images/heroes/worldcup-final",   // Final ceremony
    "/images/heroes/worldcup",         // Original world cup
  ],
};

// Simple hash to get consistent but varied image per event
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get the best matching image base path for an event
 * Priority:
 *   1. event.image_url (unique photo collected for this event — best case)
 *   2. Category hero (fallback for events without an image yet)
 */
export function getEventImagePath(event) {
  if (!event) return CATEGORY_IMAGES.football[0];

  // 1. REAL unique image collected for this specific event
  // (from Wikipedia via services/image_collector.py)
  // Backend serves at /api/event-images/ but DB stores /event-images/ — rewrite.
  const real = event.image_url;
  if (real) {
    if (real.startsWith("/event-images/")) {
      return real.replace("/event-images/", "/api/event-images/");
    }
    if (real.startsWith("/api/event-images/") || real.startsWith("http")) {
      return real;
    }
  }

  // 2. Category-themed fallback
  const type = event.event_type || event.category || "";
  const title = (event.title || "").toLowerCase();
  const id = event.event_id || event.slug || title;

  let category = "football";
  if (type === "f1" || type === "formula" || title.includes("grand prix") || title.includes("f1")) {
    category = "f1";
  } else if (type === "concert" || type === "concerts" || title.includes("concert") || title.includes("tour")) {
    category = "concert";
  } else if (type === "motogp" || title.includes("motogp") || title.includes("moto gp")) {
    category = "motogp";
  } else if (type === "worldcup" || title.includes("world cup") || title.includes("fifa")) {
    category = "worldcup";
  }

  const images = CATEGORY_IMAGES[category];
  const index = hashString(id) % images.length;
  const base = images[index];
  // Ensure a file extension so <img> tags render directly
  return base.endsWith(".jpg") || base.endsWith(".webp") || base.endsWith(".png")
    ? base
    : `${base}.jpg`;
}

/**
 * Get category hero image (the main themed one for category pages)
 */
export function getCategoryHero(category) {
  const map = {
    f1: "/images/heroes/f1-red",
    football: "/images/heroes/football-stadium",
    concert: "/images/heroes/concert-purple",
    motogp: "/images/heroes/motogp-orange",
    worldcup: "/images/heroes/worldcup-trophy",
    match: "/images/heroes/football-stadium",
  };
  return map[category] || map.football;
}

/**
 * Get responsive image URLs.
 * For real collected event images (/event-images/... or http) we return
 * the same URL for every size — browsers handle scaling natively.
 * For category heroes (which have -sm/-md/-lg webp variants) we build
 * a srcSet for high-DPI displays.
 */
export function getResponsiveUrls(basePath) {
  if (!basePath) basePath = "";
  const isRealImage =
    basePath.startsWith("/event-images/") ||
    basePath.startsWith("/api/event-images/") ||
    basePath.startsWith("http") ||
    basePath.endsWith(".jpg") ||
    basePath.endsWith(".png") ||
    basePath.endsWith(".webp");
  if (isRealImage) {
    return {
      sm: basePath,
      md: basePath,
      lg: basePath,
      jpg: basePath,
      srcSet: `${basePath} 1600w`,
    };
  }
  return {
    sm: `${basePath}-sm.webp`,
    md: `${basePath}-md.webp`,
    lg: `${basePath}-lg.webp`,
    jpg: `${basePath}.jpg`,
    srcSet: `${basePath}-sm.webp 400w, ${basePath}-md.webp 800w, ${basePath}-lg.webp 1536w`,
  };
}

export default CATEGORY_IMAGES;
