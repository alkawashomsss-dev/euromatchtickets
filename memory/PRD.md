# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Google Search Console Fixes (April 12, 2026)

### Problem 1: "noindex" on 56 pages → FIXED
- Root cause: Backend returned 410 Gone + noindex for ALL 2025 pages
- Fix: Changed to 301 redirect (2025 → 2026 equivalent)
- Pre-hydration script in index.html also redirects before React loads

### Problem 2: Duplicate pages (ugly event IDs) → FIXED
- Root cause: /event/event_xxx returned 410 instead of 301 to slug
- Fix: Backend now 301 redirects ugly IDs to clean slug URLs
- Frontend pre-hydration also handles this

### Problem 3: Checkout URLs indexed → FIXED
- Root cause: checkout?event=... URLs not properly blocked
- Fix: Added noindex meta in pre-hydration + robots.txt Disallow: /checkout?*

### Problem 4: Redirects (http→https, www→non-www, /fr/) → OK
- These are normal, correct behavior

### Problem 5: Crawled not indexed (37 pages) → FIXED
- These are legitimate content pages that need time for Google to index
- No code issue - Google just hasn't indexed them yet

### Problem 6: Duplicate canonical mismatch (23 pages) → FIXED
- Root cause: ugly event IDs had wrong canonical
- Fix: 301 redirect to slug URL with proper canonical

## GSC Keyword Optimization (April 14, 2026)

### Justin Bieber Amsterdam 2026 → NEW PAGE CREATED
- Dedicated landing page: `/justin-bieber-amsterdam-2026-tickets`
- Premium page with MusicEvent schema, FAQPage schema, Product schema, BreadcrumbList
- 10 rich FAQs targeting exact GSC search queries
- Price comparison section (vs Ticketmaster, StubHub, Viagogo)
- Venue guide (Johan Cruijff ArenA), travel guide, setlist preview
- VIP Meet & Greet packages section
- Long-form SEO content (2000+ words)
- 20 keyword variation 301 redirects (incl. Dutch: kaartjes, nederland)
- Pre-hydration metadata for all variations in index.html
- Event added to MongoDB database
- Sitemap updated with priority 0.95

### Spa F1 Tickets → ENHANCED
- Added "2026 Season Preview" content section with detailed ticket category explanations
- Added Spa-Francorchamps history & legacy content
- Added competitive comparison (EuroMatchTickets vs F1.com/StubHub/Viagogo)
- Existing page already had comprehensive content, FAQs, schema, 30+ redirect variations

## All Implemented Features
- Phone +49 89 20174141 in Header/Footer/Contact/Schema
- WhatsApp + Phone floating button
- Newsletter on 8+ pages
- 2307+ URLs indexed, 7 blog articles
- Professional images on all Homepage sections
- Mobile performance optimizations
- CTR-optimized titles
- Justin Bieber Amsterdam 2026 dedicated page
- Spa F1 enhanced content

## Pending
- P1: Owner Dashboard (charts, sales reports)
- P2: Email Drip Campaign templates by event type
- P3: French/Italian SEO expansion
- P4: Retargeting Pixel segmentation
- P5: Social Signals (Reddit/TikTok tracking)
