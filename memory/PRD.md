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
- Lazy loading for all page components
- Checkout flow with Stripe
- Google OAuth authentication
- Homepage with Featured Events Carousel
- Sitemap generation
- Price comparison tables
- FanProtect guarantee page

### Session 4 (March 18, 2026)
- Fixed Render Deployment (yarn.lock issue, migrated to npm)
- Fixed Google Auth
- Fixed Google Search Console Warnings (validFrom in Offer schemas)
- New Hero Images for SEO pages
- Real Events & Animations with framer-motion

### Session 5 (March 19, 2026)
- Comprehensive SEO Overhaul: Fixed 40+ titles, 30+ meta descriptions, missing structured data
- Auto-seeding mechanism on server startup for production data consistency
- Bing Webmaster Tools verification
- Upgraded 4 SEO pages with real API data, live countdowns, stats

### Session 6 (March 19, 2026) - Current
- **EventDetailsPage Complete Overhaul (StubHub-style)**:
  - Interactive SVG venue maps (Concert/Football/F1 layouts)
  - Real ticket data from database grouped by category and section
  - Section filtering via map click and legend buttons
  - Category filters (VIP, Seated, General Admission, Platinum)
  - Sort functionality (Price Low/High, Availability)
  - Expandable ticket rows showing individual tickets with exact prices
  - Buy buttons linking to checkout with ticket_id, price, category params
  - LOW STOCK badges, trust signals, conversion widgets
- **Backend Enhancement**: `/api/events/{eventId}` now returns `grouped_sections` array

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── server.py
│   ├── routes/ (auth, checkout, events, seed, tickets, etc.)
│   └── .env (MONGO_URL, credentials)
├── frontend/ (React + Craco)
│   ├── package.json (npm)
│   ├── .node-version (20)
│   └── src/
│       ├── pages/ (80+ pages including EventDetailsPage)
│       ├── components/ (InteractiveVenueMap, TicketListings, VenueTickets, etc.)
│       └── App.js
└── render.yaml
```

## Deployment
- **Platform**: Render (Static Site for frontend, Web Service for backend)
- **Frontend Build**: `npm ci --legacy-peer-deps && CI=false npm run build`
- **Environment**: `SKIP_INSTALL_DEPS=true`, `REACT_APP_GOOGLE_CLIENT_ID`

## Prioritized Backlog

### P0 (Completed)
- ~~EventDetailsPage overhaul with interactive venue maps~~ DONE

### P1
- Owner Dashboard with charts and sales reports
- Login flow with user's own Google OAuth credentials (BLOCKED - needs user to create new OAuth Client ID)

### P2
- Fix Bing IndexNow (Cloudflare blocking)
- Improve price comparison tables

### P3
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion
