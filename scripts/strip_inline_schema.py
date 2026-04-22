"""
strip_inline_schema.py — Remove banned JSON-LD blocks (AggregateOffer,
aggregateRating, hardcoded review arrays) from src/pages/*.jsx and
src/components/*.jsx that hand-roll their own schemas.

Strategy: operate on the raw text, block-by-block. Since the JSON-LD
is inlined inside JS object literals passed to `dangerouslySetInnerHTML`,
we must carefully remove whole key/value pairs without breaking the
surrounding object.

Rules:
  1. Drop any key "aggregateRating": {...} (whole object)
  2. Drop any key "review": [...] (whole array of review rows)
  3. Replace any "@type":"AggregateOffer" with "@type":"Offer" (downgrade)
  4. Remove offerCount keys inside Offer blocks
  5. Remove reviewCount inside any ratingValue block (belt & suspenders)

We use a balanced-brace walker so we don't accidentally chomp extra text.

Idempotent.
"""

import re
import sys
from pathlib import Path

DIRS = [Path("/app/frontend/src/pages"), Path("/app/frontend/src/components")]
EXCLUDE_FILENAMES = {"ProductSchema.jsx", "StructuredData.jsx"}  # already safe


def _balanced_slice(text: str, start: int, open_ch: str, close_ch: str) -> int:
    """Return index right after the matching close. start points at open_ch."""
    depth = 0
    in_str = False
    quote = ""
    i = start
    while i < len(text):
        ch = text[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == quote:
                in_str = False
        else:
            if ch in ('"', "'", "`"):
                in_str = True
                quote = ch
            elif ch == open_ch:
                depth += 1
            elif ch == close_ch:
                depth -= 1
                if depth == 0:
                    return i + 1
        i += 1
    return -1


def strip_key_object(text: str, key: str, open_ch: str, close_ch: str) -> str:
    """Remove `"key": <balanced ...>` plus a trailing comma where present."""
    pattern = re.compile(rf'"{re.escape(key)}"\s*:\s*')
    out = text
    while True:
        m = pattern.search(out)
        if not m:
            break
        brace_start = m.end()
        # Skip any whitespace to the brace.
        while brace_start < len(out) and out[brace_start].isspace():
            brace_start += 1
        if brace_start >= len(out) or out[brace_start] != open_ch:
            # malformed — break to avoid infinite loop
            out = out[: m.start()] + "__STRIP_FAIL__" + out[m.end():]
            continue
        end = _balanced_slice(out, brace_start, open_ch, close_ch)
        if end < 0:
            out = out[: m.start()] + "__STRIP_FAIL__" + out[m.end():]
            continue
        # also gobble a trailing comma (and preceding comma if last key)
        after = end
        while after < len(out) and out[after] in " \t\r\n":
            after += 1
        before = m.start()
        # remove leading comma if we're the last entry, else trailing
        if after < len(out) and out[after] == ",":
            end = after + 1
        else:
            # strip preceding comma
            j = before - 1
            while j >= 0 and out[j] in " \t\r\n":
                j -= 1
            if j >= 0 and out[j] == ",":
                before = j
        out = out[:before] + out[end:]
    # rollback __STRIP_FAIL__ markers
    return out.replace("__STRIP_FAIL__", "")


def process_text(text: str) -> str:
    # 1. Drop aggregateRating {...}
    text = strip_key_object(text, "aggregateRating", "{", "}")
    # 2. Drop review [...] arrays
    text = strip_key_object(text, "review", "[", "]")
    # 3. Downgrade AggregateOffer → Offer inside JSON-LD string literals
    text = text.replace('"@type":"AggregateOffer"', '"@type":"Offer"')
    text = text.replace('"@type": "AggregateOffer"', '"@type": "Offer"')
    # 4. Drop offerCount inside Offer
    text = strip_key_object(text, "offerCount", '"', '"')
    # (strip_key_object with string quote doesn't fit; use regex below)
    text = re.sub(r'"offerCount"\s*:\s*"[^"]*"\s*,?', '', text)
    text = re.sub(r"'offerCount'\s*:\s*'[^']*'\s*,?", '', text)
    # 5. Drop reviewCount key if still present as loose pair
    text = re.sub(r'"reviewCount"\s*:\s*"[^"]*"\s*,?', '', text)
    # 6. Drop ratingValue fallback too (rare stray)
    text = re.sub(r'"ratingValue"\s*:\s*"[^"]*"\s*,?', '', text)
    # 7. Clean up any dangling ",," or trailing commas before } or ]
    text = re.sub(r",(\s*[}\]])", r"\1", text)
    text = re.sub(r",,+", ",", text)
    return text


def main() -> int:
    changed = []
    for d in DIRS:
        for path in sorted(d.glob("*.jsx")):
            if path.name in EXCLUDE_FILENAMES:
                continue
            src = path.read_text(encoding="utf-8")
            out = process_text(src)
            if out != src:
                path.write_text(out, encoding="utf-8")
                changed.append(str(path.relative_to(Path('/app/frontend/src'))))
    print(f"[strip_inline_schema] Updated {len(changed)} files")
    for f in changed[:80]:
        print(f"  - {f}")
    if len(changed) > 80:
        print(f"  ... +{len(changed) - 80} more")
    return 0


if __name__ == "__main__":
    sys.exit(main())
