# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO strategy to rank #1 on Google and sell 1,000 tickets in the first month.

## What's Been Implemented

### Sessions 1-5 (Previous)
- Full-stack marketplace, 80+ SEO pages, Stripe checkout, Google OAuth
- Render deployment fix, SEO overhaul, Bing verification

### Session 6 (March 19, 2026)
- EventDetailsPage StubHub-style overhaul with interactive SVG venue maps

### Session 7 (March 19, 2026)
- Bing IndexNow fix (Bing URL Submission API)
- Daily Bing indexing cron job (100 URLs/day)

### Session 8 (March 19, 2026)
- SEO keyword optimization for 47 Google Search Console keywords
- 3 new landing pages: Bayern vs Real Madrid, Bahrain World Cup, Taylor Swift London

### Session 9 (March 20, 2026)
- 13 Ultra-Premium Realistic Events Added
- 1,425 new realistic tickets with market-accurate pricing

### Session 10 (March 20, 2026)
- Site-Wide Price Reduction (cheapest in market)
- MotoGP & Isle of Man TT Circuit Maps
- Spanish & German SEO Pages
- CSS Adrenaline Animations
- Fix Soft 404 - Google Indexing Issue
- Static Sitemap Generation (356 URLs)
- Orphaned HTML File Cleanup (1663 files deleted)
- Bing SEO Errors (Title/H1) Fix
- 410 Gone Implementation for inactive pages

### Session 11 (March 22, 2026)
- **CRITICAL FIX: "Duplicate, Google chose different canonical than user"**
  - Root cause: Static `<link rel="canonical">` in index.html hardcoded to homepage URL
  - Google saw homepage canonical in raw HTML before JS could update it
  - Fix: Removed static canonical tag, replaced with synchronous inline script
  - Script dynamically creates canonical, og:url, and hreflang tags with correct page URL
  - SEOHead.jsx updated to prevent duplicate canonical tags
  - All hreflang tags now created dynamically (not static in HTML)
  - Verified: Every page now has exactly 1 canonical pointing to itself

## Prioritized Backlog
### P1
- Owner Dashboard with charts and sales reports
- Login flow with user's own Google OAuth credentials (BLOCKED on user credentials)
### P2
- French/Italian SEO Pages
- Activate Next Batch of 100 SEO Pages
### P3
- Price Comparison Tables
- Ticket Supplier Affiliate Program
- "Price Match Guarantee" badge
- Video/GIF highlights on event pages
