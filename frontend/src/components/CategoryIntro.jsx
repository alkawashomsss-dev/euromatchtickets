import { ChevronDown } from "lucide-react";

/**
 * CategoryIntro — editorial intro block + FAQ for thin category pages
 * (F1 schedule, MotoGP schedule, concerts-in-xyz, etc). Lifts them from
 * "list-only thin content" into indexable editorial with structured data.
 *
 * Props:
 *   title      — H2 label, e.g. "About the F1 2026 season"
 *   paragraphs — 1–3 short paragraphs (120–180 words total)
 *   faqs       — array of {q,a} for expandable FAQ section
 *
 * Emits a compact FAQPage JSON-LD automatically when faqs are provided.
 */
export default function CategoryIntro({ title, paragraphs = [], faqs = [] }) {
  return (
    <section className="py-12 bg-[#15151e]" data-testid="category-intro">
      <div className="max-w-4xl mx-auto px-4">
        {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
        {paragraphs.length > 0 && (
          <div className="space-y-3 text-slate-400 text-[15px] leading-relaxed mb-8">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
        {faqs.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-white mb-3">Frequently asked questions</h3>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <details key={i} className="group bg-[#1e1e1e] border border-white/10">
                  <summary className="p-4 font-bold text-white cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
