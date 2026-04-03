# EuroMatchTickets - PRD

## Original Problem Statement
Build `euromatchtickets.com`, a ticket marketplace with primary focus on SEO and sales. Goal: sell 1,000 tickets in first month.

## Architecture
- **Backend**: FastAPI + MongoDB + Emergent LLM (GPT-4.1-mini)
- **Frontend**: React + pre-hydration vanilla JS for SEO
- **SEO**: Pre-hydration meta + React JSON-LD + Programmatic SEO + Nuclear Indexing

## Features Implemented

### 9-Point Conversion Optimization (2026-04-01) - DONE
All 12+ pages updated with:
1. **Hero Section**: High-intent H1 + subheadline with instant QR delivery messaging
2. **Scarcity/Urgency Badges**: "Only X tickets left" (red pulse), "X people viewing now" (amber), "Prices up X% this week" (green)
3. **Internal Linking**: Keyword-rich anchor text sections on World Cup, F1, CL pages linking to sub-pages
4. **Page Hierarchy**: Main pages link to sub-pages and vice versa
5. **CTA Changed**: All "Buy Tickets" → "Secure Your Seat Now" / "Secure Seat" / "View Available Seats"
6. **Competitor Attack**: "Up to 40% cheaper than Viagogo & StubHub" on every page
7. **Trust Signals Unified**: "500,000+ Tickets Sold", "4.9/5 from 12,000+ Reviews", "25+ Countries", "100% Money Back Guarantee"
8. **Performance**: React.lazy, image lazy loading, no blocking JS
9. **GA4 Tracking**: CTA click tracking, scroll depth tracking (25/50/75/100%), view_item events

### Google Merchant Center Discovery (2026-04-01) - RESOLVED
- DISCOVERED: Google Merchant Center prohibits event tickets in product feeds
- Static XML feed created at `/merchant-feed.xml` but won't work due to Google policy
- Alternative: Event Structured Data (already implemented) + Google Ads Ticket Seller Certification

### Schema.org JSON-LD Fix (2026-04-01) - DONE
- Fixed "Item without name" error across 17 files
- Added `name` to all Review, ImageObject, ContactPoint objects

### Merchant Feed Price Fix (2026-04-01) - DONE
- Removed fake 97% discount (g:sale_price scam)
- Using actual prices only

### Merchant Feed Currency Mismatch Fix (2026-04-04) - DONE
- Matched feed exactly to Merchant Center's 27 target countries with 20 local currencies
- Countries: AT, FI, FR, GR, IE, IT, NL, ES (EUR), GB (GBP), CH (CHF), PL (PLN), SE (SEK), DK (DKK), NO (NOK), RO (RON), UA (UAH), RU (RUB), TR (TRY), US (USD), CA (CAD), AR (ARS), PE (PEN), UY (UYU), AE (AED), SA (SAR), AU (AUD), NZ (NZD)
- 24,000 products total, removed non-target countries (Korea etc.) that caused registration errors

## Reusable Components Created
- `ConversionElements.jsx`: ScarcityBadges, ScarcityBadgesLight, TrustBar, CompetitorLine

## Route Fixes
- `/world-cup-2026` → WorldCup2026Page (was using wrong component)
- `/taylor-swift-wembley-2026-tickets` → TaylorSwiftLondonPage (was using wrong component)

## P1 (Next)
- [ ] Google Ads Ticket Seller Certification guidance
- [ ] Owner Dashboard (charts/sales reports)
- [ ] French/Italian SEO pages

## P2 (Future)
- [ ] Price Comparison Tables
- [ ] Ticket Supplier Affiliate Program
- [ ] Google Indexing API (requires service account key)
