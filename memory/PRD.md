# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Google Merchant Center + Nuclear Indexing

## Features Implemented

### AI Chatbot (2026-04-01)
- GPT-4.1-mini via Emergent LLM key (free)
- Floating chat widget on all pages
- Quick questions, session history, multilingual (EN/AR/DE/ES)
- Fallback responses if LLM fails
- POST /api/chat/message endpoint

### Google Merchant Center (2026-03-31)
- GET /api/merchant/feed.xml - 1,200 products RSS feed
- GET /api/merchant/feed-status

### Nuclear Indexing (2026-03-31)
- IndexNow to 5 engines (Bing, Yandex, Seznam, Naver, api.indexnow.org)
- Bing API auto-submission (100/day)
- Google sitemap ping (10 sitemaps, every 6h)
- POST /api/seo/indexnow, GET /api/seo/nuclear-status

### Programmatic SEO (2026-03-31)
- 91 unique city+event pages
- 15 new keyword FAQ pages in pre-hydration S object

### Rich Snippets (2026-03-31)
- FAQPage, Event, Product, AggregateRating, BreadcrumbList, Organization, WebSite schemas
- Schema deduplication system
- Category-based images for all schemas

### SEO Fixes (2026-03-31 - 04-01)
- Fixed "description missing" - all 1,200 pages have descriptions
- Fixed "image missing" - category-based images for all pages
- Canonical, Soft 404, 410 Gone, noindex all working

## Active Stats
- Total SEO pages: ~1,200
- Sitemap URLs: ~1,574
- Merchant products: 1,200
- IndexNow submissions: 4,311

## P1 (Next)
- [ ] Google Merchant Center setup (user action)
- [ ] Owner Dashboard (charts/sales)
- [ ] French/Italian SEO pages

## P2 (Future)
- [ ] Google Indexing API (requires service account)
- [ ] Price Comparison Tables
