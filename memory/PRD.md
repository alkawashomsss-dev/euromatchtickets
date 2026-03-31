# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. Goal: sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI + MongoDB
- **SEO Engine:** Vanilla JS in index.html for pre-hydration meta tags (title, description, canonical, robots)
- **Structured Data:** Fully managed by React components (no duplication)
- **Sitemap:** Dynamic XML Sitemap Index (multiple category sitemaps)
- **Indexing:** IndexNow API (Bing/Yandex) + Background Auto-Indexer

## Structured Data Architecture (CLEAN)
- `StructuredData.jsx` components handle ALL JSON-LD schemas:
  - `EventStructuredData` → Event + Product (per event page)
  - `BreadcrumbStructuredData` → BreadcrumbList (per page)
  - `FAQStructuredData` → FAQPage (per page with FAQ)
  - `OrganizationStructuredData` → Organization (global via App.js)
  - `WebsiteStructuredData` → WebSite (global via App.js)
  - `LocalBusinessStructuredData` → LocalBusiness (global via App.js)
- `index.html` vanilla JS handles ONLY: title, description, canonical, robots, h1
- All AggregateOffer schemas include `offerCount`

## SEO Protection
- 2025 pages: detected in vanilla JS → instant `noindex, nofollow`
- Backend API: returns HTTP 410 Gone for inactive pages
- Production catch-all: returns real HTTP 410 for 2025 URLs
- Bing Indexing Bot: only submits active pages

## Database Status
- Total SEO pages: 1,762
- Active pages: 1,098
- Inactive (2025): 664 (returning 410 Gone + noindex)

## P1 (Next)
- [ ] Enhance Owner Dashboard (charts + sales reports)
- [ ] Activate Next Batch of 100 SEO Pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Media & Video Content

## Known Issues
- Login uses Emergent-managed Google Auth
- Production deployment pending

## Date Log
- 2026-03-31: Fixed FAQPage duplication — removed ALL JSON-LD from vanilla JS
- 2026-03-31: Added offerCount to ALL 45 AggregateOffer schemas across all pages
- 2026-03-31: Removed static JSON-LD from index.html (Organization, WebSite, BreadcrumbList)
- 2026-03-31: Verified zero schema duplicates on all page types
- 2026-03-31: Deactivated 664 old 2025 pages → HTTP 410 Gone
- 2026-03-31: Added 2025 detection in vanilla JS → instant noindex
