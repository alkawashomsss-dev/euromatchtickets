"""
Export SEO pages from preview DB and import to production via API.
Run this AFTER deploying the new code to production.
"""
import json
import requests
from pymongo import MongoClient

PRODUCTION_API = "https://euromatchtickets.onrender.com/api"
BATCH_SIZE = 50

def export_and_sync():
    # Connect to local preview DB
    client = MongoClient("mongodb://localhost:27017")
    db = client["euromatchtickets"]
    
    # Get all active SEO pages (skip _id)
    pages = list(db.seo_pages.find({"active": True}, {"_id": 0}))
    print(f"Found {len(pages)} active pages to sync")
    
    # Convert datetime objects to strings
    for page in pages:
        for key, val in page.items():
            if hasattr(val, 'isoformat'):
                page[key] = val.isoformat()
    
    # Send in batches
    total_imported = 0
    for i in range(0, len(pages), BATCH_SIZE):
        batch = pages[i:i+BATCH_SIZE]
        try:
            resp = requests.post(
                f"{PRODUCTION_API}/seo/bulk-import",
                json={"pages": batch},
                timeout=60
            )
            result = resp.json()
            imported = result.get("imported", 0)
            total_imported += imported
            print(f"  Batch {i//BATCH_SIZE + 1}: {imported} pages imported (total: {total_imported})")
        except Exception as e:
            print(f"  Batch {i//BATCH_SIZE + 1} FAILED: {e}")
    
    print(f"\nDone! Total imported: {total_imported}/{len(pages)}")
    
    # Verify
    try:
        resp = requests.get(f"{PRODUCTION_API}/seo/indexing-status")
        print(f"Production status: {resp.json()}")
    except:
        pass

if __name__ == "__main__":
    export_and_sync()
