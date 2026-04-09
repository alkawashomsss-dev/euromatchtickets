# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, an aggressive SEO-focused ticket marketplace with massive programmatic SEO, Google Merchant Center feed, Schema.org/JSON-LD, and premium UI/UX.

## Platform
- **Frontend**: React (port 3000) | **Backend**: FastAPI (port 8001) | **Database**: MongoDB
- **Domain**: euromatchtickets.com

## User Language: Arabic (mandatory)

## What's Been Implemented

### April 7, 2026 - Meta Description SEO Fix (Bing Webmaster Tools)
- **Fixed CRITICAL BUG**: `is2025` and `isEventDetail` variables were undefined, crashing pre-hydration script on ALL pages
- **Fixed 67 short meta descriptions** in pre-hydration script (all now 120-160 chars)
- **Improved fallback descriptions** for dynamic SEO pages (~1800 pages) - now 165+ chars
- **Added static meta description** in index.html for non-JS crawlers (167 chars)
- **Fixed empty robots meta tag** - now properly set to `index, follow`
- **Added noindex** for utility pages (cart, checkout, login, register, dashboard)

### April 8, 2026 - Critical SEO Canonical & "Event Not Found" Fix
- **Root cause found**: `is2025` and `isEventDetail` variables were UNDEFINED in pre-hydration script → script crashed on ALL pages → NO canonical URL set → Google chose homepage as canonical for ALL pages
- **410 Gone for deleted events**: Backend returns 410 for events deleted from DB (9 of 10 Google-flagged URLs)
- **410 Gone for non-existent SEO pages**: Backend returns 410 instead of 404
- **Event_id → Slug redirect**: EventDetailsPage auto-redirects `/event/event_xxx` to `/event/slug-name`
- **noindex for event_id URLs**: Pre-hydration marks internal ID URLs as noindex
- **Added slugs to 28 events** that were missing them
- **Regenerated sitemap**: 2,065 clean URLs, ZERO event_id URLs
- **Fixed ALL "Buy" buttons**: 8 hardcoded landing pages had fake event IDs in checkout links → now link to real events
- **Improved multi-word search**: Backend splits search queries into words, matching across title/artist/venue/city

- **Updated 27 events** with "2025" in title to "2026"
- **Fixed 20 events** with past dates - updated to future dates
- **Removed 17 train events** (not relevant to ticket marketplace)
- **Removed 76 duplicate events** (same title appearing multiple times)
- **Removed 6 test events** (TEST_* prefix)
- **Reactivated 9 attraction events** (Disneyland, Eiffel Tower, etc.)
- **Result**: 161 clean, active events with tickets available

### April 7, 2026 - AI Chat Fix + Structured Data Fix
- AI Chat: Fixed smart AI chat (AIChatWidget) using Emergent LLM Key + GPT-4o via emergentintegrations library
- Organizer URL Fix: Added url field to all Event organizers in Schema.org

### April 7, 2026 - Comprehensive 13-Point SEO Overhaul
1. noindex Fix: 1,890 total active pages (activated 664 inactive)
2. Event Ended: 410 -> "Event Ended" with related events
3. Canonical: Proper canonical via SEOHead.jsx + pre-hydration
4. SEO-friendly URLs: Slugs already implemented
5. Domain Unification: Canonicals -> https://euromatchtickets.com
6. Sitemap + robots.txt: 2,263 URLs, 11 sitemaps
7. Conversion: Scarcity indicators + Sticky CTA + FAQ Schema
8. Internal Linking: RelatedEventsSection
9. Multi-language: /es, /de, /fr, /it
10. Re-indexing: 2,125 URLs submitted
11. Proper 301 redirects
12. Performance: Lazy loading, HTTPS
13. Merchant Feed: 1,864 products, unique images, 0 promo words, EUR only

### Previous Work
- Global Setup Merchant Feed (EUR only)
- Google Structured Data (Event + Product + FAQPage + Breadcrumb)
- Optimized titles + meta descriptions + FAQs for all pages
- 1,864 unique product images
- Bing/IndexNow integration

## 3rd Party Integrations
- **Emergent LLM Key**: GPT-4o for AI Chat Support (via emergentintegrations)
- **Google Merchant Center**: XML Feed
- **Bing URL Submission API**
- **IndexNow** (Yandex, Bing, Seznam, Naver)
- **Emergent-managed Google Auth**

### April 9, 2026 - Critical "de" Bug Fix (Bare Language Path Redirects)
- **Root cause**: Visiting bare language paths (`/de`, `/es`, `/fr`, `/it`) matched the `/:slug` catch-all route, displaying the language code as event name (e.g., "Buy verified de tickets", "About De")
- **Fix applied in 3 files**:
  - `App.js`: Added `<Navigate>` redirect routes for `/de`→`/de/tickets-kaufen`, `/es`→`/es/comprar-entradas`, `/fr`→`/fr/acheter-billets`, `/it`→`/it/biglietti`
  - `DynamicSEOPage.jsx`: Added `LANG_REDIRECTS` guard that returns `<Navigate>` for 2-letter language code slugs
  - `index.html`: Pre-hydration script now detects bare language paths, sets `noindex`, and points canonical to proper landing page
- **Verified**: All canonical URLs correct, hreflang tags present, robots `index, follow` on real pages, no bare paths in sitemap
- **Test result**: 15/15 tests passed (100%)

## Pending
- P2: Login Flow (needs user Google OAuth credentials)
- P2: Google Indexing API (needs Service Account key)
- P2: Google Merchant Center Feed monitoring

## Upcoming
- P1: Owner Dashboard (charts, sales reports)
- P2: More international SEO pages
- P2: Activate next batch of 100 SEO pages

## Future
- Price Comparison Tables | Affiliate Program | Performance Max | Video highlights
