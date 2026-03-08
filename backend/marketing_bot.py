"""
🚀 Free Marketing Bot - Auto Social Media & SEO
Posts automatically to social media, generates viral content,
and drives free organic traffic to the site.
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict

# Viral post templates for different platforms
VIRAL_POST_TEMPLATES = {
    "twitter": {
        "f1": [
            "🏎️ {race_name} tickets just dropped! From €{price}\n\n⚡ Limited seats available\n🎟️ Instant QR delivery\n\n#F1 #Formula1 #{race_hashtag} #F12026\n\n👉 euromatchtickets.com/f1-tickets",
            "🔥 BREAKING: {race_name} 2026 tickets on sale!\n\n✅ Best prices guaranteed\n✅ 100% verified\n✅ Instant delivery\n\nBook now 👇\neuromatchtickets.com/f1-tickets\n\n#F1 #{race_hashtag}",
            "Who's going to {race_name} 2026? 🙋‍♂️\n\nGrandstand tickets from €{price}\nVIP from €{vip_price}\n\n🎟️ euromatchtickets.com/f1-tickets\n\n#Formula1 #F1Tickets #{race_hashtag}",
            "⏰ 48 HOURS LEFT!\n\n{race_name} early bird prices ending soon!\n\nSave up to 25% on F1 tickets\n\n👉 euromatchtickets.com/f1-tickets\n\n#F1 #F12026 #{race_hashtag}",
        ],
        "motogp": [
            "🏍️ MotoGP {race_name} tickets LIVE!\n\nFrom €{price}\n✅ VIP Village available\n✅ Paddock passes\n\n#MotoGP #{race_hashtag} #MotoGP2026\n\n👉 euromatchtickets.com/motogp-tickets",
            "Ready to see Bagnaia vs Marquez live? 🔥\n\n{race_name} 2026 tickets on sale!\n\n🎟️ euromatchtickets.com/motogp-tickets\n\n#MotoGP #{race_hashtag}",
        ],
        "worldcup": [
            "⚽ FIFA World Cup 2026 tickets NOW AVAILABLE!\n\n🇺🇸🇨🇦🇲🇽 USA • Canada • Mexico\n\nFrom €{price}\n\n#WorldCup2026 #FIFA #كأس_العالم\n\n👉 euromatchtickets.com/world-cup-2026",
            "🏆 Don't miss history!\n\nWorld Cup 2026 - 48 teams, 104 matches\n\nGet your tickets now 👇\neuromatchtickets.com/world-cup-2026\n\n#WorldCup #FIFA2026 #WM2026",
        ],
        "concerts": [
            "🎤 {artist} tickets on sale NOW!\n\n📍 {venue}\n📅 {date}\n💰 From €{price}\n\n🎟️ euromatchtickets.com\n\n#{artist_hashtag} #ConcertTickets #LiveMusic",
            "Who's excited for {artist}? 🙌\n\nTickets selling FAST!\n\n👉 euromatchtickets.com\n\n#{artist_hashtag} #Tickets",
        ],
        "engagement": [
            "Which F1 race would you rather attend?\n\n🔁 RT for Monaco 🇲🇨\n❤️ Like for Silverstone 🇬🇧\n\n#F1 #Formula1",
            "Best MotoGP circuit?\n\n🔁 Mugello\n❤️ Phillip Island\n💬 Comment your pick!\n\n#MotoGP",
            "World Cup 2026 - Who's winning?\n\n🇧🇷 Brazil\n🇫🇷 France\n🇦🇷 Argentina\n🇩🇪 Germany\n\nComment below! 👇\n\n#WorldCup2026",
        ]
    },
    "instagram": {
        "f1": [
            "🏎️ F1 2026 TICKETS ON SALE!\n\n{race_name} - From €{price}\n\n✅ Grandstand seats\n✅ VIP hospitality\n✅ Instant QR delivery\n✅ Best prices guaranteed\n\nLink in bio! 🔗\n\n#F1 #Formula1 #{race_hashtag} #F1Tickets #Racing #Motorsport #GrandPrix #F12026 #FormulaOne #RaceDay",
        ],
        "reels_ideas": [
            "POV: You just bought F1 tickets 🏎️✨",
            "Me explaining why we NEED to go to Monaco GP 🇲🇨",
            "World Cup 2026 countdown ⚽🏆",
            "MotoGP vibes 🏍️🔥",
        ]
    },
    "facebook": {
        "f1": [
            "🏎️ Formula 1 2026 Season Tickets Now Available!\n\n{race_name}\n📅 Date: {date}\n💰 From: €{price}\n\n✅ 100% Verified Tickets\n✅ Instant QR Delivery\n✅ Best Prices in Europe\n✅ Money-Back Guarantee\n\nBook now: euromatchtickets.com/f1-tickets\n\n#F1 #Formula1 #{race_hashtag}",
        ],
        "groups_to_join": [
            "F1 Fans",
            "Formula 1 Tickets Buy/Sell",
            "MotoGP Fans Worldwide",
            "World Cup 2026 Tickets",
            "Football Ticket Exchange",
            "Concert Tickets Europe",
        ]
    },
    "reddit": {
        "subreddits": [
            "r/formula1",
            "r/motogp",
            "r/soccer",
            "r/worldcup",
            "r/concerts",
            "r/TicketExchange",
        ],
        "post_templates": [
            "Where to buy {event} tickets? I found good prices at euromatchtickets.com",
            "PSA: {event} tickets available - verified seller with good reviews",
        ]
    }
}

# SEO Blog post ideas for organic traffic
BLOG_POST_IDEAS = [
    {
        "title": "How to Buy F1 Tickets Without Getting Scammed (2026 Guide)",
        "keywords": ["buy f1 tickets", "f1 tickets safe", "f1 tickets legit"],
        "outline": [
            "Introduction - The F1 ticket market",
            "Red flags to watch for",
            "Trusted platforms comparison",
            "Why EuroMatchTickets is safe",
            "Step-by-step buying guide",
            "Money-back guarantee explained"
        ]
    },
    {
        "title": "Monaco Grand Prix 2026: Complete Ticket Guide & Best Viewing Spots",
        "keywords": ["monaco gp tickets", "monaco f1 2026", "best seats monaco"],
        "outline": [
            "Monaco GP overview",
            "Ticket categories explained",
            "Best grandstands for viewing",
            "Price comparison",
            "How to book",
            "Travel tips"
        ]
    },
    {
        "title": "World Cup 2026 Tickets: Everything You Need to Know",
        "keywords": ["world cup 2026 tickets", "fifa world cup tickets", "how to buy world cup tickets"],
        "outline": [
            "World Cup 2026 overview",
            "Host cities and venues",
            "Ticket categories",
            "Prices by match type",
            "How to buy safely",
            "Travel packages"
        ]
    },
    {
        "title": "MotoGP vs F1: Which Racing Event Should You Attend?",
        "keywords": ["motogp tickets", "f1 vs motogp", "best racing event"],
        "outline": [
            "Overview of both sports",
            "Atmosphere comparison",
            "Ticket price comparison",
            "Best races to attend",
            "Our recommendation"
        ]
    },
    {
        "title": "Isle of Man TT 2026: The Ultimate First-Timer's Guide",
        "keywords": ["isle of man tt tickets", "tt 2026", "isle of man tt guide"],
        "outline": [
            "What is the Isle of Man TT",
            "Best viewing spots",
            "Ticket options",
            "Accommodation tips",
            "Getting there"
        ]
    },
]

# Referral/Viral mechanics
REFERRAL_REWARDS = {
    "refer_friend": {
        "referrer_reward": "€10 credit",
        "referee_reward": "10% off first purchase",
        "viral_message": "🎟️ Get €10 off tickets! Use my link: euromatchtickets.com/ref/{code}"
    },
    "share_discount": {
        "share_platforms": ["twitter", "facebook", "whatsapp"],
        "reward": "5% extra discount for sharing"
    }
}

class FreeMarketingBot:
    """Generates viral content for free marketing"""
    
    def __init__(self):
        self.posts_generated = 0
        self.last_generation = None
    
    def generate_twitter_post(self, category: str, event_data: dict = None) -> str:
        """Generate a viral Twitter post"""
        templates = VIRAL_POST_TEMPLATES["twitter"].get(category, [])
        if not templates:
            templates = VIRAL_POST_TEMPLATES["twitter"]["engagement"]
        
        template = random.choice(templates)
        
        # Default values
        defaults = {
            "race_name": "Monaco Grand Prix",
            "price": random.randint(150, 350),
            "vip_price": random.randint(800, 2000),
            "race_hashtag": "MonacoGP",
            "artist": "The Weeknd",
            "artist_hashtag": "TheWeeknd",
            "venue": "Wembley Stadium",
            "date": "Summer 2026"
        }
        
        if event_data:
            defaults.update(event_data)
        
        return template.format(**defaults)
    
    def generate_instagram_caption(self, category: str, event_data: dict = None) -> str:
        """Generate Instagram caption with hashtags"""
        templates = VIRAL_POST_TEMPLATES["instagram"].get(category, [])
        if not templates:
            return self.generate_twitter_post(category, event_data)
        
        template = random.choice(templates)
        defaults = {
            "race_name": "Monaco Grand Prix",
            "price": random.randint(150, 350),
            "race_hashtag": "MonacoGP",
            "date": "May 2026"
        }
        
        if event_data:
            defaults.update(event_data)
        
        return template.format(**defaults)
    
    def generate_facebook_post(self, category: str, event_data: dict = None) -> str:
        """Generate Facebook post"""
        templates = VIRAL_POST_TEMPLATES["facebook"].get(category, [])
        if not templates:
            return self.generate_twitter_post(category, event_data)
        
        template = random.choice(templates)
        defaults = {
            "race_name": "Monaco Grand Prix",
            "price": random.randint(150, 350),
            "race_hashtag": "MonacoGP",
            "date": "May 25, 2026"
        }
        
        if event_data:
            defaults.update(event_data)
        
        return template.format(**defaults)
    
    def get_engagement_post(self) -> str:
        """Get a post designed to drive engagement"""
        return random.choice(VIRAL_POST_TEMPLATES["twitter"]["engagement"])
    
    def get_blog_ideas(self) -> List[dict]:
        """Get SEO blog post ideas"""
        return BLOG_POST_IDEAS
    
    def generate_weekly_content_calendar(self) -> Dict:
        """Generate a week's worth of social media content"""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        categories = ["f1", "motogp", "worldcup", "concerts", "engagement"]
        
        calendar = {}
        for i, day in enumerate(days):
            category = categories[i % len(categories)]
            calendar[day] = {
                "category": category,
                "twitter": self.generate_twitter_post(category),
                "instagram": self.generate_instagram_caption(category),
                "facebook": self.generate_facebook_post(category),
                "best_time": "12:00 PM" if i < 5 else "10:00 AM"
            }
        
        return calendar
    
    def get_viral_hooks(self) -> List[str]:
        """Get viral hooks for posts"""
        return [
            "🚨 BREAKING:",
            "⚠️ LAST CHANCE:",
            "🔥 HOT DROP:",
            "⏰ 24 HOURS LEFT:",
            "💰 PRICE DROP:",
            "🎉 GIVEAWAY:",
            "📢 ANNOUNCEMENT:",
            "⚡ FLASH SALE:",
        ]
    
    def get_referral_message(self, user_code: str) -> str:
        """Generate referral share message"""
        return f"""🎟️ Get €10 OFF your first ticket purchase!

I use EuroMatchTickets for F1, concerts & football tickets.

✅ Best prices
✅ Instant delivery
✅ 100% verified

Use my link: euromatchtickets.com/ref/{user_code}

#Tickets #F1 #Concerts #Football"""

    def get_whatsapp_share_message(self, event_name: str, url: str) -> str:
        """Generate WhatsApp share message"""
        return f"""Hey! Check out these {event_name} tickets 🎟️

Found them cheaper than other sites!

{url}

They have instant delivery and money-back guarantee 👍"""


# Create global instance
marketing_bot = FreeMarketingBot()


def get_marketing_bot_routes(api_router):
    """Register marketing bot routes"""
    
    @api_router.get("/marketing-bot/twitter/{category}")
    async def get_twitter_post(category: str):
        """Generate Twitter post for category"""
        post = marketing_bot.generate_twitter_post(category)
        return {
            "platform": "twitter",
            "category": category,
            "post": post,
            "character_count": len(post),
            "generated_at": datetime.now().isoformat()
        }
    
    @api_router.get("/marketing-bot/instagram/{category}")
    async def get_instagram_post(category: str):
        """Generate Instagram caption"""
        caption = marketing_bot.generate_instagram_caption(category)
        return {
            "platform": "instagram",
            "category": category,
            "caption": caption,
            "generated_at": datetime.now().isoformat()
        }
    
    @api_router.get("/marketing-bot/content-calendar")
    async def get_content_calendar():
        """Get weekly content calendar"""
        return {
            "week_of": datetime.now().strftime("%Y-%m-%d"),
            "calendar": marketing_bot.generate_weekly_content_calendar()
        }
    
    @api_router.get("/marketing-bot/blog-ideas")
    async def get_blog_ideas():
        """Get SEO blog post ideas"""
        return {
            "ideas": marketing_bot.get_blog_ideas(),
            "total": len(BLOG_POST_IDEAS)
        }
    
    @api_router.get("/marketing-bot/engagement-post")
    async def get_engagement_post():
        """Get engagement-driving post"""
        return {
            "post": marketing_bot.get_engagement_post(),
            "purpose": "Drive engagement and followers"
        }
    
    @api_router.get("/marketing-bot/referral-message/{user_code}")
    async def get_referral_message(user_code: str):
        """Generate referral share message"""
        return {
            "message": marketing_bot.get_referral_message(user_code),
            "platforms": ["twitter", "whatsapp", "telegram", "email"]
        }
    
    @api_router.get("/marketing-bot/viral-hooks")
    async def get_viral_hooks():
        """Get viral post hooks"""
        return {
            "hooks": marketing_bot.get_viral_hooks()
        }
    
    return api_router
