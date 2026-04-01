# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Google Merchant Center + Nuclear Indexing

## Features Implemented

### Google Merchant Center Feed Fix (2026-04-01) - DONE
- FIXED: 0 products accepted by Google Merchant Center
- Root cause: Fake inflated `g:price: 2500 EUR` with `g:sale_price: 59 EUR` (97% fake discount) was rejected by Google
- Fix: Removed `g:sale_price` entirely, now using actual `price_low` as `g:price`
- Added explicit `X-Robots-Tag: index, follow` header to feed response
- Validated: 1200 products, all with correct prices, no errors

### Schema.org JSON-LD Validation Fix (2026-04-01) - DONE
- FIXED: Google Search Console error "عنصر بدون اسم" (Item without name)
- Added missing `name` property to ALL nested schema objects across 15+ files
- Verified via Screenshot tool: ALL schemas pass validation

### MEGA SEO Push (2026-04-01) - DONE
- Created 27 NEW high-value keyword pages
- Regenerated ALL sitemaps (1,506 URLs)

### Critical Canonical URL Fix (2026-04-01) - DONE
### Deployment Fix (2026-04-01) - DONE
### F1 Tickets Page Competitor Upgrade (2026-04-01) - DONE
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
