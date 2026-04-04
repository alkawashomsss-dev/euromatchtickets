# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build euromatchtickets.com, an aggressive SEO-focused ticket marketplace. The core goal is massive scale, zero-click Google rankings, and immediate indexing via advanced programmatic SEO, Google Merchant Center XML feed, comprehensive Schema.org/JSON-LD integration, and a premium, high-conversion UI/UX.

## Platform
- **Frontend**: React (port 3000)
- **Backend**: FastAPI (port 8001)
- **Database**: MongoDB
- **Domain**: euromatchtickets.com

## User Language
Arabic (mandatory for all agent communication)

## What's Been Implemented

### April 4, 2026 - Google Structured Data Enhancement
- **Event Schema**: SportsEvent/MusicEvent with real dates, proper organizers (FIA, UEFA, FIFA), venues, performers
- **Product Schema**: Unique images per product, official brands (Formula 1, UEFA, FIFA, Live Nation), varied ratings/reviews per page
- **FAQPage Schema**: 6 category-specific FAQ questions per page for Google FAQ rich snippets
- **BreadcrumbList Schema**: Proper navigation breadcrumbs for all pages

### April 4, 2026 - SEO Optimization Sprint
- **Titles Optimized**: 1,226 active pages with keyword-rich buying-intent titles under 60 chars
- **Meta Descriptions**: 150-160 char descriptions with CTA for all pages
- **FAQs Added**: 5-6 category-specific FAQ questions per page
- **Alt Text**: Image alt attributes with event name, venue, city, year
- **Product Images**: 1,200 unique static JPEG images with text overlay
- **Feed Cleaned**: All promotional text stripped from Merchant Center feed
- **Indexing**: 1,463 URLs submitted, sitemap regenerated (1,599 URLs)

### Merchant Center Feed - Global Setup
- 1,200 products, EUR only, ~3.5 MB
- 1,200 unique product images (static JPEG)
- Clean factual descriptions
- Official brands per category
- Feed URL: `/api/merchant/feed.xml`

### Previous Work
- Site-wide price reduction
- MotoGP & Isle of Man TT interactive SVG maps
- International SEO pages (ES, DE, FR, IT)
- 410 Gone for deactivated pages
- Bing URL Submission API + IndexNow

## Key Architecture
```
/app/backend/routes/seo.py         - Feed, indexing, sitemap
/app/backend/server.py              - Main FastAPI app
/app/frontend/src/pages/DynamicSEOPage.jsx - SEO pages with Structured Data + FAQ
/app/frontend/src/components/SEOHead.jsx   - Meta tags + canonical
/app/frontend/public/product-images/       - 1,200 unique JPEGs
```

## Pending Issues
- P2: Login Flow - needs user's Google OAuth credentials
- P2: Google Indexing API - needs Service Account JSON key

## Upcoming Tasks
- P1: Enhance Owner Dashboard (charts, sales reports)
- P2: Activate next batch of SEO pages
- P2: More international SEO pages

## Future Tasks
- Price Comparison Tables
- Ticket Supplier Affiliate Program
- Performance Max campaign support
- Video/GIF highlights for events
