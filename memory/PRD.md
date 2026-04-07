# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, an aggressive SEO-focused ticket marketplace with massive programmatic SEO, Google Merchant Center feed, Schema.org/JSON-LD, and premium UI/UX.

## Platform
- **Frontend**: React (port 3000) | **Backend**: FastAPI (port 8001) | **Database**: MongoDB
- **Domain**: euromatchtickets.com

## User Language: Arabic (mandatory)

## What's Been Implemented

### April 7, 2026 - Comprehensive 13-Point SEO Overhaul
1. **noindex Fix**: Activated all 664 inactive pages → 1,890 total active
2. **Event Ended Pages**: 410 Gone → "Event Ended" with related events instead of deletion
3. **Canonical Fix**: Proper canonical URLs via SEOHead.jsx + pre-hydration
4. **SEO-friendly URLs**: Already implemented (slugs)
5. **Domain Unification**: Canonicals → https://euromatchtickets.com
6. **Sitemap + robots.txt**: Updated (2,263 URLs, 11 sitemaps), robots.txt blocks technical pages
7. **Conversion Optimization**: Scarcity indicators ("X tickets left"), Sticky CTA bar, demand badges ("X viewing now"), FAQ Schema
8. **Internal Linking**: RelatedEventsSection cross-links categories
9. **Multi-language Pages**: /es, /de, /fr, /it active
10. **Re-indexing**: 2,125 URLs submitted via IndexNow
11. **Redirects**: Proper 301 redirect logic
12. **Performance**: Lazy loading, HTTPS, compressed images
13. **Merchant Feed**: 1,864 products, unique images, 0 promo words, EUR only

### April 4, 2026 - Structured Data + SEO Titles
- Event/Product/FAQPage/BreadcrumbList Schema with proper organizers (FIA, UEFA, FIFA)
- 1,890 pages with optimized titles + meta descriptions + FAQs
- 1,864 unique product images (static JPEG)

### Previous Work
- Global Setup Merchant Feed (EUR only)
- Site-wide price reduction
- MotoGP/Isle of Man TT maps
- International SEO (ES, DE, FR, IT)
- Bing/IndexNow integration

## Pending
- P2: Login Flow (needs user Google OAuth credentials)
- P2: Google Indexing API (needs Service Account key)

## Upcoming
- P1: Owner Dashboard (charts, sales reports)
- P2: Activate next SEO page batch
- P2: More international SEO pages

## Future
- Price Comparison Tables | Affiliate Program | Performance Max support | Video highlights
