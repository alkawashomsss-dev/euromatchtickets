# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Tech Stack
- Frontend: React + TailwindCSS + Shadcn/UI + Framer Motion + React.lazy (80+ pages)
- Backend: FastAPI + MongoDB
- Auth: Emergent-managed Google Auth
- Payments: Stripe Checkout
- Emails: Resend
- Hosting: Render

## What's Been Implemented

### March 18, 2026 - Session 2
- **Taylor Swift Wembley 2026 Page** - Premium pink/purple theme, hero with concert atmosphere, countdown, 6 show dates (Jun 19-28) with status badges, 5 ticket tiers €89-€999, VIP/Diamond packages, SEO schema, cross-links
- **Featured Events Carousel** - Homepage "HOTTEST EVENTS" carousel with Taylor Swift, Super Bowl, World Cup. Auto-rotation, countdown timers, navigation arrows, from prices
- **SEO Title Optimization** - All major pages updated with "Cheapest", "Official Alternative", "Instant QR Delivery" keywords:
  - Homepage, F1 Tickets, Monaco GP, Bahrain GP, MotoGP, Champions League
- **Cross-linking improvements** - Footer updated with Super Bowl, World Athletics links

### March 18, 2026 - Session 1
- **Super Bowl 2026 Page** - Red/gold theme, countdown, social proof (340 viewing/89 bought/47 left), 6 packages €899-€14,999 with strikethrough pricing, price comparison vs StubHub/Viagogo/SeatGeek
- **World Athletics 2026 Page** - Blue theme, 6 categories €79-€1,899, VIP track-side
- **Lazy Loading** - ALL 80+ pages converted to React.lazy()
- **WorldCupPage Redesigned** - Premium dark/gold theme
- **Checkout Fix** - CheckoutPage + /api/checkout/create-event endpoint
- **Auth Fix** - Switched to Emergent Auth (403 resolved)
- **Price Visibility Fix** - White-on-white text fixed
- **New Logo** - Ticket+stadium design
- **Tickets at Top** - EventDetailsPage restructured
- **CTA Links** - ComparisonPage Buy Now buttons
- **Render Deploy Fixes** - yarn.lock, pydantic-core, render-build.sh

## Key SEO Pages
- /taylor-swift-wembley-2026-tickets (NEW)
- /super-bowl-2026-tickets
- /world-athletics-2026-tickets
- /world-cup-2026
- /f1-tickets + 16 GP pages
- /motogp-tickets + race pages
- /champions-league-tickets, /el-clasico-tickets
- 1745+ dynamic SEO pages

## Prioritized Backlog

### P1 - High
- More long-tail keyword pages (specific GP prices, cheap tickets)
- Enhanced Owner Dashboard with charts/reports

### P2 - Medium
- Price comparison table visual enhancements
- Bing IndexNow fix

### P3 - Future
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion
