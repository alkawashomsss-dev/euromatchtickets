# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO to rank #1 and sell 1,000 tickets/month.

## Session 11 Summary (March 22-26, 2026)

### Critical Fixes
- **Duplicate Canonical**: Removed hardcoded homepage canonical, dynamic script per page
- **X-Robots-Tag**: Backend middleware explicitly sets `index, follow` for production

### Hub Pages + Link Wheel (7 total)
- Champions League Hub (69 links, 8 FAQ, Review Schema)
- Real Madrid Hub (68 links, 6 FAQ, Review Schema)
- Barcelona Hub (70 links, 6 FAQ, concerts section)
- Man City Hub (64 links, 6 FAQ, Review Schema)
- Liverpool Hub (NEW - 5 FAQ, Review Schema, Anfield content)
- Arsenal Hub (NEW - 5 FAQ, Review Schema, Emirates content)
- Link Wheel: ALL hubs interconnected

### International SEO (4 languages)
- Spanish: `/es/comprar-entradas` (existing)
- German: `/de/tickets-kaufen` (existing)
- French: `/fr/acheter-billets` (NEW) + 3 sub-routes
- Italian: `/it/biglietti` (NEW) + 3 sub-routes

### CTR Optimization
- Optimized titles for: champions league tickets, taylor swift tickets, bahrain gp, ucl tickets
- Added `/taylor-swift-tickets` exact-match keyword route
- Review Schema on Taylor Swift page (4.9/5, 5,823 reviews)
- Updated 8 DB page titles with prices + urgency words

### Page Activation
- Activated additional 100 pages → **200 active pages** total
- Sitemap: **368 URLs**
- 437 URLs submitted to Yandex IndexNow

## Current Stats
- Active SEO pages: 200
- Indexed by Google: 37 (target: 200+)
- Hub pages: 7
- International pages: 4 languages
- Sitemap URLs: 368

## Prioritized Backlog
### P1
- Owner Dashboard with charts and sales reports
### P2
- Core Web Vitals optimization
- More hub pages (Bayern Munich, Juventus, PSG)
- Login flow (BLOCKED on user credentials)
### P3
- Price Comparison Tables, Affiliate Program, Video content
