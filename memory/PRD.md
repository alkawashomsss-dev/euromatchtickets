# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Google Merchant Center + Nuclear Indexing

## Features Implemented

### Schema.org JSON-LD Validation Fix (2026-04-01) - DONE
- FIXED: Google Search Console error "عنصر بدون اسم" (Item without name)
- Added missing `name` property to ALL nested schema objects across 15+ files:
  - `Review` objects: 30+ reviews fixed across all pages
  - `ImageObject` (logo): Fixed in StructuredData.jsx and BlogArticlePage.jsx
  - `ContactPoint`: Fixed in index.html, StructuredData.jsx, and AboutPage.jsx
- Pre-hydration schemas in index.html also fixed
- Verified via Screenshot tool: ALL 7 schemas on Champions League page pass validation
- Verified via Screenshot tool: ALL 6 schemas on F1 page pass validation

### MEGA SEO Push (2026-04-01) - DONE
- Created 27 NEW high-value keyword pages targeting commercial search queries
- Optimized 20 existing F1 race page titles for better CTR
- Regenerated ALL sitemaps (1,506 URLs across 9 sitemap files)

### Critical Canonical URL Fix (2026-04-01) - DONE
- FIXED: Empty `<link rel="canonical" href="">` tag in raw HTML was confusing Google

### Deployment Fix (2026-04-01) - DONE
- Added `--extra-index-url` to requirements.txt for `emergentintegrations` package

### F1 Tickets Page Competitor Upgrade (2026-04-01) - DONE
- 2026 Driver Standings, Constructor Standings, Team Lineups, Full Calendar

### AI Chatbot - DONE
### Google Merchant Center - DONE
### Nuclear Indexing Engine - DONE
### Programmatic SEO (91+ pages) - DONE
### Rich Snippets Schema - DONE

## Active Stats
- Total active SEO pages: 1,226
- Total sitemap URLs: 1,506
- Merchant products: 1,200
- New keyword pages: 27

## P1 (Next)
- [ ] Google Indexing API (requires service account key from user)
- [ ] Owner Dashboard (charts/sales reports)
- [ ] French/Italian SEO pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
