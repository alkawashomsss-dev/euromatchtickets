# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace at euromatchtickets.com with aggressive SEO strategy to sell 1,000 tickets in the first month.

## Core Features
- Browse events by category (Football, Concerts, F1, MotoGP, etc.)
- SEO-optimized landing pages with unique content
- Premium, conversion-optimized design
- Trust signals: FanProtect guarantee, reviews, secure payments
- Advanced Structured Data (Schema.org)

## What's Been Implemented

### Session 1-3 (Previous)
- Full-stack FastAPI/React marketplace
- 80+ SEO landing pages
- Lazy loading, Checkout flow with Stripe
- Google OAuth, Homepage with Featured Events Carousel
- Sitemap generation, Price comparison tables

### Session 4 (March 18, 2026)
- Fixed Render Deployment
- Fixed Google Auth
- Fixed Google Search Console Warnings
- New Hero Images for SEO pages

### Session 5 (March 19, 2026)
- Comprehensive SEO Overhaul: Fixed 40+ titles, 30+ meta descriptions
- Auto-seeding mechanism on server startup
- Bing Webmaster Tools verification
- Upgraded 4 SEO pages with real API data

### Session 6 (March 19, 2026) 
- **EventDetailsPage Complete Overhaul (StubHub-style)**: Interactive SVG venue maps, real ticket data grouped by section, category filters, sort, expandable ticket rows, LOW STOCK badges
- **Backend Enhancement**: `/api/events/{eventId}` now returns `grouped_sections` array

### Session 7 (March 19, 2026) - Current
- **Bing IndexNow Fix (RESOLVED)**:
  - Root cause: Cloudflare blocked IndexNow key verification bots (403)
  - Solution: Switched to Bing URL Submission API (bypasses Cloudflare)
  - Added `BING_WEBMASTER_API_KEY` to backend env
  - Backend serves IndexNow key file as fallback
- **Daily Bing Indexing Cron Job (NEW)**:
  - Automatic daily submission of 100 URLs to Bing + all to Yandex
  - Tracks submitted URLs in MongoDB (`bing_submitted_urls` collection)
  - Logs daily progress (`bing_indexing_logs` collection)
  - Auto-resets when all URLs submitted (continuous re-indexing)
  - Progress API: `GET /api/seo/indexing-progress`
  - Estimated ~20 days to fully index all 1996 URLs

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── server.py
│   ├── routes/ (auth, checkout, events, seed, tickets, seo, etc.)
│   └── .env (MONGO_URL, BING_WEBMASTER_API_KEY, etc.)
├── frontend/ (React + Craco)
│   └── src/ (80+ pages, InteractiveVenueMap, TicketListings, etc.)
└── render.yaml
```

## API Endpoints (SEO)
- `POST /api/seo/indexnow` - Submit all URLs to Bing API + Yandex
- `POST /api/seo/submit-url?url=X` - Submit single URL
- `POST /api/seo/force-index-all` - Maximum indexing push
- `GET/POST /api/seo/ping-search-engines` - Quick ping to all engines

## Prioritized Backlog

### P0 (Completed)
- ~~EventDetailsPage overhaul~~ DONE
- ~~Bing IndexNow fix~~ DONE

### P1
- Owner Dashboard with charts and sales reports
- Login flow with user's own Google OAuth credentials (BLOCKED)

### P2
- Improve price comparison tables

### P3
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion
