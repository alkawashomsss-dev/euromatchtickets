"""
overclaim_sweep.py — final pass to delete/soften claims flagged in iter64
user review. Targets:
  - "100% Money Back/Money-Back Guarantee"
  - "100% secure"
  - "100% 5-star reviews"
  - "100% Verified Purchases"
  - inflated review counts (12,000+, 2,940, 4.9/5)
  - "biggest football event ever"
Idempotent.
"""

from pathlib import Path
import sys

FRONTEND = Path("/app/frontend/src")
INDEX_HTML = Path("/app/frontend/public/index.html")

REPLACEMENTS = [
    # 100% claims
    ("100% Money Back Guarantee",                 "Refund policy applies"),
    ("100% Money Back",                           "Refund policy"),
    ("100% Money-Back Guarantee",                 "Refund policy applies"),
    ("100% Money-Back",                           "Refund policy"),
    ("100% money-back guarantee",                 "refund policy applies"),
    ("100% money-back",                           "refund policy"),
    ("100% Refund",                               "Refund policy"),
    ("100% refund",                               "refund policy"),
    ("100% secure",                               "Secure checkout"),
    ("100% Secure",                               "Secure checkout"),
    ("100% 5-Star Reviews",                       "Highly rated"),
    ("100% Verified Purchases",                   "Verified transactions"),
    ("100% verified purchases",                   "verified transactions"),
    ("100% guaranteed",                           "covered by our refund policy"),

    # Inflated review counts
    ("12,000+ fans",                              "our community"),
    ("12,000+ Reviews",                           "Customer reviews"),
    ("12,000+ reviews",                           "customer reviews"),
    ("12,000+ verified buyers",                   "verified customers"),
    ("12,000+ sellers",                           "verified sellers"),
    ("12,000+ Active Sellers",                    "Active Sellers"),
    ("12,000+",                                   ""),
    ("2,940 Total Reviews",                       "Customer reviews"),
    ("2.940 Total Reviews",                       "Customer reviews"),
    ("5.0 Average Rating",                        "Customer reviews"),
    ("Average Rating",                            "Customers"),
    ("Total Reviews",                             "Published reviews"),
    ("5-Star Reviews",                            "Positive reviews"),
    ("4.9/5 from",                                "Highly rated from"),
    ("4.9/5 rating",                              "Highly rated"),
    ("4.9/5",                                     ""),
    ("4.8/5 rating",                              "Highly rated"),
    ("4.8/5",                                     ""),

    # Hero hyperbole
    ("biggest football event ever",               "FIFA World Cup 2026"),
    ("the biggest concert production",            "a major concert production"),

    # CTA spam diversification
    ("BUY WORLD CUP TICKETS",                     "VIEW WORLD CUP TICKETS"),
    ("BUY NOW",                                   "VIEW AVAILABILITY"),
    ("Buy Tickets Now",                           "Check Availability"),
    ("Buy Now!",                                  "View Availability"),

    # Footer line  
    ("All purchases covered by",                  "Refund policy applies — see"),
]


def sweep(path: Path) -> int:
    try:
        t = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return 0
    orig = t
    for old, new in REPLACEMENTS:
        if old in t:
            t = t.replace(old, new)
    if t != orig:
        path.write_text(t, encoding="utf-8")
        return 1
    return 0


def main() -> int:
    changed = 0
    for p in sorted(FRONTEND.rglob("*.jsx")):
        changed += sweep(p)
    for p in sorted(FRONTEND.rglob("*.js")):
        changed += sweep(p)
    if INDEX_HTML.exists():
        changed += sweep(INDEX_HTML)
    print(f"[overclaim_sweep] Updated {changed} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
