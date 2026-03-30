# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration tag injection
- **Sitemap:** Static XML Sitemap Index (9 sitemaps, 2,133 URLs)
- **Indexing:** IndexNow API (Bing/Yandex)

## What's Been Implemented

### F1 Pages (Each Visually Unique)
- Bahrain GP - dark night-race amber theme + countdown
- Monza GP - light Italian tricolor + stats panel + timeline + Tifosi section
- Monaco GP - dark navy/gold luxury + price comparison table + experiences
- + 13 more F1 GP pages

### Content Clusters (Monza Encyclopedia - NEW)
- `/monza-best-seats-guide` - 6 grandstands rated with pros/cons/scores
- `/monza-ticket-prices` - Full price comparison table vs competitors (save 40%)
- `/how-to-get-to-monza` - Train, metro, car, flight options with step-by-step
- `/monza-f1-travel-tips` - Expert tips: timing, food, photos, weather, schedule

### Content Clusters (Monaco & Bahrain - NEW)
- `/monaco-gp-vip-experience` - Yacht hospitality, Champions Club, Casino Square packages
- `/bahrain-f1-night-race-guide` - Why the night race is special, schedule, tips

### Power Pages (NEW)
- `/ultimate-f1-tickets-guide-2026` - 15 races rated, priced, compared. "Our Picks" awards. The SEO authority page linking to everything.

### Football Hub Pages (Link Wheel - 8 hubs connected)
- Real Madrid, Barcelona, Man City, Liverpool, Arsenal
- Bayern Munich (NEW), PSG (NEW), Juventus (NEW)

### Concert Pages
- Taylor Swift London, Coldplay Europe 2026 (NEW), The Weeknd, Bruno Mars, Metallica, Harry Styles

### SEO Infrastructure
- Pre-hydration vanilla JS SEO tags (canonical, title, description, h1)
- Static Sitemap Index (9 sitemaps, 2,133 URLs)
- IndexNow (Bing/Yandex)
- CTR-optimized titles with urgency signals
- BreadcrumbList + FAQPage + Product/Review + Article schemas
- Internal Link Wheel across all hubs and clusters

## P1 (Next)
- [ ] Expand Content Clusters to Monaco (5 pages) and Bahrain (5 pages)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] More Hub Pages (Bundesliga, Serie A teams)
- [ ] CTR Optimization for high-impression/low-click keywords

## P2 (Future)
- [ ] Price Comparison Tables on more pages
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content (360° photos, video highlights)
- [ ] F1 Ticket Quiz ("Find your perfect seat")
- [ ] Accelerated Indexing automation
- [ ] User Login with custom credentials

## Known Issues
- Login uses Emergent-managed Google Auth (user credentials not provided)
- Production deployment pending (user must Save to Github + deploy on Render)

## Date Log
- 2026-03-30: Created 7 new Content Cluster + Power pages (all tested 100%)
- 2026-03-30: Created Bayern Munich, PSG, Juventus, Coldplay pages
- 2026-03-30: Redesigned Bahrain/Monza/Monaco with unique designs
- 2026-03-30: Enhanced Link Wheel (8 football hubs + clusters + guide pages)
- 2026-03-30: CTR-optimized titles with urgency signals
- 2026-03-30: Sitemap: 2,133 URLs across 9 valid sitemaps
- 2026-03-30: Tests: iteration_33 (100%), iteration_34 (100% - 28/28)
