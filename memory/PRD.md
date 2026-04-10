# EuroMatchTickets.com - Product Requirements Document

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy and high conversion rates.

## Platform
- **Stack:** FastAPI + React + MongoDB
- **Focus:** SEO-first, conversion-optimized, trust-building, social media growth

## Core Features (Implemented)
- Event browsing with massive scale SEO-optimized landing pages
- Google Merchant Center XML feed
- Schema.org/JSON-LD integration (AggregateOffer, SportsEvent, FAQPage)
- Dynamic Trust/Review pages (EN, DE, FR, ES, IT)
- VIP Ticket Experiences with event-specific images & descriptions
- Multi-lingual SEO pages (ES, DE, FR, IT)
- Static sitemap.xml with 356+ URLs
- Proper canonical URL handling
- Pre-hydration SEO script for instant meta tag rendering
- FanProtect guarantee system
- Email Drip Campaign system
- Interactive venue maps (MotoGP, Isle of Man TT)
- Social Media Content Kit (TikTok, Instagram, YouTube Shorts)
- **Retargeting Pixels** (Meta/Facebook, TikTok, Google Analytics 4)
- **Social Hub Page** with live viewers, countdown, price drop alerts
- **Killer Sales Pages** (Spa F1 golden page with VIP, video, countdown)

## Recent Completed Work (April 10, 2026)

### Session 1 - CSS & VIP Fixes
- **CSS Text Visibility Fix:** Fixed white-on-white text across SellTicketsPage and AboutPage
- **VIP Experience Upgrade:** Complete rewrite with event-specific images (F1 Paddock Club, Football Skybox, Concert Backstage, MotoGP VIP Village)

### Session 2 - Golden Page, Pixels & Social Hub
- **Spa F1 Golden Page:** Complete rewrite of `/f1-belgian-grand-prix-spa-tickets` as a killer sales page:
  - Hero with aerial Spa image, live viewers count, "Selling Fast" badge
  - Countdown timer to race day
  - "Buy Spa F1 Tickets" + "Upgrade to Paddock Club" CTAs
  - Video section with YouTube embed (Sergio Perez onboard lap)
  - "VIP Experience at Spa" section with Paddock Club gallery, perks grid
  - Two VIP packages: Hospitality Lounge (€1,189) and Paddock Club (€3,489)
  - Verified buyer reviews with star ratings
  - SEO keyword cloud
  - Final conversion CTA section
- **Retargeting Pixels:** Added Meta Pixel, TikTok Pixel, and GA4 to index.html (placeholder IDs - user needs to replace)
- **Social Hub Page:** New `/social` and `/follow` pages with:
  - Live viewer count
  - "Follow for Price Drops" headline
  - TikTok, Instagram, YouTube, Twitter/X social cards
  - Next event countdown timer
  - Upcoming events list with price drop alerts
  - TikTok video previews
  - Email subscribe form for price drop alerts
- **Social Media Content Kit:** Created comprehensive kit at `/app/memory/SOCIAL_MEDIA_KIT_2026.md`

## Pixel IDs (User Needs to Replace)
- Meta Pixel: `YOUR_META_PIXEL_ID` → Replace in `/app/frontend/public/index.html`
- TikTok Pixel: `YOUR_TIKTOK_PIXEL_ID` → Replace in `/app/frontend/public/index.html`
- Google Analytics 4: `YOUR_GA4_ID` → Replace in `/app/frontend/public/index.html`

## Key Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── server.py
│   └── routes/ (seo.py, seed.py, etc.)
├── frontend/ (React)
│   ├── public/
│   │   ├── index.html (SEO pre-hydration + retargeting pixels)
│   │   └── sitemap.xml (356 URLs)
│   └── src/
│       ├── components/
│       │   ├── SEOHead.jsx (canonical, meta, hreflang)
│       │   ├── VIPExperience.jsx (event-specific VIP)
│       │   └── InteractiveVenueMap.jsx
│       └── pages/
│           ├── SpaGPPage.jsx (Golden sales page)
│           ├── SocialHubPage.jsx (Social + countdown)
│           ├── DynamicSEOPage.jsx
│           └── ReviewPage.jsx (Trust pages)
└── memory/
    ├── PRD.md
    └── SOCIAL_MEDIA_KIT_2026.md
```

## Upcoming Tasks
- P1: Replace pixel placeholder IDs with real ones (user provides)
- P1: Optimize top landing pages for GSC keywords (Taylor Swift, Champions League)
- P1: Enhance Owner Dashboard (email campaign stats, sales reports)
- P2: Activate next batch of 100 SEO pages
- P2: Custom email templates by event type

## Future/Backlog
- A/B testing for SEO page titles and email subjects
- More golden sales pages (Taylor Swift, Champions League Final)
- Video/GIF highlights on event pages
- Ticket Supplier Affiliate Program
