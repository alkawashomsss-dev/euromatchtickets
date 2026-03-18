# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Tech Stack
- **Frontend:** React + TailwindCSS + Shadcn/UI + Framer Motion + React.lazy (80+ pages)
- **Backend:** FastAPI + MongoDB
- **Auth:** Emergent-managed Google Auth
- **Payments:** Stripe Checkout
- **Emails:** Resend
- **Hosting:** Render

## What's Been Implemented

### Session - March 18, 2026 (Latest)
- **Super Bowl 2026 Landing Page** - Premium dark theme with hero (fireworks/stadium), countdown timer, social proof (340 viewing, 89 bought, 47 left), 6 ticket tiers €899-€14,999 with strikethrough pricing, price comparison table vs StubHub/Viagogo/SeatGeek, rich SEO content, FAQ schema
- **World Athletics 2026 Landing Page** - Premium blue theme with track & field hero, experience cards, 6 categories €79-€1,899 with VIP access, SEO content, cross-links
- **Rocket Speed (Lazy Loading)** - ALL 80+ pages converted from eager to React.lazy() imports with Suspense boundaries
- **Cross-Linking Network** - Super Bowl, Athletics, World Cup, F1, MotoGP, Champions League all interlinked. F1 & MotoGP pages have cross-promotion banners
- **Footer Updated** - New "More Events" section with F1, MotoGP, World Athletics, Monaco GP. Super Bowl added to Football section
- **WorldCupPage Redesigned** - Premium dark/gold theme, AI hero image, 6 ticket categories
- **Fixed Checkout Flow (P0)** - Created CheckoutPage.jsx + /api/checkout/create-event
- **Fixed Auth 403** - Switched to Emergent Auth
- **Fixed Price Visibility** - White text on light background across WorldCupPage, DynamicSEOPage
- **New Logo** - Professional ticket+stadium design
- **Tickets Moved to Top** - EventDetailsPage shows ticket tiers immediately after hero
- **CTA Links** - ComparisonPage Buy Now buttons throughout
- **Render Deployment Fixes** - Regenerated yarn.lock, pinned pydantic-core, updated render-build.sh

## Key SEO Pages (NEW)
- `/super-bowl-2026-tickets` - Super Bowl LX (Levi's Stadium, Feb 8, 2026)
- `/world-athletics-2026-tickets` - World Athletics Championship (Budapest, Sep 2026)
- `/world-cup-2026` - FIFA World Cup 2026
- `/f1-tickets` + 16 GP-specific pages
- `/motogp-tickets` + race-specific pages
- `/champions-league-tickets`, `/el-clasico-tickets`
- 1745+ dynamic SEO pages

## Prioritized Backlog

### P1 - High
- Taylor Swift Wembley 2026 landing page
- Long-tail keyword pages (F1 Monaco price, Bahrain GP cheap, MotoGP Brno VIP)
- Improve SEO titles: Cheapest, Official Alternative, Instant QR

### P2 - Medium
- Enhanced Owner Dashboard with charts/reports
- Price comparison table visual enhancements
- Bing IndexNow fix (Cloudflare blocking)

### P3 - Future
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion

## Key API Endpoints
- GET /api/events - List events
- GET /api/events/:id - Event details
- POST /api/checkout/create-event - Checkout with event category
- POST /api/alerts/subscribe - Price alerts
- POST /api/auth/session - Emergent auth

## DB Schema
- **events:** event_id, title, slug, venue, city, event_date, categories, tickets
- **orders:** order_id, buyer_id, ticket_price, commission, total_amount, status, stripe_session_id
- **alerts:** email, event_id, created_at
- **users:** user_id, email, name, picture, role
