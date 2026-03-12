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
- Sell Your Tickets marketplace (tested 100%)
- Customer Reviews system with moderation (tested 100%)
- Admin dashboard, Seller dashboard, Owner dashboard

### SEO Infrastructure (Phases 1-5 Complete)
1. **Canonical Tag Fix**: Dynamic script in index.html sets canonical per page
2. **Page-Meta API**: `/api/seo/page-meta` endpoint for dynamic title/canonical injection
3. **Schema.org Complete**: Event, BreadcrumbList, FAQPage, Organization, WebSite schemas
4. **Static Sitemaps**: 1,849 URLs in XML files served as application/xml
5. **robots.txt**: Proper crawler directives with sitemap references
6. **IndexNow Integration**: Automatic URL submission to Bing/Yandex
7. **Meta Robots**: max-image-preview:large for Google Discover
8. **AggregateRating**: Organization schema with customer ratings
9. **Advanced Structured Data**: BreadcrumbList on 6+ key pages, FAQPage on 4+ pages
10. **Internal Linking**: Contextual cross-links between categories on DynamicSEOPage and F1TicketsPage
11. **Site Speed**: GZip compression, lazy loading images, DNS prefetch, preconnect

### Content & Pages
- 1,762 dynamic SEO pages + 77 static pages = 1,849 total URLs
- 37+ static event pages (F1 GPs, concerts, football)
- Comparison pages (vs StubHub, Viagogo, Ticketmaster, SeatGeek)
- Price guide pages per category
- Monthly events pages
- Blog system with articles

### Marketing & Trust
- Facebook Pixel integration
- Google Analytics GA4
- Exit intent popup, social proof notifications
- FanProtect guarantee pages
- Cookie consent banner (GDPR)
- Professional footer with legal disclaimers

## 3rd Party Integrations
- Stripe (Payments)
- MongoDB Atlas (Database)
- OpenAI GPT-4o (Content generation)
- Facebook Pixel (Ad tracking)
- Google Analytics GA4 (Analytics)
- IndexNow API (Instant indexing)
- Resend (Email - blocked pending domain verification)

## Known Issues
- **Live Site Deployment**: User manages deployment on Render; guide provided
- **Email Delivery**: Blocked on user verifying domain with Resend
- **Stripe Branding**: User needs to update business name in Stripe dashboard

## Backlog / Future Tasks
- P2: Comparison Pages expansion (e.g., "Monaco vs Silverstone F1")
- P2: Enhanced Owner Dashboard with real charts and sales reports
- P3: Ticket Supplier Affiliate Program
- P3: Content scaling to 5000+ SEO pages
