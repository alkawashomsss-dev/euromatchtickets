"""
Sitemap & Auto-Indexing Routes
===============================
Handles sitemap regeneration, IndexNow submission, and auto-indexing.
Any page change triggers automatic reindexing.
"""

from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import Response
import os
from datetime import datetime, timezone
from xml.etree import ElementTree as ET

from services.auto_indexer import (
    full_reindex,
    submit_specific_urls,
    collect_sitemap_urls,
    regenerate_sitemaps,
    submit_to_indexnow,
    ping_search_engines,
)

router = APIRouter(prefix="/api")

SITE = "https://euromatchtickets.com"
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "dd91242c079d4538a9ae74378aaad957")
PUBLIC_DIR = "/app/frontend/public"


@router.post("/sitemap/regenerate")
async def regenerate_sitemaps_endpoint(background_tasks: BackgroundTasks):
    """Regenerate sitemaps AND auto-submit to search engines."""
    background_tasks.add_task(full_reindex)
    return {
        "status": "auto_reindex_started",
        "message": "Sitemaps regenerating + auto-submitting to Bing, Yandex, Google.",
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
    return {
        "sitemaps": files,
        "total_urls": total_urls,
        "total_sitemaps": len([f for f in files if f["file"] != "sitemap.xml"])
    }


@router.post("/indexnow/submit")
async def submit_indexnow(background_tasks: BackgroundTasks):
    """Submit ALL sitemap URLs to Bing/Yandex via IndexNow."""
    all_urls = collect_sitemap_urls()
    background_tasks.add_task(submit_to_indexnow, all_urls)
    return {
        "status": "submission_started",
        "total_urls": len(all_urls),
        "engines": ["Bing", "Yandex"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/indexnow/submit-urls")
async def submit_specific_urls_endpoint(urls: list[str]):
    """Submit specific URLs to IndexNow immediately."""
    if not urls or len(urls) > 10000:
        return {"error": "Provide 1-10000 URLs"}
    results = submit_specific_urls(urls)
    return {
        "urls_submitted": len(urls),
        "results": results,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/auto-index/full")
async def trigger_full_reindex(background_tasks: BackgroundTasks):
    """Trigger a complete reindex: sitemaps + IndexNow + ping engines."""
    background_tasks.add_task(full_reindex)
    return {
        "status": "full_reindex_started",
        "message": "Regenerating sitemaps → submitting to IndexNow (Bing+Yandex) → pinging Google. Check /api/sitemap/status for results.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/auto-index/ping")
async def trigger_ping(background_tasks: BackgroundTasks):
    """Ping Google and Bing about sitemap updates."""
    background_tasks.add_task(ping_search_engines)
    return {
        "status": "ping_started",
        "engines": ["Google", "Bing"],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
