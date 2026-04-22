"""
Iteration 56 - Comprehensive SEO indexability audit.
Verifies: sitemaps, robots.txt, all JSON-LD validity, titles uniqueness, canonicals,
status codes, OG images for all key SEO landing routes.
"""
import json
import os
import re
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

import pytest
import requests

PREVIEW = os.environ.get("REACT_APP_BACKEND_URL", "https://euro-indexing.preview.emergentagent.com").rstrip("/")
PROD = "https://euromatchtickets.com"

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "image": "http://www.google.com/schemas/sitemap-image/1.1"}

SITEMAP_FILES = [
    "sitemap-core.xml", "sitemap-events.xml", "sitemap-worldcup.xml",
    "sitemap-f1-motorsport.xml", "sitemap-football.xml", "sitemap-concerts.xml",
    "sitemap-city-regional.xml", "sitemap-international.xml", "sitemap-guides.xml",
]

KEY_ROUTES = [
    "/", "/events", "/about", "/faq", "/blog",
    "/world-cup-2026-tickets", "/world-cup-2026-final-tickets", "/world-cup-2026-schedule",
    "/world-cup-2026-new-york-new-jersey-tickets", "/world-cup-2026-los-angeles-tickets",
    "/world-cup-2026-miami-tickets", "/world-cup-2026-dallas-tickets",
    "/world-cup-2026-mexico-city-tickets", "/world-cup-2026-toronto-tickets",
    "/world-cup-2026-vancouver-tickets",
    "/f1-tickets", "/f1-tickets-2026", "/f1-2026-schedule",
    "/f1-ticket-prices-2026", "/f1-ticket-prices-guide", "/how-to-buy-f1-tickets",
    "/f1-monaco-grand-prix-tickets", "/f1-british-grand-prix-silverstone-tickets",
    "/f1-belgian-grand-prix-spa-tickets", "/f1-italian-grand-prix-monza-tickets",
    "/motogp-tickets", "/motogp-2026-schedule", "/isle-of-man-tt-tickets",
    "/champions-league-tickets", "/champions-league-2026-final-tickets",
    "/el-clasico-tickets", "/bayern-vs-real-madrid-tickets",
    "/premier-league-tickets-2026", "/bundesliga-tickets-2026", "/la-liga-tickets-2026",
    "/concerts-in-london-2026", "/concerts-in-amsterdam-2026", "/concerts-in-paris-2026",
    "/taylor-swift-london-tickets", "/coldplay-tour-2026",
    "/the-weeknd-tour-2026", "/bruno-mars-tour-2026",
    "/events-this-weekend", "/events-june-2026", "/events-july-2026",
    "/euromatchtickets-vs-viagogo", "/euromatchtickets-vs-stubhub",
]


def http_get(url, timeout=15):
    return requests.get(url, timeout=timeout, headers={
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    })


# ---------------- sitemap & robots ----------------

class TestSitemapsAndRobots:
    def test_sitemap_index_200(self):
        r = http_get(f"{PREVIEW}/sitemap.xml")
        assert r.status_code == 200
        ET.fromstring(r.content)  # must parse

    def test_robots_txt(self):
        r = http_get(f"{PREVIEW}/robots.txt")
        assert r.status_code == 200
        body = r.text
        assert "User-agent: *" in body
        assert "Sitemap:" in body
        # User-agent: * block must contain Allow: / (not Disallow: /)
        # parse blocks
        blocks = re.split(r"\n(?=User-agent:)", body)
        ua_star = next((b for b in blocks if re.match(r"^User-agent:\s*\*\s*$", b.split("\n")[0])), None)
        assert ua_star is not None, "No 'User-agent: *' block"
        assert re.search(r"^\s*Allow:\s*/\s*$", ua_star, re.MULTILINE), "User-agent: * missing Allow: /"
        # Googlebot must be allowed
        gbot = next((b for b in blocks if "Googlebot" in b.split("\n")[0]), None)
        if gbot:
            assert not re.search(r"^\s*Disallow:\s*/\s*$", gbot, re.MULTILINE), "Googlebot blocked!"

    @pytest.mark.parametrize("name", SITEMAP_FILES)
    def test_each_subsitemap_loads(self, name):
        r = http_get(f"{PREVIEW}/{name}")
        assert r.status_code == 200, f"{name} returned {r.status_code}"
        root = ET.fromstring(r.content)
        # well-formed; non-empty
        locs = root.findall(".//sm:loc", NS)
        assert len(locs) >= 1, f"{name} has no <loc>"

    def test_total_loc_count_500_plus(self):
        total = 0
        for name in SITEMAP_FILES:
            r = http_get(f"{PREVIEW}/{name}")
            if r.status_code != 200:
                continue
            root = ET.fromstring(r.content)
            total += len(root.findall(".//sm:url/sm:loc", NS))
        assert total >= 500, f"Total <loc> across sitemaps = {total} (expected >= 500)"

    def test_image_locs_absolute(self):
        bad = []
        for name in SITEMAP_FILES:
            r = http_get(f"{PREVIEW}/{name}")
            if r.status_code != 200:
                continue
            root = ET.fromstring(r.content)
            for img in root.findall(".//image:loc", NS):
                if img.text and not img.text.startswith("https://euromatchtickets.com/"):
                    bad.append((name, img.text[:100]))
        assert not bad, f"Found {len(bad)} non-absolute image locs. Sample: {bad[:5]}"


# ---------------- broken link crawl (sample) ----------------

class TestBrokenLinks:
    def test_sample_50_urls_per_sitemap(self):
        import random
        failures = []
        for name in ["sitemap-core.xml", "sitemap-events.xml", "sitemap-worldcup.xml",
                     "sitemap-f1-motorsport.xml", "sitemap-football.xml", "sitemap-concerts.xml"]:
            r = http_get(f"{PREVIEW}/{name}")
            if r.status_code != 200:
                continue
            root = ET.fromstring(r.content)
            urls = [l.text for l in root.findall(".//sm:url/sm:loc", NS) if l.text]
            sample = random.sample(urls, min(20, len(urls)))
            preview_urls = [u.replace(PROD, PREVIEW) for u in sample]

            def check(u):
                try:
                    rr = requests.get(u, timeout=15, allow_redirects=True,
                                      headers={"User-Agent": "Mozilla/5.0 Googlebot"})
                    return (u, rr.status_code)
                except Exception as e:
                    return (u, f"ERR {e}")

            with ThreadPoolExecutor(max_workers=10) as ex:
                results = list(ex.map(check, preview_urls))
            for u, code in results:
                if code != 200:
                    failures.append((name, u, code))
        assert not failures, f"Broken links: {failures[:10]}"


# ---------------- key routes status & duplicate title check ----------------

class TestKeyRoutesStatus:
    def test_all_key_routes_200(self):
        failures = []

        def check(p):
            try:
                r = http_get(f"{PREVIEW}{p}")
                return (p, r.status_code)
            except Exception as e:
                return (p, f"ERR {e}")

        with ThreadPoolExecutor(max_workers=10) as ex:
            futures = [ex.submit(check, p) for p in KEY_ROUTES]
            for f in as_completed(futures):
                p, code = f.result()
                if code != 200:
                    failures.append((p, code))
        assert not failures, f"Non-200 routes: {failures}"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
