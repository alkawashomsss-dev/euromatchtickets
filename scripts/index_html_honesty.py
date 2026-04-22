"""
index_html_honesty.py — Clean the giant `var M={...}` route-meta map inside
/app/frontend/public/index.html. The map hardcodes fake price anchors
('42% cheaper', 'from €109', 'FanProtect', 'Cheapest', etc) into every
route's title/description pair.

Strategy: Token-level string replacement on the whole file (case-sensitive
for the mixed-case and all-caps variants). This is safe because the file is
static HTML/JS with escaped literals — we never touch identifiers.

Idempotent.
"""

from pathlib import Path

INDEX = Path("/app/frontend/public/index.html")

REPLACEMENTS = [
    # Pricing-lie tokens
    ("42% cheaper than F1.com", "market pricing may vary"),
    ("42% cheaper than Ticketmaster", "market pricing may vary"),
    ("42% cheaper than competitors", "market pricing may vary"),
    ("42% cheaper than official", "market pricing may vary"),
    ("42% cheaper", "verified listings"),
    ("42% Off!", "Verified"),
    ("42% Off", "Verified"),
    ("40% cheaper than competitors", "market pricing may vary"),
    ("40% cheaper than official channels", "market pricing may vary"),
    ("55% cheaper than F1.com!", "market pricing may vary"),
    ("55% cheaper than F1.com", "market pricing may vary"),
    ("55% cheaper", "verified listings"),
    ("55% Off!", "Verified"),
    ("55% Off", "Verified"),
    ("30% below official", "market pricing may vary"),
    ("30% below", "verified"),
    ("5% Cheaper", "Verified"),
    ("Up to 42% cheaper", "Verified listings"),
    ("Cheapest F1 tickets", "Verified F1 listings"),
    ("Cheapest verified tickets", "Verified-seller listings"),
    ("Cheapest verified", "Verified"),
    ("Cheapest prices in Europe", "Verified European listings"),
    ("cheapest F1 tickets!", "F1 listings."),
    ("Cheapest prices", "Verified listings"),
    ("cheapest prices", "verified listings"),
    ("Cheapest F1 race!", "Verified listing."),
    ("the cheapest F1 race!", "the budget F1 race."),
    ("Cheapest. Instant QR delivery!", "Verified listings."),
    ("Cheapest online.", "Verified listings."),
    ("Cheapest online,", "Verified listings,"),
    ("Cheapest seats online", "Verified seat listings"),
    ("Cheapest, verified.", "Verified listings."),
    ("Cheapest. Verified.", "Verified listings."),
    ("Cheapest verified.", "Verified listings."),
    ("Cheapest", "Verified"),
    ("cheapest verified.", "verified listings."),
    ("cheapest verified", "verified"),
    ("cheapest", "verified"),
    ("Best prices", "Market pricing"),
    ("best prices", "market pricing"),

    # Overclaims
    ("500,000+ fans trust us", "Verified marketplace"),
    ("500,000+ fans", "Our community"),
    ("500+ events", "Events"),
    ("12,000+ reviews, 4.8/5 rating", "Customer reviews"),
    ("12,847 reviews", "customer reviews"),
    ("100% money-back guarantee", "cancellation refund policy"),
    ("100% Money-Back Guarantee", "Cancellation refund policy"),
    ("FanProtect money-back guarantee", "Buyer protection"),
    ("FanProtect guaranteed!", "Buyer protection."),
    ("FanProtect guaranteed", "Buyer protection"),
    ("FanProtect guarantee included.", "Buyer protection."),
    ("FanProtect guarantee!", "Buyer protection."),
    ("FanProtect guarantee.", "Buyer protection."),
    ("FanProtect guarantee", "Buyer protection"),
    ("FanProtect Guarantee", "Buyer protection"),
    ("FanProtect", "Buyer protection"),
    ("Europe\\u2019s #1", "European"),
    ("Europe's #1", "European"),
    ("Selling Fast", "Available"),
    ("selling fast", "available"),
    ("Prices rising", "Prices may vary"),
    ("prices rising", "prices may vary"),

    # CTA-urgency lies
    ("Book now at today's price", "Book in advance for choice"),
    ("book now at today's price", "book in advance for choice"),
    ("Almost Sold Out", "Limited Availability"),
    ("almost sold out", "limited availability"),
    ("Only 8 left", "Limited availability"),
    ("only 8 left", "limited availability"),
    ("Only 69 left", "Limited availability"),
    ("only 69 left", "limited availability"),
    ("90% Sold", "Available"),
    ("90% already sold", "available listings"),
    ("Last seats!", "Limited availability."),
    ("last seats!", "limited availability."),
    ("Last!", "Limited!"),
    ("Limited!", "Available"),
    ("Hurry!", "Book in advance."),
    ("hurry!", "book in advance."),
    ("Hurry", "Book"),
    ("No hidden fees", "Clear pricing"),
    ("Instant QR delivery", "QR ticket delivery"),
    ("instant QR delivery", "QR ticket delivery"),
    ("Instant delivery!", "QR delivery."),
    ("instant delivery!", "QR delivery."),
    ("Instant delivery", "QR delivery"),
    ("instant delivery", "QR delivery"),
    ("Instant QR!", "QR delivery."),
    ("instant QR!", "QR delivery."),

    # Inline descriptions
    ("Only verified sellers!", "Verified sellers only."),
    ("Only verified sellers.", "Verified sellers only."),
    ("only verified sellers!", "verified sellers only."),

    # Meta description token
    ("Europe's cheapest event ticket shop!", "European ticket marketplace."),
    ("Europe's cheapest verified ticket marketplace.", "European ticket marketplace."),
    ("Europe's cheapest event ticket shop", "European ticket marketplace"),
]


def main() -> int:
    text = INDEX.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != original:
        INDEX.write_text(text, encoding="utf-8")
        print("[index_html_honesty] Rewrote public/index.html")
    else:
        print("[index_html_honesty] No changes (already clean)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
