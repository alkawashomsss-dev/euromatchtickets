"""Pass 2 — clean residual urgency widgets + 500K+ overclaims + viewer counters."""
import re
from pathlib import Path

PAGES = Path("/app/frontend/src/pages")
COMPS = Path("/app/frontend/src/components")

SUBS = [
    # 500K+ Tickets Sold (any case)
    (re.compile(r"500,?000\+\s*Tickets Sold", re.IGNORECASE), "Live marketplace"),
    (re.compile(r"500K\+\s*Tickets Sold", re.IGNORECASE), "Live marketplace"),

    # Live viewer counts (hardcoded N people viewing)
    (re.compile(r"\b\d+\s+people viewing (?:F1 tickets |WC tickets |this )?now\b", re.IGNORECASE), "Listings updated recently"),
    (re.compile(r"\{viewersNow\}\s*people viewing now"), "Listings updated recently"),
    (re.compile(r"\{50 \+ \(\(page\.slug \|\| ''\)\.length % 80\)\}\s*people viewing now"), "Listings updated recently"),

    # Selling Out Fast
    (re.compile(r"\bSelling Out Fast\b", re.IGNORECASE), "Live availability"),
]


def process_file(path: Path) -> int:
    if path.name == "ProductSchema.jsx":
        return 0
    src = path.read_text()
    new = src
    n = 0
    for pat, repl in SUBS:
        new, c = pat.subn(repl, new)
        n += c
    if n and new != src:
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
                print(f"  [v4b] {p.relative_to(Path('/app/frontend/src'))}  ({n})")
    print(f"\nDone. Modified {total_files} files, {total_subs} substitutions.")


if __name__ == "__main__":
    main()
