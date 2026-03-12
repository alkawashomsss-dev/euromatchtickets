# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets in the first month.

## Architecture
- **Frontend:** React (CRA) with Tailwind CSS + Shadcn UI
- **Backend:** FastAPI with MongoDB (Motor async driver)
- **Hosting:** Render (Frontend Static Site + Backend Web Service)
- **Database:** MongoDB Atlas
- **Payments:** Stripe
- **Analytics:** Google Analytics GA4 + Facebook Pixel
- **SEO:** IndexNow API, Static Sitemaps, Dynamic Meta Tags
- **Auth:** Direct Google OAuth 2.0 (replaced Emergent-managed auth)

## Completed Features

### Core Platform
- Browse events by category (Football, Concerts, F1, MotoGP, World Cup)
- Event details with interactive seat map and ticket purchasing
- Stripe payment integration with QR code ticket delivery
- Google OAuth 2.0 authentication (direct, supports custom domains)
- Sell Your Tickets marketplace
- Customer Reviews system with moderation

### Google OAuth 2.0 (Mar 12, 2026) - REPLACED Emergent Auth
- Direct Google OAuth using authorization code flow
- Works with custom domain (euromatchtickets.com) and preview URLs
- User MUST add redirect URIs, publish OAuth consent screen, add env vars to Render

### Schema.org Fixes (Mar 12, 2026)
- Fixed duplicate FAQPage on F1TicketsPage (removed inline faqSchema, kept FAQStructuredData component)
- Removed unused faqSchema from EventDetailsPage
- Added `performer` field to ALL Event schemas (F1, MotoGP, World Cup, Isle of Man TT, DynamicSEOPage)
- Added fallback `description` to DynamicSEOPage Event schema
- Updated EventStructuredData component to include performer for all event types (not just concerts)

### Sitemap Fix (Mar 12, 2026)
- Fixed empty articles.xml causing Google Search Console error

### Internal Linking Feature (Mar 12, 2026)
- `/api/seo/related-pages` endpoint with database-driven recommendations

### SEO Infrastructure (Phases 1-5)
- 1,849 pages indexed in Google Search Console
- Schema.org: Event, BreadcrumbList, FAQPage, Organization, WebSite
- GZip compression, lazy loading, DNS prefetch

## CRITICAL: User Actions Required
1. Google Cloud Console: Add redirect URIs and publish OAuth consent screen
2. Render Backend .env: Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
3. Deploy latest code to Render

## Known Issues
- Email Delivery: Blocked on domain verification with Resend
- Stripe Branding: User needs to update in Stripe dashboard

## Backlog
- P2: Comparison Pages expansion
- P2: Enhanced Owner Dashboard
- P3: Ticket Supplier Affiliate Program
- P3: Content scaling to 5000+ SEO pages
