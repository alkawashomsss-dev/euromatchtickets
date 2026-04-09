#!/usr/bin/env python3
"""Fix ALL Hub/Page schemas to include image and validFrom fields"""
import os
import re

pages_dir = "/app/frontend/src/pages"
fixed_count = 0
files_fixed = []

for fname in os.listdir(pages_dir):
    if not fname.endswith('.jsx'):
        continue
    filepath = os.path.join(pages_dir, fname)
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Skip DynamicSEOPage (already fixed separately)
    if fname == 'DynamicSEOPage.jsx':
        continue
    
    original = content
    changes_made = False
    
    # Fix 1: Add "image" to SportsEvent/MusicEvent schemas that don't have it
    # Pattern: "@type": "SportsEvent" or "MusicEvent" followed by schema properties but no "image"
    # We add image right after the @type line
    
    # Find all schema objects with SportsEvent or MusicEvent
    # Add image field after the description line if not present
    if ('"SportsEvent"' in content or '"MusicEvent"' in content) and '"image"' not in content:
        # Add image after description in the event schema
        # Look for the pattern: "description": "...",
        # and add "image": "https://euromatchtickets.com/og-image.jpg", after it
        pattern = r'("@type":\s*"(?:Sports|Music)Event"[^}]*?"description":\s*"[^"]*")'
        def add_image(match):
            return match.group(1) + ',\n    "image": "https://euromatchtickets.com/og-image.jpg"'
        new_content = re.sub(pattern, add_image, content, count=1)
        if new_content != content:
            content = new_content
            changes_made = True
    
    # Fix 2: Add validFrom to AggregateOffer in Event schema
    # Pattern: "availability": "...", "url": "..."  } (end of offers for Event)
    # We need to find offers objects that don't have validFrom
    
    # Simple approach: find all offers objects and add validFrom if missing
    if '"AggregateOffer"' in content and '"validFrom"' not in content:
        # Add validFrom before the closing of each AggregateOffer
        # Pattern: "url": "https://euromatchtickets.com/..." }  (end of offers)
        content = re.sub(
            r'("url":\s*"https://euromatchtickets\.com/[^"]*"\s*})',
            r'"validFrom": "2025-01-01", \1',
            content
        )
        # Also handle cases where url is not the last field
        if '"validFrom"' not in content:
            # Try adding after availability
            content = re.sub(
                r'("availability":\s*"https://schema\.org/InStock")',
                r'\1, "validFrom": "2025-01-01"',
                content
            )
        changes_made = True
    
    # Fix 3: Add image to Product schema if missing
    if '"@type": "Product"' in content:
        # Check if Product schema has image
        # Find the Product schema block and add image if missing
        product_start = content.find('"@type": "Product"')
        if product_start > -1:
            # Find the closing of this schema object
            product_section = content[product_start:product_start+500]
            if '"image"' not in product_section:
                content = content[:product_start] + '"image": "https://euromatchtickets.com/og-image.jpg",\n    "@type": "Product"' + content[product_start + len('"@type": "Product"'):]
                changes_made = True
    
    if changes_made and content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        fixed_count += 1
        files_fixed.append(fname)
        print(f"✅ Fixed: {fname}")

print(f"\n=== Fixed {fixed_count} files ===")
for f in files_fixed:
    print(f"  - {f}")
