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
│   ├── seo.py             (SEO pages, sitemaps)
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
- Event detail pages with seat maps
- Reseller compliance (terms, notice, price breakdown)

### server.py Refactoring (March 12, 2026)
- 4,955 lines to 166 lines (97% reduction)
- Split into 7 route modules + 4 supporting modules

### SEO System (1,762+ Unique Pages)
- Mega SEO Generator v3 with truly unique content per page
- Categories: F1 (528), Football (292), Concerts (850), World Cup (22), Cities (80+)
- Sitemap Index at `/api/sitemap-index.xml` with 7 category sitemaps
- Smart Cleanup: Events marked `past_event` (not deleted) - preserves SEO value
- Schema.org Event + BreadcrumbList structured data

### "Sell Your Tickets" Feature (March 12, 2026)
- Backend: POST /api/seller/list-tickets (multipart/form-data with file upload)
- Backend: GET /api/seller/listings, DELETE /api/seller/listings/{id}, GET /api/listings/recent
- Frontend: Professional multi-step form (3 steps: Event Details, Ticket Details, Upload & Submit)
- Tested: 19/19 backend tests + all frontend flows passed (100%)

### Customer Reviews System (March 12, 2026)
- Backend: POST /api/reviews (public), GET /api/reviews (with aggregate), PUT /admin/reviews/{id}
- Frontend: Connected SubmitReviewForm to backend API
- Frontend: ReviewsGrid fetches from API + merges with seed data
- SEO: Schema.org AggregateRating with real data from API
- Tested: 13/13 backend tests + all frontend flows passed (100%)

### Schema.org Structured Data Fix (March 12, 2026) - CRITICAL SEO FIX
- Fixed ALL 37 event pages with missing Schema.org fields
- Added to every Event page: `location` (REQUIRED), `eventStatus`, `endDate`, `image`, `organizer`
- Fixed pages: DynamicSEOPage (1700+ pages), 16 GP pages, 6 concert pages, 4 World Cup pages, EventDetailsPage, + more
- All addresses now use proper PostalAddress schema (not plain strings)
- Validated: All event schemas now pass Google Rich Results Test

### Deployment Guide (March 12, 2026)
- Created `/app/memory/DEPLOYMENT_GUIDE.md` with step-by-step instructions

## Prioritized Backlog

### P0 - Completed
- [x] 1,762 unique SEO pages
- [x] Split sitemap index
- [x] server.py refactoring
- [x] Smart cleanup (past_event)
- [x] Reviews API + Frontend integration
- [x] Structured data for ALL pages (location, eventStatus, endDate, image, organizer)
- [x] "Sell Your Tickets" page with file upload
- [x] Deployment guide

### P1 - Next
- [ ] Deploy latest changes to live site (euromatchtickets.com)
- [ ] Verify Resend domain for email ticket delivery

### P2 - Future
- [ ] Owner dashboard with real charts
- [ ] Stripe Connect for real marketplace payouts
- [ ] Ticket supplier affiliate program
- [ ] Delete server_legacy.py and obsolete backup files

## Key API Endpoints
- `POST /api/reviews` - Submit review (public)
- `GET /api/reviews` - Get reviews + aggregate
- `POST /api/seller/list-tickets` - List tickets for sale (auth required)
- `GET /api/seller/listings` - Get seller's listings
- `GET /api/sitemap-index.xml` - Sitemap index
- `GET /api/sitemaps/{category}.xml` - Category sitemaps

## 3rd Party Integrations
- Stripe, MongoDB Atlas, OpenAI GPT-4o, Sora 2, Facebook Pixel, Google Analytics, Resend (blocked)
