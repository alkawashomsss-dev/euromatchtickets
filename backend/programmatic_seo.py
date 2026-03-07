"""
EuroMatchTickets - Programmatic SEO System
Used by Booking.com, Airbnb, StubHub to dominate search results
Creates thousands of pages automatically targeting different keywords
"""

from datetime import datetime, timezone, timedelta
from typing import List, Dict
import random

# ============== CITY LANDING PAGES DATA ==============
EUROPEAN_CITIES = [
    {"city": "London", "country": "UK", "keywords": ["premier league", "wembley", "concert"]},
    {"city": "Paris", "country": "France", "keywords": ["psg", "stade de france", "concert"]},
    {"city": "Berlin", "country": "Germany", "keywords": ["bundesliga", "olympic stadium", "techno"]},
    {"city": "Madrid", "country": "Spain", "keywords": ["real madrid", "el clasico", "bernabeu"]},
    {"city": "Barcelona", "country": "Spain", "keywords": ["barca", "camp nou", "la liga"]},
    {"city": "Munich", "country": "Germany", "keywords": ["bayern", "allianz arena", "oktoberfest"]},
    {"city": "Milan", "country": "Italy", "keywords": ["ac milan", "inter", "san siro", "monza f1"]},
    {"city": "Amsterdam", "country": "Netherlands", "keywords": ["ajax", "arena", "zandvoort f1"]},
    {"city": "Monaco", "country": "Monaco", "keywords": ["f1", "grand prix", "monte carlo"]},
    {"city": "Rome", "country": "Italy", "keywords": ["as roma", "lazio", "olimpico"]},
    {"city": "Vienna", "country": "Austria", "keywords": ["concert", "red bull ring", "austrian gp"]},
    {"city": "Brussels", "country": "Belgium", "keywords": ["spa f1", "belgian gp"]},
    {"city": "Lisbon", "country": "Portugal", "keywords": ["benfica", "sporting", "portimao motogp"]},
    {"city": "Dublin", "country": "Ireland", "keywords": ["concert", "aviva stadium"]},
    {"city": "Manchester", "country": "UK", "keywords": ["man united", "man city", "old trafford"]},
    {"city": "Liverpool", "country": "UK", "keywords": ["liverpool fc", "anfield", "silverstone"]},
    {"city": "Dubai", "country": "UAE", "keywords": ["abu dhabi f1", "yas marina"]},
    {"city": "Singapore", "country": "Singapore", "keywords": ["singapore gp", "night race", "f1"]},
]

# ============== EVENT TYPES FOR SEO ==============
EVENT_TYPES_SEO = [
    {"type": "f1", "name": "Formula 1", "keywords": ["f1 tickets", "grand prix tickets", "formula 1 tickets 2026"]},
    {"type": "motogp", "name": "MotoGP", "keywords": ["motogp tickets", "motorcycle racing", "motogp 2026"]},
    {"type": "football", "name": "Football", "keywords": ["football tickets", "soccer tickets", "premier league", "champions league"]},
    {"type": "concert", "name": "Concerts", "keywords": ["concert tickets", "live music", "tour tickets 2026"]},
    {"type": "isle_of_man_tt", "name": "Isle of Man TT", "keywords": ["isle of man tt", "tt races", "road racing"]},
]

# ============== GENERATE CITY PAGE CONTENT ==============
def generate_city_page(city_data: Dict) -> Dict:
    """Generate SEO-optimized city landing page content"""
    city = city_data["city"]
    country = city_data["country"]
    
    return {
        "slug": f"{city.lower().replace(' ', '-')}-tickets",
        "title": f"{city} Event Tickets 2026 | Football, Concerts, F1 | EuroMatchTickets",
        "meta_description": f"Buy tickets for events in {city}, {country}. Football matches, concerts, F1 races. Best prices, 100% guarantee. From €29. Instant delivery!",
        "h1": f"{city} Event Tickets 2026",
        "intro": f"Find the best tickets for events in {city}. Whether you're looking for football matches, concerts, or motorsport events, EuroMatchTickets has you covered with the lowest prices and 100% guarantee.",
        "sections": [
            {
                "title": f"Football Tickets in {city}",
                "content": f"Get tickets for all major football matches in {city}. Premier League, Champions League, and more.",
                "link": f"/events?city={city}&type=match"
            },
            {
                "title": f"Concerts in {city}",
                "content": f"Don't miss the hottest concerts and live shows in {city}. Taylor Swift, Coldplay, Ed Sheeran and more.",
                "link": f"/events?city={city}&type=concert"
            },
            {
                "title": f"Motorsport near {city}",
                "content": f"F1, MotoGP, and racing events near {city}. Experience the thrill of motorsport!",
                "link": "/f1-tickets"
            }
        ],
        "schema": {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": f"Events in {city}",
            "description": f"Buy tickets for events in {city}, {country}",
            "url": f"https://euromatchtickets.com/{city.lower()}-tickets"
        }
    }


# ============== GENERATE COMPARISON PAGE ==============
def generate_comparison_page(competitor: str) -> Dict:
    """Generate comparison page: EuroMatchTickets vs Competitor"""
    
    return {
        "slug": f"euromatchtickets-vs-{competitor.lower().replace(' ', '-')}",
        "title": f"EuroMatchTickets vs {competitor} 2026 | Which is Better? | Honest Comparison",
        "meta_description": f"Compare EuroMatchTickets and {competitor}. See prices, fees, guarantees. Find out which ticket marketplace is better for you in 2026.",
        "h1": f"EuroMatchTickets vs {competitor}: Complete Comparison",
        "comparison_table": {
            "categories": ["Price", "Fees", "Guarantee", "Delivery", "Selection", "Support"],
            "euromatchtickets": ["Lowest", "0% buyer fee", "100% money back", "Instant QR", "50,000+ events", "24/7 chat"],
            "competitor": ["Higher", "15-25% fees", "Limited", "Varies", "Large", "Email only"]
        },
        "verdict": f"EuroMatchTickets offers better prices, lower fees, and instant delivery compared to {competitor}. With our 100% guarantee and 24/7 support, you can book with confidence.",
        "schema": {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": f"EuroMatchTickets vs {competitor} Comparison",
            "author": {"@type": "Organization", "name": "EuroMatchTickets"},
            "datePublished": datetime.now(timezone.utc).strftime("%Y-%m-%d")
        }
    }


# ============== GENERATE PRICE GUIDE PAGE ==============
def generate_price_guide(event_type: str) -> Dict:
    """Generate price guide page for SEO"""
    
    guides = {
        "f1": {
            "title": "F1 Ticket Prices 2026 - Complete Price Guide | How Much Do F1 Tickets Cost?",
            "meta_description": "F1 ticket prices for 2026 season. General admission from €89, grandstand from €199, VIP from €899. Compare prices for all 23 Grand Prix races.",
            "price_ranges": [
                {"category": "General Admission", "price_range": "€89 - €199", "description": "Standing areas with big screens"},
                {"category": "Grandstand", "price_range": "€199 - €599", "description": "Reserved seating with track views"},
                {"category": "VIP Hospitality", "price_range": "€899 - €2,999", "description": "Premium hospitality, paddock access"},
            ],
            "cheapest_races": ["Chinese GP", "Bahrain GP", "Hungarian GP"],
            "most_expensive": ["Monaco GP", "Las Vegas GP", "Singapore GP"]
        },
        "motogp": {
            "title": "MotoGP Ticket Prices 2026 - Complete Price Guide | How Much Do MotoGP Tickets Cost?",
            "meta_description": "MotoGP ticket prices for 2026. General admission from €69, grandstand from €149, VIP from €499. All 21 races compared.",
            "price_ranges": [
                {"category": "General Admission", "price_range": "€69 - €129", "description": "Access to general viewing areas"},
                {"category": "Grandstand", "price_range": "€149 - €349", "description": "Reserved seating at key corners"},
                {"category": "VIP Village", "price_range": "€499 - €1,499", "description": "Hospitality and paddock tours"},
            ],
            "cheapest_races": ["Thai GP", "Indonesian GP", "Malaysian GP"],
            "most_expensive": ["Italian GP Mugello", "Spanish GP Jerez", "British GP Silverstone"]
        }
    }
    
    return guides.get(event_type, guides["f1"])


# ============== GENERATE "THIS WEEKEND" PAGE ==============
def generate_this_weekend_content() -> Dict:
    """Generate dynamic 'Events This Weekend' page"""
    
    return {
        "slug": "events-this-weekend",
        "title": "Events This Weekend | Football, Concerts, F1 | EuroMatchTickets",
        "meta_description": "Find events happening this weekend. Football matches, concerts, motorsport. Book last-minute tickets with instant delivery.",
        "h1": "Events This Weekend",
        "dynamic_content": True,
        "schema": {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Events This Weekend",
            "description": "Events happening this weekend"
        }
    }


# ============== GENERATE MONTHLY EVENT PAGES ==============
def generate_monthly_pages() -> List[Dict]:
    """Generate pages for each month: 'Events in March 2026'"""
    months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    
    pages = []
    for month in months:
        pages.append({
            "slug": f"events-{month.lower()}-2026",
            "title": f"Events in {month} 2026 | Football, Concerts, F1 | EuroMatchTickets",
            "meta_description": f"Find all events happening in {month} 2026. Football, concerts, F1 races. Book now with best prices!",
            "h1": f"Events in {month} 2026",
            "month": month
        })
    
    return pages


# ============== GENERATE HOW-TO GUIDES ==============
def generate_how_to_guides() -> List[Dict]:
    """Generate how-to guide pages for SEO"""
    
    guides = [
        {
            "slug": "how-to-buy-f1-tickets",
            "title": "How to Buy F1 Tickets 2026 - Complete Guide | Step by Step",
            "steps": [
                "Choose your Grand Prix race",
                "Select ticket category (GA, Grandstand, VIP)",
                "Compare prices across sellers",
                "Book through EuroMatchTickets",
                "Receive instant QR code"
            ]
        },
        {
            "slug": "how-to-buy-champions-league-tickets",
            "title": "How to Buy Champions League Tickets 2026 - Complete Guide",
            "steps": [
                "Find your match on EuroMatchTickets",
                "Choose seating category",
                "Check seller ratings",
                "Complete secure payment",
                "Get tickets via email"
            ]
        },
        {
            "slug": "how-to-get-cheap-concert-tickets",
            "title": "How to Get Cheap Concert Tickets 2026 - Money Saving Tips",
            "steps": [
                "Book early for best prices",
                "Check EuroMatchTickets for resale deals",
                "Consider weekday shows",
                "Look for last-minute releases",
                "Use price alerts"
            ]
        }
    ]
    
    return guides


# ============== GENERATE EMBEDDABLE WIDGET CODE ==============
def generate_widget_code(event_type: str = "all") -> str:
    """Generate embeddable widget for other websites (free backlinks!)"""
    
    return f'''
<!-- EuroMatchTickets Event Widget -->
<div id="emt-widget" data-type="{event_type}"></div>
<script src="https://euromatchtickets.com/widget.js"></script>
<!-- Get your own widget at euromatchtickets.com/partners -->
'''


# ============== BULK PAGE GENERATOR ==============
def generate_all_seo_pages() -> Dict:
    """Generate all SEO pages at once"""
    
    pages = {
        "city_pages": [generate_city_page(city) for city in EUROPEAN_CITIES],
        "comparison_pages": [
            generate_comparison_page("StubHub"),
            generate_comparison_page("Viagogo"),
            generate_comparison_page("Ticketmaster"),
            generate_comparison_page("SeatGeek"),
        ],
        "price_guides": [
            generate_price_guide("f1"),
            generate_price_guide("motogp"),
        ],
        "monthly_pages": generate_monthly_pages(),
        "how_to_guides": generate_how_to_guides(),
        "this_weekend": generate_this_weekend_content(),
    }
    
    total_pages = sum(len(v) if isinstance(v, list) else 1 for v in pages.values())
    
    return {
        "total_pages_generated": total_pages,
        "pages": pages,
        "sitemap_urls": _extract_all_urls(pages)
    }


def _extract_all_urls(pages: Dict) -> List[str]:
    """Extract all URLs for sitemap"""
    urls = []
    base = "https://euromatchtickets.com"
    
    for page_type, page_list in pages.items():
        if isinstance(page_list, list):
            for page in page_list:
                if "slug" in page:
                    urls.append(f"{base}/{page['slug']}")
        elif isinstance(page_list, dict) and "slug" in page_list:
            urls.append(f"{base}/{page_list['slug']}")
    
    return urls


# ============== LONG-TAIL KEYWORD PAGES ==============
def generate_long_tail_pages() -> List[Dict]:
    """Generate pages targeting long-tail keywords"""
    
    long_tail_keywords = [
        {"keyword": "cheap f1 tickets 2026", "intent": "price"},
        {"keyword": "last minute concert tickets europe", "intent": "urgency"},
        {"keyword": "best seats monaco grand prix", "intent": "quality"},
        {"keyword": "family tickets premier league", "intent": "family"},
        {"keyword": "vip hospitality champions league final", "intent": "luxury"},
        {"keyword": "student discount event tickets", "intent": "discount"},
        {"keyword": "group booking football matches", "intent": "group"},
        {"keyword": "accessible seating concert venues", "intent": "accessibility"},
        {"keyword": "birthday gift experience tickets", "intent": "gift"},
        {"keyword": "corporate hospitality f1", "intent": "business"},
    ]
    
    pages = []
    for kw in long_tail_keywords:
        pages.append({
            "slug": kw["keyword"].replace(" ", "-"),
            "title": f"{kw['keyword'].title()} | EuroMatchTickets",
            "meta_description": f"Find {kw['keyword']}. Best selection, lowest prices, 100% guarantee. Book now!",
            "intent": kw["intent"]
        })
    
    return pages
