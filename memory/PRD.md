# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration meta tags
- **Structured Data:** Fully managed by React components (no duplication)
- **Indexing:** IndexNow API (Bing/Yandex) + Background Auto-Indexer

## SEO Protection Rules
- 2025 pages: `noindex, nofollow` + `410 Gone`
- `/event/*` detail pages: `noindex, nofollow` + `410 Gone` for non-existent events
- Active SEO pages: `index, follow` with proper canonical
- Static HTML meta tags: robots=empty, canonical=empty (JS fills both)
- All Product/Event schemas ALWAYS include `offers` field

## Database Status
- Preview DB: 1,762 pages (1,098 active + 664 inactive)
- **Production DB: 1,098 active pages (synced with prices)**

## Completed
- [x] Fix Soft 404 - fallback content when API fails
- [x] Fix Duplicate canonical - empty href in static HTML
- [x] Add `offers` to ALL Product/Event schemas (always present)
- [x] Add prices to 266 pages missing them
- [x] Set `/event/*` pages to `noindex, nofollow`
- [x] Add `410 Gone` for non-existent `/event/*` URLs
- [x] Sync 1,098 pages with prices to production
- [x] Populate production database

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Activate Next Batch of 100 SEO Pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program

## Known Issues
- Login uses Emergent-managed Google Auth

## Date Log
- 2026-03-31: Added `offers` to ALL Product/Event schemas (always present, with fallback prices)
- 2026-03-31: Added prices to 266 pages missing price_low/price_high
- 2026-03-31: Set `/event/*` pages to noindex + 410 Gone for non-existent events
- 2026-03-31: Synced all 1,098 active pages with prices to production
- 2026-03-31: Fixed Soft 404 by showing real content on API failure
- 2026-03-31: Fixed Duplicate canonical with empty href in static HTML
