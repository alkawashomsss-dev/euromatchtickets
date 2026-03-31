# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration tag injection
- **Sitemap:** Dynamic XML Sitemap Index (multiple category sitemaps)
- **Indexing:** IndexNow API (Bing/Yandex) + Background Auto-Indexer
- **Production:** Backend serves React build from /static with catch-all route

## Critical SEO Architecture
1. **Vanilla JS (index.html):** Detects 2025 pages → sets `noindex` immediately before React
2. **React (DynamicSEOPage):** Fetches API → 410 response → sets `noindex` via SEOHead
3. **Backend API:** Returns HTTP 410 Gone for inactive pages
4. **Production catch-all:** Returns real HTTP 410 + noindex HTML for 2025 URLs
5. **Bing Indexing Bot:** Only submits active pages (filtered by `active: True`)

## What's Been Implemented

### F1 Pages (Each Visually Unique)
- Bahrain GP, Monza GP, Monaco GP + 13 more

### Content Clusters
- Monza: best seats, ticket prices, travel guide, tips
- Monaco: VIP experience
- Bahrain: night race guide
- Ultimate F1 Guide 2026 (power page)

### Football Hub Pages (Link Wheel - 8 hubs)
- Real Madrid, Barcelona, Man City, Liverpool, Arsenal, Bayern, PSG, Juventus

### Concert Pages
- Taylor Swift, Coldplay 2026, The Weeknd, Bruno Mars, Metallica, Harry Styles

### International SEO (4 languages)
- Spanish, German, French, Italian

### SEO Infrastructure
- Pre-hydration vanilla JS SEO tags
- Dynamic Sitemap Index
- IndexNow + Background Auto-Indexer (6-hour cycle)
- CTR-optimized titles
- Structured data schemas
- HTTP 410 Gone for deactivated pages
- 2025 page detection in vanilla JS (noindex)

## Database Status
- Total SEO pages: 1,762
- Active pages: 1,098
- Inactive (2025): 664 (returning 410 Gone + noindex)
- Sitemap URLs: ~1,349

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Activate Next Batch of 100 SEO Pages
- [ ] More Hub Pages (Bundesliga, Serie A teams)

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content
- [ ] F1 Ticket Quiz
- [ ] User Login with custom credentials

## Known Issues
- Login uses Emergent-managed Google Auth (user credentials not provided)
- Production deployment pending (user must Save to Github + deploy on Render)

## Date Log
- 2026-03-30: Content Clusters, Link Wheels, CTR optimization, Auto-Indexer
- 2026-03-31: Deactivated 664 old 2025 pages → HTTP 410 Gone
- 2026-03-31: Added 2025 detection in vanilla JS → instant noindex
- 2026-03-31: Added production catch-all route → real HTTP 410 for 2025 URLs
- 2026-03-31: Fixed Bing Indexing Bot to only submit active pages
- 2026-03-31: React DynamicSEOPage handles 410 with noIndex
