# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Google Merchant Center + Nuclear Indexing

## Features Implemented

### MEGA SEO Push (2026-04-01) - DONE
- Created 27 NEW high-value keyword pages targeting commercial search queries:
  - "cheap f1 tickets 2026", "buy f1 tickets online", "f1 ticket prices 2026", "f1 vip tickets", "last minute f1 tickets"
  - "cheap champions league tickets", "buy champions league final tickets 2026"
  - "buy premier league tickets", "buy la liga tickets", "buy serie a tickets", "buy bundesliga tickets"
  - "cheap world cup 2026 tickets", "buy world cup final 2026 tickets", "world cup 2026 schedule"
  - City pages: London, Paris, Madrid, Barcelona, Milan, Munich, Amsterdam, Istanbul, Lisbon, Dubai
  - Concert pages: cheap concert tickets europe, Coldplay 2026, Ed Sheeran 2026
- Optimized 20 existing F1 race page titles for better CTR
- Added all 27 new pages to pre-hydration metadata map in index.html
- Regenerated ALL sitemaps (1,506 URLs across 9 sitemap files)
- Submitted 1,463 URLs to Yandex IndexNow

### Critical Canonical URL Fix (2026-04-01) - DONE
- FIXED: Empty `<link rel="canonical" href="">` tag in raw HTML was confusing Google
- Removed the empty canonical from HTML, now created dynamically by pre-hydration JS
- All pages now show correct canonical URLs (verified via browser)
- This resolves the "Duplicate, Google chose different canonical" GSC error

### Deployment Fix (2026-04-01) - DONE
- Added `--extra-index-url` to requirements.txt for `emergentintegrations` package
- Removed unused `python-jose` that caused pyasn1 conflict

### F1 Tickets Page Competitor Upgrade (2026-04-01) - DONE
- 2026 Driver Standings (22 drivers), Constructor Standings (11 teams)
- 2026 Team Lineups including Audi & Cadillac
- 2025 Champions section (Norris 423pts)
- Full 2026 Calendar (24 races) with buy buttons linked to real events
- SEO keyword-rich race links with actual event data from database

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
