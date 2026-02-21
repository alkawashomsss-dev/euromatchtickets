# FanPass - Events & Tickets Marketplace

## Original Problem Statement
Build a professional ticket marketplace for:
- European football matches (Champions League, Premier League, La Liga, Bundesliga)
- Concerts (Taylor Swift, Coldplay, Drake, Ed Sheeran, Beyoncé, The Weeknd, etc.)

### Core Requirements
- 10% platform commission on each sale
- Event listing with filters (type, city, date)
- Interactive venue/stadium seat maps
- Google OAuth authentication
- Seller dashboard with KYC verification
- Stripe payment integration
- QR Code digital tickets
- Admin dashboard for management
- SEO optimization (sitemap, robots.txt, meta tags, Schema Markup)
- Support pages (About, Terms, Contact, Refund Policy)

## Architecture
- **Backend:** FastAPI + MongoDB
- **Frontend:** React + TailwindCSS + Shadcn UI
- **Auth:** Emergent Google OAuth
- **Payments:** Stripe Checkout
- **Emails:** Resend (API key required)

## What's Been Implemented (Feb 21, 2025)

### SEO Optimization ✅
- **sitemap.xml** - Dynamic endpoint at `/api/sitemap.xml` with all pages and events
- **robots.txt** - Proper directives at `/api/robots.txt`
- **Meta tags** - Dynamic titles and descriptions per page
- **Support Pages:**
  - About Us (`/about`)
  - Terms & Conditions (`/terms`)
  - Contact Us (`/contact`)
  - Refund Policy (`/refund-policy`)

### Backend (100% Complete)
- Full event CRUD APIs (matches + concerts)
- Ticket listing and management
- Order processing with Stripe
- QR code generation
- Google OAuth integration
- KYC submission system
- Dispute management
- Rating system
- Admin statistics and user management
- Price alerts API
- Seller payouts API
- Email service ready (needs RESEND_API_KEY)
- Seed data: 30 events (14 matches + 16 concerts)

### Frontend (100% Complete)
- Homepage with featured events
- Events listing with filters
- Event details with venue maps
- **Concert venue map** - Shows STAGE, VIP, FLOOR layout ✅ (Fixed)
- **Football venue map** - Shows pitch with CAT1, CAT2, CAT3, VIP ✅
- Ticket selection and purchase
- Order success with QR codes
- My Tickets page
- Seller Dashboard
- Admin Dashboard
- Price Alerts page
- Language switcher (DE/EN)

### Real Events
- England vs Uruguay (International Friendly)
- Barcelona vs Real Madrid (El Clasico)
- Liverpool vs Arsenal (Premier League)
- The Weeknd - After Hours Til Dawn Tour
- Taylor Swift - The Eras Tour
- Coldplay - Music of the Spheres Tour
- Drake, Beyoncé, Ed Sheeran, Adele concerts

## Fixed Issues (Feb 21, 2025)
1. ✅ Concert Venue Map - Now shows STAGE layout correctly
2. ✅ React Hooks Error - useEffect placement fixed in EventDetailsPage
3. ✅ Header.jsx syntax error
4. ✅ Seed data with real events

## API Keys Required
- **RESEND_API_KEY** - For email notifications (ENV ready in backend/.env)
- **Stripe** - Test key configured

## Test Results
- **Backend:** 100% (14/14 tests passed)
- **Frontend:** 100% (all pages working)

## Prioritized Backlog

### P0 - DONE ✅
- Core marketplace flow
- Payment integration
- QR code tickets
- Interactive venue maps
- SEO (sitemap, robots.txt, meta tags)
- Support pages

### P1 - Next
- [ ] Email templates with Resend
- [ ] Seller payout tracking UI
- [ ] Price alerts management UI
- [ ] AI-generated event descriptions

### P2 - Future
- [ ] Google Analytics integration
- [ ] Blog section for SEO
- [ ] Mobile app optimization
- [ ] Fraud protection system

## Files Structure
```
/app/
├── backend/
│   ├── server.py (API endpoints, sitemap, robots.txt)
│   └── .env (MONGO_URL, RESEND_API_KEY, EMERGENT_LLM_KEY)
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── EventsPage.jsx
│       │   ├── EventDetailsPage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── TermsPage.jsx
│       │   ├── ContactPage.jsx
│       │   └── RefundPolicyPage.jsx
│       └── components/
│           ├── VenueSeatMap.jsx
│           └── Header.jsx
└── memory/
    └── PRD.md
```

## Key Endpoints
- `GET /api/sitemap.xml` - Dynamic sitemap
- `GET /api/robots.txt` - Robots directives
- `GET /api/events` - List events
- `GET /api/events/{id}` - Event details
- `POST /api/checkout` - Stripe checkout
- `POST /api/reseed` - Reset demo data
