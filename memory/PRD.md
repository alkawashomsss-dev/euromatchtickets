# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Data Accuracy Fix (April 17, 2026) — DONE

### Pre-hydration Script Fixes:
- Spa F1 date: FIXED 2026-07-27 → 2026-08-28 to 2026-08-30
- Spa F1 price: FIXED €129 → €109
- Spa F1 venue: FIXED "Spa" → "Stavelot" (correct city)
- Duplicate Product Schema: REMOVED from pre-hydration (React handles it)
- Schema name: Unified to "F1 Belgian Grand Prix Spa 2026"
- Belgian GP redirect pages: dates synced to 2026-08-28

### Checkout Page:
- Shows: Event name, date, time, venue, city, category, section, row, seat
- Data from DB (real, not hardcoded)
- Fallback: "Venue TBC" / "Date TBC" (no fake dates)
- Pay button shows exact total

## Technical SEO (April 17, 2026) — DONE
- SSR Meta injection fixed (</head> strategy)
- robots.txt blocks query params
- 410 Gone for ugly event IDs
- Duplicate Product schemas eliminated

## CTR Optimization (April 15, 2026) — DONE
- Title: Buy {Event} | From €{Price} | {City}
- Internal Linking: 9 groups
- Sitemaps: 1614 URLs × 1614 images

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaigns
