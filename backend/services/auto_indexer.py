"""
Auto-Indexing Engine for EuroMatchTickets
==========================================
Automatically regenerates sitemaps and submits to search engines
whenever pages are created/updated. Runs as a background service.
"""

import os
import subprocess
import logging
import requests
from datetime import datetime, timezone
from xml.etree import ElementTree as ET

logger = logging.getLogger(__name__)

SITE = "https://euromatchtickets.com"
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "dd91242c079d4538a9ae74378aaad957")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
PUBLIC_DIR = os.path.join(ROOT_DIR, "frontend", "public")

INDEXNOW_ENDPOINTS = [
    ("Bing", "https://www.bing.com/indexnow"),
    ("Yandex", "https://yandex.com/indexnow"),
]

GOOGLE_PING_URL = "https://www.google.com/ping?sitemap="
BING_PING_URL = "https://www.bing.com/ping?sitemap="


def collect_sitemap_urls():
    """Collect ALL URLs from all sitemap XML files."""
    urls = []
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for fn in sorted(os.listdir(PUBLIC_DIR)):
        if fn.startswith("sitemap-") and fn.endswith(".xml"):
            try:
                tree = ET.parse(os.path.join(PUBLIC_DIR, fn))
                for loc in tree.getroot().findall("s:url/s:loc", ns):
                    if loc.text:
                        urls.append(loc.text.strip())
            except ET.ParseError:
                pass
    return urls


def regenerate_sitemaps():
    """Run the sitemap generation script."""
    try:
        gen_script = os.path.join(ROOT_DIR, "generate_sitemaps.py")
        python_paths = ["/root/.venv/bin/python3", "python3", "python"]
        python_bin = None
        for p in python_paths:
            if os.path.exists(p):
                python_bin = p
                break
        if not python_bin:
            import sys
            python_bin = sys.executable
        
        if not os.path.exists(gen_script):
            logger.warning(f"Auto-Index: Sitemap script not found at {gen_script}, using API sitemaps only")
            return True
        
        result = subprocess.run(
            [python_bin, gen_script],
            capture_output=True, text=True, timeout=120,
            cwd=ROOT_DIR,
            env={**os.environ, "PYTHONPATH": ROOT_DIR}
        )
        if result.returncode == 0:
            logger.info("Auto-Index: Sitemaps regenerated successfully")
            return True
        else:
            logger.error(f"Auto-Index: Sitemap gen stderr: {result.stderr[:1000]}")
            logger.error(f"Auto-Index: Sitemap gen stdout: {result.stdout[:200]}")
            return False
    except Exception as e:
        logger.error(f"Auto-Index: Sitemap generation error: {e}")
        return False


def submit_to_indexnow(urls=None):
    """Submit URLs to Bing and Yandex via IndexNow."""
    if urls is None:
        urls = collect_sitemap_urls()

    if not urls:
        logger.warning("Auto-Index: No URLs to submit")
        return {}

    results = {}
    for name, endpoint in INDEXNOW_ENDPOINTS:
        try:
            for i in range(0, len(urls), 10000):
                batch = urls[i:i+10000]
                r = requests.post(endpoint, json={
                    "host": "euromatchtickets.com",
                    "key": INDEXNOW_KEY,
                    "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
                    "urlList": batch
                }, headers={"Content-Type": "application/json"}, timeout=30)
                results[name] = {
                    "status": r.status_code,
                    "accepted": r.status_code in [200, 202],
                    "urls": len(batch)
                }
                logger.info(f"Auto-Index: {name} → {r.status_code} ({len(batch)} URLs)")
        except Exception as e:
            results[name] = {"status": "error", "error": str(e)}
            logger.error(f"Auto-Index: {name} error: {e}")

    return results


def ping_search_engines():
    """Ping Google and Bing about sitemap updates."""
    sitemap_url = f"{SITE}/sitemap.xml"
    results = {}
    for name, ping_url in [("Google", GOOGLE_PING_URL), ("Bing", BING_PING_URL)]:
        try:
            r = requests.get(f"{ping_url}{sitemap_url}", timeout=10)
            results[name] = {"status": r.status_code}
            logger.info(f"Auto-Index: Pinged {name} → {r.status_code}")
        except Exception as e:
            results[name] = {"status": "error"}
    return results


def full_reindex():
    """Complete reindex: regenerate sitemaps → submit to IndexNow → ping engines."""
    logger.info("Auto-Index: Starting full reindex...")
    start = datetime.now(timezone.utc)

    sitemap_ok = regenerate_sitemaps()
    if not sitemap_ok:
        return {"success": False, "error": "Sitemap generation failed"}

    urls = collect_sitemap_urls()
    indexnow_results = submit_to_indexnow(urls)
    ping_results = ping_search_engines()

    duration = (datetime.now(timezone.utc) - start).total_seconds()
    result = {
        "success": True,
        "urls_count": len(urls),
        "indexnow": indexnow_results,
        "ping": ping_results,
        "duration_seconds": round(duration, 1),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    logger.info(f"Auto-Index: Complete! {len(urls)} URLs indexed in {duration:.1f}s")
    return result


def submit_specific_urls(url_list):
    """Submit specific new/updated URLs immediately."""
    if not url_list:
        return {}
    logger.info(f"Auto-Index: Submitting {len(url_list)} specific URLs...")
    return submit_to_indexnow(url_list)
