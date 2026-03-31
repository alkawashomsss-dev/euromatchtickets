# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration meta tags (title, description, canonical, robots)
- **Structured Data:** Fully managed by React components (no duplication)
- **Sitemap:** Dynamic XML Sitemap Index (multiple category sitemaps)
- **Indexing:** IndexNow API (Bing/Yandex) + Background Auto-Indexer

## Structured Data Architecture (CLEAN)
- `StructuredData.jsx` components handle ALL JSON-LD schemas
- `index.html` vanilla JS handles ONLY: title, description, canonical, robots, h1
- All AggregateOffer schemas include `offerCount`

## SEO Protection
- 2025 pages: detected in vanilla JS -> instant `noindex, nofollow`
- Backend API: returns HTTP 410 Gone for inactive pages
- Static canonical tag in HTML (empty href) - JS fills correct URL synchronously
- Static robots meta in HTML: `index, follow` by default
- Fallback content in DynamicSEOPage.jsx prevents Soft 404 when API fails

## Database Status
- Total SEO pages: 1,762 (preview)
- Active pages: 1,098 (synced to production)
- Inactive (2025): 664 (returning 410 Gone + noindex)
- **PRODUCTION DB: 1,098 active pages (synced 2026-03-31)**

## Completed (All Sessions)
- [x] Fix "Duplicate, Google chose different canonical than user" - static canonical + empty href
- [x] Fix "Soft 404" - fallback content in DynamicSEOPage.jsx when API fails
- [x] Populate production database - 1,098 pages synced
- [x] Fix _redirects API proxy rule
- [x] Remove JSON-LD duplicates from index.html
- [x] 410 Gone for 2025 pages
- [x] Fix Render build error
- [x] Disable noindex override in React error state
- [x] Add static robots meta tag
- [x] Site-wide price reduction
- [x] MotoGP & Isle of Man TT circuit maps
- [x] International SEO pages (ES, DE, FR, IT)

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Activate Next Batch of 100 SEO Pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content

## Known Issues
- Login uses Emergent-managed Google Auth (user needs to provide own credentials)

## Date Log
- 2026-03-31: Synced 1,098 active SEO pages to production database
- 2026-03-31: Fixed Soft 404 - DynamicSEOPage.jsx now shows real content when API fails
- 2026-03-31: Fixed "Duplicate canonical" - static canonical tag with empty href in HTML
- 2026-03-31: Added static robots meta tag to index.html
- 2026-03-31: All 44 tests passed (21 backend + 23 frontend)
