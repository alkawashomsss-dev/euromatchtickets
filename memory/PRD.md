# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React with pre-hydration vanilla JS for SEO
- **SEO Strategy**: Pre-hydration meta tags + React JSON-LD + Programmatic SEO + Google Merchant Center

## Google Merchant Center Integration (Implemented 2026-03-31)
- **Feed URL**: `https://euromatchtickets.com/api/merchant/feed.xml`
- **Feed Status**: `https://euromatchtickets.com/api/merchant/feed-status`
- **Total Products**: 1,200
- **Format**: RSS 2.0 with Google Shopping namespace
- **Categories**: F1 (387), Concert (446), Football (269), World Cup (28)
- **Resale Disclosure**: Visible on all pages (Header + landing pages)
- **robots.txt**: Updated to allow Google access to feed

### User Setup Required:
1. Go to https://merchants.google.com
2. Add and verify euromatchtickets.com
3. Add feed URL: https://euromatchtickets.com/api/merchant/feed.xml
4. Apply for Event Ticket Seller certification in Google Ads
5. Products appear in Google Shopping within 2-5 days

## SEO Architecture
### Pre-Hydration (index.html vanilla JS):
- Meta tags (title, description, canonical, robots) injected before React
- JSON-LD schemas: Organization, WebSite, Event, Product, AggregateRating, BreadcrumbList, FAQPage
- S object: per-page FAQ and event data for 35+ top keywords

### Programmatic SEO (91 pages):
- F1+City (15), Football+City (12), Concert+City (12)
- Champions League+City (10), World Cup+City (6)
- Buy Team Tickets (20), Niche pages (16)
- Each with unique content, 3 FAQs, correct prices

## Active Pages: ~1,200 total

## Completed Features
- [x] Google Merchant Center product feed (1,200 products)
- [x] Resale disclosure on all pages
- [x] robots.txt updated for merchant feed
- [x] Pre-hydration JSON-LD schemas
- [x] 91 programmatic SEO pages
- [x] FAQ accordion on all SEO pages
- [x] Schema deduplication
- [x] Enhanced internal linking
- [x] All sitemaps updated

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts, sales reports)
- [ ] Activate Next Batch of SEO Pages
- [ ] French/Italian SEO landing pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program

## Date Log
- 2026-03-31: World-class SEO schemas (FAQ, Rating, Breadcrumb, Organization, WebSite)
- 2026-03-31: 91 programmatic SEO pages generated
- 2026-03-31: Google Merchant Center feed (1,200 products, RSS 2.0)
- 2026-03-31: Resale disclosure + robots.txt update
