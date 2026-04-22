import { Shield, AlertTriangle, CreditCard, Mail, Phone, MapPin } from "lucide-react";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#0e0e14] pt-32 pb-16">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Terms & Conditions", url: "https://euromatchtickets.com/terms" }]} />
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Important Disclosure - Required for Google Ads */}
        <div className="bg-amber-500/10 border border-amber-200 rounded-none p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-amber-600 mb-2">Important Disclosure</h2>
              <p className="text-amber-200/90 leading-relaxed">
                <strong>EuroMatchTickets is an independent ticket resale marketplace.</strong> We are NOT the 
                primary ticket seller, box office, or venue. We are NOT affiliated with any team, artist, 
                venue, or event organizer. Ticket prices on our platform are set by individual sellers and 
                may be <strong>above or below the original face value</strong>.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-slate-400">
          
          {/* About Us */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-violet-600" />
              About EuroMatchTickets
            </h2>
            <p className="leading-relaxed mb-4">
              EuroMatchTickets operates as a secondary ticket marketplace, connecting buyers with sellers 
              who have tickets to sell. We provide a platform for ticket resale transactions but do not 
              own or control the inventory of tickets listed on our site.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-500">
              <li>We are an independent resale marketplace</li>
              <li>We are not the primary ticket provider or box office</li>
              <li>Prices are set by sellers and may differ from face value</li>
              <li>We do not guarantee ticket availability until purchase is confirmed</li>
            </ul>
          </section>

          {/* Pricing Transparency */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              Pricing Transparency
            </h2>
            <p className="leading-relaxed mb-4">
              All ticket prices displayed on EuroMatchTickets are set by individual sellers. These prices may be:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#1e1e1e] border border-white/5 rounded-none p-4">
                <h3 className="font-semibold text-emerald-600 mb-2">Above Face Value</h3>
                <p className="text-sm text-slate-500">
                  For high-demand events, tickets may be priced higher than the original purchase price.
                </p>
              </div>
              <div className="bg-[#1e1e1e] border border-white/5 rounded-none p-4">
                <h3 className="font-semibold text-blue-600 mb-2">Below Face Value</h3>
                <p className="text-sm text-slate-500">
                  Some sellers may list tickets below face value for various reasons.
                </p>
              </div>
            </div>
            <p className="leading-relaxed">
              <strong>Price Breakdown:</strong> Before completing your purchase, you will see a full breakdown 
              of all costs including the ticket price, any applicable service fees, and the total amount due.
            </p>
          </section>

          {/* Buyer Protection */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Buyer protection</h2>
            <p className="leading-relaxed mb-4">
              Every purchase on EuroMatchTickets is protected by our Buyer protection:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span><strong>Valid Tickets:</strong> Your tickets will be valid for entry to the event</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span><strong>On-Time Delivery:</strong> Tickets will be delivered before the event</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span><strong>Full Refund:</strong> If the event is cancelled and not rescheduled</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span><strong>Customer Support:</strong> 24/7 assistance for any issues</span>
              </li>
            </ul>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Policy</h2>
            <p className="leading-relaxed mb-4">
              Due to the nature of ticket resale, all sales are generally final. However, refunds may be 
              issued in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-500">
              <li>Event is cancelled and not rescheduled</li>
              <li>Tickets are not delivered as described</li>
              <li>Tickets are invalid or do not grant entry</li>
              <li>Significant changes to event date, time, or venue</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-[#1e1e1e] border border-white/5 rounded-none p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-600" />
                <span>support@euromatchtickets.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-600" />
                <span>+49 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-violet-600" />
                <span>Berlin, Germany</span>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <p className="text-sm text-slate-400 text-center pt-8">
            Last updated: March 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
