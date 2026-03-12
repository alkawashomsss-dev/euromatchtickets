# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Architecture (v2.0 - Modular)
```
backend/
├── server.py              (166 lines - slim entry point)
├── config/settings.py     ├── database/db.py
├── models/schemas.py      ├── utils/helpers.py
├── routes/ (auth, events, tickets, seo, admin, marketing, seed)
├── mega_seo_generator.py  └── uploads/
```

## Completed Features

### Core Platform
- Event browsing, Stripe payments, QR tickets, Reseller compliance

### server.py Refactoring (March 12, 2026)
- 4,955 → 166 lines (97% reduction)

### SEO System (1,762+ Unique Pages)
- Mega SEO Generator v3, Sitemap Index with 7 sitemaps, Smart Cleanup

### Schema.org Complete Fix (March 12, 2026)
- **Round 1:** Fixed ALL 37 event pages - added `location`, `eventStatus`, `endDate`, `image`, `organizer`
- **Round 2:** Fixed ALL 32 pages with AggregateOffer - added `url`, `validFrom`, `highPrice`
- **Round 2:** F1 Schedule nested items - added `description`, `offers` with full fields
- All addresses use proper `PostalAddress` schema (not plain strings)

### Google Search Console Indexing Fix (March 12, 2026)
- **Fixed robots.txt:** Removed `Disallow: /api/` that blocked Google from sitemaps
- **Fixed Sitemap URL:** Points to `/api/sitemap-index.xml`
- **Added 61 static pages** to sitemap (77 total in pages.xml)
- **Total: 1,849 URLs** across all sitemaps

### "Sell Your Tickets" Feature (March 12, 2026)
- Tested: 19/19 backend + all frontend (100%)

### Customer Reviews System (March 12, 2026)
- Connected frontend to backend API. Tested: 13/13 (100%)

## Prioritized Backlog

### P0 - Completed
- [x] 1,762 unique SEO pages
- [x] Schema.org complete for ALL pages (all Google-recommended fields)
- [x] robots.txt + sitemap fix
- [x] "Sell Your Tickets" + Reviews system

### P1 - Next
- [ ] Deploy to live site (ALL fixes need to be live for Google re-indexing)
- [ ] Re-submit sitemaps in Google Search Console
- [ ] Verify Resend domain for email delivery

### P2 - Future
- [ ] Owner dashboard with real charts
- [ ] Stripe Connect for marketplace payouts
- [ ] Ticket supplier affiliate program

## 3rd Party Integrations
Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, Google Analytics, Resend (blocked)
