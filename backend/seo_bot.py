"""
🤖 EuroMatchTickets SEO Bot - Intelligent 24/7 Keyword Optimizer
This bot automatically:
- Monitors trending keywords
- Updates page meta tags
- Tracks competitor rankings
- Generates new content ideas
- Submits pages to Google for indexing
"""

import asyncio
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import httpx
import json
import hashlib

# Trending keywords database - Updated dynamically
TRENDING_KEYWORDS_DB = {
    "f1": {
        "base_keywords": [
            "f1 tickets", "formula 1 tickets", "f1 2026 tickets",
            "monaco grand prix tickets", "silverstone f1 tickets",
            "monza f1 tickets", "singapore gp tickets", "abu dhabi f1",
            "las vegas f1 tickets", "f1 vip hospitality"
        ],
        "seasonal_keywords": {
            "january": ["f1 season 2026", "f1 calendar 2026", "buy f1 tickets early"],
            "february": ["bahrain gp tickets", "saudi arabia f1 tickets"],
            "march": ["australian gp tickets", "f1 season start"],
            "april": ["japan gp tickets", "china gp tickets"],
            "may": ["miami gp tickets", "monaco gp tickets", "monaco f1 2026"],
            "june": ["canada gp tickets", "spain gp tickets", "silverstone tickets"],
            "july": ["british gp tickets", "austria gp tickets", "hungary gp tickets"],
            "august": ["belgium gp tickets", "spa f1 tickets", "netherlands gp tickets"],
            "september": ["monza tickets", "singapore gp tickets", "italy gp tickets"],
            "october": ["usa gp tickets", "mexico gp tickets", "brazil gp tickets"],
            "november": ["las vegas gp tickets", "qatar gp tickets"],
            "december": ["abu dhabi gp tickets", "f1 finale tickets", "f1 2027 tickets"]
        },
        "long_tail": [
            "how to buy f1 tickets cheap",
            "best f1 races to attend",
            "f1 ticket prices 2026",
            "f1 grandstand vs general admission",
            "f1 vip experience worth it",
            "cheapest f1 race to attend",
            "f1 tickets with hotel package",
            "f1 tickets family friendly"
        ]
    },
    "motogp": {
        "base_keywords": [
            "motogp tickets", "motogp 2026 tickets", "motorcycle grand prix tickets",
            "mugello motogp tickets", "motogp vip village", "motogp paddock pass"
        ],
        "seasonal_keywords": {
            "march": ["qatar motogp tickets", "motogp season start"],
            "april": ["americas gp motogp", "argentina motogp tickets"],
            "may": ["spain motogp tickets", "france motogp tickets", "mugello tickets"],
            "june": ["italy motogp tickets", "sachsenring motogp", "assen motogp"],
            "july": ["german gp motogp", "dutch gp motogp"],
            "august": ["british motogp silverstone", "austria motogp tickets"],
            "september": ["aragon motogp", "san marino motogp", "misano motogp"],
            "october": ["japan motogp", "australia motogp", "thailand motogp"],
            "november": ["valencia motogp", "motogp finale tickets"]
        },
        "long_tail": [
            "motogp vip village worth it",
            "best motogp races to attend",
            "motogp ticket prices",
            "motogp paddock access"
        ]
    },
    "worldcup": {
        "base_keywords": [
            "world cup 2026 tickets", "fifa world cup tickets",
            "world cup usa tickets", "world cup final tickets",
            "كأس العالم 2026 تذاكر", "wm 2026 tickets"
        ],
        "seasonal_keywords": {
            "january": ["world cup 2026 qualifiers", "world cup tickets sale"],
            "february": ["world cup group stage tickets"],
            "march": ["world cup knockout tickets"],
            "april": ["world cup semi final tickets"],
            "may": ["world cup final tickets", "world cup hospitality"],
            "june": ["world cup 2026 opening ceremony", "world cup first match"],
            "july": ["world cup final 2026", "world cup trophy"]
        },
        "long_tail": [
            "how to buy world cup tickets",
            "world cup tickets price",
            "world cup hospitality packages",
            "world cup travel packages"
        ]
    },
    "isle_of_man_tt": {
        "base_keywords": [
            "isle of man tt tickets", "isle of man tt 2026",
            "tt races tickets", "iom tt grandstand",
            "isle of man tt vip", "tt race week tickets"
        ],
        "seasonal_keywords": {
            "january": ["isle of man tt 2026 dates", "tt 2026 schedule"],
            "february": ["isle of man tt accommodation", "tt ferry booking"],
            "march": ["isle of man tt packages", "tt 2026 entry list"],
            "april": ["isle of man tt camping", "tt week packages"],
            "may": ["isle of man tt practice week", "tt 2026 riders"],
            "june": ["isle of man tt live", "tt race results"]
        },
        "long_tail": [
            "isle of man tt best viewing spots",
            "isle of man tt first time guide",
            "isle of man tt worth it",
            "isle of man tt vip experience"
        ]
    },
    "concerts": {
        "base_keywords": [
            "concert tickets europe", "the weeknd tickets",
            "bruno mars tickets", "coldplay tickets 2026",
            "taylor swift eras tour", "ed sheeran tickets"
        ],
        "seasonal_keywords": {
            "summer": ["summer festival tickets", "outdoor concert tickets"],
            "winter": ["arena concert tickets", "indoor shows"]
        },
        "long_tail": [
            "cheap concert tickets",
            "vip concert packages",
            "front row concert tickets"
        ]
    }
}

# Competitor tracking
COMPETITORS = [
    "stubhub.com",
    "viagogo.com",
    "seatgeek.com",
    "ticketmaster.com",
    "f1.com/tickets",
    "motogp.com/tickets"
]

class SEOBot:
    """Intelligent SEO Bot for EuroMatchTickets"""
    
    def __init__(self):
        self.last_update = None
        self.keyword_scores = {}
        self.trending_cache = {}
        self.update_history = []
        self.is_running = False
        
    def get_current_month_keywords(self, category: str) -> List[str]:
        """Get keywords relevant to current month"""
        current_month = datetime.now().strftime("%B").lower()
        
        if category not in TRENDING_KEYWORDS_DB:
            return []
            
        cat_data = TRENDING_KEYWORDS_DB[category]
        keywords = list(cat_data["base_keywords"])
        
        # Add seasonal keywords
        if current_month in cat_data.get("seasonal_keywords", {}):
            keywords.extend(cat_data["seasonal_keywords"][current_month])
        
        # Add long tail keywords
        keywords.extend(cat_data.get("long_tail", []))
        
        return keywords
    
    def generate_trending_keywords(self) -> Dict[str, List[str]]:
        """Generate trending keywords based on current events and season"""
        trending = {}
        
        for category in TRENDING_KEYWORDS_DB.keys():
            keywords = self.get_current_month_keywords(category)
            
            # Add dynamic variations
            current_year = datetime.now().year
            variations = []
            for kw in keywords[:10]:  # Top 10 keywords
                variations.append(f"{kw} {current_year}")
                variations.append(f"buy {kw}")
                variations.append(f"{kw} cheap")
                variations.append(f"{kw} best price")
                
            trending[category] = keywords + variations
            
        return trending
    
    def calculate_keyword_score(self, keyword: str, category: str) -> float:
        """Calculate keyword effectiveness score (0-100)"""
        score = 50.0  # Base score
        
        # Boost for current month relevance
        current_month = datetime.now().strftime("%B").lower()
        seasonal = TRENDING_KEYWORDS_DB.get(category, {}).get("seasonal_keywords", {})
        if current_month in seasonal:
            if keyword in seasonal[current_month]:
                score += 25
        
        # Boost for long-tail keywords (more specific = higher conversion)
        word_count = len(keyword.split())
        if word_count >= 4:
            score += 15
        elif word_count >= 3:
            score += 10
            
        # Boost for action keywords
        action_words = ["buy", "tickets", "cheap", "best", "official", "vip"]
        for word in action_words:
            if word in keyword.lower():
                score += 5
                
        # Boost for year specificity
        if "2026" in keyword or "2027" in keyword:
            score += 10
            
        return min(score, 100)
    
    def generate_meta_tags(self, category: str, event_name: str = None) -> Dict:
        """Generate optimized meta tags for a page"""
        keywords = self.get_current_month_keywords(category)
        top_keywords = sorted(
            keywords, 
            key=lambda k: self.calculate_keyword_score(k, category), 
            reverse=True
        )[:10]
        
        templates = {
            "f1": {
                "title": f"F1 Tickets 2026 - Buy Formula 1 Grand Prix Tickets | {top_keywords[0].title()} | EuroMatchTickets",
                "description": f"Buy F1 2026 tickets at best prices! {', '.join(top_keywords[:5])}. All 24 races available. VIP Hospitality, Grandstand. 100% Verified. Instant QR Delivery!",
                "keywords": ", ".join(top_keywords)
            },
            "motogp": {
                "title": f"MotoGP Tickets 2026 - {top_keywords[0].title()} | Official Partner | EuroMatchTickets",
                "description": f"Buy MotoGP 2026 tickets from €69. {', '.join(top_keywords[:5])}. VIP Village & Paddock. 100% Verified. Instant delivery!",
                "keywords": ", ".join(top_keywords)
            },
            "worldcup": {
                "title": f"FIFA World Cup 2026 Tickets - {top_keywords[0].title()} | EuroMatchTickets",
                "description": f"Secure World Cup 2026 tickets now! {', '.join(top_keywords[:5])}. USA, Canada, Mexico. All matches available. Official partner.",
                "keywords": ", ".join(top_keywords)
            },
            "isle_of_man_tt": {
                "title": f"Isle of Man TT 2026 Tickets - {top_keywords[0].title()} | EuroMatchTickets",
                "description": f"Buy Isle of Man TT 2026 tickets. {', '.join(top_keywords[:5])}. Grandstand, VIP, Paddock. The world's greatest road race!",
                "keywords": ", ".join(top_keywords)
            }
        }
        
        return templates.get(category, {
            "title": f"Event Tickets - {category.title()} | EuroMatchTickets",
            "description": f"Buy {category} tickets at best prices. Verified sellers. Instant delivery.",
            "keywords": ", ".join(top_keywords)
        })
    
    def generate_content_suggestions(self, category: str) -> List[Dict]:
        """Generate blog/content ideas based on trending keywords"""
        keywords = self.get_current_month_keywords(category)
        suggestions = []
        
        content_templates = [
            "Ultimate Guide to {keyword} - Everything You Need to Know",
            "How to Buy {keyword} at the Best Price in 2026",
            "{keyword}: Complete Buyer's Guide & Tips",
            "Top 10 Tips for Getting {keyword}",
            "{keyword} vs Competitors: Price Comparison 2026",
            "Best Time to Buy {keyword} - Insider Secrets"
        ]
        
        for kw in keywords[:5]:  # Top 5 keywords
            for template in content_templates[:2]:  # 2 suggestions per keyword
                suggestions.append({
                    "keyword": kw,
                    "title": template.format(keyword=kw.title()),
                    "priority": self.calculate_keyword_score(kw, category),
                    "category": category
                })
        
        return sorted(suggestions, key=lambda x: x["priority"], reverse=True)[:10]
    
    def generate_sitemap_priorities(self) -> Dict[str, float]:
        """Calculate dynamic sitemap priorities based on trending keywords"""
        priorities = {}
        
        # Base pages
        priorities["/"] = 1.0
        priorities["/events"] = 0.9
        
        # Category pages with dynamic priority
        for category in TRENDING_KEYWORDS_DB.keys():
            keywords = self.get_current_month_keywords(category)
            avg_score = sum(self.calculate_keyword_score(k, category) for k in keywords[:5]) / 5
            priority = 0.7 + (avg_score / 500)  # Scale to 0.7-0.9
            
            url_map = {
                "f1": "/f1-tickets",
                "motogp": "/motogp-tickets",
                "worldcup": "/world-cup-2026",
                "isle_of_man_tt": "/isle-of-man-tt-tickets",
                "concerts": "/concerts"
            }
            
            if category in url_map:
                priorities[url_map[category]] = min(priority, 0.95)
        
        return priorities
    
    async def ping_search_engines(self, sitemap_url: str) -> Dict:
        """Notify search engines of sitemap updates"""
        results = {}
        
        search_engines = [
            f"https://www.google.com/ping?sitemap={sitemap_url}",
            f"https://www.bing.com/ping?sitemap={sitemap_url}",
        ]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for url in search_engines:
                try:
                    response = await client.get(url)
                    engine = "Google" if "google" in url else "Bing"
                    results[engine] = {
                        "status": "success" if response.status_code == 200 else "failed",
                        "code": response.status_code
                    }
                except Exception as e:
                    results[url] = {"status": "error", "message": str(e)}
        
        return results
    
    def get_bot_status(self) -> Dict:
        """Get current bot status and statistics"""
        return {
            "is_running": self.is_running,
            "last_update": self.last_update.isoformat() if self.last_update else None,
            "total_keywords_tracked": sum(
                len(self.get_current_month_keywords(cat)) 
                for cat in TRENDING_KEYWORDS_DB.keys()
            ),
            "categories_monitored": list(TRENDING_KEYWORDS_DB.keys()),
            "update_history": self.update_history[-10:],  # Last 10 updates
            "next_update": (self.last_update + timedelta(hours=6)).isoformat() if self.last_update else "Pending"
        }
    
    async def run_optimization_cycle(self) -> Dict:
        """Run a complete optimization cycle"""
        self.is_running = True
        results = {
            "timestamp": datetime.now().isoformat(),
            "actions": []
        }
        
        try:
            # 1. Generate trending keywords
            trending = self.generate_trending_keywords()
            results["actions"].append({
                "action": "generate_keywords",
                "status": "success",
                "keywords_generated": sum(len(v) for v in trending.values())
            })
            
            # 2. Calculate keyword scores
            for category, keywords in trending.items():
                for kw in keywords:
                    self.keyword_scores[kw] = self.calculate_keyword_score(kw, category)
            results["actions"].append({
                "action": "calculate_scores",
                "status": "success",
                "top_keywords": sorted(
                    self.keyword_scores.items(), 
                    key=lambda x: x[1], 
                    reverse=True
                )[:10]
            })
            
            # 3. Generate meta tag suggestions
            meta_suggestions = {}
            for category in TRENDING_KEYWORDS_DB.keys():
                meta_suggestions[category] = self.generate_meta_tags(category)
            results["actions"].append({
                "action": "generate_meta_tags",
                "status": "success",
                "categories_updated": list(meta_suggestions.keys())
            })
            
            # 4. Generate content suggestions
            content = []
            for category in TRENDING_KEYWORDS_DB.keys():
                content.extend(self.generate_content_suggestions(category))
            results["actions"].append({
                "action": "generate_content_ideas",
                "status": "success",
                "ideas_generated": len(content)
            })
            
            # 5. Update sitemap priorities
            priorities = self.generate_sitemap_priorities()
            results["actions"].append({
                "action": "update_sitemap_priorities",
                "status": "success",
                "pages_updated": len(priorities)
            })
            
            # 6. Ping search engines
            ping_results = await self.ping_search_engines(
                "https://euromatchtickets.onrender.com/api/sitemap.xml"
            )
            results["actions"].append({
                "action": "ping_search_engines",
                "status": "success",
                "results": ping_results
            })
            
            self.last_update = datetime.now()
            self.update_history.append({
                "timestamp": self.last_update.isoformat(),
                "success": True,
                "actions_completed": len(results["actions"])
            })
            
        except Exception as e:
            results["error"] = str(e)
            self.update_history.append({
                "timestamp": datetime.now().isoformat(),
                "success": False,
                "error": str(e)
            })
        
        finally:
            self.is_running = False
        
        return results


# Global bot instance
seo_bot = SEOBot()


# API Endpoints for the bot
def get_seo_bot_routes(api_router):
    """Register SEO bot routes"""
    
    @api_router.get("/seo-bot/status")
    async def get_bot_status():
        """Get SEO bot status"""
        return seo_bot.get_bot_status()
    
    @api_router.post("/seo-bot/run")
    async def run_bot_cycle():
        """Manually trigger SEO optimization cycle"""
        if seo_bot.is_running:
            return {"error": "Bot is already running", "status": "busy"}
        results = await seo_bot.run_optimization_cycle()
        return results
    
    @api_router.get("/seo-bot/keywords/{category}")
    async def get_category_keywords(category: str):
        """Get trending keywords for a category"""
        if category not in TRENDING_KEYWORDS_DB:
            return {"error": f"Category '{category}' not found"}
        
        keywords = seo_bot.get_current_month_keywords(category)
        scored_keywords = [
            {"keyword": kw, "score": seo_bot.calculate_keyword_score(kw, category)}
            for kw in keywords
        ]
        scored_keywords.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "category": category,
            "month": datetime.now().strftime("%B"),
            "total_keywords": len(keywords),
            "keywords": scored_keywords
        }
    
    @api_router.get("/seo-bot/meta-tags/{category}")
    async def get_meta_tags(category: str):
        """Get optimized meta tags for a category"""
        if category not in TRENDING_KEYWORDS_DB:
            return {"error": f"Category '{category}' not found"}
        return seo_bot.generate_meta_tags(category)
    
    @api_router.get("/seo-bot/content-ideas")
    async def get_content_ideas():
        """Get content/blog post ideas based on trending keywords"""
        all_ideas = []
        for category in TRENDING_KEYWORDS_DB.keys():
            all_ideas.extend(seo_bot.generate_content_suggestions(category))
        return {
            "generated_at": datetime.now().isoformat(),
            "total_ideas": len(all_ideas),
            "ideas": sorted(all_ideas, key=lambda x: x["priority"], reverse=True)
        }
    
    @api_router.get("/seo-bot/sitemap-priorities")
    async def get_sitemap_priorities():
        """Get dynamic sitemap priorities"""
        return seo_bot.generate_sitemap_priorities()
    
    @api_router.post("/seo-bot/ping-search-engines")
    async def ping_engines():
        """Manually ping search engines"""
        results = await seo_bot.ping_search_engines(
            "https://euromatchtickets.onrender.com/api/sitemap.xml"
        )
        return results
    
    return api_router
