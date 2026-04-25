"""
NUKE all Product / Offer / AggregateOffer JSON-LD across the frontend.

Per user mandate (Apr 2026):
- Keep: Event/SportsEvent schema, FAQ schema, Breadcrumb schema, Organization schema.
- Remove: ANY <script type="application/ld+json"> object whose top-level "@type" is
  "Product" (these were the source of Google "price required" / "availability missing"
  validation errors on a resale marketplace).
- Remove: <ProductSchema ... /> JSX usages (and their imports).
- Remove: AggregateOffer / Offer blocks that live INSIDE Product schemas (transitive).

We DO NOT touch:
- StructuredData.jsx Event helpers
- BreadcrumbStructuredData / FAQStructuredData / OrganizationStructuredData
- server.py SSR Event schema injection (already correct)
"""
import re
from pathlib import Path

PAGES_DIR = Path("/app/frontend/src/pages")
COMPONENTS_DIR = Path("/app/frontend/src/components")


def strip_product_schema_blocks(src: str) -> tuple[str, int]:
    """Remove `const <name> = { ... "@type": "Product" ... };` blocks and their
    matching <script type="application/ld+json" ... JSON.stringify(<name>) ... /> tags.
    """
    removed = 0
    out = src

    # 1. Find candidate const declarations whose object literal contains "@type": "Product"
    const_pattern = re.compile(
        r'\n\s*const\s+(\w+)\s*=\s*\{',
        re.MULTILINE,
    )

    targets = []
    for m in const_pattern.finditer(out):
        var_name = m.group(1)
        # Walk braces to find the matching closing brace
        i = m.end() - 1  # at '{'
        depth = 0
        end = -1
        in_str = False
        str_ch = ""
        while i < len(out):
            c = out[i]
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
        body = out[m.end() - 1: end + 1]
        if '"@type": "Product"' in body or '"@type":"Product"' in body:
            # also consume trailing semicolon + newline
            after = end + 1
            if after < len(out) and out[after] == ";":
                after += 1
            # consume one trailing newline
            if after < len(out) and out[after] == "\n":
                after += 1
            targets.append((m.start(), after, var_name))

    # Remove from end → start to keep indices valid
    for start, after, var_name in reversed(targets):
        out = out[:start] + "\n" + out[after:]
        removed += 1

        # Remove matching <script type="application/ld+json" ... {var_name} ... /> tag
        script_pat = re.compile(
            r"\n?\s*<script\s+type=\"application/ld\+json\"[^>]*JSON\.stringify\(\s*"
            + re.escape(var_name)
            + r"\s*\)[^>]*?/>\s*",
            re.DOTALL,
        )
        out, n = script_pat.subn("\n", out)

    return out, removed


def strip_inline_product_scripts(src: str) -> tuple[str, int]:
    """Remove <script type="application/ld+json"> ...inline JSON literal containing Product... </script>"""
    pattern = re.compile(
        r'<script\s+type="application/ld\+json"[^>]*>[^<]*?"@type"\s*:\s*"Product"[^<]*?</script>\s*',
        re.DOTALL,
    )
    new, n = pattern.subn("", src)
    return new, n


def strip_productschema_jsx(src: str) -> tuple[str, int]:
    """Remove <ProductSchema ... /> JSX (self-closing) and import statements.

    URLs in props contain '/', so we cannot use a [^/] exclusion. Instead we
    walk character-by-character respecting JSX string boundaries.
    """
    out = src
    removed = 0
    while True:
        idx = out.find("<ProductSchema")
        if idx == -1:
            break
        # Walk until self-closing '/>' at top level (no nested tags expected here)
        i = idx + len("<ProductSchema")
        in_str = False
        str_ch = ""
        in_brace = 0
        end = -1
        while i < len(out) - 1:
            c = out[i]
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
                    in_brace += 1
                elif c == "}":
                    in_brace -= 1
                elif in_brace == 0 and c == "/" and i + 1 < len(out) and out[i + 1] == ">":
                    end = i + 2
                    break
            i += 1
        if end == -1:
            break  # malformed, bail
        # Trim trailing whitespace/newlines on the same logical line
        out = out[:idx].rstrip(" \t") + out[end:]
        removed += 1

    # Remove paired form (rare): <ProductSchema ...></ProductSchema>
    jsx_pair = re.compile(r"\s*<ProductSchema\b[^>]*>\s*</ProductSchema>\s*", re.DOTALL)
    out, n2 = jsx_pair.subn("\n", out)

    # Remove imports
    imp_pat = re.compile(r"^\s*import\s+ProductSchema\s+from\s+[\"'][^\"']+[\"'];\s*\n", re.MULTILINE)
    out, n3 = imp_pat.subn("", out)

    return out, removed + n2 + n3


def strip_aggregateoffer_in_event(src: str) -> tuple[str, int]:
    """Defensive: if any code still has @type: AggregateOffer at root, strip the surrounding script.
    (Most are now caught by Product removal already.)"""
    pattern = re.compile(
        r'<script\s+type="application/ld\+json"[^>]*>[^<]*?"@type"\s*:\s*"AggregateOffer"[^<]*?</script>\s*',
        re.DOTALL,
    )
    new, n = pattern.subn("", src)
    return new, n


def strip_offers_field(src: str) -> tuple[str, int]:
    """Remove the WHOLE `"offers": { ... }` field (and trailing comma) from any
    JSON-LD JS object literal. This handles Offer, AggregateOffer, and arrays.

    Walks braces respecting strings.
    """
    out = src
    removed = 0
    i = 0
    while True:
        idx = out.find('"offers"', i)
        if idx == -1:
            break
        # Find ':' after "offers"
        j = idx + len('"offers"')
        while j < len(out) and out[j] in " \t\n":
            j += 1
        if j >= len(out) or out[j] != ":":
            i = idx + 1
            continue
        j += 1
        while j < len(out) and out[j] in " \t\n":
            j += 1
        if j >= len(out):
            break
        opener = out[j]
        if opener not in ("{", "["):
            i = idx + 1
            continue
        close_ch = "}" if opener == "{" else "]"
        # Walk to matching close
        depth = 0
        k = j
        in_str = False
        str_ch = ""
        end_val = -1
        while k < len(out):
            c = out[k]
            if in_str:
                if c == "\\":
                    k += 2
                    continue
                if c == str_ch:
                    in_str = False
            else:
                if c in ('"', "'", "`"):
                    in_str = True
                    str_ch = c
                elif c == opener:
                    depth += 1
                elif c == close_ch:
                    depth -= 1
                    if depth == 0:
                        end_val = k + 1
                        break
            k += 1
        if end_val == -1:
            break  # malformed
        # Consume trailing comma + whitespace
        end_full = end_val
        while end_full < len(out) and out[end_full] in " \t":
            end_full += 1
        if end_full < len(out) and out[end_full] == ",":
            end_full += 1
        # Also consume preceding comma+whitespace if previous non-ws char is comma
        start_full = idx
        # Walk back over whitespace
        p = idx - 1
        while p >= 0 and out[p] in " \t":
            p -= 1
        if p >= 0 and out[p] == ",":
            # Remove the comma too
            start_full = p
        # If line becomes empty after removal, also drop the line break
        # (We just collapse extra newlines to keep formatting tidy.)
        out = out[:start_full] + out[end_full:]
        removed += 1
        i = start_full
    return out, removed


def process_file(path: Path) -> dict:
    original = path.read_text()
    content = original
    stats = {"product_const": 0, "inline_script": 0, "jsx": 0, "agg_offer": 0, "offers_field": 0}

    content, stats["product_const"] = strip_product_schema_blocks(content)
    content, stats["inline_script"] = strip_inline_product_scripts(content)
    content, stats["jsx"] = strip_productschema_jsx(content)
    content, stats["agg_offer"] = strip_aggregateoffer_in_event(content)
    content, stats["offers_field"] = strip_offers_field(content)

    if content != original:
        path.write_text(content)
        stats["modified"] = True
    else:
        stats["modified"] = False
    return stats


def main():
    total = {"files": 0, "modified": 0, "product_const": 0, "inline_script": 0, "jsx": 0, "agg_offer": 0}
    # Sweep ALL .jsx files in pages/ and components/, not just the listed targets,
    # to catch any future strays.
    for d in [PAGES_DIR, COMPONENTS_DIR]:
        for p in d.rglob("*.jsx"):
            # Skip ProductSchema.jsx itself; we'll delete it separately.
            if p.name == "ProductSchema.jsx":
                continue
            total["files"] += 1
            s = process_file(p)
            if s["modified"]:
                total["modified"] += 1
                total["product_const"] += s["product_const"]
                total["inline_script"] += s["inline_script"]
                total["jsx"] += s["jsx"]
                total["agg_offer"] += s["agg_offer"]
                print(
                    f"  [fix ] {p.relative_to(Path('/app/frontend/src'))}  "
                    f"const={s['product_const']} script={s['inline_script']} jsx={s['jsx']} agg={s['agg_offer']}"
                )
    print(
        f"\nScanned {total['files']} files. Modified {total['modified']}.  "
        f"Removed: product_consts={total['product_const']} inline_scripts={total['inline_script']} "
        f"<ProductSchema/>={total['jsx']} AggregateOffer_scripts={total['agg_offer']}"
    )


if __name__ == "__main__":
    main()
