import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Terms & Conditions | EuroMatchTickets</title>
        <meta name="description" content="Read EuroMatchTickets terms and conditions for buying and selling tickets on our marketplace." />
        <meta name="keywords" content="terms conditions, ticket marketplace rules, euromatchtickets terms" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        <p className="text-zinc-400 mb-8">Last updated: February 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-zinc-400 leading-relaxed">
              Welcome to EuroMatchTickets. These Terms and Conditions govern your use of our website and services. 
              By accessing or using EuroMatchTickets, you agree to be bound by these terms. EuroMatchTickets operates as a 
              marketplace connecting ticket buyers with sellers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li><strong className="text-white">Platform:</strong> The EuroMatchTickets website and mobile applications</li>
              <li><strong className="text-white">User:</strong> Any person accessing or using the Platform</li>
              <li><strong className="text-white">Buyer:</strong> A User purchasing tickets through the Platform</li>
              <li><strong className="text-white">Seller:</strong> A User listing tickets for sale on the Platform</li>
              <li><strong className="text-white">Ticket:</strong> An entry pass to an event listed on the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              To use certain features of EuroMatchTickets, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 18 years old or have parental consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Buying Tickets</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              When you purchase tickets through EuroMatchTickets:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>You are purchasing from third-party sellers, not EuroMatchTickets directly</li>
              <li>Prices may be above or below face value</li>
              <li>A 10% service fee is added to all purchases</li>
              <li>Tickets are delivered digitally via QR code</li>
              <li>All sales are final unless covered by our Buyer Guarantee</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Selling Tickets</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              As a seller on EuroMatchTickets, you agree to:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Only list tickets you legally own or are authorized to sell</li>
              <li>Provide accurate information about seat locations and restrictions</li>
              <li>Deliver valid tickets within the specified timeframe</li>
              <li>Accept our 10% commission on completed sales</li>
              <li>Comply with all applicable laws regarding ticket resale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. EuroMatchTickets Guarantee</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Our Buyer Guarantee protects you when:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>Tickets are not delivered before the event</li>
              <li>Tickets are invalid or counterfeit</li>
              <li>The event is cancelled without rescheduling</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              In such cases, you are entitled to a full refund of your purchase price including fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Prohibited Activities</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              You may not use EuroMatchTickets to:
            </p>
            <ul className="list-disc pl-6 text-zinc-400 space-y-2">
              <li>List fraudulent, stolen, or counterfeit tickets</li>
              <li>Manipulate prices or engage in market manipulation</li>
              <li>Use bots or automated tools to purchase tickets</li>
              <li>Circumvent any security measures</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Fees and Payments</h2>
            <p className="text-zinc-400 leading-relaxed">
              EuroMatchTickets charges a 10% service fee on all transactions. This fee covers payment processing, 
              platform maintenance, customer support, and our Buyer Guarantee. Payments are processed 
              securely through Stripe. Sellers receive payment after the event has taken place and 
              tickets have been confirmed as valid.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <p className="text-zinc-400 leading-relaxed">
              EuroMatchTickets acts as a marketplace facilitator and is not responsible for the actions of buyers 
              or sellers. Our liability is limited to the amount of fees paid to us. We are not liable 
              for event cancellations, venue changes, or any indirect damages arising from your use of 
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-zinc-400 leading-relaxed">
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@euromatchtickets.com" className="text-purple-400 hover:underline">
                legal@euromatchtickets.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
