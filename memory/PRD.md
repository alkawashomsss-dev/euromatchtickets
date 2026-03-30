# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO to rank #1 and sell 1,000 tickets/month.

## Architecture
- **Frontend:** React SPA (craco), served as static files on Render
- **Backend:** FastAPI, MongoDB
- **SEO:** Dynamic inline metadata in index.html, static sitemap files, hreflang support

## Session 12 (March 30, 2026)

### 1. Critical SEO Fix: Duplicate Content & Canonical Resolution
**Root Cause:** Every page returned IDENTICAL HTML to Google (same title, description, H1, og:url, twitter:url).
**Fix:** Comprehensive inline metadata map in `index.html` for 80+ pages, dynamic meta tags, proper hreflang, and fixed API endpoint.

### 2. World-Class Sitemap System
**Built a comprehensive sitemap system with:**
- 9 category-specific XML sitemaps (core, f1-motorsport, football, concerts, worldcup, city-regional, events, international, guides)
- 2,125 total URLs with zero duplicates
- `<xhtml:link>` hreflang annotations in international sitemap
- `<image:image>` tags in events sitemap
- Smart priority calculation (1.00 for homepage, 0.95 for categories, 0.85 for events)
- Real `lastmod` from database timestamps
- Backend API: `/api/sitemap/status` and `/api/sitemap/regenerate`
- XML validation & search engine ping on generation
- Global deduplication across all sitemaps

### 3. Full Page Activation
- Activated all 1,762 SEO pages (previously only 200 were active)

## Current Stats
- Active SEO pages: 1,762
- Total sitemap URLs: 2,125
- Sitemaps: 9 category-specific + 1 index
- International pages: 19 (ES, DE, FR, IT)
- Hub pages: 5 (Real Madrid, Barcelona, Man City, Liverpool, Arsenal)

## Prioritized Backlog
### P0 (URGENT)
- User must deploy to production (Save to Github -> Render deploy)
### P1
- Owner Dashboard with charts and sales reports
- More hub pages (Bayern Munich, Juventus, PSG)
### P2
- Core Web Vitals optimization
- Login flow (BLOCKED on user credentials)
### P3
- Price Comparison Tables
- Affiliate Program
- Video/GIF highlights
