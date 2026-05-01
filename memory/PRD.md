# EuroMatchTickets — Product Requirements

## Mission
Premium European secondary-market ticket platform (`euromatchtickets.com`) dominating long-tail Google search for global events (F1, FIFA World Cup 2026, Champions League, Concerts).

## Core Principles — "Honesty Layer"
- NO fake scarcity ("Selling Fast", "X viewing now")
- NO fake reviews or fake "cheapest in Europe" claims
- NO fake price anchors ("From €XX Save Y%")
- Marketplace wording: "Compare Listings", "View Tickets", "Market pricing may vary"
- 100% unique event imagery (no stock recycling)
- JSON-LD: `SportsEvent` / `MusicEvent` with single `offers` field (NO `Product`, NO `AggregateOffer`)

## Tech Stack
- React 19 + FastAPI + MongoDB
- SSR JSON-LD schema injected in `server.py`
- Supervisor-managed, `/api` prefix routing

## Top-Demand Events (P0 SEO)
TOP 10 high-demand slugs receive long-tail keyword titles, 10-FAQ schemas, and `priority=1.0` + `changefreq=hourly` in sitemap:
El Clasico · World Cup 2026 Final · Monaco GP · UCL Final · Coldplay · Taylor Swift · Miami GP · British GP · Spanish MotoGP · Roland Garros Final.

Managed in `/app/frontend/src/data/top10SEO.js`.

## Status — May 1, 2026
**219 active/coming-soon events** across:
- worldcup (104), concert (27), f1 (24), motogp (21), attraction (12), festival (10), match (8), tennis (7), athletics (5), isle_of_man_tt (5), football (5)

## Completed (recent)
- Schema.org cleanup (removed Product/AggregateOffer, kept SportsEvent+Offer)
- Global CTR v4 rewrite (marketplace tone)
- `LiveListingsCounter` on all event heroes
- Football filter fix (113 events: worldcup + football + match)
- Offers injection across 26 SEO landing pages
- **TOP 10 long-tail SEO enrichment (May 1)**

## Backlog
- **P1**: Demand Intelligence Dashboard — charts/analytics from `waitlist` + `price_alerts`
- **P1**: SendGrid / Resend live email dispatch (waitlist drops, price-drop alerts, confirmations)
- **P2**: Convert category landing pages to visual carousels
- **Future**: French / Italian SEO pages
- **Future**: Retargeting pixel segmentation
- **Refactor**: Template-based programmatic SEO pages (replace 26 manual pages)

## Known Issue (user-action)
Production MongoDB Atlas — user must grant `readWriteAnyDatabase` to DB user.

## Integrations
- Stripe (LIVE keys in .env)
- Google OAuth (user-supplied)
