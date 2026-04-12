# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, a premium ticket marketplace with aggressive SEO, top Google rankings, high conversion rates, and deep buyer trust.

## Architecture
- Frontend: React (CRA) + Tailwind + Shadcn/UI + Framer Motion
- Backend: FastAPI + MongoDB
- Auth: Emergent-managed Google OAuth
- Theme: Dark (#0e0e14 bg, #e10600 red accents)

## What's Been Implemented

### SEO & Indexing (DONE)
- 2,307+ URLs indexed across 9 sitemaps
- 30+ Spa F1 keyword routes, all using canonical tags
- CTR-optimized titles with prices ("From €109 | 42% Cheaper")
- Trust/review pages in 7 languages
- Blog articles (7) fully indexed in sitemap-guides.xml
- Pre-hydration canonical/meta scripts in index.html

### Event URL Fix (DONE - April 12, 2026)
- Ugly event_id URLs (wc2026_xxx) auto-redirect to slug URLs
- All 157 events have SEO-friendly slugs
- "Event Not Found" page improved with useful navigation
- noIndex added for ugly URLs so Google stops indexing them
- Event titles improved: "Buy X Tickets 2026 | From €Y"

### Newsletter System (DONE)
- On 8 major pages (HomePage, Blog, Spa, Monaco, Taylor Swift, F1, Champions League)
- Backend POST /api/newsletter/subscribe (MongoDB)

### Internal Linking (DONE)
- Footer: "Guides & Blog" section
- HomePage: "Latest Guides & Tips" cards
- SpaGPPage: "Related Guides" section
- BlogArticlePage: Multi-CTA ticket buttons + cross-links

### Speed (DONE)
- preconnect/dns-prefetch for images
- lazy loading, red-themed loader

## Pending / Backlog
- P1: Owner Dashboard charts
- P2: French/Italian SEO content expansion
- P2: Custom email templates
- P3: Retargeting pixels, A/B testing
- BLOCKED: Sora 2 video, Google OAuth credentials

## Testing: iterations 46-49 all 100% pass
