# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO and marketing strategy to dominate search rankings and sell 1,000 tickets in the first month. The scope includes pages for motorsport, football, and high-demand concerts.

## Platform
Full-stack FastAPI (backend) + React (frontend) + MongoDB ticket marketplace with heavy SEO focus.

## Core Features
- Browse events by category (Football, Concerts, F1, MotoGP, World Cup)
- 2000-5000 SEO-optimized landing pages
- Automated content generation bots with IndexNow instant indexing
- Professional e-tickets with QR codes
- Direct Google OAuth2 authentication
- Stripe payment integration
- FanProtect buyer guarantee
- Schema.org structured data (Event, Breadcrumb, FAQ, Organization)

## Architecture
```
/app/
├── backend/       # FastAPI with modular routes
│   ├── routes/    # auth, events, tickets, seo, admin, marketing, seed
│   ├── database/  # MongoDB connection
│   ├── models/    # Pydantic schemas
│   └── config/    # Settings
├── frontend/      # React with Tailwind + shadcn/ui
│   ├── public/images/heroes/  # Local optimized WebP images
│   ├── src/pages/             # 80+ pages
│   └── src/components/        # Reusable components
```

## What's Been Implemented
- Full marketplace with event browsing, search, filters
- Google OAuth2 direct integration (authlib)
- Stripe checkout flow
- AI-generated local images (WebP optimized) for all categories
- Themed category pages (F1=Red, MotoGP=Orange, etc.)
- Professional logo, favicons, Organization schema
- Image sitemaps with <image:image> tags
- Static sitemap generation
- GZip compression, aggressive caching (1yr for images)
- Facebook Pixel + Google Analytics 4
- Cookie consent banner (GDPR)
- Multiple language support framework

## Completed This Session (2026-03-12)
- Fixed event API date filtering (verified working - 193 future events only)
- Replaced ALL external image URLs (Pexels/Unsplash) with local optimized WebP images on EventsPage
- Enhanced CacheControlMiddleware: 1-year immutable cache for /images/ and static assets
- Fixed sitemaps to exclude past/cancelled/expired events
- Fixed internal links endpoint to only return future events
- Updated structured data to use local image URLs
- Cleaned up index.html: removed unnecessary dns-prefetch for external image hosts
- Updated image preload hints to match actual hero images used

## Pending Issues
- Google Login on live site: BLOCKED on user adding redirect URIs in Google Cloud Console
- Live site deployment: BLOCKED on user clicking "Save to GitHub"
- Email ticket delivery: BLOCKED on user verifying domain with Resend

## Upcoming Tasks (P1)
- Implement comparison pages (e.g., "Monaco vs Silverstone F1")
- Enhance owner dashboard with charts and sales reports

## Future Tasks (P2+)
- Integrate ticket supplier affiliate program
- Email ticket delivery (pending Resend domain verification)
