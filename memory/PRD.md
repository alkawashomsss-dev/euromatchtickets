# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration tag injection
- **Sitemap:** Dynamic XML Sitemap Index (multiple category sitemaps)
- **Indexing:** IndexNow API (Bing/Yandex) + Background Auto-Indexer

## What's Been Implemented

### F1 Pages (Each Visually Unique)
- Bahrain GP - dark night-race amber theme + countdown
- Monza GP - light Italian tricolor + stats panel + timeline + Tifosi section
- Monaco GP - dark navy/gold luxury + price comparison table + experiences
- + 13 more F1 GP pages

### Content Clusters (Monza Encyclopedia)
- `/monza-best-seats-guide` - 6 grandstands rated with pros/cons/scores
- `/monza-ticket-prices` - Full price comparison table vs competitors
- `/how-to-get-to-monza` - Transport options with step-by-step
- `/monza-f1-travel-tips` - Expert tips: timing, food, photos, weather

### Content Clusters (Monaco & Bahrain)
- `/monaco-gp-vip-experience` - Yacht hospitality, Champions Club
- `/bahrain-f1-night-race-guide` - Night race guide, schedule, tips

### Power Pages
- `/ultimate-f1-tickets-guide-2026` - 15 races rated, priced, compared

### Football Hub Pages (Link Wheel - 8 hubs connected)
- Real Madrid, Barcelona, Man City, Liverpool, Arsenal
- Bayern Munich, PSG, Juventus

### Concert Pages
- Taylor Swift London, Coldplay Europe 2026, The Weeknd, Bruno Mars, Metallica, Harry Styles

### International SEO Pages
- Spanish: `/es/comprar-entradas` + sub-pages
- German: `/de/tickets-kaufen` + sub-pages
- French: `/fr/acheter-billets` + sub-pages
- Italian: `/it/biglietti` + sub-pages

### SEO Infrastructure
- Pre-hydration vanilla JS SEO tags (canonical, title, description, h1)
- Dynamic Sitemap Index with category sitemaps
- IndexNow (Bing/Yandex) + Google Ping
- CTR-optimized titles with urgency signals
- BreadcrumbList + FAQPage + Product/Review + Article schemas
- Internal Link Wheel across all hubs and clusters
- Background Auto-Indexer (6-hour cycle)
- HTTP 410 Gone for deactivated/2025 pages

## Database Status
- Total SEO pages: 1,762
- Active pages: 1,098
- Inactive (2025) pages: 664 (returning 410 Gone)
- Sitemap URLs: ~1,349

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Activate Next Batch of 100 SEO Pages (use /api/seo/activate-batch)
- [ ] More Hub Pages (Bundesliga, Serie A teams)

## P2 (Future)
- [ ] Price Comparison Tables on more pages
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content (360 photos, video highlights)
- [ ] F1 Ticket Quiz ("Find your perfect seat")
- [ ] User Login with custom credentials

## Known Issues
- Login uses Emergent-managed Google Auth (user credentials not provided)
- Production deployment pending (user must Save to Github + deploy on Render)

## Date Log
- 2026-03-30: Created 7 new Content Cluster + Power pages
- 2026-03-30: Created Bayern Munich, PSG, Juventus, Coldplay pages
- 2026-03-30: Redesigned Bahrain/Monza/Monaco with unique designs
- 2026-03-30: Enhanced Link Wheel (8 football hubs + clusters + guide pages)
- 2026-03-30: CTR-optimized titles with urgency signals
- 2026-03-30: Deactivated 664 old 2025 pages (now return HTTP 410 Gone)
- 2026-03-30: Fixed noindex issue - 410 pages no longer send noindex meta tag
- 2026-03-30: Sitemap cleaned - only active 2026 pages included
