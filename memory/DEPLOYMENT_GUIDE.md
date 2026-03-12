# EuroMatchTickets - Deployment Guide

## How to Deploy Your Site to Production

This guide will walk you through deploying EuroMatchTickets to your live domain `euromatchtickets.com`.

---

## Step 1: Save Code to GitHub

1. In the Emergent chat interface, click the **"Save to GitHub"** button at the bottom of the chat
2. Connect your GitHub account if not already connected
3. Choose a repository name (e.g., `euromatchtickets`)
4. Click **Save** - this pushes all code to your GitHub repository

---

## Step 2: Deploy on Render

### First Time Setup:
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** > **"Web Service"**
3. Connect your GitHub repository (`euromatchtickets`)
4. Configure the service:

**For Backend (API):**
- **Name:** `euromatchtickets-api`
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn server:app --host 0.0.0.0 --port 8001`
- **Environment Variables:**
  - `MONGO_URL` = Your MongoDB Atlas connection string
  - `STRIPE_API_KEY` = Your Stripe secret key
  - `JWT_SECRET` = A secure random string
  - Any other keys from your `backend/.env`

**For Frontend:**
- **Name:** `euromatchtickets-web`
- **Root Directory:** `frontend`
- **Build Command:** `yarn install && yarn build`
- **Start Command:** `serve -s build -l 3000`
- **Environment Variables:**
  - `REACT_APP_BACKEND_URL` = Your backend URL (e.g., `https://euromatchtickets-api.onrender.com`)

### Subsequent Deployments:
- Render auto-deploys when you push to GitHub
- Simply click **"Save to GitHub"** in Emergent to trigger a new deployment
- Render will automatically rebuild and redeploy

---

## Step 3: Configure Custom Domain

1. In Render, go to your frontend service > **Settings** > **Custom Domains**
2. Add `euromatchtickets.com` and `www.euromatchtickets.com`
3. Render will provide DNS records (CNAME/A records)
4. Go to your domain registrar and update DNS settings
5. Wait 5-30 minutes for DNS propagation

---

## Step 4: Verify SEO Setup

After deployment, verify these URLs work:

- **Sitemap Index:** `https://euromatchtickets.com/api/sitemap-index.xml`
- **Google Analytics:** Check your GA4 dashboard for traffic
- **Facebook Pixel:** Use Facebook Pixel Helper Chrome extension
- **robots.txt:** `https://euromatchtickets.com/robots.txt`

### Submit to Google Search Console:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://euromatchtickets.com`
3. Submit sitemap: `https://euromatchtickets.com/api/sitemap-index.xml`

---

## Step 5: Post-Deployment Checklist

- [ ] Site loads at `euromatchtickets.com`
- [ ] All event pages load correctly
- [ ] SEO pages (1,700+) are accessible
- [ ] Sitemap index returns valid XML
- [ ] Stripe checkout works (test with a small amount)
- [ ] Google Analytics tracking active
- [ ] Facebook Pixel firing correctly
- [ ] "Sell Your Tickets" form submits successfully
- [ ] Reviews page loads and displays reviews

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Site shows old version | Click "Save to GitHub" in Emergent, then wait 5-10 min for Render to rebuild |
| API errors on live site | Check Render logs for the backend service |
| SSL certificate error | Wait 10 min after adding custom domain - Render auto-provisions SSL |
| MongoDB connection fails | Verify `MONGO_URL` in Render environment variables |
| Stripe payments fail | Verify `STRIPE_API_KEY` is set in Render environment |

---

## Quick Commands for Debugging

Access Render logs:
1. Go to Render Dashboard > Your Service > **Logs**
2. Look for error messages
3. Common fixes: missing environment variables, incorrect build commands

---

*Last updated: March 2026*
