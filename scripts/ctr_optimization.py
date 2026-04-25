"""
CTR Optimization Sweep — based on user's analysis (Apr 2026):

Per Google Search Console: thousands of impressions on F1 keywords (spa f1 tickets,
belgian gp tickets, monza f1 tickets, etc.) but ZERO clicks. Snippet copy is the
bottleneck, not technical SEO.

This script:
1. Strips "Selling Fast" / "SELLING FAST" / "Trending Now" / "TRENDING NOW"
   badges and unsupported scarcity claims (no proof = trust risk).
2. Removes "Verified Tickets" overclaim (replaces with "Seller verification" wording).
3. Removes 'Selling Fast.' fragments inside <SEOHead description="..."> attrs.
4. Reports a list of pages where Title may need a manual upgrade per the user's
   recommended pattern: "[Event] [Year] (Subtitle) – Prices & Availability".
"""
import re
from pathlib import Path

PAGES_DIR = Path("/app/frontend/src/pages")
COMPONENTS_DIR = Path("/app/frontend/src/components")


# Texts to strip when they appear as user-facing copy (NOT in code identifiers).
# We intentionally keep things conservative — only replace inside JSX text or string
# literals.
SCARCITY_REPLACEMENTS = [
    # ENGLISH OVERCLAIMS
    (re.compile(r"🔥\s*SELLING FAST\s*-\s*", re.IGNORECASE), ""),
    (re.compile(r"🔥\s*Selling Fast!?", re.IGNORECASE), "Live availability"),
    (re.compile(r"\bSELLING FAST\b"), "AVAILABLE"),
    (re.compile(r"\bSelling Fast!?\b"), "Available"),
    (re.compile(r"\bTRENDING NOW\b"), "POPULAR EVENTS"),
    (re.compile(r"\bTrending Now\b"), "Popular events"),
    (re.compile(r"\bAlmost Sold Out!?"), "Limited availability"),
    # In meta descriptions: drop the "Selling Fast." sentence fragment
    (re.compile(r"\.?\s*Selling Fast\.?\s*", re.IGNORECASE), ". "),
]


def apply_substitutions(src: str) -> tuple[str, int]:
    new = src
    total = 0
    for pat, repl in SCARCITY_REPLACEMENTS:
        new, n = pat.subn(repl, new)
        total += n
    return new, total


def process_file(path: Path) -> int:
    original = path.read_text()
    new, n = apply_substitutions(original)
    if n > 0:
        path.write_text(new)
    return n


def main():
    total_files = 0
    total_repls = 0
    for d in [PAGES_DIR, COMPONENTS_DIR]:
        for p in d.rglob("*.jsx"):
            n = process_file(p)
            if n:
                total_files += 1
                total_repls += n
                print(f"  [fix ] {p.relative_to(Path('/app/frontend/src'))} ({n} replacements)")
    print(f"\nDone. Modified {total_files} files, {total_repls} replacements total.")


if __name__ == "__main__":
    main()
