# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO to rank #1 and sell 1,000 tickets/month.

## Session 12 Summary (March 30, 2026)

### Critical SEO Fix: Duplicate Content & Canonical Resolution
**Root Cause Identified:** Every page on the site returned IDENTICAL HTML to Google's crawler:
- Same `<title>` for all 368+ pages
- Same `<meta description>` for all pages
- Same `<h1>` tag for all pages
- `og:url` and `twitter:url` hardcoded to homepage
- All hreflang tags pointing to same URL (wrong!)
- API `/api/seo/page-meta` returning generic title for all pages

**Fix Implemented:**
1. **Comprehensive inline metadata map** in `index.html` with 80+ page-specific titles, descriptions, and H1s
2. **Dynamic meta tag injection** via synchronous script (runs before React hydration)
3. **Fixed hreflang** - pages with translations get proper bidirectional links (6 tags), pages without get only x-default + en (2 tags)
4. **Removed hardcoded og/twitter tags** - all set dynamically per page
5. **Fixed API endpoint** - `/api/seo/page-meta` now returns unique titles for 40+ React routes including international pages
6. **Dynamic H1** - SSR fallback H1 updates via `window.__seoH1` before render

### Google Search Console Issues Addressed
- "Duplicate, Google chose different canonical than user" (24 pages) → FIXED
- "Pages excluded by noindex tag" (19 pages) → FIXED (all active pages have `index, follow`)
- "Discovered - not indexed" (349 pages) → Will resolve after deployment as Google re-crawls

## Previous Sessions Summary
- Session 11: Hub Pages, Link Wheel, CTR optimization, International pages (ES, DE, FR, IT), Page activation to 200
- Session 10: Price reduction, MotoGP/TT maps, Soft 404 fix, Sitemap fix, 410 Gone implementation
- Earlier: Core marketplace, Google Auth, Stripe, Email, SEO pages, Blog

## Current Stats
- Active SEO pages: 200
- Indexed by Google: 37 (target: 200+ after fix deploys)
- Hub pages: 7 (Champions League, Real Madrid, Barcelona, Man City, Liverpool, Arsenal)
- International pages: 4 languages (ES, DE, FR, IT)
- Sitemap URLs: 368
- Pages with unique inline metadata: 80+

## Prioritized Backlog
### P0 (URGENT)
- User must deploy to production (Save to Github → Render deploy)
### P1
- Owner Dashboard with charts and sales reports
- More hub pages (Bayern Munich, Juventus, PSG)
### P2
- Core Web Vitals optimization
- Activate next batch of 100 SEO pages
- Login flow (BLOCKED on user credentials)
### P3
- Price Comparison Tables
- Affiliate Program
- Video/GIF highlights
