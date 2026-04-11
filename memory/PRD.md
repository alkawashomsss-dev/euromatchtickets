# EuroMatchTickets - Product Requirements Document

## Overview
**euromatchtickets.com** - Premium ticket marketplace for sports and entertainment events across Europe. Focus: aggressive SEO, conversion optimization, professional F1-style UI/UX.

## Design System (Updated April 11, 2026)
- **Primary Red**: #e10600 (Header, CTAs, accents)
- **Dark BG**: #0e0e14 | **Surface**: #15151e | **Card**: #1e1e1e
- **Font**: Oswald (headings, uppercase, bold) + Inter (body)
- **Style**: Sharp edges (rounded-none), F1 Tickets inspired

## What's Been Implemented

### Phase 1-3: Core Platform, SEO Engine, Marketing (Complete)
- Full event marketplace with auth, tickets, checkout
- 100+ SEO landing pages with Schema.org
- Static sitemap, pre-hydration script, international pages
- Social Hub, retargeting pixels, email campaigns

### Phase 4: UI/UX Redesign (April 11, 2026 - COMPLETE)
- Bold red F1-style header (#e10600) with dark sub-nav
- Complete dark theme across ALL 100+ pages
- Dark cookie consent banner (no purple!)
- Updated Footer, event cards, all components
- Mobile-responsive dark design
- 100% test pass rate (iteration_46.json)

### Phase 5: SEO Domination Strategy (April 11, 2026 - COMPLETE)
- **Spa F1 Mega Page**: 3000+ word comprehensive SEO page covering:
  - Detailed ticket listings with 7 sections + 2 VIP packages
  - Corner-by-corner circuit guide (8 corners)
  - 10 interactive FAQ items with FAQ Schema
  - Travel guide (airport, train, car, hotel)
  - Weather section, reviews section
  - Price comparison table vs competitors
  - Video embed section
  - "People Also Search For" keyword cloud (30+ terms)
- **35+ Keyword Variation Routes**: Every search query has its own URL:
  - /spa-f1-tickets, /belgian-grand-prix-tickets, /belgium-f1-tickets
  - /spa-gp-tickets, /f1-spa-tickets, /spa-francorchamps-tickets
  - /formel-1-spa-tickets (German), /formule-1-spa-tickets (French)
  - /gp-belgie-tickets (Dutch), /f1-kaarten-spa (Dutch)
  - All with correct canonical redirects to primary URL
- **Schema.org JSON-LD**: SportsEvent, FAQPage, BreadcrumbList, AggregateOffer
- **Internal Linking Boost**:
  - Header sub-nav: "Spa F1 Tickets" prominently featured
  - Footer: "Spa F1 Tickets" + "Belgian GP" links
  - Homepage: "Trending Now" section with Spa as #1
  - F1 Tickets page: Direct link to Spa page for Belgian GP
- **Taylor Swift Keyword Routes**: 
  - /taylor-swift-tickets-wembley, /taylor-swift-wembley-tickets
  - /taylor-swift-concert-london, /taylor-swift-eras-tour-london
- **Sitemaps Updated**: 24 new Spa URLs + 4 Taylor Swift URLs
- **Pre-hydration Metadata**: All 35+ routes have custom title/description
- 100% test pass rate (iteration_47.json)

## Keywords Targeted (from Google Search Console)
| Keyword | Impressions | Route |
|---------|------------|-------|
| spa f1 tickets | 19 | /spa-f1-tickets |
| spa francorchamps tickets | 18 | /spa-francorchamps-tickets |
| f1 spa tickets | 13 | /f1-spa-tickets |
| spa grand prix tickets | 12 | /spa-grand-prix-tickets |
| spa francorchamps f1 tickets | 12 | /spa-francorchamps-f1-tickets |
| belgian grand prix tickets | 7 | /belgian-grand-prix-tickets |
| taylor swift london tickets | 5 | /taylor-swift-london-tickets |
| motogp tickets | 3 | /motogp-tickets |
| entradas champions league | 3 | /es/entradas-champions-league |

## Known Issues / Blockers
- **P1**: Sora 2 Video Budget Exhausted (user must add balance)
- **P2**: Login - Using Emergent-managed Google OAuth

## Upcoming Tasks
1. P1: Enhance Owner Dashboard (stats, email reports)
2. P2: Add French/Italian SEO landing pages
3. P2: Activate next batch of 100 SEO pages
4. P2: Custom email templates by event type

## Future/Backlog
- Price Comparison Tables improvement
- Ticket Supplier Affiliate Program
- A/B testing for SEO titles
- Video highlights on event pages
- Retargeting Pixel segmentation
