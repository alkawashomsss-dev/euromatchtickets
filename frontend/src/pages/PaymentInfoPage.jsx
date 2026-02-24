import { Helmet } from 'react-helmet-async';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle, RefreshCw, Globe, Banknote } from 'lucide-react';

const PaymentInfoPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>Payment Information | EuroMatchTickets - Secure Payments</title>
        <meta name="description" content="Learn about secure payment methods at EuroMatchTickets. We accept all major credit cards, Apple Pay, Google Pay. 100% secure with Stripe." />
        <meta name="keywords" content="payment methods, secure payment, credit card, apple pay, google pay, stripe, euromatchtickets" />
      </Helmet>

      {/* Header */}
      <section className="py-16 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Information</h1>
          <p className="text-xl text-zinc-400">
            Secure, fast, and flexible payment options
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Security Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-400">Bank-Level Security</h2>
              <p className="text-zinc-400">All payments are processed securely through Stripe with 256-bit SSL encryption.</p>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Accepted Payment Methods</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Credit & Debit Cards</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Visa', 'Mastercard', 'American Express', 'Maestro'].map((card) => (
                  <span key={card} className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                    {card}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Digital Wallets</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Apple Pay', 'Google Pay', 'Link by Stripe'].map((wallet) => (
                  <span key={wallet} className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                    {wallet}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Banknote className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-semibold">Bank Transfers</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['SEPA', 'iDEAL', 'Bancontact', 'Giropay', 'SOFORT'].map((method) => (
                  <span key={method} className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-semibold">Buy Now, Pay Later</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Klarna', 'Afterpay'].map((bnpl) => (
                  <span key={bnpl} className="px-3 py-1 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                    {bnpl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Currencies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Supported Currencies</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 mb-4">
              We display prices in EUR (Euro) but accept payments in multiple currencies:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
                { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
                { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
                { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
                { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
                { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
                { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
                { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' }
              ].map((currency) => (
                <span key={currency.code} className="px-4 py-2 bg-zinc-800 rounded-lg text-sm">
                  {currency.flag} {currency.code}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How Payment Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Payment Works</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Select Your Tickets", desc: "Choose your event and seats from our verified sellers." },
              { step: 2, title: "Secure Checkout", desc: "Enter your payment details on our secure Stripe-powered checkout." },
              { step: 3, title: "Instant Confirmation", desc: "Receive immediate order confirmation and digital ticket via email." },
              { step: 4, title: "Attend Event", desc: "Show your QR code at the venue entrance. That's it!" }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fees */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Fees & Charges</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-zinc-400">Ticket Price</span>
                <span className="font-semibold">As Listed</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-zinc-400">Service Fee</span>
                <span className="font-semibold">10% of ticket price</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                <span className="text-zinc-400">Payment Processing</span>
                <span className="text-emerald-400 font-semibold">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Delivery Fee</span>
                <span className="text-emerald-400 font-semibold">Free (Digital)</span>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-4">
              * Final price shown at checkout includes all fees. No hidden charges.
            </p>
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Security Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Lock, title: "256-bit SSL Encryption", desc: "All data transmitted is encrypted using bank-level security." },
              { icon: Shield, title: "PCI DSS Compliant", desc: "We meet the highest standards for payment card security." },
              { icon: CheckCircle, title: "Fraud Detection", desc: "Advanced AI systems detect and prevent fraudulent transactions." },
              { icon: RefreshCw, title: "3D Secure", desc: "Additional verification layer for card payments." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <feature.icon className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Payment FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "When will I be charged?", a: "You're charged immediately when you confirm your purchase. The ticket is delivered instantly after payment." },
              { q: "Is my payment information stored?", a: "No. We never store your card details. All payments are processed securely by Stripe." },
              { q: "What if my payment fails?", a: "If your payment fails, the order will be cancelled and you won't be charged. Please try again with a different payment method." },
              { q: "Can I get a refund?", a: "Refunds are available under our Buyer Guarantee if tickets are invalid, not delivered, or the event is cancelled. See our Refund Policy for details." },
              { q: "Do you charge in my local currency?", a: "Prices are displayed in EUR, but your bank will convert to your local currency at their exchange rate." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-400" />
                  {faq.q}
                </h3>
                <p className="text-zinc-400 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Powered by Stripe */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 text-sm">Payments securely processed by</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl font-bold text-purple-400">Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoPage;
