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
- Massive programmatic SEO (1,226 active pages)
- Google Merchant Center XML Feed (Global Setup - EUR only)
- International SEO pages (Spanish, German, French, Italian)
- Interactive venue maps (MotoGP, Isle of Man TT)
- Trust signals (reviews, guarantees, buyer protection)
- Structured Data (JSON-LD) + FAQPage Schema
- Background SEO bots (Bing daily indexing, auto-reindex every 6h)

## What's Been Implemented

### April 4, 2026 - SEO Optimization Sprint
- **Titles Optimized**: All 1,226 active pages updated with keyword-rich, buying-intent titles under 60 chars
- **Meta Descriptions Added**: All 1,226 pages now have 150-160 char descriptions with CTA
- **FAQs Added**: All 1,226 pages have 5-6 category-specific FAQ questions with FAQPage Schema for Google rich snippets
- **Alt Text Updated**: Image alt attributes now include event name, venue, city, year
- **Product Images Generated**: 1,200 unique static JPEG images (event name + venue + city overlay)
- **Merchant Feed Cleaned**: All titles/descriptions stripped of promotional text ("Verified", "Cheap", "Best", prices)
- **Sitemap Regenerated**: 1,599 URLs across 9 sitemaps
- **Indexing Triggered**: 1,463 URLs submitted to search engines

### Merchant Center Feed - Global Setup
- XML Feed: 1,200 products, EUR only, ~3.5 MB
- TSV Feed: 1,200 products, EUR only, ~830 KB
- 1,200 unique product images (static JPEG)
- Clean factual descriptions - no promotional text
- Official brands: Formula 1, UEFA, FIFA, Live Nation
- Free shipping (0 EUR) for 33 countries
- Feed URL: `/api/merchant/feed.xml`

### Previous Work
- Site-wide price reduction (cheapest in market)
- MotoGP & Isle of Man TT interactive SVG maps
- International SEO pages (ES, DE, FR, IT)
- 100+ active SEO pages with 410 Gone for deactivated
- Static sitemap.xml generation
- Bing URL Submission API integration
- IndexNow integration

## Key Architecture
```
/app/
├── backend/routes/seo.py     - Feed generation, indexing, sitemap
├── backend/server.py          - Main FastAPI app
├── frontend/src/pages/DynamicSEOPage.jsx - SEO pages with FAQ
├── frontend/src/components/SEOHead.jsx   - Meta tags + canonical
├── frontend/public/product-images/       - 1,200 unique JPEGs
├── frontend/public/sitemap*.xml          - 9 sitemaps
├── optimize_seo_titles.py     - Title/meta optimization script
├── add_faqs.py / fix_faqs.py  - FAQ generation scripts
├── generate_product_images.py - Product image generator
└── generate_sitemaps.py       - Sitemap generator
```

## Pending Issues
- P2: Login Flow - needs user's own Google OAuth credentials
- P2: Google Indexing API - requires user's Google Service Account JSON key

## Upcoming Tasks
- P1: Enhance Owner Dashboard (charts, sales reports)
- P2: Activate next batch of SEO pages
- P2: Add more international SEO pages

## Future Tasks
- Improve Price Comparison Tables
- Integrate Ticket Supplier Affiliate Program
- Performance Max / Shopping campaign optimization
- Add video/GIF highlights to event pages
