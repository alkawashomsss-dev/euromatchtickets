"""
Dynamic sitemap routes — regeneration endpoint + API-based sitemap serving.
"""

from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import Response
import subprocess, os
from datetime import datetime, timezone

router = APIRouter(prefix="/api")


@router.post("/sitemap/regenerate")
async def regenerate_sitemaps(background_tasks: BackgroundTasks):
    """Trigger full sitemap regeneration. Runs in background."""
    def _run():
        subprocess.run(["python3", "/app/generate_sitemaps.py"], capture_output=True, timeout=120)

    background_tasks.add_task(_run)
    return {
        "status": "regeneration_started",
        "message": "Sitemaps are being regenerated in the background. Check /sitemap.xml in ~30 seconds.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.get("/sitemap/status")
async def sitemap_status():
    """Show current sitemap files and their sizes."""
    public_dir = "/app/frontend/public"
    files = []
    total_urls = 0
    for fn in sorted(os.listdir(public_dir)):
        if fn.startswith("sitemap") and fn.endswith(".xml"):
            fpath = os.path.join(public_dir, fn)
            size_kb = os.path.getsize(fpath) / 1024
            # Count URLs
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
