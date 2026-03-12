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
├── mega_seo_generator.py  ├── generate_sitemaps.py  (NEW - static sitemap generator)
└── uploads/
frontend/public/
├── robots.txt             (Updated - no /api/ block)
├── sitemap-index.xml      (NEW - static XML)
├── sitemap.xml            (NEW - static XML alias)
└── sitemaps/              (NEW - static category XMLs)
    ├── pages.xml (77 URLs)
    ├── f1.xml (528 URLs)
    ├── football.xml (292 URLs)
    ├── concerts.xml (850 URLs)
    ├── worldcup.xml (22 URLs)
    ├── cities.xml (80 URLs)
    └── articles.xml (0 URLs)
```

## Completed Features

### Core Platform
- Event browsing, Stripe payments, QR tickets, Reseller compliance

### SEO System (1,762+ Unique Pages)
- Mega SEO Generator v3, Sitemap Index, Smart Cleanup

### Schema.org Complete Fix (March 12, 2026)
- ALL 37 event pages: `location`, `eventStatus`, `endDate`, `image`, `organizer`
- ALL 32 AggregateOffer pages: `url`, `validFrom`, `highPrice`
- F1 Schedule nested items: `description`, `offers` with full fields
- All addresses use proper `PostalAddress` schema

### Static Sitemap Fix (March 12, 2026) - CRITICAL
- **Problem:** Live site served HTML for `/api/sitemap-index.xml` (React catch-all intercepted)
- **Fix:** Generated static XML files in `frontend/public/` - served directly as XML
- **URLs now at root level:** `/sitemap-index.xml`, `/sitemap.xml`, `/sitemaps/*.xml`
- **robots.txt:** Updated to point to root-level sitemaps
- **Script:** `generate_sitemaps.py` to regenerate before each deployment
- **Total: 1,849 URLs** across all sitemaps

### Other Features
- "Sell Your Tickets" page (tested 100%)
- Customer Reviews System (tested 100%)
- Deployment Guide at `/app/memory/DEPLOYMENT_GUIDE.md`

## Prioritized Backlog

### P0 - Completed
- [x] Schema.org complete for ALL pages
- [x] Static sitemaps (no HTML issue)
- [x] robots.txt fixed
- [x] "Sell Your Tickets" + Reviews

### P1 - Next
- [ ] Deploy to live site
- [ ] Submit NEW sitemap URL in Google Search Console: `https://euromatchtickets.com/sitemap-index.xml`
- [ ] Verify Resend domain for email delivery

### P2 - Future
- [ ] Owner dashboard, Stripe Connect, Affiliate program

## Deployment Notes
Before each deploy:
1. Run `python3 backend/generate_sitemaps.py` to refresh static sitemaps
2. Build frontend: `cd frontend && yarn build`
3. Deploy to Render

## 3rd Party Integrations
Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, Google Analytics, Resend (blocked)
