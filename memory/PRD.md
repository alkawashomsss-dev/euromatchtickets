# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Google Merchant Center + Nuclear Indexing

## Features Implemented

### F1 Tickets Page Competitor Upgrade (2026-04-01) - DONE
- Complete page rewrite with real 2026 F1 data
- **2026 Driver Standings** (22 drivers, after Round 3 Japanese GP): Antonelli 72pts, Russell 63pts, Leclerc 49pts
- **2026 Constructor Standings** (11 teams): Mercedes 135pts, Ferrari 90pts, McLaren 46pts
- **2026 Team Lineups** (11 teams): Including new teams Audi and Cadillac
- **2025 Champions**: Lando Norris (423pts), Verstappen (421pts), Piastri (410pts)
- **Full 2026 Calendar** (24 races): All dates, circuits, prices, Sprint badges
- Professional Shadcn UI Tables with position badges (gold/silver/bronze)
- Tabbed interface for easy navigation

### AI Chatbot (2026-04-01) - DONE
- GPT-4.1-mini via Emergent LLM key
- Floating chat widget on all pages
- Quick questions, session history, multilingual (EN/AR/DE/ES)

### Google Merchant Center (2026-03-31) - DONE
- GET /api/merchant/feed.xml - 1,200 products RSS feed

### Nuclear Indexing (2026-03-31) - DONE
- IndexNow to 5 engines + Bing API auto-submission

### Programmatic SEO (2026-03-31) - DONE
- 91 unique city+event pages + 15 FAQ pages

### Rich Snippets (2026-03-31) - DONE
- FAQPage, Event, Product, AggregateRating, BreadcrumbList schemas

### SEO Fixes - DONE
- Canonical URLs, Soft 404, 410 Gone, noindex all working

## Active Stats
- Total SEO pages: ~1,200
- Sitemap URLs: ~1,574
- Merchant products: 1,200

## P1 (Next)
- [ ] Google Indexing API (requires service account key from user)
- [ ] Owner Dashboard (charts/sales reports)
- [ ] French/Italian SEO pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
