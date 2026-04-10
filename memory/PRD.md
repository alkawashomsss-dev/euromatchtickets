# EuroMatchTickets.com - Product Requirements Document

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on achieving top search engine rankings through aggressive SEO strategy. The goal is to sell 1,000 tickets in the first month.

## Platform
- **Stack:** FastAPI + React + MongoDB
- **Focus:** SEO-first, conversion-optimized, trust-building

## Core Features (Implemented)
- Event browsing with massive scale SEO-optimized landing pages
- Google Merchant Center XML feed
- Schema.org/JSON-LD integration (AggregateOffer, SportsEvent, FAQPage)
- Dynamic Trust/Review pages (English, German, French, Spanish, Italian)
- VIP Ticket Experiences with event-specific images & descriptions
- Multi-lingual SEO pages (ES, DE, FR, IT)
- Static sitemap.xml with 356+ URLs
- Proper canonical URL handling
- Pre-hydration SEO script for instant meta tag rendering
- FanProtect guarantee system
- Email Drip Campaign system
- Interactive venue maps (MotoGP, Isle of Man TT)
- Social Media Content Kit (TikTok, Instagram, YouTube Shorts)

## Recent Completed Work (April 2026)
- **CSS Text Visibility Fix:** Fixed white-on-white text bugs across SellTicketsPage (stats, forms, headers) and AboutPage (h1, stats)
- **VIP Experience Upgrade:** Complete rewrite with event-specific images/descriptions for F1 (Paddock Club), Football (Skybox), Concert (Backstage), MotoGP (VIP Village)
- **Social Media Kit:** Created comprehensive content kit with 20+ post scripts, hashtags, keywords for TikTok/Instagram/YouTube Shorts
- **SEO Audit:** Verified canonical URLs, robots meta, structured data, sitemap, H1 tags all working correctly

## Active SEO Pages
- 100+ core pages actively indexed
- Proper noindex/410 for deactivated pages
- Multi-lingual support (EN, ES, DE, FR, IT)

## Key Technical Architecture
```
/app/
├── backend/ (FastAPI)
│   ├── server.py
│   └── routes/
│       ├── seo.py (410 Gone, sitemap, page management)
│       └── seed.py (event/ticket data seeding)
├── frontend/ (React)
│   ├── public/
│   │   ├── index.html (pre-hydration SEO script)
│   │   └── sitemap.xml (static, 356 URLs)
│   └── src/
│       ├── components/
│       │   ├── SEOHead.jsx (canonical, meta, hreflang)
│       │   ├── VIPExperience.jsx (event-specific VIP)
│       │   └── InteractiveVenueMap.jsx
│       └── pages/ (Hub pages, DynamicSEOPage, ReviewPage, etc.)
└── memory/
    ├── PRD.md
    └── SOCIAL_MEDIA_KIT_2026.md
```

## Upcoming Tasks
- P1: Enhance Owner Dashboard (email campaign stats, sales reports)
- P1: Optimize top landing pages for GSC keywords (Spa F1, Taylor Swift, Belgium GP)
- P2: Add French/Italian SEO pages expansion
- P2: Activate next batch of 100 SEO pages
- P2: Custom email templates by event type

## Future/Backlog
- A/B testing for SEO page titles and email subjects
- Retargeting Pixel integration
- Price comparison tables improvement
- Ticket Supplier Affiliate Program
- Video/GIF highlights on event pages
