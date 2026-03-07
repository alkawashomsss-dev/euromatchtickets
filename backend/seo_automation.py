"""
EuroMatchTickets SEO Automation System
Advanced tools to get indexed by Google faster
"""

import os
import logging
import httpx
from datetime import datetime, timezone
from typing import List, Dict, Optional
import asyncio

logger = logging.getLogger(__name__)

# ============== SEARCH ENGINE PING SERVICE ==============

async def ping_search_engines(url: str = "https://euromatchtickets.com"):
    """Ping all major search engines to notify them of updates"""
    
    sitemap_url = f"{url}/sitemap.xml"
    
    ping_urls = [
        # Google - using Search Console API endpoint
        f"https://www.google.com/webmasters/tools/ping?sitemap={sitemap_url}",
        # Bing - using IndexNow
        f"https://www.bing.com/indexnow?url={url}&key=euromatchtickets2026",
        # IndexNow (Bing, Yandex, Seznam.cz, Naver)
        f"https://api.indexnow.org/indexnow?url={url}&key=euromatchtickets2026",
        # Yandex
        f"https://yandex.com/indexnow?url={url}&key=euromatchtickets2026",
    ]
    
    results = []
    async with httpx.AsyncClient(timeout=10) as client:
        for ping_url in ping_urls:
            try:
                response = await client.get(ping_url)
                results.append({
                    "url": ping_url.split("?")[0],
                    "status": "success" if response.status_code < 400 else "failed",
                    "code": response.status_code
                })
                logger.info(f"Pinged {ping_url}: {response.status_code}")
            except Exception as e:
                results.append({
                    "url": ping_url.split("?")[0],
                    "status": "error",
                    "error": str(e)
                })
                logger.error(f"Failed to ping {ping_url}: {e}")
    
    return results


async def submit_url_to_indexnow(urls: List[str], host: str = "euromatchtickets.com"):
    """Submit URLs to IndexNow for faster indexing on Bing, Yandex, etc."""
    
    # IndexNow key - should be a file at /indexnow-key.txt on the domain
    key = "euromatchtickets2026"
    
    payload = {
        "host": host,
        "key": key,
        "keyLocation": f"https://{host}/{key}.txt",
        "urlList": urls[:10000]  # Max 10,000 URLs per request
    }
    
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(
                "https://api.indexnow.org/indexnow",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            return {
                "status": "success" if response.status_code in [200, 202] else "failed",
                "code": response.status_code,
                "urls_submitted": len(urls)
            }
        except Exception as e:
            logger.error(f"IndexNow submission failed: {e}")
            return {"status": "error", "error": str(e)}


# ============== GOOGLE INDEXING API ==============

async def request_google_indexing(url: str, credentials_json: Optional[str] = None):
    """
    Request Google to index a specific URL using the Indexing API.
    Requires Google Search Console verification and service account.
    """
    
    # Note: This requires setting up Google Cloud credentials
    # For now, we'll use the ping method which is simpler
    
    try:
        # Ping Google's sitemap endpoint
        ping_url = f"https://www.google.com/ping?sitemap=https://euromatchtickets.com/sitemap.xml"
        
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(ping_url)
            return {
                "status": "submitted",
                "method": "sitemap_ping",
                "url": url,
                "response_code": response.status_code
            }
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ============== SEO CONTENT GENERATOR ==============

def generate_meta_tags(page_type: str, data: Dict) -> Dict[str, str]:
    """Generate optimized meta tags for different page types"""
    
    templates = {
        "event": {
            "title": f"{data.get('title', 'Event')} Tickets 2026 | Buy Now | EuroMatchTickets",
            "description": f"Buy {data.get('title', 'event')} tickets from €{data.get('price', 49)}. {data.get('venue', 'Top venue')}, {data.get('city', 'Europe')}. 100% guarantee, instant delivery. Best prices!",
            "keywords": f"{data.get('title', 'event')} tickets, {data.get('title', 'event')} tickets 2026, buy {data.get('title', 'event')} tickets, {data.get('city', 'europe')} tickets",
        },
        "f1": {
            "title": f"F1 {data.get('race', 'Grand Prix')} Tickets 2026 | Formula 1 | EuroMatchTickets",
            "description": f"Buy F1 {data.get('race', 'Grand Prix')} 2026 tickets from €{data.get('price', 89)}. {data.get('circuit', 'World-class circuit')}. Grandstand, VIP hospitality. 100% guarantee!",
            "keywords": f"F1 {data.get('race', '')} tickets, Formula 1 {data.get('race', '')} 2026, {data.get('race', '')} Grand Prix tickets, F1 tickets {data.get('country', 'europe')}",
        },
        "motogp": {
            "title": f"MotoGP {data.get('race', 'Grand Prix')} Tickets 2026 | EuroMatchTickets",
            "description": f"Buy MotoGP {data.get('race', '')} 2026 tickets from €{data.get('price', 69)}. Watch Marquez, Bagnaia live! Grandstand & VIP. 100% guarantee!",
            "keywords": f"MotoGP {data.get('race', '')} tickets, MotoGP 2026 tickets, motorcycle racing tickets {data.get('country', 'europe')}",
        },
        "concert": {
            "title": f"{data.get('artist', 'Concert')} Tickets {data.get('city', 'Europe')} 2026 | EuroMatchTickets",
            "description": f"Buy {data.get('artist', 'concert')} tickets for {data.get('city', 'Europe')} from €{data.get('price', 79)}. {data.get('venue', 'Top venue')}. 100% guarantee, instant delivery!",
            "keywords": f"{data.get('artist', 'concert')} tickets, {data.get('artist', 'concert')} {data.get('city', 'europe')} 2026, {data.get('artist', 'concert')} tour tickets",
        },
    }
    
    return templates.get(page_type, templates["event"])


def generate_schema_markup(page_type: str, data: Dict) -> Dict:
    """Generate Schema.org JSON-LD markup for rich snippets"""
    
    base_schema = {
        "@context": "https://schema.org",
    }
    
    if page_type == "event" or page_type == "f1" or page_type == "motogp":
        return {
            **base_schema,
            "@type": "SportsEvent",
            "name": data.get("title", "Event"),
            "description": data.get("description", ""),
            "startDate": data.get("date", ""),
            "location": {
                "@type": "Place",
                "name": data.get("venue", ""),
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": data.get("city", ""),
                    "addressCountry": data.get("country", "")
                }
            },
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "EUR",
                "lowPrice": data.get("price", 49),
                "highPrice": data.get("price", 49) * 5,
                "offerCount": data.get("tickets_available", 100),
                "availability": "https://schema.org/InStock",
                "url": f"https://euromatchtickets.com/event/{data.get('event_id', '')}"
            },
            "organizer": {
                "@type": "Organization",
                "name": "EuroMatchTickets",
                "url": "https://euromatchtickets.com"
            }
        }
    
    elif page_type == "concert":
        return {
            **base_schema,
            "@type": "MusicEvent",
            "name": data.get("title", "Concert"),
            "performer": {
                "@type": "MusicGroup",
                "name": data.get("artist", "Artist")
            },
            "startDate": data.get("date", ""),
            "location": {
                "@type": "Place",
                "name": data.get("venue", ""),
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": data.get("city", ""),
                    "addressCountry": data.get("country", "")
                }
            },
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "EUR",
                "lowPrice": data.get("price", 79),
                "availability": "https://schema.org/InStock"
            }
        }
    
    elif page_type == "faq":
        return {
            **base_schema,
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": q["question"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q["answer"]
                    }
                }
                for q in data.get("faqs", [])
            ]
        }
    
    return base_schema


# ============== INTERNAL LINKING SUGGESTIONS ==============

def get_internal_link_suggestions(page_type: str, current_event: Dict) -> List[Dict]:
    """Suggest internal links to improve SEO"""
    
    suggestions = []
    
    if page_type in ["f1", "motogp"]:
        suggestions.extend([
            {"text": "View all F1 races", "url": "/f1-tickets"},
            {"text": "F1 2026 Schedule", "url": "/f1-2026-schedule"},
            {"text": "How to buy F1 tickets", "url": "/how-to-buy-f1-tickets"},
            {"text": "MotoGP tickets", "url": "/motogp-tickets"},
            {"text": "Isle of Man TT", "url": "/isle-of-man-tt-tickets"},
        ])
    
    elif page_type == "concert":
        suggestions.extend([
            {"text": "All concerts", "url": "/events?type=concert"},
            {"text": "Football matches", "url": "/events?type=match"},
            {"text": "F1 tickets", "url": "/f1-tickets"},
        ])
    
    elif page_type == "match":
        suggestions.extend([
            {"text": "All football matches", "url": "/events?type=match"},
            {"text": "Champions League tickets", "url": "/champions-league-final-2026"},
            {"text": "El Clasico tickets", "url": "/el-clasico-tickets"},
        ])
    
    # Add general links
    suggestions.extend([
        {"text": "Browse all events", "url": "/events"},
        {"text": "About us", "url": "/about"},
    ])
    
    return suggestions[:5]  # Return top 5


# ============== SEO AUDIT ==============

def run_seo_audit(page_data: Dict) -> Dict:
    """Run SEO audit on a page and return recommendations"""
    
    issues = []
    score = 100
    
    # Check title
    title = page_data.get("title", "")
    if len(title) < 30:
        issues.append({"type": "warning", "message": "Title too short (< 30 chars)", "impact": -5})
        score -= 5
    elif len(title) > 60:
        issues.append({"type": "warning", "message": "Title too long (> 60 chars)", "impact": -3})
        score -= 3
    
    # Check description
    description = page_data.get("description", "")
    if len(description) < 120:
        issues.append({"type": "warning", "message": "Meta description too short", "impact": -5})
        score -= 5
    elif len(description) > 160:
        issues.append({"type": "info", "message": "Meta description may be truncated", "impact": -2})
        score -= 2
    
    # Check for schema
    if not page_data.get("schema"):
        issues.append({"type": "error", "message": "Missing Schema.org markup", "impact": -10})
        score -= 10
    
    # Check for images
    if not page_data.get("images"):
        issues.append({"type": "warning", "message": "No images found", "impact": -5})
        score -= 5
    
    # Check for internal links
    internal_links = page_data.get("internal_links", 0)
    if internal_links < 3:
        issues.append({"type": "warning", "message": "Too few internal links", "impact": -5})
        score -= 5
    
    return {
        "score": max(0, score),
        "issues": issues,
        "recommendations": [
            "Add more internal links to related pages",
            "Include FAQ section with Schema.org markup",
            "Add alt text to all images",
            "Ensure mobile responsiveness",
            "Add breadcrumb navigation"
        ]
    }


# ============== SITEMAP GENERATOR ==============

def generate_dynamic_sitemap(events: List[Dict], base_url: str = "https://euromatchtickets.com") -> str:
    """Generate dynamic XML sitemap from events"""
    
    urls = []
    
    # Static pages
    static_pages = [
        {"loc": "/", "priority": "1.0", "changefreq": "daily"},
        {"loc": "/events", "priority": "0.95", "changefreq": "daily"},
        {"loc": "/f1-tickets", "priority": "0.95", "changefreq": "daily"},
        {"loc": "/motogp-tickets", "priority": "0.9", "changefreq": "daily"},
        {"loc": "/isle-of-man-tt-tickets", "priority": "0.85", "changefreq": "weekly"},
        {"loc": "/f1-2026-schedule", "priority": "0.9", "changefreq": "weekly"},
        {"loc": "/motogp-2026-schedule", "priority": "0.85", "changefreq": "weekly"},
        {"loc": "/how-to-buy-f1-tickets", "priority": "0.8", "changefreq": "monthly"},
        {"loc": "/about", "priority": "0.7", "changefreq": "monthly"},
    ]
    
    for page in static_pages:
        urls.append(f"""  <url>
    <loc>{base_url}{page['loc']}</loc>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
    <lastmod>{datetime.now(timezone.utc).strftime('%Y-%m-%d')}</lastmod>
  </url>""")
    
    # Dynamic event pages
    for event in events:
        urls.append(f"""  <url>
    <loc>{base_url}/event/{event.get('event_id', '')}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>{datetime.now(timezone.utc).strftime('%Y-%m-%d')}</lastmod>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    return sitemap
