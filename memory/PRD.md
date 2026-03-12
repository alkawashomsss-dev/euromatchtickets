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
│   ├── tickets.py         (tickets, checkout, orders, Stripe)
│   ├── seo.py             (SEO pages, sitemaps)
│   ├── admin.py           (admin, disputes, reviews, cleanup)
│   ├── marketing.py       (chat, raffle, marketing)
│   └── seed.py            (seed data endpoints)
├── mega_seo_generator.py  (SEO page generator v3)
└── server_legacy.py       (backup of old monolith)
```

## Completed Features

### Core Platform
- Event browsing by category (Football, F1, Concerts, MotoGP, World Cup)
- Stripe payment integration with QR code tickets
- Event detail pages with seat maps
- Reseller compliance (terms, notice, price breakdown)

### server.py Refactoring (March 12, 2026)
- **4,955 lines → 166 lines** (97% reduction)
- Split into 7 route modules + 4 supporting modules
- All 21 backend endpoints tested and passing
- Clean architecture: config/, database/, models/, utils/, routes/

### SEO System (1,762+ Unique Pages)
- **Mega SEO Generator v3** with truly unique content per page:
  - 300-600 word descriptions with real history, tips, transport info
  - Unique FAQ sections (randomized from pools)
  - Internal links to related pages
  - Competitive price comparison tables (vs StubHub, Viagogo)
  - Schema.org Event + BreadcrumbList structured data
- **Categories:** F1 (528), Football (292), Concerts (850), World Cup (22), Cities (80+)
- **Sitemap Index** at `/api/sitemap-index.xml` with 7 category sitemaps
- **Smart Cleanup:** Events marked `past_event` (not deleted) - preserves SEO value

### Marketing & Analytics
- Facebook Pixel + Google Analytics integrated
- Landing pages: Monaco GP, El Clasico, Champions League
- Video ad reel (F1/Sora 2)

### Reviews System
- POST/GET `/api/reviews` with moderation
- AggregateRating for Schema.org

## Prioritized Backlog

### P0 - Completed
- [x] 1,762 unique SEO pages
- [x] Split sitemap index
- [x] server.py refactoring (4955 → 166 lines)
- [x] Smart cleanup (past_event)
- [x] Reviews API
- [x] Structured data for all pages

### P1 - Next
- [ ] "Sell Your Tickets" page (/sell-tickets) with file upload
- [ ] Deployment guide in Arabic

### P2 - Future
- [ ] User accounts system (full profile)
- [ ] Owner dashboard with real charts
- [ ] Email ticket delivery (blocked on Resend domain)
- [ ] Stripe Connect for real marketplace payouts
- [ ] Delete server_legacy.py after stability confirmed

## Key API Endpoints
- `POST /api/seo/mega-generate` - Generate SEO pages
- `GET /api/seo/stats` - Statistics
- `GET /api/seo/page/{slug}` - Get page
- `GET /api/sitemap-index.xml` - Sitemap index
- `GET /api/sitemaps/{category}.xml` - Category sitemaps
- `POST /api/cleanup/expired-events` - Smart cleanup
- `POST /api/reviews` - Submit review
- `GET /api/reviews` - Get reviews + aggregate

## 3rd Party Integrations
- Stripe, MongoDB Atlas, OpenAI GPT-4o, Sora 2, Facebook Pixel, Google Analytics, Resend (blocked)
