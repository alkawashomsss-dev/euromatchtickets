"""
honesty_sweep.py — Bulk cleanup of fake marketing language across SEO pages.

Applies safe string replacements in /app/frontend/src/pages/*.jsx.
Idempotent: re-running it is a no-op.

Categories:
  A) "Save €X vs official" / "X% cheaper" / "Cheapest" claims
  B) "Europe's #1 / 500,000+ tickets / 100% Guarantee / 2M+ / 12,847 reviews"
  C) "FanProtect" overclaim (kept once as "Buyer protection")
  D) "Instant QR Delivery" overclaim (kept once as "QR ticket delivery")
"""

import os
import re
import sys
from pathlib import Path

PAGES_DIR = Path("/app/frontend/src/pages")

# Ordered (longest/most-specific first) pattern -> replacement.
# Only plain-text swaps; no regex groupings to minimize risk.
TEXT_REPLACEMENTS = [
    # ──────── A) Savings / competitor comparisons ────────
    ("100% money-back guarantee",               "cancellation refund policy"),
    ("100% Money-Back Guarantee",               "Cancellation refund policy"),
    ("FanProtect guarantee",                    "Buyer protection"),
    ("FanProtect Guarantee",                    "Buyer protection"),
    ("FanProtect 100% Money-Back Guarantee",    "Buyer protection"),
    ("FanProtect",                              "Buyer protection"),

    ("Cheapest Prices Online",                  "Tickets on EuroMatchTickets"),
    ("Cheapest Prices",                         "Verified Listings"),
    ("cheapest prices in Europe",               "listings on EuroMatchTickets"),
    ("cheapest prices in europe",               "listings on EuroMatchTickets"),
    ("cheapest prices online",                  "listings on EuroMatchTickets"),
    ("cheapest place to buy",                   "European marketplace for"),
    ("cheapest verified tickets",               "verified-seller listings"),
    ("cheapest ticket shop",                    "ticket marketplace"),
    ("Cheapest",                                "Verified"),

    ("Best prices guaranteed!",                 "Market pricing may vary."),
    ("Best Price Guarantee",                    "Market-based pricing"),
    ("Best prices guaranteed",                  "Market pricing may vary"),

    ("Save up to 55%",                          "Verified-seller listings"),
    ("42% cheaper than F1.com",                 "Market-based pricing"),
    ("42% cheaper",                             "Competitive market pricing"),
    ("55% cheaper than F1.com",                 "Market-based pricing"),
    ("55% cheaper",                             "Competitive market pricing"),
    ("vs official sellers",                     "(market pricing may vary)"),
    ("vs official",                             "(market pricing may vary)"),
    ("vs F1.com",                               "(market pricing may vary)"),

    # ──────── B) Overclaiming ────────
    ("Europe's #1 official alternative ticket marketplace", "European ticket marketplace"),
    ("Europe's #1 trusted ticket marketplace", "European ticket marketplace"),
    ("Europe's #1 Ticket Marketplace",         "European Ticket Marketplace"),
    ("Europe's #1",                            "European"),
    ("#1 trusted",                             "trusted"),
    ("#1 Ticket",                              "Ticket"),
    ("500,000+ tickets sold",                  "Verified seller inventory"),
    ("500K+ tickets sold",                     "Verified seller inventory"),
    ("2M+ Tickets Sold",                       "Verified sellers"),
    ("2M+ tickets sold",                       "Verified sellers"),
    ("12,847 reviews",                         "customer reviews"),
    ("12,847 happy customers",                 "customer reviews"),
    ("2,847 reviews",                          "customer reviews"),
    ("2,847",                                  ""),   # stray occurrences
    ("2,940+ REVIEWS",                         "CUSTOMER REVIEWS"),
    ("2,940+ reviews",                         "customer reviews"),
    ("from 2,940+",                            "from customers"),
    ("50,000+ Happy Fans",                     "Customer reviews"),
    ("50,000+ happy fans",                     "Verified marketplace"),
    ("50,000+ Fans",                           "Our fans"),
    ("100,000+ tickets",                       "Verified listings"),
    ("346 offers",                             ""),
    ("Official Partner",                       "Marketplace"),
    ("OFFICIAL PARTNER",                       "MARKETPLACE"),

    ("100% Guarantee",                         "Buyer protection"),
    ("100% GUARANTEE",                         "BUYER PROTECTION"),
    ("100% Buyer Protection",                  "Buyer protection"),
    ("100% BUYER PROTECTION",                  "BUYER PROTECTION"),
    ("100% guaranteed",                        "secured by our refund policy"),
    ("100% money-back",                        "cancellation refund"),
    ("100% Verified Tickets",                  "Verified Tickets"),
    ("100% verified tickets",                  "Verified-seller listings"),
    ("100% Verified",                          "Verified"),
    ("100% verified",                          "verified"),

    # ──────── C) QR Delivery overclaim ────────
    ("Instant QR Delivery",                    "QR ticket delivery"),
    ("instant QR delivery",                    "QR ticket delivery"),
    ("INSTANT QR DELIVERY",                    "QR TICKET DELIVERY"),
    ("Instant Delivery",                       "QR delivery"),

    # ──────── D) 24/7 / SSL ────────
    ("SSL ENCRYPTED",                          "ENCRYPTED"),
    ("SSL Encrypted",                          "Encrypted"),
    ("SSL encrypted",                          "encrypted"),
    ("24/7 Support",                           "Customer support"),
    ("24/7 SUPPORT",                           "CUSTOMER SUPPORT"),

    # ──────── E) Hardcoded price anchors we want neutralized in copy ────────
    ("Best prices guaranteed",                 "Market pricing may vary"),
]


def process_file(path: Path) -> int:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return 0
    original = text
    for needle, repl in TEXT_REPLACEMENTS:
        if needle in text:
            text = text.replace(needle, repl)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return 1
    return 0


def main() -> int:
    if not PAGES_DIR.exists():
        print(f"[honesty_sweep] Pages dir not found: {PAGES_DIR}")
        return 1
    changed_files = []
    for path in sorted(PAGES_DIR.glob("*.jsx")):
        if process_file(path):
            changed_files.append(path.name)
    # Also sweep components dir, but only the landing-page helpers.
    extra_dirs = [Path("/app/frontend/src/components")]
    for d in extra_dirs:
        for path in sorted(d.glob("*.jsx")):
            if process_file(path):
                changed_files.append(f"components/{path.name}")
    print(f"[honesty_sweep] Updated {len(changed_files)} files:")
    for n in changed_files:
        print(f"  - {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
