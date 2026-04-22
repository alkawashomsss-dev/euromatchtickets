"""
hub_noindex_sweep.py — Gate the 7 club-hub SEO pages behind `noIndex=true`
until they are properly wired to /api/events. The hardcoded "Upcoming
Matches" arrays with fabricated prices were the main trust risk — we keep
the pages rendering (visitors from internal links won't 404) but tell
Google not to index them until they use live data.

Strategy:
  - Find the `<SEOHead ...>` opening tag and inject `noIndex={true}`
    if it isn't already present.

Pages targeted:
  JuventusHubPage, BayernMunichHubPage, PSGHubPage, RealMadridHubPage,
  ArsenalHubPage, LiverpoolHubPage, BarcelonaHubPage, ManCityHubPage
"""

import re
import sys
from pathlib import Path

PAGES_DIR = Path("/app/frontend/src/pages")

HUB_PAGES = [
    "JuventusHubPage.jsx",
    "BayernMunichHubPage.jsx",
    "PSGHubPage.jsx",
    "RealMadridHubPage.jsx",
    "ArsenalHubPage.jsx",
    "LiverpoolHubPage.jsx",
    "BarcelonaHubPage.jsx",
    "ManCityHubPage.jsx",
]

SEOHEAD_PATTERN = re.compile(r"<SEOHead\b(?![^>]*\bnoIndex\b)([^>]*)(/>|\s*>)", re.DOTALL)


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")

    def replace(match):
        body = match.group(1)
        closer = match.group(2)
        return f"<SEOHead noIndex={{true}}{body}{closer}"

    new_text, n = SEOHEAD_PATTERN.subn(replace, text, count=1)
    if n and new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> int:
    changed = []
    for name in HUB_PAGES:
        p = PAGES_DIR / name
        if not p.exists():
            continue
        if patch_file(p):
            changed.append(name)
    print(f"[hub_noindex_sweep] Patched {len(changed)} hub pages:")
    for n in changed:
        print(f"  - {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
