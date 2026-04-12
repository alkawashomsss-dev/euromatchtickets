# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, a premium ticket marketplace. Aggressive SEO, top Google rankings, high conversions, deep buyer trust. Dark theme (#0e0e14, #e10600 red).

## Architecture
- Frontend: React (CRA) + Tailwind + Shadcn/UI + Framer Motion
- Backend: FastAPI + MongoDB
- Auth: Emergent-managed Google OAuth

## What's Been Implemented

### Mobile Performance Optimization (DONE - April 12, 2026)
- Deferred tracking scripts (FB Pixel, TikTok, GA4) - load 2.5s after page
- Google Fonts non-render-blocking (media="print" + preload trick)
- Removed duplicate font @import from CSS
- content-visibility: auto on below-fold sections (Categories, How It Works, Trust)
- Reduced framer-motion animation complexity (shorter duration, capped delays)
- Removed dead ChatWidget import from App.js bundle
- prefers-reduced-motion support for battery-saving mode
- GPU-optimized image transforms

### Event URL Fix (DONE - April 12, 2026)
- Ugly event_id URLs auto-redirect to slug URLs
- 157 events all have SEO-friendly slugs
- "Event Not Found" improved with navigation buttons
- noIndex on ugly URLs

### Newsletter System (DONE)
- 8 major pages, backend POST /api/newsletter/subscribe

### SEO & Indexing (DONE)
- 2,307+ URLs in 9 sitemaps
- CTR-optimized titles with prices
- Blog articles, trust pages, all indexed

### Internal Linking (DONE)
- Footer, HomePage, SpaGPPage, BlogArticlePage cross-linked

## Testing: iterations 46-49 all 100% pass

## Pending
- P1: Owner Dashboard charts
- P2: French/Italian SEO expansion
- BLOCKED: Sora 2 video, Google OAuth credentials
