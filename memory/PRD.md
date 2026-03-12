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

## Completed Features

### Core Platform
- Browse events by category (Football, Concerts, F1, MotoGP, World Cup)
- Event details with interactive seat map and ticket purchasing
- Stripe payment integration with QR code ticket delivery
- Google OAuth authentication (Emergent-managed)
- Sell Your Tickets marketplace
- Customer Reviews system with moderation

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
7. Meta Robots: max-image-preview:large
8. AggregateRating on Organization schema
9. BreadcrumbList on 6+ key pages, FAQPage on 4+ pages
10. Internal Linking: Static + Dynamic API-powered contextual cross-links
11. Site Speed: GZip compression, lazy loading, DNS prefetch

### Sitemap Fix (Mar 12, 2026)
- Fixed empty articles.xml causing Google Search Console error
- Removed articles.xml entry from static sitemap-index.xml
- Made dynamic sitemap-index.xml conditionally include articles only when articles exist in DB
- Deleted empty static articles.xml file

### Internal Linking Feature Complete (Mar 12, 2026)
- Implemented `/api/seo/related-pages` endpoint with full database logic
- Returns contextually related pages based on category, city, and current page
- Cross-category suggestions when primary results are limited
- InternalLinks.jsx now displays both static hardcoded links AND dynamic API-powered related pages
- Properly excludes current page from suggestions

### Content & Pages
- 1,762 dynamic SEO pages + 77 static pages = 1,849 total URLs
- 37+ static event pages
- Comparison, price guide, monthly events pages
- Blog system

## 3rd Party Integrations
- Stripe, MongoDB Atlas, OpenAI GPT-4o, Facebook Pixel, GA4, IndexNow, Resend (blocked)

## Known Issues
- Live Site Deployment: User manages on Render
- Email Delivery: Blocked on domain verification
- Stripe Branding: User needs to update in Stripe dashboard

## Backlog (Priority Order)
- P2: Comparison Pages expansion (e.g., "Monaco vs Silverstone F1")
- P2: Enhanced Owner Dashboard with charts and sales reports
- P3: Ticket Supplier Affiliate Program
- P3: Content scaling to 5000+ SEO pages
