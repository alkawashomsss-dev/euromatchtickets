import { Shield, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { SEOHead } from "../components/SEOHead";

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Refund Policy"
        description="Learn about FanPass refund policy and buyer protection. We guarantee your purchase with our comprehensive refund policy."
        keywords="refund policy, ticket refund, buyer protection, money back guarantee"
      />

      {/* Header */}
      <section className="py-16 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl text-zinc-400">
            Your purchase is protected by the FanPass Guarantee
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* FanPass Guarantee */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              The FanPass Guarantee
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed mb-6">
              Every ticket purchase on FanPass is protected. If something goes wrong, 
              we've got you covered with a full refund.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold">100% Money Back</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="font-semibold">Fast Processing</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="font-semibold">No Questions Asked</p>
              </div>
            </div>
          </div>
        </section>

        {/* When You're Covered */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            When You're Covered
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Tickets Not Delivered",
                desc: "If you don't receive your tickets before the event, you'll get a full refund."
              },
              {
                title: "Invalid or Counterfeit Tickets",
                desc: "If your tickets are rejected at the venue because they're invalid, we'll refund you in full."
              },
              {
                title: "Event Cancelled",
                desc: "If the event is cancelled and not rescheduled, you're entitled to a full refund."
              },
              {
                title: "Wrong Tickets Delivered",
                desc: "If you receive tickets for the wrong event, date, or seats, we'll make it right."
              },
              {
                title: "Duplicate Tickets",
                desc: "If the same tickets were sold to multiple buyers, the affected buyers will be refunded."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* When You're Not Covered */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            When Refunds Don't Apply
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Change of Mind",
                desc: "If you simply decide you no longer want to attend, refunds are not available as all sales are final."
              },
              {
                title: "Event Postponed",
                desc: "If the event is rescheduled to a new date, your tickets remain valid for the new date. No refund is offered."
              },
              {
                title: "Venue or Lineup Changes",
                desc: "Changes to the event venue or performer lineup don't qualify for refunds if the event still proceeds."
              },
              {
                title: "Personal Circumstances",
                desc: "Inability to attend due to personal reasons (illness, travel issues) is not covered."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Request */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How to Request a Refund</h2>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold">Contact Support</h3>
                  <p className="text-zinc-400">Email us at support@fanpass.com with your order number and details of the issue.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold">Provide Evidence</h3>
                  <p className="text-zinc-400">Include any relevant documentation such as venue rejection notices or screenshots.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold">Review Process</h3>
                  <p className="text-zinc-400">Our team will review your request within 2-3 business days.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">4</span>
                <div>
                  <h3 className="font-semibold">Receive Refund</h3>
                  <p className="text-zinc-400">Approved refunds are processed to your original payment method within 5-10 business days.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Important Notes
            </h3>
            <ul className="text-zinc-400 space-y-2">
              <li>• Refund requests must be submitted within 7 days of the event date</li>
              <li>• Service fees may be non-refundable in certain circumstances</li>
              <li>• Refunds are processed to the original payment method only</li>
              <li>• We reserve the right to deny refund requests that appear fraudulent</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 text-center">
          <p className="text-zinc-400 mb-4">
            Have questions about our refund policy?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Contact Support
          </a>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
