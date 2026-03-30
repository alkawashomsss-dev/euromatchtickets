"""
EuroMatchTickets — IndexNow Mass URL Submission
================================================
Submits ALL sitemap URLs to Bing/Yandex/Seznam via IndexNow protocol.
IndexNow allows up to 10,000 URLs per request with no daily quota limits.
"""

import requests, os, time
from xml.etree import ElementTree as ET

SITE = "https://euromatchtickets.com"
INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "dd91242c079d4538a9ae74378aaad957")
PUBLIC_DIR = "/app/frontend/public"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

# Also submit directly to Bing and Yandex
ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
]


def collect_all_urls():
    """Collect ALL URLs from all sitemap files."""
    urls = set()
    ns = {
        "s": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "si": "http://www.sitemaps.org/schemas/sitemap/0.9",
    }

    for fn in sorted(os.listdir(PUBLIC_DIR)):
        if fn.startswith("sitemap-") and fn.endswith(".xml"):
            fpath = os.path.join(PUBLIC_DIR, fn)
            try:
                tree = ET.parse(fpath)
                root = tree.getroot()
                for url_elem in root.findall("s:url/s:loc", ns):
                    if url_elem.text:
                        urls.add(url_elem.text.strip())
            except ET.ParseError:
                print(f"  WARNING: Could not parse {fn}")

    return sorted(urls)


def submit_batch(endpoint, urls_batch, batch_num, total_batches):
    """Submit a batch of URLs to an IndexNow endpoint."""
    payload = {
        "host": "euromatchtickets.com",
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
        "urlList": urls_batch
    }

    try:
        r = requests.post(
            endpoint,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        return r.status_code
    except Exception as e:
        return f"ERROR: {e}"


def main():
    print("=" * 65)
    print("  EuroMatchTickets — IndexNow Mass URL Submission")
    print("=" * 65)
    print(f"  Key: {INDEXNOW_KEY[:12]}...")
    print(f"  Key file: {SITE}/{INDEXNOW_KEY}.txt")
    print()

    # Collect all URLs
    all_urls = collect_all_urls()
    print(f"  Total URLs collected: {len(all_urls)}")
    print()

    # Submit in batches of 10,000 (IndexNow limit)
    BATCH_SIZE = 10000
    batches = [all_urls[i:i+BATCH_SIZE] for i in range(0, len(all_urls), BATCH_SIZE)]

    for endpoint in ENDPOINTS:
        engine = endpoint.split("//")[1].split("/")[0].split(".")[0]
        if engine == "api":
            engine = "IndexNow (All)"
        elif engine == "www":
            engine = "Bing"

        print(f"--- Submitting to {engine} ({endpoint}) ---")

        for i, batch in enumerate(batches):
            status = submit_batch(endpoint, batch, i+1, len(batches))
            status_msg = "ACCEPTED" if status in [200, 202] else f"Status {status}"
            print(f"  Batch {i+1}/{len(batches)}: {len(batch)} URLs → {status_msg}")

        print()
        time.sleep(1)  # Brief pause between engines

    # Summary
    print("=" * 65)
    print(f"  DONE: Submitted {len(all_urls)} URLs to 3 search engines")
    print(f"  Bing typically indexes within 24-48 hours after IndexNow")
    print("=" * 65)


if __name__ == "__main__":
    main()
