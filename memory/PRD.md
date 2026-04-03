# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, an aggressive SEO-focused ticket marketplace. The core goal is massive scale, zero-click Google rankings, and immediate indexing. The app requires advanced programmatic SEO, a Google Merchant Center XML feed, comprehensive Schema.org/JSON-LD integration, and a premium, high-conversion UI/UX.

## Platform
- **Frontend**: React (port 3000)
- **Backend**: FastAPI (port 8001)
- **Database**: MongoDB
- **Domain**: euromatchtickets.com

## User Language
Arabic (mandatory for all agent communication)

## Core Features
- Event browsing and ticket marketplace
- Massive programmatic SEO (1,200+ active pages)
- Google Merchant Center XML Feed (Global Setup - EUR only)
- International SEO pages (Spanish, German, French, Italian)
- Interactive venue maps (MotoGP, Isle of Man TT)
- Trust signals (reviews, guarantees, buyer protection)
- Structured Data (JSON-LD)
- Background SEO bots (Bing daily indexing, auto-reindex every 6h)

## Key Architecture
- `/app/backend/routes/seo.py` - SEO routes, merchant feed, sitemaps
- `/app/backend/server.py` - Main FastAPI app with middleware
- Merchant feed URL: `/api/merchant/feed.xml`
- Sitemap: `/api/sitemap.xml` and static `public/sitemap.xml`

## What's Been Implemented

### Merchant Center Feed - Global Setup (Feb 2026)
- XML Feed: 1,200 products, EUR only, ~3.8 MB
- TSV Feed: 1,200 products, EUR only, ~899 KB
- Deleted old multi-currency static files (92 MB XML, 22 MB TSV)
- Google auto-converts EUR to local currencies for target countries
- Free shipping (0 EUR) for 33 countries

### SEO Infrastructure
- 100+ active SEO pages with meta descriptions
- Static sitemap.xml with 356 URLs
- 410 Gone for deactivated pages
- Bing URL Submission API (daily 100 URLs)
- IndexNow integration (Yandex, Bing, Seznam, Naver)
- Auto-reindexing every 6 hours

### International SEO
- Spanish pages (/es/comprar-entradas, etc.)
- German pages (/de/tickets-kaufen, etc.)
- French pages (/fr/acheter-billets, etc.)
- Italian pages (/it/biglietti, etc.)

### Site-Wide Price Reduction
- All ticket prices set to cheapest in market
- Updated all seed functions

### Motorsport Experience
- Realistic SVG circuit maps for MotoGP and Isle of Man TT
- Authentic section names for motorsport events

## Pending Issues
- P2: Login Flow - needs user's own Google OAuth credentials (currently using Emergent-managed auth)
- P2: Google Indexing API - requires user's Google Service Account JSON key

## Upcoming Tasks
- P1: Enhance Owner Dashboard (charts, sales reports)
- P2: Add more international SEO pages
- P2: Activate next batch of 100 SEO pages

## Future Tasks
- Improve Price Comparison Tables
- Integrate Ticket Supplier Affiliate Program
- Add "Price Match Guarantee" badge
- Add video/GIF highlights to event pages

## 3rd Party Integrations
- Google Merchant Center Feed (XML)
- Bing URL Submission API
- IndexNow (Yandex, Bing, Seznam, Naver)
- Emergent-managed Google Auth

## Key DB Collections
- `seo_pages`: SEO landing pages (active field, meta_description, price_low, price_high)
- `tickets`: 82,000+ tickets with prices
- `events`: Event details with dates and venues
- `bing_submitted_urls`: URL submission tracking
- `bing_indexing_logs`: Daily indexing reports
