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
- **Fixed Render Deployment**: Root cause was `yarn.lock` in `.gitignore`. Migrated to npm, added `SKIP_INSTALL_DEPS=true`, `--legacy-peer-deps`
- **Fixed Google Auth**: Removed Emergent Auth, restored direct Google OAuth
- **Fixed Google Search Console Warnings**: Added `validFrom` to all Offer schemas (6 pages)
- **New Hero Images**: Generated 4 high-quality images for SuperBowl, TaylorSwift, WorldAthletics, WorldCup
- **Real Events & Animations**: Added framer-motion animations, real API data (available_tickets, lowest_price), real countdowns, removed fake social proof numbers

## Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── server.py
│   ├── routes/ (auth, checkout, events, etc.)
│   └── .env (MONGO_URL, GOOGLE credentials)
├── frontend/ (React + Craco)
│   ├── package.json (npm)
│   ├── .node-version (20)
│   └── src/
│       ├── pages/ (80+ pages)
│       ├── components/
│       └── App.js
└── render.yaml
```

## Deployment
- **Platform**: Render (Static Site for frontend, Web Service for backend)
- **Frontend Build**: `npm ci --legacy-peer-deps && CI=false npm run build`
- **Environment**: `SKIP_INSTALL_DEPS=true`, `REACT_APP_GOOGLE_CLIENT_ID`

## Prioritized Backlog

### P1
- Owner Dashboard with charts and sales reports
- Verify Google Auth on production after deploy

### P2
- Fix Bing IndexNow (Cloudflare blocking)
- Improve price comparison tables

### P3
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion
