"""
GLOBAL CTR Cleanup v4 (per user feedback Apr 28 evening):

User mandates these changes EVERYWHERE on the site (not just homepage):

1. Buy CTAs → View / Check availability:
     "Buy from €X"        → "View from €X"
     "Buy Now"            → "View"
     "Buy Tickets"        → "View Tickets"
     "BUY SPA F1 TICKETS" → "VIEW SPA F1 TICKETS"

2. Inventory copy → marketplace tone:
     "X tickets available" → "X listings available"
     "X tickets remaining" → "X listings · prices updated recently"

3. Strip fake urgency (these conflict with marketplace tone unless tied to live data):
     "X people viewing this now"
     "X people booked this today"
     "LOW STOCK"

4. Strip remaining overclaims on F1 / Spa pages:
     "CHEAPEST!"
     "Save 42% vs competitors"  / "Save €X"
     "500K+ TICKETS SOLD"
     "HIGHLY RATED FROM 1 REVIEWS"
     "cheapest" / "Cheapest"
     "Highly rated from 1 verified customer reviews"

The script preserves React JSX and string literal boundaries; it only touches
USER-FACING text (button labels, headings, copy strings) — never code identifiers.
"""
import re
from pathlib import Path

PAGES = Path("/app/frontend/src/pages")
COMPS = Path("/app/frontend/src/components")


# Order matters — replace LONGER patterns FIRST so we don't break shorter ones.
SUBS = [
    # --- 1. Buy → View ---
    (re.compile(r"\bBuy from \u20ac"), "View from €"),
    (re.compile(r"\bBuy from €"), "View from €"),
    (re.compile(r"\bbuy from \u20ac"), "view from €"),
    (re.compile(r"\bbuy from €"), "view from €"),
    (re.compile(r"\bBuy Tickets\b"), "View Tickets"),
    (re.compile(r"\bBUY TICKETS\b"), "VIEW TICKETS"),
    (re.compile(r"\bBuy Now\b"), "View"),
    (re.compile(r"\bBUY NOW\b"), "VIEW"),
    (re.compile(r"\bBUY SPA F1 TICKETS\b"), "VIEW SPA F1 TICKETS"),
    (re.compile(r"\bBuy Spa F1 Tickets\b"), "View Spa F1 Tickets"),
    (re.compile(r"\bBuy World Cup Tickets\b"), "View World Cup Tickets"),
    (re.compile(r"\bBUY WORLD CUP TICKETS\b"), "VIEW WORLD CUP TICKETS"),

    # --- 2. Inventory copy → marketplace tone ---
    # "X tickets available" → "X listings available"
    (re.compile(r"\b(\d[\d,]*) tickets available\b"), r"\1 listings available"),
    (re.compile(r"\b(\d[\d,]*) tickets remaining\b"), r"\1 listings · prices updated recently"),
    (re.compile(r"\btickets available · "), "listings available · "),
    (re.compile(r"\btickets currently listed\b"), "listings currently available"),

    # --- 3. Fake urgency strips ---
    (re.compile(r"\b\d+ people viewing this now\b"), ""),
    (re.compile(r"\b\d+ people booked this today\b"), ""),
    (re.compile(r"\bLIVE: \d+ VIEWING\b"), ""),
    (re.compile(r"\bLOW STOCK\b"), ""),

    # --- 4. Overclaim strips on F1/Spa/etc pages ---
    (re.compile(r"\bCHEAPEST!?\b"), "AVAILABLE"),
    (re.compile(r"\bcheapest Spa F1 tickets in Europe\b", re.IGNORECASE), "verified Spa F1 listings"),
    (re.compile(r"\bcheapest F1 Spa tickets in Europe\b", re.IGNORECASE), "verified F1 Spa listings"),
    (re.compile(r"\bSave \d+% vs competitors\b"), ""),
    (re.compile(r"\bSave \u20ac\d[\d.,]*\b"), ""),
    (re.compile(r"\bSave €\d[\d.,]*\b"), ""),
    (re.compile(r"\b500K\+ TICKETS SOLD\b"), ""),
    (re.compile(r"\b500,000\+ fans choose EuroMatchTickets\b"), "fans across Europe use EuroMatchTickets"),
    (re.compile(r"\bHIGHLY RATED FROM \d+ REVIEWS?\b"), ""),
    (re.compile(r"\bHighly rated from \d+ verified customer reviews?\b"), ""),
    (re.compile(r"\bup to Competitive market pricing than buying from F1\.com directly\b"), "with secondary-market pricing — independent of F1.com"),
    (re.compile(r"\bCompetitive market pricing than official F1 ticket prices\b"), "Secondary-market pricing — independent of official channels"),
    (re.compile(r"\bCompetitive market pricing than official channels\b"), "Secondary-market pricing — independent of official channels"),
    (re.compile(r"\bThat's 42% savings\.\b"), ""),
    # Specific lines that mix overclaims into longer sentences
    (re.compile(r"\bBuy the cheapest Spa F1 tickets in Europe\.\s*"), ""),
]


# Files we deliberately skip (test fixtures or scripts referencing the patterns)
SKIP_NAMES = {"ProductSchema.jsx"}


def apply_subs(src: str) -> tuple[str, int]:
    new = src
    n = 0
    for pat, repl in SUBS:
        new, count = pat.subn(repl, new)
        n += count
    return new, n


def process_file(path: Path) -> int:
    if path.name in SKIP_NAMES:
        return 0
    original = path.read_text()
    new, n = apply_subs(original)
    if n > 0 and new != original:
        path.write_text(new)
    return n


def main():
    total_files = 0
    total_subs = 0
    for d in [PAGES, COMPS]:
        for p in d.rglob("*.jsx"):
            n = process_file(p)
            if n:
                total_files += 1
                total_subs += n
                print(f"  [v4 ] {p.relative_to(Path('/app/frontend/src'))}  ({n})")
    print(f"\nDone. Modified {total_files} files, {total_subs} substitutions.")


if __name__ == "__main__":
    main()
