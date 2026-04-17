import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const EventFAQ = ({ faqs, title = "Frequently Asked Questions" }) => {
  const [open, setOpen] = useState(null);
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-14 bg-[#15151e]" data-testid="event-faq">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 bg-[#1e1e1e]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
                data-testid={`faq-item-${i}`}
              >
                <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-slate-400 text-sm leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQSchemaScript = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

export default EventFAQ;
