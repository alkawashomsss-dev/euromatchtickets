"""
Add `offers` field to all hand-written SportsEvent / Event schemas across the
SEO landing pages — placed just before the closing `}` (after all other fields)
so @context and @type remain first, and we don't break JSON validity.

Idempotent: if a schema already contains the exact `"offers"` key, it is left
alone. Removes any previously-injected malformed offers block at the start.
"""
import re
from datetime import date
from pathlib import Path

PAGES = Path("/app/frontend/src/pages")
TODAY = date.today().isoformat()
DOMAIN = "https://euromatchtickets.com"

# Per-page fallback URL paths (from current file slugs)
PAGE_URL = {
    "AbuDhabiGPPage.jsx": "/f1-abu-dhabi-grand-prix-tickets",
    "AustraliaGPPage.jsx": "/f1-australian-grand-prix-tickets",
    "AustriaGPPage.jsx": "/f1-austrian-grand-prix-tickets",
    "BahrainWorldCupPage.jsx": "/bahrain-world-cup-tickets-2026",
    "BayernRealMadridPage.jsx": "/bayern-vs-real-madrid-tickets",
    "ChampionsLeaguePage.jsx": "/champions-league-tickets",
    "F1SchedulePage.jsx": "/f1-2026-schedule",
    "HungaryGPPage.jsx": "/f1-hungarian-grand-prix-tickets",
    "IsleOfManTTPage.jsx": "/isle-of-man-tt-tickets",
    "JapanGPPage.jsx": "/f1-japanese-grand-prix-tickets",
    "LasVegasGPPage.jsx": "/f1-las-vegas-grand-prix-tickets",
    "MiamiGPPage.jsx": "/f1-miami-grand-prix-tickets",
    "MotoGPMugelloPage.jsx": "/motogp-mugello-tickets",
    "MotoGPTicketsPage.jsx": "/motogp-tickets",
    "SaudiGPPage.jsx": "/f1-saudi-arabian-grand-prix-tickets",
    "SilverstoneGPPage.jsx": "/f1-british-grand-prix-silverstone-tickets",
    "SingaporeGPPage.jsx": "/f1-singapore-grand-prix-tickets",
    "SpaGPPage.jsx": "/spa-f1-tickets",
    "SpainGPPage.jsx": "/f1-spanish-grand-prix-tickets",
    "SuperBowlPage.jsx": "/super-bowl-tickets",
    "WorldAthleticsPage.jsx": "/world-athletics-tickets",
    "WorldCup2026Page.jsx": "/world-cup-2026-tickets",
    "WorldCupLandingPage.jsx": "/world-cup-2026-tickets",
    "WorldCupPage.jsx": "/fifa-world-cup-tickets",
    "WorldCupRafflePage.jsx": "/world-cup-raffle",
    "ZandvoortGPPage.jsx": "/f1-dutch-grand-prix-tickets",
}

PRICE_HINTS = {
    "AbuDhabiGPPage.jsx": 169,  "AustraliaGPPage.jsx": 159,
    "AustriaGPPage.jsx": 119,   "BahrainWorldCupPage.jsx": 299,
    "BayernRealMadridPage.jsx": 199, "ChampionsLeaguePage.jsx": 85,
    "F1SchedulePage.jsx": 69,   "HungaryGPPage.jsx": 99,
    "IsleOfManTTPage.jsx": 149, "JapanGPPage.jsx": 189,
    "LasVegasGPPage.jsx": 249,  "MiamiGPPage.jsx": 249,
    "MotoGPMugelloPage.jsx": 99,"MotoGPTicketsPage.jsx": 69,
    "SaudiGPPage.jsx": 169,     "SilverstoneGPPage.jsx": 149,
    "SingaporeGPPage.jsx": 189, "SpaGPPage.jsx": 109,
    "SpainGPPage.jsx": 119,     "SuperBowlPage.jsx": 599,
    "WorldAthleticsPage.jsx": 59,"WorldCup2026Page.jsx": 150,
    "WorldCupLandingPage.jsx": 65,"WorldCupPage.jsx": 65,
    "WorldCupRafflePage.jsx": 0, "ZandvoortGPPage.jsx": 189,
}


def strip_previous_bad_offers(src: str) -> str:
    """Remove the malformed `"offers": { ... }` block that a previous run may
    have injected at the START of a schema object (before @context).

    Pattern to match (flexible whitespace):
        {\n        "offers": { ... },\n    "@context":
    We restore to just '{' followed by '    "@context":'.
    """
    pat = re.compile(
        r'\{\s*\n\s*"offers"\s*:\s*\{[^{}]*\}\s*,\s*\n(\s*"@context")',
        re.DOTALL,
    )
    return pat.sub(r'{\n\1', src)


def find_schema_blocks(src: str):
    """Find ranges of object literals that contain @type: SportsEvent/Event."""
    out = []
    for m in re.finditer(r'\n\s*const\s+\w+\s*=\s*\{', src):
        i = m.end() - 1
        depth = 0
        in_str = False
        str_ch = ""
        end = -1
        while i < len(src):
            c = src[i]
            if in_str:
                if c == "\\":
                    i += 2
                    continue
                if c == str_ch:
                    in_str = False
            else:
                if c in ('"', "'", "`"):
                    in_str = True
                    str_ch = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            i += 1
        if end == -1:
            continue
        body = src[m.end() - 1: end + 1]
        if ('"@type": "SportsEvent"' in body or '"@type":"SportsEvent"' in body
                or '"@type": "Event"' in body or '"@type":"Event"' in body):
            if '"offers"' not in body:
                out.append((m.end() - 1, end + 1, body))
    return out


def inject_offers(body: str, url: str, price: int) -> str:
    """Insert offers right before the final `}` of the top-level object."""
    offer_json = (
        f',\n    "offers": {{\n'
        f'      "@type": "Offer",\n'
        f'      "url": "{url}",\n'
        f'      "price": "{price}",\n'
        f'      "priceCurrency": "EUR",\n'
        f'      "availability": "https://schema.org/InStock",\n'
        f'      "validFrom": "{TODAY}"\n'
        f'    }}\n  '
    )
    # Find index of last '}' — that's the closer of the root object.
    end = len(body) - 1
    while end > 0 and body[end] != '}':
        end -= 1
    if end <= 0:
        return body
    before = body[:end].rstrip()
    # Remove trailing comma on the last field so JSON stays valid
    if before.endswith(','):
        before = before[:-1]
    return before + offer_json + body[end:]


def process_file(path: Path) -> int:
    src = path.read_text()
    # Step 1: strip any prior bad offers at start
    src = strip_previous_bad_offers(src)

    blocks = find_schema_blocks(src)
    if not blocks:
        # Write back even if no blocks (prior-strip may have been useful)
        path.write_text(src)
        return 0

    out = src
    url_path = PAGE_URL.get(path.name, f"/{path.stem.lower()}")
    url = DOMAIN + url_path
    price = PRICE_HINTS.get(path.name, 99)
    if price <= 0:
        path.write_text(src)
        return 0

    # Process from END → START so offsets stay valid
    for start, end, body in reversed(blocks):
        new_body = inject_offers(body, url, price)
        out = out[:start] + new_body + out[end:]
    path.write_text(out)
    return len(blocks)


def main():
    targets = list(PAGE_URL.keys())
    total_files = 0
    total_blocks = 0
    for name in targets:
        p = PAGES / name
        if not p.exists():
            print(f"  [skip] {name}")
            continue
        n = process_file(p)
        if n:
            total_files += 1
            total_blocks += n
            print(f"  [ok] {name}  ({n} block{'s' if n > 1 else ''})")
        else:
            print(f"  [already has offers] {name}")
    print(f"\nDone. Fixed offers in {total_blocks} blocks across {total_files} files.")


if __name__ == "__main__":
    main()
