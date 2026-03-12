# EuroMatchTickets - Product Requirements Document

## Original Problem Statement
Build a ticket marketplace (euromatchtickets.com) with aggressive SEO strategy to dominate search rankings and sell 1,000 tickets in the first month. Includes pages for motorsport, football, concerts, and high-demand events. Key requirements: programmatic SEO pages, automated marketing, trustworthy professional appearance, and fully functional e-ticketing with QR codes.

## Architecture
- **Frontend:** React + Tailwind CSS + Shadcn UI
- **Backend:** FastAPI (monolith server.py ~4900 lines)
- **Database:** MongoDB Atlas
- **Hosting:** Render (production), Preview on Emergent

## What's Been Implemented

### Core Platform
- Event browsing by category (Football, F1, Concerts, MotoGP, World Cup)
- Stripe payment integration
- Event detail pages with seat maps
- Reseller compliance (terms, notice, price breakdown)

### SEO System (1,762+ Pages) - March 2026
- **Mega SEO Generator v3** - generates unique pages with:
  - 300-600 word unique content per page (history, tips, transport)
  - Unique FAQ sections (randomized from pools)
  - Internal links to related pages
  - Competitive price comparison tables
  - Real event data and statistics
- **Categories:** F1 (528), Football (292), Concerts (850), World Cup (22), City pages (80+)
- **Page Types:** Event landings, ticket types, club pages, matchups, city-artist combos
- **Structured Data:** Event + BreadcrumbList + Organization schemas
- **Sitemap Index** at `/api/sitemap-index.xml` with 7 category sitemaps
- **Dynamic SEO Page** renderer (catch-all route `/:slug`)

### Marketing & Analytics
- Facebook Pixel (2229040237407271) with event tracking
- Google Analytics (G-9QVMZCNVYK)
- Landing pages: Monaco GP, El Clasico, Champions League
- Video ad reel (F1/Sora 2)

### Automated Systems
- Daily cleanup bot (marks events as `past_event`, preserves SEO value)
- SEO page generation bot
- Article indexing bot

## P0 - Completed
- [x] 1,762 unique SEO pages generated
- [x] Split sitemap index system
- [x] Smart cleanup (past_event, not delete)
- [x] Structured data for all pages
- [x] Dynamic page rendering with /:slug route

## P1 - In Progress / Upcoming
- [ ] server.py refactoring (critical - 4900+ lines)
- [ ] Deployment guide in Arabic
- [ ] "Sell Your Tickets" functionality

## P2 - Future
- [ ] User accounts system
- [ ] Owner dashboard with real charts
- [ ] Customer review system
- [ ] Email ticket delivery (blocked on Resend domain verification)
- [ ] Ticket supplier affiliate program
- [ ] Delete obsolete backup files

## Key API Endpoints
- `POST /api/seo/mega-generate` - Generate all SEO pages
- `GET /api/seo/stats` - SEO page statistics
- `GET /api/seo/page/{slug}` - Get specific SEO page
- `GET /api/seo/pages` - Paginated page listing
- `GET /api/sitemap-index.xml` - Sitemap index
- `GET /api/sitemaps/{category}.xml` - Category sitemaps
- `POST /api/cleanup/expired-events` - Smart cleanup
- `GET /api/cleanup/status` - Cleanup status

## Database Collections
- `events` - Event listings (status: active/past_event/expired)
- `tickets` - Ticket inventory
- `seo_pages` - Generated SEO pages (slug indexed)
- `articles` - Blog articles

## 3rd Party Integrations
- Stripe (payments)
- MongoDB Atlas
- OpenAI GPT-4o (content gen bots)
- Sora 2 (video generation)
- Resend (email - blocked)
- Facebook Pixel
- Google Analytics
