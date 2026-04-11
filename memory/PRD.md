# EuroMatchTickets - Product Requirements Document

## Overview
**euromatchtickets.com** - A premium ticket marketplace for sports and entertainment events across Europe, with a primary focus on aggressive SEO strategy, conversion optimization, and professional UI/UX.

## Target Audience
- Sports fans (Football, F1, MotoGP, Isle of Man TT)
- Concert-goers (Taylor Swift, Coldplay, Bruno Mars, etc.)
- European event enthusiasts across 25+ countries

## Core Features

### 1. Event Marketplace
- Browse events by category (Football, Concerts, F1, MotoGP)
- Event detail pages with interactive venue maps
- Ticket purchasing with secure Stripe checkout
- QR code instant delivery

### 2. SEO Engine (P0)
- 100+ active SEO-optimized landing pages
- Static sitemap.xml with 356 URLs
- Pre-hydration script for instant meta tags & canonical URLs
- International SEO: Spanish, German, French, Italian pages
- Schema.org/JSON-LD structured data (Organization, Website, Event, FAQ, Breadcrumb)
- "410 Gone" for deactivated pages
- Short titles (<60 chars), static H1 tags for crawlers

### 3. Trust & Reviews System
- Trustpilot-style rating displays (4.9/5)
- Verified customer reviews
- FanProtect buyer guarantee
- 100% Money-Back Guarantee

### 4. Marketing Tools
- Meta/TikTok Retargeting Pixels
- Social Hub page (/social)
- Email drip campaigns
- Price alerts system

### 5. User Authentication
- Emergent-managed Google OAuth (current)
- Seller/Admin dashboards

## Design System (Updated April 2026)

### Color Palette
- Primary Red: #e10600 (Header, CTAs, accents)
- Dark Background: #0e0e14 (Main sections)
- Dark Surface: #15151e (Sub-nav, secondary sections)
- Dark Card: #1e1e1e (Cards, inputs)
- White: #ffffff (Text, logos)
- Green: #15803d (Success, football badges)
- Amber: #facc15 (Featured badges, star ratings)
- Trustpilot Green: #00b67a

### Typography
- Headings: Oswald (700 weight, uppercase, tight tracking)
- Body: Inter (400-700 weight)
- All headings are uppercase with tight letter spacing

### Design Principles
- F1 Tickets / Global-Tickets inspired aesthetic
- Sharp edges (rounded-none) - NO rounded corners
- Full-width image cards with gradient overlays
- Dark backgrounds throughout - NO white/light backgrounds
- Bold, sporty, high-energy feel

## Architecture
```
/app/
├── backend/           (FastAPI + MongoDB)
│   ├── server.py      (Main server, routes, auth)
│   └── routes/        (seo.py, seed.py, etc.)
├── frontend/          (React + Tailwind + Shadcn/UI)
│   ├── public/        (index.html, sitemap.xml, images)
│   └── src/
│       ├── App.js, App.css, index.css
│       ├── pages/     (100+ pages)
│       └── components/ (Header, Footer, SEO, etc.)
```

## What's Been Implemented

### Phase 1: Core Platform (Complete)
- Full event marketplace with CRUD
- Authentication (Google OAuth)
- Ticket purchasing flow
- Seller/Admin dashboards

### Phase 2: SEO Engine (Complete)
- 100+ active landing pages
- Static sitemap with 356 URLs
- Pre-hydration script for crawlers
- International SEO pages (ES, DE, FR, IT)
- Structured data (Schema.org)
- "410 Gone" for deactivated pages
- Bing/Yandex webmaster integration

### Phase 3: Marketing & Trust (Complete)
- Social Hub (/social)
- TikTok video generation (Sora 2)
- Meta/TikTok retargeting pixels
- Trust signals & review system
- VIP Experience component

### Phase 4: UI/UX Redesign (April 11, 2026 - Complete)
- Bold red F1-style header (#e10600)
- Dark sub-navigation bar (#15151e)
- Complete dark theme across ALL pages
- Sharp-edge design system (no rounded corners)
- Oswald uppercase headings
- Dark event cards with visible white text
- Dark cookie consent banner (no purple!)
- Updated Footer with dark theme
- Trustpilot-style rating displays
- Mobile-responsive dark design
- Batch-converted 100+ pages from light to dark theme

## Known Issues / Blockers

### P1: Sora 2 Video Budget Exhausted
- Emergent LLM Key budget depleted ($10.24 cost > $9.29 budget)
- User needs to add balance: Profile → Universal Key → Add Balance

### P2: Login Credentials
- Using Emergent-managed Google OAuth as stable workaround
- Blocked on user providing custom OAuth credentials

### P0 (Resolved): "Duplicate Canonical" SEO Issue
- Pre-hydration script correctly generates canonical URLs per page
- SEOHead.jsx also manages canonicals in React
- Both use BASE_URL + location.pathname formula
- Issue may be Google's own canonical selection for thin-content SPA pages

## Upcoming Tasks
1. **P1**: Enhance Owner Dashboard (stats, email campaign reports)
2. **P2**: Add French/Italian SEO landing pages
3. **P2**: Activate next batch of 100 SEO pages
4. **P2**: Custom email templates by event type

## Future/Backlog
- Price Comparison Tables improvement
- Ticket Supplier Affiliate Program
- "Price Match Guarantee" badge
- Video/GIF highlights on event pages
- A/B testing for SEO page titles
- Retargeting Pixel segmentation
