# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO strategy to rank #1 on Google and sell 1,000 tickets in the first month.

## What's Been Implemented

### Sessions 1-10 (Previous)
- Full-stack marketplace, 80+ SEO pages, Stripe checkout, Google OAuth
- SEO overhaul, Bing IndexNow, price reduction, circuit maps
- Spanish/German SEO pages, static sitemap, 410 Gone implementation

### Session 11 (March 22-25, 2026)

**CRITICAL FIX: "Duplicate Canonical" Resolved**
- Removed hardcoded homepage canonical from index.html
- Dynamic inline script creates correct canonical + og:url + hreflang per page
- SEOHead.jsx updated to prevent duplicate canonical tags
- Verified on 6+ page types

**Hub Pages + Link Wheel (SEO Power Play)**
- **Champions League Hub** (`/champions-league-tickets`): 69 internal links, 8 FAQ, Review Schema (4.8/5, 3,247 reviews), 4-category link section
- **Real Madrid Hub** (`/real-madrid-tickets`): 68 internal links, 6 FAQ, Review Schema (4.9/5, 2,841 reviews), El Clasico/UCL/La Liga matches
- **Barcelona Hub** (`/barcelona-tickets`): 70 internal links, 6 FAQ, Review Schema (4.8/5, 4,156 reviews), Football + Concerts at Camp Nou
- **Man City Hub** (`/manchester-city-tickets`): 64 internal links, 6 FAQ, Review Schema (4.8/5, 1,923 reviews), Premier League + UCL matches

**Link Wheel Structure:**
- Champions League ↔ Real Madrid ↔ Barcelona ↔ Man City (all interconnected)
- Each hub links to ALL other hubs + their own sub-pages
- Cross-category links (Football → F1, Concerts, International pages)

**Internal Linking Overhaul**
- InternalLinks component: Hub pages in all categories
- Footer: Champions League, Real Madrid, Barcelona, Man City prominent
- Footer concerts: Specific links (Taylor Swift, Weeknd, Bruno Mars)
- Sitemap updated with 3 new hub URLs (priority 0.95)
- 337 URLs submitted to Yandex IndexNow

## Active Architecture
- 4 Hub Pages (Champions League, Real Madrid, Barcelona, Man City)
- 100 active SEO database pages
- 1,662 inactive pages (noindex, 410 Gone)
- Static sitemap.xml: ~359 URLs
- Link Wheel: 4 hubs fully interconnected

## Prioritized Backlog
### P1
- Owner Dashboard with charts and sales reports
- French/Italian SEO Landing Pages
### P2
- Activate Next Batch of 100 SEO Pages
- Core Web Vitals optimization
- Login flow with user's own credentials (BLOCKED)
### P3
- Price Comparison Tables
- Ticket Supplier Affiliate Program
- "Price Match Guarantee" badge
- Video/GIF highlights on event pages
