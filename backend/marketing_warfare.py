"""
EuroMatchTickets - Marketing Warfare System
Aggressive automated marketing to compete with StubHub, Viagogo, Ticketmaster
Goal: Sell 1000 tickets in first month
"""

import os
import random
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

# ============== VIRAL REFERRAL SYSTEM ==============
# Each buyer gets a unique referral code
# They get €10 credit for each friend who buys
# Friends get 10% off first purchase

def generate_referral_code(user_id: str) -> str:
    """Generate unique referral code for user"""
    hash_input = f"{user_id}-euromatch-2026"
    return f"EMT{hashlib.md5(hash_input.encode()).hexdigest()[:8].upper()}"


def get_referral_link(referral_code: str) -> str:
    """Get shareable referral link"""
    return f"https://euromatchtickets.com/?ref={referral_code}"


def generate_referral_message(referral_code: str, event_name: str = None) -> Dict[str, str]:
    """Generate shareable messages for different platforms"""
    link = get_referral_link(referral_code)
    
    messages = {
        "whatsapp": f"🎫 Hey! I just found amazing tickets on EuroMatchTickets. Use my link and get 10% OFF your first purchase! {link}",
        
        "twitter": f"🔥 Found the BEST ticket deals for football & concerts at @EuroMatchTickets! \n\n💰 10% OFF with my link:\n{link}\n\n#Football #Tickets #F1 #Concerts",
        
        "facebook": f"🎟️ Just discovered EuroMatchTickets - they have incredible prices on football matches, concerts, and F1 races!\n\nUse my referral link for 10% OFF: {link}\n\n#TicketDeals #LiveEvents",
        
        "email_subject": "🎫 Get 10% OFF Event Tickets!",
        "email_body": f"""Hey!

I wanted to share this amazing ticket site I found - EuroMatchTickets.

They have tickets for:
⚽ Premier League, Champions League, La Liga
🎵 Coldplay, Taylor Swift, Ed Sheeran tours
🏎️ Formula 1, MotoGP races

Use my referral link to get 10% OFF your first purchase:
{link}

See you at the next event!
""",
        
        "sms": f"🎫 Get 10% OFF event tickets! Football, concerts, F1 - use my link: {link}"
    }
    
    if event_name:
        messages["twitter"] = f"🎫 Just got tickets for {event_name} on @EuroMatchTickets! Amazing prices!\n\nGet 10% OFF: {link}\n\n#Tickets #{event_name.replace(' ', '')}"
    
    return messages


# ============== SOCIAL MEDIA CONTENT GENERATOR ==============
# Auto-generates posts for different platforms

TRENDING_HASHTAGS = {
    "football": ["#Football", "#PremierLeague", "#ChampionsLeague", "#LaLiga", "#Bundesliga", "#UCL", "#EPL"],
    "f1": ["#F1", "#Formula1", "#F1Tickets", "#GrandPrix", "#Motorsport", "#F12026"],
    "concert": ["#Concert", "#LiveMusic", "#Tour2026", "#Tickets", "#MusicFestival"],
    "motogp": ["#MotoGP", "#Motorcycle", "#Racing", "#MotoGP2026"]
}

URGENT_PHRASES = [
    "🔥 SELLING FAST!",
    "⚡ LIMITED TICKETS!",
    "🚨 LAST CHANCE!",
    "💥 PRICES DROPPING!",
    "🎫 FEW LEFT!",
    "⏰ BOOK NOW!",
    "🏃 DON'T MISS OUT!"
]

def generate_social_post(event: Dict, platform: str = "twitter") -> str:
    """Generate platform-optimized social media post"""
    event_type = event.get("event_type", "event")
    title = event.get("title", "Amazing Event")
    venue = event.get("venue", "")
    city = event.get("city", "")
    price = event.get("lowest_price", 49)
    
    hashtags = TRENDING_HASHTAGS.get(event_type, TRENDING_HASHTAGS["football"])
    random_hashtags = " ".join(random.sample(hashtags, min(4, len(hashtags))))
    urgent = random.choice(URGENT_PHRASES)
    
    if platform == "twitter":
        return f"""{urgent}

🎫 {title}
📍 {venue}, {city}
💰 From €{price}

✅ 100% Guaranteed
✅ Instant QR Delivery
✅ 0% Buyer Fees

🔗 euromatchtickets.com

{random_hashtags}"""
    
    elif platform == "facebook":
        return f"""🎫 {title} - Tickets Available NOW!

📅 Live at {venue}, {city}
💰 Starting from just €{price}

Why EuroMatchTickets?
✅ 100% Money-Back Guarantee
✅ Instant QR Code Delivery
✅ Best Prices - 0% Buyer Fees
✅ Secure Stripe Checkout

Don't miss this incredible event! Book your tickets now at euromatchtickets.com

{random_hashtags}"""
    
    elif platform == "linkedin":
        return f"""🎟️ Exciting Event Opportunity: {title}

For those looking to attend {title} at {venue}, {city} - I recommend checking out EuroMatchTickets.

Key benefits:
• Verified tickets with 100% guarantee
• Competitive pricing from €{price}
• Instant digital delivery
• Secure payment processing

Great for corporate hospitality or team events.

#Events #Business #Networking {random_hashtags}"""
    
    elif platform == "instagram":
        return f"""{urgent}

{title} 🎫

📍 {venue}
🌍 {city}
💰 From €{price}

Link in bio! 👆

{random_hashtags} #Tickets #LiveEvent #2026"""
    
    return f"{title} - Tickets from €{price} at euromatchtickets.com"


def generate_daily_posts(events: List[Dict], count: int = 5) -> List[Dict]:
    """Generate a day's worth of social media posts"""
    posts = []
    platforms = ["twitter", "facebook", "instagram", "linkedin"]
    
    selected_events = random.sample(events, min(count, len(events)))
    
    for i, event in enumerate(selected_events):
        platform = platforms[i % len(platforms)]
        posts.append({
            "platform": platform,
            "content": generate_social_post(event, platform),
            "event_id": event.get("event_id"),
            "event_title": event.get("title"),
            "scheduled_time": datetime.now(timezone.utc) + timedelta(hours=i*4),
            "hashtags": TRENDING_HASHTAGS.get(event.get("event_type", "football"), [])
        })
    
    return posts


# ============== EMAIL MARKETING CAMPAIGNS ==============

EMAIL_CAMPAIGNS = {
    "welcome_series": [
        {
            "day": 0,
            "subject": "🎫 Welcome to EuroMatchTickets - Here's 10% OFF!",
            "template": "welcome_discount"
        },
        {
            "day": 2,
            "subject": "🔥 Trending Events This Week",
            "template": "trending_events"
        },
        {
            "day": 5,
            "subject": "⚡ Flash Sale - 24 Hours Only!",
            "template": "flash_sale"
        },
        {
            "day": 7,
            "subject": "🎁 Your 10% Discount Expires Tomorrow!",
            "template": "discount_expiring"
        }
    ],
    "abandoned_cart": [
        {
            "hours": 1,
            "subject": "🎫 You left something behind...",
            "template": "cart_reminder_1"
        },
        {
            "hours": 24,
            "subject": "⏰ Tickets selling fast - Complete your purchase",
            "template": "cart_reminder_2"
        },
        {
            "hours": 48,
            "subject": "💸 Special offer: 5% OFF to complete your order",
            "template": "cart_reminder_discount"
        }
    ],
    "price_drop": {
        "subject": "🔔 Price Alert: {event_name} tickets dropped to €{new_price}!",
        "template": "price_drop_alert"
    },
    "event_reminder": [
        {
            "days_before": 7,
            "subject": "📅 {event_name} is in 1 week!",
            "template": "event_reminder_week"
        },
        {
            "days_before": 1,
            "subject": "🎉 {event_name} is TOMORROW!",
            "template": "event_reminder_day"
        }
    ]
}


def generate_email_campaign(campaign_type: str, user_data: Dict, event_data: Dict = None) -> List[Dict]:
    """Generate email campaign sequence"""
    campaigns = []
    
    if campaign_type == "welcome_series":
        for email in EMAIL_CAMPAIGNS["welcome_series"]:
            campaigns.append({
                "recipient": user_data.get("email"),
                "subject": email["subject"],
                "template": email["template"],
                "send_at": datetime.now(timezone.utc) + timedelta(days=email["day"]),
                "data": {
                    "user_name": user_data.get("name"),
                    "discount_code": f"WELCOME{random.randint(1000, 9999)}"
                }
            })
    
    elif campaign_type == "abandoned_cart" and event_data:
        for email in EMAIL_CAMPAIGNS["abandoned_cart"]:
            campaigns.append({
                "recipient": user_data.get("email"),
                "subject": email["subject"],
                "template": email["template"],
                "send_at": datetime.now(timezone.utc) + timedelta(hours=email["hours"]),
                "data": {
                    "user_name": user_data.get("name"),
                    "event": event_data
                }
            })
    
    return campaigns


# ============== SEO KEYWORD TARGETING ==============
# High-value keywords to target with content

HIGH_VALUE_KEYWORDS = [
    # Football - High search volume
    {"keyword": "champions league final tickets 2026", "volume": 50000, "difficulty": "high"},
    {"keyword": "el clasico tickets", "volume": 40000, "difficulty": "medium"},
    {"keyword": "premier league tickets", "volume": 35000, "difficulty": "high"},
    {"keyword": "manchester united tickets", "volume": 30000, "difficulty": "medium"},
    {"keyword": "liverpool tickets", "volume": 28000, "difficulty": "medium"},
    {"keyword": "real madrid tickets", "volume": 25000, "difficulty": "medium"},
    {"keyword": "barcelona tickets", "volume": 24000, "difficulty": "medium"},
    
    # F1 - High value
    {"keyword": "f1 tickets 2026", "volume": 60000, "difficulty": "high"},
    {"keyword": "monaco grand prix tickets", "volume": 45000, "difficulty": "high"},
    {"keyword": "silverstone tickets", "volume": 35000, "difficulty": "medium"},
    {"keyword": "monza f1 tickets", "volume": 20000, "difficulty": "medium"},
    
    # Concerts - High conversion
    {"keyword": "coldplay tour 2026 tickets", "volume": 80000, "difficulty": "high"},
    {"keyword": "taylor swift europe tickets", "volume": 100000, "difficulty": "high"},
    {"keyword": "ed sheeran tickets 2026", "volume": 50000, "difficulty": "medium"},
    
    # Long-tail - Lower competition
    {"keyword": "cheap f1 tickets 2026", "volume": 15000, "difficulty": "low"},
    {"keyword": "last minute football tickets london", "volume": 8000, "difficulty": "low"},
    {"keyword": "vip hospitality champions league", "volume": 5000, "difficulty": "low"},
    {"keyword": "corporate hospitality f1", "volume": 4000, "difficulty": "low"},
]


def get_content_strategy() -> Dict:
    """Generate content strategy based on keywords"""
    return {
        "immediate_priority": [kw for kw in HIGH_VALUE_KEYWORDS if kw["difficulty"] == "low"],
        "medium_term": [kw for kw in HIGH_VALUE_KEYWORDS if kw["difficulty"] == "medium"],
        "long_term": [kw for kw in HIGH_VALUE_KEYWORDS if kw["difficulty"] == "high"],
        "content_types": [
            "Landing pages for each keyword",
            "Blog posts answering 'how to buy X tickets'",
            "Comparison pages (EuroMatchTickets vs competitors)",
            "Price guide pages",
            "Event preview articles"
        ],
        "backlink_strategies": [
            "Guest posts on football blogs",
            "Sports news site mentions",
            "Travel blogger partnerships",
            "Social media influencer collaborations"
        ]
    }


# ============== PUSH NOTIFICATION SYSTEM ==============

PUSH_TEMPLATES = {
    "flash_sale": {
        "title": "⚡ Flash Sale - 50% OFF!",
        "body": "Limited time only. {event_name} tickets from €{price}",
        "icon": "🎫",
        "action_url": "/events"
    },
    "price_drop": {
        "title": "💰 Price Drop Alert!",
        "body": "{event_name} tickets now from €{new_price}",
        "icon": "🔔",
        "action_url": "/event/{event_id}"
    },
    "last_tickets": {
        "title": "🔥 Only {count} tickets left!",
        "body": "{event_name} - Don't miss out!",
        "icon": "🎟️",
        "action_url": "/event/{event_id}"
    },
    "new_event": {
        "title": "🆕 Just Added: {event_name}",
        "body": "Be the first to get tickets! From €{price}",
        "icon": "✨",
        "action_url": "/event/{event_id}"
    },
    "event_reminder": {
        "title": "📅 {event_name} is tomorrow!",
        "body": "Don't forget your tickets. Show QR code at entrance.",
        "icon": "🎉",
        "action_url": "/my-tickets"
    }
}


def generate_push_notification(template_name: str, data: Dict) -> Dict:
    """Generate push notification from template"""
    template = PUSH_TEMPLATES.get(template_name, PUSH_TEMPLATES["new_event"])
    
    return {
        "title": template["title"].format(**data),
        "body": template["body"].format(**data),
        "icon": template["icon"],
        "action_url": template["action_url"].format(**data),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ============== COMPETITOR PRICE MONITORING ==============
# Track competitor prices to always be competitive

COMPETITORS = [
    {"name": "StubHub", "url": "stubhub.com", "fee_percent": 25},
    {"name": "Viagogo", "url": "viagogo.com", "fee_percent": 30},
    {"name": "Ticketmaster", "url": "ticketmaster.com", "fee_percent": 20},
    {"name": "SeatGeek", "url": "seatgeek.com", "fee_percent": 20},
]


def calculate_competitive_price(competitor_price: float, competitor_fee: float) -> Dict:
    """Calculate our competitive price based on competitor"""
    # Competitor's total price including fees
    competitor_total = competitor_price * (1 + competitor_fee / 100)
    
    # Our price should be 10-15% lower
    our_price = competitor_price * 0.85
    
    return {
        "competitor_total": round(competitor_total, 2),
        "our_price": round(our_price, 2),
        "savings": round(competitor_total - our_price, 2),
        "savings_percent": round((1 - our_price / competitor_total) * 100, 1)
    }


# ============== GROWTH HACKING TACTICS ==============

GROWTH_TACTICS = [
    {
        "name": "Referral Program",
        "description": "Give €10, Get €10 for each referral",
        "potential_impact": "high",
        "implementation": "Viral sharing links with discount codes"
    },
    {
        "name": "First Purchase Discount",
        "description": "15% OFF first ticket purchase",
        "potential_impact": "high",
        "implementation": "Auto-apply for new users"
    },
    {
        "name": "Social Proof Popups",
        "description": "Show 'John from London just bought...'",
        "potential_impact": "medium",
        "implementation": "Already implemented"
    },
    {
        "name": "Urgency Timers",
        "description": "Countdown for limited offers",
        "potential_impact": "medium",
        "implementation": "Already implemented"
    },
    {
        "name": "Exit Intent Popup",
        "description": "Offer discount when leaving",
        "potential_impact": "medium",
        "implementation": "Already implemented"
    },
    {
        "name": "Abandoned Cart Recovery",
        "description": "Email sequence for incomplete purchases",
        "potential_impact": "high",
        "implementation": "3-email sequence"
    },
    {
        "name": "Price Alerts",
        "description": "Notify when prices drop",
        "potential_impact": "medium",
        "implementation": "Already implemented"
    },
    {
        "name": "Group Discounts",
        "description": "5% OFF for 4+ tickets",
        "potential_impact": "medium",
        "implementation": "Auto-apply at checkout"
    },
    {
        "name": "Student Discount",
        "description": "10% OFF with .edu email",
        "potential_impact": "low",
        "implementation": "Email verification"
    },
    {
        "name": "Newsletter Popup",
        "description": "Get 10% OFF for subscribing",
        "potential_impact": "medium",
        "implementation": "Entry popup"
    }
]


def get_monthly_marketing_plan() -> Dict:
    """Generate aggressive marketing plan"""
    return {
        "week_1": {
            "focus": "Launch & Awareness",
            "actions": [
                "Submit sitemap to Google Search Console",
                "Ping all search engines via IndexNow",
                "Post on 10 social media accounts",
                "Send launch email to existing contacts",
                "Activate referral program"
            ],
            "target_visitors": 5000,
            "target_sales": 50
        },
        "week_2": {
            "focus": "Content & SEO",
            "actions": [
                "Publish 10 blog articles",
                "Create 50 programmatic landing pages",
                "Guest post on 3 sports blogs",
                "Launch Facebook/Instagram ads (€500)",
                "Influencer outreach (5 micro-influencers)"
            ],
            "target_visitors": 15000,
            "target_sales": 150
        },
        "week_3": {
            "focus": "Conversion Optimization",
            "actions": [
                "A/B test checkout flow",
                "Optimize abandoned cart emails",
                "Add more social proof elements",
                "Launch Google Ads (€1000)",
                "Retargeting campaigns"
            ],
            "target_visitors": 30000,
            "target_sales": 350
        },
        "week_4": {
            "focus": "Scale & Viral",
            "actions": [
                "Double ad spend on winning campaigns",
                "Launch viral referral contest",
                "Partner with 3 travel agencies",
                "PR push to sports news sites",
                "Loyalty program launch"
            ],
            "target_visitors": 50000,
            "target_sales": 450
        },
        "total_target": 1000
    }
