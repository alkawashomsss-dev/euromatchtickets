# EuroMatchTickets - PRD

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Core Features
- Browse events by category (Football, Concerts, F1, MotoGP, etc.)
- 1745+ SEO-optimized landing pages
- Professional, conversion-optimized design
- Trust signals: FanProtect guarantee, customer reviews, secure payment
- Advanced Structured Data (Schema.org)
- Conversion features: scarcity, urgency, social proof
- Price drop alerts with Resend emails
- Google OAuth via Emergent Auth

## Tech Stack
- **Frontend:** React + TailwindCSS + Shadcn/UI + Framer Motion
- **Backend:** FastAPI + MongoDB
- **Auth:** Emergent-managed Google Auth
- **Payments:** Stripe Checkout
- **Emails:** Resend
- **Hosting:** Render
- **3rd Party:** Unsplash (images), QR codes

## What's Been Implemented

### Session - March 17, 2026 (Latest)
- **Fixed Checkout Flow (P0):** Created CheckoutPage.jsx + /api/checkout/create-event endpoint. Users can now complete purchases via Stripe.
- **Fixed Auth 403 Error:** Switched from direct Google OAuth to Emergent Auth (auth.emergentagent.com) for preview environment compatibility.
- **Fixed Price Visibility:** Changed white-on-white text to dark text on WorldCupPage, DynamicSEOPage.
- **New Logo:** Professional ticket+stadium design replacing old icon.
- **Tickets Moved to Top:** EventDetailsPage now shows ticket tiers immediately after hero.
- **CTA Links Added:** ComparisonPage now has "Buy Tickets Now" buttons throughout.
- **Rocket Speed (Lazy Loading):** Converted 80+ page imports to React.lazy() - massive performance boost.
- **WorldCupPage Redesigned:** Premium dark theme with golden accents, stunning AI-generated hero image with trophy and stadium, 6 ticket categories with gradient cards and VIP tiers.
- **Render Deployment Fixes:** Regenerated yarn.lock, pinned pydantic-core==2.33.1, updated render-build.sh with --no-frozen-lockfile.

### Previous Sessions
- Complete UI/UX overhaul to premium light theme
- Conversion widgets (scarcity, urgency, social proof)
- Price alert system with Resend emails
- Professional email templates with QR codes
- 1745+ SEO landing pages
- Venue info with Google Maps
- Price comparison tables

## Prioritized Backlog

### P0 - Critical
- ✅ Fix checkout flow (DONE)
- ✅ Fix auth 403 (DONE)
- ✅ Fix Render deployment files (DONE - needs GitHub push)

### P1 - High
- Taylor Swift Wembley 2026 landing page
- Long-tail keyword SEO pages (F1 Monaco price, Bahrain GP cheap, MotoGP Brno VIP)
- Improve SEO titles with Cheapest, Official Alternative, Instant QR
- HTTPS enforcement verification post-deploy

### P2 - Medium
- Enhanced Owner Dashboard with charts/reports
- Price comparison table visual enhancements
- Bing IndexNow fix (Cloudflare blocking)

### P3 - Future
- Ticket supplier affiliate program
- AI content enhancement
- Multi-language expansion

## Key API Endpoints
- GET /api/events - List all events
- GET /api/events/:id - Event details
- POST /api/checkout/create - Checkout with ticket_id
- POST /api/checkout/create-event - Checkout with event category (NEW)
- POST /api/alerts/subscribe - Price alerts
- POST /api/auth/session - Emergent auth exchange
- GET /api/auth/me - Current user

## DB Schema
- **events:** event_id, title, slug, venue, city, event_date, categories, tickets, views, bookings_today
- **orders:** order_id, buyer_id, ticket_price, commission, total_amount, status, stripe_session_id
- **alerts:** email, event_id, created_at
- **users:** user_id, email, name, picture, role
- **user_sessions:** session_token, user_id, expires_at
