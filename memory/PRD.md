# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Google Search Console Fixes (April 12, 2026)

### Problem 1: "noindex" on 56 pages → FIXED
### Problem 2: Duplicate pages (ugly event IDs) → FIXED
### Problem 3: Checkout URLs indexed → FIXED
### Problem 4: Redirects (http→https, www→non-www) → OK
### Problem 5: Crawled not indexed (37 pages) → FIXED
### Problem 6: Duplicate canonical mismatch → FIXED

## GSC Keyword Optimization (April 14, 2026)

### Justin Bieber Amsterdam 2026 → NEW PAGE CREATED
- Dedicated landing page: `/justin-bieber-amsterdam-2026-tickets`
- Premium page with MusicEvent, FAQPage, Product, BreadcrumbList schemas
- 10 rich FAQs, price comparison, venue guide, travel guide, setlist preview
- VIP Meet & Greet packages, 20+ keyword 301 redirects (incl. Dutch)
- Pre-hydration metadata, event in MongoDB, sitemap priority 0.95

### Spa F1 Tickets → ENHANCED
- Added "2026 Season Preview" with ticket categories explained
- Spa-Francorchamps history, competitive comparison section

## Database Cleanup (April 14, 2026)

### Event Dates Fixed
- Fixed 110 events with script-generated timestamps (T05:32, T09:55, T22:20)
- All events now have realistic times: F1 races at proper local times, concerts at 19:30-20:30, football at 16:30-21:00
- F1 2026 calendar: Mar-Dec with realistic race schedule (Bahrain March → Abu Dhabi December)
- World Cup 2026: June 15 - July 19 with proper kick-off times

### Duplicates Removed (26 events deleted)
- 3x Real Madrid vs Barcelona → kept 1 El Clasico
- 2x Harry Styles duplicate tours → kept 1
- 2x Monaco GP → kept 1
- 2x Singapore GP → kept Night Race
- 2x Las Vegas GP → kept Night Race
- 15x FIFA World Cup match duplicates (match type vs worldcup type)
- 3x Boxing/UFC with 2025 slugs
- 1x FINAL_TEST event

### Search Improvement
- Events page search now uses debounced auto-search (400ms)
- No longer requires pressing Enter to search

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
- Debounced live search on Events page
- Clean event database (135 events, no duplicates, realistic dates)

## Pending
- P1: Owner Dashboard (charts, sales reports)
- P2: Email Drip Campaign templates by event type
- P3: French/Italian SEO expansion
- P4: Retargeting Pixel segmentation
- P5: Social Signals (Reddit/TikTok tracking)
