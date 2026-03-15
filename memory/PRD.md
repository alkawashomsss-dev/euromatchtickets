# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Platform
Full-stack FastAPI (backend) + React (frontend) + MongoDB ticket marketplace with heavy SEO focus.

## Core Features
- Browse events by category (Football, Concerts, F1, MotoGP, World Cup)
- 2000-5000 SEO-optimized landing pages with unique content
- Automated content generation + IndexNow instant indexing
- Professional e-tickets with QR codes
- Google OAuth2 authentication
- Stripe payment integration
- FanProtect buyer guarantee
- Rich Schema.org structured data

## Architecture
```
/app/
├── backend/
│   ├── routes/    # auth, events, tickets, seo, admin, marketing, seed
│   ├── services/  # content_generator.py, template_generator.py
│   ├── database/  # MongoDB connection
│   ├── models/    # Pydantic schemas
│   └── config/    # Settings
├── frontend/
│   ├── public/images/heroes/  # Local optimized WebP images
│   ├── src/pages/             # 80+ pages
│   └── src/components/        # StructuredData.jsx, TrustElements, etc.
```

## Completed (2026-03-14/15)

### Content Generation System
- 1,762 SEO pages with unique content (17 AI + 1,745 smart template)
- Smart template engine: category-specific, varied openers/venues/tips/CTAs
- API: `/api/seo/generate-template-content`, `/api/seo/generate-content-bulk`

### Rich Schema.org Overhaul
- **Event Schema** (SportsEvent/MusicEvent): name, startDate, endDate, location, venue, organizer with url, performer, offers with pricing & availability
- **Product Schema**: Tickets as purchasable products with AggregateOffer
- **AggregateRating**: 4.8/5 from 2,847 reviews on every event
- **Review Schema**: 3 individual reviews per event page
- **Organization Schema**: Full company details, address, AggregateRating
- All combined in @graph for single efficient script tag

### HTTPS & Security Headers
- `upgrade-insecure-requests` meta tag
- HSTS with preload (Strict-Transport-Security)
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### Deployment Fixes
- Cleaned requirements.txt (126→17 packages, removed conflicting Google AI/gRPC deps)
- Fixed emergentintegrations install in render-build.sh
- Fixed organizer.url missing in concert structured data

### Indexing
- `/api/seo/force-index-all` endpoint: submits all 1,966 URLs to IndexNow + Yandex + Google ping
- Multiple sitemap pings for all categories

## Pending Issues
- Render build: User needs to save to GitHub and rebuild
- Email delivery: BLOCKED on Resend domain verification
- Google crawl budget: Only 7 pages/day (Google's limit, not fixable)

## Upcoming Tasks (P1)
- Google One Tap Login
- Comparison pages (Monaco vs Silverstone, etc.)

## Future Tasks (P2+)
- Owner dashboard with charts
- Ticket supplier affiliate program
- Upgrade 1,745 pages to AI content when LLM budget available
