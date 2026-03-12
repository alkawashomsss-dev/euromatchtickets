# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets in the first month. Pages for F1, football, concerts, World Cup. Requirements: programmatic SEO pages, automated marketing, professional appearance, e-ticketing with QR codes.

## Architecture (v2.0 - Modular)
```
backend/
├── server.py              (166 lines - slim entry point)
├── config/settings.py     (env config)
├── database/db.py         (MongoDB connection)
├── models/schemas.py      (Pydantic models)
├── utils/helpers.py       (auth, QR code)
├── routes/
│   ├── auth.py            (auth endpoints)
│   ├── events.py          (events CRUD)
│   ├── tickets.py         (tickets, checkout, orders, Stripe, Sell Tickets)
│   ├── seo.py             (SEO pages, sitemaps, robots.txt)
│   ├── admin.py           (admin, disputes, reviews, cleanup)
│   ├── marketing.py       (chat, raffle, marketing)
│   └── seed.py            (seed data endpoints)
├── mega_seo_generator.py  (SEO page generator v3)
└── uploads/               (user-uploaded ticket files)
```

## Completed Features

### Core Platform
- Event browsing by category (Football, F1, Concerts, MotoGP, World Cup)
- Stripe payment integration with QR code tickets
- Reseller compliance (terms, notice, price breakdown)

### server.py Refactoring (March 12, 2026)
- 4,955 lines to 166 lines (97% reduction)

### SEO System (1,762+ Unique Pages)
- Mega SEO Generator v3 with unique content per page
- Sitemap Index at `/api/sitemap-index.xml` with 7 category sitemaps
- Smart Cleanup: Events marked `past_event` (not deleted)

### Schema.org Structured Data Fix (March 12, 2026)
- Fixed ALL 37 event pages with missing Schema.org fields
- Added: `location` (REQUIRED), `eventStatus`, `endDate`, `image`, `organizer`
- All addresses use proper PostalAddress schema

### Google Search Console Indexing Fix (March 12, 2026) - CRITICAL
- **Fixed robots.txt:** Removed `Disallow: /api/` that was blocking Google from sitemaps
- **Fixed Sitemap URL:** Changed from `sitemap.xml` to `/api/sitemap-index.xml`
- **Added 61 static pages** to pages.xml sitemap (was 16, now 77)
- **Total sitemap URLs:** 1,849 (pages: 77, F1: 528, Football: 292, Concerts: 850, WorldCup: 22, Cities: 80)
- All tested URLs return HTTP 200

### "Sell Your Tickets" Feature (March 12, 2026)
- Tested: 19/19 backend + all frontend (100%)

### Customer Reviews System (March 12, 2026)
- Tested: 13/13 backend + all frontend (100%)

### Deployment Guide (March 12, 2026)
- Created `/app/memory/DEPLOYMENT_GUIDE.md`

## Prioritized Backlog

### P0 - Completed
- [x] 1,762 unique SEO pages
- [x] Schema.org for ALL pages
- [x] robots.txt fix (was blocking sitemaps!)
- [x] 77 static pages added to sitemap
- [x] "Sell Your Tickets" page
- [x] Reviews API + Frontend
- [x] Deployment guide

### P1 - Next
- [ ] Deploy to live site (all SEO fixes need to be live for Google to re-index)
- [ ] Re-submit sitemaps in Google Search Console
- [ ] Verify Resend domain for email delivery

### P2 - Future
- [ ] Owner dashboard with real charts
- [ ] Stripe Connect for marketplace payouts
- [ ] Ticket supplier affiliate program

## 3rd Party Integrations
- Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, Google Analytics, Resend (blocked)
