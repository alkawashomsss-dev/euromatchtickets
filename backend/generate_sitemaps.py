#!/usr/bin/env python3
"""
Generate static sitemap XML files from the backend API.
Run this before deployment to ensure sitemaps are up-to-date.

Usage: python3 generate_sitemaps.py
"""
import requests
import os
import sys

API_BASE = os.environ.get("API_URL", "http://localhost:8001/api")
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public")

def generate():
    print(f"Generating static sitemaps from {API_BASE}...")
    
    # Fetch sitemap-index.xml
    r = requests.get(f"{API_BASE}/sitemap-index.xml")
    if r.status_code != 200:
        print(f"ERROR: Could not fetch sitemap-index.xml (status {r.status_code})")
        sys.exit(1)
    
    # Replace /api/sitemaps/ with /sitemaps/ for static serving
    content = r.text.replace("/api/sitemaps/", "/sitemaps/")
    
    with open(os.path.join(PUBLIC_DIR, "sitemap-index.xml"), "w") as f:
        f.write(content)
    with open(os.path.join(PUBLIC_DIR, "sitemap.xml"), "w") as f:
        f.write(content)
    print("Created sitemap-index.xml + sitemap.xml")
    
    # Create sitemaps directory
    sitemaps_dir = os.path.join(PUBLIC_DIR, "sitemaps")
    os.makedirs(sitemaps_dir, exist_ok=True)
    
    total_urls = 0
    for cat in ["pages", "f1", "football", "concerts", "worldcup", "cities", "articles"]:
        r = requests.get(f"{API_BASE}/sitemaps/{cat}.xml")
        with open(os.path.join(sitemaps_dir, f"{cat}.xml"), "w") as f:
            f.write(r.text)
        count = r.text.count("<url>")
        total_urls += count
        print(f"  sitemaps/{cat}.xml: {count} URLs")
    
    print(f"\nTotal: {total_urls} URLs across all sitemaps")
    print("Static sitemaps generated successfully!")

if __name__ == "__main__":
    generate()
