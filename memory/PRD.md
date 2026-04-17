# EuroMatchTickets - PRD

## Architecture
React + FastAPI + MongoDB. Dark theme (#0e0e14, #e10600).

## Schema Deduplication + Content SEO (April 17, 2026) — DONE

### Fixed Duplicate FAQPage Schemas:
- TaylorSwiftLondonPage: removed old FAQStructuredData, kept EventFAQ
- ColdplayPage: removed old FAQStructuredData, kept EventFAQ
- MonacoGPPage: removed old FAQStructuredData, kept EventFAQ
- F1TicketsPage: removed old FAQStructuredData, kept FAQSchemaScript

### Result: Zero duplicate schemas across all 14 keyword pages
- Each page has: 1 Event/Product + 1 FAQPage + 1 BreadcrumbList
- No double Product, no double FAQ

### Content Quality — All 14 Pages Consistent:
Each page template: SEOHead + ProductSchema + BreadcrumbSchema + FAQSchemaScript + EventFAQ + RelatedEventsLinks + Rich content

## Pending
- P1: Owner Dashboard
- P2: Email Drip Campaigns
