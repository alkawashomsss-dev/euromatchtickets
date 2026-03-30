"""
Dynamic sitemap routes — regeneration, status, and IndexNow submission.
"""

from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import Response
import subprocess, os, requests
from datetime import datetime, timezone
from xml.etree import ElementTree as ET

router = APIRouter(prefix="/api")

SITE = "https://euromatchtickets.com"
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "dd91242c079d4538a9ae74378aaad957")
PUBLIC_DIR = "/app/frontend/public"


def _collect_sitemap_urls():
    """Collect all URLs from static sitemap XML files."""
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


@router.post("/sitemap/regenerate")
async def regenerate_sitemaps(background_tasks: BackgroundTasks):
    """Trigger full sitemap regeneration in background."""
    def _run():
        subprocess.run(["python3", "/app/generate_sitemaps.py"], capture_output=True, timeout=120)

    background_tasks.add_task(_run)
    return {
        "status": "regeneration_started",
        "message": "Sitemaps regenerating. Check /api/sitemap/status in ~30s.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/sitemap/status")
async def sitemap_status():
    """Show sitemap files, sizes, and URL counts."""
    files = []
    total_urls = 0
    for fn in sorted(os.listdir(PUBLIC_DIR)):
        if fn.startswith("sitemap") and fn.endswith(".xml"):
            fpath = os.path.join(PUBLIC_DIR, fn)
            size_kb = os.path.getsize(fpath) / 1024
            with open(fpath) as f:
                content = f.read()
            url_count = content.count("<loc>")
            if fn != "sitemap.xml":
                total_urls += url_count
            files.append({
                "file": fn,
                "size_kb": round(size_kb, 1),
                "url_count": url_count,
                "last_modified": datetime.fromtimestamp(
                    os.path.getmtime(fpath), tz=timezone.utc
                ).isoformat()
            })
    return {"sitemaps": files, "total_urls": total_urls, "total_sitemaps": len([f for f in files if f["file"] != "sitemap.xml"])}


@router.post("/indexnow/submit")
async def submit_indexnow(background_tasks: BackgroundTasks):
    """Submit ALL sitemap URLs to Bing/Yandex via IndexNow protocol."""
    all_urls = _collect_sitemap_urls()

    def _submit():
        results = {}
        endpoints = [
            ("IndexNow", "https://api.indexnow.org/indexnow"),
            ("Bing", "https://www.bing.com/indexnow"),
            ("Yandex", "https://yandex.com/indexnow"),
        ]
        for name, endpoint in endpoints:
            # IndexNow allows up to 10,000 per batch
            for i in range(0, len(all_urls), 10000):
                batch = all_urls[i:i+10000]
                try:
                    r = requests.post(endpoint, json={
                        "host": "euromatchtickets.com",
                        "key": INDEXNOW_KEY,
                        "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
                        "urlList": batch
                    }, headers={"Content-Type": "application/json"}, timeout=30)
                    results[name] = {"status": r.status_code, "urls_submitted": len(batch)}
                except Exception as e:
                    results[name] = {"status": "error", "error": str(e)}

    background_tasks.add_task(_submit)
    return {
        "status": "submission_started",
        "total_urls": len(all_urls),
        "key": INDEXNOW_KEY[:12] + "...",
        "engines": ["IndexNow (All)", "Bing", "Yandex"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/indexnow/submit-urls")
async def submit_specific_urls(urls: list[str]):
    """Submit specific URLs to IndexNow immediately (synchronous)."""
    if not urls or len(urls) > 10000:
        return {"error": "Provide 1-10000 URLs"}

    results = {}
    endpoints = [
        ("Bing", "https://www.bing.com/indexnow"),
        ("Yandex", "https://yandex.com/indexnow"),
    ]
    for name, endpoint in endpoints:
        try:
            r = requests.post(endpoint, json={
                "host": "euromatchtickets.com",
                "key": INDEXNOW_KEY,
                "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
                "urlList": urls
            }, headers={"Content-Type": "application/json"}, timeout=30)
            results[name] = {"status": r.status_code, "accepted": r.status_code in [200, 202]}
        except Exception as e:
            results[name] = {"status": "error", "error": str(e)}

    return {
        "urls_submitted": len(urls),
        "results": results,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
