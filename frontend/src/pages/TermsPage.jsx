import { Helmet } from 'react-helmet-async';
import { Shield, AlertTriangle, Scale, FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Terms & Conditions | EuroMatchTickets - Legal Agreement</title>
        <meta name="description" content="Read EuroMatchTickets terms and conditions. Legal agreement for buying and selling tickets on Europe's trusted ticket marketplace." />
        <meta name="keywords" content="terms conditions, ticket marketplace rules, euromatchtickets terms, legal agreement, buyer protection terms" />
      </Helmet>

      {/* Header */}
      <section className="py-12 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Scale className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-zinc-400">Legal Agreement for EuroMatchTickets Services</p>
          <p className="text-zinc-500 text-sm mt-2">Last updated: February 2026 | Effective immediately</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Important Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-400 mb-2">Important Legal Notice</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                By using EuroMatchTickets, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms and Conditions. If you do not agree, please do not use our services. These terms constitute a legally 
                binding agreement between you and EuroMatchTickets.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-10">
          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">1</span>
              Nature of Service & Legal Status
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">1.1 Marketplace Platform:</strong> EuroMatchTickets operates exclusively as an 
                intermediary marketplace platform that connects ticket buyers with ticket sellers. We do not own, possess, or 
                have control over the tickets listed on our platform. We are not the primary seller of tickets and do not 
                guarantee the face value of any tickets.
              </p>
              <p>
                <strong className="text-white">1.2 Secondary Market:</strong> All tickets sold through EuroMatchTickets are 
                resale tickets being sold by third-party sellers. Prices may be higher or lower than the original face value 
                of the ticket. By using our service, you acknowledge and accept this.
              </p>
              <p>
                <strong className="text-white">1.3 No Affiliation:</strong> EuroMatchTickets is not affiliated with, endorsed by, 
                or officially connected to FIFA, UEFA, any national football association, sports club, concert promoter, artist, 
                venue, or event organizer. All trademarks, logos, and brand names are the property of their respective owners.
              </p>
              <p>
                <strong className="text-white">1.4 German Law:</strong> EuroMatchTickets operates under the laws of the Federal 
                Republic of Germany. Our registered office is in Munich, Germany. Any disputes shall be subject to the exclusive 
                jurisdiction of the courts of Munich, Germany.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">2</span>
              Buyer Terms & Conditions
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">2.1 Purchase Agreement:</strong> When you purchase tickets through EuroMatchTickets, 
                you enter into a binding purchase agreement. All sales are final once payment is confirmed, subject to our 
                Buyer Protection Guarantee.
              </p>
              <p>
                <strong className="text-white">2.2 Pricing:</strong> All prices displayed include our service fee (10% of ticket 
                price). You will see the total price before confirming your purchase. We do not add hidden fees after checkout.
              </p>
              <p>
                <strong className="text-white">2.3 Ticket Delivery:</strong> Digital tickets (QR codes) are delivered instantly 
                via email. Physical tickets, where applicable, are shipped according to the delivery timeframe specified. Delivery 
                is subject to seller fulfillment.
              </p>
              <p>
                <strong className="text-white">2.4 Buyer Responsibilities:</strong> You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing accurate contact and delivery information</li>
                <li>Checking event details (date, time, venue) before purchase</li>
                <li>Arriving at the venue with valid identification if required</li>
                <li>Complying with venue rules and regulations</li>
                <li>Not reselling tickets in violation of event organizer policies</li>
              </ul>
              <p>
                <strong className="text-white">2.5 Age Restriction:</strong> You must be at least 18 years old to make a purchase, 
                or have the consent of a parent or legal guardian.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm">3</span>
              Buyer Protection Guarantee
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">3.1 Guarantee Coverage:</strong> Our Buyer Protection Guarantee covers you in the 
                following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-emerald-400">Invalid Tickets:</strong> If tickets are found to be invalid or counterfeit at the venue</li>
                <li><strong className="text-emerald-400">Non-Delivery:</strong> If tickets are not delivered before the event</li>
                <li><strong className="text-emerald-400">Event Cancellation:</strong> If the event is cancelled without a rescheduled date</li>
                <li><strong className="text-emerald-400">Wrong Tickets:</strong> If tickets received differ significantly from the listing</li>
              </ul>
              <p>
                <strong className="text-white">3.2 Refund Process:</strong> To claim a refund, contact support@euromatchtickets.com 
                within 48 hours of the issue occurring with evidence (photos, venue confirmation). Refunds are processed within 
                5-10 business days to your original payment method.
              </p>
              <p>
                <strong className="text-white">3.3 Exclusions:</strong> The guarantee does NOT cover:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind or inability to attend</li>
                <li>Rescheduled events (original tickets remain valid)</li>
                <li>Issues caused by your own actions (e.g., arriving late, losing tickets)</li>
                <li>Venue-specific restrictions you failed to meet (age, ID requirements)</li>
                <li>Weather-related event modifications</li>
              </ul>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">4</span>
              Seller Terms & Conditions
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">4.1 Seller Requirements:</strong> To sell tickets on EuroMatchTickets, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Own valid tickets that you have the legal right to sell</li>
                <li>Provide accurate ticket information (section, row, seat, etc.)</li>
                <li>Deliver tickets as described within the specified timeframe</li>
                <li>Not list tickets that have been reported lost or stolen</li>
              </ul>
              <p>
                <strong className="text-white">4.2 Commission:</strong> EuroMatchTickets charges a 10% commission on each successful 
                sale. This is deducted from your payout automatically.
              </p>
              <p>
                <strong className="text-white">4.3 Seller Liability:</strong> Sellers are solely responsible for the validity and 
                authenticity of tickets listed. If a buyer claims are upheld and tickets are found to be invalid, the full refund 
                amount plus any additional costs will be recovered from the seller.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-sm">5</span>
              Limitation of Liability
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">5.1 Platform Liability:</strong> To the maximum extent permitted by German law, 
                EuroMatchTickets's total liability for any claim arising from or related to these Terms shall not exceed the 
                amount you paid for the specific ticket(s) in question.
              </p>
              <p>
                <strong className="text-white">5.2 No Consequential Damages:</strong> We shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to loss of profits, travel 
                expenses, accommodation costs, or emotional distress, regardless of whether we were advised of the possibility 
                of such damages.
              </p>
              <p>
                <strong className="text-white">5.3 Third-Party Actions:</strong> We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Actions or omissions of sellers, buyers, event organizers, or venues</li>
                <li>Event cancellations, postponements, or changes by event organizers</li>
                <li>Venue policies, security decisions, or entry denials</li>
                <li>Acts of God, terrorism, pandemics, or government actions</li>
              </ul>
              <p>
                <strong className="text-white">5.4 Service Availability:</strong> We do not guarantee uninterrupted access to our 
                platform. We may suspend or terminate services for maintenance, security, or legal reasons without prior notice.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">6</span>
              Intellectual Property & Content
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">6.1 Platform Content:</strong> All content on EuroMatchTickets, including text, 
                graphics, logos, and software, is our property or licensed to us and is protected by copyright, trademark, and 
                other intellectual property laws.
              </p>
              <p>
                <strong className="text-white">6.2 Third-Party Trademarks:</strong> Event names, team names, artist names, venue 
                names, and associated logos are trademarks of their respective owners. Their use on our platform is for 
                identification purposes only and does not imply endorsement.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">7</span>
              Dispute Resolution
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">7.1 Governing Law:</strong> These Terms are governed by the laws of the Federal 
                Republic of Germany, without regard to conflict of law principles.
              </p>
              <p>
                <strong className="text-white">7.2 Jurisdiction:</strong> Any disputes shall be subject to the exclusive jurisdiction 
                of the courts of Munich, Germany.
              </p>
              <p>
                <strong className="text-white">7.3 EU Dispute Resolution:</strong> The European Commission provides an online dispute 
                resolution platform at: <a href="https://ec.europa.eu/consumers/odr/" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>
              </p>
              <p>
                <strong className="text-white">7.4 Informal Resolution:</strong> Before initiating formal proceedings, we encourage 
                you to contact us at support@euromatchtickets.com to resolve disputes informally.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">8</span>
              Changes to Terms
            </h2>
            <div className="text-zinc-400 leading-relaxed space-y-4">
              <p>
                <strong className="text-white">8.1 Modifications:</strong> We reserve the right to modify these Terms at any time. 
                Changes will be effective immediately upon posting to our website. Your continued use of our services after changes 
                are posted constitutes acceptance of the modified Terms.
              </p>
              <p>
                <strong className="text-white">8.2 Notification:</strong> For material changes, we will make reasonable efforts to 
                notify users via email or prominent notice on our website.
              </p>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="text-zinc-400 leading-relaxed">
              <p>For questions about these Terms, contact us at:</p>
              <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg">
                <p><strong className="text-white">EuroMatchTickets</strong></p>
                <p>Alex Heimbeck</p>
                <p>Erzgießereistraße 15</p>
                <p>80335 München, Germany</p>
                <p className="mt-2">Email: <a href="mailto:support@euromatchtickets.com" className="text-purple-400">support@euromatchtickets.com</a></p>
              </div>
            </div>
          </section>
        </div>

        {/* Acceptance Statement */}
        <div className="mt-12 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
          <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-zinc-300 leading-relaxed">
            By using EuroMatchTickets, you confirm that you have read, understood, and agree to these Terms & Conditions. 
            If you do not agree to any part of these terms, you must not use our services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
