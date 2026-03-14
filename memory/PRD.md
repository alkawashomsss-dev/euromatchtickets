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
│   ├── services/  # content_generator.py, template_generator.py
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

## Completed (2026-03-14) - Content Generation System
- **Smart Template Content Generator:** Built a free, instant content generation system that produced unique content for ALL 1,762 SEO pages with zero errors
  - 17 pages: AI-generated via OpenAI GPT-4o (high quality, ~3000 chars each)
  - 1,745 pages: Smart template content (category-specific, ~2700 chars each)
  - Content varies by category (F1, football, concerts, World Cup) with unique openers, venue details, ticket advice, local tips, and CTAs
  - All content in HTML <p> tags format, includes internal links
- **Content Generation API Endpoints:**
  - `GET /api/seo/content-stats` - Progress tracking
  - `POST /api/seo/generate-content-bulk` - AI bulk generation (requires LLM budget)
  - `POST /api/seo/generate-template-content` - Free instant template generation
  - `POST /api/seo/generate-content-single/{slug}` - Single page AI generation
  - `GET /api/seo/generate-content-status` - Job status
- **Render Build Fix:** Fixed deployment failure caused by emergentintegrations package not being on public PyPI

## Pending Issues
- Email ticket delivery: BLOCKED on user verifying domain with Resend

## Upcoming Tasks (P1)
- Implement Google One Tap Login for faster sign-in
- Implement comparison pages (e.g., "Monaco vs Silverstone F1")

## Future Tasks (P2+)
- Enhance owner dashboard with charts and sales reports
- Integrate ticket supplier affiliate program
- Email ticket delivery (pending Resend domain verification)
- Upgrade remaining 1,745 pages to AI content when LLM budget available
