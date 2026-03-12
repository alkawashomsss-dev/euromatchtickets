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
 * Each event gets a UNIQUE image based on its ID/title to avoid duplicates
 */
export function getEventImagePath(event) {
  if (!event) return CATEGORY_IMAGES.football[0];
  
  const type = event.event_type || event.category || "";
  const title = (event.title || "").toLowerCase();
  const id = event.event_id || event.slug || title;
  
  // Determine category
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
  
  // Pick a unique image from the category based on event ID
  const images = CATEGORY_IMAGES[category];
  const index = hashString(id) % images.length;
  return images[index];
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
 * Get responsive image URLs
 */
export function getResponsiveUrls(basePath) {
  return {
    sm: `${basePath}-sm.webp`,
    md: `${basePath}-md.webp`,
    lg: `${basePath}-lg.webp`,
    jpg: `${basePath}.jpg`,
    srcSet: `${basePath}-sm.webp 400w, ${basePath}-md.webp 800w, ${basePath}-lg.webp 1536w`,
  };
}

export default CATEGORY_IMAGES;
