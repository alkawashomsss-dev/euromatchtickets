"""
Iteration 57 — SEO indexability re-verification after fixes applied for iter56 failures.
Uses requests only for sitemaps/robots. Playwright DOM check is in a separate script.
"""
import os
import re
import xml.etree.ElementTree as ET
import requests
import pytest

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com").rstrip("/")
PROD = "https://euromatchtickets.com"
UA = {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}


def test_robots_txt():
    r = requests.get(f"{BASE}/robots.txt", headers=UA, timeout=15)
    assert r.status_code == 200
    body = r.text
    assert "User-agent: *" in body
    assert "Allow: /" in body
    assert f"Sitemap: {PROD}/sitemap.xml" in body
    # Confirm no global Disallow: / for User-agent: * (AI bot disallows are intentional)
    # Parse blocks - ensure the User-agent: * block does NOT disallow /
    blocks = re.split(r"\n\s*\n", body)
    star_block = [b for b in blocks if re.search(r"^User-agent:\s*\*\s*$", b, re.M)]
    assert star_block, "No User-agent: * block in robots.txt"
    assert not re.search(r"^Disallow:\s*/\s*$", star_block[0], re.M), \
        "User-agent: * block contains global Disallow: /"


def test_sitemap_index():
    r = requests.get(f"{BASE}/sitemap.xml", headers=UA, timeout=15)
    assert r.status_code == 200
    assert "xml" in r.headers.get("content-type", "").lower() or r.text.lstrip().startswith("<?xml")
    root = ET.fromstring(r.text)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    subs = root.findall("sm:sitemap/sm:loc", ns)
    assert len(subs) >= 6, f"Expected >=6 sub-sitemaps, got {len(subs)}"


@pytest.mark.parametrize("sub", [
    "sitemap-events.xml",
    "sitemap-worldcup.xml",
    "sitemap-f1-motorsport.xml",
])
def test_sub_sitemap_urls_return_200(sub):
    r = requests.get(f"{BASE}/{sub}", headers=UA, timeout=15)
    assert r.status_code == 200
    root = ET.fromstring(r.text)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [e.text for e in root.findall("sm:url/sm:loc", ns)]
    assert len(locs) > 0
    # Sample first 10 URLs
    sample = locs[:10]
    failures = []
    for url in sample:
        path = url.replace(PROD, "")
        try:
            rr = requests.get(f"{BASE}{path}", headers=UA, timeout=15, allow_redirects=True)
            if rr.status_code != 200:
                failures.append((path, rr.status_code))
        except Exception as e:
            failures.append((path, str(e)[:50]))
    assert not failures, f"Failing URLs in {sub}: {failures}"


KEY_ROUTES = [
    "/", "/events", "/world-cup-2026-tickets", "/world-cup-2026-final-tickets",
    "/world-cup-2026-schedule", "/world-cup-2026-new-york-new-jersey-tickets",
    "/world-cup-2026-los-angeles-tickets", "/world-cup-2026-miami-tickets",
    "/world-cup-2026-dallas-tickets", "/world-cup-2026-mexico-city-tickets",
    "/world-cup-2026-toronto-tickets", "/world-cup-2026-vancouver-tickets",
    "/f1-tickets", "/f1-tickets-2026", "/f1-2026-schedule", "/f1-ticket-prices-2026",
    "/how-to-buy-f1-tickets", "/f1-monaco-grand-prix-tickets",
    "/f1-british-grand-prix-silverstone-tickets", "/f1-belgian-grand-prix-spa-tickets",
    "/f1-italian-grand-prix-monza-tickets", "/motogp-tickets", "/motogp-2026-schedule",
    "/isle-of-man-tt-tickets", "/champions-league-tickets",
    "/champions-league-2026-final-tickets", "/el-clasico-tickets",
    "/bayern-vs-real-madrid-tickets", "/premier-league-tickets-2026",
    "/bundesliga-tickets-2026", "/concerts-in-amsterdam-2026",
    "/concerts-in-paris-2026", "/coldplay-tour-2026", "/the-weeknd-tour-2026",
    "/bruno-mars-tour-2026", "/about", "/faq", "/blog", "/reviews",
    "/euromatchtickets-vs-stubhub", "/concerts-in-london-2026",
    "/taylor-swift-london-tickets", "/euromatchtickets-vs-viagogo",
    "/events-this-weekend", "/events-june-2026", "/events-july-2026",
    "/f1-ticket-prices-guide",
]


@pytest.mark.parametrize("path", KEY_ROUTES)
def test_route_returns_200(path):
    r = requests.get(f"{BASE}{path}", headers=UA, timeout=20, allow_redirects=True)
    assert r.status_code == 200, f"{path} returned {r.status_code}"
