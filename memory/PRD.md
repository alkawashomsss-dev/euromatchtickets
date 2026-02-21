# FanPass - Events & Tickets Marketplace

## Original Problem Statement
Build a professional ticket marketplace for European football matches and concerts with:
- 10% platform commission
- Full payment to owner's Stripe account, then manual payout to sellers

## Architecture
- **Backend:** FastAPI + MongoDB
- **Frontend:** React + TailwindCSS + Shadcn UI
- **Auth:** Emergent Google OAuth
- **Payments:** Stripe Checkout (LIVE MODE READY)
- **Emails:** Resend

## Payment Flow
```
Customer pays €100 → Your Stripe Account
├── €10 Commission (yours to keep)
└── €90 Seller Amount (you transfer manually)
```

## API Keys Configured ✅
- **Stripe Live Keys:** Configured in backend/.env
- **Resend API Key:** Configured for emails
- **EMERGENT_LLM_KEY:** Ready for AI descriptions

## Features Implemented

### Core Marketplace ✅
- Event listing (30 real events)
- Concert + Football venue maps
- Ticket selection & purchase
- Stripe Checkout integration
- QR Code tickets
- Order management

### Owner Dashboard ✅ (`/owner`)
- Revenue stats (Total, Commission, Seller Amount)
- Pending payouts tracking
- Seller management with balances
- Manual payout records
- Order history

### SEO ✅
- sitemap.xml (`/api/sitemap.xml`)
- robots.txt (`/api/robots.txt`)
- Support pages (About, Terms, Contact, Refund)

### Admin Features ✅
- User management
- KYC verification
- Dispute handling
- Statistics

## Key Endpoints

### Stripe Checkout
```
POST /api/checkout
Body: { ticket_id, event_id }
Returns: { checkout_url }
```

### Owner Dashboard
```
GET /api/owner/dashboard - Revenue stats
GET /api/owner/sellers - Sellers with balances
POST /api/owner/payouts - Create payout record
PUT /api/owner/payouts/{id}/complete - Mark paid
GET /api/owner/payouts - Payout history
```

## Next Steps for Launch

### Before Going Live:
1. [ ] Test a real payment on Stripe
2. [ ] Set up Stripe webhooks for automatic order completion
3. [ ] Configure email templates
4. [ ] Add your domain in Stripe settings

### For Production Deployment:
1. [ ] Deploy to custom domain
2. [ ] Update Stripe success/cancel URLs
3. [ ] Set up Google Analytics
4. [ ] Configure SEO meta tags with real domain

## File Structure
```
/app/
├── backend/
│   ├── server.py
│   └── .env (STRIPE_API_KEY, RESEND_API_KEY, etc.)
├── frontend/
│   └── src/
│       └── pages/
│           ├── OwnerDashboard.jsx (NEW)
│           ├── EventDetailsPage.jsx
│           └── ...
└── memory/
    └── PRD.md
```
