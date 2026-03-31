# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React with pre-hydration vanilla JS for SEO
- **SEO Strategy**: Pre-hydration meta tags + React JSON-LD + Programmatic SEO + Google Merchant Center + Multi-Engine Indexing

## Indexing System (Nuclear Level)
### Active Channels (6/7):
1. **Bing API** - 100 URLs/day auto-submission (24h cycle)
2. **IndexNow Yandex** - 1,437 URLs submitted ✅
3. **IndexNow Seznam** - 1,437 URLs submitted ✅
4. **IndexNow Naver** - 1,437 URLs submitted ✅
5. **Google Sitemap Ping** - 10 sitemaps pinged every 6h
6. **Google Merchant Center** - 1,200 products in feed
7. **Google Indexing API** - REQUIRES USER SETUP (service account)

### Endpoints:
- `POST /api/seo/indexnow` - Nuclear submit to all engines
- `GET /api/seo/nuclear-status` - Full indexing status
- `GET /api/seo/indexing-progress` - Bing progress tracker
- `GET /api/merchant/feed.xml` - Google Shopping feed
- `GET /api/merchant/feed-status` - Feed stats

## Google Merchant Center
- Feed URL: `https://euromatchtickets.com/api/merchant/feed.xml`
- 1,200 products, RSS 2.0 with Google namespace
- Categories: F1 (387), Concert (446), Football (269), World Cup (28)

## Programmatic SEO: 91 unique pages
## Total Active Pages: ~1,200
## Total Sitemap URLs: ~1,574

## Completed Features
- [x] Nuclear multi-engine indexing (5 IndexNow + Bing API + Sitemap pings)
- [x] Google Merchant Center (1,200 products)
- [x] Pre-hydration JSON-LD (FAQ, Rating, Breadcrumb, Organization, WebSite)
- [x] 91 programmatic SEO pages
- [x] FAQ accordion on all SEO pages
- [x] Schema deduplication
- [x] Resale disclosure (Google requirement)
- [x] All sitemaps updated with fresh lastmod dates

## P1 (Next)
- [ ] Google Indexing API setup (requires user action)
- [ ] Enhance Owner Dashboard
- [ ] French/Italian SEO landing pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program

## Date Log
- 2026-03-31: Nuclear indexing submission (1,437 URLs to 3 engines = 4,311 total submissions)
- 2026-03-31: Google Merchant Center feed (1,200 products)
- 2026-03-31: 91 programmatic SEO pages
- 2026-03-31: World-class SEO schemas
- 2026-03-31: Updated all sitemap lastmod dates
