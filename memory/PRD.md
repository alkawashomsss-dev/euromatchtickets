# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings. The platform sells F1, Football, Concert, MotoGP, Isle of Man TT tickets.

## Core Features (Implemented)
- Browse events by category (Football, Concerts, F1, MotoGP, Isle of Man TT)
- SEO-optimized landing pages with unique content (1745+ pages)
- SEO-friendly slugs for all 219 events
- Advanced Schema.org structured data (Event, Product, Review, Breadcrumb, FAQ, Organization, LocalBusiness)
- Trust signals: FanProtect guarantee, buyer protection, secure payment badges
- Google OAuth authentication with smart redirect (returns to original page)
- Stripe payment integration
- Admin/Seller dashboards
- Venue info with Google Maps on event pages
- Price comparison vs competitors
- **Price Alert System** with automated email sequences
- **Conversion optimization**: Scarcity, Social Proof, Urgency
- Professional QR e-ticket delivery via email

## Architecture
```
/app/
├── backend/ (FastAPI + MongoDB)
│   ├── server.py
│   ├── routes/ (events, auth, tickets, seo, admin, marketing, alerts)
│   ├── email_service.py (premium light theme templates + QR tickets)
│   ├── services/ (content_generator)
│   └── requirements.txt (17 deps pinned)
├── frontend/ (React + Tailwind + Shadcn/UI + Framer Motion)
│   ├── src/
│   │   ├── App.js (routing + auth redirect + structured data)
│   │   ├── index.css (premium light theme + glassmorphism)
│   │   ├── pages/ (77+ pages - all light theme)
│   │   ├── components/
│   │   │   ├── ConversionWidgets.jsx (PriceAlert, Scarcity, SocialProof, Urgency)
│   │   │   ├── VenueInfoSection.jsx (Google Maps)
│   │   │   ├── Header/Footer (premium light)
│   │   │   └── ...
│   │   └── utils/
│   └── yarn.lock (regenerated for Render)
└── scripts/
```

## What's Been Implemented

### Phase 1-2: SEO + Trust (Complete)
- 1745 SEO pages, slugs, 301 redirects, canonical/noindex, sitemap, robots.txt
- Schema.org (Event, Product, Review, Breadcrumb, FAQ, Organization, LocalBusiness)
- Unsplash images, Related Events, purchase notifications

### Phase 3: Premium UI/UX Overhaul (Complete - March 2026)
- Full dark-to-light theme across 77+ pages
- Glassmorphism, Framer Motion, premium gradients
- Redesigned Header, Footer, HomePage, EventDetailsPage, EventsPage

### Phase 4: Bug Fixes + Enhancement (Complete - March 2026)
- Auth redirect bug fixed (returns to original page after login)
- Gap between header and content fixed
- Smooth scroll, LocalBusiness schema, venue maps, price comparison
- requirements.txt pinned, yarn.lock regenerated

### Phase 5: Conversion Optimization (Complete - March 2026)
- **Price Alert System**: Subscribe with email → Welcome email → 24h discount (10% off) → 48h reminder → 72h urgency (tickets almost sold out)
- **Scarcity Badges**: "Only X tickets left!" with urgency colors
- **Social Proof**: "X people booked today", "X people viewing now"
- **Urgency Countdown**: Days/Hours/Mins to event, "Prices increase soon" warning
- **Enhanced Price Comparison**: Card layout vs Box Office, StubHub, Other Resellers
- **Professional QR Tickets**: Premium light theme email with QR code, VERIFIED badge, event details

## Pending Issues
- P0: Render deployment - requirements.txt pinned + yarn.lock regenerated, user needs to trigger build
- P1: Full HTTPS enforcement
- P2: GSC organizer URL schema
- P3: Bing IndexNow Cloudflare block

## Upcoming Tasks
- Enhance Owner Dashboard with charts
- Ticket Supplier Affiliate Program
- AI-powered content upgrade

## 3rd Party Integrations
- MongoDB Atlas, Stripe, Google OAuth2, Unsplash, Resend (emails), Render
