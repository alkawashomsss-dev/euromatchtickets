# EuroMatchTickets - PRD (Product Requirements Document)

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month. Full-stack FastAPI/React application requiring premium UI/UX, structured data, and unique landing pages.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration tag injection
- **Sitemap:** Static XML Sitemap Index (9 sitemaps, 2,126+ URLs)
- **Indexing:** IndexNow API (Bing/Yandex)

## Core Requirements
- SEO-optimized ticket marketplace
- Unique, non-template landing pages per event
- Advanced Structured Data (JSON-LD: Event, FAQ, BreadcrumbList, AggregateRating, Review, Offer)
- Link Wheel strategy connecting hub pages
- Multilingual support (EN, ES, DE, FR, IT)
- Price competitiveness (cheapest in market)

## What's Been Implemented

### Pages & Hubs (All with unique designs + Structured Data + FAQ)
- **F1 Pages (each visually unique):**
  - Bahrain GP (dark night-race amber theme + countdown)
  - Monza GP (light Italian tricolor + stats panel + timeline)
  - Monaco GP (dark navy/gold luxury + price comparison table + experiences grid)
  - + 13 more F1 GP pages
- **Football Hub Pages (Link Wheel):**
  - Real Madrid, Barcelona, Man City, Liverpool, Arsenal
  - Bayern Munich (NEW), PSG (NEW), Juventus (NEW)
- **Concert Pages:**
  - Taylor Swift London, Coldplay Europe 2026 (NEW), The Weeknd, Bruno Mars, Metallica, Harry Styles, etc.
- **Major Events:** World Cup 2026, Super Bowl, El Clasico, Champions League
- **Multilingual:** Spanish, German, French, Italian landing pages
- **Info Pages:** About, FAQ, Reviews, Blog, Contact, Terms, Privacy, etc.

### SEO Infrastructure
- Pre-hydration vanilla JS SEO tags in index.html (CRITICAL - DO NOT BREAK)
- Static Sitemap Index (9 categorized sitemaps, 2,126 URLs)
- IndexNow integration (Bing/Yandex)
- 410 Gone for deactivated pages
- Correct canonical URLs on all pages
- BreadcrumbList + FAQPage + Product/Review schemas on all major pages

### Backend
- Event/ticket CRUD APIs
- SEO page management with active/inactive toggle
- Sitemap regeneration API
- Bing URL submission bot (daily)
- Cleanup bot for expired events

## P0 (Critical) - COMPLETED
- [x] Fix duplicate canonical issue
- [x] Make pages visually unique (Bahrain/Monza/Monaco completely different)
- [x] Advanced Structured Data on all major pages
- [x] Hub pages with Link Wheel (8 football hubs connected)

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Additional Hub Pages (more Bundesliga, Serie A teams)
- [ ] Content Clusters (sub-pages per event category)
- [ ] CTR Optimization for high-impression/low-click keywords

## P2 (Future)
- [ ] Price Comparison Tables on more pages
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content (360° photos, video highlights)
- [ ] Accelerated Indexing automation (auto-ping on publish)
- [ ] User Login with custom credentials (currently Emergent Google Auth)

## Known Issues
- Login flow uses Emergent-managed Google Auth (user's own credentials not provided)
- Production deployment pending (user must click "Save to Github" and deploy on Render)

## Date Log
- 2026-03-30: Created Bayern Munich, PSG, Juventus hub pages + Coldplay concert page
- 2026-03-30: Redesigned Bahrain GP (night theme), Monza GP (Italian theme), Monaco GP (luxury theme) - all visually unique
- 2026-03-30: Enhanced Link Wheel across all 8 football hubs
- 2026-03-30: Regenerated sitemap (2,126 URLs, 9 sitemaps)
- 2026-03-30: All tests passed (100% - iteration_33)
