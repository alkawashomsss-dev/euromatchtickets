#!/usr/bin/env python3
"""Generate static merchant-feed.xml in frontend/public/ for Google Merchant Center.
Run: python3 generate_merchant_feed.py
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'euromatchtickets')
SITE_URL = "https://euromatchtickets.com"

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

events = list(db.events.find({}, {"_id": 0}))
event_map = {}
for e in events:
    event_map[e.get("title", "")] = e

seo_pages = list(db.seo_pages.find({"active": True}, {"_id": 0}))

xml_parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '<channel>',
    '<title>EuroMatchTickets - Event Tickets</title>',
    f'<link>{SITE_URL}</link>',
    '<description>Verified event tickets at the cheapest prices in Europe</description>',
]

product_count = 0
for page in seo_pages:
    slug = page.get("slug", "")
    title = page.get("title", "")
    description = page.get("meta_description", "")
    
    price_low = page.get("price_low", 49)
    price_high = page.get("price_high", 500)
    
    if not slug or not title:
        continue
    
    img_url = f"{SITE_URL}/og-image.jpg"
    for evt in events:
        if any(keyword in slug for keyword in [
            evt.get("title", "").lower().replace(" ", "-")[:15]
        ]):
            if evt.get("image_url"):
                img_url = evt["image_url"]
            break
    
    categories = []
    if any(k in slug for k in ["f1", "grand-prix", "gp-", "monza", "bahrain", "monaco", "silverstone", "spa", "zandvoort"]):
        categories = ["Sporting Goods > Motorsport > Formula 1"]
    elif any(k in slug for k in ["champions-league", "premier-league", "la-liga", "serie-a", "bundesliga", "world-cup", "football", "madrid", "barcelona", "liverpool", "arsenal", "city", "bayern", "psg", "juventus", "clasico"]):
        categories = ["Sporting Goods > Football"]
    elif any(k in slug for k in ["taylor-swift", "coldplay", "concert", "bruno-mars", "weeknd", "guns", "bad-bunny", "maroon", "harry-styles", "metallica", "konzert", "conciertos", "concerti"]):
        categories = ["Arts & Entertainment > Concert Tickets"]
    elif any(k in slug for k in ["motogp", "isle-of-man", "tt-tickets"]):
        categories = ["Sporting Goods > Motorsport > MotoGP"]
    else:
        categories = ["Arts & Entertainment > Event Tickets"]
    
    product_id = f"emt-{slug.replace('/', '-').strip('-')}"
    
    xml_parts.append('<item>')
    xml_parts.append(f'  <g:id>{product_id}</g:id>')
    xml_parts.append(f'  <g:title>{title}</g:title>')
    xml_parts.append(f'  <g:description>{description}</g:description>')
    xml_parts.append(f'  <g:link>{SITE_URL}/{slug}</g:link>')
    xml_parts.append(f'  <g:image_link>{img_url}</g:image_link>')
    xml_parts.append(f'  <g:price>{price_low} EUR</g:price>')
    xml_parts.append(f'  <g:availability>in_stock</g:availability>')
    xml_parts.append(f'  <g:condition>new</g:condition>')
    xml_parts.append(f'  <g:brand>EuroMatchTickets</g:brand>')
    xml_parts.append(f'  <g:google_product_category>{categories[0]}</g:google_product_category>')
    xml_parts.append(f'  <g:identifier_exists>false</g:identifier_exists>')
    xml_parts.append(f'  <g:shipping>')
    xml_parts.append(f'    <g:country>DE</g:country>')
    xml_parts.append(f'    <g:service>Digital Delivery</g:service>')
    xml_parts.append(f'    <g:price>0 EUR</g:price>')
    xml_parts.append(f'  </g:shipping>')
    xml_parts.append('</item>')
    product_count += 1

xml_parts.append('</channel>')
xml_parts.append('</rss>')

output_path = os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'merchant-feed.xml')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(xml_parts))

print(f"Generated {output_path} with {product_count} products")
