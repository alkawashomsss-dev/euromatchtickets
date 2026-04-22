"""
repair_inline_schema.py — undo the `"offerCount"` damage from
strip_inline_schema.py.

Bug: strip_inline_schema.py called strip_key_object(key='offerCount',
open='"', close='"') which is semantically wrong (values are strings,
not objects). That emitted `__STRIP_FAIL__` which was later cleaned to
nothing, leaving dangling `"388",` orphan quoted values inside Offer /
AggregateOffer JSON-LD literals.

This repair script walks every `*.jsx` and fixes the pattern:
    "@type": "Offer", "<digits>",
    "@type":"Offer", "<digits>",
    { ... , "<digits>", "<next_key>": ...
It removes every orphaned `"<digits-or-number>",` or `"<alnum>",` that is
NOT a key-value pair (i.e. immediately followed by another `"` key).

Rule: inside a JSON-LD-ish context line, an entry like `"<something>",`
that is NOT followed by `:` within a small window is considered
orphan and removed.

Idempotent; safe against files already clean.
"""

import re
import sys
from pathlib import Path

DIRS = [Path("/app/frontend/src/pages"), Path("/app/frontend/src/components")]

# Orphan: a quoted string token sandwiched between two `,` (or between `,` and `}`),
# WITHOUT a colon immediately after it. The preceding char is `,` (possibly with
# whitespace). The following char is `,` or `}` (possibly with whitespace).
ORPHAN_RE = re.compile(
    r',\s*"[^"]*"\s*(?=,\s*"[^"]*"\s*:)'  # looking at `,"VAL",` followed by `"key":`
)

# Simpler: remove `"number",` that precedes another key. Only inside an object.
# We'll make multiple passes until stable.
PATTERN = re.compile(r'(,|\{)\s*"[^":]*"\s*,\s*(?="[^"]+"\s*:)')


def repair_file(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    out = text
    # Loop until stable (handles multiple orphans per line)
    for _ in range(6):
        new = PATTERN.sub(lambda m: m.group(1), out)
        if new == out:
            break
        out = new
    if out != text:
        path.write_text(out, encoding="utf-8")
        return 1
    return 0


def main() -> int:
    changed = 0
    for d in DIRS:
        for p in sorted(d.glob("*.jsx")):
            changed += repair_file(p)
    print(f"[repair_inline_schema] Repaired {changed} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
