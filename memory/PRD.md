# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React with pre-hydration vanilla JS for SEO
- **SEO Strategy**: Pre-hydration meta tags in index.html + React-managed JSON-LD Schema

## SEO Architecture
### Pre-Hydration (index.html vanilla JS):
- Injects meta tags (title, description, canonical, robots) before React loads
- Generates JSON-LD schemas (Organization, WebSite, Event, Product, AggregateRating, BreadcrumbList, FAQPage)
- S object contains per-page FAQ and event data for top-priority keywords
- M object contains per-page metadata (title, description) for all known pages

### React-Managed (DynamicSEOPage.jsx):
- Fetches page data from API (/api/seo/page/{slug})
- Renders visible FAQ accordion section
- Generates FAQPage, Event, Product, BreadcrumbList JSON-LD schemas
- Cleans up pre-hydration schemas to prevent duplication

### Schema Deduplication:
- SEOHead.jsx removes ph-event, ph-bread, ph-faq on mount
- StructuredData.jsx removes ph-org, ph-site on mount
- Each schema type appears exactly once per page

## Programmatic SEO (Implemented 2026-03-31)
- 91 unique landing pages generated for city+event combinations
- Page types: F1+City (15), Football+City (12), Concert+City (12), Champions League+City (10), World Cup+City (6), Buy Team (20), Niche (16)
- Each page has: unique title, meta description, 300-1200 chars unique content, 3 unique FAQs, correct prices
- All pages active, in sitemaps, with proper canonical URLs

## Active Pages Summary
- Total active SEO pages: ~1,200
- Static HTML pre-hydration pages: 35+ (top keywords in S object)
- Programmatic pages: 91
- Legacy/seed pages: ~1,100+

## Completed Features
- [x] Pre-hydration JSON-LD schemas (FAQPage, Event, Product, AggregateRating, BreadcrumbList)
- [x] Global Organization + WebSite + SearchAction schemas
- [x] Visible FAQ accordion on all SEO pages (pre-hydrated + API-loaded)
- [x] Schema deduplication system
- [x] Programmatic SEO: 91 unique city+event pages
- [x] Enhanced internal linking with programmatic pages
- [x] City badge display (replaces internal page_type)
- [x] All sitemaps updated with programmatic pages
- [x] Site-wide price reduction
- [x] MotoGP & Isle of Man TT circuit maps
- [x] Spanish & German SEO landing pages
- [x] Canonical URL fix
- [x] Soft 404 fix with content fallbacks
- [x] 410 Gone for inactive pages
- [x] Bing title/H1 fixes

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts, sales reports)
- [ ] Activate Next Batch of SEO Pages
- [ ] French/Italian SEO landing pages

## P2 (Future)
- [ ] Google Merchant Center integration
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Video/GIF highlights on event pages

## Date Log
- 2026-03-31: Implemented world-class SEO schemas (FAQ, Rating, Breadcrumb, Organization, WebSite)
- 2026-03-31: Generated 91 programmatic SEO pages (city+event combinations)
- 2026-03-31: Updated all sitemaps with new programmatic pages
- 2026-03-31: Enhanced internal linking with programmatic page URLs
- 2026-03-31: Fixed FAQ rendering for API-loaded pages (fallback from prehydrated to page.faq)
