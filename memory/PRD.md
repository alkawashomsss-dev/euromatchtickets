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
- Frontend redirects to accounts.google.com with dynamic redirect_uri
- Backend exchanges code for tokens via Google's token endpoint
- Retry logic (3 attempts) for network/server errors
- Legacy Emergent auth endpoint kept for backward compatibility
- **User MUST add redirect URIs in Google Cloud Console:**
  - `https://euromatchtickets.com/auth/callback`
  - `https://seotix-platform.preview.emergentagent.com/auth/callback`
- **User MUST publish OAuth consent screen** (currently in test mode, only test users can login)

### Professional Ticket System (Feb 2026)
- Professional ticket design matching StubHub/Ticketmaster quality
- QR code on every ticket with unique order ID
- Event branding with category colors
- Download/Print functionality
- FanProtect Guarantee branding

### SEO Infrastructure (Phases 1-5 Complete)
1. SPA Indexing Fix: Dynamic script in index.html
2. Page-Meta API: /api/seo/page-meta endpoint
3. Schema.org: Event, BreadcrumbList, FAQPage, Organization, WebSite
4. Static Sitemaps: 1,849 URLs (6 category sitemaps)
5. robots.txt with crawler directives
6. IndexNow API for instant indexing
7. Internal Linking: Static + Dynamic API-powered contextual cross-links
8. Site Speed: GZip compression, lazy loading, DNS prefetch

### Sitemap Fix (Mar 12, 2026)
- Fixed empty articles.xml causing Google Search Console error
- Dynamic sitemap-index.xml conditionally includes articles only when articles exist

### Internal Linking Feature (Mar 12, 2026)
- `/api/seo/related-pages` endpoint with database-driven recommendations
- Cross-category and same-city suggestions
- InternalLinks.jsx renders both static and dynamic links

### Content & Pages
- 1,762 dynamic SEO pages + 77 static pages = 1,849 total URLs
- 37+ static event pages

## 3rd Party Integrations
- Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, GA4, IndexNow, Resend (blocked), Google OAuth 2.0

## CRITICAL: User Actions Required
1. **Google Cloud Console - Redirect URIs:** Add these in OAuth credentials:
   - Authorized redirect URIs: `https://euromatchtickets.com/auth/callback`
   - Authorized JavaScript origins: `https://euromatchtickets.com`
2. **Google OAuth Consent Screen:** Publish the app (move from Testing to Production)
3. **Deploy Latest Code to Render:** The Google OAuth changes must be deployed
4. **Render Backend .env:** Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Known Issues
- Email Delivery: Blocked on domain verification with Resend
- Stripe Branding: User needs to update in Stripe dashboard

## Backlog (Priority Order)
- P2: Comparison Pages expansion
- P2: Enhanced Owner Dashboard with charts and sales reports
- P3: Ticket Supplier Affiliate Program
- P3: Content scaling to 5000+ SEO pages
